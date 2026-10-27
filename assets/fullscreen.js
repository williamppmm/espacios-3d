/* Pantalla completa del visor 3D: el lienzo #stage ocupa toda la pantalla (también en iPad) y se cierra con la X o Esc. */
(()=>{'use strict';
const stage=document.getElementById('stage');if(!stage)return;
const css=document.createElement('style');css.textContent=`
.fs-open{position:absolute;top:12px;right:12px;z-index:5;display:inline-flex;align-items:center;gap:6px;min-height:42px;padding:8px 13px;font:12px Arial,Helvetica,sans-serif;color:#253b35;background:#fffefae8;border:1px solid #d3d8ce;border-radius:8px;cursor:pointer;touch-action:manipulation}
.fs-open b{font-size:17px;font-weight:400;line-height:1}
#stage>#sel{top:64px}
.fs-close,.fs-bar{display:none}
#stage.fs-on{position:fixed!important;inset:0;width:100vw;height:100vh;height:100dvh;min-height:0;max-height:none;margin:0;border:0;border-radius:0;z-index:1000}
#stage.fs-on .fs-open{display:none}
#stage.fs-on .fs-close{display:grid;place-items:center;position:absolute;top:max(14px,env(safe-area-inset-top));right:max(14px,env(safe-area-inset-right));z-index:6;width:50px;height:50px;min-height:50px;padding:0;font:30px/1 Arial,Helvetica,sans-serif;color:#fff;background:#253b35;border:0;border-radius:50%;box-shadow:0 2px 12px #0003;cursor:pointer;touch-action:manipulation}
#stage.fs-on .fs-bar:not(:empty){display:flex;flex-wrap:wrap;gap:6px;position:absolute;top:max(14px,env(safe-area-inset-top));left:max(14px,env(safe-area-inset-left));right:84px;z-index:6;pointer-events:none}
.fs-bar button{pointer-events:auto;min-height:44px;padding:9px 15px;font:13px Arial,Helvetica,sans-serif;color:#253b35;background:#fffefaeb;border:1px solid #d3d8ce;border-radius:22px;cursor:pointer;touch-action:manipulation}
.fs-bar button[aria-pressed=true]{color:#fff;background:#253b35;border-color:#253b35}
#stage.fs-on>#sel{top:max(76px,calc(env(safe-area-inset-top) + 62px))}
html.fs-lock,html.fs-lock body{overflow:hidden}`;
document.head.append(css);
const open=document.createElement('button');open.type='button';open.className='fs-open';open.setAttribute('aria-label','Ver en pantalla completa');open.innerHTML='<b>⤢</b>Pantalla completa';
const close=document.createElement('button');close.type='button';close.className='fs-close';close.setAttribute('aria-label','Cerrar pantalla completa');close.textContent='×';
const bar=document.createElement('div');bar.className='fs-bar';bar.id='fs-bar';
stage.append(open,bar,close);
const native=()=>document.fullscreenElement||document.webkitFullscreenElement;
// La capa fija funciona en cualquier navegador; además se pide la pantalla completa nativa para ocultar las barras del navegador cuando se permite.
function set(on){if(on===stage.classList.contains('fs-on'))return;stage.classList.toggle('fs-on',on);document.documentElement.classList.toggle('fs-lock',on);
 try{if(on){const p=(stage.requestFullscreen||stage.webkitRequestFullscreen)?.call(stage);p?.catch?.(()=>{});}else if(native()){const p=(document.exitFullscreen||document.webkitExitFullscreen).call(document);p?.catch?.(()=>{});}}catch(e){}
 window.dispatchEvent(new CustomEvent('espacios-fullscreen',{detail:on}));(on?close:open).focus({preventScroll:true});}
open.onclick=()=>set(true);close.onclick=()=>set(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false);});
for(const ev of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(ev,()=>{if(!native())set(false);});
})();
