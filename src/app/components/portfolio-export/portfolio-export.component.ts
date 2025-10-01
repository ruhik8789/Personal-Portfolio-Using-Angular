import { Component } from '@angular/core';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-portfolio-export',
  templateUrl: './portfolio-export.component.html',
  styleUrls: ['./portfolio-export.component.css']
})
export class PortfolioExportComponent {
  portfolio = this.aiService.getPortfolio();
  mdPreview: string = this.buildMarkdown();

  constructor(private aiService: AiService) {}

  refresh(): void {
    this.portfolio = this.aiService.getPortfolio();
    this.mdPreview = this.buildMarkdown();
  }

  downloadJson(): void {
    const blob = new Blob([JSON.stringify(this.portfolio, null, 2)], { type: 'application/json' });
    this.triggerBlobDownload(blob, `portfolio-${this.portfolio.name.replace(/\s+/g, '-').toLowerCase()}.json`);
  }

  downloadMarkdown(): void {
    const blob = new Blob([this.mdPreview], { type: 'text/markdown' });
    this.triggerBlobDownload(blob, `portfolio-${this.portfolio.name.replace(/\s+/g, '-').toLowerCase()}.md`);
  }

  printPdf(): void {
    const html = this.buildRichHtml();
    this.openAndPrint(html);
  }

  downloadHtml(): void {
    const html = this.buildRichHtml();
    const blob = new Blob([html], { type: 'text/html' });
    this.triggerBlobDownload(blob, `portfolio-${this.portfolio.name.replace(/\s+/g, '-').toLowerCase()}.html`);
  }

  private triggerBlobDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private buildMarkdown(): string {
    const p = this.portfolio;
    const lines: string[] = [];
    lines.push(`# ${p.name}`);
    lines.push(`${p.title}`);
    lines.push('');
    lines.push(`> ${p.experience} • Skills: ${p.skills.join(', ')}`);
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Skills');
    lines.push('');
    p.skills.forEach(s => lines.push(`- ${s}`));
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Projects');
    lines.push('');
    p.projects.forEach(pr => {
      lines.push(`### ${pr.title}`);
      lines.push(`Tech: ${pr.technologies.join(', ')}`);
      lines.push('');
      lines.push(pr.description);
      lines.push('');
    });
    lines.push('---');
    lines.push('');
    lines.push('## Interests');
    lines.push('');
    p.interests.forEach(i => lines.push(`- ${i}`));
    return lines.join('\n');
  }

  private buildRichHtml(): string {
    const p = this.portfolio;
    const projectCards = p.projects.map(pr => `
      <div class="card">
        <div class="card-title">${pr.title}</div>
        <div class="pill-group">${pr.technologies.map(t => `<span class=\"pill\">${t}</span>`).join('')}</div>
        <p>${pr.description}</p>
      </div>
    `).join('');

    return `<!doctype html><html><head><meta charset="utf-8"/><title>${p.name} - Portfolio</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root{ --brand:#667eea; --ink:#0f172a; --muted:#475569; --border:#e2e8f0; }
      *{ box-sizing:border-box }
      body{ font-family:Inter,Arial,Helvetica,sans-serif; color:var(--ink); margin:0; }
      .container{ max-width:900px; margin:0 auto; padding:32px 20px; }
      .header{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; border-bottom:1px solid var(--border); padding-bottom:16px; }
      .title{ font-size:32px; font-weight:800; margin:0; }
      .subtitle{ color:var(--muted); margin:4px 0 0 0; font-weight:600; }
      .meta{ color:var(--muted); margin-top:8px; }
      .section{ margin-top:28px; }
      .section h2{ font-size:18px; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); margin:0 0 12px 0; }
      .pill{ display:inline-block; background:#eef2ff; color:#3730a3; padding:6px 10px; border-radius:999px; margin:4px 6px 0 0; font-size:12px; }
      .pill-group{ margin:8px 0 6px 0; }
      .grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:12px; }
      .card{ border:1px solid var(--border); border-radius:12px; padding:14px; background:white; box-shadow:0 2px 8px rgba(0,0,0,.04) }
      .card-title{ font-weight:700; margin-bottom:6px; }
      ul{ margin:8px 0; padding-left:18px; }
      .footer{ margin-top:32px; color:var(--muted); font-size:12px; text-align:center; }
      @media print{
        .no-print{ display:none }
        body{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }
      }
    </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1 class="title">${p.name}</h1>
            <div class="subtitle">${p.title}</div>
            <div class="meta">${p.experience}</div>
          </div>
          <div class="no-print">
            <button onclick="window.print()" style="background:var(--brand);color:white;border:none;padding:10px 14px;border-radius:8px;cursor:pointer">Print</button>
          </div>
        </div>

        <div class="section">
          <h2>Skills</h2>
          <div>
            ${p.skills.map(s => `<span class=\"pill\">${s}</span>`).join('')}
          </div>
        </div>

        <div class="section">
          <h2>Projects</h2>
          <div class="grid">
            ${projectCards}
          </div>
        </div>

        <div class="section">
          <h2>Interests</h2>
          <ul>
            ${p.interests.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>

        <div class="footer">Generated from Portfolio</div>
      </div>
    </body>
    </html>`;
  }

  private openAndPrint(html: string): void {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }
}


