javascript:(async()=>{
const ID="KALIDADE_PRO_V2";document.getElementById(ID)?.remove();
(window.__klT||[]).forEach(clearInterval);window.__klT=[];

/* CSS e Estilos */
const CSS=`
#${ID}{position:fixed;top:20px;right:20px;width:520px;max-width:95vw;height:85vh;z-index:2147483647;background:#0d1117;color:#e6edf3;border:1px solid #30363d;border-radius:12px;display:flex;flex-direction:column;font:12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,0.8);overflow:hidden}
#${ID} *{box-sizing:border-box}
#${ID} .hdr{background:#161b22;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;cursor:move;border-bottom:1px solid #30363d;user-select:none}
#${ID} .nav{display:flex;background:#161b22;border-bottom:1px solid #30363d;overflow-x:auto}
#${ID} .nav-btn{background:none;border:none;color:#8b949e;padding:10px 14px;cursor:pointer;font-weight:600;font-size:12px;border-bottom:2px solid transparent;white-space:nowrap}
#${ID} .nav-btn.active{color:#58a6ff;border-color:#58a6ff}
#${ID} .btn{background:#21262d;color:#c9d1d9;border:1px solid #30363d;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:11px;font-weight:500;display:inline-flex;align-items:center;gap:4px;transition:0.15s}
#${ID} .btn:hover{background:#30363d;border-color:#8b949e;color:#fff}
#${ID} .btn-primary{background:#238636;border-color:#2ea043;color:#fff}
#${ID} .btn-primary:hover{background:#2ea043}
#${ID} .btn-danger{background:#da3633;border-color:#f85149;color:#fff}
#${ID} .input{width:100%;padding:6px 10px;background:#0d1117;color:#c9d1d9;border:1px solid #30363d;border-radius:6px;font-size:12px}
#${ID} .input:focus{border-color:#58a6ff;outline:none}
#${ID} .card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px;margin-bottom:8px;transition:border-color 0.2s}
#${ID} .card:hover{border-color:#58a6ff44}
#${ID} .tag{font-size:10px;padding:2px 6px;border-radius:10px;font-weight:bold;text-transform:uppercase}
#${ID} .tag-live{background:#23863633;color:#3fb950;border:1px solid #238636}
#${ID} .tag-static{background:#da363333;color:#f85149;border:1px solid #da3633}
#${ID} .tag-type{background:#388bfd22;color:#58a6ff;border:1px solid #388bfd44}
#${ID} .quick-mod{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap}
#${ID} .quick-mod button{background:#0d1117;border:1px solid #30363d;color:#8b949e;padding:3px 6px;font-size:10px;border-radius:4px;cursor:pointer}
#${ID} .quick-mod button:hover{background:#21262d;color:#58a6ff;border-color:#58a6ff}
`;

const stEl=document.createElement("style");stEl.innerHTML=CSS;document.head.appendChild(stEl);

/* Estado */
const S={
  files:[],values:[],tab:"vals",filter:"",typeFilter:"all",
  activeFile:0,frozen:new Map(),objRoot:"window",objPath:[],
  netLogs:[],isMin:false
};

/* Hook de Rede (Fetch e XHR) */
const _fetch=window.fetch;
window.fetch=async(...a)=>{
  const url=typeof a[0]==="string"?a[0]:a[0]?.url||"fetch";
  const item={type:"FETCH",url,time:new Date().toLocaleTimeString(),status:"..."};
  S.netLogs.unshift(item);if(S.netLogs.length>100)S.netLogs.pop();
  try{
    const res=await _fetch(...a);
    item.status=res.status;
    return res;
  }catch(e){item.status="ERR";throw e;}
};
const _xhrOpen=XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open=function(m,u,...rest){
  this.__u=u;return _xhrOpen.call(this,m,u,...rest);
};
const _xhrSend=XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send=function(...a){
  const item={type:"XHR",url:this.__u||"xhr",time:new Date().toLocaleTimeString(),status:"..."};
  S.netLogs.unshift(item);if(S.netLogs.length>100)S.netLogs.pop();
  this.addEventListener("load",()=>item.status=this.status);
  this.addEventListener("error",()=>item.status="ERR");
  return _xhrSend.apply(this,a);
};

/* Elemento Base */
const E=document.createElement("div");E.id=ID;
E.innerHTML=`
<div class="hdr" id="drag">
  <b style="color:#58a6ff;display:flex;align-items:center;gap:6px">⚡ KALIDADE PRO <small style="color:#8b949e;font-size:10px">v2.5</small></b>
  <div style="display:flex;gap:6px">
    <button class="btn" id="btn-min">_</button>
    <button class="btn btn-danger" id="btn-close">✕</button>
  </div>
</div>
<div class="nav">
  <button class="nav-btn active" data-t="vals">Variáveis</button>
  <button class="nav-btn" data-t="obj">Objetos</button>
  <button class="nav-btn" data-t="store">Storage/Cookies</button>
  <button class="nav-btn" data-t="net">Rede (${S.netLogs.length})</button>
  <button class="nav-btn" data-t="editor">Editor</button>
  <button class="nav-btn" data-t="con">Console</button>
</div>
<div id="kl-subbar" style="padding:8px 10px;background:#161b22;border-bottom:1px solid #30363d;display:flex;gap:6px;align-items:center">
  <input class="input" id="kl-q" placeholder="Buscar variáveis, valores, props ou rotas...">
  <div id="kl-type-filters" style="display:flex;gap:4px">
    <button class="btn btn-primary" data-tf="all">Todos</button>
    <button class="btn" data-tf="live">Ao Vivo</button>
    <button class="btn" data-tf="num">123</button>
    <button class="btn" data-tf="bool">True/False</button>
  </div>
</div>
<div id="kl-body" style="flex:1;overflow-y:auto;padding:10px"></div>
<footer style="padding:6px 10px;background:#161b22;border-top:1px solid #30363d;font-size:11px;color:#8b949e;display:flex;justify-content:space-between;align-items:center">
  <span id="kl-msg">Pronto.</span>
  <div style="display:flex;gap:6px">
    <button class="btn" id="btn-rescan">↻ Scan</button>
    <button class="btn" id="btn-unfreeze">🔥 Descongelar Tudo</button>
  </div>
</footer>
`;
document.body.appendChild(E);

/* Helpers */
const $=s=>E.querySelector(s);
const $$=s=>E.querySelectorAll(s);
const log=t=>$("#kl-msg").textContent=t;
const G=(0,eval);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* Arrastar Janela */
let isDragging=false,startX,startY,initialLeft,initialTop;
$("#drag").onmousedown=e=>{
  if(e.target.tagName==="BUTTON")return;
  isDragging=true;startX=e.clientX;startY=e.clientY;
  const rect=E.getBoundingClientRect();
  initialLeft=rect.left;initialTop=rect.top;
  const move=ev=>{
    if(!isDragging)return;
    E.style.left=(initialLeft+ev.clientX-startX)+"px";
    E.style.top=(initialTop+ev.clientY-startY)+"px";
    E.style.right="auto";
  };
  const up=()=>{isDragging=false;window.removeEventListener("mousemove",move);window.removeEventListener("mouseup",up);};
  window.addEventListener("mousemove",move);window.addEventListener("mouseup",up);
};

/* Coletor e Scanner de Código */
async function scan(){
  log("Escaneando scripts...");
  S.files=[];S.values=[];
  const scripts=[...document.querySelectorAll("script")];
  for(let i=0;i<scripts.length;i++){
    const s=scripts[i];
    if(s.src){
      try{
        const r=await fetch(s.src);
        if(r.ok)S.files.push({name:s.src.split("/").pop()||s.src,url:s.src,code:await r.text()});
      }catch(e){S.files.push({name:s.src.split("/").pop()||s.src,url:s.src,code:""});}
    }else if(s.textContent.trim()){
      S.files.push({name:`inline-${i}.js`,url:`inline-${i}`,code:s.textContent});
    }
  }
  const re=/\b(?:const|let|var)\s+([\w$]+)\s*=\s*([^;,]+)|\b([\w$]+)\s*=\s*([^=][^;,]*)/g;
  S.files.forEach((f,fi)=>{
    if(!f.code)return;
    f.code.split("\n").forEach((line,li)=>{
      re.lastIndex=0;let m;
      while((m=re.exec(line))){
        const k=m[1]||m[3],v=(m[2]||m[4]||"").trim();
        if(k&&v&&v.length<150){
          S.values.push({key:k,raw:v,fileIdx:fi,line:li+1});
        }
      }
    });
  });
  log(`Sucesso: ${S.files.length} scripts, ${S.values.length} variáveis extraídas.`);
  render();
}

/* Obter valor em tempo real */
function getLive(k){
  try{return G(`window.${k} !== undefined ? window.${k} : ${k}`)}catch(e){return undefined}
}
function setLive(k,val){
  window.__tmpV=val;
  try{G(`(window.${k} !== undefined ? window.${k} = window.__tmpV : ${k} = window.__tmpV)`)}
  catch(e){G(`window.${k} = window.__tmpV`)}
  finally{delete window.__tmpV}
}

/* Renderizador Principal */
function render(){
  const body=$("#kl-body");
  const q=S.filter.toLowerCase();
  $("#kl-subbar").style.display=["vals","store","net"].includes(S.tab)?"flex":"none";

  if(S.tab==="vals"){
    let list=S.values.filter(x=>{
      const matchTxt=(x.key+" "+x.raw).toLowerCase().includes(q);
      if(!matchTxt)return false;
      const cur=getLive(x.key);
      const isLive=cur!==undefined;
      if(S.typeFilter==="live")return isLive;
      if(S.typeFilter==="num")return typeof cur==="number"||(!isNaN(Number(x.raw))&&x.raw!=="");
      if(S.typeFilter==="bool")return typeof cur==="boolean"||x.raw==="true"||x.raw==="false";
      return true;
    });

    const dedup=new Map();
    list.forEach(item=>{if(!dedup.has(item.key))dedup.set(item.key,item)});
    list=[...dedup.values()].sort((a,b)=>(getLive(b.key)!==undefined)-(getLive(a.key)!==undefined)).slice(0,100);

    body.innerHTML=list.length?list.map(item=>{
      const liveV=getLive(item.key);
      const isLive=liveV!==undefined;
      const val=isLive?liveV:item.raw;
      const isNum=typeof val==="number"||(!isNaN(Number(val))&&val!=="");
      const isBool=typeof val==="boolean"||val==="true"||val==="false";

      return `
      <div class="card" data-key="${esc(item.key)}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <b style="color:#58a6ff;font-size:13px">${esc(item.key)}</b>
            <span class="tag ${isLive?'tag-live':'tag-static'}">${isLive?'Ao Vivo':'Código Estático'}</span>
            <span class="tag tag-type">${typeof val}</span>
          </div>
          <button class="btn btn-danger btn-freeze">${S.frozen.has(item.key)?'🔥 Descongelar':'❄ Congelar'}</button>
        </div>

        <div style="display:flex;gap:6px;margin-top:8px;align-items:center">
          <input class="input v-val" value="${esc(typeof val==='object'?JSON.stringify(val):val)}">
          <button class="btn btn-primary btn-apply">Salvar</button>
          ${!isLive?`<button class="btn btn-force" title="Força a variável ser injetada no escopo global">Forçar Live</button>`:''}
        </div>

        <!-- Botões de Ação Rápida (One-Click) -->
        <div class="quick-mod">
          ${isNum?`
            <button data-mod="add:1">+1</button>
            <button data-mod="add:-1">-1</button>
            <button data-mod="mult:2">x2</button>
            <button data-mod="set:0">0</button>
            <button data-mod="set:999999">999.999</button>
          `:''}
          ${isBool?`
            <button data-mod="toggle">Alternar (True/False)</button>
          `:''}
        </div>
        <div style="margin-top:6px;font-size:10px;color:#8b949e">Original: <code>${esc(item.raw)}</code> (${S.files[item.fileIdx]?.name||'script'})</div>
      </div>
      `;
    }).join(""):`<div style="padding:20px;text-align:center;color:#8b949e">Nenhuma variável encontrada.</div>`;
  }
  else if(S.tab==="obj"){
    let o;try{o=G(S.objRoot);S.objPath.forEach(k=>o=o[k])}catch(e){o=null}
    const pathStr=S.objRoot+(S.objPath.length?`.${S.objPath.join(".")}`:"");
    body.innerHTML=`
      <div style="display:flex;gap:6px;margin-bottom:8px">
        <input class="input" id="kl-obj-root" value="${esc(pathStr)}">
        <button class="btn btn-primary" id="btn-obj-go">Ir</button>
        ${S.objPath.length?`<button class="btn" id="btn-obj-back">↑ Voltar</button>`:''}
      </div>
    `;
    if(!o||typeof o!=="object"){
      body.innerHTML+=`<p style="color:#f85149">Objeto inválido ou inacessível.</p>`;
      return;
    }
    const props=Object.getOwnPropertyNames(o).filter(p=>p.toLowerCase().includes(q)).slice(0,120);
    body.innerHTML+=props.map(p=>{
      let val;try{val=o[p]}catch(e){val="[Erro/Restrito]"}
      const isObj=typeof val==="object"&&val!==null;
      const isFn=typeof val==="function";
      return `
      <div class="card" style="padding:6px 10px" data-p="${esc(p)}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span><b style="color:#58a6ff">${esc(p)}</b>: <small style="color:#8b949e">${isFn?'ƒ()':typeof val}</small></span>
          ${isObj||isFn?`<button class="btn btn-open">Abrir ›</button>`:''}
        </div>
        ${!isObj&&!isFn?`
          <div style="display:flex;gap:4px;margin-top:4px">
            <input class="input obj-val" value="${esc(val)}">
            <button class="btn btn-primary btn-obj-save">Salvar</button>
          </div>
        `:''}
      </div>`;
    }).join("");
  }
  else if(S.tab==="store"){
    body.innerHTML=`
      <div style="display:flex;gap:6px;margin-bottom:10px">
        <button class="btn btn-primary" id="btn-add-store">+ Novo Item</button>
      </div>
    `;
    const renderItems=(type,store)=>{
      let keys=[];try{keys=Object.keys(store)}catch(e){}
      return keys.filter(k=>k.toLowerCase().includes(q)).map(k=>{
        const val=store.getItem?store.getItem(k):store[k];
        return `
        <div class="card" data-stype="${type}" data-k="${esc(k)}">
          <div style="display:flex;justify-content:space-between">
            <b style="color:#58a6ff">${esc(k)}</b>
            <span class="tag tag-type">${type}</span>
          </div>
          <div style="display:flex;gap:4px;margin-top:6px">
            <input class="input st-val" value="${esc(val)}">
            <button class="btn btn-primary btn-st-save">Salvar</button>
            <button class="btn btn-danger btn-st-del">Apagar</button>
          </div>
        </div>`;
      }).join("");
    };
    body.innerHTML+=`<b>localStorage</b>`+(renderItems("local",localStorage)||"<div>Vazio</div>");
    body.innerHTML+=`<br><b>sessionStorage</b>`+(renderItems("session",sessionStorage)||"<div>Vazio</div>");
  }
  else if(S.tab==="net"){
    body.innerHTML=S.netLogs.map(l=>`
      <div class="card" style="padding:6px 10px;font-size:11px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <span class="tag ${l.status==200?'tag-live':'tag-type'}">${l.type} [${l.status}]</span>
          <span style="margin-left:6px;color:#c9d1d9">${esc(l.url.slice(0,60))}</span>
        </div>
        <small style="color:#8b949e">${l.time}</small>
      </div>
    `).join("")||`<div style="text-align:center;padding:20px;color:#8b949e">Aguardando requisições...</div>`;
  }
  else if(S.tab==="editor"){
    body.innerHTML=`
      <select class="input" id="kl-ed-sel">${S.files.map((f,i)=>`<option value="${i}" ${i===S.activeFile?'selected':''}>${esc(f.name)}</option>`).join("")}</select>
      <textarea id="kl-ed-txt" style="width:100%;height:300px;margin-top:8px;background:#0d1117;color:#7ee787;border:1px solid #30363d;border-radius:6px;font:11px monospace;padding:8px">${esc(S.files[S.activeFile]?.code||"")}</textarea>
      <div style="display:flex;gap:6px;margin-top:6px">
        <button class="btn btn-primary" id="btn-ed-run">▶ Executar Código</button>
      </div>
    `;
  }
  else if(S.tab==="con"){
    body.innerHTML=`
      <textarea id="kl-con-in" class="input" style="height:80px;font-family:monospace" placeholder="Ex: window.pontos = 9999; alert('hack')"></textarea>
      <button class="btn btn-primary" style="margin-top:6px" id="btn-con-run">Executar (Ctrl+Enter)</button>
      <pre id="kl-con-out" style="background:#010409;padding:8px;border-radius:6px;border:1px solid #30363d;max-height:200px;overflow:auto;color:#58a6ff;margin-top:8px"></pre>
    `;
  }
}

/* Eventos e Ações */
E.onclick=async e=>{
  const t=e.target;
  if(t.dataset.t){
    $$(".nav-btn").forEach(b=>b.classList.remove("active"));
    t.classList.add("active");S.tab=t.dataset.t;render();
  }
  if(t.dataset.tf){
    $$("#kl-type-filters button").forEach(b=>b.className="btn");
    t.className="btn btn-primary";S.typeFilter=t.dataset.tf;render();
  }
  if(t.id==="btn-close")E.remove();
  if(t.id==="btn-min"){
    S.isMin=!S.isMin;
    $("#kl-body").style.display=S.isMin?"none":"block";
    $("#kl-subbar").style.display=S.isMin?"none":"flex";
    E.style.height=S.isMin?"auto":"85vh";
  }
  if(t.id==="btn-rescan")scan();

  // Variáveis
  const card=t.closest(".card");
  if(card&&card.dataset.key){
    const k=card.dataset.key;
    const inp=card.querySelector(".v-val");
    if(t.classList.contains("btn-apply")){
      let v=inp.value;
      try{v=JSON.parse(v)}catch(e){}
      setLive(k,v);log(`Salvo: ${k} = ${v}`);
    }
    if(t.classList.contains("btn-force")){
      let v=inp.value;
      try{v=JSON.parse(v)}catch(e){}
      window[k]=v;log(`Injetado globalmente: window.${k} = ${v}`);render();
    }
    if(t.classList.contains("btn-freeze")){
      if(S.frozen.has(k)){S.frozen.delete(k);log(`Descongelado: ${k}`);}
      else{
        let v=inp.value;try{v=JSON.parse(v)}catch(e){}
        S.frozen.set(k,v);log(`Congelado: ${k}`);
        if(!window.__klT.length){
          const timer=setInterval(()=>S.frozen.forEach((val,key)=>setLive(key,val)),150);
          window.__klT.push(timer);
        }
      }
      render();
    }
    // Quick Mods
    if(t.dataset.mod){
      let [act,val]=t.dataset.mod.split(":");
      let cur=getLive(k)??Number(inp.value);
      if(act==="add")cur=Number(cur)+Number(val);
      if(act==="mult")cur=Number(cur)*Number(val);
      if(act==="set")cur=Number(val);
      if(act==="toggle")cur=!(inp.value==="true"||cur===true);
      inp.value=cur;setLive(k,cur);log(`Mod: ${k} = ${cur}`);
    }
  }

  // Objetos
  if(t.id==="btn-obj-go"){
    const parts=$("#kl-obj-root").value.split(".");
    S.objRoot=parts[0];S.objPath=parts.slice(1);render();
  }
  if(t.id==="btn-obj-back"){S.objPath.pop();render();}
  if(card&&card.dataset.p){
    const p=card.dataset.p;
    if(t.classList.contains("btn-open")){S.objPath.push(p);render();}
    if(t.classList.contains("btn-obj-save")){
      let o=G(S.objRoot);S.objPath.forEach(x=>o=o[x]);
      let v=card.querySelector(".obj-val").value;
      try{v=JSON.parse(v)}catch(e){}
      o[p]=v;log(`Prop salva: ${p} = ${v}`);
    }
  }

  // Storage
  if(t.id==="btn-add-store"){
    const k=prompt("Nome da chave:");
    if(k){const v=prompt("Valor:")||"";localStorage.setItem(k,v);render();}
  }
  if(card&&card.dataset.stype){
    const st=card.dataset.stype==="local"?localStorage:sessionStorage;
    const k=card.dataset.k;
    if(t.classList.contains("btn-st-save")){st.setItem(k,card.querySelector(".st-val").value);log(`Storage salvo: ${k}`);}
    if(t.classList.contains("btn-st-del")){st.removeItem(k);card.remove();log(`Removido: ${k}`);}
  }

  // Editor e Console
  if(t.id==="btn-ed-run"){
    try{G($("#kl-ed-txt").value);log("Código executado com sucesso!");}catch(err){alert(err.message);}
  }
  if(t.id==="btn-con-run"){
    try{
      const res=await G($("#kl-con-in").value);
      $("#kl-con-out").textContent=typeof res==="object"?JSON.stringify(res,null,2):String(res);
    }catch(err){$("#kl-con-out").textContent="Erro: "+err.message;}
  }
  if(t.id==="btn-unfreeze"){
    S.frozen.clear();log("Todos congelamentos removidos!");render();
  }
};

$("#kl-q").oninput=e=>{S.filter=e.target.value;render();};
scan();
})();