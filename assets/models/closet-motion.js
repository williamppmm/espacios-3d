/* Movimientos independientes del clóset, compartidos por terraza y visor detallado. */
window.EspaciosClosetMotion=function({P,R,LD,TD,drawerGroups,S=0.001,onMessage=()=>{}}){
 const movers=[],doors=LD.concat(TD);let message='';
 const tell=msg=>{message=msg;onMessage(msg);window.dispatchEvent(new CustomEvent('espacios-movement-blocked',{detail:msg}));};
 const clear=()=>{if(message){message='';window.dispatchEvent(new Event('espacios-movement-clear'));}};
 const covers=(d,s,x=d.x)=>Math.min(x+d.w,s.x1+10)-Math.max(x,s.x0-10)>1;
 function limits(group,index){let lo=0,hi=P.W-group[index].w;group.forEach((d,j)=>{if(j!==index&&j%2===index%2){if(j<index)lo=Math.max(lo,d.x+d.w);else hi=Math.min(hi,d.x-group[index].w);}});return [lo,hi];}
 function leaf(group,index){const d=group[index],closed=d.x;let prev=0,goal=closed;const u={t:0,target:0,kind:'door',apply(t){t=Math.max(0,Math.min(1,t));const [lo,hi]=limits(group,index);if(prev===0&&t>0)goal=index%2===0?hi:lo;let x=Math.max(lo,Math.min(hi,closed+(goal-closed)*t));if(group===LD&&drawerGroups.some(q=>q.g.position.z>.001&&covers(d,q.sec,x))){u.t=u.target=prev;tell('Cierra primero el cajón que queda detrás de esta hoja.');return;}if(t!==prev&&message.startsWith('Desliza'))clear();d.x=x;d.m.position.x=(x+d.w/2)*S;prev=t;u.t=t;},place(x){goal=x;prev=Math.abs(x-closed)>.1?1:0;d.x=x;d.m.position.x=(x+d.w/2)*S;u.t=u.target=prev;}};d.m.userData.mover=u;d.m.userData.motionId=(group===LD?'baja-':'alta-')+(index+1);d.u=u;movers.push(u);}
 LD.forEach((d,i)=>leaf(LD,i));TD.forEach((d,i)=>leaf(TD,i));
 drawerGroups.forEach((d,index)=>{let prev=0;const u={t:0,target:0,kind:'drawer',apply(t){t=Math.max(0,Math.min(1,t));if(t>prev&&LD.some(x=>covers(x,d.sec))){u.t=u.target=prev;tell('Desliza las hojas para dejar libre este cajón. Puedes usar «Abrir centro».');return;}if(t<prev)clear();d.g.position.z=t*R.drawMax*S;prev=t;u.t=t;}};d.g.userData.mover=u;d.g.userData.motionId='cajon-'+(index+1);d.u=u;movers.push(u);});
 function preset(group,positions){if(group===LD&&drawerGroups.some(d=>d.g.position.z>.001)){tell('Cierra los cajones antes de cambiar la posición de las hojas.');return;}group.forEach((d,i)=>d.u.place(positions[i]));message='';}
 function setOpen(t){clear();t=Math.max(0,Math.min(1,t));const phase=Math.min(1,t/.7),draw=Math.max(0,(t-.7)/.3);drawerGroups.forEach(d=>{if(d.u.t>draw){d.u.apply(draw);d.u.target=d.u.t;}});const low=R.presets['Abrir centro']||R.presets.Cerradas,top=R.tpresets['Abrir izquierda'];LD.forEach((d,i)=>d.u.place(R.presets.Cerradas[i]+(low[i]-R.presets.Cerradas[i])*phase));TD.forEach((d,i)=>d.u.place(R.tpresets.Cerradas[i]+(top[i]-R.tpresets.Cerradas[i])*phase));drawerGroups.forEach(d=>{d.u.apply(draw);d.u.target=d.u.t;});message='';}
 function tick(){for(const u of movers){if(Math.abs(u.target-u.t)>.0001){const t=Math.abs(u.target-u.t)<.004?u.target:u.t+(u.target-u.t)*.18;u.apply(t);}}}
 function setDrawers(t){drawerGroups.forEach(d=>d.u.target=t);message='';}
 setOpen(0);return {movers,tick,setOpen,setDrawers,setLow:n=>preset(LD,R.presets[n]),setTop:n=>preset(TD,R.tpresets[n]),get message(){return message;}};
};
