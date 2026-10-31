// Utility to generate realistic BUP Academic PDFs and Schedules
// Eliminates dummy.pdf and produces genuine, formatted academic handouts and routine documents

export interface NoteMetadata {
  title: string;
  courseCode: string;
  courseTitle: string;
  facultyName: string;
  department: string;
  semester: string;
  date: string;
}

export const generateAndDownloadNoteDocument = (note: {
  title: string;
  courseCode?: string;
  courseTitle?: string;
  facultyName?: string;
  department?: string;
}) => {
  const courseCode = note.courseCode || 'ICE-2207';
  const courseTitle = note.courseTitle || 'Computer Networks & Internetworking';
  const faculty = note.facultyName || 'Lecturer Sharmeen Jahan Seema';
  const dept = note.department || 'Department of Information and Communication Engineering (ICT)';
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Generate genuine formatted HTML document with BUP styling
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${note.title} - BUP Academic Handout</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      margin: 0;
      padding: 24px;
      background: #ffffff;
    }
    .header {
      border-bottom: 3px double #072146;
      padding-bottom: 16px;
      margin-bottom: 24px;
      text-align: center;
    }
    .emblem-title {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #072146;
      margin: 0;
      text-transform: uppercase;
    }
    .motto {
      font-size: 11px;
      color: #059669;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 4px 0;
    }
    .campus-info {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .doc-badge {
      display: inline-block;
      background: #0f766e;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 14px;
      border-radius: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0284c7;
      padding: 14px 18px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 12px;
    }
    .meta-box p { margin: 2px 0; }
    .meta-label { font-weight: 700; color: #475569; }
    h1 { font-size: 18px; color: #0f172a; margin-top: 0; font-weight: 800; }
    h2 { font-size: 14px; color: #0369a1; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 20px; }
    p, li { font-size: 13px; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; color: #0f172a; font-weight: 700; }
    .code-box {
      background: #0f172a;
      color: #38bdf8;
      padding: 12px;
      border-radius: 6px;
      font-family: Consolas, monospace;
      font-size: 11px;
      overflow-x: auto;
      margin: 12px 0;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 70px;
      font-weight: 900;
      color: rgba(7, 33, 70, 0.04);
      z-index: -1;
      pointer-events: none;
      white-space: nowrap;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="watermark">BANGLADESH UNIVERSITY OF PROFESSIONALS</div>

  <div class="header">
    <div class="emblem-title">Bangladesh University of Professionals</div>
    <div class="motto">Excellence Through Knowledge</div>
    <div class="campus-info">Mirpur Cantonment, Dhaka-1216 • Faculty of Science & Technology (FST)</div>
    <div class="doc-badge">Official Academic Lecture Handout</div>
  </div>

  <div class="meta-box">
    <div>
      <p><span class="meta-label">Course:</span> ${courseCode} - ${courseTitle}</p>
      <p><span class="meta-label">Department:</span> ${dept}</p>
    </div>
    <div>
      <p><span class="meta-label">Instructor:</span> ${faculty}</p>
      <p><span class="meta-label">Issued Date:</span> ${dateStr}</p>
    </div>
  </div>

  <h1>${note.title}</h1>
  <p><strong>Executive Abstract:</strong> This academic study resource has been compiled for BUP undergraduate students covering foundational theories, mathematical formulations, and laboratory implementations according to the approved OBE syllabus.</p>

  <h2>1. Theoretical Foundations & Core Architecture</h2>
  <p>Modern telecommunications and distributed network architectures operate on modular protocol layering. The OSI 7-Layer model and TCP/IP 4-Layer model organize end-to-end communication across heterogeneous hardware platforms:</p>
  <table>
    <thead>
      <tr>
        <th>OSI Layer</th>
        <th>TCP/IP Layer</th>
        <th>Primary Protocols</th>
        <th>Data Unit (PDU)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Application / Presentation / Session</td>
        <td>Application</td>
        <td>HTTP/3, HTTPS, SSH, DNS, BGP</td>
        <td>Messages / Streams</td>
      </tr>
      <tr>
        <td>Transport</td>
        <td>Transport (Host-to-Host)</td>
        <td>TCP (Reliable, SYN/ACK), UDP</td>
        <td>Segments / Datagrams</td>
      </tr>
      <tr>
        <td>Network</td>
        <td>Internet</td>
        <td>IPv4, IPv6, ICMP, OSPF, RIP</td>
        <td>Packets</td>
      </tr>
      <tr>
        <td>Data Link & Physical</td>
        <td>Network Access</td>
        <td>Ethernet (802.3), Wi-Fi (802.11ax), MAC</td>
        <td>Frames / Bits</td>
      </tr>
    </tbody>
  </table>

  <h2>2. Key Subnetting & Addressing Equations</h2>
  <p>Given an assigned IPv4 classless CIDR block (e.g. <code>192.168.10.0/26</code>):</p>
  <ul>
    <li><strong>Total Available IP Addresses:</strong> \\( N = 2^{(32 - 26)} = 2^6 = 64 \\)</li>
    <li><strong>Usable Host Addresses:</strong> \\( H = 2^{(32 - 26)} - 2 = 62 \\) (reserving network and broadcast IDs)</li>
    <li><strong>Subnet Mask:</strong> <code>255.255.255.192</code></li>
  </ul>

  <h2>3. Algorithmic Routing Formulation (Dijkstra Shortest Path)</h2>
  <p>For autonomous interior gateway routing in OSPF, the Link-State Database computes shortest path trees with time complexity \\( O((|V| + |E|) \\log |V|) \\):</p>
  <div class="code-box">
// C++ Implementation of OSPF Shortest Path Routing (BUP Lab 402)
#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;queue&gt;

using namespace std;
const int INF = 1e9;

void dijkstra(int src, vector&lt;vector&lt;pair&lt;int,int&gt;&gt;&gt;&amp; adj, vector&lt;int&gt;&amp; dist) {
    priority_queue&lt;pair&lt;int,int&gt;, vector&lt;pair&lt;int,int&gt;&gt;, greater&lt;pair&lt;int,int&gt;&gt;&gt; pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d &gt; dist[u]) continue;
        for (auto&amp; edge : adj[u]) {
            int v = edge.first, w = edge.second;
            if (dist[u] + w &lt; dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}
  </div>

  <h2>4. Midterm & Final Examination Directives</h2>
  <ol>
    <li>All students must submit Chapter 3 numerical problem sets prior to Week 8.</li>
    <li>Laboratory packet captures (Wireshark traces) must be committed to your university GitHub repository.</li>
    <li>Formula reference sheets and tables will be provided with the examination question paper.</li>
  </ol>

  <div class="footer">
    <span>BUP Social Academic Portal • Generated via BUP Knowledge Cloud</span>
    <span>Document Verification Code: BUP-FST-${Math.floor(100000 + Math.random() * 900000)}</span>
    <span>Page 1 of 1</span>
  </div>

  <script>
    // Auto-open print preview or allow user to save directly as PDF
    window.onload = function() {
      setTimeout(() => { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  // Create a Blob from the formatted HTML content
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Trigger download as HTML document (which opens in browser and prints/saves cleanly to PDF)
  const a = document.createElement('a');
  a.href = url;
  const sanitizedTitle = (note.title || 'BUP_Lecture_Note').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `${sanitizedTitle}_BUP_Academic_Handout.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Also open in new window so the student can immediately view, read, and Print-to-PDF
  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
  }
};

export const generateAndDownloadRoutineDocument = (batch: string = 'BICE-2024', section: string = 'Section A') => {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BUP Weekly Class Routine - ${batch} (${section})</title>
  <style>
    @page { size: A4 landscape; margin: 15mm; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: #0f172a;
      line-height: 1.4;
      margin: 0;
      padding: 20px;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #072146;
      padding-bottom: 12px;
      margin-bottom: 16px;
      text-align: center;
    }
    .title {
      font-size: 20px;
      font-weight: 900;
      color: #072146;
      text-transform: uppercase;
      margin: 0;
    }
    .motto {
      font-size: 10px;
      color: #059669;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 2px 0;
    }
    .sub {
      font-size: 11px;
      color: #64748b;
    }
    .badge {
      display: inline-block;
      background: #072146;
      color: #fbbf24;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 12px;
      border-radius: 12px;
      margin-top: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: center;
      vertical-align: middle;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
    }
    .day-cell {
      background: #f1f5f9;
      font-weight: 800;
      color: #072146;
      width: 80px;
    }
    .course-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #0284c7;
      padding: 6px;
      border-radius: 4px;
      text-align: left;
    }
    .course-card.lab {
      border-left-color: #059669;
      background: #f0fdf4;
    }
    .c-code { font-weight: 800; color: #0369a1; font-size: 11px; }
    .c-name { font-size: 10px; color: #334155; margin: 1px 0; font-weight: 600; }
    .c-fac { font-size: 9px; color: #64748b; }
    .c-room { font-size: 9px; font-weight: 800; color: #047857; display: inline-block; margin-top: 2px; }
    .footer {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Bangladesh University of Professionals (BUP)</div>
    <div class="motto">Excellence Through Knowledge</div>
    <div class="sub">Faculty of Science and Technology (FST) • Department of Information & Communication Technology</div>
    <div class="badge">Official Class Timetable • Spring 2026 Semester (${batch} - ${section})</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Day</th>
        <th>Slot 1<br>(09:00 - 10:20 AM)</th>
        <th>Slot 2<br>(10:30 - 11:50 AM)</th>
        <th>Slot 3<br>(12:00 - 01:20 PM)</th>
        <th>Slot 4<br>(02:00 - 03:20 PM)</th>
        <th>Slot 5<br>(03:30 - 04:50 PM)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="day-cell">Sunday</td>
        <td>
          <div class="course-card">
            <div class="c-code">ICE-2207</div>
            <div class="c-name">Computer Networks</div>
            <div class="c-fac">Lecturer Sharmeen Seema</div>
            <span class="c-room">Room 402</span>
          </div>
        </td>
        <td>
          <div class="course-card">
            <div class="c-code">MATH-2207</div>
            <div class="c-name">Differential Equations</div>
            <div class="c-fac">Col Omar Faruque, PhD</div>
            <span class="c-room">Room 402</span>
          </div>
        </td>
        <td style="color: #94a3b8; font-style: italic;">Break / Prayer</td>
        <td>
          <div class="course-card">
            <div class="c-code">CSE-3101</div>
            <div class="c-name">Data Structures</div>
            <div class="c-fac">Dr. Md. Sabir Hossain</div>
            <span class="c-room">Room 403</span>
          </div>
        </td>
        <td>-</td>
      </tr>
      <tr>
        <td class="day-cell">Monday</td>
        <td colspan="2">
          <div class="course-card lab">
            <div class="c-code">ICE-2208 (Lab)</div>
            <div class="c-name">Computer Networks Hardware & Packet Tracer Lab</div>
            <div class="c-fac">Lecturer Sharmeen Seema & Lab Staff</div>
            <span class="c-room">Lab 402 (Network & IoT Lab)</span>
          </div>
        </td>
        <td style="color: #94a3b8; font-style: italic;">Break / Prayer</td>
        <td>
          <div class="course-card">
            <div class="c-code">ICE-2201</div>
            <div class="c-name">Signals & Systems</div>
            <div class="c-fac">Asst. Prof. Fahmida Hossain</div>
            <span class="c-room">Room 402</span>
          </div>
        </td>
        <td>
          <div class="course-card">
            <div class="c-code">BUP-TUT</div>
            <div class="c-name">Batch CR Coordination</div>
            <div class="c-fac">Munshi Tanvir Hossain / Rafi</div>
            <span class="c-room">Room 402</span>
          </div>
        </td>
      </tr>
      <tr>
        <td class="day-cell">Tuesday</td>
        <td>
          <div class="course-card">
            <div class="c-code">MATH-2207</div>
            <div class="c-name">Fourier & Laplace Transforms</div>
            <div class="c-fac">Col Omar Faruque, PhD</div>
            <span class="c-room">Room 402</span>
          </div>
        </td>
        <td>
          <div class="course-card">
            <div class="c-code">ICE-2207</div>
            <div class="c-name">IP Subnetting & Routing</div>
            <div class="c-fac">Lecturer Sharmeen Seema</div>
            <span class="c-room">Room 402</span>
          </div>
        </td>
        <td style="color: #94a3b8; font-style: italic;">Break / Prayer</td>
        <td colspan="2">
          <div class="course-card lab">
            <div class="c-code">CSE-3102 (Lab)</div>
            <div class="c-name">Algorithm Design & Data Structures Lab</div>
            <div class="c-fac">Lecturer Jasiya Fairiz Raisa</div>
            <span class="c-room">Lab 403 (Software Lab)</span>
          </div>
        </td>
      </tr>
      <tr>
        <td class="day-cell">Wednesday</td>
        <td>
          <div class="course-card">
            <div class="c-code">ICE-2201</div>
            <div class="c-name">Z-Transforms & Filtering</div>
            <div class="c-fac">Asst. Prof. Fahmida Hossain</div>
            <span class="c-room">Room 402</span>
          </div>
        </td>
        <td>
          <div class="course-card">
            <div class="c-code">HUM-2201</div>
            <div class="c-name">Engineering Ethics & Cyber Law</div>
            <div class="c-fac">Faculty of Law & Security</div>
            <span class="c-room">Room 305</span>
          </div>
        </td>
        <td style="color: #94a3b8; font-style: italic;">Break / Prayer</td>
        <td>
          <div class="course-card">
            <div class="c-code">FST-SEM</div>
            <div class="c-name">Dean Research Colloquium</div>
            <div class="c-fac">Brig Gen Ataur Rahman</div>
            <span class="c-room">Auditorium 2</span>
          </div>
        </td>
        <td>-</td>
      </tr>
      <tr>
        <td class="day-cell">Thursday</td>
        <td>
          <div class="course-card">
            <div class="c-code">CSE-3101</div>
            <div class="c-name">Graph Algorithms & Dynamic Prog</div>
            <div class="c-fac">Dr. Md. Sabir Hossain</div>
            <span class="c-room">Room 402</span>
          </div>
        </td>
        <td>
          <div class="course-card">
            <div class="c-code">MATH-2207</div>
            <div class="c-name">Problem Solving Tutorial</div>
            <div class="c-fac">Teaching Assistant</div>
            <span class="c-room">Room 402</span>
          </div>
        </td>
        <td style="color: #94a3b8; font-style: italic;">Break / Prayer</td>
        <td>-</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <span>Bangladesh University of Professionals • Routine Hub Spring 2026</span>
    <span>Issued by Chairman, Dept of ICT, FST • Authenticated System Copy</span>
    <span>Generated: ${dateStr}</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BUP_Class_Routine_${batch}_${section}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
  }
};
