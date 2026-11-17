(() => {
/* breakpoint-search — Busca Semântica IA, Cheat Budget Radar & Breakpoints JS (Desktop + Mobile) */
const ID = "BREAKPOINT_SEARCH_HUD";
const old = document.getElementById(ID);
if (old) {
  old.remove();
  (window.__bpT || []).forEach(clearInterval);
  window.__bpT = [];
  return;
}
window.__bpT = [];
const W = window, D = document;
const S = window.__bpS || (window.__bpS = {
  net: [], logs: [], frozen: new Map(), locks: new Map(),
  netRules: [], bpHits: [], hookLog: [], hooked: false,
  bridgeUrl: "https://ais-dev-yeh5eoa3kxnvah6zpvki6n-555594818979.us-west1.run.app"
});
if ("https://ais-dev-yeh5eoa3kxnvah6zpvki6n-555594818979.us-west1.run.app" && !S.bridgeUrl) S.bridgeUrl = "https://ais-dev-yeh5eoa3kxnvah6zpvki6n-555594818979.us-west1.run.app";
S.tab = S.tab || "radar";
S.q = "";
S.qraw = "";
S.path = S.path || [];
S.root = S.root || "window";

/* ---------- Hooks de Rede, WebSocket e Console ---------- */
if (!S.hooked) {
  S.hooked = true;
  const push = it => { S.net.unshift(it); if (S.net.length > 300) S.net.pop(); };
  const matchRule = url => (S.netRules || []).find(r => r.active && url.toLowerCase().includes(r.pattern.toLowerCase()));
  const of = W.fetch;
  S.of = of ? of.bind(W) : null;
  if (of) {
    W.fetch = function(i, o) {
      const t0 = performance.now();
      const url = typeof i === "string" ? i : (i && i.url) || String(i);
      const method = (o && o.method) || (i && i.method) || "GET";
      const rule = matchRule(url);
      if (rule && rule.action === "block") {
        const blocked = { type: "fetch", method, url, status: "BLOQ", ms: 0, size: 0, time: new Date().toLocaleTimeString(), reqBody: "", resBody: "[Bloqueado por breakpoint-search]" };
        push(blocked);
        S.bpHits.unshift({ time: blocked.time, target: url, mode: "rede-block", detail: "Requisição bloqueada pela regra: " + rule.pattern });
        return Promise.reject(new Error("Bloqueado por breakpoint-search"));
      }
      const it = { type: "fetch", method, url, status: "…", ms: 0, size: "", time: new Date().toLocaleTimeString(), reqBody: o && typeof o.body === "string" ? o.body.slice(0, 20000) : "", resBody: "" };
      push(it);
      return of.apply(this, arguments).then(r => {
        it.status = r.status;
        it.ms = Math.round(performance.now() - t0);
        try { r.clone().text().then(t => { it.size = t.length; it.resBody = t.slice(0, 200000); }).catch(() => {}); } catch (e) {}
        return r;
      }, e => {
        it.status = "ERRO";
        it.ms = Math.round(performance.now() - t0);
        it.resBody = String(e);
        throw e;
      });
    };
  }
  const XO = XMLHttpRequest.prototype.open, XS = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(m, u) {
    this.__bp = { type: "xhr", method: m, url: String(u), status: "…", ms: 0, size: "", time: "", reqBody: "", resBody: "" };
    return XO.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function(b) {
    const it = this.__bp || { type: "xhr", method: "?", url: "?" };
    const rule = matchRule(it.url);
    if (rule && rule.action === "block") {
      it.status = "BLOQ";
      it.time = new Date().toLocaleTimeString();
      push(it);
      S.bpHits.unshift({ time: it.time, target: it.url, mode: "rede-block", detail: "XHR bloqueado: " + rule.pattern });
      return;
    }
    const t0 = performance.now();
    it.time = new Date().toLocaleTimeString();
    it.reqBody = typeof b === "string" ? b.slice(0, 20000) : "";
    push(it);
    this.addEventListener("loadend", () => {
      it.status = this.status || "ERRO";
      it.ms = Math.round(performance.now() - t0);
      try {
        const t = (this.responseType === "" || this.responseType === "text") ? this.responseText : "[" + this.responseType + "]";
        it.size = t.length;
        it.resBody = t.slice(0, 200000);
      } catch (e) {}
    });
    return XS.apply(this, arguments);
  };
  const WS = W.WebSocket;
  if (WS) {
    W.WebSocket = function(u, pr) {
      const w = pr ? new WS(u, pr) : new WS(u);
      const it = { type: "ws", method: "WS", url: String(u), status: "aberto", ms: 0, size: "", time: new Date().toLocaleTimeString(), reqBody: "", resBody: "" };
      push(it);
      const os = w.send;
      w.send = function(d) {
        it.reqBody = (it.reqBody + (typeof d === "string" ? d : "[bin]") + "\n").slice(-100000);
        return os.apply(this, arguments);
      };
      w.addEventListener("message", e => {
        it.resBody = (it.resBody + (typeof e.data === "string" ? e.data : "[bin]") + "\n").slice(-100000);
      });
      return w;
    };
    W.WebSocket.prototype = WS.prototype;
    Object.assign(W.WebSocket, { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 });
  }
  ["log", "info", "warn", "error", "debug"].forEach(l => {
    const o = console[l];
    console[l] = function(...a) {
      S.logs.push({ l, t: new Date().toLocaleTimeString(), m: a.map(fmt).join(" ") });
      if (S.logs.length > 500) S.logs.shift();
      return o.apply(this, a);
    };
  });
  W.addEventListener("error", e => S.logs.push({ l: "error", t: new Date().toLocaleTimeString(), m: (e.message || "Erro") + " @ " + (e.filename || "") + ":" + (e.lineno || "") }));
  W.addEventListener("unhandledrejection", e => S.logs.push({ l: "error", t: new Date().toLocaleTimeString(), m: "Promise rejeitada: " + fmt(e.reason) }));
}
S.res = S.res || new Map();
if (!S.po) {
  S.po = true;
  try {
    performance.setResourceTimingBufferSize && performance.setResourceTimingBufferSize(10000);
    new PerformanceObserver(l => l.getEntries().forEach(e => S.res.set(e.name, e))).observe({ type: "resource", buffered: true });
  } catch (e) {}
}

function fmt(v) {
  try {
    if (typeof v === "string") return v;
    if (v instanceof Error) return v.name + ": " + v.message;
    if (typeof v === "function") return "ƒ " + (v.name || "anon") + "()";
    if (v instanceof Node) return "<" + (v.nodeName || "").toLowerCase() + ">";
    return JSON.stringify(v, (k, x) => typeof x === "bigint" ? x + "n" : x, 0)?.slice(0, 2000) ?? String(v);
  } catch (e) { return String(v); }
}

/* ---------- Host Shadow DOM (Mobile Bottom Sheet + Desktop + Mini Radar HUD) ---------- */
const host = D.createElement("div");
host.id = ID;
host.style.cssText = "all:initial;position:fixed;z-index:2147483647;top:0;left:0;width:0;height:0";
(D.body || D.documentElement).appendChild(host);
const R = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
const mobile = Math.min(innerWidth, screen.width) < 740 || matchMedia("(pointer:coarse)").matches;

const css = `
*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.p{position:fixed;top:16px;right:16px;width:580px;max-width:calc(100vw - 16px);height:84vh;background:#0a0d12;color:#e6edf3;border:1px solid #222b3a;border-radius:12px;display:flex;flex-direction:column;font-size:12px;line-height:1.45;box-shadow:0 16px 56px rgba(0,0,0,.78);overflow:hidden}
.p.m{top:auto;bottom:0;left:0;right:0;width:100vw;max-width:100vw;height:76vh;border-radius:18px 18px 0 0;font-size:13px}
.p.hidden{display:none!important}
.hdr{background:#11161f;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;cursor:move;border-bottom:1px solid #222b3a;user-select:none;touch-action:none;position:relative}
.hdr b{color:#38bdf8;font-size:13px;letter-spacing:-0.01em}
.grip{width:40px;height:4px;background:#303a4b;border-radius:2px;margin:0 auto 4px}
.nav{display:flex;background:#11161f;border-bottom:1px solid #222b3a;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.nav::-webkit-scrollbar{display:none}
.nb{background:none;border:0;color:#8b949e;padding:10px 12px;font-weight:600;font-size:12px;border-bottom:2px solid transparent;white-space:nowrap;cursor:pointer;min-height:42px}
.nb.a{color:#38bdf8;border-color:#38bdf8}
.sub{padding:8px;background:#11161f;border-bottom:1px solid #222b3a;display:flex;gap:6px;flex-wrap:wrap}
.body{flex:1;overflow:auto;padding:10px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.ft{padding:7px 10px;background:#11161f;border-top:1px solid #222b3a;color:#8b949e;display:flex;justify-content:space-between;gap:6px;align-items:center;font-size:11px}
.b{background:#19212e;color:#d0d8e4;border:1px solid #283344;border-radius:7px;padding:6px 10px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;min-height:32px}
.m .b{padding:9px 12px;font-size:12px;min-height:42px}
.b:active,.b:hover{background:#232e40;color:#fff}
.g{background:#059669;border-color:#10b981;color:#fff}.g:hover{background:#047857}
.r{background:#dc2626;border-color:#ef4444;color:#fff}.r:hover{background:#b91c1c}
.am{background:#d97706;border-color:#f59e0b;color:#fff}
.on{border-color:#38bdf8;color:#38bdf8;background:#0c2236}
.i,textarea,select{flex:1;min-width:0;width:100%;padding:8px 10px;background:#06080b;color:#e6edf3;border:1px solid #253041;border-radius:7px;font-size:12px;font-family:ui-monospace,Menlo,monospace}
.m .i,.m textarea,.m select{font-size:16px;min-height:42px}
.i:focus,textarea:focus{border-color:#38bdf8;outline:none}
.c{background:#11161f;border:1px solid #222b3a;border-radius:9px;padding:10px;margin-bottom:8px}
.row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.sp{justify-content:space-between}.mt{margin-top:7px}
.k{color:#7dd3fc;font-weight:700;word-break:break-all}.mu{color:#8b949e;font-size:11px}.mono{font-family:ui-monospace,Menlo,monospace;word-break:break-all;white-space:pre-wrap;font-variant-numeric:tabular-nums}
.ok{color:#34d399}.bad{color:#f87171}.warn{color:#fbbf24}
.q{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.q .b{padding:4px 8px;font-size:11px}
.lg{padding:5px 6px;border-bottom:1px solid #1c2432;font-family:ui-monospace,Menlo,monospace;font-size:11px;white-space:pre-wrap;word-break:break-all}
.lg.warn{background:#d9770618}.lg.error{background:#dc262618;color:#fca5a5}
details summary{cursor:pointer;list-style:none}
.grid{display:grid;grid-template-columns:auto 1fr;gap:4px 10px}
.hud{position:fixed;right:14px;bottom:16px;background:#11161f;color:#e6edf3;border:1px solid #38bdf8;border-radius:12px;padding:8px 12px;display:flex;align-items:center;gap:10px;box-shadow:0 10px 30px rgba(0,0,0,.75);cursor:pointer;font-size:12px;min-height:46px;z-index:2147483647}
.hud b{color:#38bdf8;font-variant-numeric:tabular-nums}
.price-ok{border-color:#10b98166;background:#052e2233}
`;

R.innerHTML = "";
const st = D.createElement("style");
st.textContent = css;
R.appendChild(st);
const P = D.createElement("div");
P.className = "p" + (mobile ? " m" : "");
R.appendChild(P);

const HUD = D.createElement("button");
HUD.className = "hud";
HUD.style.display = "none";
HUD.onclick = () => { HUD.style.display = "none"; P.classList.remove("hidden"); };
R.appendChild(HUD);

function h(tag, attrs, ...kids) {
  const e = D.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else if (k === "cls") e.className = v;
      else if (k === "style") e.style.cssText = v;
      else if (k === "value") e.value = v;
      else e.setAttribute(k, v === true ? "" : v);
    }
  }
  kids.flat(9).forEach(c => {
    if (c == null || c === false) return;
    e.appendChild(c instanceof Node ? c : D.createTextNode(String(c)));
  });
  return e;
}
const btn = (txt, fn, cls = "") => h("button", { cls: "b " + cls, onclick: fn }, txt);
const metaLine = (...parts) => h("span", { cls: "mu" }, parts.filter(Boolean).join(" · "));
let msgEl;
const msg = t => { if (msgEl) msgEl.textContent = t; };
const copy = t => { try { navigator.clipboard.writeText(t).then(() => msg("Copiado!"), () => fallbackCopy(t)); } catch (e) { fallbackCopy(t); } };
function fallbackCopy(t) {
  const a = D.createElement("textarea"); a.value = t; R.appendChild(a); a.select();
  try { D.execCommand("copy"); msg("Copiado!"); } catch (e) { msg("Falha ao copiar"); }
  a.remove();
}
function parse(s) {
  s = String(s).trim();
  if (s === "") return "";
  if (s === "true") return true;
  if (s === "false") return false;
  if (s === "null") return null;
  if (s === "undefined") return undefined;
  if (/^-?\d+(\.\d+)?(e-?\d+)?$/i.test(s)) return Number(s);
  if (/^[\[{"]/.test(s)) { try { return JSON.parse(s); } catch (e) {} }
  return s;
}
const show = v => { if (typeof v === "string") return v; try { return JSON.stringify(v) ?? String(v); } catch (e) { return String(v); } };

/* ---------- Resolução de caminhos e variáveis ---------- */
S.pk = S.pk || new Map();
const IDENT = /^[A-Za-z_$][\w$]*$/;
function lexTypeof(n) { try { return (0, eval)("typeof " + n); } catch (e) { return /EvalError|unsafe|Content Security/i.test(e && (e.name + " " + e.message)) ? "!csp" : "tdz"; } }
function lexGet(n) { return (0, eval)(n); }
function lexSet(n, v) { W.__bpV = v; try { (0, eval)(n + "=globalThis.__bpV"); } finally { delete W.__bpV; } }
function isLex(k) { return typeof k === "string" && k.startsWith("@lex:"); }
function LEXOK(k) { if (!IDENT.test(k) || (k in W)) return false; const t = lexTypeof(k); return t !== "undefined" && t !== "!csp" && t !== "tdz"; }
function pstr(keys) {
  keys = keys.slice();
  if (keys[0] === "window") keys.shift();
  const lx = isLex(keys[0]);
  const rest = lx ? keys.slice(1) : keys;
  const base = lx ? keys[0].slice(5) : "window";
  const str = base + rest.map(k => IDENT.test(k) ? "." + k : "[" + JSON.stringify(k) + "]").join("");
  S.pk.set(str, lx ? keys : ["window", ...keys]);
  return str;
}
function splitPath(p) {
  p = String(p);
  if (S.pk.has(p)) return S.pk.get(p).slice();
  return p.replace(/\[(["']?)(.*?)\1\]/g, ".$2").split(".").filter(Boolean);
}
function resolve(parts) {
  let o = W;
  for (let i = 0; i < parts.length; i++) {
    const k = parts[i];
    if (i === 0) {
      if (isLex(k)) { o = lexGet(k.slice(5)); continue; }
      if (k === "window") continue;
      if (!(k in W) && LEXOK(k)) { o = lexGet(k); continue; }
    }
    if (o == null) return undefined;
    o = o[k];
  }
  return o;
}
function assign(parts, val) {
  const ps = parts.filter((k, i) => !(i === 0 && k === "window"));
  if (ps.length === 1) {
    const k = ps[0];
    if (isLex(k)) { lexSet(k.slice(5), val); return; }
    if (!(k in W) && LEXOK(k)) { lexSet(k, val); return; }
  }
  const last = ps.pop();
  const o = resolve(ps);
  if (o == null) throw Error("Caminho inválido");
  o[last] = val;
}

let baseline = null;
function getBaseline() {
  if (baseline) return baseline;
  try {
    const f = D.createElement("iframe"); f.style.display = "none";
    (D.body || D.documentElement).appendChild(f);
    baseline = new Set(Object.getOwnPropertyNames(f.contentWindow));
    f.remove();
  } catch (e) { baseline = new Set(); }
  return baseline;
}
function siteGlobals() {
  const b = getBaseline();
  const out = [];
  for (const k of Object.getOwnPropertyNames(W)) {
    if (b.has(k) || k.startsWith("__bp") || k.startsWith("__kl") || /^on/.test(k) || /^webkit/i.test(k)) continue;
    let v; try { v = W[k]; } catch (e) { continue; }
    if (v instanceof Node || v === W) continue;
    out.push([k, v]);
  }
  return out;
}

/* Congelamento contínuo */
const ft = setInterval(() => {
  S.frozen.forEach((v, p) => { try { S.fw = true; assign(splitPath(p), v); } catch (e) {} finally { S.fw = false; } });
}, 25);
window.__bpT.push(ft);

/* ---------- Sistema de Breakpoints JavaScript (Watchpoints + Bloqueio de Gasto + Stack Trace Humano) ---------- */
function humanStack(stack) {
  const lines = String(stack || "").split("\n").slice(2, 6).map(s => s.trim().replace(/^at\s+/, "")).filter(Boolean);
  if (!lines.length) return "Ação direta do usuário ou evento interno";
  const top = lines[0];
  if (/buy|purchase|comprar|spend|pay|debit|charge/i.test(top)) return "Função de compra/gasto: " + top.split(" ")[0];
  if (/damage|hit|attack|hurt/i.test(top)) return "Evento de dano/perda: " + top.split(" ")[0];
  if (/tick|interval|update|loop/i.test(top)) return "Loop automático do site: " + top.split(" ")[0];
  return "Origem: " + top.split(" ")[0];
}

function setBreakpoint(path, mode) {
  let L = S.locks.get(path);
  if (L) {
    if (L.mode === mode) {
      try { Object.defineProperty(L.parent, L.name, { value: L.val, writable: true, configurable: true, enumerable: L.en }); } catch (e) {}
      S.locks.delete(path);
      msg("Breakpoint removido de " + path);
      return;
    }
    L.mode = mode;
    if (mode === "freeze") L.lockedVal = L.val;
    msg("Breakpoint atualizado: " + mode);
    return;
  }
  const keys = splitPath(path).filter((k, i) => !(i === 0 && k === "window"));
  const name = keys.pop();
  if (name == null || isLex(name) || (keys.length === 0 && !(name in W))) {
    msg("Variável let/const global: use Congelar");
    return;
  }
  const parent = keys.length ? resolve(keys) : W;
  if (parent == null) { msg("Caminho inválido"); return; }
  const d = Object.getOwnPropertyDescriptor(parent, name);
  if (!d || !d.configurable || !("value" in d)) {
    msg("Propriedade protegida: use Congelar");
    return;
  }
  L = { parent, name, val: d.value, en: d.enumerable, mode, lockedVal: d.value, hits: 0 };
  Object.defineProperty(parent, name, {
    configurable: true,
    enumerable: d.enumerable,
    get() { return L.val; },
    set(x) {
      if (S.fw) { L.val = x; return; }
      const prev = L.val;
      let applied = x;
      let blocked = false;
      if (L.mode === "freeze" || L.mode === "lock") {
        applied = L.lockedVal ?? prev;
        blocked = x !== applied;
      } else if (L.mode === "block_decrease" && typeof prev === "number" && typeof x === "number" && x < prev) {
        applied = prev;
        blocked = true;
      } else if (L.mode === "multiply" && typeof prev === "number" && typeof x === "number" && x > prev) {
        applied = prev + (x - prev) * 2;
      }
      L.val = applied;
      L.hits++;
      const detail = (blocked ? "[BLOQUEADO] " : "") + show(prev) + " -> " + show(x) + " (final: " + show(applied) + ") · " + humanStack(new Error().stack);
      S.bpHits.unshift({ time: new Date().toLocaleTimeString(), target: path, mode: L.mode, detail });
      if (S.bpHits.length > 150) S.bpHits.pop();
      S.logs.push({ l: "warn", t: new Date().toLocaleTimeString(), m: "BREAKPOINT " + path + ": " + detail });
    }
  });
  S.locks.set(path, L);
  msg("Breakpoint ativo (" + mode + ") em " + path);
}

/* ---------- Tradutor Semântico (Zero Conhecimento de Programação) ---------- */
const SEM_CATS = [
  { id: "economia", re: /(balance|saldo|money|dinheiro|cash|wallet|carteira|gold|ouro|coin|coins|moeda|gems|price|preco|cost|custo|valor|budget|credito)/i, label: "Dinheiro & Preços", desc: "Controla saldo, moedas ou preços de itens. Pode ser monitorado para variação em tempo real." },
  { id: "status", re: /(hp|health|vida|life|energy|energia|stamina|mana|shield|escudo|level|nivel|xp|score|pontos)/i, label: "Vida & Atributos", desc: "Status principal do personagem/usuário. Ideal para congelar ou bloquear perda." },
  { id: "inventario", re: /(shop|store|loja|catalog|items|itens|inventory|inventario|bag|cart|products|produtos)/i, label: "Loja & Inventário", desc: "Lista de produtos, preços e estoque disponíveis na sessão." },
  { id: "seguranca", re: /(token|auth|secret|segredo|pass|senha|key|jwt|session|admin|vip|flag)/i, label: "Segredos & Acesso", desc: "Chave de acesso, senha ou permissão do sistema." },
  { id: "logica", re: /(buy|purchase|comprar|spend|gastar|pay|heal|add|reward)/i, label: "Ação Executável", desc: "Função que altera valores quando um botão é pressionado." }
];
const SYN = [
  ["dinheiro", "saldo", "reais", "moeda", "ouro", "grana", "money", "cash", "balance", "wallet", "gold", "coins", "brl", "credit"],
  ["preco", "preço", "valor", "custo", "barato", "acessivel", "loja", "item", "price", "cost", "shop", "store", "catalog", "cheap"],
  ["vida", "hp", "saude", "energia", "escudo", "imortal", "health", "life", "energy", "stamina", "shield"],
  ["comprar", "gastar", "pagar", "descontar", "buy", "purchase", "spend", "pay", "deduct"],
  ["senha", "token", "chave", "segredo", "admin", "vip", "password", "secret", "key", "auth", "flag"]
];

function explainHuman(path, val) {
  const leaf = String(path).split(".").pop() || path;
  for (const c of SEM_CATS) {
    if (c.re.test(path) || c.re.test(leaf)) {
      return { cat: c.id, title: c.label + " · " + leaf, desc: c.desc };
    }
  }
  if (typeof val === "function") return { cat: "logica", title: "Ação (" + leaf + ")", desc: "Função automática que executa alguma lógica quando acionada." };
  if (typeof val === "number") return { cat: "status", title: "Número (" + leaf + ")", desc: "Valor numérico salvo na memória (pode ser saldo, pontuação ou contador)." };
  if (typeof val === "boolean") return { cat: "interface", title: "Chave Sim/Não (" + leaf + ")", desc: "Controla se um recurso está ligado ou desligado." };
  return { cat: "interface", title: "Dado (" + leaf + ")", desc: "Informação textual ou estruturada da página." };
}

/* ---------- Radar de Orçamento, Variações em Tempo Real & Itens Acessíveis ---------- */
const RD = S.rd = S.rd || {
  initialVal: "",
  trackedPath: "",
  candidates: [],
  watchOn: true,
  lastTick: "",
  items: [],
  semFilter: "all",
  semQuery: ""
};

function scanItemsAndPrices() {
  const found = [];
  const seenObj = new WeakSet();
  const walk = (o, p, d) => {
    if (!o || typeof o !== "object" || d > 5 || seenObj.has(o) || o instanceof Node || o === W) return;
    seenObj.add(o);
    if (Array.isArray(o)) {
      o.forEach((el, idx) => {
        if (el && typeof el === "object" && !Array.isArray(el)) {
          const pr = typeof el.price === "number" ? el.price : typeof el.cost === "number" ? el.cost : typeof el.valor === "number" ? el.valor : typeof el.preco === "number" ? el.preco : null;
          const nm = el.name ?? el.title ?? el.nome ?? el.label;
          if (pr !== null && typeof nm === "string") {
            found.push({ name: nm, price: pr, prev: el.previousPrice ?? el.basePrice, cat: el.category || el.categoria || "Runtime", src: p + "[" + idx + "]" });
          }
        }
        walk(el, p + "[" + idx + "]", d + 1);
      });
    } else {
      Object.keys(o).slice(0, 50).forEach(k => {
        try { walk(o[k], p + "." + k, d + 1); } catch (e) {}
      });
    }
  };
  siteGlobals().forEach(([k, v]) => walk(v, "window." + k, 0));

  /* Também detecta preços visíveis no DOM */
  D.querySelectorAll("[data-bp-item]").forEach(el => {
    const nm = el.getAttribute("data-bp-name") || el.textContent.trim().slice(0, 40);
    const pr = Number(el.getAttribute("data-bp-price"));
    if (!Number.isNaN(pr) && !found.some(f => f.name === nm && f.price === pr)) {
      found.push({ name: nm, price: pr, cat: el.getAttribute("data-bp-category") || "Página", src: "DOM" });
    }
  });
  RD.items = found.sort((a, b) => a.price - b.price);
  return RD.items;
}

function takeBudgetSnapshot(targetVal) {
  const num = Number(targetVal);
  if (Number.isNaN(num)) { msg("Digite um número inicial (ex: 100)"); return; }
  RD.initialVal = num;
  RD.candidates = [];
  const seen = new WeakSet();
  const walk = (o, keys, d) => {
    if (!o || typeof o !== "object" || d > 6 || seen.has(o) || o instanceof Node || o === W) return;
    seen.add(o);
    let ks; try { ks = Object.getOwnPropertyNames(o).slice(0, 120); } catch (e) { return; }
    for (const k of ks) {
      if (Array.isArray(o) && k === "length") continue;
      let v; try { v = o[k]; } catch (e) { continue; }
      const np = keys.concat(k);
      if (typeof v === "number" && v === num) {
        const ps = pstr(np);
        RD.candidates.push({ keys: np, path: ps, init: v, prev: v, curr: v, delta: 0, changes: 0, human: explainHuman(ps, v) });
      } else if (v && typeof v === "object") {
        walk(v, np, d + 1);
      }
    }
  };
  siteGlobals().forEach(([k, v]) => {
    if (typeof v === "number" && v === num) {
      const ps = pstr(["window", k]);
      RD.candidates.push({ keys: ["window", k], path: ps, init: v, prev: v, curr: v, delta: 0, changes: 0, human: explainHuman(ps, v) });
    } else if (v && typeof v === "object") {
      walk(v, ["window", k], 1);
    }
  });
  scanItemsAndPrices();
  if (RD.candidates.length === 1) RD.trackedPath = RD.candidates[0].path;
  msg("Snapshot salvo (" + num + "): " + RD.candidates.length + " variáveis encontradas!");
}

function pollBudgetVariations() {
  if (!RD.candidates.length) return;
  let changedAny = false;
  RD.candidates.forEach(c => {
    let cur; try { cur = resolve(c.keys); } catch (e) { return; }
    if (typeof cur === "number" && cur !== c.curr) {
      c.prev = c.curr;
      c.curr = cur;
      c.delta = cur - c.init;
      c.changes++;
      changedAny = true;
      if (!RD.trackedPath || c.human.cat === "economia") {
        RD.trackedPath = c.path;
      }
    }
  });
  if (changedAny) {
    RD.lastTick = new Date().toLocaleTimeString();
    scanItemsAndPrices();
  }
  updateHud();
}

window.__bpT.push(setInterval(() => {
  if (RD.watchOn) pollBudgetVariations();
}, 400));

function getLiveBalance() {
  if (RD.trackedPath) {
    try {
      const v = resolve(splitPath(RD.trackedPath));
      if (typeof v === "number") return v;
    } catch (e) {}
  }
  if (RD.candidates.length) {
    const changed = RD.candidates.find(c => c.changes > 0) || RD.candidates[0];
    return changed.curr;
  }
  return RD.initialVal !== "" ? Number(RD.initialVal) : null;
}

function updateHud() {
  const bal = getLiveBalance();
  const affordable = bal != null ? RD.items.filter(i => i.price <= bal).length : 0;
  HUD.innerHTML = "";
  HUD.append(
    h("span", null, "breakpoint-search"),
    bal != null ? h("b", null, "Saldo: " + bal) : null,
    bal != null ? h("span", { cls: "ok" }, affordable + " acessíveis") : null,
    S.bpHits.length ? h("span", { cls: "warn" }, S.bpHits.length + " BP") : null
  );
}

/* ---------- Editor de Valor + Botões Inteligentes ---------- */
function valueEditor(path, v, onSave) {
  const inp = h("input", { cls: "i", value: show(v) });
  const save = nv => {
    try {
      S.fw = true;
      try { assign(splitPath(path), nv); } finally { S.fw = false; }
      if (S.frozen.has(path)) S.frozen.set(path, nv);
      msg("Alterado: " + path + " = " + show(nv).slice(0, 50));
      onSave && onSave();
    } catch (e) { msg("Erro: " + e.message); }
  };
  const cur = () => resolve(splitPath(path));
  const quick = [];
  if (typeof v === "number") {
    [["+100", x => x + 100], ["×2", x => x * 2], ["-10", x => x - 10], ["999999", () => 999999], ["0", () => 0]].forEach(([l, f]) =>
      quick.push(btn(l, () => { const c = cur(); save(f(typeof c === "number" ? c : Number(inp.value))); }))
    );
  }
  if (typeof v === "boolean") quick.push(btn("Alternar", () => save(!cur())));
  const fz = btn(S.frozen.has(path) ? "Descongelar" : "Congelar", () => {
    if (S.frozen.has(path)) { S.frozen.delete(path); } else { S.frozen.set(path, parse(inp.value)); }
    drawBody();
  }, S.frozen.has(path) ? "on" : "");
  const L = S.locks.get(path);
  return h("div", null,
    h("div", { cls: "row mt" }, inp, btn("Aplicar", () => save(parse(inp.value)), "g")),
    h("div", { cls: "q" }, quick, fz,
      btn(L && L.mode === "block_decrease" ? "BP: Gasto Bloqueado" : "Bloquear Gasto (BP)", () => { setBreakpoint(path, "block_decrease"); drawBody(); }, L && L.mode === "block_decrease" ? "am" : ""),
      btn(L && L.mode === "log" ? "Parar Monitor BP" : "Monitorar Origem", () => { setBreakpoint(path, "log"); drawBody(); }, L && L.mode === "log" ? "on" : ""),
      btn("Copiar", () => copy(inp.value))
    )
  );
}

/* ---------- Scanner de Fontes (herdado & otimizado) ---------- */
const SRC = S.src = S.src || { items: new Map(), seen: new Set(), run: false, ran: false, finds: [] };
function lexList() { return []; }

/* ---------- Abas do breakpoint-search ---------- */
const TABS = {
  radar: {
    n: "Radar & Cheat",
    live: true,
    render(B) {
      const bal = getLiveBalance();
      const inp = h("input", { cls: "i", placeholder: "Ex: 100 (seu dinheiro/vida atual)", value: RD.initialVal === "" ? "" : String(RD.initialVal) });
      B.appendChild(h("div", { cls: "c" },
        h("b", null, "Radar de Orçamento & Variações (Modo Cheat PC)"),
        h("div", { cls: "mu mt" }, "Coloque seu saldo atual (ex: 100). Salve, gaste ou ganhe no site/jogo e o sistema detecta sozinho a variação e destaca os itens mais acessíveis em tempo real."),
        h("div", { cls: "row mt" }, inp, btn("Salvar & Monitorar", () => { takeBudgetSnapshot(inp.value); drawBody(); }, "g")),
        h("div", { cls: "q" },
          btn(RD.watchOn ? "Monitoramento: ATIVO" : "Monitoramento: Pausado", () => { RD.watchOn = !RD.watchOn; drawBody(); }, RD.watchOn ? "on" : ""),
          btn("Filtrar: Só que Mudaram", () => { RD.candidates = RD.candidates.filter(c => c.changes > 0); drawBody(); }),
          btn("Filtrar: Diminuíram", () => { RD.candidates = RD.candidates.filter(c => c.curr < c.init); drawBody(); }),
          btn("Escanear Preços", () => { scanItemsAndPrices(); drawBody(); }),
          RD.candidates.length ? btn("Limpar", () => { RD.candidates = []; RD.trackedPath = ""; drawBody(); }, "r") : null
        )
      ));

      if (bal !== null) {
        const items = RD.items.length ? RD.items : scanItemsAndPrices();
        const affordable = items.filter(it => it.price <= bal);
        B.appendChild(h("div", { cls: "c" },
          h("div", { cls: "row sp" },
            h("b", null, "Itens Acessíveis Agora (" + affordable.length + " de " + items.length + ")"),
            h("b", { cls: "ok mono" }, "Saldo: " + bal)
          ),
          !affordable.length
            ? h("div", { cls: "mu mt" }, "Nenhum item encontrado abaixo de " + bal + " no momento.")
            : affordable.slice(0, 12).map(it =>
                h("div", { cls: "lg price-ok row sp" },
                  h("div", null, h("b", null, it.name), h("div", { cls: "mu" }, it.cat + " · " + it.src)),
                  h("div", { style: "text-align:right" },
                    h("b", { cls: "ok mono" }, "Preço: " + it.price),
                    h("div", { cls: "mu mono" }, "Sobra: " + (bal - it.price).toFixed(2).replace(/\.00$/, ""))
                  )
                )
              )
        ));
      }

      if (RD.candidates.length) {
        B.appendChild(h("div", { cls: "mu", style: "margin:6px 0" }, RD.candidates.length + " variável(is) monitorada(s)" + (RD.lastTick ? " · última variação " + RD.lastTick : "")));
        RD.candidates.slice(0, 60).forEach(c => {
          const diff = c.curr - c.init;
          const isTracked = RD.trackedPath === c.path;
          B.appendChild(h("div", { cls: "c" },
            h("div", { cls: "row sp" },
              h("div", null,
                h("div", { cls: "k mono" }, c.path),
                h("div", { cls: "mu" }, c.human.title)
              ),
              btn(isTracked ? "Saldo Principal" : "Definir Saldo", () => { RD.trackedPath = c.path; drawBody(); }, isTracked ? "g" : "")
            ),
            h("div", { cls: "mu mono mt" }, "Inicial: " + c.init + " · Atual: " + c.curr + " · Variação: " + (diff > 0 ? "+" + diff : diff) + " (" + c.changes + "x)"),
            valueEditor(c.path, c.curr, () => drawBody())
          ));
        });
      }
    }
  },

  sem: {
    n: "Busca Semântica",
    render(B) {
      const qi = h("input", { cls: "i", placeholder: 'Pergunte em português: "onde fica meu dinheiro", "vida", "itens baratos"...', value: RD.semQuery });
      qi.oninput = () => { RD.semQuery = qi.value; };
      const runSearch = () => drawBody();

      const cats = [
        ["all", "Tudo"], ["economia", "Dinheiro & Preços"], ["status", "Vida & Status"],
        ["inventario", "Loja & Itens"], ["logica", "Funções"], ["seguranca", "Segredos"]
      ];

      const aiResBox = h("div");
      const askAiServer = async () => {
        if (!S.bridgeUrl) { msg("Abra no Studio para análise Gemini ou use a busca local imediata."); return; }
        msg("Consultando Gemini IA...");
        const all = collectAllSymbols().slice(0, 100).map(s => ({ path: s.path, type: typeof s.val, value: show(s.val).slice(0, 120) }));
        try {
          const r = await (S.of || W.fetch.bind(W))(S.bridgeUrl + "/api/semantic/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: RD.semQuery || "encontrar variáveis importantes", filters: { category: RD.semFilter }, snapshot: all })
          });
          const data = await r.json();
          if (data.error) throw new Error(data.error);
          aiResBox.textContent = "";
          aiResBox.appendChild(h("div", { cls: "c" },
            h("b", { cls: "ok" }, "Resposta Semântica IA: " + (data.detectedIntent || "")),
            h("div", { cls: "mt" }, data.summary || "")
          ));
          (data.matches || []).forEach(m => {
            aiResBox.appendChild(h("div", { cls: "c" },
              h("div", { cls: "row sp" }, h("b", null, m.humanTitle), metaLine(m.category, m.safety, m.relevance + "%")),
              h("div", { cls: "k mono mt" }, m.path),
              h("div", { cls: "mu mt" }, m.plainExplanation),
              h("div", { cls: "q" },
                btn("Bloquear Gasto (BP)", () => { setBreakpoint(m.path, "block_decrease"); drawBody(); }, "am"),
                btn("Inspecionar", () => { S.root = m.path; S.path = []; S.tab = "obj"; draw(); })
              )
            ));
          });
          msg("Busca IA concluída!");
        } catch (e) {
          msg("Erro IA: " + e.message);
        }
      };

      B.appendChild(h("div", { cls: "c" },
        h("div", { cls: "row" }, qi, btn("Buscar", runSearch, "g"), S.bridgeUrl ? btn("IA Gemini", askAiServer, "on") : null),
        h("div", { cls: "q" }, cats.map(([id, lbl]) => btn(lbl, () => { RD.semFilter = id; drawBody(); }, RD.semFilter === id ? "on" : "")))
      ));
      B.appendChild(aiResBox);

      const results = runLocalSemantic(RD.semQuery, RD.semFilter);
      B.appendChild(h("div", { cls: "mu", style: "margin-bottom:6px" }, results.length + " correspondências traduzidas para linguagem simples"));
      results.slice(0, 60).forEach(r => {
        const prim = r.val === null || ["number", "string", "boolean", "undefined"].includes(typeof r.val);
        B.appendChild(h("div", { cls: "c" },
          h("div", { cls: "row sp" },
            h("b", null, r.human.title),
            metaLine(r.human.cat, r.score + "% match")
          ),
          h("div", { cls: "k mono mt" }, r.path),
          h("div", { cls: "mu mt" }, r.human.desc),
          prim ? valueEditor(r.path, r.val, () => drawBody()) : h("div", { cls: "q" }, btn("Abrir Objeto", () => { S.root = r.path; S.path = []; S.tab = "obj"; draw(); }))
        ));
      });
    }
  },

  bp: {
    n: "Breakpoints JS",
    live: true,
    render(B) {
      const pInp = h("input", { cls: "i", placeholder: "Caminho JS (ex: window.__GAME_STATE__.wallet.balance)" });
      const rInp = h("input", { cls: "i", placeholder: "Filtro URL de rede para bloquear (ex: telemetry, spend)" });
      B.appendChild(h("div", { cls: "c" },
        h("b", null, "Breakpoints JavaScript & Watchpoints"),
        h("div", { cls: "mu mt" }, "Intercepte qualquer alteração de variável em tempo real para descobrir qual função alterou ou impedir que o saldo/vida diminua."),
        h("div", { cls: "row mt" }, pInp, btn("Bloquear Redução", () => { if (pInp.value) setBreakpoint(pInp.value, "block_decrease"); drawBody(); }, "am"), btn("Monitorar", () => { if (pInp.value) setBreakpoint(pInp.value, "log"); drawBody(); }, "g")),
        h("div", { cls: "row mt" }, rInp, btn("Bloquear URL Rede", () => { if (rInp.value) { S.netRules.push({ pattern: rInp.value, action: "block", active: true }); drawBody(); } }, "r"))
      ));

      if (S.locks.size) {
        B.appendChild(h("b", { style: "display:block;margin:6px 0" }, "Breakpoints Ativos (" + S.locks.size + ")"));
        S.locks.forEach((L, path) => {
          B.appendChild(h("div", { cls: "c row sp" },
            h("div", null, h("div", { cls: "k mono" }, path), h("div", { cls: "mu" }, "Modo: " + L.mode + " · Disparos: " + L.hits + " · Valor: " + show(L.val))),
            btn("Remover", () => { setBreakpoint(path, L.mode); drawBody(); }, "r")
          ));
        });
      }

      if (S.netRules.length) {
        B.appendChild(h("b", { style: "display:block;margin:6px 0" }, "Regras de Rede (" + S.netRules.length + ")"));
        S.netRules.forEach((r, idx) => {
          B.appendChild(h("div", { cls: "c row sp" },
            h("span", { cls: "mono" }, "BLOQUEAR *" + r.pattern + "*"),
            btn("Remover", () => { S.netRules.splice(idx, 1); drawBody(); }, "r")
          ));
        });
      }

      B.appendChild(h("div", { cls: "row sp mt", style: "margin-bottom:4px" },
        h("b", null, "Histórico de Capturas (" + S.bpHits.length + ")"),
        S.bpHits.length ? btn("Limpar", () => { S.bpHits = []; drawBody(); }) : null
      ));
      S.bpHits.slice(0, 60).forEach(hit => {
        B.appendChild(h("div", { cls: "lg warn" }, hit.time + " · " + hit.target + "\n" + hit.detail));
      });
    }
  },

  obj: {
    n: "Objetos",
    search: true,
    render(B) {
      const full = [...splitPath(S.root), ...S.path];
      const o = resolve(full);
      const ps = pstr(full);
      const inp = h("input", { cls: "i", value: ps });
      B.appendChild(h("div", { cls: "row", style: "margin-bottom:6px" }, inp, btn("Ir", () => { S.root = inp.value; S.path = []; draw(); }, "g"), S.path.length ? btn("Voltar", () => { S.path.pop(); draw(); }) : null));
      if (o == null || (typeof o !== "object" && typeof o !== "function")) {
        B.appendChild(h("div", { cls: "c" }, valueEditor(ps, o)));
        return;
      }
      let keys = [];
      try { keys = Object.getOwnPropertyNames(o); } catch (e) {}
      keys = keys.filter(k => k.toLowerCase().includes(S.q));
      keys.slice(0, 150).forEach(k => {
        let v; try { v = o[k]; } catch (e) { v = "[restrito]"; }
        const prim = v === null || !["object", "function"].includes(typeof v);
        const kp = pstr([...full, k]);
        B.appendChild(h("div", { cls: "c" },
          h("div", { cls: "row sp" }, h("span", { cls: "k" }, k), prim ? null : btn("Abrir ›", () => { S.path.push(k); draw(); })),
          prim ? valueEditor(kp, v) : h("div", { cls: "mu mono mt" }, show(v).slice(0, 120))
        ));
      });
    }
  },

  store: {
    n: "Storage",
    search: true,
    render(B) {
      const sec = (name, st) => {
        let keys = [];
        try { keys = Object.keys(st); } catch (e) { return; }
        B.appendChild(h("b", { style: "display:block;margin:8px 0 4px" }, name + " (" + keys.length + ")"));
        keys.filter(k => k.toLowerCase().includes(S.q)).forEach(k => {
          const v = st.getItem(k) || "";
          const ta = h("textarea", { rows: 2 }); ta.value = v;
          B.appendChild(h("div", { cls: "c" },
            h("span", { cls: "k" }, k),
            h("div", { cls: "mt" }, ta),
            h("div", { cls: "q" }, btn("Salvar", () => { st.setItem(k, ta.value); msg("Salvo"); }, "g"), btn("Apagar", () => { st.removeItem(k); draw(); }, "r"))
          ));
        });
      };
      sec("localStorage", W.localStorage);
      sec("sessionStorage", W.sessionStorage);
    }
  },

  net: {
    n: "Rede",
    search: true,
    live: true,
    render(B) {
      B.appendChild(h("div", { cls: "row sp", style: "margin-bottom:6px" },
        h("span", { cls: "mu" }, S.net.length + " requisições capturadas"),
        btn("Limpar", () => { S.net.length = 0; draw(); }, "r")
      ));
      S.net.filter(n => (n.url + n.method + n.status).toLowerCase().includes(S.q)).slice(0, 100).forEach(n => {
        B.appendChild(h("details", { cls: "c" },
          h("summary", null,
            h("div", { cls: "row sp" }, h("b", { cls: n.status >= 200 && n.status < 400 ? "ok" : "warn" }, String(n.status) + " " + n.method), metaLine(n.ms + "ms", n.time)),
            h("div", { cls: "mono mu mt" }, n.url)
          ),
          n.reqBody ? h("div", { cls: "mono mt" }, "Enviado: " + n.reqBody) : null,
          h("div", { cls: "mono mt", style: "max-height:180px;overflow:auto" }, "Resposta: " + (n.resBody || "(vazio)")),
          h("div", { cls: "q" }, btn("Bloquear este endpoint", () => { S.netRules.push({ pattern: n.url.split("?")[0].slice(-30), action: "block", active: true }); S.tab = "bp"; draw(); }, "r"), btn("Copiar URL", () => copy(n.url)))
        ));
      });
    }
  },

  el: {
    n: "Elementos",
    render(B) {
      B.appendChild(h("div", { cls: "q", style: "margin-bottom:6px" },
        btn("Selecionar na Página (Toque/Clique)", pick, "g"),
        btn("Editar Textos Livres", () => { D.body.contentEditable = D.body.contentEditable === "true" ? "false" : "true"; msg("Edição: " + D.body.contentEditable); })
      ));
      const el = S.sel;
      if (!el) { B.appendChild(h("div", { cls: "mu" }, "Toque em Selecionar e clique em qualquer preço, botão ou texto da página.")); return; }
      const ta = h("textarea", { rows: 3 }); ta.value = el.textContent.slice(0, 1000);
      B.appendChild(h("div", { cls: "c" },
        h("div", { cls: "k mono" }, el.tagName.toLowerCase() + (el.id ? "#" + el.id : "")),
        h("div", { cls: "mt" }, ta),
        h("div", { cls: "q" }, btn("Aplicar Texto", () => { el.textContent = ta.value; }, "g"), btn("Esconder", () => { el.style.display = "none"; }), btn("Remover", () => { el.remove(); S.sel = null; draw(); }, "r"))
      ));
    }
  },

  con: {
    n: "Console",
    live: true,
    render(B) {
      const ta = h("textarea", { rows: 2, placeholder: "Execute JavaScript opcional..." });
      ta.value = S.code || "";
      ta.oninput = () => S.code = ta.value;
      const run = () => {
        try {
          const r = (0, eval)(ta.value);
          S.logs.push({ l: "res", t: "", m: "← " + fmt(r) });
        } catch (e) { S.logs.push({ l: "error", t: "", m: "✖ " + e.message }); }
        draw();
      };
      B.appendChild(h("div", null, ta, h("div", { cls: "q" }, btn("Executar", run, "g"), btn("Limpar", () => { S.logs.length = 0; draw(); }, "r"))));
      const box = h("div", { cls: "mt" });
      S.logs.slice(-150).forEach(x => box.appendChild(h("div", { cls: "lg " + x.l }, (x.t ? x.t + " " : "") + x.m)));
      B.appendChild(box);
    }
  }
};

function collectAllSymbols() {
  const out = [];
  const seen = new WeakSet();
  const walk = (o, keys, d) => {
    if (!o || typeof o !== "object" || d > 4 || seen.has(o) || o instanceof Node || o === W) return;
    seen.add(o);
    let ks; try { ks = Object.getOwnPropertyNames(o).slice(0, 60); } catch (e) { return; }
    for (const k of ks) {
      if (Array.isArray(o) && k === "length") continue;
      let v; try { v = o[k]; } catch (e) { continue; }
      const np = keys.concat(k);
      const ps = pstr(np);
      out.push({ path: ps, val: v, human: explainHuman(ps, v) });
      if (v && typeof v === "object") walk(v, np, d + 1);
    }
  };
  siteGlobals().forEach(([k, v]) => {
    const ps = pstr(["window", k]);
    out.push({ path: ps, val: v, human: explainHuman(ps, v) });
    if (v && typeof v === "object") walk(v, ["window", k], 1);
  });
  return out;
}

function runLocalSemantic(q, cat) {
  const syms = collectAllSymbols();
  const ql = String(q || "").trim().toLowerCase();
  const tokens = ql.split(/[\s,.;!?]+/).filter(t => t.length >= 2);
  const exp = new Set(tokens);
  tokens.forEach(t => SYN.forEach(cl => { if (cl.some(w => w.includes(t) || t.includes(w))) cl.forEach(w => exp.add(w)); }));
  const numM = ql.match(/\b(\d+(?:[.,]\d+)?)\b/);
  const hintNum = numM ? Number(numM[1].replace(",", ".")) : null;
  const out = [];
  syms.forEach(s => {
    if (cat !== "all" && s.human.cat !== cat) return;
    let score = 0;
    const hay = (s.path + " " + s.human.title + " " + s.human.desc + " " + (typeof s.val === "object" ? "" : String(s.val))).toLowerCase();
    if (!ql) score = typeof s.val === "number" ? 75 : 45;
    else {
      if (s.path.toLowerCase().includes(ql)) score += 60;
      exp.forEach(t => { if (hay.includes(t)) score += tokens.includes(t) ? 28 : 14; });
      if (hintNum !== null && s.val === hintNum) score += 50;
    }
    if (score > 0) out.push({ ...s, score: Math.min(100, score) });
  });
  return out.sort((a, b) => b.score - a.score);
}

function pick() {
  P.style.display = "none";
  const box = D.createElement("div");
  box.style.cssText = "position:fixed;pointer-events:none;z-index:2147483646;border:2px solid #38bdf8;background:#38bdf822";
  D.documentElement.appendChild(box);
  const at = (x, y) => {
    const e = D.elementFromPoint(x, y);
    if (e && e !== host) {
      const r = e.getBoundingClientRect();
      Object.assign(box.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    }
    return e;
  };
  const mv = e => { const p = e.touches ? e.touches[0] : e; at(p.clientX, p.clientY); };
  const end = e => {
    e.preventDefault(); e.stopPropagation();
    const p = e.changedTouches ? e.changedTouches[0] : e;
    const el = at(p.clientX, p.clientY);
    box.remove();
    D.removeEventListener("mousemove", mv, true);
    D.removeEventListener("touchmove", mv, true);
    D.removeEventListener("click", end, true);
    D.removeEventListener("touchend", end, true);
    P.style.display = "";
    if (el) { S.sel = el; S.tab = "el"; draw(); }
  };
  setTimeout(() => {
    D.addEventListener("mousemove", mv, true);
    D.addEventListener("touchmove", mv, { capture: true, passive: true });
    D.addEventListener("click", end, true);
    D.addEventListener("touchend", end, { capture: true, passive: false });
  }, 50);
}

let body, qInp, sub, nav;
function shell() {
  P.textContent = "";
  const hd = h("div", { cls: "hdr" },
    h("b", null, "breakpoint-search"),
    h("div", { cls: "row" },
      btn("Mini HUD", () => { P.classList.add("hidden"); updateHud(); HUD.style.display = "flex"; }),
      btn("Mobile/PC", () => P.classList.toggle("m")),
      btn("✕", close, "r")
    )
  );
  if (mobile) hd.prepend(h("div", { style: "position:absolute;left:0;right:0;top:3px" }, h("div", { cls: "grip" })));
  nav = h("div", { cls: "nav" });
  Object.entries(TABS).forEach(([k, t]) => nav.appendChild(h("button", { cls: "nb" + (S.tab === k ? " a" : ""), "data-t": k, onclick: () => { S.tab = k; S.q = ""; qInp.value = ""; draw(); } }, t.n)));
  qInp = h("input", { cls: "i", placeholder: "Filtrar...", oninput: e => { S.qraw = e.target.value; S.q = S.qraw.toLowerCase(); clearTimeout(S.qt); S.qt = setTimeout(drawBody, 150); } });
  sub = h("div", { cls: "sub" }, qInp);
  body = h("div", { cls: "body" });
  msgEl = h("span", null, "Pronto. Sem precisar saber programar.");
  P.append(hd, nav, sub, body, h("div", { cls: "ft" }, msgEl, h("div", { cls: "row" }, btn("↻", drawBody), btn("Descongelar " + S.frozen.size, () => { S.frozen.clear(); drawBody(); }))));
  drag(hd);
}
function drawBody() {
  if (!body) return;
  const sc = body.scrollTop;
  body.textContent = "";
  const t = TABS[S.tab];
  sub.style.display = t.search ? "flex" : "none";
  try { t.render(body); } catch (e) { body.appendChild(h("div", { cls: "bad" }, "Erro: " + e.message)); }
  body.scrollTop = sc;
}
function draw() {
  [...nav.children].forEach(b => b.classList.toggle("a", b.dataset.t === S.tab));
  drawBody();
}
function close() {
  host.remove();
  (window.__bpT || []).forEach(clearInterval);
  window.__bpT = [];
}
function drag(hd) {
  let sx, sy, ox, oy, on = false;
  const down = e => {
    if (e.target.closest("button")) return;
    const p = e.touches ? e.touches[0] : e;
    on = true; sx = p.clientX; sy = p.clientY;
    const r = P.getBoundingClientRect(); ox = r.left; oy = r.top;
  };
  const move = e => {
    if (!on) return;
    const p = e.touches ? e.touches[0] : e;
    if (P.classList.contains("m")) {
      const nh = Math.max(180, Math.min(innerHeight - 20, innerHeight - oy - (p.clientY - sy)));
      P.style.height = nh + "px";
    } else {
      P.style.left = Math.max(0, Math.min(innerWidth - 80, ox + p.clientX - sx)) + "px";
      P.style.top = Math.max(0, Math.min(innerHeight - 40, oy + p.clientY - sy)) + "px";
      P.style.right = "auto";
    }
    if (e.cancelable) e.preventDefault();
  };
  const up = () => on = false;
  hd.addEventListener("mousedown", down);
  hd.addEventListener("touchstart", down, { passive: true });
  W.addEventListener("mousemove", move);
  W.addEventListener("touchmove", move, { passive: false });
  W.addEventListener("mouseup", up);
  W.addEventListener("touchend", up);
}

window.__bpT.push(setInterval(() => {
  const t = TABS[S.tab];
  const focused = R.activeElement && /INPUT|TEXTAREA/.test(R.activeElement.tagName);
  if (focused || (body && body.querySelector("details[open]"))) return;
  if (t && t.live) drawBody();
}, 1400));

shell();
draw();
})();