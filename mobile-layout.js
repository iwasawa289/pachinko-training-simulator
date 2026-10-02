(()=>{
 const controls=document.getElementById('mobileControls');
 for(const id of ['gameDataPanel','ballsOverlay','playStatusBox','vTimerBox','startZone','stopPlayBtn'])controls.appendChild(document.getElementById(id));
 controls.appendChild(document.querySelector('.power-ui'));
 document.body.appendChild(document.getElementById('lessonLayer'));
})();
(()=>{
 const viewport=document.querySelector('.machine-viewport'),wrap=document.querySelector('.wrap'),nav=document.querySelector('.love-nav'),controls=document.getElementById('mobileControls');
 function fit(){
  const css=getComputedStyle(wrap),height=window.visualViewport?window.visualViewport.height:window.innerHeight;
  wrap.style.height=height+'px';
  const padY=parseFloat(css.paddingTop)+parseFloat(css.paddingBottom),padX=parseFloat(css.paddingLeft)+parseFloat(css.paddingRight),gap=parseFloat(css.gap)||0;
  const landscape=matchMedia('(orientation:landscape) and (max-height:600px)').matches;
  const availableHeight=Math.max(0,height-padY-nav.getBoundingClientRect().height-(landscape?gap:controls.getBoundingClientRect().height+gap*2));
  const availableWidth=wrap.clientWidth-padX-(landscape?controls.getBoundingClientRect().width+gap:0);
  const ratio=1.005;
  const width=Math.max(0,Math.min(availableWidth,availableHeight*ratio));
  viewport.style.width=width+'px';viewport.style.height=(width/ratio)+'px';
 }
 let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;fit()})}
 window.addEventListener('resize',schedule);if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule);
 new ResizeObserver(schedule).observe(controls);new ResizeObserver(schedule).observe(nav);fit();
})();
