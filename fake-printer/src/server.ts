import http from "http";
import net from "net";

const PRINT_PORT = Number(process.env.PRINT_PORT ?? 9100);
const UI_PORT = Number(process.env.UI_PORT ?? 9101);
const HOST = process.env.HOST ?? "0.0.0.0";
const MAX_QUEUE = Number(process.env.PRINT_QUEUE_SIZE ?? 200);

const receipts: Receipt[] = [];
const listeners = new Set<http.ServerResponse>();

type Align = "left" | "center" | "right";

type Segment = {
  text: string;
  bold: boolean;
  align: Align;
  size: { width: number; height: number };
};

type Line = {
  segments: Segment[];
};

type Receipt = {
  id: string;
  receivedAt: string;
  bytes: number;
  hex: string;
  text: string;
  lines: Line[];
  commands: string[];
  remote?: string;
};

function bufferToHex(data: Buffer): string {
  return Array.from(data)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
}

function parseEscPos(data: Buffer): Pick<Receipt, "hex" | "text" | "lines" | "commands"> {
  const lines: Line[] = [];
  const commands: string[] = [];
  let align: Align = "left";
  let bold = false;
  let size = { width: 1, height: 1 };

  let currentLine: Line = { segments: [] };
  let segment: Segment | null = null;

  const pushSegment = () => {
    if (segment && segment.text.length > 0) {
      currentLine.segments.push(segment);
    }
    segment = null;
  };

  const startSegment = () => {
    segment = { text: "", bold, align, size };
  };

  const pushLine = (allowEmpty = true) => {
    pushSegment();
    if (currentLine.segments.length > 0 || allowEmpty) {
      lines.push(currentLine);
    }
    currentLine = { segments: [] };
  };

  const setStyle = (nextAlign: Align, nextBold: boolean, nextSize: { width: number; height: number }) => {
    if (
      segment &&
      (segment.bold !== nextBold || segment.align !== nextAlign ||
        segment.size.width !== nextSize.width || segment.size.height !== nextSize.height)
    ) {
      pushSegment();
    }
    align = nextAlign;
    bold = nextBold;
    size = nextSize;
  };

  for (let i = 0; i < data.length; i += 1) {
    const byte = data[i];

    if (byte === 0x1b) {
      const next = data[i + 1];
      if (next === 0x40) {
        commands.push("init");
        setStyle("left", false, { width: 1, height: 1 });
        i += 1;
        continue;
      }
      if (next === 0x61 && i + 2 < data.length) {
        const mode = data[i + 2];
        const nextAlign: Align = mode === 1 ? "center" : mode === 2 ? "right" : "left";
        commands.push(`align:${nextAlign}`);
        setStyle(nextAlign, bold, size);
        i += 2;
        continue;
      }
      if (next === 0x45 && i + 2 < data.length) {
        const mode = data[i + 2];
        const nextBold = mode === 1;
        commands.push(`bold:${nextBold ? "on" : "off"}`);
        setStyle(align, nextBold, size);
        i += 2;
        continue;
      }
      if (next === 0x74 && i + 2 < data.length) {
        const table = data[i + 2];
        commands.push(`charset:${table}`);
        i += 2;
        continue;
      }
      if (next === 0x21 && i + 2 < data.length) {
        const mode = data[i + 2];
        const nextSize = {
          width: (mode & 0x20) === 0x20 ? 2 : 1,
          height: (mode & 0x10) === 0x10 ? 2 : 1,
        };
        commands.push(`size:${nextSize.width}x${nextSize.height}`);
        setStyle(align, bold, nextSize);
        i += 2;
        continue;
      }
      if (next === 0x64 && i + 2 < data.length) {
        const count = data[i + 2];
        commands.push(`feed:${count}`);
        pushLine(false);
        for (let j = 0; j < count; j += 1) {
          pushLine(true);
        }
        i += 2;
        continue;
      }
      if (next === 0x70 && i + 4 < data.length) {
        commands.push("drawer");
        i += 4;
        continue;
      }
      commands.push(`esc:0x${next?.toString(16) ?? "??"}`);
      continue;
    }

    if (byte === 0x1d) {
      const next = data[i + 1];
      if (next === 0x56 && i + 2 < data.length) {
        commands.push("cut");
        i += 2;
        continue;
      }
      if (next === 0x21 && i + 2 < data.length) {
        const mode = data[i + 2];
        const nextSize = {
          width: (mode & 0x0f) + 1,
          height: ((mode >> 4) & 0x0f) + 1,
        };
        const clamped = {
          width: Math.min(nextSize.width, 4),
          height: Math.min(nextSize.height, 4),
        };
        commands.push(`size:${clamped.width}x${clamped.height}`);
        setStyle(align, bold, clamped);
        i += 2;
        continue;
      }
      commands.push(`gs:0x${next?.toString(16) ?? "??"}`);
      continue;
    }

    if (byte === 0x0a) {
      pushLine(true);
      continue;
    }

    if (byte === 0x0d) {
      continue;
    }

    const ch = String.fromCharCode(byte);
    if (!segment) {
      startSegment();
    }
    segment!.text += ch;
  }

  pushLine(false);

  const text = lines
    .map((line) => line.segments.map((seg) => seg.text).join(""))
    .join("\n");

  return {
    hex: bufferToHex(data),
    text,
    lines,
    commands,
  };
}

function enqueueReceipt(receipt: Receipt) {
  receipts.push(receipt);
  while (receipts.length > MAX_QUEUE) {
    receipts.shift();
  }

  const payload = JSON.stringify({ type: "receipt", receipt });
  for (const stream of listeners) {
    stream.write(`event: receipt\ndata: ${payload}\n\n`);
  }
}

function createReceipt(data: Buffer, remote?: string): Receipt {
  const parsed = parseEscPos(data);
  const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

  return {
    id,
    receivedAt: new Date().toISOString(),
    bytes: data.length,
    hex: parsed.hex,
    text: parsed.text,
    lines: parsed.lines,
    commands: parsed.commands,
    remote,
  };
}

function isStatusProbe(data: Buffer): boolean {
  if (data.length === 0 || data.length % 3 !== 0) {
    return false;
  }
  for (let i = 0; i < data.length; i += 3) {
    if (data[i] !== 0x10 || data[i + 1] !== 0x04) {
      return false;
    }
    const code = data[i + 2];
    if (code < 1 || code > 4) {
      return false;
    }
  }
  return true;
}

function sendJson(res: http.ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "cache-control": "no-store",
  });
  res.end(payload);
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fake Printer Queue</title>
  <style>
    :root {
      --ink: #0f172a;
      --muted: #64748b;
      --paper: #f8fafc;
      --sun: #fef3c7;
      --accent: #0ea5e9;
      --accent-dark: #0369a1;
      --shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: "Space Grotesk", "Avenir Next", "Trebuchet MS", sans-serif;
      color: var(--ink);
      background: radial-gradient(circle at top, #fef9c3, transparent 60%),
        linear-gradient(120deg, #f1f5f9 0%, #e0f2fe 50%, #fef3c7 100%);
      min-height: 100vh;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: 0.4;
      pointer-events: none;
    }

    header {
      position: sticky;
      top: 0;
      backdrop-filter: blur(12px);
      background: rgba(248, 250, 252, 0.8);
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
      z-index: 10;
    }

    .hero {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 32px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 18px;
    }

    .hero h1 {
      font-family: "DM Serif Display", "Georgia", serif;
      font-size: clamp(1.8rem, 2.6vw, 2.8rem);
      margin: 0;
      letter-spacing: 0.04em;
    }

    .hero p {
      margin: 0;
      color: var(--muted);
      max-width: 560px;
    }

    .status {
      margin-left: auto;
      display: flex;
      gap: 18px;
      font-size: 0.95rem;
      color: var(--accent-dark);
    }

    .status span {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .status span::before {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2);
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px;
    }

    .grid {
      column-count: 3;
      column-gap: 24px;
      animation: rise 0.8s ease both;
    }

    @media (max-width: 1050px) {
      .grid {
        column-count: 2;
      }
    }

    @media (max-width: 720px) {
      .grid {
        column-count: 1;
      }

      .status {
        width: 100%;
        margin-left: 0;
        flex-wrap: wrap;
      }
    }

    .card {
      background: rgba(248, 250, 252, 0.95);
      border-radius: 16px;
      padding: 18px;
      margin: 0 0 24px;
      box-shadow: var(--shadow);
      border: 1px solid rgba(15, 23, 42, 0.08);
      break-inside: avoid;
      position: relative;
      overflow: hidden;
      transform-origin: top center;
    }

    .card::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.08), transparent 60%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .card:hover::after {
      opacity: 1;
    }

    .card.new {
      animation: pop 0.5s ease;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.85rem;
      color: var(--muted);
      margin-bottom: 12px;
    }

    .meta strong {
      color: var(--ink);
    }

    .paper {
      background: var(--paper);
      border-radius: 12px;
      padding: 16px 14px;
      font-family: "JetBrains Mono", "IBM Plex Mono", "Menlo", monospace;
      font-variant-ligatures: none;
      font-size: 0.92rem;
      line-height: 1.35;
      border: 1px dashed rgba(15, 23, 42, 0.12);
      user-select: text;
      cursor: text;
    }

    .line {
      display: flex;
      gap: 0;
      min-height: 1.2em;
      white-space: pre;
    }

    .line.center {
      justify-content: center;
      text-align: center;
    }

    .line.right {
      justify-content: flex-end;
      text-align: right;
    }

    .segment.bold {
      font-weight: 700;
    }

    .segment {
      display: inline-block;
      white-space: pre;
      user-select: text;
    }

    details {
      margin-top: 12px;
      color: var(--muted);
      font-size: 0.8rem;
    }

    summary {
      cursor: pointer;
    }

    pre {
      white-space: pre-wrap;
      word-break: break-all;
      margin: 8px 0 0;
    }

    @keyframes pop {
      0% { transform: scale(0.98); opacity: 0.6; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes rise {
      0% { transform: translateY(12px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
  </style>
</head>
<body>
  <header>
    <div class="hero">
      <div>
        <h1>Fake Printer Queue</h1>
        <p>Live ESC/POS receipts flowing from port ${PRINT_PORT}. Scroll to see every print job, no history beyond the in-memory queue.</p>
      </div>
      <div class="status">
        <span>Streaming</span>
        <span id="count">0 jobs</span>
        <span id="updated">waiting</span>
      </div>
    </div>
  </header>
  <main>
    <div id="grid" class="grid"></div>
  </main>

  <script>
    const grid = document.getElementById('grid');
    const countLabel = document.getElementById('count');
    const updatedLabel = document.getElementById('updated');

    function formatTime(iso) {
      const date = new Date(iso);
      return date.toLocaleString();
    }

    function renderLine(line) {
      const div = document.createElement('div');
      div.className = 'line';
      div.style.userSelect = 'text';
      div.style.cursor = 'text';
      const align = line.segments[0]?.align;
      const maxHeight = line.segments.reduce((max, segment) => {
        const height = segment.size?.height || 1;
        return height > max ? height : max;
      }, 1);
      if (maxHeight !== 1) {
        div.style.fontSize = (0.92 * maxHeight) + 'rem';
        div.style.lineHeight = (1.35 * maxHeight) + '';
      }
      if (align === 'center') div.classList.add('center');
      if (align === 'right') div.classList.add('right');
      if (align === 'center' || align === 'right') {
        const combined = line.segments.map((segment) => segment.text).join('');
        const trimmed = combined.trim();
        const span = document.createElement('span');
        span.className = 'segment';
        span.textContent = trimmed || ' ';
        div.appendChild(span);
      } else {
        const segments = line.segments.map((segment) => ({
          text: segment.text,
          bold: segment.bold
        }));
        segments.forEach((segment) => {
          if (segment.text.length === 0) {
            return;
          }
          const span = document.createElement('span');
          span.className = 'segment' + (segment.bold ? ' bold' : '');
          span.textContent = segment.text;
          div.appendChild(span);
        });
      }
      if (line.segments.length === 0) {
        const span = document.createElement('span');
        span.textContent = ' ';
        div.appendChild(span);
      }
      return div;
    }

    function renderReceipt(receipt, isNew) {
      const card = document.createElement('article');
      card.className = 'card' + (isNew ? ' new' : '');

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.innerHTML =
        '<span><strong>#' +
        receipt.id +
        '</strong></span>' +
        '<span>' +
        formatTime(receipt.receivedAt) +
        '</span>' +
        '<span>' +
        receipt.bytes +
        ' bytes</span>' +
        '<span>' +
        (receipt.remote || 'local') +
        '</span>';

      const paper = document.createElement('div');
      paper.className = 'paper';
      receipt.lines.forEach((line) => paper.appendChild(renderLine(line)));

      const details = document.createElement('details');
      details.innerHTML =
        '<summary>Raw ESC/POS + commands</summary>' +
        '<pre>' +
        (receipt.commands.join(', ') || 'none') +
        '\\n' +
        receipt.hex +
        '</pre>';

      card.appendChild(meta);
      card.appendChild(paper);
      card.appendChild(details);

      if (isNew) {
        grid.prepend(card);
      } else {
        grid.appendChild(card);
      }

      countLabel.textContent = grid.children.length + ' jobs';
      updatedLabel.textContent = 'last: ' + formatTime(receipt.receivedAt);
    }

    async function loadQueue() {
      const res = await fetch('queue');
      const data = await res.json();
      data.receipts.forEach((receipt) => renderReceipt(receipt, false));
      if (data.receipts.length === 0) {
        updatedLabel.textContent = 'queue empty';
      }
    }

    loadQueue();

    const events = new EventSource('events');
    events.addEventListener('receipt', (event) => {
      const payload = JSON.parse(event.data);
      renderReceipt(payload.receipt, true);
    });
    events.addEventListener('error', () => {
      updatedLabel.textContent = 'streaming paused';
    });
  </script>
</body>
</html>`;

function startUiServer() {
  const server = http.createServer((req, res) => {
    const method = req.method ?? "GET";
    const reqPath = req.url ?? "/";

    if (method !== "GET") {
      res.writeHead(405);
      res.end("Method Not Allowed");
      return;
    }

    if (reqPath === "/" || reqPath === "/index.html") {
      res.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(html);
      return;
    }

    if (reqPath === "/queue") {
      sendJson(res, 200, { receipts: receipts.slice().reverse() });
      return;
    }

    if (reqPath === "/events") {
      res.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        "access-control-allow-origin": "*",
        connection: "keep-alive",
      });
      res.write("event: hello\ndata: {}\n\n");
      listeners.add(res);
      req.on("close", () => listeners.delete(res));
      return;
    }

    if (reqPath === "/health") {
      sendJson(res, 200, { status: "ok" });
      return;
    }

    res.writeHead(404);
    res.end("Not Found");
  });

  server.listen(UI_PORT, HOST, () => {
    console.log(`ui listening on http://${HOST}:${UI_PORT}`);
  });
}

function startPrintServer() {
  const server = net.createServer((socket) => {
    const chunks: Buffer[] = [];
    let closed = false;
    const remote = `${socket.remoteAddress ?? "unknown"}:${socket.remotePort ?? ""}`;

    const finalize = () => {
      if (closed) return;
      closed = true;
      const data = Buffer.concat(chunks);
      if (data.length === 0 || isStatusProbe(data)) return;
      const receipt = createReceipt(data, remote);
      console.log(JSON.stringify({ event: "print", receipt }));
      enqueueReceipt(receipt);
    };

    socket.setTimeout(1500);
    socket.on("data", (chunk) => chunks.push(chunk));
    socket.on("end", finalize);
    socket.on("close", finalize);
    socket.on("timeout", () => {
      socket.end();
      finalize();
    });
    socket.on("error", (err) => {
      console.error("printer socket error", err.message);
      finalize();
    });
  });

  server.listen(PRINT_PORT, HOST, () => {
    console.log(`fake printer listening on tcp://${HOST}:${PRINT_PORT}`);
  });
}

startPrintServer();
startUiServer();
