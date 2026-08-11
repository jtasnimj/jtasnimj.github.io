(() => {
  'use strict';

  const root = document.querySelector('[data-tool-animation]');
  if (!root) return;

  const canvas = root.querySelector('.tool-animation-canvas');
  const ctx = canvas.getContext('2d');
  const tabs = [...root.querySelectorAll('.tool-tab')];
  const copy = root.querySelector('.tool-copy');
  const kicker = root.querySelector('[data-tool-kicker]');
  const headline = root.querySelector('[data-tool-headline]');
  const phase = root.querySelector('[data-tool-phase]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tools = {
    dynomap: {
      color: '#9b4d3f', kicker: 'Dynomap',
      headline: 'Tables learn their own spatial organization.',
      phase: 'Features move · neighborhoods emerge · attributions return to biology'
    },
    graph: {
      color: '#337f82', kicker: 'Graph2Image',
      headline: 'Large biological networks become inspectable images.',
      phase: 'Topology is encoded · image channels form · node evidence remains visible'
    },
    cell: {
      color: '#b98636', kicker: 'scVision',
      headline: 'Single cells become reusable visual representations.',
      phase: 'Genes are mapped · cells are rendered · a foundation representation is learned'
    }
  };
  let active = 'dynomap';
  let started = performance.now();
  let cycleTimer;

  const rgba = (hex, alpha) => {
    const value = parseInt(hex.slice(1), 16);
    return `rgba(${value >> 16},${(value >> 8) & 255},${value & 255},${alpha})`;
  };
  const line = (x1, y1, x2, y2, color, width = 1) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  };
  const circle = (x, y, radius, fill, stroke = null, width = 1) => {
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  };
  const label = (text, x, y, align = 'left') => {
    ctx.fillStyle = '#728087';
    ctx.font = '600 9px "DM Sans", sans-serif';
    ctx.textAlign = align;
    ctx.fillText(text.toUpperCase(), x, y);
  };
  const bezierPoint = (t, p0, p1, p2, p3) => {
    const u = 1 - t;
    return {
      x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
      y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
    };
  };

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const background = (w, h) => {
    ctx.clearRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w * .68, h * .43, 20, w * .68, h * .43, w * .46);
    glow.addColorStop(0, 'rgba(51,127,130,.07)');
    glow.addColorStop(1, 'rgba(51,127,130,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  };

  const flowParticles = (progress, color, w, h, lanes = 7) => {
    const p0 = {x:w*.27,y:h*.45}, p1 = {x:w*.39,y:h*.27}, p2 = {x:w*.49,y:h*.69}, p3 = {x:w*.59,y:h*.44};
    for (let i = 0; i < lanes; i += 1) {
      const offset = (i - (lanes - 1) / 2) * 7;
      const a = {x:p0.x,y:p0.y+offset}, b = {x:p1.x,y:p1.y+offset*.3};
      const c = {x:p2.x,y:p2.y+offset*.25}, d = {x:p3.x,y:p3.y+offset*.7};
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.bezierCurveTo(b.x,b.y,c.x,c.y,d.x,d.y);
      ctx.strokeStyle = rgba(color,.16); ctx.lineWidth = 1; ctx.stroke();
      for (let k = 0; k < 2; k += 1) {
        const t = (progress + i*.071 + k*.43) % 1;
        const point = bezierPoint(t,a,b,c,d);
        circle(point.x, point.y, k ? 1.8 : 2.8, rgba(color,k ? .55 : .9));
      }
    }
  };

  const drawDynomap = (progress, w, h) => {
    const red = '#9b4d3f', teal = '#337f82', gold = '#b98636', navy = '#17304b';
    label('Unordered table', w*.075, h*.13);
    const ox = w*.075, oy = h*.18, size = Math.min(22, w*.027);
    const colors = ['#ddd8cf','#d7e4df','#e9c6b8','#dec489'];
    for (let r=0;r<6;r+=1) for (let c=0;c<6;c+=1) {
      ctx.fillStyle = colors[(r*7+c*3)%colors.length];
      ctx.globalAlpha = .45 + ((r+c)%3)*.18;
      ctx.fillRect(ox+c*(size+3),oy+r*(size+3),size,size);
    }
    ctx.globalAlpha = 1;
    flowParticles(progress,red,w,h,9);
    label('Learned continuous map',w*.63,h*.13);
    const centers = [
      {x:w*.72,y:h*.29,color:teal},
      {x:w*.84,y:h*.45,color:red},
      {x:w*.73,y:h*.62,color:gold}
    ];
    centers.forEach((center,ci) => {
      const radius = Math.min(w,h)*.135;
      const cloud = ctx.createRadialGradient(center.x,center.y,2,center.x,center.y,radius);
      cloud.addColorStop(0,rgba(center.color,.19)); cloud.addColorStop(1,rgba(center.color,0));
      ctx.fillStyle = cloud; ctx.beginPath(); ctx.arc(center.x,center.y,radius,0,Math.PI*2); ctx.fill();
      const points=[];
      for(let i=0;i<16;i+=1) {
        const angle=i*2.399+ci, rr=radius*(.18+((i*13)%17)/22);
        points.push({x:center.x+Math.cos(angle)*rr,y:center.y+Math.sin(angle)*rr*.72});
      }
      points.forEach((point,i) => {
        if(i>0) line(point.x,point.y,points[(i*5+3)%points.length].x,points[(i*5+3)%points.length].y,rgba(center.color,.28));
      });
      points.forEach((point,i) => circle(point.x,point.y,i%5===0?4.5:2.1,rgba(center.color,.88),'#fffdf9',1));
    });
    line(centers[0].x,centers[0].y,centers[1].x,centers[1].y,rgba(navy,.52),2);
    line(centers[1].x,centers[1].y,centers[2].x,centers[2].y,rgba(navy,.52),2);
  };

  const drawGraph2Image = (progress, w, h) => {
    const teal='#337f82', gold='#b98636', navy='#17304b';
    label('Biological network',w*.065,h*.13);
    const points=[];
    for(let i=0;i<12;i+=1) {
      const angle=i*2.399, rr=34+(i%4)*15;
      points.push({x:w*.17+Math.cos(angle)*rr,y:h*.42+Math.sin(angle)*rr*.82});
    }
    points.forEach((point,i) => {
      line(point.x,point.y,points[(i*5+2)%points.length].x,points[(i*5+2)%points.length].y,rgba(navy,.28));
      if(i%2===0) line(point.x,point.y,points[(i+1)%points.length].x,points[(i+1)%points.length].y,rgba(teal,.42));
    });
    points.forEach((point,i)=>circle(point.x,point.y,i%4===0?4.5:2.7,i%3===0?gold:teal,'#fffdf9',1));
    flowParticles(progress,teal,w,h,8);
    label('Feature · edge · structure channels',w*.63,h*.13);
    for(let layer=2;layer>=0;layer-=1) {
      const x=w*.65+layer*18,y=h*.2-layer*9,ww=w*.27,hh=h*.44;
      ctx.fillStyle=layer===0?'rgba(23,48,75,.94)':`rgba(51,127,130,${.12+layer*.08})`;
      ctx.strokeStyle=layer===0?'rgba(255,255,255,.5)':rgba(teal,.45); ctx.lineWidth=1;
      ctx.beginPath(); ctx.roundRect(x,y,ww,hh,9); ctx.fill(); ctx.stroke();
      if(layer===0) {
        for(let r=0;r<5;r+=1) for(let c=0;c<7;c+=1) {
          const value=(r*11+c*7)%13;
          ctx.fillStyle=value<4?rgba(gold,.75):value>9?rgba(teal,.78):'rgba(255,255,255,.08)';
          ctx.fillRect(x+17+c*(ww-34)/7,y+19+r*(hh-38)/5,(ww-45)/7,(hh-49)/5);
        }
      }
    }
  };

  const drawScVision = (progress, w, h) => {
    const gold='#b98636',teal='#337f82',red='#9b4d3f',navy='#17304b';
    label('Single-cell expression',w*.065,h*.13);
    const baseX=w*.07,baseY=h*.64;
    for(let i=0;i<12;i+=1) {
      const barHeight=28+((i*17)%9)*7;
      ctx.fillStyle=i%4===0?rgba(gold,.82):rgba(navy,.18+.035*(i%5));
      ctx.fillRect(baseX+i*11,baseY-barHeight,7,barHeight);
    }
    for(let i=0;i<34;i+=1) {
      const angle=i*2.399,rr=16+(i%8)*4;
      circle(w*.17+Math.cos(angle)*rr,h*.26+Math.sin(angle)*rr*.6,1.9,[teal,red,gold][i%3]);
    }
    flowParticles(progress,gold,w,h,8);
    label('Reusable cell representation',w*.63,h*.13);
    const x=w*.65,y=h*.18,size=Math.min(w*.265,h*.46);
    ctx.fillStyle='rgba(255,253,249,.94)';ctx.strokeStyle=rgba(navy,.22);ctx.lineWidth=1;
    ctx.beginPath();ctx.roundRect(x,y,size,size,11);ctx.fill();ctx.stroke();
    const grid=7,gap=3,cell=(size-28-gap*(grid-1))/grid;
    for(let r=0;r<grid;r+=1) for(let c=0;c<grid;c+=1) {
      const value=(r*13+c*7)%17;
      ctx.fillStyle=value<4?rgba(gold,.82):value>12?rgba(teal,.76):value===9?rgba(red,.72):rgba(navy,.09);
      ctx.fillRect(x+14+c*(cell+gap),y+14+r*(cell+gap),cell,cell);
    }
    const maskIndex=Math.floor(progress*7)%7;
    ctx.fillStyle=rgba(navy,.85);
    ctx.fillRect(x+14+maskIndex*(cell+gap),y+14+((maskIndex*3)%7)*(cell+gap),cell,cell);
    const ex=x+size+45,ey=y+size*.48;
    for(let i=0;i<42;i+=1) {
      const group=i%3,angle=i*2.399,rr=7+(i%11)*2.5;
      const cx=ex+(group-1)*30,cy=ey+(group===1?34:-10);
      circle(cx+Math.cos(angle)*rr,cy+Math.sin(angle)*rr*.56,1.8,[teal,red,gold][group]);
    }
  };

  const draw = (time) => {
    const box=canvas.getBoundingClientRect(),w=box.width,h=box.height;
    const progress=reduceMotion ? .86 : ((time-started)%5000)/5000;
    background(w,h);
    if(active==='dynomap') drawDynomap(progress,w,h);
    else if(active==='graph') drawGraph2Image(progress,w,h);
    else drawScVision(progress,w,h);
    window.requestAnimationFrame(draw);
  };

  const activate = (name,manual=false) => {
    active=name;started=performance.now();
    const data=tools[name];
    tabs.forEach((tab) => {
      const selected=tab.dataset.tool===name;
      tab.classList.toggle('is-active',selected);
      tab.setAttribute('aria-selected',String(selected));
    });
    copy.style.setProperty('--tool-color',data.color);
    kicker.textContent=data.kicker;headline.textContent=data.headline;phase.textContent=data.phase;
    if(manual && !reduceMotion) schedule();
  };
  const schedule = () => {
    window.clearInterval(cycleTimer);
    cycleTimer=window.setInterval(() => {
      const index=tabs.findIndex((tab)=>tab.dataset.tool===active);
      activate(tabs[(index+1)%tabs.length].dataset.tool);
    },5000);
  };

  tabs.forEach((tab)=>tab.addEventListener('click',()=>activate(tab.dataset.tool,true)));
  window.addEventListener('resize',resize,{passive:true});
  resize();
  if(!reduceMotion) schedule();
  window.requestAnimationFrame(draw);
})();
