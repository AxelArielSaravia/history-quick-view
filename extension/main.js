var U=function(_){throw Error(_)},d=function(_){return X.href=chrome.runtime.getURL("/_favicon/"),X.searchParams.set("pageUrl",_),X.searchParams.set("size","16"),X.toString()},k=function(_,v){if(W.url=_,W.active=N.focusTabs,N.open==="0"===!v)chrome.tabs.update(f.id,W,void 0);else chrome.tabs.create(W,void 0)},u=function(_){const j=P.templateRange.content.cloneNode(!0).firstElementChild,Y=j.firstElementChild,w=Y.firstElementChild,z=E.format(_);w.textContent=z;const L=Y.lastElementChild;if(G.mode==="d")L.title=`Remove all browsing history form ${z}`,L.setAttribute("data-range",String(_)),L.appendChild(P.templateIconDelete.content.cloneNode(!0));else L.setAttribute("data-display","0");return j},x=function(_,v){var j=P.templateItem.content.cloneNode(!0),Y=j.firstElementChild;Y.href=_.url,Y.title=_.title+"\n"+_.url;var w=Y.children,z=w[0];if(_.url===void 0)U("hitem.url is undefined");z.src=d(_.url);var L=w[1];if(_.title==="")L.textContent=_.url;else L.textContent=_.title;var $=w[2],B=$.firstElementChild;B.setAttribute("data-url",_.url),B.setAttribute("data-range",String(v)),B.appendChild(P.templateIconDelete.content.cloneNode(!0));var y=$.lastElementChild;return y.textContent=b.format(_.lastVisitTime),Y},A=function(_){if(_.length<1||_.length===1&&_[0].id===G.lastItemId){console.info("No more History"),G.historyFinished=!0,P.loading.setAttribute("data-display","0");return}var v,j;if(q.length>0)v=P.container.lastElementChild,P.fragment.appendChild(v),j=q.getIndex(J.start);var Y,w=0;if(_[0].id===G.lastItemId)w=1;while(w<_.length){var z=_[w];if(Y=z.lastVisitTime,Y===void 0)U("hitem.lastVisitTime is undefined");if(J.start>Y)J.update(Y),j=q.set(J.end,J.start),v=u(J.start),P.fragment.appendChild(v);if(j===void 0)U("rangeIndex is undefind");G.lastItemId=z.id,G.totalItems+=1,q.addCount(j);const L=x(z,J.start);v.appendChild(L),w+=1}if(Y!==void 0)Q.endTime=Y,P.container.appendChild(P.fragment);P.loading.setAttribute("data-display","0")},K=function(_){if(A(_),G.totalItems<1){P.noHistory.setAttribute("data-display","1");return}P.noHistory.setAttribute("data-display","0")},F=function(){if(G.totalItems<1){P.noHistory.setAttribute("data-display","1");return}if(!G.historyFinished&&P.container.clientHeight===P.container.scrollHeight)chrome.history.search(Q,K)},I=function(_){var{open:v,focusTabs:j}=_,Y=!1;if(v===void 0)Y=!0;else N.open=v,P.modalConfigOpen.value=v;if(j===void 0)Y=!0;else N.focusTabs=j,P.modalConfigFocus.checked=j;if(Y)chrome.storage.local.set(N,void 0)},p=function(_,v){if(_==="0"){const j=v.getAttribute("data-url"),Y=v.getAttribute("data-range");if(j===null||Y===null)return;const w=v.parentElement.parentElement;V.url=j,chrome.history.deleteUrl(V,void 0);const z=q.getIndex(Number(Y));if(z<0)return;if(q.subtractCount(z),q.count[z]<1)w.parentElement.remove(),q.remove(z);else w.remove();G.totalItems-=1,F()}else if(_==="1"){const j=v.getAttribute("data-range");if(j===null)return;const Y=q.getIndex(Number(j));if(Y<0)return;let w=q.end[Y],z=q.start[Y],L=q.count[Y];G.totalItems-=L,H.endTime=w,H.startTime=z,chrome.history.deleteRange(H),v.parentElement.parentElement.remove(),q.remove(Y),F()}},R=function(_){if(G.historyFinished)return;const v=_.currentTarget;if(v.scrollTop===v.scrollHeight-v.clientHeight)P.loading.setAttribute("data-display","1"),chrome.history.search(Q,A)},T=function(_){Q.text=_.value,Q.endTime=Date.now(),P.loading.setAttribute("data-display","1"),G.reset(),q.reset(),J.reset(),P.container.replaceChildren(),chrome.history.search(Q,K),Z=void 0},C=function(){if(P.inputSearch.value.length===0)P.buttonSearch.setAttribute("data-display","0"),G.mode="d";else P.buttonSearch.setAttribute("data-display","1"),G.mode="s";if(Z!==void 0)clearTimeout(Z);Z=setTimeout(T,500,P.inputSearch),P.loading.setAttribute("data-display","1")},c=function(_){var v=_.target,j=v.getAttribute("data-button");if(j==="0")k("chrome://history",!1);else if(j==="1")W.url="chrome://settings/clearBrowserData",W.active=!0,chrome.tabs.create(W,void 0);else if(j==="2")P.modalConfig?.setAttribute("data-display","1");else if(j==="3")window.close()},h=function(){P.inputSearch.value="",C()},l=function(_){var v=_.target,j=v.getAttribute("data-type");if(j==="2"){const Y=v.getAttribute("data-parent");p(Y,v),_.preventDefault();return}if(j==="0"){if(!_.shiftKey){const Y=v.href;k(Y,_.ctrlKey),_.preventDefault()}}},o=function(_){var v=_.target,j=v.getAttribute("data-type");if(j=="3"||j==="2")P.modalConfig?.setAttribute("data-display","0")},s=function(_){var v=_.currentTarget;N.open=v.value,chrome.storage.local.set(N,void 0)},S=function(_){var v=_.currentTarget;N.focusTabs=v.checked,chrome.storage.local.set(N,void 0)},g=function(_){f=_[0],chrome.history.search(Q,K)},m=function(){if(P.loading=document.getElementById("loading"),P.loading===null)throw Error("DOM.loading is null");if(P.headerButtons=document.getElementById("header_buttons"),P.headerButtons===null)throw Error("DOM.headerButtons is null");if(P.inputSearch=document.getElementById("input_search"),P.inputSearch===null)throw Error("DOM.inputSearch is null");if(P.buttonSearch=document.getElementById("button_search"),P.buttonSearch===null)throw Error("DOM.buttonSearch is null");if(P.noHistory=document.getElementById("no-history"),P.noHistory===null)throw Error("DOM.noHistory is null");if(P.container=document.getElementById("container"),P.container===null)throw Error("DOM.container is null");if(P.modalConfig=document.getElementById("modal_config"),P.modalConfig===null)throw Error("DOM.modalConfig is null");if(P.modalConfigOpen=document.getElementById("modal_config-open"),P.modalConfigOpen===null)throw Error("DOM.modalConfigOpen is null");if(P.modalConfigFocus=document.getElementById("modal_config-focus"),P.modalConfigFocus===null)throw Error("DOM.modalConfigFocus is null");if(P.templateRange=document.getElementById("template_range"),P.templateRange===null)throw Error("DOM.templateRange is null");if(P.templateItem=document.getElementById("template_item"),P.templateItem===null)throw Error("DOM.templateItem is null");if(P.templateIconDelete=document.getElementById("template_icon-delete"),P.templateIconDelete===null)throw Error("DOM.templateIconDelete is null");P.headerButtons.onclick=c,P.inputSearch.oninput=C,P.buttonSearch.onclick=h,P.container.onscroll=R,P.container.onclick=l,P.modalConfig.onclick=o,P.modalConfigOpen.onchange=s,P.modalConfigFocus.onchange=S,chrome.storage.local.get(void 0,I),chrome.tabs.query({active:!0,currentWindow:!0},g)};var b=Intl.DateTimeFormat(void 0,{timeStyle:"short"}),E=Intl.DateTimeFormat(void 0,{dateStyle:"full"}),P={container:null,inputSearch:null,headerButtons:null,buttonSearch:null,noHistory:null,loading:null,modalConfig:null,modalConfigOpen:null,modalConfigFocus:null,templateItem:null,templateRange:null,templateIconDelete:null,fragment:document.createDocumentFragment()},N={focusTabs:!1,open:"0"},G={MIN_SEARCDOM_RESULTS:30,lastItemId:"",totalItems:0,historyFinished:!1,mode:"d",reset(){G.lastItemId="",G.totalItems=0,G.historyFinished=!1}},f=void 0,Q={text:"",maxResults:G.MIN_SEARCDOM_RESULTS,startTime:0,endTime:Date.now()},J={OFFSET:60000*(new Date()).getTimezoneOffset(),start:Q.endTime,end:Q.endTime,update(_){J.end=J.start,J.start=_-(_-J.OFFSET)%86400000},reset(){var _=Date.now();J.end=_,J.start=_}},q={end:[],start:[],count:[],length:0,addCount(_){const v=q.count;if(_<0||v.length<=_)return!1;return v[_]+=1,!0},getIndex(_){var v=q.start,j=v.length;if(j<5)return v.indexOf(_);var Y=0,w=0,z=0;while(Y<j)if(w=Y+Math.floor((j-Y)/2),z=v[w],_===z)return w;else if(z<_)j=w;else Y=w+1;return-1},remove(_){var v=q.length;if(_<0||v<=_)return!1;return q.end.copyWithin(_,_+1,v),q.end.pop(),q.start.copyWithin(_,_+1,v),q.start.pop(),q.count.copyWithin(_,_+1,v),q.count.pop(),q.length-=1,!0},reset(){q.end.length=0,q.start.length=0,q.count.length=0,q.length=0},set(_,v){return q.end.push(_),q.start.push(v),q.count.push(0),q.length+=1,q.length-1},subtractCount(_){const v=q.count;if(_<0||v.length<=_)return!1;if(v[_]>0)v[_]-=1;return!0}},X=new URL("http://t.i"),W={active:!1,url:""},V={url:""},H={endTime:0,startTime:0},Z=void 0;window.addEventListener("DOMContentLoaded",m);