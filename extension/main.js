var c=function(_){throw Error(_)},R=function(_){var{open:N,focusTabs:X,theme:W}=_,j=!1;if(N===void 0)j=!0;else P.open=N,Y.modalConfigOpen.value=N;if(X===void 0)j=!0;else P.focusTabs=X,Y.modalConfigFocus.checked=X;if(W===void 0)j=!0;else P.theme=W,document.firstElementChild?.setAttribute("class",W);if(j)chrome.storage.local.set(P,void 0)},d=function(_){return A.href=chrome.runtime.getURL("/_favicon/"),A.searchParams.set("pageUrl",_),A.searchParams.set("size","16"),A.toString()},b=function(_,N){if(Q.url=_,Q.active=P.focusTabs,P.open==="0"===!N)chrome.tabs.update(v.id,Q,void 0);else chrome.tabs.create(Q,void 0)},E=function(_){var N=Y.templateRange.content.cloneNode(!0),X=N.firstElementChild;X.setAttribute("data-range",String(_));var W=X.firstElementChild,j=W.firstElementChild,z=p.format(_);j.textContent=z;var G=W.lastElementChild;if(B.mode==="d")G.title=`Remove all browsing history form ${z}`,G.appendChild(Y.templateIconDelete.content.cloneNode(!0)),G.setAttribute("data-range",String(_));else G.setAttribute("data-display","0");return X},f=function(_,N,X){var W=Y.templateItem.content.cloneNode(!0),j=W.firstElementChild;j.href=_.url,j.title=_.title+"\n"+_.url;var z=j.children,G=z[0];if(_.url===void 0)c("hitem.url is undefined");G.src=d(_.url);var $=z[1];if(_.title==="")$.textContent=_.url;else $.textContent=_.title;var Z=z[2],U=Z.firstElementChild;U.setAttribute("data-url",_.url),U.setAttribute("data-range",String(X)),U.appendChild(Y.templateIconDelete.content.cloneNode(!0));var k=Z.lastElementChild;return k.textContent=y.format(N),j},V=function(_){if(_.length<1||_.length===1&&_[0].id===B.lastId){B.noMoreContent=!0,Y.loading.setAttribute("data-display","0"),Y.noHistory.setAttribute("data-display","1");return}var N=_[0].lastVisitTime,X=q.createStart(N);q.create(N,X);var W,j=0,z=!1;while(j<_.length){if(W=_[j],W.visitCount!==void 0&&W.visitCount>1||W.typedCount!==void 0&&W.typedCount>0)L.add(W.id);if(W.lastVisitTime<X){z=!0;break}B.total+=1,q.addCount(),Y.fragment.appendChild(f(W,W.lastVisitTime,X)),j+=1}var G=E(X);if(G.appendChild(Y.fragment),Y.container.appendChild(G),z){if(L.reset(),B.lastDOMRangeIsFull=!0,B.itemsCreated+=j,B.lastId="",q.from(W.lastVisitTime),J.endTime=q.getLastEnd(),30-j<=20)J.maxResults=20;else J.maxResults=30;return chrome.history.search(J,F)}else B.lastId=W.id,J.endTime=W.lastVisitTime,Y.loading.setAttribute("data-display","0")};async function F(_){var N=q.getLastStart(),X=q.getLastEnd(),W;if(_.length<1||_.length===1&&_[0].id===B.lastId){if(B.noMoreContent=!0,J.maxResults=30,Y.fragment.children.length>0)if(B.lastDOMRangeIsFull)W=E(N),W.appendChild(Y.fragment),Y.container?.appendChild(W);else Y.container.lastElementChild.appendChild(Y.fragment);B.lastDOMRangeIsFull=!1,Y.loading.setAttribute("data-display","0");return}var j=!1,z=0,G,$=0,Z=0;if(_[0].id===B.lastId)Z=1;while(Z<_.length){if(G=_[Z],G.visitCount!==void 0&&G.visitCount>1||G.typedCount!==void 0&&G.typedCount>0)if(L.has(G.id)){Z+=1;continue}else{if(J.endTime<G.lastVisitTime){var U;w.url=G.url;try{U=await chrome.history.getVisits(w)}catch(k){throw new Error(k.message)}if(z=L.getClosestVisit(U,X),z===0){Z+=1;continue}}else z=G.lastVisitTime;L.add(G.id)}else z=G.lastVisitTime;if(z<N){j=!0;break}B.total+=1,q.addCount(),Y.fragment.appendChild(f(G,z,N)),$+=1,Z+=1}if(B.itemsCreated+=$,j)L.reset(),q.from(z),J.endTime=q.getLastEnd(),B.lastId="";else B.lastId=G.id,J.endTime=z;if(B.itemsCreated<30){if(30-B.itemsCreated<=20)J.maxResults=20;else J.maxResults=30;if(j){if(Y.fragment.children.length>0)if(B.lastDOMRangeIsFull)W=E(N),W.appendChild(Y.fragment),Y.container?.appendChild(W);else Y.container?.lastElementChild?.appendChild(Y.fragment);B.lastDOMRangeIsFull=!0}return chrome.history.search(J,F)}else{if(B.itemsCreated=0,J.maxResults=30,Y.fragment.children.length>0)if(B.lastDOMRangeIsFull)W=E(N),W.appendChild(Y.fragment),Y.container?.appendChild(W);else Y.container?.lastElementChild?.appendChild(Y.fragment);B.lastDOMRangeIsFull=j,Y.loading?.setAttribute("data-display","0"),Y.container.onscroll=H}}var C=function(){if(B.noMoreContent){Y.noHistory.setAttribute("data-display","1");return}else if(Y.container.clientHeight===Y.container.scrollHeight)Y.loading.setAttribute("data-display","1"),chrome.history.search(J,F)},u=function(_,N){if(_==="0"){const X=N.getAttribute("data-url"),W=N.getAttribute("data-range");if(X===null||W===null)return;const j=N.parentElement.parentElement;w.url=X,chrome.history.deleteUrl(w,void 0);const z=q.getIndex(Number(W));if(z<0)return;if(q.subtractCount(z),q.count[z]<1)j.parentElement.remove(),q.remove(z);else j.remove();B.total-=1,C()}else if(_==="1"){const X=N.getAttribute("data-range");if(X===null)return;const W=q.getIndex(Number(X));if(W<0)return;let j=q.end[W],z=q.start[W],G=q.count[W];B.total-=G,x.endTime=j,x.startTime=z,chrome.history.deleteRange(x),N.parentElement.parentElement.remove(),q.remove(W),C()}},l=function(_){K=void 0,Y.loading.setAttribute("data-display","1"),Y.container.replaceChildren(),J.endTime=Date.now(),J.text=_.value,q.reset(),B.reset(),L.reset(),Y.noHistory.setAttribute("data-display","0"),chrome.history.search(J,V)},I=function(){if(Y.inputSearch.value.length===0)Y.buttonSearch.setAttribute("data-display","0"),B.mode="d";else Y.buttonSearch.setAttribute("data-display","1"),B.mode="s";if(K!==void 0)clearTimeout(K);K=setTimeout(l,500,Y.inputSearch),Y.loading.setAttribute("data-display","1")},h=function(_){var N=_.target,X=N.getAttribute("data-button");if(X==="0")b("about://history",_.ctrlKey);else if(X==="1")Q.url="about://settings/clearBrowserData",Q.active=!0,chrome.tabs.create(Q,void 0);else if(X==="2")Y.modalConfig?.setAttribute("data-display","1");else if(X==="3")window.close()},o=function(_){var N=_.target,X=N.getAttribute("data-button");if(X==="0")Q.url="about://history",Q.active=P.focusTabs,chrome.tabs.create(Q,void 0)},S=function(){Y.inputSearch.value="",I()},H=function(_){if(B.noMoreContent)return;const N=_.currentTarget;if(N.scrollTop>=N.scrollHeight-N.clientHeight-50)Y.loading.setAttribute("data-display","1"),Y.container.onscroll=null,chrome.history.search(J,F)},m=function(_){var N=_.target,X=N.getAttribute("data-type");if(X==="0"){_.preventDefault();var W=N.getAttribute("href");Q.url=W,Q.active=P.focusTabs,chrome.tabs.create(Q,void 0)}},g=function(_){var N=_.target,X=N.getAttribute("data-type");if(X==="2"){const W=N.getAttribute("data-set");u(W,N),_.preventDefault();return}if(X==="0"){if(!_.shiftKey){const W=N.href;b(W,_.ctrlKey),_.preventDefault()}}},M=function(_){var N=_.target,X=N.getAttribute("data-type");if(X==="0"){if(_.code==="KeyQ"){var W=N.lastElementChild.firstElementChild;u(X,W)}}},D=function(_){var N=_.target,X=N.getAttribute("data-type");if(X=="3"||X==="2")Y.modalConfig?.setAttribute("data-display","0")},r=function(_){var N=_.currentTarget;P.theme=N.value,document.firstElementChild?.setAttribute("class",N.value),chrome.storage.local.set(P,void 0)},O=function(_){var N=_.currentTarget;P.open=N.value,chrome.storage.local.set(P,void 0)},n=function(_){var N=_.currentTarget;P.focusTabs=N.checked,chrome.storage.local.set(P,void 0)},s=function(){if(Y.loading=document.getElementById("loading"),Y.loading===null)throw Error("DOM.loading is null");if(Y.headerButtons=document.getElementById("header_buttons"),Y.headerButtons===null)throw Error("DOM.headerButtons is null");if(Y.inputSearch=document.getElementById("input_search"),Y.inputSearch===null)throw Error("DOM.inputSearch is null");if(Y.buttonSearch=document.getElementById("button_search"),Y.buttonSearch===null)throw Error("DOM.buttonSearch is null");if(Y.noHistory=document.getElementById("no-history"),Y.noHistory===null)throw Error("DOM.noHistory is null");if(Y.container=document.getElementById("container"),Y.container===null)throw Error("DOM.container is null");if(Y.modalConfig=document.getElementById("modal_config"),Y.modalConfig===null)throw Error("DOM.modalConfig is null");if(Y.modalConfigTheme=document.getElementById("modal_config-theme"),Y.modalConfigTheme===null)throw Error("DOM.modalConfigTheme is null");if(Y.modalConfigOpen=document.getElementById("modal_config-open"),Y.modalConfigOpen===null)throw Error("DOM.modalConfigOpen is null");if(Y.modalConfigFocus=document.getElementById("modal_config-focus"),Y.modalConfigFocus===null)throw Error("DOM.modalConfigFocus is null");if(Y.templateRange=document.getElementById("template_range"),Y.templateRange===null)throw Error("DOM.templateRange is null");if(Y.templateItem=document.getElementById("template_item"),Y.templateItem===null)throw Error("DOM.templateItem is null");if(Y.templateIconDelete=document.getElementById("template_icon-delete"),Y.templateIconDelete===null)throw Error("DOM.templateIconDelete is null");Y.headerButtons.onclick=h,Y.headerButtons.onauxclick=o,Y.inputSearch.oninput=I,Y.buttonSearch.onclick=S,Y.container.onscroll=H,Y.container.onclick=g,Y.container.onauxclick=m,Y.container.onkeydown=M,Y.modalConfig.onclick=D,Y.modalConfigTheme.onchange=r,Y.modalConfigOpen.onchange=O,Y.modalConfigFocus.onchange=n,J.endTime=Date.now(),chrome.storage.local.get(void 0,R),chrome.tabs.query({active:!0,currentWindow:!0},function(_){v=_[0],chrome.history.search(J,V)})};var T=60000*(new Date()).getTimezoneOffset();var y=Intl.DateTimeFormat(void 0,{timeStyle:"short"}),p=Intl.DateTimeFormat(void 0,{dateStyle:"full"}),A=new URL("a:a.a"),Q={active:!1,url:""},w={url:""},x={endTime:0,startTime:0},J={text:"",maxResults:30,startTime:0,endTime:0},v=void 0,K=void 0,Y={container:null,inputSearch:null,headerButtons:null,buttonSearch:null,noHistory:null,loading:null,modalConfig:null,modalConfigTheme:null,modalConfigOpen:null,modalConfigFocus:null,templateItem:null,templateRange:null,templateIconDelete:null,fragment:document.createDocumentFragment()},P={focusTabs:!1,open:"0",theme:"dark"},B={lastId:"",total:0,noMoreContent:!1,lastDOMRangeIsFull:!1,itemsCreated:0,mode:"d",reset(){B.lastId="",B.total=0,B.noMoreContent=!1,B.lastDOMRangeIsFull=!1,B.itemsCreated=0}},L={ids:[],add(_){var N=L.ids.length,X=N-1,W=0,j=0;while(W<=X){j=Math.floor((W+X)/2);var z=L.ids[j];if(_<z)X=j-1;else if(_>z)W=j+1;else return j}if(W===N)L.ids.push(_);else L.ids.length+=1,L.ids.copyWithin(W+1,W,N),L.ids[W]=_;return W},has(_){var N=L.ids.length,X=N-1,W=0,j=0;while(W<=X){j=Math.floor((W+X)/2);var z=L.ids[j];if(_<z)X=j-1;else if(_>z)W=j+1;else return!0}return!1},reset(){L.ids.length=0},getClosestVisit(_,N){var X;if(_.length<6){for(var W=_.length-1;W>=0;W-=1)if(X=_[W],X.visitTime<N)return X.visitTime}else{var j=_.length-1,z=0,G=0;while(z<=j)if(G=Math.floor((z+j)/2),X=_[G],N<X.visitTime)j=G-1;else if(N>X.visitTime)z=G+1;else return 0;if(j<0)return 0;else return _[j].visitTime}return 0}},q={end:[],start:[],count:[],length:0,createStart(_){return _-(_-T)%86400000},addCount(){if(q.length>0){const _=q.count;return _[q.length-1]+=1,!0}else return!1},getLastEnd(){if(q.length>0)return q.end[q.length-1];return-1},getLastStart(){if(q.length>0)return q.start[q.length-1];return-1},getIndex(_){var N=q.start,X=N.length;if(X<11)return N.indexOf(_);var W=0,j=0,z=0;while(W<X)if(j=Math.floor((W+X)/2),z=N[j],_===z)return j;else if(z<_)X=j;else W=j+1;return-1},remove(_){var N=q.length;if(_<0||N<=_)return!1;return q.end.copyWithin(_,_+1,N),q.end.pop(),q.start.copyWithin(_,_+1,N),q.start.pop(),q.count.copyWithin(_,_+1,N),q.count.pop(),q.length-=1,!0},reset(){q.end.length=0,q.start.length=0,q.count.length=0,q.length=0},create(_,N){return q.end.push(_),q.start.push(N),q.count.push(0),q.length+=1,q.length-1},from(_){var N=q.createStart(_);return q.create(N+86400000,N),N+86400000},subtractCount(_){const N=q.count;if(_<0||N.length<=_)return!1;if(N[_]>0)N[_]-=1;return!0}};window.addEventListener("DOMContentLoaded",s);
