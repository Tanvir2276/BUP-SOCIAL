import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
)

def create_pdf(md_path, pdf_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        alignment=1, # Center
        textColor=colors.HexColor('#0A192F'),
        spaceAfter=15,
        spaceBefore=15
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0A192F'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        spaceAfter=3
    )

    story = []
    lines = content.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i].rstrip()

        if '\\newpage' in line:
            story.append(PageBreak())
            i += 1
            continue

        if line.startswith('\\vspace'):
            story.append(Spacer(1, 15))
            i += 1
            continue

        # Handle Tables
        if '|' in line and ('--' in line or (i + 1 < len(lines) and '|' in lines[i+1] and '--' in lines[i+1])):
            table_lines = []
            while i < len(lines) and '|' in lines[i].strip():
                if not re.match(r'^\s*\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)+\|?\s*$', lines[i]):
                    table_lines.append(lines[i].strip())
                i += 1

            if table_lines:
                rows = []
                for idx, tline in enumerate(table_lines):
                    cols = [c.strip() for c in tline.strip('|').split('|')]
                    cell_pars = []
                    for c in cols:
                        c_text = c.replace('<br>', '<br/>').replace('&nbsp;', ' ')
                        # Markdown bold in cell
                        c_text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', c_text)
                        cell_style = ParagraphStyle('Cell', parent=body_style, fontSize=8, leading=10)
                        if idx == 0:
                            cell_style.textColor = colors.white
                            cell_style.fontName = 'Helvetica-Bold'
                        cell_pars.append(Paragraph(c_text, cell_style))
                    rows.append(cell_pars)

                if rows:
                    t = Table(rows, hAlign='CENTER')
                    t.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0A192F')),
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                        ('TOPPADDING', (0, 0), (-1, -1), 4),
                        ('LEFTPADDING', (0, 0), (-1, -1), 4),
                        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
                    ]))
                    story.append(t)
                    story.append(Spacer(1, 8))
            continue

        if line.startswith('```mermaid'):
            while i < len(lines) and not lines[i].startswith('```'):
                i += 1
            i += 1
            continue

        if line.startswith('```'):
            i += 1
            continue

        if line.startswith('# '):
            text = line[2:].strip()
            story.append(Paragraph(text, title_style))
            i += 1
            continue

        if line.startswith('## '):
            text = line[3:].strip()
            story.append(Paragraph(text, h1_style))
            i += 1
            continue

        if line.startswith('### '):
            text = line[4:].strip()
            story.append(Paragraph(text, h2_style))
            i += 1
            continue

        if line.startswith('---'):
            i += 1
            continue

        if line.startswith('- ') or line.startswith('* '):
            text = line[2:].strip()
            text = text.replace('&nbsp;', ' ').replace('<br>', '<br/>')
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
            story.append(Paragraph(f"• {text}", bullet_style))
            i += 1
            continue

        if line.strip():
            text = line.replace('&nbsp;', ' ').replace('<br>', '<br/>')
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
            text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
            story.append(Paragraph(text, body_style))

        i += 1

    doc.build(story)
    print(f"Generated PDF successfully: {pdf_path}")

if __name__ == '__main__':
    md_file = 'docs/BUP_SOCIAL_SRE_Project_Report.md'
    out_pdf1 = 'frontend/public/BUP_SOCIAL_SRE_Project_Report.pdf'
    out_pdf2 = 'docs/BUP_SOCIAL_SRE_Project_Report.pdf'
    create_pdf(md_file, out_pdf1)
    create_pdf(md_file, out_pdf2)
