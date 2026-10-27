/*!
 * ⚡ ELVIS DEV v2 — inspetor de DOM flutuante (bookmarklet / console / .js)
 *
 * Como usar:
 *  - Cole no console, carregue como <script src="elvis-dev.js"> ou
 *    transforme em bookmarklet: javascript:(()=>{ ...conteúdo... })();
 *  - Rodar de novo (ou clicar em ×) fecha o inspetor.
 *
 * Novidades:
 *  - Minimizar (—) vira um ícone 🔑 flutuante, arrastável, no canto superior esquerdo.
 *  - Painel arrastável e redimensionável (posição/tamanho ficam salvos).
 *  - Shadow DOM: o CSS do site não quebra o painel.
 *  - Caixa de destaque com tamanho do elemento + hover ao selecionar.
 *  - Navegação: Pai / Filho / Irmão anterior / próximo.
 *  - Busca por seletor CSS (Enter percorre os resultados).
 *  - Abas: HTML, Texto, CSS (inline + regras aplicadas), Calc (computed),
 *    Attr (editar atributos), Info (seletor, medidas) e JS (console com $0).
 *  - Copiar HTML / seletor, duplicar, ocultar, excluir e DESFAZER (até 50 ações).
 *  - Árvore atualiza sozinha (Live) quando a página muda.
 */
(() => {
  'use strict';

  const d = document;
  const w = window;
  const HOST_ID = 'elvis-inspector-host';

  /* ---------- toggle: se já existe, fecha ---------- */
  const prev = d.getElementById(HOST_ID);
  if (prev) {
    if (prev.__destroy) prev.__destroy();
    else prev.remove();
    return;
  }

  /* ---------- utilitários ---------- */
  const MAX_ROWS = 4000;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (v) =>
    String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const trunc = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);
  const cut = (s, n) => (s.length > n ? s.slice(0, n) + '\n… (' + (s.length - n) + ' caracteres omitidos)' : s);

  const store = {
    get(k, def) {
      try {
        const v = w.localStorage.getItem('elvisdev:' + k);
        return v ? JSON.parse(v) : def;
      } catch (e) {
        return def;
      }
    },
    set(k, v) {
      try {
        w.localStorage.setItem('elvisdev:' + k, JSON.stringify(v));
      } catch (e) {}
    },
  };

  const cleanups = [];
  const on = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts);
    cleanups.push(() => target.removeEventListener(type, fn, opts));
  };

  /* ---------- CSS do painel (dentro do Shadow DOM) ---------- */
  const CSS = `
:host{all:initial}
*{box-sizing:border-box}
button,input,textarea{font:inherit}
#panel{position:fixed;right:8px;bottom:8px;width:min(350px,94vw);height:min(65vh,550px);background:#17191f;color:#eee;font:12px/1.4 monospace;border:1px solid #505665;border-radius:9px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 4px 25px #0009;pointer-events:auto;z-index:2}
#panel.hidden{display:none}
#head{padding:10px;background:#252a35;display:flex;justify-content:space-between;align-items:center;touch-action:none;cursor:move;flex-shrink:0;user-select:none;-webkit-user-select:none}
button{background:#292e3a;color:#fff;border:1px solid #454b5a;border-radius:4px;padding:7px 8px;cursor:pointer;white-space:nowrap;flex-shrink:0}
button:active{background:#3a4254}
button.on{border-color:#168bff;color:#9fd0ff}
.row{display:flex;gap:4px;padding:5px 6px;background:#20242d;flex-shrink:0;overflow-x:auto;scrollbar-width:none}
.row::-webkit-scrollbar{display:none}
.row button{font-size:11px;padding:6px 8px}
#searchrow{display:flex;gap:4px;padding:5px 6px;background:#1c2029;align-items:center;flex-shrink:0}
#q{flex:1;min-width:0;background:#101217;color:#d9e8ff;border:1px solid #454b5a;border-radius:4px;padding:6px;font-size:11px}
#cnt{color:#9aa4b8;font-size:11px;min-width:34px;text-align:right}
#tree{overflow:auto;flex:1;min-height:60px;padding:4px;overscroll-behavior:contain}
#tree .n{white-space:nowrap;padding:6px 2px;cursor:pointer;border-radius:3px}
#tree .n:hover{background:#303746}
#tree .sel{background:#124a78;outline:1px solid #39a0ff}
#tree .tg{color:#69b7ff;font-weight:normal}
#tree i{font-style:normal;color:#d0a5ff}
#tree s{text-decoration:none;color:#9bd69b}
#tree .tx{color:#8c93a3;margin-left:6px}
#tree .arr{display:inline-block;width:18px;text-align:center;color:#aaa}
#tree .more{color:#e0a458;padding:8px}
#tabs button{flex:1;min-width:0;font-size:11px;padding:6px 4px}
#info{height:28%;min-height:60px;overflow:auto;border-top:1px solid #505665;padding:7px;white-space:pre-wrap;overflow-wrap:anywhere;flex-shrink:0;user-select:text;-webkit-user-select:text}
#info textarea{width:100%;height:56px;background:#101217;color:#d9e8ff;border:1px solid #555;padding:6px;resize:vertical;display:block;margin-bottom:5px}
#info pre{margin:6px 0 0;white-space:pre-wrap;overflow-wrap:anywhere;color:#cfd8ea;font:inherit}
#status{padding:4px 8px;font-size:10px;color:#8fa3c4;background:#13151a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;min-height:20px}
#editor{display:none;position:absolute;inset:38px 0 0;background:#17191f;z-index:5;flex-direction:column;padding:8px;gap:7px}
#editor.open{display:flex}
#editor textarea{flex:1;min-height:80px;width:100%;resize:none;background:#101217;color:#d9e8ff;border:1px solid #555;padding:8px}
#editor .actions{display:flex;gap:6px}
#editor .actions button{flex:1}
#resize{position:absolute;right:0;bottom:0;width:22px;height:22px;cursor:nwse-resize;touch-action:none;z-index:6;background:linear-gradient(135deg,transparent 50%,#6b7385 50%,#6b7385 58%,transparent 58%,transparent 70%,#6b7385 70%,#6b7385 78%,transparent 78%)}
#key{position:fixed;left:8px;top:8px;width:46px;height:46px;border-radius:50%;background:#17191f;border:2px solid #39a0ff;display:none;align-items:center;justify-content:center;font-size:24px;cursor:grab;box-shadow:0 3px 14px #000a;touch-action:none;user-select:none;-webkit-user-select:none;pointer-events:auto;z-index:3}
#key.show{display:flex}
#key.pick{border-color:#ff9f1a}
.box{position:fixed;pointer-events:none;display:none;border:2px solid #168bff;background:rgba(22,139,255,.16);z-index:1}
.box.hov{border-color:#ff9f1a;background:rgba(255,159,26,.16)}
.box .tag{position:absolute;left:-2px;top:-20px;background:#168bff;color:#fff;font:10px monospace;padding:2px 5px;white-space:nowrap;border-radius:3px}
.box.hov .tag{background:#ff9f1a;color:#000}
`;

  /* ---------- montagem do DOM do inspetor ---------- */
  const host = d.createElement('div');
  host.id = HOST_ID;
  host.style.cssText =
    'all:initial;position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML =
    '<style>' + CSS + '</style>' +
    '<div class="box hov" id="hovbox"><span class="tag"></span></div>' +
    '<div class="box" id="selbox"><span class="tag"></span></div>' +
    '<div id="panel">' +
      '<div id="head"><b>⚡ ELVIS DEV</b><span><button id="min" title="Minimizar">—</button> <button id="close" title="Fechar">×</button></span></div>' +
      '<div class="row" id="tools1">' +
        '<button id="pick">⌖ Selecionar</button><button id="edit">✎ Editar</button>' +
        '<button id="up">⬆ Pai</button><button id="down">⬇ Filho</button>' +
        '<button id="prev">◀</button><button id="next">▶</button>' +
      '</div>' +
      '<div class="row" id="tools2">' +
        '<button id="all">Expandir</button><button id="fold">Fechar tags</button>' +
        '<button id="copy">Copiar HTML</button><button id="copysel">Copiar seletor</button>' +
        '<button id="dup">Duplicar</button><button id="hide">Ocultar</button>' +
        '<button id="del">Excluir</button><button id="undo">↶ Desfazer</button>' +
        '<button id="live" class="on">Live: on</button>' +
      '</div>' +
      '<div id="searchrow"><input id="q" placeholder="Buscar seletor CSS (ex: .menu a)" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"><button id="go">Ir</button><span id="cnt"></span></div>' +
      '<div id="tree"></div>' +
      '<div class="row" id="tabs">' +
        '<button data-t="html">HTML</button><button data-t="text">Texto</button><button data-t="css">CSS</button>' +
        '<button data-t="calc">Calc</button><button data-t="attr">Attr</button><button data-t="info">Info</button><button data-t="js">JS</button>' +
      '</div>' +
      '<div id="info">Toque em Selecionar e escolha um elemento.</div>' +
      '<div id="status"></div>' +
      '<div id="editor"><b id="edlabel">Editar elemento</b><textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea><div class="actions"><button id="apply">Aplicar</button><button id="cancel">Cancelar</button></div></div>' +
      '<div id="resize"></div>' +
    '</div>' +
    '<div id="key" title="ELVIS DEV — toque para abrir, arraste para mover">🔑</div>';
  d.documentElement.appendChild(host);

  const $ = (q) => root.querySelector(q);
  const panel = $('#panel');
  const key = $('#key');
  const head = $('#head');
  const tree = $('#tree');
  const info = $('#info');
  const status = $('#status');
  const editor = $('#editor');
  const ta = editor.querySelector('textarea');
  const selBox = $('#selbox');
  const hovBox = $('#hovbox');
  const pickBtn = $('#pick');
  const undoBtn = $('#undo');
  const liveBtn = $('#live');
  const qInput = $('#q');
  const cnt = $('#cnt');
  const tabs = [...root.querySelectorAll('#tabs button')];

  /* ---------- estado ---------- */
  let selected = null;
  let mode = 'html';
  let edMode = 'html';
  let picking = false;
  let hovered = null;
  let live = true;
  let expanded = new WeakSet();
  let rowMap = new Map();
  const undos = [];
  const hiddenMap = new WeakMap();
  let jsCode = '';
  let jsOut = '';

  /* ---------- helpers de DOM ---------- */
  const inside = (e) => e.composedPath && e.composedPath().includes(host);
  const snap = (el) => [...el.attributes].map((a) => [a.name, a.value]);
  const restoreAttrs = (el, s) => {
    [...el.attributes].forEach((a) => el.removeAttribute(a.name));
    s.forEach(([n, v]) => {
      try { el.setAttribute(n, v); } catch (e) {}
    });
  };
  const prevEl = (el) => el.previousElementSibling;
  const nextEl = (el) => {
    let n = el.nextElementSibling;
    if (n === host) n = null;
    return n;
  };
  const shortLabel = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const c = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (c.length) s += '.' + c.join('.');
    return s;
  };
  const cssPath = (el) => {
    const esc2 = (s) => (w.CSS && CSS_ESCAPE ? CSS_ESCAPE(s) : s);
    if (el === d.documentElement) return 'html';
    if (el.id && d.querySelectorAll('#' + esc2(el.id)).length === 1) return '#' + esc2(el.id);
    const parts = [];
    let cur = el;
    while (cur && cur.nodeType === 1 && cur !== d.documentElement) {
      let s = cur.tagName.toLowerCase();
      if (cur.id) {
        parts.unshift(s + '#' + esc2(cur.id));
        break;
      }
      const par = cur.parentElement;
      if (par) {
        const same = [...par.children].filter((c) => c.tagName === cur.tagName);
        if (same.length > 1) s += ':nth-of-type(' + (same.indexOf(cur) + 1) + ')';
      }
      parts.unshift(s);
      cur = par;
    }
    return parts.join(' > ');
  };
  const CSS_ESCAPE = w.CSS && w.CSS.escape ? w.CSS.escape.bind(w.CSS) : null;

  const ownText = (el) => {
    if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) return '';
    return trunc(
      [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.nodeValue.trim())
        .filter(Boolean)
        .join(' '),
      40
    );
  };

  async function copy(text) {
    try {
      await w.navigator.clipboard.writeText(text);
    } catch (e) {
      const x = d.createElement('textarea');
      x.value = text;
      x.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      d.body.appendChild(x);
      x.select();
      try { d.execCommand('copy'); } catch (_) {}
      x.remove();
    }
  }

  /* ---------- status ---------- */
  let stTimer = 0;
  function baseStatus() {
    status.textContent = selected ? cssPath(selected) : '';
  }
  function say(msg) {
    status.textContent = msg;
    clearTimeout(stTimer);
    stTimer = setTimeout(baseStatus, 2200);
  }

  /* ---------- caixas de destaque ---------- */
  function place(box, el) {
    if (!el || !el.isConnected) {
      box.style.display = 'none';
      return;
    }
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) {
      box.style.display = 'none';
      return;
    }
    box.style.display = 'block';
    box.style.left = r.left + 'px';
    box.style.top = r.top + 'px';
    box.style.width = r.width + 'px';
    box.style.height = r.height + 'px';
    const t = box.firstElementChild;
    t.textContent = shortLabel(el) + '  ' + Math.round(r.width) + '×' + Math.round(r.height);
    t.style.top = r.top < 22 ? '2px' : '-20px';
  }
  function updateBoxes() {
    place(selBox, selected);
    place(hovBox, picking && hovered !== selected ? hovered : null);
  }
  let raf = 0;
  const schedule = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      updateBoxes();
    });
  };

  /* ---------- árvore ---------- */
  function labelHTML(el) {
    const attrs = [...el.attributes];
    const shown = attrs
      .slice(0, 6)
      .map((a) => ' <i>' + esc(a.name) + '</i>="<s>' + esc(trunc(a.value, 32)) + '</s>"')
      .join('');
    return (
      '<b class="tg">&lt;' + esc(el.tagName.toLowerCase()) + '</b>' +
      shown + (attrs.length > 6 ? ' …' : '') +
      '<b class="tg">&gt;</b>'
    );
  }

  function expandTo(el) {
    for (let p = el.parentElement; p; p = p.parentElement) expanded.add(p);
  }

  function render(scrollToSel) {
    const keep = tree.scrollTop;
    const frag = d.createDocumentFragment();
    rowMap = new Map();
    let count = 0;
    let truncated = false;

    (function add(el, depth) {
      if (count >= MAX_ROWS) {
        truncated = true;
        return;
      }
      count++;
      const kids = [...el.children].filter((k) => k !== host);
      const open = expanded.has(el);
      const row = d.createElement('div');
      row.className = 'n' + (selected === el ? ' sel' : '');
      row.style.paddingLeft = depth * 12 + 3 + 'px';
      let h = '<span class="arr">' + (kids.length ? (open ? '▾' : '▸') : '·') + '</span>' + labelHTML(el);
      if (!kids.length) {
        const t = ownText(el);
        if (t) h += '<span class="tx">' + esc(t) + '</span>';
      } else if (!open) {
        h += ' …';
      }
      row.innerHTML = h;
      row.onclick = (e) => {
        e.stopPropagation();
        if (e.target.classList.contains('arr') && kids.length) {
          open ? expanded.delete(el) : expanded.add(el);
          render(false);
        } else {
          choose(el, { page: true });
        }
      };
      row.ondblclick = (e) => {
        e.stopPropagation();
        choose(el);
        openEditor();
      };
      frag.appendChild(row);
      rowMap.set(el, row);
      if (open) kids.forEach((k) => add(k, depth + 1));
    })(d.documentElement, 0);

    if (truncated) {
      const m = d.createElement('div');
      m.className = 'more';
      m.textContent = '… limite de ' + MAX_ROWS + ' linhas. Feche tags ou use a busca.';
      frag.appendChild(m);
    }
    tree.replaceChildren(frag);

    if (scrollToSel && selected && rowMap.has(selected)) {
      rowMap.get(selected).scrollIntoView({ block: 'nearest', inline: 'nearest' });
    } else {
      tree.scrollTop = keep;
    }
  }

  function choose(el, o) {
    o = o || {};
    if (!el || el.nodeType !== 1 || el === host) return;
    selected = el;
    expandTo(el);
    render(true);
    details();
    baseStatus();
    updateBoxes();
    if (o.page) {
      try { el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' }); } catch (_) {}
    }
  }

  /* ---------- abas de informação ---------- */
  function matchedRules(el) {
    const out = [];
    const fmt = (t) => t.replace('{ ', '{\n  ').replace(/; /g, ';\n  ').replace(/ \}$/, '\n}');
    const walk = (rules) => {
      for (const r of rules) {
        try {
          if (r instanceof CSSStyleRule) {
            if (el.matches(r.selectorText)) out.push(fmt(r.cssText));
          } else if (r instanceof CSSMediaRule) {
            if (w.matchMedia(r.media.mediaText).matches) walk(r.cssRules);
          } else if (typeof CSSSupportsRule !== 'undefined' && r instanceof CSSSupportsRule) {
            walk(r.cssRules);
          }
        } catch (e) {}
      }
    };
    for (const sh of d.styleSheets) {
      try {
        walk(sh.cssRules);
      } catch (e) {
        out.push('/* folha bloqueada (CORS): ' + (sh.href || 'inline') + ' */');
      }
    }
    return out;
  }

  function cssText(el) {
    const st = el.getAttribute('style');
    let out = '/* style inline */\n';
    out += st
      ? st.split(';').map((s) => s.trim()).filter(Boolean).join(';\n') + ';'
      : '(vazio)';
    const rules = matchedRules(el);
    out += '\n\n/* regras aplicadas (' + rules.length + ') */\n' + (rules.join('\n\n') || '(nenhuma)');
    return out;
  }

  const CALC_PROPS = [
    'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index', 'float',
    'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
    'margin', 'padding', 'border', 'border-radius', 'box-sizing',
    'color', 'background-color', 'background-image', 'opacity', 'visibility', 'overflow',
    'font-family', 'font-size', 'font-weight', 'line-height', 'text-align', 'text-decoration',
    'flex', 'flex-direction', 'justify-content', 'align-items', 'gap',
    'grid-template-columns', 'transform', 'transition', 'cursor', 'pointer-events',
  ];
  function calcText(el) {
    const cs = w.getComputedStyle(el);
    return CALC_PROPS
      .map((p) => [p, cs.getPropertyValue(p)])
      .filter(([, v]) => v !== '')
      .map(([p, v]) => p + ': ' + v)
      .join('\n');
  }

  function infoBox(el) {
    const r = el.getBoundingClientRect();
    const cs = w.getComputedStyle(el);
    const L = [];
    L.push('Seletor: ' + cssPath(el));
    L.push('Tag: ' + el.tagName.toLowerCase());
    if (el.id) L.push('ID: ' + el.id);
    const c = el.getAttribute('class');
    if (c) L.push('Classes: ' + c);
    L.push('Tamanho: ' + r.width.toFixed(1) + ' × ' + r.height.toFixed(1));
    L.push('Viewport: x ' + r.left.toFixed(1) + ', y ' + r.top.toFixed(1));
    L.push('Página: x ' + (r.left + w.scrollX).toFixed(1) + ', y ' + (r.top + w.scrollY).toFixed(1));
    L.push('offset ' + el.offsetWidth + '×' + el.offsetHeight + ' | client ' + el.clientWidth + '×' + el.clientHeight + ' | scroll ' + el.scrollWidth + '×' + el.scrollHeight);
    L.push('margin: ' + cs.margin);
    L.push('padding: ' + cs.padding);
    L.push('border: ' + cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor);
    L.push('Filhos: ' + el.children.length + ' | Descendentes: ' + el.querySelectorAll('*').length);
    if (el.href) L.push('href: ' + el.href);
    if (el.src) L.push('src: ' + el.src);
    return L.join('\n');
  }

  function infoText() {
    const el = selected;
    if (!el) return 'Nada selecionado.';
    switch (mode) {
      case 'html': return cut(el.outerHTML, 30000);
      case 'text': return cut(el.textContent, 30000);
      case 'css': return cssText(el);
      case 'calc': return calcText(el);
      case 'attr':
        return snap(el).map(([n, v]) => n + '="' + v + '"').join('\n') || '(sem atributos)';
      case 'info': return infoBox(el);
    }
    return '';
  }

  /* ---------- aba JS (mini console) ---------- */
  function fmtResult(v) {
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (v instanceof Element) return '<' + shortLabel(v) + '>  ' + cssPath(v);
    if (v instanceof NodeList || (Array.isArray(v) && v.length && v.every((x) => x instanceof Element))) {
      const a = [...v];
      return a.length + ' elemento(s)\n' + a.slice(0, 30).map((x) => ' ' + cssPath(x)).join('\n');
    }
    if (typeof v === 'function') return String(v);
    if (typeof v === 'object') {
      try { return cut(JSON.stringify(v, null, 2), 5000); } catch (e) { return String(v); }
    }
    return String(v);
  }

  function execJS() {
    const code = jsCode.trim();
    if (!code) return;
    const q1 = (s) => d.querySelector(s);
    const q2 = (s) => [...d.querySelectorAll(s)];
    let res;
    let ok = true;
    try {
      let fn;
      try {
        fn = new Function('$0', '$', '$$', 'return (' + code + '\n)');
      } catch (_) {
        fn = new Function('$0', '$', '$$', code);
      }
      res = fn(selected, q1, q2);
    } catch (e) {
      ok = false;
      res = e;
    }
    jsOut = cut('> ' + code + '\n' + (ok ? fmtResult(res) : '✖ ' + (res && res.message ? res.message : res)) + '\n\n' + jsOut, 8000);
    const out = info.querySelector('#jsout');
    if (out) out.textContent = jsOut;
    if (selected && !selected.isConnected) selected = null;
    render(false);
    updateBoxes();
  }

  function renderConsole() {
    info.textContent = '';
    const t = d.createElement('textarea');
    t.placeholder = 'JS — $0 = elemento, $("sel"), $$("sel"). Ctrl+Enter executa';
    t.spellcheck = false;
    t.value = jsCode;
    t.oninput = () => (jsCode = t.value);
    t.onkeydown = (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execJS();
      }
    };
    const run = d.createElement('button');
    run.textContent = '▶ Executar';
    run.onclick = execJS;
    const out = d.createElement('pre');
    out.id = 'jsout';
    out.textContent = jsOut;
    info.append(t, run, out);
  }

  function details() {
    tabs.forEach((b) => b.classList.toggle('on', b.dataset.t === mode));
    if (mode === 'js') {
      renderConsole();
      return;
    }
    info.textContent = infoText();
  }

  /* ---------- desfazer ---------- */
  function refreshUndoBtn() {
    undoBtn.textContent = '↶ Desfazer' + (undos.length ? ' (' + undos.length + ')' : '');
  }
  function pushUndo(fn) {
    undos.push(fn);
    if (undos.length > 50) undos.shift();
    refreshUndoBtn();
  }
  function doUndo() {
    const fn = undos.pop();
    if (!fn) {
      say('Nada para desfazer');
      return;
    }
    try { fn(); } catch (e) { say('Erro: ' + e.message); }
    refreshUndoBtn();
    if (selected && !selected.isConnected) selected = null;
    render(false);
    details();
    baseStatus();
    updateBoxes();
  }

  /* ---------- editor ---------- */
  const ED_LABEL = { html: 'HTML', text: 'TEXTO', css: 'CSS inline', attr: 'ATRIBUTOS (nome="valor", um por linha)' };
  function openEditor() {
    if (!selected) {
      say('Selecione um elemento primeiro');
      return;
    }
    edMode = ED_LABEL[mode] ? mode : 'html';
    const el = selected;
    let label = 'Editar ' + ED_LABEL[edMode] + ' · temporário';
    if (edMode === 'html') {
      if (el === d.body || el === d.head) {
        ta.value = el.innerHTML;
        label = 'Editar innerHTML de <' + el.tagName.toLowerCase() + '> · temporário';
      } else {
        ta.value = el.outerHTML;
      }
    } else if (edMode === 'text') {
      ta.value = el.textContent;
    } else if (edMode === 'css') {
      ta.value = el.getAttribute('style') || '';
    } else {
      ta.value = snap(el).map(([n, v]) => n + '="' + v + '"').join('\n');
    }
    $('#edlabel').textContent = label;
    editor.classList.add('open');
  }

  function applyEdit() {
    if (!selected) return;
    const el = selected;
    const v = ta.value;
    try {
      if (edMode === 'html') {
        if (el === d.documentElement) throw Error('Não dá para editar <html> inteiro');
        if (el === d.body || el === d.head) {
          const old = [...el.childNodes];
          el.innerHTML = v;
          pushUndo(() => el.replaceChildren(...old));
        } else {
          const t = d.createElement('template');
          t.innerHTML = v;
          const nodes = [...t.content.childNodes];
          const first = nodes.find((n) => n.nodeType === 1);
          if (!first) throw Error('HTML inválido ou vazio');
          el.replaceWith(...nodes);
          pushUndo(() => {
            nodes[0].before(el);
            nodes.forEach((n) => n.remove());
            choose(el);
          });
          selected = first;
        }
      } else if (edMode === 'text') {
        if (el === d.documentElement) throw Error('Não dá para editar o texto de <html>');
        const old = [...el.childNodes];
        el.textContent = v;
        pushUndo(() => el.replaceChildren(...old));
      } else if (edMode === 'css') {
        const s = snap(el);
        if (v.trim()) el.setAttribute('style', v);
        else el.removeAttribute('style');
        pushUndo(() => restoreAttrs(el, s));
      } else {
        const s = snap(el);
        const pairs = [];
        v.split('\n').forEach((line) => {
          const m = line.match(/^\s*([^\s=]+)\s*(?:=\s*([\s\S]*))?$/);
          if (!m) return;
          let val = m[2] === undefined ? '' : m[2].trim();
          if (/^(".*"|'.*')$/.test(val)) val = val.slice(1, -1);
          pairs.push([m[1], val]);
        });
        [...el.attributes].forEach((a) => el.removeAttribute(a.name));
        pairs.forEach(([n, val]) => {
          try { el.setAttribute(n, val); } catch (_) {}
        });
        pushUndo(() => restoreAttrs(el, s));
      }
      editor.classList.remove('open');
      choose(selected);
    } catch (e) {
      $('#edlabel').textContent = 'Erro: ' + e.message;
    }
  }

  /* ---------- seleção na página ---------- */
  function setPicking(v) {
    picking = v;
    pickBtn.textContent = v ? 'Toque no site…' : '⌖ Selecionar';
    pickBtn.classList.toggle('on', v);
    key.classList.toggle('pick', v);
    if (!v) hovered = null;
    updateBoxes();
  }

  const PICK_EVENTS = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click', 'dblclick', 'contextmenu'];
  function pickHandler(e) {
    if (!picking || inside(e)) return;
    e.stopImmediatePropagation();
    if (e.type === 'click') {
      e.preventDefault();
      const t = e.target;
      setPicking(false);
      choose(t);
    }
  }
  function hoverHandler(e) {
    if (!picking || inside(e)) return;
    hovered = e.target;
    schedule();
  }
  PICK_EVENTS.forEach((t) => on(d, t, pickHandler, { capture: true, passive: false }));
  on(d, 'pointermove', hoverHandler, true);
  on(d, 'mouseover', hoverHandler, true);
  on(w, 'scroll', schedule, true);
  on(w, 'resize', () => {
    schedule();
    clampAll();
  });

  /* ---------- arrastar (painel e chave) ---------- */
  function makeDraggable(handle, target, o) {
    o = o || {};
    let st = null;
    handle.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      if (o.ignore && e.target.closest && e.target.closest(o.ignore)) return;
      const r = target.getBoundingClientRect();
      st = { dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, moved: false, id: e.pointerId };
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
    });
    handle.addEventListener('pointermove', (e) => {
      if (!st || e.pointerId !== st.id) return;
      if (!st.moved && Math.hypot(e.clientX - st.sx, e.clientY - st.sy) < 6) return;
      st.moved = true;
      const r = target.getBoundingClientRect();
      target.style.left = clamp(e.clientX - st.dx, 0, Math.max(0, w.innerWidth - r.width)) + 'px';
      target.style.top = clamp(e.clientY - st.dy, 0, Math.max(0, w.innerHeight - r.height)) + 'px';
      target.style.right = 'auto';
      target.style.bottom = 'auto';
      if (o.onMove) o.onMove();
    });
    const end = (e, cancelled) => {
      if (!st) return;
      const s = st;
      st = null;
      if (s.moved) {
        if (o.onEnd) o.onEnd();
      } else if (!cancelled && o.onClick) {
        o.onClick(e);
      }
    };
    handle.addEventListener('pointerup', (e) => end(e, false));
    handle.addEventListener('pointercancel', (e) => end(e, true));
  }

  function savePanel() {
    const r = panel.getBoundingClientRect();
    store.set('panel', { left: r.left, top: r.top, width: r.width, height: r.height });
  }
  function saveKey() {
    const r = key.getBoundingClientRect();
    store.set('key', { left: r.left, top: r.top });
  }

  function minimize() {
    editor.classList.remove('open');
    panel.classList.add('hidden');
    key.classList.add('show');
    schedule();
  }
  function restorePanel() {
    key.classList.remove('show');
    panel.classList.remove('hidden');
    clampAll();
    schedule();
  }

  makeDraggable(head, panel, { ignore: 'button', onEnd: savePanel });
  makeDraggable(key, key, { onEnd: saveKey, onClick: restorePanel });

  /* redimensionar o painel */
  (function () {
    const rz = $('#resize');
    let s = null;
    rz.addEventListener('pointerdown', (e) => {
      const r = panel.getBoundingClientRect();
      panel.style.left = r.left + 'px';
      panel.style.top = r.top + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      s = { x: e.clientX, y: e.clientY, w: r.width, h: r.height, l: r.left, t: r.top };
      try { rz.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
    });
    rz.addEventListener('pointermove', (e) => {
      if (!s) return;
      panel.style.width = clamp(s.w + e.clientX - s.x, 240, w.innerWidth - s.l) + 'px';
      panel.style.height = clamp(s.h + e.clientY - s.y, 220, w.innerHeight - s.t) + 'px';
      schedule();
    });
    const end = () => {
      if (!s) return;
      s = null;
      savePanel();
    };
    rz.addEventListener('pointerup', end);
    rz.addEventListener('pointercancel', end);
  })();

  function clampAll() {
    [panel, key].forEach((el) => {
      if (!el.style.left) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      el.style.left = clamp(r.left, 0, Math.max(0, w.innerWidth - r.width)) + 'px';
      el.style.top = clamp(r.top, 0, Math.max(0, w.innerHeight - r.height)) + 'px';
    });
  }

  /* posições salvas */
  (function () {
    const sp = store.get('panel', null);
    if (sp && isFinite(sp.left) && isFinite(sp.top)) {
      const wd = clamp(sp.width || 350, 240, w.innerWidth);
      const ht = clamp(sp.height || 400, 220, w.innerHeight);
      panel.style.width = wd + 'px';
      panel.style.height = ht + 'px';
      panel.style.left = clamp(sp.left, 0, Math.max(0, w.innerWidth - wd)) + 'px';
      panel.style.top = clamp(sp.top, 0, Math.max(0, w.innerHeight - ht)) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    }
    const sk = store.get('key', { left: 8, top: 8 });
    key.style.left = clamp(sk.left, 0, Math.max(0, w.innerWidth - 46)) + 'px';
    key.style.top = clamp(sk.top, 0, Math.max(0, w.innerHeight - 46)) + 'px';
  })();

  /* ---------- ações dos botões ---------- */
  $('#min').onclick = minimize;
  $('#close').onclick = () => destroy();

  pickBtn.onclick = () => setPicking(!picking);
  $('#edit').onclick = openEditor;
  $('#cancel').onclick = () => editor.classList.remove('open');
  $('#apply').onclick = applyEdit;

  $('#up').onclick = () => {
    if (!selected) return say('Selecione um elemento primeiro');
    if (selected.parentElement) choose(selected.parentElement, { page: true });
  };
  $('#down').onclick = () => {
    if (!selected) return say('Selecione um elemento primeiro');
    const k = [...selected.children].find((c) => c !== host);
    if (k) choose(k, { page: true });
    else say('Sem filhos');
  };
  $('#prev').onclick = () => {
    if (!selected) return say('Selecione um elemento primeiro');
    const p = prevEl(selected);
    if (p) choose(p, { page: true });
    else say('Sem irmão anterior');
  };
  $('#next').onclick = () => {
    if (!selected) return say('Selecione um elemento primeiro');
    const n = nextEl(selected);
    if (n) choose(n, { page: true });
    else say('Sem próximo irmão');
  };

  $('#all').onclick = () => {
    (function walk(el) {
      if (el.children.length) expanded.add(el);
      [...el.children].filter((x) => x !== host).forEach(walk);
    })(d.documentElement);
    render(true);
  };
  $('#fold').onclick = () => {
    expanded = new WeakSet();
    expanded.add(d.documentElement);
    if (selected) expandTo(selected);
    render(true);
  };

  $('#copy').onclick = async () => {
    if (!selected) return say('Selecione um elemento primeiro');
    await copy(selected.outerHTML);
    say('HTML copiado');
  };
  $('#copysel').onclick = async () => {
    if (!selected) return say('Selecione um elemento primeiro');
    await copy(cssPath(selected));
    say('Seletor copiado');
  };

  $('#dup').onclick = () => {
    if (!selected) return say('Selecione um elemento primeiro');
    if (selected === d.documentElement || selected === d.body || selected === d.head) return say('Não dá para duplicar este elemento');
    const clone = selected.cloneNode(true);
    selected.after(clone);
    pushUndo(() => clone.remove());
    choose(clone);
    say('Duplicado');
  };

  $('#hide').onclick = () => {
    if (!selected) return say('Selecione um elemento primeiro');
    const el = selected;
    const restore = () => {
      const o = hiddenMap.get(el);
      if (!o) return;
      if (o.v) el.style.setProperty('display', o.v, o.p);
      else el.style.removeProperty('display');
      hiddenMap.delete(el);
    };
    if (hiddenMap.has(el)) {
      restore();
      say('Visível de novo');
    } else {
      hiddenMap.set(el, { v: el.style.getPropertyValue('display'), p: el.style.getPropertyPriority('display') });
      el.style.setProperty('display', 'none', 'important');
      pushUndo(restore);
      say('Oculto (Desfazer restaura)');
    }
    details();
    schedule();
  };

  $('#del').onclick = () => {
    if (!selected) return say('Selecione um elemento primeiro');
    const el = selected;
    if (el === d.documentElement) return say('Não dá para excluir <html>');
    const par = el.parentNode;
    const next = el.nextSibling;
    el.remove();
    pushUndo(() => {
      par.insertBefore(el, next);
      choose(el);
    });
    choose(par.nodeType === 1 ? par : d.body);
    say('Excluído (Desfazer restaura)');
  };

  undoBtn.onclick = doUndo;

  liveBtn.onclick = () => {
    live = !live;
    liveBtn.textContent = 'Live: ' + (live ? 'on' : 'off');
    liveBtn.classList.toggle('on', live);
    if (live) render(false);
  };

  tabs.forEach((b) => {
    b.onclick = () => {
      mode = b.dataset.t;
      details();
    };
  });

  /* busca por seletor */
  let results = [];
  let ri = -1;
  let lastQ = '';
  function search() {
    const q = qInput.value.trim();
    if (!q) {
      cnt.textContent = '';
      return;
    }
    if (q !== lastQ) {
      try {
        results = [...d.querySelectorAll(q)].filter((e) => e !== host);
      } catch (e) {
        cnt.textContent = 'inválido';
        return;
      }
      lastQ = q;
      ri = -1;
    }
    if (!results.length) {
      cnt.textContent = '0';
      return;
    }
    ri = (ri + 1) % results.length;
    cnt.textContent = ri + 1 + '/' + results.length;
    choose(results[ri], { page: true });
  }
  $('#go').onclick = search;
  qInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      search();
    }
  };

  /* teclado dentro do painel não vaza para atalhos do site */
  ['keydown', 'keyup', 'keypress'].forEach((t) => panel.addEventListener(t, (e) => e.stopPropagation()));

  /* ---------- Live: acompanha mudanças da página ---------- */
  let obsTimer = 0;
  const mo = new MutationObserver((muts) => {
    if (!live || editor.classList.contains('open')) return;
    const relevant = muts.some((m) => {
      const nodes = [...m.addedNodes, ...m.removedNodes];
      return !(nodes.length && nodes.every((n) => n === host));
    });
    if (!relevant) return;
    clearTimeout(obsTimer);
    obsTimer = setTimeout(() => {
      if (selected && !selected.isConnected) {
        selected = null;
        baseStatus();
      }
      render(false);
      updateBoxes();
    }, 500);
  });
  mo.observe(d.documentElement, { childList: true, subtree: true });

  /* ---------- encerrar ---------- */
  function destroy() {
    cleanups.forEach((f) => {
      try { f(); } catch (_) {}
    });
    clearTimeout(obsTimer);
    clearTimeout(stTimer);
    if (raf) cancelAnimationFrame(raf);
    mo.disconnect();
    host.remove();
  }
  host.__destroy = destroy;

  /* ---------- início ---------- */
  expanded.add(d.documentElement);
  if (d.body) expanded.add(d.body);
  refreshUndoBtn();
  render(false);
  choose(d.body || d.documentElement);
})();
