import os
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_docx(md_path, docx_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    doc = Document()

    # Page Margins: 1 inch all around
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    lines = content.split('\n')
    i = 0
    in_table = False
    table_rows = []

    while i < len(lines):
        line = lines[i].rstrip()

        # Handle page breaks
        if '\\newpage' in line:
            doc.add_page_break()
            i += 1
            continue

        if line.startswith('\\vspace'):
            # Vertical space
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(18)
            i += 1
            continue

        # Handle Tables in Markdown
        if '|' in line and ('--' in line or (i + 1 < len(lines) and '|' in lines[i+1] and '--' in lines[i+1])):
            # Read whole table
            table_lines = []
            while i < len(lines) and '|' in lines[i].strip():
                if not re.match(r'^\s*\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)+\|?\s*$', lines[i]):
                    table_lines.append(lines[i].strip())
                i += 1
            
            if table_lines:
                rows_data = []
                for tline in table_lines:
                    cols = [c.strip() for c in tline.strip('|').split('|')]
                    rows_data.append(cols)
                
                if rows_data:
                    num_cols = max(len(r) for r in rows_data)
                    table = doc.add_table(rows=len(rows_data), cols=num_cols)
                    table.alignment = WD_TABLE_ALIGNMENT.CENTER
                    table.autofit = True

                    for r_idx, row in enumerate(rows_data):
                        for c_idx, cell_text in enumerate(row):
                            if c_idx < num_cols:
                                cell = table.cell(r_idx, c_idx)
                                cell.text = cell_text
                                # Style header
                                if r_idx == 0:
                                    shading_elm = parse_xml(r'<w:shd {} w:fill="0A192F"/>'.format(nsdecls('w')))
                                    cell._tc.get_or_add_tcPr().append(shading_elm)
                                    for paragraph in cell.paragraphs:
                                        for run in paragraph.runs:
                                            run.font.bold = True
                                            run.font.color.rgb = RGBColor(255, 255, 255)
                                            run.font.size = Pt(10)
                                else:
                                    for paragraph in cell.paragraphs:
                                        for run in paragraph.runs:
                                            run.font.size = Pt(9.5)
            continue

        # Skip Mermaid code blocks in prose, format title
        if line.startswith('```mermaid'):
            while i < len(lines) and not lines[i].startswith('```'):
                i += 1
            i += 1
            continue

        if line.startswith('```'):
            i += 1
            continue

        # Headings
        if line.startswith('# '):
            text = line[2:].strip()
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p.add_run(text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(18)
            run.font.bold = True
            run.font.color.rgb = RGBColor(10, 25, 47) # BUP Navy
            p.paragraph_format.space_before = Pt(18)
            p.paragraph_format.space_after = Pt(12)
            i += 1
            continue

        if line.startswith('## '):
            text = line[3:].strip()
            p = doc.add_paragraph()
            run = p.add_run(text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(14)
            run.font.bold = True
            run.font.color.rgb = RGBColor(10, 25, 47)
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            i += 1
            continue

        if line.startswith('### '):
            text = line[4:].strip()
            p = doc.add_paragraph()
            run = p.add_run(text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(12.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(30, 58, 138)
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            i += 1
            continue

        if line.startswith('---'):
            i += 1
            continue

        # Bullet items
        if line.startswith('- ') or line.startswith('* '):
            text = line[2:].strip()
            p = doc.add_paragraph(style='List Bullet')
            # Format bold inside bullets
            parts = re.split(r'(\*\*.*?\*\*)', text)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    run = p.add_run(part[2:-2])
                    run.bold = True
                else:
                    p.add_run(part)
            p.paragraph_format.space_after = Pt(3)
            i += 1
            continue

        # Italic / caption note
        if line.startswith('*Figure ') or line.startswith('_Figure '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p.add_run(line.strip('*_'))
            run.italic = True
            run.font.size = Pt(10)
            run.font.color.rgb = RGBColor(100, 116, 139)
            i += 1
            continue

        # Normal prose paragraph
        if line.strip():
            p = doc.add_paragraph()
            # Clean HTML artifacts like &nbsp;
            clean_line = line.replace('&nbsp;', ' ').replace('<br>', '\n')
            parts = re.split(r'(\*\*.*?\*\*)', clean_line)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    run = p.add_run(part[2:-2])
                    run.bold = True
                else:
                    p.add_run(part)
            p.paragraph_format.space_after = Pt(6)
        
        i += 1

    doc.save(docx_path)
    print(f"Generated DOCX successfully: {docx_path}")

if __name__ == '__main__':
    md_file = 'docs/BUP_SOCIAL_SRE_Project_Report.md'
    out_docx1 = 'frontend/public/BUP_SOCIAL_SRE_Project_Report.docx'
    out_docx2 = 'docs/BUP_SOCIAL_SRE_Project_Report.docx'
    create_docx(md_file, out_docx1)
    create_docx(md_file, out_docx2)
