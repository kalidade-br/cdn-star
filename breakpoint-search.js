javascript:(()=>{
/* KALIDADE PRO v5 — painel de inspeção para qualquer site (desktop + celular) */
const ID="KALIDADE_PRO_V5";
const old=document.getElementById(ID);if(old){old.remove();(window.__klT||[]).forEach(clearInterval);window.__klT=[];return;}
window.__klT=[];
const W=window,D=document;
const S=window.__klS||(window.__klS={net:[],logs:[],frozen:new Map(),hooked:false});
S.tab=S.tab||"vars";S.q="";S.path=S.path||[];S.root=S.root||"window";

/* ---------- Hooks (rede + console), instalados uma só vez ---------- */
if(!S.hooked){S.hooked=true;
  const push=it=>{S.net.unshift(it);if(S.net.length>300)S.net.pop();};
  const of=W.fetch;S.of=of?of.bind(W):null;
  if(of)W.fetch=function(i,o){const t0=performance.now();
    const it={type:"fetch",method:(o&&o.method)||(i&&i.method)||"GET",url:typeof i==="string"?i:(i&&i.url)||String(i),status:"…",ms:0,size:"",time:new Date().toLocaleTimeString(),reqBody:o&&typeof o.body==="string"?o.body.slice(0,20000):"",resBody:""};
    push(it);
    return of.apply(this,arguments).then(r=>{it.status=r.status;it.ms=Math.round(performance.now()-t0);
      try{r.clone().text().then(t=>{it.size=t.length;it.resBody=t.slice(0,200000);}).catch(()=>{});}catch(e){}
      return r;},e=>{it.status="ERRO";it.ms=Math.round(performance.now()-t0);it.resBody=String(e);throw e;});
  };
  const XO=XMLHttpRequest.prototype.open,XS=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open=function(m,u){this.__kl={type:"xhr",method:m,url:String(u),status:"…",ms:0,size:"",time:"",reqBody:"",resBody:""};return XO.apply(this,arguments);};
  XMLHttpRequest.prototype.send=function(b){const it=this.__kl||{type:"xhr",method:"?",url:"?"};const t0=performance.now();
    it.time=new Date().toLocaleTimeString();it.reqBody=typeof b==="string"?b.slice(0,20000):"";push(it);
    this.addEventListener("loadend",()=>{it.status=this.status||"ERRO";it.ms=Math.round(performance.now()-t0);
      try{const t=(this.responseType===""||this.responseType==="text")?this.responseText:"["+this.responseType+"]";it.size=t.length;it.resBody=t.slice(0,200000);}catch(e){}});
    return XS.apply(this,arguments);};
  const WS=W.WebSocket;if(WS){W.WebSocket=function(u,pr){const w=pr?new WS(u,pr):new WS(u);const it={type:"ws",method:"WS",url:String(u),status:"aberto",ms:0,size:"",time:new Date().toLocaleTimeString(),reqBody:"",resBody:""};push(it);
    const os=w.send;w.send=function(d){it.reqBody=(it.reqBody+(typeof d==="string"?d:"[bin]")+"\n").slice(-100000);return os.apply(this,arguments);};
    w.addEventListener("message",e=>{it.resBody=(it.resBody+(typeof e.data==="string"?e.data:"[bin]")+"\n").slice(-100000);});return w;};
    W.WebSocket.prototype=WS.prototype;Object.assign(W.WebSocket,{CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3});}
  ["log","info","warn","error","debug"].forEach(l=>{const o=console[l];console[l]=function(...a){
    S.logs.push({l,t:new Date().toLocaleTimeString(),m:a.map(fmt).join(" ")});if(S.logs.length>500)S.logs.shift();return o.apply(this,a);};});
  W.addEventListener("error",e=>S.logs.push({l:"error",t:new Date().toLocaleTimeString(),m:(e.message||"Erro")+" @ "+(e.filename||"")+":"+(e.lineno||"")}));
  W.addEventListener("unhandledrejection",e=>S.logs.push({l:"error",t:new Date().toLocaleTimeString(),m:"Promise rejeitada: "+fmt(e.reason)}));
}
S.res=S.res||new Map();
if(!S.po){S.po=true;try{performance.setResourceTimingBufferSize&&performance.setResourceTimingBufferSize(10000);new PerformanceObserver(l=>l.getEntries().forEach(e=>S.res.set(e.name,e))).observe({type:"resource",buffered:true});}catch(e){}}
function fmt(v){try{if(typeof v==="string")return v;if(v instanceof Error)return v.name+": "+v.message;if(typeof v==="function")return "ƒ "+(v.name||"anon")+"()";if(v instanceof Node)return "<"+(v.nodeName||"").toLowerCase()+">";return JSON.stringify(v,(k,x)=>typeof x==="bigint"?x+"n":x,0)?.slice(0,2000)??String(v);}catch(e){return String(v);}}

/* ---------- Host com Shadow DOM: CSS do site não interfere ---------- */
const host=D.createElement("div");host.id=ID;
host.style.cssText="all:initial;position:fixed;z-index:2147483647;top:0;left:0;width:0;height:0";
(D.body||D.documentElement).appendChild(host);
const R=host.attachShadow?host.attachShadow({mode:"open"}):host;
const mobile=Math.min(innerWidth,screen.width)<700||matchMedia("(pointer:coarse)").matches;

const css=`
*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.p{position:fixed;top:16px;right:16px;width:540px;max-width:calc(100vw - 16px);height:82vh;background:#0d1117;color:#e6edf3;border:1px solid #30363d;border-radius:12px;display:flex;flex-direction:column;font-size:12px;line-height:1.4;box-shadow:0 12px 48px #000c;overflow:hidden}
.p.m{top:auto;bottom:0;left:0;right:0;width:100vw;max-width:100vw;height:72vh;border-radius:16px 16px 0 0;font-size:13px}
.p.min{height:auto!important}.p.min .nav,.p.min .sub,.p.min .body,.p.min .ft{display:none}
.hdr{background:#161b22;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;cursor:move;border-bottom:1px solid #30363d;user-select:none;touch-action:none}
.hdr b{color:#58a6ff;font-size:13px}.grip{width:40px;height:4px;background:#30363d;border-radius:2px;margin:0 auto 6px}
.nav{display:flex;background:#161b22;border-bottom:1px solid #30363d;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.nav::-webkit-scrollbar{display:none}
.nb{background:none;border:0;color:#8b949e;padding:10px 12px;font-weight:600;font-size:12px;border-bottom:2px solid transparent;white-space:nowrap;cursor:pointer}
.nb.a{color:#58a6ff;border-color:#58a6ff}
.sub{padding:8px;background:#161b22;border-bottom:1px solid #30363d;display:flex;gap:6px;flex-wrap:wrap}
.body{flex:1;overflow:auto;padding:8px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.ft{padding:6px 10px;background:#161b22;border-top:1px solid #30363d;color:#8b949e;display:flex;justify-content:space-between;gap:6px;align-items:center;font-size:11px}
.b{background:#21262d;color:#c9d1d9;border:1px solid #30363d;border-radius:6px;padding:5px 9px;font-size:11px;font-weight:500;cursor:pointer;white-space:nowrap}
.m .b{padding:8px 11px;font-size:12px}
.b:active,.b:hover{background:#30363d;color:#fff}.g{background:#238636;border-color:#2ea043;color:#fff}.r{background:#da3633;border-color:#f85149;color:#fff}.on{border-color:#58a6ff;color:#58a6ff}
.i,textarea{flex:1;min-width:0;width:100%;padding:7px 10px;background:#010409;color:#e6edf3;border:1px solid #30363d;border-radius:6px;font-size:12px;font-family:ui-monospace,Menlo,monospace}
.m .i,.m textarea{font-size:16px}
.i:focus,textarea:focus{border-color:#58a6ff;outline:none}
.c{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:8px 10px;margin-bottom:6px}
.row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.sp{justify-content:space-between}.mt{margin-top:6px}
.k{color:#79c0ff;font-weight:700;word-break:break-all}.mu{color:#8b949e;font-size:11px}.mono{font-family:ui-monospace,Menlo,monospace;word-break:break-all;white-space:pre-wrap}
.t{font-size:10px;padding:1px 6px;border-radius:10px;font-weight:700;border:1px solid}
.tn{color:#d2a8ff;border-color:#d2a8ff55}.ts{color:#a5d6ff;border-color:#a5d6ff55}.tb{color:#ffa657;border-color:#ffa65755}.to{color:#7ee787;border-color:#7ee78755}.tf{color:#8b949e;border-color:#30363d}
.ok{color:#3fb950}.bad{color:#f85149}.warn{color:#d29922}
.q{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}.q .b{padding:3px 7px;font-size:10px}.m .q .b{padding:6px 10px;font-size:12px}
.lg{padding:3px 6px;border-bottom:1px solid #21262d;font-family:ui-monospace,Menlo,monospace;font-size:11px;white-space:pre-wrap;word-break:break-all}
.lg.warn{background:#d2992211}.lg.error{background:#f8514911;color:#ffa198}
details summary{cursor:pointer;list-style:none}
.grid{display:grid;grid-template-columns:auto 1fr;gap:3px 10px}
.fab{position:fixed;right:14px;bottom:14px;width:52px;height:52px;border-radius:50%;background:#238636;color:#fff;border:0;font-size:22px;box-shadow:0 6px 20px #000a;cursor:pointer}
`;
R.innerHTML="";
const st=D.createElement("style");st.textContent=css;R.appendChild(st);
const P=D.createElement("div");P.className="p"+(mobile?" m":"");R.appendChild(P);

/* helpers DOM sem innerHTML (funciona com Trusted Types/CSP) */
function h(tag,attrs,...kids){const e=D.createElement(tag);if(attrs)for(const k in attrs){const v=attrs[k];if(v==null||v===false)continue;
  if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(k==="cls")e.className=v;else if(k==="style")e.style.cssText=v;else if(k==="value")e.value=v;else e.setAttribute(k,v===true?"":v);}
  kids.flat(9).forEach(c=>{if(c==null||c===false)return;e.appendChild(c instanceof Node?c:D.createTextNode(String(c)));});return e;}
const btn=(txt,fn,cls="")=>h("button",{cls:"b "+cls,onclick:fn},txt);
const tag=v=>{const t=v===null?"null":Array.isArray(v)?"array":typeof v;const c={number:"tn",bigint:"tn",string:"ts",boolean:"tb",object:"to",array:"to"}[t]||"tf";return h("span",{cls:"t "+c},t);};
let msgEl;const msg=t=>{if(msgEl)msgEl.textContent=t;};
const copy=t=>{try{navigator.clipboard.writeText(t).then(()=>msg("Copiado!"),()=>fallbackCopy(t));}catch(e){fallbackCopy(t);}};
function fallbackCopy(t){const a=D.createElement("textarea");a.value=t;R.appendChild(a);a.select();try{D.execCommand("copy");msg("Copiado!");}catch(e){msg("Falha ao copiar");}a.remove();}
function parse(s){s=String(s).trim();if(s==="")return "";if(s==="true")return true;if(s==="false")return false;if(s==="null")return null;if(s==="undefined")return undefined;
  if(/^-?\d+(\.\d+)?(e-?\d+)?$/i.test(s))return Number(s);if(/^[\[{"]/.test(s)){try{return JSON.parse(s);}catch(e){}}return s;}
const show=v=>{if(typeof v==="string")return v;try{return JSON.stringify(v)??String(v);}catch(e){return String(v);}};

/* caminho tipo window.a.b[0] -> objeto (sem eval, funciona com CSP) */
S.pk=S.pk||new Map();S.locks=S.locks||new Map();
const IDENT=/^[A-Za-z_$][\w$]*$/;
function lexTypeof(n){try{return (0,eval)("typeof "+n);}catch(e){return /EvalError|unsafe|Content Security/i.test(e&&(e.name+" "+e.message))?"!csp":"tdz";}}
function lexGet(n){return (0,eval)(n);}
function lexSet(n,v){W.__klV=v;try{(0,eval)(n+"=globalThis.__klV");}finally{delete W.__klV;}}
function isLex(k){return typeof k==="string"&&k.startsWith("@lex:");}
function LEXOK(k){if(!IDENT.test(k)||(k in W))return false;const t=lexTypeof(k);return t!=="undefined"&&t!=="!csp"&&t!=="tdz";}
/* caminho (array) -> texto legível, registrado p/ poder voltar a array */
function pstr(keys){keys=keys.slice();if(keys[0]==="window")keys.shift();const lx=isLex(keys[0]);
  const rest=lx?keys.slice(1):keys;const base=lx?keys[0].slice(5):"window";
  const str=base+rest.map(k=>IDENT.test(k)?"."+k:"["+JSON.stringify(k)+"]").join("");
  S.pk.set(str,lx?keys:["window",...keys]);return str;}
function splitPath(p){p=String(p);if(S.pk.has(p))return S.pk.get(p).slice();return p.replace(/\[(["']?)(.*?)\1\]/g,".$2").split(".").filter(Boolean);}
function resolve(parts){let o=W;for(let i=0;i<parts.length;i++){const k=parts[i];
  if(i===0){if(isLex(k)){o=lexGet(k.slice(5));continue;}if(k==="window")continue;if(!(k in W)&&LEXOK(k)){o=lexGet(k);continue;}}
  if(o==null)return undefined;o=o[k];}return o;}
function assign(parts,val){const ps=parts.filter((k,i)=>!(i===0&&k==="window"));
  if(ps.length===1){const k=ps[0];if(isLex(k)){lexSet(k.slice(5),val);return;}if(!(k in W)&&LEXOK(k)){lexSet(k,val);return;}}
  const last=ps.pop();const o=resolve(ps);if(o==null)throw Error("Caminho inválido");o[last]=val;}

/* ---------- Variáveis globais criadas pelo site ---------- */
let baseline=null;
function getBaseline(){if(baseline)return baseline;try{const f=D.createElement("iframe");f.style.display="none";(D.body||D.documentElement).appendChild(f);baseline=new Set(Object.getOwnPropertyNames(f.contentWindow));f.remove();}catch(e){baseline=new Set();}return baseline;}
function siteGlobals(){const b=getBaseline();const out=[];for(const k of Object.getOwnPropertyNames(W)){if(b.has(k)||k.startsWith("__kl")||/^on/.test(k)||/^webkit/i.test(k))continue;let v;try{v=W[k];}catch(e){continue;}if(v instanceof Node||v===W)continue;out.push([k,v]);}return out;}

/* congelar: reaplica o valor a cada 100ms */
function freeze(path,val){S.frozen.set(path,val);}
const ft=setInterval(()=>{S.frozen.forEach((v,p)=>{try{assign(splitPath(p),v);}catch(e){}});},20);window.__klT.push(ft);

/* trava forte / rastreio de escrita via setter */
function toggleLock(path,mode){
  let L=S.locks.get(path);
  if(L){L[mode]=!L[mode];if(!L.lock&&!L.trace){try{Object.defineProperty(L.parent,L.name,{value:L.val,writable:true,configurable:true,enumerable:L.en});}catch(e){}S.locks.delete(path);}msg("Atualizado");return;}
  const keys=splitPath(path).filter((k,i)=>!(i===0&&k==="window"));const name=keys.pop();
  if(name==null||isLex(name)||(keys.length===0&&!(name in W))){msg("✖ let/const global não aceita trava/rastreio — use ❄ Congelar");return;}
  const parent=keys.length?resolve(keys):W;if(parent==null){msg("✖ caminho inválido");return;}
  const d=Object.getOwnPropertyDescriptor(parent,name);
  if(!d||!d.configurable||!("value" in d)){msg("✖ propriedade não configurável (var global/getter) — use ❄ Congelar");return;}
  L={parent,name,val:d.value,en:d.enumerable,lock:false,trace:false};L[mode]=true;
  Object.defineProperty(parent,name,{configurable:true,enumerable:d.enumerable,get(){return L.val;},set(x){
    if(L.trace)S.logs.push({l:"warn",t:new Date().toLocaleTimeString(),m:"✍ ESCRITA "+path+" ← "+fmt(x)+"\n"+String(new Error().stack).split("\n").slice(2,8).join("\n")});
    if(S.fw||!L.lock)L.val=x;}});
  S.locks.set(path,L);msg("Ativo: "+(mode==="lock"?"travado":"rastreando (veja aba Console)"));}

function valueEditor(path,v,onSave){
  const inp=h("input",{cls:"i",value:show(v)});
  const save=nv=>{try{S.fw=true;try{assign(splitPath(path),nv);}finally{S.fw=false;}if(S.frozen.has(path))S.frozen.set(path,nv);msg("✔ "+path+" = "+show(nv).slice(0,60));onSave&&onSave();}catch(e){msg("✖ "+e.message);}};
  const cur=()=>resolve(splitPath(path));
  const quick=[];
  if(typeof v==="number"){[["+1",x=>x+1],["-1",x=>x-1],["+100",x=>x+100],["×2",x=>x*2],["÷2",x=>x/2],["0",()=>0],["999999",()=>999999],["MAX",()=>Number.MAX_SAFE_INTEGER]].forEach(([l,f])=>quick.push(btn(l,()=>{const c=cur();save(f(typeof c==="number"?c:Number(inp.value)));})));}
  if(typeof v==="boolean")quick.push(btn("Alternar",()=>save(!cur())),btn("true",()=>save(true)),btn("false",()=>save(false)));
  if(typeof v==="string")quick.push(btn("Vazio",()=>save("")),btn("MAIÚSC",()=>save(String(cur()).toUpperCase())));
  const fz=btn(S.frozen.has(path)?"🔥 Descongelar":"❄ Congelar",()=>{if(S.frozen.has(path)){S.frozen.delete(path);fz.textContent="❄ Congelar";fz.classList.remove("on");}else{S.frozen.set(path,parse(inp.value));fz.textContent="🔥 Descongelar";fz.classList.add("on");}msg(S.frozen.size+" congelado(s)");},S.frozen.has(path)?"on":"");
  const L=S.locks.get(path);
  return h("div",null,h("div",{cls:"row mt"},inp,btn("Salvar",()=>save(parse(inp.value)),"g")),
    h("div",{cls:"q"},quick,fz,
      btn(L&&L.lock?"🔓 Destravar":"🔒 Travar forte",()=>{toggleLock(path,"lock");drawBody();},L&&L.lock?"on":""),
      btn(L&&L.trace?"👁 Parar rastreio":"👁 Quem escreve?",()=>{toggleLock(path,"trace");drawBody();},L&&L.trace?"on":""),
      btn("Copiar",()=>copy(inp.value))));
}

/* editar/chamar função */
function funcEd(path,fn){
  const ta=h("textarea",{rows:8});try{ta.value=Function.prototype.toString.call(fn);}catch(e){ta.value="";}
  const args=h("input",{cls:"i",placeholder:'argumentos JSON: [1,"abc"]'});const out=h("div",{cls:"mono mt"});
  const mk=src=>{try{return (0,eval)("("+src+")");}catch(e){const o=(0,eval)("({"+src+"})");return Object.values(o)[0];}};
  return h("div",{cls:"mt"},ta,h("div",{cls:"q"},
    btn("Aplicar código",()=>{try{const nf=mk(ta.value);S.fw=true;try{assign(splitPath(path),nf);}finally{S.fw=false;}msg("✔ função substituída");}catch(e){msg("✖ "+e.message);}},"g"),btn("Copiar",()=>copy(ta.value))),
    h("div",{cls:"row mt"},args,btn("▶ Chamar",async()=>{try{const keys=splitPath(path);const f=resolve(keys);const pk=keys.slice(0,-1);const tv=pk.length?resolve(pk):W;const a=args.value.trim()?JSON.parse(args.value):[];const r=await f.apply(tv,a);out.textContent="← "+fmt(r);S.logs.push({l:"res",t:"",m:path+"(…) ← "+fmt(r)});}catch(e){out.textContent="✖ "+e.message;}},"g")),out);}
function fnDet(path,fn){return h("details",{cls:"mt",ontoggle:e=>{const d=e.target;if(d.open&&!d.__f){d.__f=1;d.appendChild(funcEd(path,fn));}}},h("summary",{cls:"mu"},"✏ ver/editar código · chamar ƒ"));}

/* editar objeto inteiro como JSON */
function jsonEd(o,full){const ta=h("textarea",{rows:8});
  try{ta.value=JSON.stringify(o,(k,v)=>typeof v==="bigint"?v+"n":v,2);}catch(e){ta.value="(não serializável: "+e.message+")";}
  return h("div",{cls:"mt"},ta,h("div",{cls:"q"},
    btn("Mesclar no objeto",()=>{try{Object.assign(o,JSON.parse(ta.value));msg("✔ mesclado");drawBody();}catch(e){msg("✖ "+e.message);}},"g"),
    btn("Substituir referência",()=>{try{assign(full,JSON.parse(ta.value));msg("✔ substituído");drawBody();}catch(e){msg("✖ "+e.message);}}),
    btn("+ propriedade",()=>{const k=prompt("Nome da propriedade:");if(k==null||k==="")return;try{o[k]=parse(prompt("Valor (número, texto, JSON):")||"");drawBody();}catch(e){msg("✖ "+e.message);}})));}

/* editar e reenviar requisição */
function reqEd(n){const m=h("input",{cls:"i",value:n.method,style:"max-width:80px"}),u=h("input",{cls:"i",value:n.url}),
  hd=h("textarea",{rows:2,placeholder:'headers JSON: {"Content-Type":"application/json"}'}),bd=h("textarea",{rows:3});bd.value=n.reqBody||"";
  const out=h("div",{cls:"mono mt",style:"max-height:240px;overflow:auto"});
  return h("details",{cls:"mt"},h("summary",{cls:"mu"},"✏ Editar e reenviar"),h("div",{cls:"row mt"},m,u),h("div",{cls:"mt"},hd),h("div",{cls:"mt"},bd),
    h("div",{cls:"q"},btn("Enviar",async()=>{try{const o={method:m.value.toUpperCase(),credentials:"include"};if(hd.value.trim())o.headers=JSON.parse(hd.value);if(bd.value&&!/^(GET|HEAD)$/.test(o.method))o.body=bd.value;const r=await (S.of||W.fetch.bind(W))(u.value,o);const t=await r.text();out.textContent=r.status+" "+r.statusText+"\n"+prettyMaybe(t.slice(0,200000));}catch(e){out.textContent="✖ "+e.message;}},"g")),out);}

/* IndexedDB: ler / editar */
function idbOpen(name){return new Promise((res,rej)=>{const r=indexedDB.open(name);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function idbDump(name){const db=await idbOpen(name);const out=[];
  for(const sn of [...db.objectStoreNames]){const st=db.transaction(sn,"readonly").objectStore(sn);
    const recs=await new Promise((res,rej)=>{const a=[];const c=st.openCursor();c.onsuccess=()=>{const cu=c.result;if(cu){a.push({k:cu.key,v:cu.value});cu.continue();}else res(a);};c.onerror=()=>rej(c.error);});
    out.push({store:sn,keyPath:st.keyPath,recs});}
  db.close();return out;}
async function idbPut(name,store,key,val){const db=await idbOpen(name);
  await new Promise((res,rej)=>{const tx=db.transaction(store,"readwrite");const st=tx.objectStore(store);if(st.keyPath!=null)st.put(val);else st.put(val,key);tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});db.close();}

/* variáveis let/const globais: descobre nomes nos scripts lidos e testa acesso via eval global */
function lexScan(){const names=new Set();const re=/\b(?:let|const|var|function|class)\s+([A-Za-z_$][\w$]*)/g;
  for(const it of SRC.items.values()){const u=it.url||"";if(!it.text)continue;if(/^(net:|req:|fn:|map:)/.test(u))continue;if(u[0]==="#"&&!/^#(DOM atual|HTML original|script inline)/.test(u))continue;
    re.lastIndex=0;let m;while((m=re.exec(it.text))&&names.size<40000)names.add(m[1]);}
  const ok=[];let csp=false;
  names.forEach(n=>{if(n in W)return;const t=lexTypeof(n);if(t==="!csp"){csp=true;return;}if(t!=="undefined"&&t!=="tdz")ok.push(n);});
  S.lexNames=ok;S.lexCsp=csp;}
function lexList(){if(!S.lexNames)return [];const out=[];for(const n of S.lexNames){let v;try{if(n in W)continue;v=lexGet(n);}catch(e){continue;}out.push([n,v]);}return out;}

/* ---------- Achar valor (estilo Cheat Engine) ---------- */
const VS=S.vs=S.vs||{res:[],run:false,info:"",q:"",bulk:"",deep:6,all:false,page:100};
function matchEq(v,t){if(typeof t==="number")return typeof v==="number"?v===t:(typeof v==="string"&&v===String(t));if(typeof t==="boolean")return v===t;return String(v)===String(t);}
async function vsWalk(onVal){
  const seen=new WeakSet(),q=[];let cnt=0,t0=performance.now();
  const SKIP=new Set(["window","self","top","parent","frames","document","globalThis","chrome","external","opener","localStorage","sessionStorage","navigator","performance","history","location","screen","caches","indexedDB","crypto","visualViewport"]);
  const handle=(v,keys,d)=>{const t=typeof v;if(v==null||t==="symbol"||t==="function")return;
    if(t==="object"){if(v===W||(typeof Node!=="undefined"&&v instanceof Node)||seen.has(v))return;seen.add(v);if(d<VS.deep&&q.length<200000)q.push([v,keys,d]);return;}
    onVal(v,keys);};
  const names=VS.all?Object.getOwnPropertyNames(W).filter(k=>!SKIP.has(k)&&!k.startsWith("__kl")):siteGlobals().map(x=>x[0]);
  for(const k of names){let dsc;try{dsc=Object.getOwnPropertyDescriptor(W,k);}catch(e){continue;}if(!dsc||!("value" in dsc))continue;handle(dsc.value,[k],1);}
  lexList().forEach(([n,v])=>handle(v,["@lex:"+n],1));
  for(let qi=0;qi<q.length;qi++){const [o,keys,d]=q[qi];let ks;try{ks=Reflect.ownKeys(o);}catch(e){continue;}
    if(ks.length>5000)ks=ks.slice(0,5000);const isArr=Array.isArray(o);
    for(const k of ks){if(typeof k==="symbol"||(isArr&&k==="length"))continue;let dsc;try{dsc=Object.getOwnPropertyDescriptor(o,k);}catch(e){continue;}if(!dsc||!("value" in dsc))continue;handle(dsc.value,keys.concat(k),d+1);}
    if(++cnt%200===0&&performance.now()-t0>14){VS.info=cnt+" objetos · "+VS.res.length+" achados…";await new Promise(r=>setTimeout(r,0));t0=performance.now();}}
  return cnt;}
async function vsFirst(mode){if(VS.run)return;
  if((mode==="eq"||mode==="has")&&VS.q===""){msg("Digite um valor primeiro");return;}
  VS.run=true;VS.res=[];VS.page=100;VS.info="iniciando…";drawBody();
  const t=parse(VS.q),qs=String(VS.q).toLowerCase();
  try{await vsWalk((v,keys)=>{if(VS.res.length>=300000)return;
    if(mode==="eq"){if(matchEq(v,t))VS.res.push({k:keys,v});}
    else if(mode==="has"){if(typeof v==="string"&&v.toLowerCase().includes(qs))VS.res.push({k:keys,v});}
    else if(typeof v==="number"&&isFinite(v))VS.res.push({k:keys,v});});}catch(e){msg("✖ "+e.message);}
  VS.run=false;msg(VS.res.length+" resultado(s)");drawBody();}
function vsNext(mode){const t=parse(VS.q),qs=String(VS.q).toLowerCase(),keep=[];
  for(const r of VS.res){let c;try{c=resolve(r.k);}catch(e){continue;}let ok=false;
    if(mode==="eq")ok=matchEq(c,t);else if(mode==="has")ok=typeof c==="string"&&c.toLowerCase().includes(qs);
    else if(mode==="ch")ok=c!==r.v;else if(mode==="un")ok=c===r.v;
    else if(mode==="up")ok=typeof c==="number"&&typeof r.v==="number"&&c>r.v;else if(mode==="dn")ok=typeof c==="number"&&typeof r.v==="number"&&c<r.v;
    if(ok){r.v=c;keep.push(r);}}
  VS.res=keep;msg(keep.length+" resultado(s)");}

/* ---------- Scanner: lê TUDO que o site carregou (antes e depois de abrir) ---------- */
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
  if(SRC.run)return;SRC.run=true;SRC.done=0;msg("Escaneando…");
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
  SRC.run=false;msg("Scan completo: "+SRC.items.size+" fontes · "+SRC.finds.length+" achados");tick();if(S.tab!=="src"&&!(R.activeElement&&/INPUT|TEXTAREA/.test(R.activeElement.tagName)))drawBody();
}
function printable(s){if(!s||s.length<4)return false;let p=0;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);if((c>=32&&c<127)||c===9||c===10||c===13)p++;}return p/s.length>0.92&&/[A-Za-z]{3}/.test(s);}
function b64d(s){try{return decodeURIComponent(escape(atob(s)));}catch(e){try{return atob(s);}catch(e2){return null;}}}
function hexd(s){try{return s.match(/../g).map(x=>String.fromCharCode(parseInt(x,16))).join("");}catch(e){return null;}}
const KW="pass|senha|user|usu|login|admin|secret|key|token|flag|pin|code|cod";
const PATS=[
 ["🚩 Flag",/\b[A-Za-z0-9_]{2,12}\{[^{}\s]{3,120}\}/g,1],
 ["🔑 Credencial",/(?:pass(?:word|wd|phrase)?|pwd|senha|user(?:name)?|usu[aá]rio|login|admin|secret|segredo|token|api[_-]?key|apikey|auth|credential|private[_-]?key|key|chave|flag)["'\]]*\s*[:=]\s*["'`][^"'`\n]{1,150}["'`]/gi,1],
 ["⚖ Comparação suspeita",new RegExp("(?:"+KW+")\\w*\\s*[!=]==?\\s*[\"'`][^\"'`\\n]{1,100}[\"'`]|[\"'`][^\"'`\\n]{1,100}[\"'`]\\s*[!=]==?\\s*\\w*(?:"+KW+")\\w*|\\.value\\s*[!=]==?\\s*[\"'`][^\"'`\\n]{1,100}[\"'`]","gi"),1],
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
  B.appendChild(h("div",{cls:"mono mu",style:"margin-bottom:6px"},it.label+" · "+fmtB(it.text.length)+(it.status?" · HTTP "+it.status:"")+(it.err?" · ERRO: "+it.err+" (provável CORS)":"")+(it.bin?" · binário ("+it.ct+")":"")));
  const ta=h("textarea",{readonly:true,wrap:"off",style:"height:62vh;white-space:pre;overflow:auto"});ta.value=txt.slice(0,600000);B.appendChild(ta);
  if(SRC.focus){const i=ta.value.indexOf(SRC.focus);if(i>=0)setTimeout(()=>{const ln=ta.value.slice(0,i).split("\n").length-1;const lh=parseFloat(getComputedStyle(ta).lineHeight)||16;ta.scrollTop=Math.max(0,(ln-3)*lh);try{ta.setSelectionRange(i,i+SRC.focus.length);}catch(e){}},30);}}

/* ---------- Abas ---------- */
const TABS={
vars:{n:"Variáveis",search:true,live:true,render(B){
  const f=S.vf||"all";
  B.appendChild(h("div",{cls:"row",style:"margin-bottom:6px"},["all:Todas","number:123","boolean:Bool","string:Texto","object:Objetos","function:Funções"].map(x=>{const[k,l]=x.split(":");return btn(l,()=>{S.vf=k;draw();},f===k?"on":"");})));
  const all=siteGlobals().map(([k,v])=>({k,v,lex:false})).concat(lexList().map(([k,v])=>({k,v,lex:true})));
  const list=all.filter(e=>(f==="all"||typeof e.v===f)&&(e.k.toLowerCase().includes(S.q)||(typeof e.v!=="object"&&typeof e.v!=="function"&&String(e.v).toLowerCase().includes(S.q))));
  list.sort((a,b)=>{const p=x=>({number:0,boolean:1,string:2,object:3,function:4}[typeof x.v]??5);return p(a)-p(b)||a.k.localeCompare(b.k);});
  B.appendChild(h("div",{cls:"mu",style:"margin-bottom:6px"},list.length+" variáveis ("+all.filter(e=>e.lex).length+" let/const) · tudo editável ao vivo"+(S.lexCsp?" · ⚠ CSP bloqueia eval: let/const e edição de função indisponíveis":"")));
  list.slice(0,250).forEach(({k,v,lex})=>{const keys=lex?["@lex:"+k]:["window",k];const ps=pstr(keys);
    const prim=v===null||["number","string","boolean","undefined","bigint"].includes(typeof v);
    B.appendChild(h("div",{cls:"c"},h("div",{cls:"row sp"},h("div",{cls:"row"},h("span",{cls:"k"},k),tag(v),lex?h("span",{cls:"t tf"},"let/const"):null),
      prim?null:btn("Abrir ›",()=>{S.root=ps;S.path=[];S.tab="obj";draw();})),
      prim?valueEditor(ps,v):h("div",null,h("div",{cls:"mu mono mt"},typeof v==="function"?"ƒ "+(v.name||k)+"("+v.length+" args)":show(v).slice(0,160)),typeof v==="function"?fnDet(ps,v):null)));});
}},
scan:{n:"🎯 Achar valor",live:true,render(B){
  const qi=h("input",{cls:"i",placeholder:"valor: 5 · true · admin …",value:VS.q});qi.oninput=()=>{VS.q=qi.value;};
  B.appendChild(h("div",{cls:"c"},h("div",{cls:"row"},qi),
    h("div",{cls:"q"},btn("🔍 Achar = valor",()=>vsFirst("eq"),"g"),btn("🔤 Texto contém",()=>vsFirst("has")),btn("🔢 Todos os números",()=>vsFirst("num"))),
    h("div",{cls:"q"},btn("Profundidade: "+VS.deep,()=>{VS.deep=VS.deep>=12?3:VS.deep+3;draw();}),btn(VS.all?"window inteiro: SIM":"window inteiro: não",()=>{VS.all=!VS.all;draw();},VS.all?"on":"")),
    h("div",{cls:"mu mt"},"Modo Cheat Engine: ache = 5 (sua vida). Perdeu 1? digite 4 e toque “= valor” nos filtros. Repita até sobrar 1–2. Não sabe o valor? “Todos os números” → ação no jogo → “Mudou/Subiu/Desceu”.")));
  if(!VS.res.length&&!VS.run)return;
  B.appendChild(h("div",{cls:"c"},h("div",{cls:"mu"},VS.run?"⏳ "+VS.info:VS.res.length+" resultado(s) — filtros abaixo usam o valor digitado em cima"),
    h("div",{cls:"q"},btn("= valor",()=>{vsNext("eq");drawBody();},"g"),btn("contém",()=>{vsNext("has");drawBody();}),btn("↻ Mudou",()=>{vsNext("ch");drawBody();}),btn("＝ Igual",()=>{vsNext("un");drawBody();}),btn("↑ Subiu",()=>{vsNext("up");drawBody();}),btn("↓ Desceu",()=>{vsNext("dn");drawBody();}),btn("✖ Limpar",()=>{VS.res=[];drawBody();},"r"))));
  if(VS.res.length&&VS.res.length<=500){const bi=h("input",{cls:"i",placeholder:"novo valor para TODOS",value:VS.bulk});bi.oninput=()=>{VS.bulk=bi.value;};
    B.appendChild(h("div",{cls:"c"},h("div",{cls:"row"},bi,btn("Aplicar em "+VS.res.length,()=>{let ok=0;VS.res.forEach(r=>{try{S.fw=true;assign(r.k,parse(VS.bulk));ok++;}catch(e){}finally{S.fw=false;}});msg("✔ "+ok+"/"+VS.res.length+" alterados");drawBody();},"g")),
      h("div",{cls:"q"},btn("❄ Congelar todos neste valor",()=>{VS.res.forEach(r=>S.frozen.set(pstr(r.k),parse(VS.bulk)));msg(S.frozen.size+" congelado(s)");drawBody();}))));}
  VS.res.slice(0,VS.page).forEach(r=>{let c;try{c=resolve(r.k);}catch(e){c="[erro]";}const ps=pstr(r.k),pk=r.k.slice(0,-1);
    B.appendChild(h("div",{cls:"c"},h("div",{cls:"row sp"},h("div",{cls:"row"},h("span",{cls:"k mono"},ps),tag(c)),pk.length?btn("Pai ›",()=>{S.root=pstr(pk);S.path=[];S.tab="obj";draw();}):null),
      h("div",{cls:"mu"},"na busca anterior: "+show(r.v).slice(0,40)),
      (c!==null&&typeof c==="object")?h("div",{cls:"mu"},"(agora é objeto)"):valueEditor(ps,c)));});
  if(VS.res.length>VS.page)B.appendChild(btn("Mostrar mais 100 (de "+VS.res.length+")",()=>{VS.page+=100;drawBody();}));
}},
obj:{n:"Objetos",search:true,live:true,render(B){
  const full=[...splitPath(S.root),...S.path];const o=resolve(full);const ps=pstr(full);
  const inp=h("input",{cls:"i",value:ps});
  B.appendChild(h("div",{cls:"row",style:"margin-bottom:6px"},inp,btn("Ir",()=>{S.root=inp.value;S.path=[];draw();},"g"),S.path.length?btn("↑",()=>{S.path.pop();draw();}):null,btn("Copiar JSON",()=>copy(show(o)))));
  if(o==null||(typeof o!=="object"&&typeof o!=="function")){B.appendChild(h("div",{cls:"c"},tag(o),valueEditor(ps,o)));return;}
  if(typeof o==="function")B.appendChild(h("div",{cls:"c"},fnDet(ps,o)));
  else B.appendChild(h("details",{cls:"c"},h("summary",null,h("b",null,"✏ Editar como JSON · + propriedade")),jsonEd(o,full)));
  let keys=[];try{keys=[...new Set([...Object.getOwnPropertyNames(o),...Object.keys(Object.getPrototypeOf(o)||{})])];}catch(e){}
  keys=keys.filter(k=>k.toLowerCase().includes(S.q));
  B.appendChild(h("div",{cls:"mu",style:"margin-bottom:6px"},keys.length+" propriedades"));
  keys.slice(0,250).forEach(k=>{let v;try{v=o[k];}catch(e){v="[restrito]";}const prim=v===null||!["object","function"].includes(typeof v);const kp=pstr([...full,k]);
    B.appendChild(h("div",{cls:"c"},h("div",{cls:"row sp"},h("div",{cls:"row"},h("span",{cls:"k"},k),tag(v)),h("div",{cls:"row"},prim?null:btn("Abrir ›",()=>{S.path.push(k);draw();}),btn("🗑",()=>{try{delete o[k];drawBody();}catch(e){msg("✖ "+e.message);}},"r"))),
      prim?valueEditor(kp,v):h("div",null,h("div",{cls:"mu mono mt"},typeof v==="function"?"ƒ "+(v.name||k)+"("+v.length+" args)":show(v).slice(0,140)),typeof v==="function"?fnDet(kp,v):null)));});
}},
store:{n:"Storage",search:true,render(B){
  const sec=(name,store)=>{let keys=[];try{keys=Object.keys(store);}catch(e){B.appendChild(h("div",{cls:"bad"},name+": bloqueado"));return;}
    B.appendChild(h("div",{cls:"row sp mt",style:"margin-bottom:6px"},h("b",null,name+" ("+keys.length+")"),h("div",{cls:"row"},
      btn("+ Novo",()=>{const k=prompt("Chave:");if(k){store.setItem(k,prompt("Valor:")||"");draw();}}),btn("Exportar",()=>copy(JSON.stringify(Object.fromEntries(keys.map(k=>[k,store.getItem(k)])),null,2))),btn("Limpar",()=>{if(confirm("Limpar "+name+"?")){store.clear();draw();}},"r"))));
    keys.filter(k=>k.toLowerCase().includes(S.q)).forEach(k=>{const v=store.getItem(k);const ta=h("textarea",{rows:Math.min(6,Math.ceil(v.length/60)+1)});ta.value=prettyMaybe(v);
      B.appendChild(h("div",{cls:"c"},h("div",{cls:"row sp"},h("span",{cls:"k"},k),h("span",{cls:"mu"},v.length+" chars")),h("div",{cls:"mt"},ta),
        h("div",{cls:"q"},btn("Salvar",()=>{store.setItem(k,minMaybe(ta.value));msg("Salvo "+k);},"g"),btn("Copiar",()=>copy(v)),btn("Apagar",()=>{store.removeItem(k);draw();},"r"))));});};
  sec("localStorage",W.localStorage);sec("sessionStorage",W.sessionStorage);
  const ck=D.cookie?D.cookie.split(/;\s*/).map(c=>{const i=c.indexOf("=");return[decodeURIComponent(c.slice(0,i)),c.slice(i+1)];}):[];
  B.appendChild(h("div",{cls:"row sp mt",style:"margin-bottom:6px"},h("b",null,"Cookies ("+ck.length+") — só não-HttpOnly"),btn("+ Novo",()=>{const k=prompt("Nome:");if(k){D.cookie=encodeURIComponent(k)+"="+(prompt("Valor:")||"")+";path=/";draw();}})));
  ck.filter(([k])=>k.toLowerCase().includes(S.q)).forEach(([k,v])=>{const inp=h("input",{cls:"i",value:v});
    B.appendChild(h("div",{cls:"c"},h("span",{cls:"k"},k),h("div",{cls:"row mt"},inp,btn("Salvar",()=>{D.cookie=encodeURIComponent(k)+"="+inp.value+";path=/";msg("Cookie salvo");},"g"),btn("Apagar",()=>{D.cookie=encodeURIComponent(k)+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";draw();},"r"))));});
  if(W.indexedDB&&indexedDB.databases)indexedDB.databases().then(dbs=>{B.appendChild(h("b",{style:"display:block;margin:8px 0 4px"},"IndexedDB ("+dbs.length+") — toque para abrir/editar"));
    dbs.forEach(d=>B.appendChild(h("details",{cls:"c",ontoggle:async ev=>{const el=ev.target;if(!el.open||el.__f)return;el.__f=1;
      try{const dump=await idbDump(d.name);dump.forEach(st=>{el.appendChild(h("div",{cls:"mu mt"},"📁 "+st.store+" ("+st.recs.length+")"));
        st.recs.slice(0,200).forEach(r=>{const ta=h("textarea",{rows:3});try{ta.value=JSON.stringify(r.v,null,1);}catch(x){ta.value=String(r.v);}
          el.appendChild(h("div",{cls:"c"},h("span",{cls:"k"},JSON.stringify(r.k)),h("div",{cls:"mt"},ta),h("div",{cls:"q"},btn("Salvar",async()=>{try{await idbPut(d.name,st.store,r.k,JSON.parse(ta.value));msg("✔ salvo");}catch(x){msg("✖ "+x.message);}},"g"),btn("Copiar",()=>copy(ta.value)))));});});}
      catch(x){el.appendChild(h("div",{cls:"bad"},"✖ "+x.message));}}},h("summary",null,h("span",{cls:"mono"},d.name+"  v"+d.version)))));}).catch(()=>{});
}},
net:{n:"Rede",search:true,live:true,render(B){
  B.appendChild(h("div",{cls:"row sp",style:"margin-bottom:6px"},h("span",{cls:"mu"},S.net.length+" requisições capturadas c/ corpo (desde que abriu) — abaixo, tudo que já tinha carregado"),btn("Limpar",()=>{S.net.length=0;draw();},"r")));
  S.net.filter(n=>(n.url+n.method+n.status).toLowerCase().includes(S.q)).slice(0,150).forEach(n=>{const okc=n.status==="…"?"warn":(n.status>=200&&n.status<400)?"ok":"bad";
    B.appendChild(h("details",{cls:"c"},h("summary",null,h("div",{cls:"row sp"},h("div",{cls:"row"},h("b",{cls:okc},String(n.status)),h("span",{cls:"t tf"},n.method),h("span",{cls:"t tf"},n.type)),h("span",{cls:"mu"},n.ms+"ms · "+(n.size?fmtB(n.size):"")+" · "+n.time)),h("div",{cls:"mono mu mt"},n.url)),
      n.reqBody?h("div",{cls:"mt"},h("b",null,"Enviado:"),h("div",{cls:"mono"},prettyMaybe(n.reqBody))):null,
      h("div",{cls:"mt"},h("b",null,"Resposta:"),h("div",{cls:"mono",style:"max-height:240px;overflow:auto"},prettyMaybe(n.resBody||"(vazio)"))),
      reqEd(n),h("div",{cls:"q"},btn("Copiar URL",()=>copy(n.url)),btn("Copiar resposta",()=>copy(n.resBody||"")),btn("Copiar fetch()",()=>copy(`fetch(${JSON.stringify(n.url)},{method:${JSON.stringify(n.method)}${n.reqBody?",body:"+JSON.stringify(n.reqBody):""}}).then(r=>r.text()).then(console.log)`)),btn("Repetir",()=>{W.fetch(n.url,{method:n.method,body:n.reqBody||undefined,credentials:"include"}).then(()=>draw());}))));});
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
    B.appendChild(h("div",{cls:"mu",style:"margin-bottom:6px"},r.length+" resultado(s) para “"+S.qraw+"” (use /regex/ para expressão regular)"));
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
  const ta=h("textarea",{rows:3,placeholder:"Digite JavaScript e toque Executar (ex: document.title)"});ta.value=S.code||"";ta.oninput=()=>S.code=ta.value;
  const run=()=>{const code=ta.value;S.logs.push({l:"cmd",t:"",m:"› "+code});
    let r;try{r=(0,eval)(code);}catch(e){
      try{const s=D.createElement("script");s.textContent="window.__klR=(function(){return eval("+JSON.stringify(code)+")})()";D.documentElement.appendChild(s);s.remove();r=W.__klR;}catch(e2){S.logs.push({l:"error",t:"",m:"✖ "+e.message+" (CSP pode bloquear eval neste site)"});draw();return;}}
    Promise.resolve(r).then(v=>{S.logs.push({l:"res",t:"",m:"← "+fmt(v)});draw();},e=>{S.logs.push({l:"error",t:"",m:"✖ "+fmt(e)});draw();});};
  B.appendChild(h("div",null,ta,h("div",{cls:"q"},btn("▶ Executar",run,"g"),btn("Limpar log",()=>{S.logs.length=0;draw();},"r"),
    ["document.title","location.href","navigator.userAgent","Object.keys(localStorage)","document.querySelectorAll('*').length"].map(s=>btn(s.length>18?s.slice(0,16)+"…":s,()=>{ta.value=s;S.code=s;run();})))));
  const box=h("div",{cls:"mt"});S.logs.slice(-300).forEach(x=>box.appendChild(h("div",{cls:"lg "+x.l},(x.t?x.t+" ":"")+(["warn","error"].includes(x.l)?x.l.toUpperCase()+" ":"")+x.m)));B.appendChild(box);
}},
el:{n:"Elementos",render(B){
  B.appendChild(h("div",{cls:"q",style:"margin-bottom:6px"},btn("🎯 Selecionar na página",pick,"g"),btn("✏ Editar textos da página",()=>{D.body.contentEditable=D.body.contentEditable==="true"?"false":"true";msg("Modo edição: "+D.body.contentEditable);}),btn("🔲 Contornos",()=>{const id="__kl_ol";const x=D.getElementById(id);if(x)x.remove();else{const s=D.createElement("style");s.id=id;s.textContent="*{outline:1px solid #f0f3 !important}";D.head.appendChild(s);}}),btn("🖼 Imagens",()=>{S.tab="media";draw();})));
  const el=S.sel;if(!el){B.appendChild(h("div",{cls:"mu"},"Toque em “Selecionar” e depois em qualquer coisa da página."));return;}
  const cs=getComputedStyle(el),r=el.getBoundingClientRect();
  B.appendChild(h("div",{cls:"c"},h("div",{cls:"k mono"},sel(el)),h("div",{cls:"grid mt mu"},
    "Tamanho",Math.round(r.width)+" × "+Math.round(r.height),"Posição",Math.round(r.left)+", "+Math.round(r.top),"Cor",cs.color,"Fundo",cs.backgroundColor,"Fonte",cs.fontSize+" "+cs.fontFamily.split(",")[0],"Display",cs.display,"Filhos",el.children.length),
    h("div",{cls:"q"},btn("↑ Pai",()=>{if(el.parentElement){S.sel=el.parentElement;draw();}}),btn("Esconder",()=>{el.style.display=el.style.display==="none"?"":"none";}),btn("Remover",()=>{el.remove();S.sel=null;draw();},"r"),btn("Copiar seletor",()=>copy(sel(el))),btn("Copiar HTML",()=>copy(el.outerHTML)),btn("Rolar até",()=>el.scrollIntoView({behavior:"smooth",block:"center"})))));
  const attrs=h("div",{cls:"c"},h("b",null,"Atributos"));[...el.attributes].forEach(a=>{const i=h("input",{cls:"i",value:a.value});attrs.appendChild(h("div",{cls:"row mt"},h("span",{cls:"k",style:"min-width:70px"},a.name),i,btn("✔",()=>{el.setAttribute(a.name,i.value);msg("Atributo salvo");},"g")));});
  if("value"in el){const i=h("input",{cls:"i",value:el.value});attrs.appendChild(h("div",{cls:"row mt"},h("span",{cls:"k",style:"min-width:70px"},"value"),i,btn("✔",()=>{el.value=i.value;el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));},"g")));}
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
  B.appendChild(h("div",{style:"display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:6px;margin:6px 0"},imgs.slice(0,120).map(u=>h("a",{href:u,target:"_blank",style:"display:block;aspect-ratio:1;background:#010409;border:1px solid #30363d;border-radius:6px;overflow:hidden"},h("img",{src:u,style:"width:100%;height:100%;object-fit:contain"})))));
  if(vids.length){B.appendChild(h("b",null,"Vídeo/Áudio ("+vids.length+")"));vids.forEach(u=>B.appendChild(h("div",{cls:"c row sp"},h("span",{cls:"mono mu",style:"flex:1"},u),btn("Copiar",()=>copy(u)))));}
  B.appendChild(h("div",{cls:"row sp mt"},h("b",null,"Links ("+links.length+")"),btn("Copiar todos",()=>copy(links.join("\n")))));
  links.slice(0,200).forEach(u=>B.appendChild(h("div",{cls:"lg"},u)));
  const forms=[...D.forms];if(forms.length){B.appendChild(h("b",{style:"display:block;margin-top:8px"},"Formulários ("+forms.length+")"));forms.forEach(f=>B.appendChild(h("div",{cls:"c mono mu"},(f.method||"get").toUpperCase()+" "+(f.action||location.href)+"\n"+[...f.elements].map(e=>(e.name||e.id||e.type)+" ["+e.type+"]"+(e.type==="hidden"?" = "+e.value:"")).join("\n"))));}
}},
info:{n:"Info",live:true,render(B){
  const n=performance.getEntriesByType("navigation")[0]||{};const mem=performance.memory;
  const grid=(t,rows)=>h("div",{cls:"c"},h("b",null,t),h("div",{cls:"grid mt"},rows.flatMap(([a,b])=>[h("span",{cls:"mu"},a),h("span",{cls:"mono"},String(b))])));
  B.appendChild(grid("Página",[["Título",D.title],["URL",location.href],["Domínio",location.host],["Idioma",D.documentElement.lang||"-"],["Charset",D.characterSet],["Elementos",D.querySelectorAll("*").length],["Scripts",D.scripts.length],["Iframes",D.querySelectorAll("iframe").length],["Imagens",D.images.length],["Frameworks",detect().join(", ")||"nenhum detectado"]]));
  B.appendChild(grid("Desempenho",[["Carregou em",n.loadEventEnd?Math.round(n.loadEventEnd)+" ms":"-"],["DOM pronto",n.domContentLoadedEventEnd?Math.round(n.domContentLoadedEventEnd)+" ms":"-"],["Resposta servidor",n.responseStart?Math.round(n.responseStart-n.requestStart)+" ms":"-"],["Tamanho página",n.transferSize?fmtB(n.transferSize):"-"],["Memória JS",mem?fmtB(mem.usedJSHeapSize)+" / "+fmtB(mem.jsHeapSizeLimit):"-"]]));
  B.appendChild(grid("Dispositivo",[["Tela",screen.width+"×"+screen.height+" @"+devicePixelRatio+"x"],["Janela",innerWidth+"×"+innerHeight],["Toque",navigator.maxTouchPoints>0?"sim":"não"],["Online",navigator.onLine?"sim":"não"],["Conexão",navigator.connection?navigator.connection.effectiveType+" "+(navigator.connection.downlink||"")+"Mbps":"-"],["CPU",navigator.hardwareConcurrency||"-"],["Idioma",navigator.language],["Fuso",Intl.DateTimeFormat().resolvedOptions().timeZone],["Navegador",navigator.userAgent]]));
  const metas=[...D.querySelectorAll("meta[name],meta[property]")].map(m=>[m.getAttribute("name")||m.getAttribute("property"),(m.content||"").slice(0,120)]);
  if(metas.length)B.appendChild(grid("Meta tags",metas));
  B.appendChild(h("div",{cls:"q"},btn("Copiar relatório",()=>copy(B.innerText)),btn("Recarregar sem cache",()=>location.reload()),btn("Modo escuro na página",()=>{const id="__kl_dk";const x=D.getElementById(id);if(x)x.remove();else{const s=D.createElement("style");s.id=id;s.textContent="html{filter:invert(1) hue-rotate(180deg)}img,video,picture{filter:invert(1) hue-rotate(180deg)}";D.head.appendChild(s);}})));
}}
};
function detect(){const f=[];const t=(c,n)=>{try{if(c())f.push(n);}catch(e){}};
  t(()=>W.React||D.querySelector("[data-reactroot]")||[...D.querySelectorAll("body *")].slice(0,50).some(e=>Object.keys(e).some(k=>k.startsWith("__react"))),"React");
  t(()=>W.Vue||W.__VUE__||D.querySelector("[data-v-app]"),"Vue");t(()=>W.ng||D.querySelector("[ng-version]"),"Angular");t(()=>W.__NEXT_DATA__,"Next.js");t(()=>W.__NUXT__,"Nuxt");
  t(()=>W.jQuery,"jQuery "+(W.jQuery&&W.jQuery.fn.jquery||""));t(()=>W.Svelte||D.querySelector("[class*=svelte-]"),"Svelte");t(()=>W.wp||D.querySelector("link[href*=wp-content]"),"WordPress");t(()=>W.Shopify,"Shopify");t(()=>W.gtag||W.dataLayer,"Google Analytics/GTM");t(()=>W.Phaser,"Phaser");t(()=>W.PIXI,"PixiJS");t(()=>W.THREE,"Three.js");t(()=>W.unityInstance||W.UnityLoader||W.createUnityInstance,"Unity WebGL");return f;}
function fmtB(b){b=+b;return b>1048576?(b/1048576).toFixed(1)+"MB":b>1024?(b/1024).toFixed(1)+"KB":b+"B";}
function prettyMaybe(s){try{const j=JSON.parse(s);if(typeof j==="object"&&j)return JSON.stringify(j,null,2);}catch(e){}return s;}
function minMaybe(s){try{return JSON.stringify(JSON.parse(s));}catch(e){return s;}}
function sel(el){if(el.id)return "#"+CSS.escape(el.id);const p=[];while(el&&el.nodeType===1&&p.length<5){let s=el.nodeName.toLowerCase();if(el.id){p.unshift("#"+CSS.escape(el.id));break;}const cl=[...el.classList].slice(0,2).map(c=>"."+CSS.escape(c)).join("");s+=cl;const par=el.parentElement;if(par){const sib=[...par.children].filter(c=>c.nodeName===el.nodeName);if(sib.length>1)s+=":nth-of-type("+(sib.indexOf(el)+1)+")";}p.unshift(s);el=par;}return p.join(" > ");}

/* seletor de elemento (mouse e toque) */
function pick(){P.style.display="none";const box=D.createElement("div");box.style.cssText="position:fixed;pointer-events:none;z-index:2147483646;border:2px solid #58a6ff;background:#58a6ff22;transition:all .05s";D.documentElement.appendChild(box);
  const tip=D.createElement("div");tip.style.cssText="position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#0d1117;color:#e6edf3;padding:8px 14px;border-radius:20px;font:13px sans-serif;border:1px solid #58a6ff";tip.textContent="Toque/clique no elemento (Esc cancela)";D.documentElement.appendChild(tip);
  const at=(x,y)=>{const e=D.elementFromPoint(x,y);if(e&&e!==host){const r=e.getBoundingClientRect();Object.assign(box.style,{left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px"});}return e;};
  const mv=e=>{const p=e.touches?e.touches[0]:e;at(p.clientX,p.clientY);};
  const end=e=>{e.preventDefault();e.stopPropagation();const p=e.changedTouches?e.changedTouches[0]:e;const el=at(p.clientX,p.clientY);done();if(el){S.sel=el;S.tab="el";draw();}};
  const key=e=>{if(e.key==="Escape")done();};
  const done=()=>{box.remove();tip.remove();D.removeEventListener("mousemove",mv,true);D.removeEventListener("touchmove",mv,true);D.removeEventListener("click",end,true);D.removeEventListener("touchend",end,true);D.removeEventListener("keydown",key,true);P.style.display="";};
  setTimeout(()=>{D.addEventListener("mousemove",mv,true);D.addEventListener("touchmove",mv,{capture:true,passive:true});D.addEventListener("click",end,true);D.addEventListener("touchend",end,{capture:true,passive:false});D.addEventListener("keydown",key,true);},50);}

/* ---------- Estrutura ---------- */
let body,qInp,sub,nav;
function shell(){P.textContent="";
  const hd=h("div",{cls:"hdr"},h("b",null,"⚡ KALIDADE PRO ",h("span",{cls:"mu"},"v5")),h("div",{cls:"row"},btn("_",()=>P.classList.toggle("min")),btn("⤢",()=>{P.classList.toggle("m");}),btn("✕",close,"r")));
  if(mobile)hd.prepend(h("div",{style:"position:absolute;left:0;right:0;top:3px"},h("div",{cls:"grip"})));hd.style.position="relative";
  nav=h("div",{cls:"nav"});Object.entries(TABS).forEach(([k,t])=>nav.appendChild(h("button",{cls:"nb"+(S.tab===k?" a":""),"data-t":k,onclick:()=>{S.tab=k;S.q="";S.qraw="";qInp.value="";draw();}},t.n)));
  qInp=h("input",{cls:"i",placeholder:"🔍 Buscar...",oninput:e=>{S.qraw=e.target.value;S.q=S.qraw.toLowerCase();clearTimeout(S.qt);S.qt=setTimeout(drawBody,150);}});
  sub=h("div",{cls:"sub"},qInp);body=h("div",{cls:"body"});
  msgEl=h("span",null,"Pronto. Toque ✕ ou rode de novo para fechar.");
  const auto=btn(S.auto?"⏸ Auto":"▶ Auto",()=>{S.auto=!S.auto;auto.textContent=S.auto?"⏸ Auto":"▶ Auto";},S.auto?"on":"");
  P.append(hd,nav,sub,body,h("div",{cls:"ft"},msgEl,h("div",{cls:"row"},auto,btn("↻",drawBody),btn("🔥 "+S.frozen.size,()=>{S.frozen.clear();msg("Tudo descongelado");drawBody();}))));
  drag(hd);}
function drawBody(){if(!body)return;const sc=body.scrollTop;body.textContent="";const t=TABS[S.tab];sub.style.display=t.search?"flex":"none";
  try{t.render(body);}catch(e){body.appendChild(h("div",{cls:"bad"},"Erro: "+e.message));}body.scrollTop=sc;}
function draw(){[...nav.children].forEach(b=>b.classList.toggle("a",b.dataset.t===S.tab));const nb=nav.querySelector('[data-t="net"]');if(nb)nb.textContent="Rede ("+S.net.length+")";drawBody();}
function close(){host.remove();window.__klT.forEach(clearInterval);window.__klT=[];}

/* arrastar com mouse e dedo */
function drag(hd){let sx,sy,ox,oy,on=false;
  const down=e=>{if(e.target.closest("button"))return;const p=e.touches?e.touches[0]:e;on=true;sx=p.clientX;sy=p.clientY;const r=P.getBoundingClientRect();ox=r.left;oy=r.top;};
  const move=e=>{if(!on)return;const p=e.touches?e.touches[0]:e;
    if(P.classList.contains("m")){const dy=p.clientY-sy;const nh=Math.max(120,Math.min(innerHeight-20,innerHeight-oy-dy));P.style.height=nh+"px";}
    else{P.style.left=Math.max(0,Math.min(innerWidth-80,ox+p.clientX-sx))+"px";P.style.top=Math.max(0,Math.min(innerHeight-40,oy+p.clientY-sy))+"px";P.style.right="auto";}
    if(e.cancelable)e.preventDefault();};
  const up=()=>on=false;
  hd.addEventListener("mousedown",down);hd.addEventListener("touchstart",down,{passive:true});
  W.addEventListener("mousemove",move);W.addEventListener("touchmove",move,{passive:false});W.addEventListener("mouseup",up);W.addEventListener("touchend",up);}

/* atualização ao vivo das abas Rede/Console/Info/Variáveis */
window.__klT.push(setInterval(()=>{const t=TABS[S.tab];const nb=nav&&nav.querySelector('[data-t="net"]');if(nb)nb.textContent="Rede ("+S.net.length+")";
  const focused=R.activeElement&&/INPUT|TEXTAREA/.test(R.activeElement.tagName);if(focused)return;
  if(body&&body.querySelector("details[open]"))return;
  if((t.live&&S.tab!=="con")||S.auto)drawBody();},1500));

/* proteção: se o site apagar o painel, recoloca */
window.__klT.push(setInterval(()=>{if(!host.isConnected)(D.body||D.documentElement).appendChild(host);},2000));

shell();draw();
setTimeout(()=>{if(!SRC.ran&&!SRC.run)scanAll();},400);
})();
