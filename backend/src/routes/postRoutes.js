import express from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 1. Get all community posts
router.get('/', async (req, res) => {
  try {
    const { communityType, communityTarget, search } = req.query;

    const where = {};
    if (communityType && communityType !== 'All') {
      where.communityType = communityType.toUpperCase();
    }
    if (communityTarget && communityTarget !== 'All') {
      where.communityTarget = communityTarget;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
        },
        reactions: true,
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({
      success: true,
      count: posts.length,
      posts: posts.map((p) => ({
        _id: p.id,
        id: p.id,
        title: p.title,
        content: p.content,
        tags: p.tags ? JSON.parse(p.tags) : [],
        mediaType: p.mediaType || 'TEXT',
        mediaUrl: p.mediaUrl,
        attachmentName: p.attachmentName,
        attachmentUrl: p.attachmentUrl,
        imageUrl: p.imageUrl,
        viewsCount: p.viewsCount || 0,
        sharesCount: p.sharesCount || 0,
        communityType: p.communityType,
        communityTarget: p.communityTarget,
        author: {
          userId: p.authorId,
          name: p.authorName,
          role: p.authorRole.toLowerCase(),
          avatar: p.authorAvatar,
          department: p.authorDepartment,
          batch: p.authorBatch,
          studentId: p.authorStudentId,
        },
        likes: p.reactions.map((r) => ({ userId: r.userId })),
        comments: p.comments.map((c) => ({
          _id: c.id,
          id: c.id,
          authorId: c.authorId,
          authorName: c.authorName,
          authorRole: c.authorRole.toLowerCase(),
          authorAvatar: c.authorAvatar,
          content: c.content,
          createdAt: c.createdAt,
        })),
        createdAt: p.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Create Post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      content,
      communityType = 'CAMPUS',
      communityTarget = 'General Campus',
      tags,
      imageUrl,
      mediaType = 'TEXT',
      mediaUrl,
      attachmentName,
      attachmentUrl,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Post title and content are required.' });
    }

    const commKey = (communityType || 'CAMPUS').toUpperCase();
    const mediaKey = (mediaType || 'TEXT').toUpperCase();

    const VALID_COMMUNITIES = ['CAMPUS', 'DEPARTMENT', 'COURSE', 'CLUB', 'BATCH'];
    const VALID_MEDIA = ['TEXT', 'IMAGE', 'VIDEO', 'REEL', 'NOTE'];
    const safeCommunity = VALID_COMMUNITIES.includes(commKey) ? commKey : 'CAMPUS';
    const safeMedia = VALID_MEDIA.includes(mediaKey) ? mediaKey : 'TEXT';

    const post = await prisma.post.create({
      data: {
        authorId: req.user.id,
        authorName: req.user.name,
        authorRole: req.user.role,
        authorAvatar: req.user.avatar || null,
        authorDepartment: req.user.departmentCode || null,
        authorBatch: req.user.batchName || null,
        authorStudentId: req.user.studentId || null,
        communityType: safeCommunity,
        communityTarget: communityTarget || 'General Campus',
        mediaType: safeMedia,
        mediaUrl: mediaUrl || null,
        attachmentName: attachmentName || null,
        attachmentUrl: attachmentUrl || null,
        title,
        content,
        tags: tags ? JSON.stringify(Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : JSON.stringify(['#BUPSocial']),
        imageUrl: imageUrl || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Post published to MySQL community feed!',
      post: {
        _id: post.id,
        id: post.id,
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : [],
        comments: [],
        likes: [],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2.1 Edit / Update Post (User Requirement: Anyone can edit their own post)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, communityTarget, tags, imageUrl, mediaType } = req.body;

    const existingPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Check authorization: author or faculty/admin
    const isAuthor = existingPost.authorId === req.user.id;
    const isPrivileged = req.user.role === 'FACULTY' || req.user.role === 'ADMIN';

    if (!isAuthor && !isPrivileged) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this post.' });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(communityTarget && { communityTarget }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(mediaType && { mediaType }),
      },
      include: {
        comments: { orderBy: { createdAt: 'asc' } },
        reactions: true,
      },
    });

    res.json({
      success: true,
      message: 'Post updated successfully!',
      post: {
        _id: updatedPost.id,
        id: updatedPost.id,
        ...updatedPost,
        tags: updatedPost.tags ? JSON.parse(updatedPost.tags) : [],
        comments: updatedPost.comments.map((c) => ({
          _id: c.id,
          id: c.id,
          authorId: c.authorId,
          authorName: c.authorName,
          authorRole: c.authorRole.toLowerCase(),
          authorAvatar: c.authorAvatar,
          content: c.content,
          createdAt: c.createdAt,
        })),
        likes: updatedPost.reactions.map((r) => ({ userId: r.userId })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2.2 Delete Post (User Requirement: Anyone can delete their own post)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    const existingPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Check authorization: author or faculty/admin
    const isAuthor = existingPost.authorId === req.user.id;
    const isPrivileged = req.user.role === 'FACULTY' || req.user.role === 'ADMIN';

    if (!isAuthor && !isPrivileged) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this post.' });
    }

    // Delete comments and reactions first
    await prisma.comment.deleteMany({ where: { postId } });
    await prisma.reaction.deleteMany({ where: { postId } });
    await prisma.post.delete({ where: { id: postId } });

    res.json({
      success: true,
      message: 'Post deleted successfully from database!',
      deletedPostId: postId,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Teacher Requirement: Add Comment
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty.' });
    }

    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        authorId: req.user.id,
        authorName: req.user.name,
        authorRole: req.user.role,
        authorAvatar: req.user.avatar || null,
        content: content.trim(),
      },
    });

    await prisma.post.update({
      where: { id: post.id },
      data: { commentsCount: { increment: 1 } },
    });

    // Return updated post
    const updatedPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: { comments: { orderBy: { createdAt: 'asc' } }, reactions: true },
    });

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully!',
      comment: {
        _id: comment.id,
        id: comment.id,
        ...comment,
      },
      post: {
        _id: updatedPost.id,
        id: updatedPost.id,
        ...updatedPost,
        tags: updatedPost.tags ? JSON.parse(updatedPost.tags) : [],
        comments: updatedPost.comments.map((c) => ({
          _id: c.id,
          id: c.id,
          authorId: c.authorId,
          authorName: c.authorName,
          authorRole: c.authorRole.toLowerCase(),
          authorAvatar: c.authorAvatar,
          content: c.content,
          createdAt: c.createdAt,
        })),
        likes: updatedPost.reactions.map((r) => ({ userId: r.userId })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Teacher Requirement: Delete Comment
router.delete('/:id/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found.' });
    }

    const post = await prisma.post.findUnique({ where: { id } });

    // Authorization check: User can delete if they are the comment author, post owner, or faculty/admin
    const isCommentAuthor = comment.authorId === req.user.id;
    const isPostAuthor = post && post.authorId === req.user.id;
    const isPrivileged = req.user.role === 'FACULTY' || req.user.role === 'ADMIN';

    if (!isCommentAuthor && !isPostAuthor && !isPrivileged) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment.' });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    if (post) {
      await prisma.post.update({
        where: { id: post.id },
        data: { commentsCount: { decrement: 1 } },
      });
    }

    const updatedPost = await prisma.post.findUnique({
      where: { id },
      include: { comments: { orderBy: { createdAt: 'asc' } }, reactions: true },
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully.',
      post: {
        _id: updatedPost.id,
        id: updatedPost.id,
        ...updatedPost,
        tags: updatedPost.tags ? JSON.parse(updatedPost.tags) : [],
        comments: updatedPost.comments.map((c) => ({
          _id: c.id,
          id: c.id,
          authorId: c.authorId,
          authorName: c.authorName,
          authorRole: c.authorRole.toLowerCase(),
          authorAvatar: c.authorAvatar,
          content: c.content,
          createdAt: c.createdAt,
        })),
        likes: updatedPost.reactions.map((r) => ({ userId: r.userId })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Like / React to Post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    const existingReaction = await prisma.reaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: req.user.id,
        },
      },
    });

    if (existingReaction) {
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });
    } else {
      await prisma.reaction.create({
        data: {
          postId,
          userId: req.user.id,
          type: 'LIKE',
        },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });
    }

    const count = await prisma.reaction.count({ where: { postId } });
    res.json({ success: true, likesCount: count, isLiked: !existingReaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
