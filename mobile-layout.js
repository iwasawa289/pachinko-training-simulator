(()=>{
 const controls=document.getElementById('mobileControls');
 for(const id of ['gameDataPanel','ballsOverlay','playStatusBox','vTimerBox','startZone','stopPlayBtn'])controls.appendChild(document.getElementById(id));
 controls.appendChild(document.querySelector('.power-ui'));
 document.body.appendChild(document.getElementById('lessonLayer'));
})();
