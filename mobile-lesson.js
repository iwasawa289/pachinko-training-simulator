// Definitions checked against SANKYO beginner Q&A and DYNAM's glossary.
// https://www.sankyo-fever.jp/beginner/qa/pachinko/12/
// https://www.sankyo-fever.jp/beginner/qa/pachinko/32/
// https://www.dynam.jp/sp/howto/glossary
(()=>{
 const $=id=>document.getElementById(id);
 const layer=$('lessonLayer'),card=$('lessonCard'),spot=$('lessonSpot'),stage=$('stage');
 const terms=[
  ['ハンドル','玉を打つ強さを調整します。','この台：通常25～40％／右打ち50％以上。',[68,65,30,33]],
  ['釘（くぎ）','玉の向きや落ち方を変えます。','玉は釘に当たりながら下へ流れます。',[10,19,7,31]],
  ['風車（ふうしゃ）','玉が当たると回り、進む向きを変えます。','',[11,49,5.5,8]],
  ['ヘソ（スタート入賞口）','玉が入ると大当りの抽選が進みます。','',[30.5,56.5,9,16]],
  ['保留（ほりゅう）','順番待ちの抽選です。この台は最大4つ。','',[20,46,28,6.5]],
  ['液晶・図柄・リーチ','左右がそろうとリーチ。3つそろうと大当り。','リーチだけでは、まだ当たりではありません。',[17.4,13.2,34.6,31.6]],
  ['PUSHボタン','指示が出たら押して、演出を楽しみます。','押し方や回数で当たりやすさは変わりません。',[27,33,16,7]],
  ['右打ち（みぎうち）','強く打ち、玉を盤面の右側へ流すことです。','この台：50％以上。終了後は25～40％へ。',[53,11,11,64]],
  ['V入賞','「Vを狙え！」の間に、この入口へ玉を入れます。','この台：10秒以内に1個。',[53.5,32.5,7.5,6.5]],
  ['アタッカー','大当り中に開く、出玉を獲得する入口です。','右打ちで玉を入れます。',[46.5,74.5,8.5,11]],
  ['ラウンド（R）','大当り中の一区切りです。この台は5R。','1Rは10個入賞、または20秒で終了。',[46.5,74.5,8.5,11]],
  ['玉掛かり（たまがかり）','盤面の釘などに玉が引っ掛かる状態です。','玉が流れず、入口をふさぐことがあります。',[11,30,6,14]],
  ['玉飛び不良','玉が飛ばない・弱い・飛び方が不安定な状態です。','発射レールの詰まりなどが原因になります。',[3.5,21,7.5,66]],
  ['玉詰まり','台の内部などで玉が詰まり、玉が出ない状態です。','見えている枠は持ち玉表示。内部の詰まりは見えません。',[1.4,78,15,10.5]],
  ['パンク','時間内にV入賞できず、権利を失うことです。','V入賞の必要な台では、画面表示に従って打ちます。',[53.5,32.5,7.5,6.5]],
  ['大当り確率','この台は、1回の抽選で当たる確率が1/30です。','30回で必ず当たる、という意味ではなく、毎回1/30の抽選を受けているという意味です。',[71,12,25,13]]
 ];
 const zoom=document.createElement('div');zoom.id='lessonZoom';zoom.hidden=true;zoom.setAttribute('aria-hidden','true');
 const zoomLabel=document.createElement('div');zoomLabel.id='lessonZoomLabel';zoomLabel.textContent='該当箇所を拡大';
 const zoomView=document.createElement('div');zoomView.id='lessonZoomView';zoom.append(zoomLabel,zoomView);layer.insertBefore(zoom,card);
 let index=-1,returnFocus=null,currentRect=null;
 function renderZoom(){
  if(index<0||layer.hidden||zoom.hidden)return;
  let source=stage;
  if(index===0)source=document.querySelector('.power-ui');
  if(index===13)source=$('ballsOverlay');
  if(index===15)source=$('gameDataPanel');
  const sourceBox=source.getBoundingClientRect(),target=spot.getBoundingClientRect();
  const clone=source.cloneNode(true),originals=[source,...source.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
  originals.forEach((node,i)=>{
   const copy=copies[i],styles=getComputedStyle(node);
   copy.style.cssText=[...styles].map(key=>key+':'+styles.getPropertyValue(key)+' !important').join(';');
   copy.removeAttribute('id');copy.removeAttribute('tabindex');copy.removeAttribute('for');
   if(copy.matches('button,input,a')){copy.setAttribute('tabindex','-1');copy.setAttribute('aria-hidden','true');}
  });
  clone.querySelectorAll('canvas').forEach(node=>node.remove());
  clone.style.setProperty('width',sourceBox.width+'px','important');clone.style.setProperty('height',sourceBox.height+'px','important');
  clone.style.setProperty('position','absolute','important');clone.style.setProperty('margin','0','important');
  clone.style.setProperty('min-width','0','important');clone.style.setProperty('max-height','none','important');
  const width=zoomView.clientWidth,height=zoomView.clientHeight;
  const scale=Math.min((width-24)/target.width,(height-24)/target.height,8);
  clone.style.setProperty('transform-origin','0 0','important');clone.style.setProperty('transform',`scale(${scale})`,'important');
  clone.style.setProperty('left',(width/2-(target.left-sourceBox.left+target.width/2)*scale)+'px','important');
  clone.style.setProperty('top',(height/2-(target.top-sourceBox.top+target.height/2)*scale)+'px','important');
  clone.style.setProperty('pointer-events','none','important');
  zoomView.replaceChildren(clone);
  const frame=document.createElement('div');frame.className='lesson-zoom-frame';
  frame.style.width=(target.width*scale)+'px';frame.style.height=(target.height*scale)+'px';zoomView.append(frame);
  zoomLabel.textContent=terms[index][0]+'：拡大表示';
 }
 new ResizeObserver(()=>{if(!zoom.hidden){positionSpot();renderZoom();}}).observe(card);
 new ResizeObserver(()=>{if(!zoom.hidden){positionSpot();renderZoom();}}).observe(zoomView);
 function positionSpot(){
  if(!currentRect)return;
  const box=stage.getBoundingClientRect(),[x,y,w,h]=currentRect;
  spot.style.left=(box.left+box.width*x/100)+'px';spot.style.top=(box.top+box.height*y/100)+'px';
  spot.style.width=(box.width*w/100)+'px';spot.style.height=(box.height*h/100)+'px';
  if(x>67){const target=document.getElementById('gameDataPanel');const b=target.getBoundingClientRect();spot.style.left=b.left+'px';spot.style.top=b.top+'px';spot.style.width=b.width+'px';spot.style.height=b.height+'px';}
  if(index===0){const b=document.querySelector('.power-ui').getBoundingClientRect();spot.style.left=b.left+'px';spot.style.top=b.top+'px';spot.style.width=b.width+'px';spot.style.height=b.height+'px';}
  if(index===13){const b=document.getElementById('ballsOverlay').getBoundingClientRect();spot.style.left=b.left+'px';spot.style.top=b.top+'px';spot.style.width=b.width+'px';spot.style.height=b.height+'px';}
 }
 window.addEventListener('resize',()=>{positionSpot();renderZoom();});window.addEventListener('scroll',positionSpot,{passive:true});
 function open(){
  returnFocus=document.activeElement;
  if(window.pachinkoGame)window.pachinkoGame.reset();
  stage.classList.add('lesson-open');document.body.classList.add('lesson-open');document.querySelectorAll('button,input,a').forEach(el=>{if(!layer.contains(el)){el.dataset.lessonTab=el.getAttribute('tabindex')??'';el.setAttribute('tabindex','-1');}});
  layer.hidden=false;card.style.left='';card.style.right='';card.style.top='';index=-1;spot.hidden=true;zoom.hidden=true;layer.classList.remove('zoom-active');card.classList.add('choose');
  $('lessonScope').hidden=false;$('lessonScope').textContent='パチンコは機種ごとに設備や機能が違います。このシミュレーションでは基本的な名称や用途を理解し、実営業では機種ごとに理解する必要があります。';$('lessonProgress').textContent='はじめに';$('lessonTitle').textContent='用語説明を受けますか？';$('lessonText').textContent='場所を見ながら、1つずつ確認できます。';$('lessonHint').textContent='受けずに、そのまま遊技もできます。';
  $('lessonChoices').hidden=false;$('lessonActions').hidden=true;$('lessonStart').focus();
 }
 function close(){
  layer.hidden=true;spot.hidden=true;zoom.hidden=true;layer.classList.remove('zoom-active');index=-1;stage.classList.remove('lesson-open');document.body.classList.remove('lesson-open','lesson-control');document.body.classList.remove('lesson-push');
  document.querySelectorAll('[data-lesson-tab]').forEach(el=>{const value=el.dataset.lessonTab;if(value==='')el.removeAttribute('tabindex');else el.setAttribute('tabindex',value);delete el.dataset.lessonTab;});
  (returnFocus&&returnFocus!==document.body?returnFocus:$('startZone')).focus();
 }
 function render(i){
  document.body.classList.toggle('lesson-control',i===0||i===13||i===15);$('lessonScope').hidden=true;index=i;const [title,text,hint,rect]=terms[i];card.style.left=rect[0]>67&&rect[1]<50?'20%':'auto';card.style.right=rect[0]>67&&rect[1]<50?'auto':'2%';card.style.top=rect[0]>67&&rect[1]<50?'53%':'9%';card.classList.remove('choose');$('lessonChoices').hidden=true;$('lessonActions').hidden=false;
  $('lessonProgress').textContent=`${i+1} / ${terms.length}`;$('lessonTitle').textContent=title;$('lessonText').textContent=text;$('lessonHint').textContent=hint;
  spot.hidden=false;currentRect=rect;positionSpot();zoom.hidden=false;layer.classList.add('zoom-active');
  $('lessonBack').disabled=i===0;$('lessonNext').textContent=i===terms.length-1?'理解した・遊技へ':'理解した・次へ';
  document.body.classList.toggle('lesson-push',title==='PUSHボタン');renderZoom();$('lessonNext').focus();
 }
 $('lessonStart').addEventListener('click',()=>render(0));$('lessonSkip').addEventListener('click',close);
 $('lessonBack').addEventListener('click',()=>{if(index>0)render(index-1)});
 $('lessonNext').addEventListener('click',()=>{if(index+1<terms.length)render(index+1);else close()});
 $('lessonExit').addEventListener('click',close);$('lessonOpen').addEventListener('click',open);
 layer.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const buttons=[...card.querySelectorAll('button')].filter(b=>!b.disabled&&!b.closest('[hidden]'));
  const first=buttons[0],last=buttons[buttons.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 });
 open();
})();
