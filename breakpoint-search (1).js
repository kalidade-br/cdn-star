javascript:(()=>{
/* breakpoint-search v6 — Busca Inteligente Local (Zero IA), Radar Cheat de Variações & Breakpoints JS (Desktop + Mobile) */
const ID="BREAKPOINT_SEARCH_PRO";
const old=document.getElementById(ID);
if(old){old.remove();(window.__bpT||[]).forEach(clearInterval);window.__bpT=[];return;}
window.__bpT=[];
const W=window,D=document;
const S=window.__bpS||(window.__bpS={
  net:[],logs:[],frozen:new Map(),locks:new Map(),fnHooks:new Map(),
  netRules:[],bpHits:[],hooked:false
});
S.tab=S.tab||"sem";S.q="";S.qraw="";S.path=S.path||[];S.root=S.root||"window";

/* ---------- Hooks de Rede (Fetch, XHR, WebSocket + Regras de Breakpoint) + Console ---------- */
if(!S.hooked){S.hooked=true;
  const push=it=>{S.net.unshift(it);if(S.net.length>300)S.net.pop();};
  const findNetRule=url=>(S.netRules||[]).find(r=>r.active&&url.toLowerCase().includes(r.pattern.toLowerCase()));
  const of=W.fetch;S.of=of?of.bind(W):null;
  if(of)W.fetch=function(i,o){
    const t0=performance.now();
    const url=typeof i==="string"?i:(i&&i.url)||String(i);
    const method=(o&&o.method)||(i&&i.method)||"GET";
    const rule=findNetRule(url);
    if(rule&&rule.action==="block"){
      const blk={type:"fetch",method,url,status:"BLOQ",ms:0,size:0,time:new Date().toLocaleTimeString(),reqBody:"",resBody:"[Bloqueado por breakpoint-search]"};
      push(blk);
      S.bpHits.unshift({t:blk.time,target:url,mode:"rede-block",msg:"Fetch bloqueado pela regra: "+rule.pattern});
      return Promise.reject(new Error("Bloqueado por breakpoint-search"));
    }
    const it={type:"fetch",method,url,status:"…",ms:0,size:"",time:new Date().toLocaleTimeString(),reqBody:o&&typeof o.body==="string"?o.body.slice(0,20000):"",resBody:""};
    push(it);
    return of.apply(this,arguments).then(r=>{
      it.status=r.status;it.ms=Math.round(performance.now()-t0);
      if(rule&&rule.action==="mock"&&rule.payload){
        it.resBody=rule.payload;it.size=rule.payload.length;it.status="PATCH";
        S.bpHits.unshift({t:it.time,target:url,mode:"rede-patch",msg:"Resposta modificada em tempo real"});
        return new Response(rule.payload,{status:200,headers:{"Content-Type":"application/json"}});
      }
      try{r.clone().text().then(t=>{it.size=t.length;it.resBody=t.slice(0,200000);}).catch(()=>{});}catch(e){}
      return r;
    },e=>{it.status="ERRO";it.ms=Math.round(performance.now()-t0);it.resBody=String(e);throw e;});
  };
  const XO=XMLHttpRequest.prototype.open,XS=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open=function(m,u){this.__bp={type:"xhr",method:m,url:String(u),status:"…",ms:0,size:"",time:"",reqBody:"",resBody:""};return XO.apply(this,arguments);};
  XMLHttpRequest.prototype.send=function(b){
    const it=this.__bp||{type:"xhr",method:"?",url:"?"};
    const rule=findNetRule(it.url);
    if(rule&&rule.action==="block"){
      it.status="BLOQ";it.time=new Date().toLocaleTimeString();push(it);
      S.bpHits.unshift({t:it.time,target:it.url,mode:"rede-block",msg:"XHR bloqueado pela regra: "+rule.pattern});
      return;
    }
    const t0=performance.now();it.time=new Date().toLocaleTimeString();it.reqBody=typeof b==="string"?b.slice(0,20000):"";push(it);
    this.addEventListener("loadend",()=>{
      it.status=this.status||"ERRO";it.ms=Math.round(performance.now()-t0);
      try{const t=(this.responseType===""||this.responseType==="text")?this.responseText:"["+this.responseType+"]";it.size=t.length;it.resBody=t.slice(0,200000);}catch(e){}
    });
    return XS.apply(this,arguments);
  };
  const WS=W.WebSocket;
  if(WS){
    W.WebSocket=function(u,pr){
      const w=pr?new WS(u,pr):new WS(u);
      const it={type:"ws",method:"WS",url:String(u),status:"aberto",ms:0,size:"",time:new Date().toLocaleTimeString(),reqBody:"",resBody:""};
      push(it);
      const os=w.send;
      w.send=function(d){it.reqBody=(it.reqBody+(typeof d==="string"?d:"[bin]")+"\n").slice(-100000);return os.apply(this,arguments);};
      w.addEventListener("message",e=>{it.resBody=(it.resBody+(typeof e.data==="string"?e.data:"[bin]")+"\n").slice(-100000);});
      return w;
    };
    W.WebSocket.prototype=WS.prototype;Object.assign(W.WebSocket,{CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3});
  }
  ["log","info","warn","error","debug"].forEach(l=>{
    const o=console[l];
    console[l]=function(...a){S.logs.push({l,t:new Date().toLocaleTimeString(),m:a.map(fmt).join(" ")});if(S.logs.length>500)S.logs.shift();return o.apply(this,a);};
  });
  W.addEventListener("error",e=>S.logs.push({l:"error",t:new Date().toLocaleTimeString(),m:(e.message||"Erro")+" @ "+(e.filename||"")+":"+(e.lineno||"")}));
  W.addEventListener("unhandledrejection",e=>S.logs.push({l:"error",t:new Date().toLocaleTimeString(),m:"Promise rejeitada: "+fmt(e.reason)}));
}
S.res=S.res||new Map();
if(!S.po){S.po=true;try{performance.setResourceTimingBufferSize&&performance.setResourceTimingBufferSize(10000);new PerformanceObserver(l=>l.getEntries().forEach(e=>S.res.set(e.name,e))).observe({type:"resource",buffered:true});}catch(e){}}

function fmt(v){try{if(typeof v==="string")return v;if(v instanceof Error)return v.name+": "+v.message;if(typeof v==="function")return "ƒ "+(v.name||"anon")+"()";if(v instanceof Node)return "<"+(v.nodeName||"").toLowerCase()+">";return JSON.stringify(v,(k,x)=>typeof x==="bigint"?x+"n":x,0)?.slice(0,2000)??String(v);}catch(e){return String(v);}}

/* ---------- Shadow DOM Host (Desktop + Celular + Mini HUD) ---------- */
const host=D.createElement("div");host.id=ID;
host.style.cssText="all:initial;position:fixed;z-index:2147483647;top:0;left:0;width:0;height:0";
(D.body||D.documentElement).appendChild(host);
const R=host.attachShadow?host.attachShadow({mode:"open"}):host;
const mobile=Math.min(innerWidth,screen.width)<740||matchMedia("(pointer:coarse)").matches;

const css=`
*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.p{position:fixed;top:16px;right:16px;width:580px;max-width:calc(100vw - 16px);height:84vh;background:#0b0f17;color:#e6edf3;border:1px solid #263244;border-radius:12px;display:flex;flex-direction:column;font-size:12px;line-height:1.45;box-shadow:0 16px 54px #000d;overflow:hidden}
.p.m{top:auto;bottom:0;left:0;right:0;width:100vw;max-width:100vw;height:76vh;border-radius:18px 18px 0 0;font-size:13px}
.p.min{height:auto!important}.p.min .nav,.p.min .sub,.p.min .body,.p.min .ft{display:none}
.p.hudon{display:none!important}
.hdr{background:#121823;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;cursor:move;border-bottom:1px solid #263244;user-select:none;touch-action:none;position:relative}
.hdr b{color:#38bdf8;font-size:13px;letter-spacing:-0.01em}.grip{width:40px;height:4px;background:#334155;border-radius:2px;margin:0 auto 5px}
.nav{display:flex;background:#121823;border-bottom:1px solid #263244;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.nav::-webkit-scrollbar{display:none}
.nb{background:none;border:0;color:#8b949e;padding:10px 12px;font-weight:600;font-size:12px;border-bottom:2px solid transparent;white-space:nowrap;cursor:pointer;min-height:40px}
.nb.a{color:#38bdf8;border-color:#38bdf8}
.sub{padding:8px;background:#121823;border-bottom:1px solid #263244;display:flex;gap:6px;flex-wrap:wrap}
.body{flex:1;overflow:auto;padding:9px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.ft{padding:6px 10px;background:#121823;border-top:1px solid #263244;color:#8b949e;display:flex;justify-content:space-between;gap:6px;align-items:center;font-size:11px;flex-wrap:wrap}
.b{background:#1c2533;color:#d6e0ec;border:1px solid #2d3a4e;border-radius:7px;padding:5px 9px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap}
.m .b{padding:9px 12px;font-size:12px;min-height:40px}
.b:active,.b:hover{background:#283549;color:#fff}.g{background:#059669;border-color:#10b981;color:#fff}.r{background:#dc2626;border-color:#ef4444;color:#fff}.am{background:#d97706;border-color:#f59e0b;color:#fff}.on{border-color:#38bdf8;color:#38bdf8;background:#0c233a}
.i,textarea,select{flex:1;min-width:0;width:100%;padding:7px 10px;background:#05070b;color:#e6edf3;border:1px solid #263244;border-radius:7px;font-size:12px;font-family:ui-monospace,Menlo,monospace}
.m .i,.m textarea,.m select{font-size:16px;min-height:42px}
.i:focus,textarea:focus{border-color:#38bdf8;outline:none}
.c{background:#121823;border:1px solid #243041;border-radius:9px;padding:9px 10px;margin-bottom:7px}
.c.hi{border-color:#10b98166;background:#0b1918}
.row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.sp{justify-content:space-between}.mt{margin-top:6px}
.k{color:#7dd3fc;font-weight:700;word-break:break-all}.mu{color:#8b949e;font-size:11px}.mono{font-family:ui-monospace,Menlo,monospace;word-break:break-all;white-space:pre-wrap;font-variant-numeric:tabular-nums}
.t{font-size:10px;padding:1px 6px;border-radius:6px;font-weight:700;border:1px solid}
.tn{color:#c4b5fd;border-color:#c4b5fd55}.ts{color:#93c5fd;border-color:#93c5fd55}.tb{color:#fdba74;border-color:#fdba7455}.to{color:#6ee7b7;border-color:#6ee7b755}.tf{color:#94a3b8;border-color:#334155}
.ok{color:#34d399}.bad{color:#f87171}.warn{color:#fbbf24}
.q{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}.q .b{padding:4px 8px;font-size:10px}.m .q .b{padding:7px 10px;font-size:12px}
.lg{padding:4px 6px;border-bottom:1px solid #1e293b;font-family:ui-monospace,Menlo,monospace;font-size:11px;white-space:pre-wrap;word-break:break-all}
.lg.warn{background:#d9770618}.lg.error{background:#dc262618;color:#fca5a5}
details summary{cursor:pointer;list-style:none}
.grid{display:grid;grid-template-columns:auto 1fr;gap:3px 10px}
.hud{position:fixed;right:14px;bottom:14px;background:#121823;color:#e6edf3;border:1px solid #38bdf8;border-radius:12px;padding:8px 13px;display:none;align-items:center;gap:10px;box-shadow:0 8px 28px #000c;cursor:pointer;font-size:12px;min-height:46px;z-index:2147483647}
.hud b{color:#38bdf8;font-variant-numeric:tabular-nums}
`;

R.innerHTML="";
const st=D.createElement("style");st.textContent=css;R.appendChild(st);
const P=D.createElement("div");P.className="p"+(mobile?" m":"");R.appendChild(P);
const HUD=D.createElement("button");HUD.className="hud";HUD.onclick=()=>{HUD.style.display="none";P.classList.remove("hudon");};R.appendChild(HUD);

function h(tag,attrs,...kids){
  const e=D.createElement(tag);
  if(attrs)for(const k in attrs){const v=attrs[k];if(v==null||v===false)continue;
    if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(k==="cls")e.className=v;else if(k==="style")e.style.cssText=v;else if(k==="value")e.value=v;else e.setAttribute(k,v===true?"":v);}
  kids.flat(9).forEach(c=>{if(c==null||c===false)return;e.appendChild(c instanceof Node?c:D.createTextNode(String(c)));});
  return e;
}
const btn=(txt,fn,cls="")=>h("button",{cls:"b "+cls,onclick:fn},txt);
const tag=v=>{const t=v===null?"null":Array.isArray(v)?"array":typeof v;const c={number:"tn",bigint:"tn",string:"ts",boolean:"tb",object:"to",array:"to"}[t]||"tf";return h("span",{cls:"t "+c},t);};
let msgEl;const msg=t=>{if(msgEl)msgEl.textContent=t;};
const copy=t=>{try{navigator.clipboard.writeText(t).then(()=>msg("Copiado!"),()=>fallbackCopy(t));}catch(e){fallbackCopy(t);}};
function fallbackCopy(t){const a=D.createElement("textarea");a.value=t;R.appendChild(a);a.select();try{D.execCommand("copy");msg("Copiado!");}catch(e){msg("Falha ao copiar");}a.remove();}
function parse(s){s=String(s).trim();if(s==="")return "";if(s==="true")return true;if(s==="false")return false;if(s==="null")return null;if(s==="undefined")return undefined;
  if(/^-?\d+(\.\d+)?(e-?\d+)?$/i.test(s))return Number(s);if(/^[\[{"]/.test(s)){try{return JSON.parse(s);}catch(e){}}return s;}
const show=v=>{if(typeof v==="string")return v;try{return JSON.stringify(v)??String(v);}catch(e){return String(v);}};

/* ---------- Resolução de caminhos (window + @lex:let/const + @react + @store) ---------- */
S.pk=S.pk||new Map();
const IDENT=/^[A-Za-z_$][\w$]*$/;
function lexTypeof(n){try{return (0,eval)("typeof "+n);}catch(e){return /EvalError|unsafe|Content Security/i.test(e&&(e.name+" "+e.message))?"!csp":"tdz";}}
function lexGet(n){return (0,eval)(n);}
function lexSet(n,v){W.__bpV=v;try{(0,eval)(n+"=globalThis.__bpV");}finally{delete W.__bpV;}}
function isLex(k){return typeof k==="string"&&k.startsWith("@lex:");}
function LEXOK(k){if(!IDENT.test(k)||(k in W))return false;const t=lexTypeof(k);return t!=="undefined"&&t!=="!csp"&&t!=="tdz";}
function pstr(keys){
  keys=keys.slice();
  if(keys[0]==="window")keys.shift();
  if(keys[0]==="@ls"||keys[0]==="@ss"){
    const str=(keys[0]==="@ls"?"localStorage":"sessionStorage")+"["+JSON.stringify(keys[1])+"]";
    S.pk.set(str,keys);return str;
  }
  if(keys[0]==="@react"){
    const str="ReactHook["+keys[1]+"]"+(keys[2]?"."+keys[2]:"");
    S.pk.set(str,keys);return str;
  }
  if(keys[0]==="@vue"){
    const str="VueState["+keys[1]+"]"+keys.slice(2).map(k=>IDENT.test(k)?"."+k:"["+JSON.stringify(k)+"]").join("");
    S.pk.set(str,keys);return str;
  }
  const lx=isLex(keys[0]);
  const rest=lx?keys.slice(1):keys;const base=lx?keys[0].slice(5):"window";
  const str=base+rest.map(k=>IDENT.test(k)?"."+k:"["+JSON.stringify(k)+"]").join("");
  S.pk.set(str,lx?keys:["window",...keys]);return str;
}
function splitPath(p){p=String(p);if(S.pk.has(p))return S.pk.get(p).slice();return p.replace(/\[(["']?)(.*?)\1\]/g,".$2").split(".").filter(Boolean);}

/* ---------- Scanner de Estados React Fiber & Vue (atualização instantânea sem F5) ---------- */
S.rfHooks=S.rfHooks||[];S.vueRefs=S.vueRefs||[];
function scanFrameworks(){
  S.rfHooks=[];S.vueRefs=[];
  const seenHook=new Set(),seenVue=new Set();
  const els=D.querySelectorAll("*");
  for(let i=0;i<els.length&&i<1500;i++){
    const el=els[i];
    if(el===host)continue;
    let ks;try{ks=Object.keys(el);}catch(e){continue;}
    for(const k of ks){
      if(k.startsWith("__reactFiber$")||k.startsWith("__reactInternalInstance$")){
        let f=el[k],steps=0;
        while(f&&steps++<25){
          let ms=f.memoizedState,hIdx=0;
          while(ms&&hIdx<30){
            if(ms.queue&&typeof ms.queue.dispatch==="function"&&!seenHook.has(ms.queue)){
              seenHook.add(ms.queue);
              const cname=(f.type&&(f.type.displayName||f.type.name))||"Componente";
              S.rfHooks.push({id:S.rfHooks.length,name:cname+"#"+hIdx,state:ms,dispatch:ms.queue.dispatch});
            }
            ms=ms.next;hIdx++;
          }
          f=f.return;
        }
      }
      if(k==="__vueParentComponent"||k==="__vue__"){
        const v=el[k];
        if(v&&!seenVue.has(v)){
          seenVue.add(v);
          const data=(v.setupState||v.data||v.$data);
          if(data&&typeof data==="object")S.vueRefs.push({id:S.vueRefs.length,inst:v,data});
        }
      }
    }
  }
}

/* ---------- Atualização instantânea da UI da página (Vanilla JS + React + Vue + DOM) ---------- */
function quickLexScan(){
  try{
    const names=new Set(S.lexNames||[]);
    const re=/\b(?:let|const|var|function|class)\s+([A-Za-z_$][\w$]*)/g;
    [...D.scripts].forEach(sc=>{
      if(!sc.textContent)return;
      re.lastIndex=0;let m;
      while((m=re.exec(sc.textContent))&&names.size<8000)names.add(m[1]);
    });
    const ok=[];let csp=false;
    names.forEach(n=>{
      if(n in W)return;
      const t=lexTypeof(n);
      if(t==="!csp"){csp=true;return;}
      if(t!=="undefined"&&t!=="tdz")ok.push(n);
    });
    S.lexNames=ok;if(csp)S.lexCsp=true;
  }catch(e){}
}

const BAD_UI_FN=/^(reset|clear|cls|delete|del|remove|logout|signout|exit|close|submit|buy|purchase|comprar|withdraw|sacar|pay|pagar|send|enviar|transfer|fetch|reload|redirect|assign|spend|gastar|damage|hurt|attack|destroy|init|setup|start|stop|abort|confirm|alert|prompt|open|back|prev|next|addtx|log)/i;
const GOOD_UI_FN=/(update|render|refresh|redraw|draw|sync|paint|display|show|recalc|format|view|hud|tela|saldo|ui)/i;
const DOM_API_RE=/(getElementById|querySelector|textContent|innerText|innerHTML|classList|disabled|setAttribute|value\s*=|style\.)/;
const DANGER_SRC_RE=/(\blocation\.reload\b|\bfetch\s*\(|\bXMLHttpRequest\b|\.reset\s*\(|\binsertBefore\b|\bappendChild\b|\balert\s*\(|\bconfirm\s*\(|\bprompt\s*\()/;

function safeFnStr(fn){try{return Function.prototype.toString.call(fn);}catch(e){return "";}}

function runUiRenderers(opts){
  opts=opts||{};
  const key=opts.key?String(opts.key):"";
  const parts=opts.path?splitPath(opts.path).filter(k=>k!=="window"&&!k.startsWith("@")):[];
  const root=parts.length>1?parts[0]:"";
  const cands=[];const seenFn=new Set();
  const consider=(fn,label,ctx)=>{
    if(typeof fn!=="function"||seenFn.has(fn))return;
    seenFn.add(fn);
    if(fn.length>0)return;
    const nm=label.split(".").pop()||fn.name||"";
    if(BAD_UI_FN.test(nm))return;
    const src=safeFnStr(fn);
    if(!src||/\[native code\]/.test(src)||src.length>25000)return;
    if(src.includes("BREAKPOINT_SEARCH_PRO")||src.includes("__bp"))return;
    if(DANGER_SRC_RE.test(src))return;
    let sc=0;
    if(/^(updateui|renderui|refreshui|updatescreen|updatedisplay|redraw|render|update)$/i.test(nm))sc+=60;
    else if(GOOD_UI_FN.test(nm))sc+=40;
    if(DOM_API_RE.test(src))sc+=40;
    if(key&&src.includes(key))sc+=55;
    if(root&&src.includes(root))sc+=30;
    if(key&&new RegExp("\\b"+key.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\s*(?:\\+\\+|--|[+\\-*/]=)").test(src))sc-=90;
    if(sc>=45)cands.push({fn,label,ctx,sc});
  };
  siteGlobals().forEach(([k,v])=>{
    if(typeof v==="function")consider(v,k,W);
    else if(v&&typeof v==="object"&&!Array.isArray(v)){
      try{
        Object.keys(v).slice(0,40).forEach(p=>{
          try{if(typeof v[p]==="function")consider(v[p],k+"."+p,v);}catch(e){}
        });
      }catch(e){}
    }
  });
  lexList().forEach(([k,v])=>{
    if(typeof v==="function")consider(v,k,W);
  });
  cands.sort((a,b)=>b.sc-a.sc);
  const called=[];
  cands.slice(0,10).forEach(c=>{
    try{c.fn.call(c.ctx);called.push(c.label+"()");}catch(e){}
  });
  return called;
}

function formatLike(sample,numVal){
  const m=String(sample||"").match(/^([^\d\-]*)(-?\d[\d.,]*)(.*)$/);
  if(!m)return String(numVal);
  const pre=m[1],num=m[2],suf=m[3];
  const cm=num.match(/,(\d+)$/),dm=num.match(/\.(\d+)$/);
  let sep=".",dec=0;
  if(cm){sep=",";dec=cm[1].length;}
  else if(dm){sep=".";dec=dm[1].length;}
  let s=dec>0?Number(numVal).toFixed(dec):String(Math.round(Number(numVal)*100)/100);
  if(sep===",")s=s.replace(".",",");
  return pre+s+suf;
}

function syncDomFallback(opts){
  const key=opts.key?String(opts.key).toLowerCase():"";
  const oldVal=opts.oldVal,newVal=opts.newVal;
  if(newVal===undefined)return 0;
  let hits=0;const containers=new Set();
  const els=D.querySelectorAll("*");
  for(let i=0;i<els.length&&i<2500;i++){
    const el=els[i];
    if(el===host||/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|SVG|HEAD|META|LINK|HTML|BODY)$/.test(el.tagName))continue;
    const isInp="value"in el&&/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
    if(!isInp&&el.children.length>0)continue;
    const clsStr=typeof el.className==="string"?el.className:"";
    const attr=((el.id||"")+" "+(el.getAttribute("name")||"")+" "+clsStr+" "+(el.getAttribute("data-testid")||"")).toLowerCase();
    const keyMatch=key.length>=2&&attr.includes(key);
    const txt=(isInp?String(el.value):String(el.textContent||"")).trim();
    let valMatch=false;
    if(typeof newVal==="number"&&typeof oldVal==="number"){
      const pm=txt.match(/^(?:R\$|US\$|\$|€)?\s*(-?\d+(?:[.,]\d{1,2})?)\s*(?:%|pts|xp|brl)?$/i);
      if(pm){
        const parsed=Number(pm[1].replace(",","."));
        if(Math.abs(parsed-oldVal)<0.001&&(oldVal!==0||keyMatch))valMatch=true;
      }
    }else if(oldVal!==undefined&&txt===String(oldVal)&&(String(oldVal).length>=2||keyMatch)){
      valMatch=true;
    }
    if(!keyMatch&&!valMatch)continue;
    const out=typeof newVal==="number"&&/[\d]/.test(txt)?formatLike(txt,newVal):String(newVal);
    if(isInp){
      try{
        if(el instanceof HTMLSelectElement){el.value=out;}
        else{
          const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
          const d=Object.getOwnPropertyDescriptor(proto,"value");
          if(d&&d.set)d.set.call(el,out);else el.value=out;
        }
        el.dispatchEvent(new Event("input",{bubbles:true}));
        el.dispatchEvent(new Event("change",{bubbles:true}));
        hits++;
      }catch(e){}
    }else if(el.tagName!=="BUTTON"){
      el.textContent=out;hits++;
      if(el.parentElement)containers.add(el.parentElement.parentElement||el.parentElement);
    }
  }
  if(hits>0&&typeof oldVal==="number"&&typeof newVal==="number"&&oldVal<=0&&newVal>0){
    containers.forEach(c=>{
      c.querySelectorAll("button,[disabled],.btn-disabled,.disabled").forEach(b=>{
        if(b.disabled||b.hasAttribute("disabled")){b.disabled=false;b.removeAttribute("disabled");}
        b.classList.remove("btn-disabled","disabled");
      });
    });
  }
  return hits;
}

function refreshPageUI(opts){
  opts=opts||{};
  let reactNudged=0,vueNudged=0;
  try{
    if(!S.rfHooks.length&&!S.vueRefs.length)scanFrameworks();
    S.vueRefs.forEach(v=>{
      try{
        if(v.inst.proxy&&v.inst.proxy.$forceUpdate){v.inst.proxy.$forceUpdate();vueNudged++;}
        else if(v.inst.$forceUpdate){v.inst.$forceUpdate();vueNudged++;}
      }catch(e){}
    });
    if(opts.manual){
      S.rfHooks.forEach(hk=>{
        try{
          const cur=hk.state.memoizedState;
          if(cur&&typeof cur==="object"){hk.dispatch(Array.isArray(cur)?cur.slice():{...cur});reactNudged++;}
        }catch(e){}
      });
    }
    W.dispatchEvent(new Event("focus"));
    W.dispatchEvent(new Event("resize"));
    try{D.dispatchEvent(new Event("visibilitychange"));}catch(e){}
  }catch(e){}
  const called=runUiRenderers(opts);
  let domCount=0;
  if(!called.length&&(opts.key||opts.oldVal!==undefined||opts.newVal!==undefined)){
    domCount=syncDomFallback(opts);
  }
  try{updateHud();}catch(e){}
  const parts=[];
  if(called.length)parts.push(called.slice(0,3).join(", "));
  if(domCount)parts.push(domCount+" DOM");
  if(vueNudged)parts.push("Vue");
  if(reactNudged)parts.push("React");
  return{called,domCount,summary:parts.length?"Tela atualizada ("+parts.join(" · ")+")":"Eventos disparados sem recarregar"};
}

function nudgeFrameworks(opts){return refreshPageUI(opts);}

function syncKeyAcrossMemoryAndStorage(keyName,newVal,fromStorage){
  if(!keyName)return;
  const lk=String(keyName).toLowerCase();
  if(fromStorage){
    /* Atualiza variáveis em memória e React/Vue que tenham o mesmo nome da chave salva */
    const patchObj=(o,d)=>{
      if(!o||typeof o!=="object"||d>3)return;
      try{
        Object.keys(o).slice(0,80).forEach(k=>{
          if(k.toLowerCase()===lk&&typeof o[k]!=="object"&&typeof o[k]!=="function"){o[k]=newVal;}
          else if(o[k]&&typeof o[k]==="object")patchObj(o[k],d+1);
        });
      }catch(e){}
    };
    siteGlobals().forEach(([,v])=>patchObj(v,0));
    S.rfHooks.forEach(h=>{
      const cur=h.state.memoizedState;
      if(cur&&typeof cur==="object"&&!Array.isArray(cur)&&(keyName in cur)){
        try{h.dispatch({...cur,[keyName]:newVal});}catch(e){}
      }
    });
  }else{
    /* Atualiza chaves ou JSON no localStorage/sessionStorage sem precisar recarregar */
    [W.localStorage,W.sessionStorage].forEach(st=>{
      try{
        Object.keys(st).forEach(k=>{
          const raw=st.getItem(k);
          if(k.toLowerCase()===lk){
            const nstr=typeof newVal==="string"?newVal:JSON.stringify(newVal);
            st.setItem(k,nstr);
            try{W.dispatchEvent(new StorageEvent("storage",{key:k,oldValue:raw,newValue:nstr,storageArea:st}));}catch(e){}
          }else if(raw&&raw.trim().startsWith("{")){
            try{
              const j=JSON.parse(raw);
              if(j&&typeof j==="object"&&(keyName in j)){
                j[keyName]=newVal;
                const nstr=JSON.stringify(j);
                st.setItem(k,nstr);
                try{W.dispatchEvent(new StorageEvent("storage",{key:k,oldValue:raw,newValue:nstr,storageArea:st}));}catch(e){}
              }
            }catch(e){}
          }
        });
      }catch(e){}
    });
  }
}

function writeStorageAndSync(st,key,rawVal){
  const oldVal=st.getItem(key);
  st.setItem(key,rawVal);
  try{W.dispatchEvent(new StorageEvent("storage",{key,oldValue:oldVal,newValue:rawVal,storageArea:st}));}catch(e){}
  const parsed=parse(rawVal);
  if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed)){
    Object.keys(parsed).forEach(subK=>syncKeyAcrossMemoryAndStorage(subK,parsed[subK],true));
  }else{
    syncKeyAcrossMemoryAndStorage(key,parsed,true);
  }
  refreshPageUI({key,oldVal:parse(oldVal),newVal:parsed});
}

function resolve(parts){
  if(parts[0]==="@ls")return parse(W.localStorage.getItem(parts[1]));
  if(parts[0]==="@ss")return parse(W.sessionStorage.getItem(parts[1]));
  if(parts[0]==="@react"){
    const h=S.rfHooks[Number(parts[1])];
    if(!h)return undefined;
    let v=h.state.memoizedState;
    for(let i=2;i<parts.length;i++){if(v==null)return undefined;v=v[parts[i]];}
    return v;
  }
  if(parts[0]==="@vue"){
    const vr=S.vueRefs[Number(parts[1])];
    let v=vr?vr.data:undefined;
    for(let i=2;i<parts.length;i++){if(v==null)return undefined;v=v[parts[i]];}
    return v;
  }
  let o=W;
  for(let i=0;i<parts.length;i++){const k=parts[i];
    if(i===0){if(isLex(k)){o=lexGet(k.slice(5));continue;}if(k==="window")continue;if(!(k in W)&&LEXOK(k)){o=lexGet(k);continue;}}
    if(o==null)return undefined;o=o[k];}
  return o;
}
function assign(parts,val){
  if(parts[0]==="@ls"){writeStorageAndSync(W.localStorage,parts[1],typeof val==="string"?val:JSON.stringify(val));return;}
  if(parts[0]==="@ss"){writeStorageAndSync(W.sessionStorage,parts[1],typeof val==="string"?val:JSON.stringify(val));return;}
  if(parts[0]==="@react"){
    const h=S.rfHooks[Number(parts[1])];
    if(!h)throw Error("Hook React não encontrado");
    if(parts.length===2){
      h.state.memoizedState=val;
      h.dispatch(val);
    }else{
      const clone=Array.isArray(h.state.memoizedState)?h.state.memoizedState.slice():{...h.state.memoizedState};
      let cur=clone;
      for(let i=2;i<parts.length-1;i++){cur[parts[i]]=Array.isArray(cur[parts[i]])?cur[parts[i]].slice():{...cur[parts[i]]};cur=cur[parts[i]];}
      cur[parts[parts.length-1]]=val;
      h.state.memoizedState=clone;
      h.dispatch(clone);
    }
    nudgeFrameworks();return;
  }
  if(parts[0]==="@vue"){
    const vr=S.vueRefs[Number(parts[1])];
    if(!vr)throw Error("Estado Vue não encontrado");
    let cur=vr.data;
    for(let i=2;i<parts.length-1;i++)cur=cur[parts[i]];
    cur[parts[parts.length-1]]=val;
    nudgeFrameworks();return;
  }
  const ps=parts.filter((k,i)=>!(i===0&&k==="window"));
  if(ps.length===1){const k=ps[0];if(isLex(k)){lexSet(k.slice(5),val);syncKeyAcrossMemoryAndStorage(k.slice(5),val,false);nudgeFrameworks();return;}if(!(k in W)&&LEXOK(k)){lexSet(k,val);syncKeyAcrossMemoryAndStorage(k,val,false);nudgeFrameworks();return;}}
  const last=ps.pop();const o=resolve(ps);if(o==null)throw Error("Caminho inválido");o[last]=val;
  syncKeyAcrossMemoryAndStorage(last,val,false);
  nudgeFrameworks();
}

/* ---------- Variáveis globais + React/Vue + Storage ---------- */
let baseline=null;
function getBaseline(){if(baseline)return baseline;try{const f=D.createElement("iframe");f.style.display="none";(D.body||D.documentElement).appendChild(f);baseline=new Set(Object.getOwnPropertyNames(f.contentWindow));f.remove();}catch(e){baseline=new Set();}return baseline;}
function siteGlobals(){const b=getBaseline();const out=[];for(const k of Object.getOwnPropertyNames(W)){if(b.has(k)||k.startsWith("__bp")||k.startsWith("__kl")||/^on/.test(k)||/^webkit/i.test(k))continue;let v;try{v=W[k];}catch(e){continue;}if(v instanceof Node||v===W)continue;out.push([k,v]);}return out;}

/* Congelamento contínuo */
const ft=setInterval(()=>{S.frozen.forEach((v,p)=>{try{const ks=splitPath(p);const cur=resolve(ks);if(cur!==v){S.fw=true;assign(ks,v);refreshPageUI({path:p,key:ks[ks.length-1],oldVal:cur,newVal:v});}}catch(e){}finally{S.fw=false;}});},25);
window.__bpT.push(ft);

/* ---------- Sistema de Breakpoints JS Transcendente (Propriedades + Funções + Debugger) ---------- */
function humanCaller(stack){
  const ls=String(stack||"").split("\n").slice(2,6).map(s=>s.trim().replace(/^at\s+/,"")).filter(Boolean);
  if(!ls.length)return "Alteração direta pela interface ou console";
  const top=ls[0];
  if(/buy|purchase|comprar|spend|pay|debit|charge/i.test(top))return "Função de compra/pagamento: "+top.split(" ")[0];
  if(/damage|hit|attack|hurt/i.test(top))return "Evento de dano/perda: "+top.split(" ")[0];
  if(/tick|interval|update|loop|timer/i.test(top))return "Atualização automática do jogo/site: "+top.split(" ")[0];
  return "Função: "+top.split(" ")[0];
}

function toggleLock(path,mode){
  let L=S.locks.get(path);
  if(L){
    if(L.mode===mode){
      try{Object.defineProperty(L.parent,L.name,{value:L.val,writable:true,configurable:true,enumerable:L.en});}catch(e){}
      S.locks.delete(path);msg("Breakpoint removido");return;
    }
    L.mode=mode;
    if(mode==="freeze"||mode==="lock")L.lockedVal=L.val;
    msg("Breakpoint atualizado: "+mode);return;
  }
  const keys=splitPath(path).filter((k,i)=>!(i===0&&k==="window"));const name=keys.pop();
  if(name==null||isLex(name)||name==="@ls"||name==="@ss"||(keys.length===0&&!(name in W))){
    msg("Variável protegida ou let/const — use ❄ Congelar");return;
  }
  const parent=keys.length?resolve(keys):W;if(parent==null){msg("Caminho inválido");return;}
  const d=Object.getOwnPropertyDescriptor(parent,name);
  if(!d||!d.configurable||!("value" in d)){msg("Não configurável — use ❄ Congelar");return;}
  L={parent,name,val:d.value,en:d.enumerable,mode,lockedVal:d.value,hits:0,pause:false};
  Object.defineProperty(parent,name,{configurable:true,enumerable:d.enumerable,
    get(){return L.val;},
    set(x){
      if(S.fw){L.val=x;return;}
      const prev=L.val;let next=x,blk=false;
      if(L.mode==="lock"||L.mode==="freeze"){next=L.lockedVal??prev;blk=x!==next;}
      else if(L.mode==="block_decrease"&&typeof prev==="number"&&typeof x==="number"&&x<prev){next=prev;blk=true;}
      else if(L.mode==="multiply"&&typeof prev==="number"&&typeof x==="number"&&x>prev){next=prev+(x-prev)*2;}
      L.val=next;L.hits++;
      const m=(blk?"[BLOQUEADO] ":"")+show(prev)+" → "+show(x)+(next!==x?" (aplicado: "+show(next)+")":"")+" · "+humanCaller(new Error().stack);
      S.bpHits.unshift({t:new Date().toLocaleTimeString(),target:path,mode:L.mode,msg:m});
      if(S.bpHits.length>150)S.bpHits.pop();
      S.logs.push({l:"warn",t:new Date().toLocaleTimeString(),m:"🛑 BP "+path+": "+m});
      if(L.pause){debugger;}
    }
  });
  S.locks.set(path,L);msg("Breakpoint ativo ("+mode+") em "+path);
}

function hookFunction(path,mode){
  const keys=splitPath(path);const fn=resolve(keys);
  if(typeof fn!=="function"){msg("Não é função");return;}
  if(S.fnHooks.has(path)){
    const orig=S.fnHooks.get(path).orig;
    S.fw=true;try{assign(keys,orig);}finally{S.fw=false;}
    S.fnHooks.delete(path);msg("Hook removido de "+path);return;
  }
  const orig=fn;
  const wrapped=function(...args){
    const t=new Date().toLocaleTimeString();
    if(mode==="block"){
      S.bpHits.unshift({t,target:path+"()",mode:"fn-block",msg:"Execução cancelada · args: "+fmt(args)});
      return undefined;
    }
    if(mode==="force_true"){
      S.bpHits.unshift({t,target:path+"()",mode:"fn-true",msg:"Forçado retorno TRUE · args: "+fmt(args)});
      return true;
    }
    const r=orig.apply(this,args);
    S.bpHits.unshift({t,target:path+"()",mode:"fn-log",msg:"Chamada args="+fmt(args)+" → "+fmt(r)});
    return r;
  };
  S.fw=true;try{assign(keys,wrapped);}finally{S.fw=false;}
  S.fnHooks.set(path,{orig,mode});msg("Hook ativo ("+mode+") em "+path);
}

/* ---------- Motor de Busca Inteligente Local (Zero IA, Sem Saber Programar) ---------- */
function normTxt(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();}
function splitIdent(s){return normTxt(String(s||"").replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[_\-.[\]]+/g," "));}

const SEM_RULES=[
  {cat:"economia",re:/(balance|saldo|money|dinheiro|cash|wallet|carteira|account|conta|gold|ouro|coin|coins|moeda|gems|gema|credits|brl|grana|currency|budget|fundos|credito|debito)/i,title:"Dinheiro / Saldo",desc:"Guarda quanto dinheiro ou moedas você tem. Pode editar, monitorar variações ou bloquear gastos."},
  {cat:"economia",re:/(price|preco|cost|custo|valor|discount|desconto|fee|taxa|total|amount|quantia|parcela)/i,title:"Preço / Valor",desc:"Define quanto custa um item, taxa ou valor digitado. Útil para achar ofertas ou reduzir preço."},
  {cat:"status",re:/(hp|health|vida|vidas|life|energy|energia|stamina|mana|shield|escudo|armor|armadura|ammo|municao|level|nivel|xp|score|pontos|pontuacao|timer|tempo|speed|velocidade)/i,title:"Vida / Status",desc:"Atributo de saúde, energia, munição, tempo ou pontuação. Ideal para congelar ou impedir queda."},
  {cat:"inventario",re:/(shop|store|loja|catalog|catalogo|items|itens|inventory|inventario|bag|mochila|cart|carrinho|products|produtos|stock|estoque|txlist|historico)/i,title:"Loja / Inventário",desc:"Lista de itens, preços, transações ou produtos disponíveis na página."},
  {cat:"seguranca",re:/(token|auth|secret|segredo|pass|senha|key|apikey|jwt|session|admin|vip|premium|flag|license|licenca|role|disabled|bloqueado|liberado)/i,title:"Acesso / Segredo",desc:"Chave, senha, permissão VIP/Admin, bloqueio de botão ou token de sessão."},
  {cat:"logica",re:/(buy|purchase|comprar|spend|gastar|pay|pagar|withdraw|sacar|debit|damage|heal|add|earn|reward|check|verify|updateui|render|refresh|format)/i,title:"Ação / Regra da Tela",desc:"Função executável que realiza compras, saques, atualiza a tela ou valida regras."}
];
const SEM_SYN=[
  ["dinheiro","saldo","reais","moeda","ouro","grana","carteira","conta","fundos","money","cash","balance","wallet","account","gold","coins","gems","credit","brl"],
  ["preco","valor","custo","barato","acessivel","promocao","desconto","oferta","loja","item","itens","produto","estoque","price","cost","cheap","shop","store","catalog","discount"],
  ["vida","vidas","hp","saude","sangue","energia","stamina","mana","escudo","armadura","municao","imortal","health","life","energy","shield","ammo"],
  ["pontos","pontuacao","nivel","xp","experiencia","tempo","velocidade","score","level","exp","timer","speed"],
  ["comprar","gastar","pagar","sacar","retirar","descontar","cobrar","ganhar","buy","purchase","spend","pay","withdraw","deduct","earn","reward"],
  ["senha","token","chave","segredo","admin","vip","premium","liberado","bloqueado","password","secret","key","auth","flag","license","role"],
  ["tela","atualizar","renderizar","mostrar","interface","ui","update","render","refresh","display","draw"]
];

function classifyHuman(path,v){
  const leaf=String(path).split(".").pop()||path;
  for(const r of SEM_RULES){if(r.re.test(path)||r.re.test(leaf))return{cat:r.cat,title:r.title+" · "+leaf,desc:r.desc};}
  if(typeof v==="function")return{cat:"logica",title:"Função · "+leaf+"()",desc:"Código executável que realiza uma ação ou atualiza a tela quando chamado."};
  if(typeof v==="number")return{cat:"status",title:"Número · "+leaf,desc:"Valor numérico salvo na memória (saldo, pontuação, tempo ou contador)."};
  if(typeof v==="boolean")return{cat:"status",title:"Interruptor · "+leaf,desc:"Estado Sim/Não (true/false) que liga ou desliga um recurso."};
  return{cat:"interface",title:"Dado · "+leaf,desc:"Informação textual ou estruturada da página."};
}

/* ---------- Editor de Valores, Funções, JSON, Rede e IndexedDB ---------- */
function valueEditor(path,v,onSave){
  const inp=h("input",{cls:"i",value:show(v)});
  const save=nv=>{
    try{
      let oldVal;try{oldVal=resolve(splitPath(path));}catch(e){}
      S.fw=true;
      try{assign(splitPath(path),nv);}finally{S.fw=false;}
      if(S.frozen.has(path))S.frozen.set(path,nv);
      const L=S.locks.get(path);if(L&&(L.mode==="lock"||L.mode==="freeze"))L.lockedVal=nv;
      inp.value=show(nv);
      if(VS.res&&VS.res.length){
        VS.res.forEach(r=>{if(pstr(r.k)===path){r.v=nv;r.chg=(r.chg||0)+1;}});
      }
      const key=splitPath(path).pop();
      S.lastEdit={path,key,oldVal,newVal:nv};
      const rf=refreshPageUI(S.lastEdit);
      scanItemsAndPrices();
      updateHud();
      msg("✔ "+path+" = "+show(nv).slice(0,30)+" · "+rf.summary);
      if(onSave)onSave();else drawBody();
    }catch(e){msg("✖ "+e.message);}
  };
  inp.addEventListener("keydown",e=>{if(e.key==="Enter")save(parse(inp.value));});
  const cur=()=>resolve(splitPath(path));
  const quick=[];
  if(typeof v==="number"){[["+1",x=>x+1],["-1",x=>x-1],["+100",x=>x+100],["×2",x=>x*2],["÷2",x=>x/2],["0",()=>0],["999999",()=>999999],["MAX",()=>Number.MAX_SAFE_INTEGER]].forEach(([l,f])=>quick.push(btn(l,()=>{const c=cur();save(f(typeof c==="number"?c:Number(inp.value)));})));}
  if(typeof v==="boolean")quick.push(btn("Alternar",()=>save(!cur())),btn("true",()=>save(true)),btn("false",()=>save(false)));
  if(typeof v==="string")quick.push(btn("Vazio",()=>save("")),btn("MAIÚSC",()=>save(String(cur()).toUpperCase())));
  const fz=btn(S.frozen.has(path)?"🔥 Descongelar":"❄ Congelar",()=>{if(S.frozen.has(path)){S.frozen.delete(path);}else{S.frozen.set(path,parse(inp.value));}msg(S.frozen.size+" congelado(s)");drawBody();},S.frozen.has(path)?"on":"");
  const L=S.locks.get(path);
  return h("div",null,h("div",{cls:"row mt"},inp,btn("Salvar",()=>save(parse(inp.value)),"g"),btn("🔄 Atualizar Tela",()=>{const r=refreshPageUI({...(S.lastEdit||{}),path,key:splitPath(path).pop(),newVal:cur(),manual:true});drawBody();msg(r.summary);},"on")),
    h("div",{cls:"q"},quick,fz,
      btn(L&&L.mode==="block_decrease"?"🛡 Gasto Bloq.":"🛡 Bloquear Redução",()=>{toggleLock(path,"block_decrease");drawBody();},L&&L.mode==="block_decrease"?"am":""),
      btn(L&&L.mode==="multiply"?"⚡ 2x Ativo":"⚡ 2x Ganho",()=>{toggleLock(path,"multiply");drawBody();},L&&L.mode==="multiply"?"on":""),
      btn(L&&L.mode==="lock"?"🔓 Destravar":"🔒 Travar",()=>{toggleLock(path,"lock");drawBody();},L&&L.mode==="lock"?"on":""),
      btn(L&&L.mode==="log"?"👁 Parar BP":"👁 Quem escreve?",()=>{toggleLock(path,"log");drawBody();},L&&L.mode==="log"?"on":""),
      btn("Copiar",()=>copy(inp.value))));
}

function funcEd(path,fn){
  const ta=h("textarea",{rows:7});try{ta.value=Function.prototype.toString.call(fn);}catch(e){ta.value="";}
  const args=h("input",{cls:"i",placeholder:'argumentos JSON: [1,"abc"]'});const out=h("div",{cls:"mono mt"});
  const mk=src=>{try{return (0,eval)("("+src+")");}catch(e){const o=(0,eval)("({"+src+"})");return Object.values(o)[0];}};
  const hk=S.fnHooks.get(path);
  return h("div",{cls:"mt"},ta,
    h("div",{cls:"q"},
      btn("Aplicar código",()=>{try{const nf=mk(ta.value);S.fw=true;try{assign(splitPath(path),nf);}finally{S.fw=false;}msg("✔ função substituída");}catch(e){msg("✖ "+e.message);}},"g"),
      btn(hk&&hk.mode==="log"?"Parar Interceptar":"👁 Interceptar Chamadas",()=>{hookFunction(path,"log");drawBody();},hk&&hk.mode==="log"?"on":""),
      btn(hk&&hk.mode==="block"?"Desbloquear Função":"🛑 Cancelar Função",()=>{hookFunction(path,"block");drawBody();},hk&&hk.mode==="block"?"r":""),
      btn(hk&&hk.mode==="force_true"?"Remover True":"✔ Forçar Retorno True",()=>{hookFunction(path,"force_true");drawBody();},hk&&hk.mode==="force_true"?"am":""),
      btn("Copiar",()=>copy(ta.value))
    ),
    h("div",{cls:"row mt"},args,btn("▶ Chamar",async()=>{try{const keys=splitPath(path);const f=resolve(keys);const pk=keys.slice(0,-1);const tv=pk.length?resolve(pk):W;const a=args.value.trim()?JSON.parse(args.value):[];const r=await f.apply(tv,a);out.textContent="← "+fmt(r);S.logs.push({l:"res",t:"",m:path+"(…) ← "+fmt(r)});}catch(e){out.textContent="✖ "+e.message;}},"g")),out);
}
function fnDet(path,fn){return h("details",{cls:"mt",ontoggle:e=>{const d=e.target;if(d.open&&!d.__f){d.__f=1;d.appendChild(funcEd(path,fn));}}},h("summary",{cls:"mu"},"✏ ver/editar código · interceptar · chamar ƒ"));}

function jsonEd(o,full){const ta=h("textarea",{rows:7});
  try{ta.value=JSON.stringify(o,(k,v)=>typeof v==="bigint"?v+"n":v,2);}catch(e){ta.value="(não serializável: "+e.message+")";}
  return h("div",{cls:"mt"},ta,h("div",{cls:"q"},
    btn("Mesclar no objeto",()=>{try{Object.assign(o,JSON.parse(ta.value));const rf=refreshPageUI({path:pstr(full),key:full[full.length-1],manual:true});msg("✔ mesclado · "+rf.summary);drawBody();}catch(e){msg("✖ "+e.message);}},"g"),
    btn("Substituir referência",()=>{try{assign(full,JSON.parse(ta.value));const rf=refreshPageUI({path:pstr(full),key:full[full.length-1],manual:true});msg("✔ substituído · "+rf.summary);drawBody();}catch(e){msg("✖ "+e.message);}}),
    btn("+ propriedade",()=>{const k=prompt("Nome da propriedade:");if(k==null||k==="")return;try{o[k]=parse(prompt("Valor:")||"");drawBody();}catch(e){msg("✖ "+e.message);}})));}

function reqEd(n){const m=h("input",{cls:"i",value:n.method,style:"max-width:80px"}),u=h("input",{cls:"i",value:n.url}),
  hd=h("textarea",{rows:2,placeholder:'headers JSON: {"Content-Type":"application/json"}'}),bd=h("textarea",{rows:3});bd.value=n.reqBody||"";
  const out=h("div",{cls:"mono mt",style:"max-height:220px;overflow:auto"});
  return h("details",{cls:"mt"},h("summary",{cls:"mu"},"✏ Editar e reenviar"),h("div",{cls:"row mt"},m,u),h("div",{cls:"mt"},hd),h("div",{cls:"mt"},bd),
    h("div",{cls:"q"},btn("Enviar",async()=>{try{const o={method:m.value.toUpperCase(),credentials:"include"};if(hd.value.trim())o.headers=JSON.parse(hd.value);if(bd.value&&!/^(GET|HEAD)$/.test(o.method))o.body=bd.value;const r=await (S.of||W.fetch.bind(W))(u.value,o);const t=await r.text();out.textContent=r.status+" "+r.statusText+"\n"+prettyMaybe(t.slice(0,200000));}catch(e){out.textContent="✖ "+e.message;}},"g")),out);}

function idbOpen(name){return new Promise((res,rej)=>{const r=indexedDB.open(name);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function idbDump(name){const db=await idbOpen(name);const out=[];
  for(const sn of [...db.objectStoreNames]){const st=db.transaction(sn,"readonly").objectStore(sn);
    const recs=await new Promise((res,rej)=>{const a=[];const c=st.openCursor();c.onsuccess=()=>{const cu=c.result;if(cu){a.push({k:cu.key,v:cu.value});cu.continue();}else res(a);};c.onerror=()=>rej(c.error);});
    out.push({store:sn,keyPath:st.keyPath,recs});}
  db.close();return out;}
async function idbPut(name,store,key,val){const db=await idbOpen(name);
  await new Promise((res,rej)=>{const tx=db.transaction(store,"readwrite");const st=tx.objectStore(store);if(st.keyPath!=null)st.put(val);else st.put(val,key);tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});db.close();}

/* ---------- Variáveis let/const lexicais ---------- */
function lexScan(){const names=new Set();const re=/\b(?:let|const|var|function|class)\s+([A-Za-z_$][\w$]*)/g;
  for(const it of SRC.items.values()){const u=it.url||"";if(!it.text)continue;if(/^(net:|req:|fn:|map:)/.test(u))continue;if(u[0]==="#"&&!/^#(DOM atual|HTML original|script inline)/.test(u))continue;
    re.lastIndex=0;let m;while((m=re.exec(it.text))&&names.size<40000)names.add(m[1]);}
  const ok=[];let csp=false;
  names.forEach(n=>{if(n in W)return;const t=lexTypeof(n);if(t==="!csp"){csp=true;return;}if(t!=="undefined"&&t!=="tdz")ok.push(n);});
  S.lexNames=ok;S.lexCsp=csp;}
function lexList(){if(!S.lexNames)return [];const out=[];for(const n of S.lexNames){let v;try{if(n in W)continue;v=lexGet(n);}catch(e){continue;}out.push([n,v]);}return out;}

/* ---------- Radar Cheat + Orçamento em Tempo Real + Itens Mais Acessíveis ---------- */
const VS=S.vs=S.vs||{res:[],run:false,info:"",q:"",bulk:"",deep:6,all:false,page:100,watch:true,tracked:"",items:[],initNum:null};

function scanItemsAndPrices(){
  const items=[];const seen=new WeakSet();const dedup=new Set();
  const walk=(o,p,d)=>{
    if(!o||typeof o!=="object"||d>5||seen.has(o)||o instanceof Node||o===W)return;
    seen.add(o);
    if(Array.isArray(o)){
      o.forEach((el,i)=>{
        if(el&&typeof el==="object"&&!Array.isArray(el)){
          const pr=typeof el.price==="number"?el.price:typeof el.cost==="number"?el.cost:typeof el.valor==="number"?el.valor:typeof el.preco==="number"?el.preco:null;
          const nm=el.name??el.title??el.nome??el.label;
          if(pr!==null&&typeof nm==="string"){
            const key=nm+"|"+pr;
            if(!dedup.has(key)){dedup.add(key);items.push({name:nm,price:pr,prev:el.previousPrice??el.basePrice,cat:el.category||el.categoria||"Memória JS",src:p+"["+i+"]"});}
          }
        }
        walk(el,p+"["+i+"]",d+1);
      });
    }else{
      let ks;try{ks=Object.keys(o).slice(0,50);}catch(e){return;}
      ks.forEach(k=>{try{walk(o[k],p+"."+k,d+1);}catch(e){}});
    }
  };
  siteGlobals().forEach(([k,v])=>walk(v,"window."+k,0));
  /* Escaneia respostas JSON recentes capturadas na rede */
  S.net.slice(0,25).forEach((n,idx)=>{
    if(!n.resBody||!/^\s*[\[{]/.test(n.resBody))return;
    try{walk(JSON.parse(n.resBody),"net["+idx+"]",0);}catch(e){}
  });
  /* Escaneia preços visíveis na tela (R$, $, € ou atributos data-bp-price) */
  D.querySelectorAll("[data-bp-item]").forEach(el=>{
    const nm=el.getAttribute("data-bp-name")||el.textContent.trim().slice(0,45);
    const pr=Number(el.getAttribute("data-bp-price"));
    if(!Number.isNaN(pr)&&!dedup.has(nm+"|"+pr)){dedup.add(nm+"|"+pr);items.push({name:nm,price:pr,cat:el.getAttribute("data-bp-category")||"Tela",src:"DOM",el});}
  });
  D.querySelectorAll("button,a,li,div,span,article").forEach(el=>{
    if(items.length>250||el.children.length>4)return;
    const txt=(el.textContent||"").trim();
    if(txt.length<3||txt.length>90)return;
    const m=txt.match(/(?:R\$|US\$|\$|€)\s*(\d+(?:[.,]\d{1,2})?)/);
    if(m){
      const pr=Number(m[1].replace(",","."));
      const par=el.closest("li,article,tr,[class*=card],[class*=item],[class*=product]")||el.parentElement;
      const nm=((par?par.textContent:txt)||"").replace(m[0],"").replace(/\s+/g," ").trim().slice(0,45)||"Item na página";
      if(!Number.isNaN(pr)&&!dedup.has(nm+"|"+pr)){dedup.add(nm+"|"+pr);items.push({name:nm,price:pr,cat:"Página",src:"DOM",el:par||el});}
    }
  });
  VS.items=items.sort((a,b)=>a.price-b.price);
  return VS.items;
}

function matchEq(v,t){if(typeof t==="number")return typeof v==="number"?v===t:(typeof v==="string"&&v===String(t));if(typeof t==="boolean")return v===t;return String(v)===String(t);}

async function vsWalk(onVal){
  const seen=new WeakSet(),q=[];let cnt=0,t0=performance.now();
  const SKIP=new Set(["window","self","top","parent","frames","document","globalThis","chrome","external","opener","localStorage","sessionStorage","navigator","performance","history","location","screen","caches","indexedDB","crypto","visualViewport"]);
  const handle=(v,keys,d)=>{const t=typeof v;if(v==null||t==="symbol"||t==="function")return;
    if(t==="object"){if(v===W||(typeof Node!=="undefined"&&v instanceof Node)||seen.has(v))return;seen.add(v);if(d<VS.deep&&q.length<200000)q.push([v,keys,d]);return;}
    onVal(v,keys);};
  const names=VS.all?Object.getOwnPropertyNames(W).filter(k=>!SKIP.has(k)&&!k.startsWith("__bp")&&!k.startsWith("__kl")):siteGlobals().map(x=>x[0]);
  for(const k of names){let dsc;try{dsc=Object.getOwnPropertyDescriptor(W,k);}catch(e){continue;}if(!dsc||!("value" in dsc))continue;handle(dsc.value,[k],1);}
  lexList().forEach(([n,v])=>handle(v,["@lex:"+n],1));
  /* Escaneia estados React & Vue ao vivo para achar e editar sem recarregar */
  try{scanFrameworks();
    S.rfHooks.forEach(hk=>handle(hk.state.memoizedState,["@react",String(hk.id)],1));
    S.vueRefs.forEach(vr=>handle(vr.data,["@vue",String(vr.id)],1));
  }catch(e){}
  /* Também verifica localStorage & sessionStorage */
  [["@ls",W.localStorage],["@ss",W.sessionStorage]].forEach(([pfx,st])=>{
    try{Object.keys(st).forEach(k=>{const val=parse(st.getItem(k));if(typeof val!=="object")onVal(val,[pfx,k]);else handle(val,[pfx,k],1);});}catch(e){}
  });
  for(let qi=0;qi<q.length;qi++){const [o,keys,d]=q[qi];let ks;try{ks=Reflect.ownKeys(o);}catch(e){continue;}
    if(ks.length>5000)ks=ks.slice(0,5000);const isArr=Array.isArray(o);
    for(const k of ks){if(typeof k==="symbol"||(isArr&&k==="length"))continue;let dsc;try{dsc=Object.getOwnPropertyDescriptor(o,k);}catch(e){continue;}if(!dsc||!("value" in dsc))continue;handle(dsc.value,keys.concat(k),d+1);}
    if(++cnt%200===0&&performance.now()-t0>14){VS.info=cnt+" objetos · "+VS.res.length+" achados…";await new Promise(r=>setTimeout(r,0));t0=performance.now();}}
  return cnt;
}

async function vsFirst(mode){
  if(VS.run)return;
  if((mode==="eq"||mode==="has")&&VS.q===""){msg("Digite um valor primeiro");return;}
  VS.run=true;VS.res=[];VS.page=100;VS.info="escaneando memória…";drawBody();
  const t=parse(VS.q),qs=String(VS.q).toLowerCase();
  if(mode==="eq"&&typeof t==="number")VS.initNum=t;
  try{
    await vsWalk((v,keys)=>{
      if(VS.res.length>=300000)return;
      if(mode==="eq"){if(matchEq(v,t))VS.res.push({k:keys,v,init:v,chg:0});}
      else if(mode==="has"){if(typeof v==="string"&&v.toLowerCase().includes(qs))VS.res.push({k:keys,v,init:v,chg:0});}
      else if(typeof v==="number"&&isFinite(v))VS.res.push({k:keys,v,init:v,chg:0});
    });
  }catch(e){msg("✖ "+e.message);}
  scanItemsAndPrices();
  if(VS.res.length===1)VS.tracked=pstr(VS.res[0].k);
  VS.run=false;msg(VS.res.length+" resultado(s) salvos — monitorando variações");drawBody();
}

function vsNext(mode){
  const t=parse(VS.q),qs=String(VS.q).toLowerCase(),keep=[];
  for(const r of VS.res){let c;try{c=resolve(r.k);}catch(e){continue;}let ok=false;
    if(mode==="eq")ok=matchEq(c,t);else if(mode==="has")ok=typeof c==="string"&&c.toLowerCase().includes(qs);
    else if(mode==="ch")ok=c!==r.v;else if(mode==="un")ok=c===r.v;
    else if(mode==="up")ok=typeof c==="number"&&typeof r.v==="number"&&c>r.v;else if(mode==="dn")ok=typeof c==="number"&&typeof r.v==="number"&&c<r.v;
    if(ok){r.v=c;keep.push(r);}}
  VS.res=keep;msg(keep.length+" resultado(s)");
}

/* Auto-monitor de variações para o modo Cheat Budget */
window.__bpT.push(setInterval(()=>{
  if(!VS.watch||!VS.res.length)return;
  let any=false;
  VS.res.forEach(r=>{
    if(r.chg>500)return;
    let c;try{c=resolve(r.k);}catch(e){return;}
    if(c!==r.v&&typeof c==="number"){
      r.v=c;r.chg=(r.chg||0)+1;any=true;
      const ps=pstr(r.k);
      if(!VS.tracked||classifyHuman(ps,c).cat==="economia")VS.tracked=ps;
    }
  });
  if(any)scanItemsAndPrices();
  updateHud();
},350));

function getLiveBalance(){
  if(VS.tracked){try{const v=resolve(splitPath(VS.tracked));if(typeof v==="number")return v;}catch(e){}}
  const ch=VS.res.find(r=>r.chg>0&&typeof r.v==="number")||VS.res.find(r=>typeof r.v==="number");
  if(ch)return ch.v;
  return VS.initNum;
}

function updateHud(){
  const bal=getLiveBalance();
  const aff=bal!=null?VS.items.filter(i=>i.price<=bal).length:0;
  HUD.innerHTML="";
  HUD.append(
    h("span",null,"⚡ breakpoint-search"),
    bal!=null?h("b",null,"Saldo: "+bal):null,
    bal!=null?h("span",{cls:"ok"},aff+" acessíveis"):null,
    S.bpHits.length?h("span",{cls:"warn"},S.bpHits.length+" BP"):null
  );
}

/* ---------- Scanner de Fontes, Segredos, SourceMaps e Beautifier (v5 completo) ---------- */
const SRC=S.src=S.src||{items:new Map(),seen:new Set(),run:false,ran:false,done:0,total:0,finds:[],view:null,pretty:false,cat:"",focus:null};
const RF=S.of||W.fetch.bind(W);
function allRes(){const m=new Map(S.res);try{performance.getEntriesByType("resource").forEach(r=>m.set(r.name,r));}catch(e){}return [...m.values()];}
function addSrc(label,text,key){if(text==null||text==="")return;const k=key||("#"+label);SRC.items.set(k,{url:k,label,text:String(text).slice(0,3e6)});}
async function grab(url){
  if(SRC.seen.has(url))return;SRC.seen.add(url);
  const it={url,label:url,text:"",ct:""};SRC.items.set(url,it);
  try{const r=await RF(url,{credentials:"include",cache:"force-cache"});it.status=r.status;it.ct=r.headers.get("content-type")||"";
    if(/^(image|video|audio|font)\//.test(it.ct)||/octet-stream|wasm/.test(it.ct)){it.bin=true;return;}
    it.text=(await r.text()).slice(0,3e6);
    const m=it.text.slice(-500).match(/sourceMappingURL=([^\s'"*]+)/);
    if(m&&!/^data:/.test(m[1])){try{await grabMap(new URL(m[1],url).href);}catch(e){}}
  }catch(e){it.err=String(e&&e.message||e);}
}
async function grabMap(u){if(SRC.seen.has(u))return;SRC.seen.add(u);
  try{const j=await (await RF(u,{credentials:"include",cache:"force-cache"})).json();
    (j.sources||[]).forEach((x,i)=>{if(j.sourcesContent&&j.sourcesContent[i])addSrc("sourcemap: "+x,j.sourcesContent[i],"map:"+u+"::"+x);});}catch(e){}}
async function pool(list,n,fn){let i=0;await Promise.all(Array.from({length:n},async()=>{while(i<list.length){await fn(list[i++]);}}));}
async function scanAll(){
  if(SRC.run)return;SRC.run=true;SRC.done=0;msg("Escaneando fontes…");
  const tick=()=>{if(S.tab==="src"&&!SRC.view&&!(R.activeElement&&/INPUT|TEXTAREA/.test(R.activeElement.tagName)))drawBody();};
  try{
    addSrc("DOM atual (outerHTML)",D.documentElement.outerHTML);
    try{addSrc("HTML original da página",await (await RF(location.href,{credentials:"include",cache:"force-cache"})).text());}catch(e){}
    [...D.scripts].forEach((x,i)=>{if(!x.src)addSrc("script inline #"+(i+1),x.textContent);});
    D.querySelectorAll("style").forEach((x,i)=>addSrc("style inline #"+(i+1),x.textContent));
    const cm=[],tw=D.createTreeWalker(D,NodeFilter.SHOW_COMMENT);let c;while((c=tw.nextNode()))cm.push(c.nodeValue.trim());
    addSrc("Comentários HTML",cm.join("\n-----\n"));
    const at=[];D.querySelectorAll("*").forEach(e=>{[...e.attributes].forEach(a=>{if(/^(data-|on|value$|hidden|placeholder|title|alt|content$|action$|aria-label)/i.test(a.name)||e.type==="hidden")at.push(e.nodeName.toLowerCase()+(e.id?"#"+e.id:"")+" "+a.name+'="'+a.value+'"');});});
    addSrc("Atributos (data-*, hidden, onclick, value…)",at.join("\n"));
    try{const o=[];siteGlobals().forEach(([k,v])=>{
      if(typeof v==="function"){const t=Function.prototype.toString.call(v);if(!/\[native code\]/.test(t))addSrc("função window."+k,t,"fn:"+k);return;}
      o.push(k+" = "+show(v).slice(0,5000));
      if(v&&typeof v==="object"){try{Object.getOwnPropertyNames(v).slice(0,200).forEach(p=>{let x;try{x=v[p];}catch(e){return;}if(typeof x==="function"){const t=Function.prototype.toString.call(x);if(!/\[native code\]/.test(t))addSrc("método window."+k+"."+p,t,"fn:"+k+"."+p);}});}catch(e){}}});
      addSrc("Variáveis globais do site",o.join("\n"));}catch(e){}
    [["localStorage",W.localStorage],["sessionStorage",W.sessionStorage]].forEach(([n,st])=>{try{addSrc(n,Object.keys(st).map(k=>k+" = "+st.getItem(k)).join("\n"));}catch(e){}});
    addSrc("Cookies visíveis (não-HttpOnly)",D.cookie.split(/;\s*/).join("\n"));
    D.querySelectorAll("iframe").forEach((f,i)=>{try{const d=f.contentDocument;if(d)addSrc("iframe #"+(i+1)+" "+(f.src||""),d.documentElement.outerHTML);}catch(e){}});
    S.net.forEach((n,i)=>{if(n.resBody)addSrc("resposta capturada: "+n.method+" "+n.url,n.resBody,"net:"+i+":"+n.url);if(n.reqBody)addSrc("envio capturado: "+n.method+" "+n.url,n.reqBody,"req:"+i+":"+n.url);});
    try{if(indexedDB.databases)for(const d of await indexedDB.databases())addSrc("IndexedDB: "+d.name,JSON.stringify(await idbDump(d.name)));}catch(e){}
    const urls=new Set();
    allRes().forEach(r=>{if(!/^(img|image|video|audio|css-image)$/.test(r.initiatorType)||/\.(js|json|css|txt|map|html?)(\?|$)/i.test(r.name))urls.add(r.name);});
    D.querySelectorAll("script[src],link[href],iframe[src],embed[src],object[data]").forEach(e=>{if(e.rel&&/icon/.test(e.rel))return;const u=e.src||e.href||e.data;if(u)urls.add(u);});
    S.net.forEach(n=>{if(n.method==="GET"||n.method==="get")try{urls.add(new URL(n.url,location.href).href);}catch(e){}});
    const list=[...urls].filter(u=>/^(https?|blob):/.test(u)&&u!==location.href);SRC.total=list.length;
    await pool(list,6,async u=>{await grab(u);SRC.done++;if(SRC.done%4===0){msg("Lendo "+SRC.done+"/"+SRC.total);tick();}});
    SRC.finds=findAll();SRC.ran=true;try{lexScan();}catch(e){}
  }catch(e){msg("Erro no scan: "+e.message);}
  SRC.run=false;msg("Scan completo: "+SRC.items.size+" fontes · "+SRC.finds.length+" achados");tick();
}

function printable(s){if(!s||s.length<4)return false;let p=0;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);if((c>=32&&c<127)||c===9||c===10||c===13)p++;}return p/s.length>0.92&&/[A-Za-z]{3}/.test(s);}
function b64d(s){try{return decodeURIComponent(escape(atob(s)));}catch(e){try{return atob(s);}catch(e2){return null;}}}
function hexd(s){try{return s.match(/../g).map(x=>String.fromCharCode(parseInt(x,16))).join("");}catch(e){return null;}}
const KW="pass|senha|user|usu|login|admin|secret|key|token|flag|pin|code|cod";
const PATS=[
  ["🚩 Flag",/\b[A-Za-z0-9_]{2,12}\{[^{}\s]{3,120}\}/g,1],
  ["🔑 Credencial",/(?:pass(?:word|wd|phrase)?|pwd|senha|user(?:name)?|usu[aá]rio|login|admin|secret|segredo|token|api[_-]?key|apikey|auth|credential|private[_-]?key|key|chave|flag)["'\]]*\s*[:=]\s*["'`][^"'`\n]{1,150}["'`]/gi,1],
  ["⚖ Comparação suspeita",new RegExp("(?:"+KW+")\\w*\\s*[!=]==?\\s*['\\x22\\x60][^'\\x22\\x60\\n]{1,100}['\\x22\\x60]|['\\x22\\x60][^'\\x22\\x60\\n]{1,100}['\\x22\\x60]\\s*[!=]==?\\s*\\w*(?:"+KW+")\\w*|\\.value\\s*[!=]==?\\s*['\\x22\\x60][^'\\x22\\x60\\n]{1,100}['\\x22\\x60]","gi"),1],
  ["🎫 JWT",/eyJ[\w-]{8,}\.[\w-]{8,}\.[\w-]*/g,1],
  ["🗝 Chave/token conhecido",/-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|AIza[\w-]{35}|xox[baprs]-[\w-]{10,}|gh[pousr]_\w{36}|sk_live_\w{16,}|Bearer\s+[\w.~+\/-]{15,}/g,1],
  ["📦 Base64 legível",/[A-Za-z0-9+\/_-]{12,}={0,2}/g,1,"b64"],
  ["🔢 Hex legível",/\b(?:[0-9a-fA-F]{2}){6,}\b/g,1,"hex"],
  ["#️⃣ Hash (md5/sha)",/\b(?:[a-fA-F0-9]{32}|[a-fA-F0-9]{40}|[a-fA-F0-9]{64})\b/g,0],
  ["✉ E-mail",/[\w.+-]+@[\w-]+\.[\w.-]{2,}/g,0],
  ["🌐 Endpoint/URL",/["'`]((?:\/|\.\/|\.\.\/)[\w\-.\/~%]{2,100}|https?:\/\/[^"'`\s<>]{6,200})["'`]/g,0,"url"],
  ["🌍 IP",/\b(?:\d{1,3}\.){3}\d{1,3}\b/g,0]
];
function findAll(){const out=[],seen=new Set();
  for(const it of SRC.items.values()){const t=it.text;if(!t)continue;
    for(const [cat,re,pri,kind] of PATS){re.lastIndex=0;let m,n=0;
      while((m=re.exec(t))&&n<400){n++;const s=kind==="url"?m[1]:m[0];let dec="";
        if(kind==="b64"){let x=s.replace(/-/g,"+").replace(/_/g,"/");while(x.length%4)x+="=";const d=b64d(x);if(!printable(d))continue;dec=d;}
        else if(kind==="hex"){const d=hexd(s);if(!printable(d))continue;dec=d;}
        const key=cat+"|"+s;if(seen.has(key))continue;seen.add(key);
        out.push({cat,pri,m:s.slice(0,300),dec:dec.slice(0,500),src:it.label,url:it.url,ctx:t.slice(Math.max(0,m.index-90),m.index+s.length+90).replace(/\s+/g," ")});
        if(out.length>3000)return out;}}}
  return out;}
function searchSrc(q){let re;try{const m=q.match(/^\/(.+)\/[a-z]*$/);re=new RegExp(m?m[1]:q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");}catch(e){return null;}
  const out=[];for(const it of SRC.items.values()){const t=it.text;if(!t)continue;re.lastIndex=0;let m,n=0;
    while((m=re.exec(t))&&n<30&&out.length<400){n++;if(!m[0])break;out.push({it,m:m[0],a:t.slice(Math.max(0,m.index-100),m.index).replace(/\s+/g," "),b:t.slice(m.index+m[0].length,m.index+m[0].length+100).replace(/\s+/g," ")});}}
  return out;}
function beauty(s){let o="",ind=0,q=null,esc=false,par=0;const nl=()=>"\n"+"  ".repeat(Math.max(0,ind));
  for(let i=0;i<s.length;i++){const c=s[i];
    if(q){o+=c;if(esc)esc=false;else if(c==="\\")esc=true;else if(c===q)q=null;continue;}
    if(c==='"'||c==="'"||c==="`"){q=c;o+=c;continue;}
    if(c==="("){par++;o+=c;continue;}if(c===")"){par--;o+=c;continue;}
    if(c==="{"){ind++;o+=c+nl();continue;}
    if(c==="}"){ind--;o+=nl()+c;if(![";",",",")"].includes(s[i+1]))o+=nl();continue;}
    if(c===";"&&par<=0){o+=c+nl();continue;}
    o+=c;}
  return o;}
async function openSrc(u,f){msg("Carregando…");if(!SRC.items.has(u))await grab(u);SRC.view=u;SRC.focus=f||null;S.tab="src";draw();}
function viewer(B){const it=SRC.items.get(SRC.view);if(!it){SRC.view=null;return;}
  let txt=it.text||"";if(SRC.pretty&&txt.length<1e6)txt=beauty(txt);
  B.appendChild(h("div",{cls:"row sp",style:"margin-bottom:6px"},btn("‹ Voltar",()=>{SRC.view=null;SRC.focus=null;draw();}),h("div",{cls:"row"},btn(SRC.pretty?"Original":"Embelezar JS",()=>{SRC.pretty=!SRC.pretty;draw();},SRC.pretty?"on":""),btn("Copiar tudo",()=>copy(it.text)))));
  B.appendChild(h("div",{cls:"mono mu",style:"margin-bottom:6px"},it.label+" · "+fmtB(it.text.length)+(it.status?" · HTTP "+it.status:"")+(it.err?" · ERRO: "+it.err:"")+(it.bin?" · binário ("+it.ct+")":"")));
  const ta=h("textarea",{readonly:true,wrap:"off",style:"height:60vh;white-space:pre;overflow:auto"});ta.value=txt.slice(0,600000);B.appendChild(ta);
  if(SRC.focus){const i=ta.value.indexOf(SRC.focus);if(i>=0)setTimeout(()=>{const ln=ta.value.slice(0,i).split("\n").length-1;const lh=parseFloat(getComputedStyle(ta).lineHeight)||16;ta.scrollTop=Math.max(0,(ln-3)*lh);try{ta.setSelectionRange(i,i+SRC.focus.length);}catch(e){}},30);}}

/* ---------- Coletor Semântico Universal (Window + Objetos + React/Vue + Storage) ---------- */
function collectSemantic(){
  const out=[];const seen=new WeakSet();
  const walk=(o,keys,d)=>{
    if(!o||typeof o!=="object"||d>4||seen.has(o)||o instanceof Node||o===W)return;
    seen.add(o);
    let ks;try{ks=Object.getOwnPropertyNames(o).slice(0,80);}catch(e){return;}
    for(const k of ks){if(Array.isArray(o)&&k==="length")continue;let v;try{v=o[k];}catch(e){continue;}
      const np=keys.concat(k);const ps=pstr(np);
      out.push({ps,keys:np,v,h:classifyHuman(ps,v)});
      if(v&&typeof v==="object")walk(v,np,d+1);
    }
  };
  siteGlobals().forEach(([k,v])=>{const ps=pstr(["window",k]);out.push({ps,keys:["window",k],v,h:classifyHuman(ps,v)});if(v&&typeof v==="object")walk(v,["window",k],1);});
  lexList().forEach(([k,v])=>{const ps=pstr(["@lex:"+k]);out.push({ps,keys:["@lex:"+k],v,h:classifyHuman(ps,v)});if(v&&typeof v==="object")walk(v,["@lex:"+k],1);});
  try{scanFrameworks();
    S.rfHooks.forEach(hk=>{const ps=pstr(["@react",String(hk.id)]);const v=hk.state.memoizedState;out.push({ps,keys:["@react",String(hk.id)],v,h:classifyHuman(hk.name,v)});if(v&&typeof v==="object")walk(v,["@react",String(hk.id)],1);});
    S.vueRefs.forEach(vr=>{const ps=pstr(["@vue",String(vr.id)]);out.push({ps,keys:["@vue",String(vr.id)],v:vr.data,h:classifyHuman("VueState",vr.data)});walk(vr.data,["@vue",String(vr.id)],1);});
  }catch(e){}
  [["@ls",W.localStorage],["@ss",W.sessionStorage]].forEach(([pfx,st])=>{
    try{Object.keys(st).forEach(k=>{const v=parse(st.getItem(k));const ps=pstr([pfx,k]);out.push({ps,keys:[pfx,k],v,h:classifyHuman(ps,v)});});}catch(e){}
  });
  return out;
}

const SEM={q:"",cat:"all",type:"all",onlyEdit:false};
function runSemanticSearch(){
  const all=collectSemantic();
  const ql=normTxt(SEM.q.trim());
  const opM=ql.match(/(<=|>=|<|>|=)\s*(-?\d+(?:[.,]\d+)?)/);
  const opSym=opM?opM[1]:null;
  const opVal=opM?Number(opM[2].replace(",",".")):null;
  const cleanQ=ql.replace(/(<=|>=|<|>|=)\s*-?\d+(?:[.,]\d+)?/g," ").trim();
  const tokens=cleanQ.split(/[\s,.;!?]+/).filter(t=>t.length>=2);
  const exp=new Set(tokens);
  tokens.forEach(t=>SEM_SYN.forEach(cl=>{if(cl.some(w=>w.includes(t)||t.includes(w)))cl.forEach(w=>exp.add(w));}));
  const numM=cleanQ.match(/\b(-?\d+(?:[.,]\d+)?)\b/);
  const hintNum=numM?Number(numM[1].replace(",",".")):null;
  const domIds=new Set([...D.querySelectorAll("[id]")].map(e=>normTxt(e.id)).filter(x=>x.length>=2));
  const out=[];
  all.forEach(item=>{
    if(SEM.cat!=="all"&&item.h.cat!==SEM.cat)return;
    const tv=item.v===null?"null":typeof item.v;
    if(SEM.type!=="all"&&tv!==SEM.type)return;
    if(SEM.onlyEdit&&(typeof item.v==="object"||typeof item.v==="function"))return;
    if(opSym!==null){
      if(typeof item.v!=="number"||!isFinite(item.v))return;
      const ok=opSym==="="?item.v===opVal:opSym==="<"?item.v<opVal:opSym==="<="?item.v<=opVal:opSym===">"?item.v>opVal:item.v>=opVal;
      if(!ok)return;
    }
    let score=0;
    const leaf=normTxt(String(item.ps).split(".").pop()||"");
    const hay=(splitIdent(item.ps)+" "+normTxt(item.h.title+" "+item.h.desc)+" "+(typeof item.v==="object"?"":normTxt(String(item.v)))).trim();
    if(!tokens.length&&hintNum===null){
      score=typeof item.v==="number"?80:50;
      if(opSym!==null)score+=20;
    }else{
      if(cleanQ&&normTxt(item.ps).includes(cleanQ))score+=60;
      exp.forEach(t=>{if(hay.includes(t))score+=tokens.includes(t)?30:16;});
      if(hintNum!==null&&item.v===hintNum)score+=55;
      if(opSym!==null)score+=25;
    }
    if(score>0&&domIds.has(leaf))score+=18;
    if(score>0)out.push({...item,score:Math.min(100,score)});
  });
  return out.sort((a,b)=>b.score-a.score);
}

/* ---------- Abas ---------- */
const TABS={
sem:{n:"🧠 Busca Inteligente",render(B){
  const resBox=h("div");
  const qi=h("input",{cls:"i",placeholder:'Busque em português: "meu dinheiro", "preço <= 50", "vida", "atualizar"...',value:SEM.q});
  const renderRes=()=>{
    resBox.textContent="";
    const res=runSemanticSearch();
    resBox.appendChild(h("div",{cls:"mu",style:"margin-bottom:6px"},res.length+" resultado(s) inteligentes encontrados localmente (sem IA externa)"));
    if(/barat|acessiv|preco|loja|item|<=|</i.test(normTxt(SEM.q))||SEM.cat==="economia"){
      const items=scanItemsAndPrices();
      if(items.length){
        const limM=normTxt(SEM.q).match(/(?:<=|<)\s*(\d+(?:[.,]\d+)?)/);
        const lim=limM?Number(limM[1].replace(",",".")):getLiveBalance();
        const top=lim!=null?items.filter(it=>it.price<=lim):items;
        resBox.appendChild(h("div",{cls:"c hi"},
          h("div",{cls:"row sp"},h("b",null,"🛒 Itens mais acessíveis ("+top.length+"/"+(items.length)+")"),lim!=null?h("span",{cls:"ok mono"},"Até "+lim):null),
          top.slice(0,8).map(it=>h("div",{cls:"lg row sp"},h("span",null,it.name),h("b",{cls:"ok mono"},String(it.price))))
        ));
      }
    }
    res.slice(0,120).forEach(r=>{
      const prim=r.v===null||["number","string","boolean","undefined","bigint"].includes(typeof r.v);
      resBox.appendChild(h("div",{cls:"c"},
        h("div",{cls:"row sp"},h("b",null,r.h.title),h("div",{cls:"row"},tag(r.v),h("span",{cls:"mu"},r.score+"%"))),
        h("div",{cls:"k mono mt"},r.ps),
        h("div",{cls:"mu mt"},r.h.desc),
        prim?valueEditor(r.ps,r.v,()=>renderRes()):h("div",null,h("div",{cls:"mu mono mt"},typeof r.v==="function"?"ƒ "+(r.v.name||"anon")+"()":show(r.v).slice(0,120)),
          h("div",{cls:"q"},btn("Abrir ›",()=>{S.root=r.ps;S.path=[];S.tab="obj";draw();})),
          typeof r.v==="function"?fnDet(r.ps,r.v):null)
      ));
    });
  };
  let tmr=null;
  qi.oninput=()=>{SEM.q=qi.value;clearTimeout(tmr);tmr=setTimeout(renderRes,120);};
  qi.addEventListener("keydown",e=>{if(e.key==="Enter")renderRes();});
  const setQ=v=>{SEM.q=v;qi.value=v;renderRes();};
  B.appendChild(h("div",{cls:"c"},
    h("div",{cls:"row"},qi,btn("Buscar",renderRes,"g")),
    h("div",{cls:"q"},
      [["all","Tudo"],["economia","💰 Dinheiro/Preços"],["status","❤️ Vida/Status"],["inventario","🛒 Loja/Itens"],["logica","⚙ Funções"],["seguranca","🔐 Segredos"]].map(([k,l])=>btn(l,()=>{SEM.cat=k;drawBody();},SEM.cat===k?"on":""))
    ),
    h("div",{cls:"q"},
      [["all","Qualquer tipo"],["number","Números"],["boolean","Sim/Não"],["string","Textos"],["function","Funções"]].map(([k,l])=>btn(l,()=>{SEM.type=k;drawBody();},SEM.type===k?"on":"")),
      btn(SEM.onlyEdit?"Só Editáveis: SIM":"Só Editáveis",()=>{SEM.onlyEdit=!SEM.onlyEdit;drawBody();},SEM.onlyEdit?"on":"")
    ),
    h("div",{cls:"q"},
      ["meu dinheiro","itens baratos","<= 100","vida ou energia","função comprar","atualizar tela"].map(ex=>btn(ex,()=>setQ(ex)))
    )
  ));
  B.appendChild(resBox);
  renderRes();
}},

scan:{n:"🎯 Cheat & Preços",live:true,render(B){
  const qi=h("input",{cls:"i",placeholder:"Seu valor atual (ex: 100 reais, 5 vidas...)",value:VS.q});qi.oninput=()=>{VS.q=qi.value;};
  const bal=getLiveBalance();
  B.appendChild(h("div",{cls:"c"},
    h("div",{cls:"row"},qi,btn("💾 Salvar & Monitorar",()=>vsFirst("eq"),"g")),
    h("div",{cls:"q"},
      btn("🔤 Texto contém",()=>vsFirst("has")),
      btn("🔢 Todos os números",()=>vsFirst("num")),
      btn(VS.watch?"⏱ Auto-Variação: ON":"⏱ Auto-Variação: OFF",()=>{VS.watch=!VS.watch;drawBody();},VS.watch?"on":""),
      btn("🛒 Escanear Preços",()=>{scanItemsAndPrices();drawBody();})
    ),
    h("div",{cls:"q"},btn("Profundidade: "+VS.deep,()=>{VS.deep=VS.deep>=12?3:VS.deep+3;draw();}),btn(VS.all?"window inteiro: SIM":"window inteiro: não",()=>{VS.all=!VS.all;draw();},VS.all?"on":"")),
    h("div",{cls:"mu mt"},"Coloque 100 (seu dinheiro no jogo) e toque em Salvar & Monitorar. Gaste algo na loja: o sistema detecta a variação sozinho e mostra os itens mais acessíveis abaixo!")
  ));

  if(bal!=null){
    const items=VS.items.length?VS.items:scanItemsAndPrices();
    const aff=items.filter(it=>it.price<=bal);
    B.appendChild(h("div",{cls:"c"},
      h("div",{cls:"row sp"},h("b",null,"🛒 Itens Acessíveis Agora ("+aff.length+"/"+items.length+")"),h("b",{cls:"ok mono"},"Saldo: "+bal)),
      !aff.length?h("div",{cls:"mu mt"},"Nenhum item encontrado abaixo de "+bal+"."):aff.slice(0,15).map(it=>
        h("div",{cls:"lg row sp",style:"background:#052e2233"},
          h("div",null,h("b",null,it.name),h("div",{cls:"mu"},it.cat+" · "+it.src)),
          h("div",{style:"text-align:right"},h("b",{cls:"ok mono"},String(it.price)),h("div",{cls:"mu mono"},"Sobra: "+Number((bal-it.price).toFixed(2))))
        )
      )
    ));
  }

  if(!VS.res.length&&!VS.run)return;
  B.appendChild(h("div",{cls:"c"},h("div",{cls:"mu"},VS.run?"⏳ "+VS.info:VS.res.length+" variável(is) — filtros manuais:"),
    h("div",{cls:"q"},btn("= valor",()=>{vsNext("eq");drawBody();},"g"),btn("contém",()=>{vsNext("has");drawBody();}),btn("↻ Mudou",()=>{vsNext("ch");drawBody();}),btn("＝ Igual",()=>{vsNext("un");drawBody();}),btn("↑ Subiu",()=>{vsNext("up");drawBody();}),btn("↓ Desceu",()=>{vsNext("dn");drawBody();}),btn("✖ Limpar",()=>{VS.res=[];VS.tracked="";drawBody();},"r"))));
  if(VS.res.length&&VS.res.length<=500){const bi=h("input",{cls:"i",placeholder:"novo valor para TODOS",value:VS.bulk});bi.oninput=()=>{VS.bulk=bi.value;};
    B.appendChild(h("div",{cls:"c"},h("div",{cls:"row"},bi,btn("Aplicar em "+VS.res.length,()=>{let ok=0;const nv=parse(VS.bulk);let last=null;VS.res.forEach(r=>{try{const ov=r.v;S.fw=true;assign(r.k,nv);r.v=nv;ok++;last={path:pstr(r.k),key:r.k[r.k.length-1],oldVal:ov,newVal:nv};}catch(e){}finally{S.fw=false;}});if(last)S.lastEdit=last;const rf=refreshPageUI(last||{manual:true});scanItemsAndPrices();updateHud();msg("✔ "+ok+"/"+VS.res.length+" alterados · "+rf.summary);drawBody();},"g")),
      h("div",{cls:"q"},btn("❄ Congelar todos neste valor",()=>{VS.res.forEach(r=>S.frozen.set(pstr(r.k),parse(VS.bulk)));msg(S.frozen.size+" congelado(s)");drawBody();}))))}
  VS.res.slice(0,VS.page).forEach(r=>{let c;try{c=resolve(r.k);}catch(e){c="[erro]";}const ps=pstr(r.k),pk=r.k.slice(0,-1);
    const diff=typeof c==="number"&&typeof r.init==="number"?Number((c-r.init).toFixed(2)):null;
    const isTr=VS.tracked===ps;
    B.appendChild(h("div",{cls:"c"+(isTr?" hi":"")},
      h("div",{cls:"row sp"},h("div",{cls:"row"},h("span",{cls:"k mono"},ps),tag(c)),
        h("div",{cls:"row"},btn(isTr?"Saldo Principal":"Usar como Saldo",()=>{VS.tracked=ps;drawBody();},isTr?"g":""),pk.length?btn("Pai ›",()=>{S.root=pstr(pk);S.path=[];S.tab="obj";draw();}):null)),
      h("div",{cls:"mu mono mt"},"Inicial: "+show(r.init)+" · Atual: "+show(c)+(diff!==null?" · Variação: "+(diff>0?"+"+diff:diff):"")+(r.chg?" ("+r.chg+"x)":"")),
      (c!==null&&typeof c==="object")?h("div",{cls:"mu"},"(agora é objeto)"):valueEditor(ps,c,()=>drawBody())));});
  if(VS.res.length>VS.page)B.appendChild(btn("Mostrar mais 100 (de "+VS.res.length+")",()=>{VS.page+=100;drawBody();}));
}},

bp:{n:"🛑 Breakpoints",live:true,render(B){
  const pInp=h("input",{cls:"i",placeholder:"Caminho JS (ex: window.player.money)"});
  const rInp=h("input",{cls:"i",placeholder:"URL ou palavra para bloquear/modificar rede"});
  const rMock=h("input",{cls:"i",placeholder:'JSON falso opcional (se usar Patch): {"ok":true}'});
  B.appendChild(h("div",{cls:"c"},
    h("b",null,"Watchpoints JS & Regras de Rede"),
    h("div",{cls:"mu mt"},"Intercepte mudanças em tempo real, bloqueie gastos (dinheiro/vida não caem), multiplique ganhos ou bloqueie requisições."),
    h("div",{cls:"row mt"},pInp,btn("🛡 Bloquear Redução",()=>{if(pInp.value)toggleLock(pInp.value,"block_decrease");drawBody();},"am"),btn("👁 Rastrear",()=>{if(pInp.value)toggleLock(pInp.value,"log");drawBody();},"g")),
    h("div",{cls:"row mt"},rInp,btn("🚫 Bloquear URL",()=>{if(rInp.value){S.netRules.push({pattern:rInp.value,action:"block",active:true});drawBody();}},"r")),
    h("div",{cls:"row mt"},rMock,btn("✏ Patch JSON Rede",()=>{if(rInp.value&&rMock.value){S.netRules.push({pattern:rInp.value,action:"mock",payload:rMock.value,active:true});drawBody();}},"on"))
  ));
  if(S.locks.size){
    B.appendChild(h("b",{style:"display:block;margin:6px 0"},"Watchpoints Ativos ("+S.locks.size+")"));
    S.locks.forEach((L,path)=>B.appendChild(h("div",{cls:"c row sp"},
      h("div",null,h("div",{cls:"k mono"},path),h("div",{cls:"mu"},"Modo: "+L.mode+" · Disparos: "+L.hits+" · Valor: "+show(L.val))),
      h("div",{cls:"row"},btn(L.pause?"⏸ Debugger: ON":"⏸ Debugger: OFF",()=>{L.pause=!L.pause;drawBody();},L.pause?"am":""),btn("Remover",()=>{toggleLock(path,L.mode);drawBody();},"r"))
    )));
  }
  if(S.fnHooks.size){
    B.appendChild(h("b",{style:"display:block;margin:6px 0"},"Hooks em Funções ("+S.fnHooks.size+")"));
    S.fnHooks.forEach((hk,path)=>B.appendChild(h("div",{cls:"c row sp"},h("div",null,h("div",{cls:"k mono"},path+"()"),h("div",{cls:"mu"},"Modo: "+hk.mode)),btn("Remover",()=>{hookFunction(path,hk.mode);drawBody();},"r"))));
  }
  if(S.netRules.length){
    B.appendChild(h("b",{style:"display:block;margin:6px 0"},"Regras de Rede ("+S.netRules.length+")"));
    S.netRules.forEach((r,idx)=>B.appendChild(h("div",{cls:"c row sp"},h("span",{cls:"mono"},r.action.toUpperCase()+" *"+r.pattern+"*"),btn("Remover",()=>{S.netRules.splice(idx,1);drawBody();},"r"))));
  }
  B.appendChild(h("div",{cls:"row sp mt",style:"margin-bottom:4px"},h("b",null,"Disparos Capturados ("+S.bpHits.length+")"),S.bpHits.length?btn("Limpar",()=>{S.bpHits=[];drawBody();}):null));
  S.bpHits.slice(0,80).forEach(hit=>B.appendChild(h("div",{cls:"lg warn"},hit.t+" · "+hit.target+" ("+hit.mode+")\n"+hit.msg)));
}},

vars:{n:"Variáveis",search:true,live:true,render(B){
  const f=S.vf||"all";
  B.appendChild(h("div",{cls:"row",style:"margin-bottom:6px"},["all:Todas","number:123","boolean:Bool","string:Texto","object:Objetos","function:Funções"].map(x=>{const[k,l]=x.split(":");return btn(l,()=>{S.vf=k;draw();},f===k?"on":"");})));
  const all=siteGlobals().map(([k,v])=>({k,v,lex:false})).concat(lexList().map(([k,v])=>({k,v,lex:true})));
  const list=all.filter(e=>(f==="all"||typeof e.v===f)&&(e.k.toLowerCase().includes(S.q)||(typeof e.v!=="object"&&typeof e.v!=="function"&&String(e.v).toLowerCase().includes(S.q))));
  list.sort((a,b)=>{const p=x=>({number:0,boolean:1,string:2,object:3,function:4}[typeof x.v]??5);return p(a)-p(b)||a.k.localeCompare(b.k);});
  B.appendChild(h("div",{cls:"mu",style:"margin-bottom:6px"},list.length+" variáveis ("+all.filter(e=>e.lex).length+" let/const) · tudo editável ao vivo"+(S.lexCsp?" · ⚠ CSP bloqueia eval":"")));
  list.slice(0,250).forEach(({k,v,lex})=>{const keys=lex?["@lex:"+k]:["window",k];const ps=pstr(keys);
    const prim=v===null||["number","string","boolean","undefined","bigint"].includes(typeof v);
    const hm=classifyHuman(ps,v);
    B.appendChild(h("div",{cls:"c"},h("div",{cls:"row sp"},h("div",{cls:"row"},h("span",{cls:"k"},k),tag(v),lex?h("span",{cls:"t tf"},"let/const"):null),
      prim?null:btn("Abrir ›",()=>{S.root=ps;S.path=[];S.tab="obj";draw();})),
      h("div",{cls:"mu"},hm.title),
      prim?valueEditor(ps,v,()=>drawBody()):h("div",null,h("div",{cls:"mu mono mt"},typeof v==="function"?"ƒ "+(v.name||k)+"("+v.length+" args)":show(v).slice(0,160)),typeof v==="function"?fnDet(ps,v):null)));});
}},

obj:{n:"Objetos",search:true,live:true,render(B){
  const full=[...splitPath(S.root),...S.path];const o=resolve(full);const ps=pstr(full);
  const inp=h("input",{cls:"i",value:ps});
  B.appendChild(h("div",{cls:"row",style:"margin-bottom:6px"},inp,btn("Ir",()=>{S.root=inp.value;S.path=[];draw();},"g"),S.path.length?btn("↑",()=>{S.path.pop();draw();}):null,btn("Copiar JSON",()=>copy(show(o)))));
  if(o==null||(typeof o!=="object"&&typeof o!=="function")){B.appendChild(h("div",{cls:"c"},tag(o),valueEditor(ps,o,()=>drawBody())));return;}
  if(typeof o==="function")B.appendChild(h("div",{cls:"c"},fnDet(ps,o)));
  else B.appendChild(h("details",{cls:"c"},h("summary",null,h("b",null,"✏ Editar como JSON · + propriedade")),jsonEd(o,full)));
  let keys=[];try{keys=[...new Set([...Object.getOwnPropertyNames(o),...Object.keys(Object.getPrototypeOf(o)||{})])];}catch(e){}
  keys=keys.filter(k=>k.toLowerCase().includes(S.q));
  B.appendChild(h("div",{cls:"mu",style:"margin-bottom:6px"},keys.length+" propriedades"));
  keys.slice(0,250).forEach(k=>{let v;try{v=o[k];}catch(e){v="[restrito]";}const prim=v===null||!["object","function"].includes(typeof v);const kp=pstr([...full,k]);
    B.appendChild(h("div",{cls:"c"},h("div",{cls:"row sp"},h("div",{cls:"row"},h("span",{cls:"k"},k),tag(v)),h("div",{cls:"row"},prim?null:btn("Abrir ›",()=>{S.path.push(k);draw();}),btn("🗑",()=>{try{delete o[k];drawBody();}catch(e){msg("✖ "+e.message);}},"r"))),
      prim?valueEditor(kp,v,()=>drawBody()):h("div",null,h("div",{cls:"mu mono mt"},typeof v==="function"?"ƒ "+(v.name||k)+"("+v.length+" args)":show(v).slice(0,140)),typeof v==="function"?fnDet(kp,v):null)));});
}},

store:{n:"Storage",search:true,render(B){
  const sec=(name,store)=>{let keys=[];try{keys=Object.keys(store);}catch(e){B.appendChild(h("div",{cls:"bad"},name+": bloqueado"));return;}
    B.appendChild(h("div",{cls:"row sp mt",style:"margin-bottom:6px"},h("b",null,name+" ("+keys.length+")"),h("div",{cls:"row"},
      btn("+ Novo",()=>{const k=prompt("Chave:");if(k){writeStorageAndSync(store,k,prompt("Valor:")||"");drawBody();}}),btn("Exportar",()=>copy(JSON.stringify(Object.fromEntries(keys.map(k=>[k,store.getItem(k)])),null,2))),btn("Limpar",()=>{if(confirm("Limpar "+name+"?")){store.clear();draw();}},"r"))));
    keys.filter(k=>k.toLowerCase().includes(S.q)).forEach(k=>{const v=store.getItem(k);const ta=h("textarea",{rows:Math.min(6,Math.ceil(v.length/60)+1)});ta.value=prettyMaybe(v);
      B.appendChild(h("div",{cls:"c"},h("div",{cls:"row sp"},h("span",{cls:"k"},k),h("span",{cls:"mu"},v.length+" chars")),h("div",{cls:"mt"},ta),
        h("div",{cls:"q"},btn("Salvar",()=>{writeStorageAndSync(store,k,minMaybe(ta.value));msg("✔ Salvo e sincronizado ao vivo: "+k);drawBody();},"g"),btn("Copiar",()=>copy(v)),btn("Apagar",()=>{store.removeItem(k);draw();},"r"))));});};
  sec("localStorage",W.localStorage);sec("sessionStorage",W.sessionStorage);
  const ck=D.cookie?D.cookie.split(/;\s*/).map(c=>{const i=c.indexOf("=");return[decodeURIComponent(c.slice(0,i)),c.slice(i+1)];}):[];
  B.appendChild(h("div",{cls:"row sp mt",style:"margin-bottom:6px"},h("b",null,"Cookies ("+ck.length+") — só não-HttpOnly"),btn("+ Novo",()=>{const k=prompt("Nome:");if(k){D.cookie=encodeURIComponent(k)+"="+(prompt("Valor:")||"")+";path=/";draw();}})));
  ck.filter(([k])=>k.toLowerCase().includes(S.q)).forEach(([k,v])=>{const inp=h("input",{cls:"i",value:v});
    B.appendChild(h("div",{cls:"c"},h("span",{cls:"k"},k),h("div",{cls:"row mt"},inp,btn("Salvar",()=>{D.cookie=encodeURIComponent(k)+"="+inp.value+";path=/";nudgeFrameworks();msg("✔ Cookie salvo");drawBody();},"g"),btn("Apagar",()=>{D.cookie=encodeURIComponent(k)+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";draw();},"r"))));});
  if(W.indexedDB&&indexedDB.databases)indexedDB.databases().then(dbs=>{B.appendChild(h("b",{style:"display:block;margin:8px 0 4px"},"IndexedDB ("+dbs.length+") — toque para abrir/editar"));
    dbs.forEach(d=>B.appendChild(h("details",{cls:"c",ontoggle:async ev=>{const el=ev.target;if(!el.open||el.__f)return;el.__f=1;
      try{const dump=await idbDump(d.name);dump.forEach(st=>{el.appendChild(h("div",{cls:"mu mt"},"📁 "+st.store+" ("+st.recs.length+")"));
        st.recs.slice(0,200).forEach(r=>{const ta=h("textarea",{rows:3});try{ta.value=JSON.stringify(r.v,null,1);}catch(x){ta.value=String(r.v);}
          el.appendChild(h("div",{cls:"c"},h("span",{cls:"k"},JSON.stringify(r.k)),h("div",{cls:"mt"},ta),h("div",{cls:"q"},btn("Salvar",async()=>{try{await idbPut(d.name,st.store,r.k,JSON.parse(ta.value));msg("✔ salvo");}catch(x){msg("✖ "+x.message);}},"g"),btn("Copiar",()=>copy(ta.value)))));});});}
      catch(x){el.appendChild(h("div",{cls:"bad"},"✖ "+x.message));}}},h("summary",null,h("span",{cls:"mono"},d.name+"  v"+d.version)))));}).catch(()=>{});
}},

net:{n:"Rede",search:true,live:true,render(B){
  B.appendChild(h("div",{cls:"row sp",style:"margin-bottom:6px"},h("span",{cls:"mu"},S.net.length+" requisições capturadas"),btn("Limpar",()=>{S.net.length=0;draw();},"r")));
  S.net.filter(n=>(n.url+n.method+n.status).toLowerCase().includes(S.q)).slice(0,150).forEach(n=>{const okc=n.status==="…"?"warn":(n.status>=200&&n.status<400)?"ok":"bad";
    B.appendChild(h("details",{cls:"c"},h("summary",null,h("div",{cls:"row sp"},h("div",{cls:"row"},h("b",{cls:okc},String(n.status)),h("span",{cls:"t tf"},n.method),h("span",{cls:"t tf"},n.type)),h("span",{cls:"mu"},n.ms+"ms · "+(n.size?fmtB(n.size):"")+" · "+n.time)),h("div",{cls:"mono mu mt"},n.url)),
      n.reqBody?h("div",{cls:"mt"},h("b",null,"Enviado:"),h("div",{cls:"mono"},prettyMaybe(n.reqBody))):null,
      h("div",{cls:"mt"},h("b",null,"Resposta:"),h("div",{cls:"mono",style:"max-height:240px;overflow:auto"},prettyMaybe(n.resBody||"(vazio)"))),
      reqEd(n),h("div",{cls:"q"},btn("🚫 Bloquear Endpoint",()=>{S.netRules.push({pattern:n.url.split("?")[0].slice(-30),action:"block",active:true});S.tab="bp";draw();},"r"),btn("Copiar URL",()=>copy(n.url)),btn("Copiar resposta",()=>copy(n.resBody||"")),btn("Copiar fetch()",()=>copy(`fetch(${JSON.stringify(n.url)},{method:${JSON.stringify(n.method)}${n.reqBody?",body:"+JSON.stringify(n.reqBody):""}}).then(r=>r.text()).then(console.log)`)),btn("Repetir",()=>{W.fetch(n.url,{method:n.method,body:n.reqBody||undefined,credentials:"include"}).then(()=>draw());}))));});
  const res=allRes().filter(r=>(r.name+r.initiatorType).toLowerCase().includes(S.q));
  B.appendChild(h("div",{cls:"row sp mt"},h("b",null,"Tudo que o site já carregou ("+res.length+")"),btn("🔎 Ler tudo + caçar segredos",()=>{S.tab="src";draw();},"g")));
  res.slice().reverse().slice(0,600).forEach(r=>B.appendChild(h("div",{cls:"c"},h("div",{cls:"row sp"},h("span",{cls:"t tf"},r.initiatorType),h("span",{cls:"mu"},Math.round(r.duration)+"ms"+(r.transferSize?" · "+fmtB(r.transferSize):""))),h("div",{cls:"mono mu mt"},r.name),h("div",{cls:"q"},btn("Ver conteúdo",()=>openSrc(r.name)),btn("Copiar URL",()=>copy(r.name))))));
}},

src:{n:"Fontes/Caçar",search:true,render(B){
  if(!SRC.ran&&!SRC.run)scanAll();
  if(SRC.view){viewer(B);if(SRC.view)return;}
  B.appendChild(h("div",{cls:"row sp",style:"margin-bottom:6px"},h("span",{cls:"mu"},SRC.run?"⏳ lendo "+SRC.done+"/"+SRC.total+"…":SRC.items.size+" fontes · "+SRC.finds.length+" achados"),
    h("div",{cls:"row"},btn("🔄 Reescanear",()=>{SRC.seen.clear();SRC.items.clear();SRC.ran=false;SRC.finds=[];scanAll();draw();}),btn("Copiar achados",()=>copy(SRC.finds.filter(f=>f.pri).map(f=>"["+f.cat+"] "+f.m+(f.dec?"  →  "+f.dec:"")+"   ("+f.src+")").join("\n"))))));
  if(S.qraw){const r=searchSrc(S.qraw);
    if(!r){B.appendChild(h("div",{cls:"bad"},"Regex inválida"));return;}
    B.appendChild(h("div",{cls:"mu",style:"margin-bottom:6px"},r.length+" resultado(s) para “"+S.qraw+"”"));
    r.forEach(x=>B.appendChild(h("div",{cls:"c"},h("div",{cls:"mono mu"},x.it.label),h("div",{cls:"lg"},x.a,h("b",{style:"color:#f0883e"},x.m),x.b),h("div",{cls:"q"},btn("Ver na fonte",()=>openSrc(x.it.url,x.m)),btn("Copiar",()=>copy(x.a+x.m+x.b))))));
    return;}
  const cats={};SRC.finds.forEach(f=>{(cats[f.cat]=cats[f.cat]||{n:0,pri:f.pri}).n++;});
  const chips=h("div",{cls:"q",style:"margin-bottom:8px"},btn("⭐ Destaques",()=>{SRC.cat="";draw();},SRC.cat===""?"on":""),btn("Todos",()=>{SRC.cat="*";draw();},SRC.cat==="*"?"on":""));
  Object.keys(cats).forEach(k=>chips.appendChild(btn(k+" "+cats[k].n,()=>{SRC.cat=k;draw();},SRC.cat===k?"on":"")));B.appendChild(chips);
  const shown=SRC.finds.filter(f=>SRC.cat==="*"||(SRC.cat===""?f.pri===1:f.cat===SRC.cat));
  if(!shown.length&&!SRC.run)B.appendChild(h("div",{cls:"mu"},"Nada nessa categoria."));
  shown.slice(0,300).forEach(f=>B.appendChild(h("div",{cls:"c"},h("div",{cls:"row sp"},h("span",{cls:"t to"},f.cat),h("span",{cls:"mu mono",style:"max-width:55%;text-align:right"},f.src.slice(0,70))),
    h("div",{cls:"mono k mt"},f.m),f.dec?h("div",{cls:"mono ok mt"},"decodificado: "+f.dec):null,h("div",{cls:"mono mu mt"},"…"+f.ctx+"…"),
    h("div",{cls:"q"},btn("Ver na fonte",()=>openSrc(f.url,f.m)),btn("Copiar",()=>copy(f.dec||f.m)),/Endpoint/.test(f.cat)?btn("Buscar e ler",()=>{let u;try{u=new URL(f.m,location.href).href;}catch(e){return;}openSrc(u).then(()=>{SRC.finds=findAll();});},"g"):null))));
  if(shown.length>300)B.appendChild(h("div",{cls:"mu"},"Mostrando 300 de "+shown.length+" — use a busca ou os filtros."));
  const det=h("details",{cls:"c mt"},h("summary",null,h("b",null,"Fontes lidas ("+SRC.items.size+") ›")));
  [...SRC.items.values()].forEach(it=>det.appendChild(h("div",{cls:"lg"},h("div",{cls:"mono"},it.label),h("div",{cls:"mu"},(it.err?"ERRO "+it.err:it.bin?"binário":fmtB(it.text.length))+(it.status?" · HTTP "+it.status:"")),h("div",{cls:"q"},btn("Ver",()=>openSrc(it.url)),btn("Copiar",()=>copy(it.text))))));
  B.appendChild(det);
}},

con:{n:"Console",live:true,render(B){
  const ta=h("textarea",{rows:3,placeholder:"Digite JavaScript e toque Executar"});ta.value=S.code||"";ta.oninput=()=>S.code=ta.value;
  const run=()=>{const code=ta.value;S.logs.push({l:"cmd",t:"",m:"› "+code});
    let r;try{r=(0,eval)(code);}catch(e){
      try{const s=D.createElement("script");s.textContent="window.__bpR=(function(){return eval("+JSON.stringify(code)+")})()";D.documentElement.appendChild(s);s.remove();r=W.__bpR;}catch(e2){S.logs.push({l:"error",t:"",m:"✖ "+e.message+" (CSP)"});draw();return;}}
    Promise.resolve(r).then(v=>{S.logs.push({l:"res",t:"",m:"← "+fmt(v)});draw();},e=>{S.logs.push({l:"error",t:"",m:"✖ "+fmt(e)});draw();});};
  B.appendChild(h("div",null,ta,h("div",{cls:"q"},btn("▶ Executar",run,"g"),btn("Limpar log",()=>{S.logs.length=0;draw();},"r"),
    ["document.title","location.href","Object.keys(localStorage)","document.querySelectorAll('*').length"].map(s=>btn(s.length>18?s.slice(0,16)+"…":s,()=>{ta.value=s;S.code=s;run();})))));
  const box=h("div",{cls:"mt"});S.logs.slice(-300).forEach(x=>box.appendChild(h("div",{cls:"lg "+x.l},(x.t?x.t+" ":"")+(["warn","error"].includes(x.l)?x.l.toUpperCase()+" ":"")+x.m)));B.appendChild(box);
}},

el:{n:"Elementos",render(B){
  B.appendChild(h("div",{cls:"q",style:"margin-bottom:6px"},btn("🎯 Selecionar na página",pick,"g"),btn("✏ Editar textos da página",()=>{D.body.contentEditable=D.body.contentEditable==="true"?"false":"true";msg("Modo edição: "+D.body.contentEditable);}),btn("🔲 Contornos",()=>{const id="__bp_ol";const x=D.getElementById(id);if(x)x.remove();else{const s=D.createElement("style");s.id=id;s.textContent="*{outline:1px solid #f0f3 !important}";D.head.appendChild(s);}}),btn("🖼 Imagens",()=>{S.tab="media";draw();})));
  const el=S.sel;if(!el){B.appendChild(h("div",{cls:"mu"},"Toque em “Selecionar” e depois em qualquer coisa da página."));return;}
  const cs=getComputedStyle(el),r=el.getBoundingClientRect();
  B.appendChild(h("div",{cls:"c"},h("div",{cls:"k mono"},sel(el)),h("div",{cls:"grid mt mu"},
    "Tamanho",Math.round(r.width)+" × "+Math.round(r.height),"Posição",Math.round(r.left)+", "+Math.round(r.top),"Cor",cs.color,"Fundo",cs.backgroundColor,"Fonte",cs.fontSize+" "+cs.fontFamily.split(",")[0],"Display",cs.display,"Filhos",el.children.length),
    h("div",{cls:"q"},btn("↑ Pai",()=>{if(el.parentElement){S.sel=el.parentElement;draw();}}),btn("Esconder",()=>{el.style.display=el.style.display==="none"?"":"none";}),btn("Remover",()=>{el.remove();S.sel=null;draw();},"r"),btn("Copiar seletor",()=>copy(sel(el))),btn("Copiar HTML",()=>copy(el.outerHTML)),btn("Rolar até",()=>el.scrollIntoView({behavior:"smooth",block:"center"})))));
  const attrs=h("div",{cls:"c"},h("b",null,"Atributos"));[...el.attributes].forEach(a=>{const i=h("input",{cls:"i",value:a.value});attrs.appendChild(h("div",{cls:"row mt"},h("span",{cls:"k",style:"min-width:70px"},a.name),i,btn("✔",()=>{el.setAttribute(a.name,i.value);msg("Atributo salvo");},"g")));});
  if("value"in el){const i=h("input",{cls:"i",value:el.value});attrs.appendChild(h("div",{cls:"row mt"},h("span",{cls:"k",style:"min-width:70px"},"value"),i,btn("✔",()=>{const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;const d=Object.getOwnPropertyDescriptor(proto,"value");if(d&&d.set)d.set.call(el,i.value);else el.value=i.value;el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));msg("✔ Input atualizado ao vivo");},"g")));}
  if(el.disabled!==undefined)attrs.appendChild(h("div",{cls:"q"},btn(el.disabled?"Habilitar":"Desabilitar",()=>{el.disabled=!el.disabled;el.removeAttribute("disabled");draw();})));
  B.appendChild(attrs);
  const ta=h("textarea",{rows:4});ta.value=el.textContent.slice(0,2000);
  B.appendChild(h("div",{cls:"c"},h("b",null,"Texto"),h("div",{cls:"mt"},ta),h("div",{cls:"q"},btn("Aplicar texto",()=>{el.textContent=ta.value;},"g"))));
  const sty=h("input",{cls:"i",value:el.getAttribute("style")||"",placeholder:"color:red; font-size:20px"});
  B.appendChild(h("div",{cls:"c"},h("b",null,"Estilo inline"),h("div",{cls:"row mt"},sty,btn("Aplicar",()=>el.setAttribute("style",sty.value),"g"))));
}},

media:{n:"Mídia/Links",search:true,render(B){
  const imgs=[...new Set([...D.images].map(i=>i.currentSrc||i.src).filter(Boolean))].filter(u=>u.toLowerCase().includes(S.q));
  const vids=[...D.querySelectorAll("video,audio,source")].map(v=>v.currentSrc||v.src).filter(Boolean);
  const links=[...new Set([...D.links].map(a=>a.href))].filter(u=>u.toLowerCase().includes(S.q));
  B.appendChild(h("b",null,"Imagens ("+imgs.length+")"));
  B.appendChild(h("div",{style:"display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:6px;margin:6px 0"},imgs.slice(0,120).map(u=>h("a",{href:u,target:"_blank",style:"display:block;aspect-ratio:1;background:#05070b;border:1px solid #263244;border-radius:6px;overflow:hidden"},h("img",{src:u,style:"width:100%;height:100%;object-fit:contain"})))));
  if(vids.length){B.appendChild(h("b",null,"Vídeo/Áudio ("+vids.length+")"));vids.forEach(u=>B.appendChild(h("div",{cls:"c row sp"},h("span",{cls:"mono mu",style:"flex:1"},u),btn("Copiar",()=>copy(u)))));}
  B.appendChild(h("div",{cls:"row sp mt"},h("b",null,"Links ("+links.length+")"),btn("Copiar todos",()=>copy(links.join("\n")))));
  links.slice(0,200).forEach(u=>B.appendChild(h("div",{cls:"lg"},u)));
  const forms=[...D.forms];if(forms.length){B.appendChild(h("b",{style:"display:block;margin-top:8px"},"Formulários ("+forms.length+")"));forms.forEach(f=>B.appendChild(h("div",{cls:"c mono mu"},(f.method||"get").toUpperCase()+" "+(f.action||location.href)+"\n"+[...f.elements].map(e=>(e.name||e.id||e.type)+" ["+e.type+"]"+(e.type==="hidden"?" = "+e.value:"")).join("\n"))));}
}},

info:{n:"Info",live:true,render(B){
  const n=performance.getEntriesByType("navigation")[0]||{};const mem=performance.memory;
  const grid=(t,rows)=>h("div",{cls:"c"},h("b",null,t),h("div",{cls:"grid mt"},rows.flatMap(([a,b])=>[h("span",{cls:"mu"},a),h("span",{cls:"mono"},String(b))])));
  B.appendChild(grid("Página",[["Título",D.title],["URL",location.href],["Domínio",location.host],["Idioma",D.documentElement.lang||"-"],["Elementos",D.querySelectorAll("*").length],["Scripts",D.scripts.length],["Frameworks",detect().join(", ")||"nenhum detectado"]]));
  B.appendChild(grid("Desempenho",[["Carregou em",n.loadEventEnd?Math.round(n.loadEventEnd)+" ms":"-"],["DOM pronto",n.domContentLoadedEventEnd?Math.round(n.domContentLoadedEventEnd)+" ms":"-"],["Memória JS",mem?fmtB(mem.usedJSHeapSize)+" / "+fmtB(mem.jsHeapSizeLimit):"-"]]));
  B.appendChild(grid("Dispositivo",[["Tela",screen.width+"×"+screen.height+" @"+devicePixelRatio+"x"],["Janela",innerWidth+"×"+innerHeight],["Toque",navigator.maxTouchPoints>0?"sim":"não"],["CPU",navigator.hardwareConcurrency||"-"],["Navegador",navigator.userAgent]]));
  B.appendChild(h("div",{cls:"q"},btn("Copiar relatório",()=>copy(B.innerText)),btn("Modo escuro na página",()=>{const id="__bp_dk";const x=D.getElementById(id);if(x)x.remove();else{const s=D.createElement("style");s.id=id;s.textContent="html{filter:invert(1) hue-rotate(180deg)}img,video,picture{filter:invert(1) hue-rotate(180deg)}";D.head.appendChild(s);}})));
}}
};

function detect(){const f=[];const t=(c,n)=>{try{if(c())f.push(n);}catch(e){}};
  t(()=>W.React||D.querySelector("[data-reactroot]")||[...D.querySelectorAll("body *")].slice(0,50).some(e=>Object.keys(e).some(k=>k.startsWith("__react"))),"React");
  t(()=>W.Vue||W.__VUE__||D.querySelector("[data-v-app]"),"Vue");t(()=>W.ng||D.querySelector("[ng-version]"),"Angular");t(()=>W.__NEXT_DATA__,"Next.js");t(()=>W.__NUXT__,"Nuxt");
  t(()=>W.jQuery,"jQuery "+(W.jQuery&&W.jQuery.fn.jquery||""));t(()=>W.Svelte||D.querySelector("[class*=svelte-]"),"Svelte");t(()=>W.wp||D.querySelector("link[href*=wp-content]"),"WordPress");t(()=>W.Shopify,"Shopify");t(()=>W.Phaser,"Phaser");t(()=>W.PIXI,"PixiJS");t(()=>W.THREE,"Three.js");t(()=>W.unityInstance||W.UnityLoader||W.createUnityInstance,"Unity WebGL");return f;}
function fmtB(b){b=+b;return b>1048576?(b/1048576).toFixed(1)+"MB":b>1024?(b/1024).toFixed(1)+"KB":b+"B";}
function prettyMaybe(s){try{const j=JSON.parse(s);if(typeof j==="object"&&j)return JSON.stringify(j,null,2);}catch(e){}return s;}
function minMaybe(s){try{return JSON.stringify(JSON.parse(s));}catch(e){return s;}}
function sel(el){if(el.id)return "#"+CSS.escape(el.id);const p=[];while(el&&el.nodeType===1&&p.length<5){let s=el.nodeName.toLowerCase();if(el.id){p.unshift("#"+CSS.escape(el.id));break;}const cl=[...el.classList].slice(0,2).map(c=>"."+CSS.escape(c)).join("");s+=cl;const par=el.parentElement;if(par){const sib=[...par.children].filter(c=>c.nodeName===el.nodeName);if(sib.length>1)s+=":nth-of-type("+(sib.indexOf(el)+1)+")";}p.unshift(s);el=par;}return p.join(" > ");}

function pick(){P.style.display="none";const box=D.createElement("div");box.style.cssText="position:fixed;pointer-events:none;z-index:2147483646;border:2px solid #38bdf8;background:#38bdf822;transition:all .05s";D.documentElement.appendChild(box);
  const tip=D.createElement("div");tip.style.cssText="position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#0b0f17;color:#e6edf3;padding:8px 14px;border-radius:20px;font:13px sans-serif;border:1px solid #38bdf8";tip.textContent="Toque/clique no elemento (Esc cancela)";D.documentElement.appendChild(tip);
  const at=(x,y)=>{const e=D.elementFromPoint(x,y);if(e&&e!==host){const r=e.getBoundingClientRect();Object.assign(box.style,{left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px"});}return e;};
  const mv=e=>{const p=e.touches?e.touches[0]:e;at(p.clientX,p.clientY);};
  const end=e=>{e.preventDefault();e.stopPropagation();const p=e.changedTouches?e.changedTouches[0]:e;const el=at(p.clientX,p.clientY);done();if(el){S.sel=el;S.tab="el";draw();}};
  const key=e=>{if(e.key==="Escape")done();};
  const done=()=>{box.remove();tip.remove();D.removeEventListener("mousemove",mv,true);D.removeEventListener("touchmove",mv,true);D.removeEventListener("click",end,true);D.removeEventListener("touchend",end,true);D.removeEventListener("keydown",key,true);P.style.display="";};
  setTimeout(()=>{D.addEventListener("mousemove",mv,true);D.addEventListener("touchmove",mv,{capture:true,passive:true});D.addEventListener("click",end,true);D.addEventListener("touchend",end,{capture:true,passive:false});D.addEventListener("keydown",key,true);},50);}

let body,qInp,sub,nav;
function shell(){P.textContent="";
  const hd=h("div",{cls:"hdr"},h("b",null,"⚡ breakpoint-search"),h("div",{cls:"row"},btn("Mini HUD",()=>{P.classList.add("hudon");updateHud();HUD.style.display="flex";}),btn("_",()=>P.classList.toggle("min")),btn("⤢",()=>P.classList.toggle("m")),btn("✕",close,"r")));
  if(mobile)hd.prepend(h("div",{style:"position:absolute;left:0;right:0;top:3px"},h("div",{cls:"grip"})));hd.style.position="relative";
  nav=h("div",{cls:"nav"});Object.entries(TABS).forEach(([k,t])=>nav.appendChild(h("button",{cls:"nb"+(S.tab===k?" a":""),"data-t":k,onclick:()=>{S.tab=k;S.q="";S.qraw="";qInp.value="";draw();}},t.n)));
  qInp=h("input",{cls:"i",placeholder:"🔍 Filtrar...",oninput:e=>{S.qraw=e.target.value;S.q=S.qraw.toLowerCase();clearTimeout(S.qt);S.qt=setTimeout(drawBody,150);}});
  sub=h("div",{cls:"sub"},qInp);body=h("div",{cls:"body"});
  msgEl=h("span",null,"Pronto. Sem precisar saber programar.");
  const auto=btn(S.auto?"⏸ Auto":"▶ Auto",()=>{S.auto=!S.auto;auto.textContent=S.auto?"⏸ Auto":"▶ Auto";},S.auto?"on":"");
  P.append(hd,nav,sub,body,h("div",{cls:"ft"},msgEl,h("div",{cls:"row"},btn("🔄 Atualizar Tela",()=>{const le=S.lastEdit?{...S.lastEdit}:null;if(le&&le.path){try{le.newVal=resolve(splitPath(le.path));}catch(e){}}const r=refreshPageUI({...(le||{}),manual:true});drawBody();msg(r.summary);},"g"),auto,btn("↻ Painel",drawBody),btn("🔥 "+S.frozen.size,()=>{S.frozen.clear();msg("Tudo descongelado");drawBody();}))));
  drag(hd);}
function drawBody(){if(!body)return;const sc=body.scrollTop;body.textContent="";const t=TABS[S.tab];sub.style.display=t.search?"flex":"none";
  try{t.render(body);}catch(e){body.appendChild(h("div",{cls:"bad"},"Erro: "+e.message));}body.scrollTop=sc;}
function draw(){[...nav.children].forEach(b=>b.classList.toggle("a",b.dataset.t===S.tab));const nb=nav.querySelector('[data-t="net"]');if(nb)nb.textContent="Rede ("+S.net.length+")";drawBody();}
function close(){host.remove();window.__bpT.forEach(clearInterval);window.__bpT=[];}

function drag(hd){let sx,sy,ox,oy,on=false;
  const down=e=>{if(e.target.closest("button"))return;const p=e.touches?e.touches[0]:e;on=true;sx=p.clientX;sy=p.clientY;const r=P.getBoundingClientRect();ox=r.left;oy=r.top;};
  const move=e=>{if(!on)return;const p=e.touches?e.touches[0]:e;
    if(P.classList.contains("m")){const dy=p.clientY-sy;const nh=Math.max(140,Math.min(innerHeight-20,innerHeight-oy-dy));P.style.height=nh+"px";}
    else{P.style.left=Math.max(0,Math.min(innerWidth-80,ox+p.clientX-sx))+"px";P.style.top=Math.max(0,Math.min(innerHeight-40,oy+p.clientY-sy))+"px";P.style.right="auto";}
    if(e.cancelable)e.preventDefault();};
  const up=()=>on=false;
  hd.addEventListener("mousedown",down);hd.addEventListener("touchstart",down,{passive:true});
  W.addEventListener("mousemove",move);W.addEventListener("touchmove",move,{passive:false});W.addEventListener("mouseup",up);W.addEventListener("touchend",up);}

window.__bpT.push(setInterval(()=>{const t=TABS[S.tab];const nb=nav&&nav.querySelector('[data-t="net"]');if(nb)nb.textContent="Rede ("+S.net.length+")";
  const focused=R.activeElement&&/INPUT|TEXTAREA/.test(R.activeElement.tagName);if(focused)return;
  if(body&&body.querySelector("details[open]"))return;
  if((t&&t.live&&S.tab!=="con")||S.auto)drawBody();},1400));

window.__bpT.push(setInterval(()=>{if(!host.isConnected)(D.body||D.documentElement).appendChild(host);},2000));

quickLexScan();
shell();draw();
setTimeout(()=>{if(!SRC.ran&&!SRC.run)scanAll();},400);
})();