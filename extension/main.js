function Wq(){b?.focus();b=null}function jq(q,z){if(q.length===0){return 0}if(q.length<20){for(let J=q.length-1;J>=0;J-=1){let Z=q[J];if(Z.visitTime<z){return Z.visitTime}}}else{let J=q.length-1;let Z=0;let $=0;while(Z<=J){$=Math.floor((Z+J)/2);let W=q[$];if(z<W.visitTime){J=$-1}else if(z>W.visitTime){Z=$+1}else{return-1}}if(J<0){return-1}else{return q[J].visitTime}}return-1}function Xq(q){let z=chrome.runtime.getURL("/_favicon/");z+="?pageUrl="+q+"&size=16";return z}function Bq(q){let z=q.open;let J=q.focusTabs;let Z=q.theme;let $=q.showSearch;let W=false;if(z===m||z===I){N.open=z}else{W=true}if(J!==undefined){N.focusTabs=J;Q.active=J}else{W=true}if(Z===x||Z===a){N.theme=Z}else{W=true}if($!==undefined){N.showSearch=$}else{W=true}if(W){chrome.storage.local.set(N,undefined)}}function o(q){w.BUTTONS.inert=false;V.FORM.inert=false;k.CONTAINER.inert=false;q?.setAttribute("data-css-hidden","");Wq()}async function O(q){if(q.length<1||q.length===1&&q[0].id===E){H=true;G.maxResults=p;if(_===0){k.EMPTY.removeAttribute("data-css-hidden")}else{if(y.children.length>0){let U=k.CONTAINER.lastElementChild;if(U!==null){U.appendChild(y)}}}u=false;w.LOADING.setAttribute("data-css-hidden","");return}let z=0;let J=0;let Z=0;let $=0;let W=null;if(j.length==0){if(q[0].lastVisitTime>=G.endTime){z=G.endTime}else{z=q[0].lastVisitTime;J=j.createStart(z)}}else{z=j.getLastEnd();J=j.getLastStart();if(q[0].id===E){$=1}if(u){u=false;if(c){W=v.createSearch(J);k.CONTAINER.appendChild(W)}else{W=v.create(J);k.CONTAINER.appendChild(W)}}else{W=k.CONTAINER.lastElementChild}if(W===null){throw Error("#m_container.lastElementChild is null")}}let X=0;let B=q[$];let f=0;while($<q.length){B=q[$];if(B.lastVisitTime<J){X=B.lastVisitTime;break}if(B.visitCount!==undefined&&B.visitCount>1){if(D.includes(B.id)){$+=1;continue}D.push(B.id);if(z<B.lastVisitTime){let U;R.url=B.url;try{U=await chrome.history.getVisits(R)}catch(t){console.error(t.message);continue}let Y=jq(U,z);if(Y<0){$+=1;continue}X=Y;if(X<J){break}}else{X=B.lastVisitTime}}else{X=B.lastVisitTime}if(Z<X){Z=X;z=X;J=j.createStart(z)}y.appendChild(S.create(B.url,B.title,B.id,X));f+=1;$+=1}if(j.length==0){j.add(z,J);if(c){W=v.createSearch(J)}else{W=v.create(J)}k.CONTAINER.appendChild(W)}j.addElements(f);_+=f;M+=f;if($<q.length){u=true;D.length=0;G.endTime=j.addFrom(X);E=""}else{G.endTime=X;E=B.id}if(M<g){if(p-M<g){G.maxResults=g}else{G.maxResults=p}W.appendChild(y);return chrome.history.search(G,O)}else{M=0;G.maxResults=p;w.LOADING.setAttribute("data-css-hidden","");W.appendChild(y);k.CONTAINER.onscroll=k.onscroll}}function T(){if(H){if(_<1){k.EMPTY.removeAttribute("data-css-hidden")}return}if(k.CONTAINER.scrollTop>=k.CONTAINER.scrollHeight-k.CONTAINER.clientHeight-50){w.LOADING.setAttribute("data-css-hidden","");chrome.history.search(G,O);k.CONTAINER.onscroll=null}}function r(q){let z=q.target;if(z?.getAttribute("data-action")==="close"){o(q.currentTarget)}}function Vq(q){if(!F.MODAL.hasAttribute("data-css-hidden")){if(q.code===h||q.code===s){o(F.MODAL)}}else if(!A.MODAL.hasAttribute("data-css-hidden")){if(q.code===h||q.code===n){o(A.MODAL)}}else{if(q.ctrlKey||q.shiftKey){return}if(document.activeElement!==V.FORM["text"]&&document.activeElement!==V.FORM["date"]){if(q.code===zq){V.FORM["text"].focus()}else if(q.code===n){A.open()}else if(q.code===s){F.open()}else if(q.code===Jq){w.openClear()}}}}var e=1000*60;var K=1000*60*60*24;var p=30;var g=20;var h="KeyQ";var qq="KeyR";var zq="KeyS";var s="KeyM";var n="KeyK";var Jq="KeyC";var Zq=e*new Date().getTimezoneOffset();var $q=Intl.DateTimeFormat(undefined,{timeStyle:"short"});var i=Intl.DateTimeFormat(undefined,{dateStyle:"full"});var Q={active:false,url:""};var R={url:""};var d={endTime:0,startTime:0};var P={endTime:0,text:""};var G={endTime:0,maxResults:p,startTime:0,text:""};var I="c";var m="n";var x="d";var a="l";var N={focusTabs:false,open:I,theme:x,showSearch:true};var C=undefined;var l=undefined;var c=false;var _=0;var M=0;var H=false;var D=[];var u=false;var E="";var b=null;var j={elements:[],ends:[],starts:[],length:0,createStart(q){return q-(q-Zq)%K},addElements(q){if(j.length>0){const z=j.elements;z[j.length-1]+=q;return true}else{return false}},removeElement(q){if(q<0||j.length<=q){return false}if(j.elements[q]>0){j.elements[q]-=1;return true}else{return false}},getLastEnd(){if(j.length>0){return j.ends[j.length-1]}return-1},getLastStart(){if(j.length>0){return j.starts[j.length-1]}},getStartIndex(q){let z=j.starts;let J=j.length;if(J<20){return z.indexOf(q)}let Z=0;let $=0;let W=0;while(Z<J){$=Math.floor((Z+J)/2);W=z[$];if(q===W){return $}else if(W<q){J=$}else{Z=$+1}}return-1},remove(q){var z=j.length;if(q<0||z<=q){return false}j.ends.copyWithin(q,q+1,z);j.ends.pop();j.starts.copyWithin(q,q+1,z);j.starts.pop();j.elements.copyWithin(q,q+1,z);j.elements.pop();j.length-=1;return true},reset(){j.ends.length=0;j.starts.length=0;j.elements.length=0;j.length=0},add(q,z){j.ends.push(q);j.starts.push(z);j.elements.push(0);j.length+=1;return j.length-1},addFrom(q){let z=j.createStart(q);j.add(z+K,z);return z+K}};var L={MAX_VAL:730,MAX_WEEK_VAL:240,MAX_MONTH_VAL:120,MAX_YEAR_VAL:10,WDAYS_LEN:7,WDAYS_SHORT:["mo","tu","we","th","fr","sa","su"],WDAYS_LONG:["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],MONTH_LEN:12,MONTH_SHORT:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],MONTH_LONG:["January","February","March","April","May","June","July","August","September","October","November","December"],MONTH_DAYS:function(){let q=new Date().getFullYear();let z=28;if(q%400===0||q%100!==0&&q%4===0){z=29}return[31,z,31,30,31,30,31,31,30,31,30,31]}(),checkMonth(q){for(let z=0;z<L.MONTH_LEN;z+=1){if(q.length===3&&q===L.MONTH_SHORT[z]||q===L.MONTH_LONG[z]){return z}}return-1},parseYear(q,z){if(q.length!==4){return-1}let J=Number(q);if(Number.isNaN(J)||!Number.isFinite(J)||J>z||J<z-L.MAX_YEAR_VAL){return-1}return J},parseDatecalc(q){let z=-1;let J=q.indexOf(" ");if(J==-1){J=q.length}else if(J+1>=q.length){return z}let Z=Number(q.slice(0,J));if(Number.isNaN(Z)||!Number.isFinite(Z)||Z<1||L.MAX_VAL<Z){return z}if(J===q.length){z=j.createStart(Date.now())+K-K*Z;return z}let $=q.slice(J+1);if($==="d"||$=="day"||$==="days"){z=j.createStart(Date.now())+K-K*Z}else if($==="w"||$=="week"||$==="weeks"){if(Z>L.MAX_WEEK_VAL){return z}z=j.createStart(Date.now()-K*7*Z)+K}else if($==="m"||$=="month"||$==="months"){if(Z>L.MAX_MONTH_VAL){return z}let W=new Date;W.setMonth(W.getMonth()-Z);z=j.createStart(W.valueOf())+K}else if($==="y"||$=="year"||$==="years"){if(Z>L.MAX_YEAR_VAL){return z}let W=new Date;W.setFullYear(W.getFullYear()-Z);z=j.createStart(W.valueOf())+K}return z},parseDateexpr1(q,z,J,Z,$){let W=J;let X=Z;let B=$;if(q.length<5){return-1}let f=q.indexOf(" ");if(f===-1){return-1}let U=q.slice(0,f);B=Number(U);if(Number.isNaN(B)&&!Number.isFinite(B)&&B<1){return-1}if(q.length-(f+1)<3){return-1}let Y=q.indexOf(" ",f+1);if(Y==-1){Y=q.length}U=q.slice(f+1,Y);X=L.checkMonth(U);if(X===-1||B>L.MONTH_DAYS[X]){return-1}if(Y<q.length){U=q.slice(Y+1);if(U.length===0){return-1}W=L.parseYear(U,J);if(W===-1){return-1}if(J===W&&(X>Z||X===Z&&B>$)){return-1}}else if(J===W&&(X>Z||X===Z&&B>$)){W-=1}z.setDate(B);z.setMonth(X);z.setFullYear(W);return j.createStart(z.valueOf())+K},parseDateexpr2(q,z,J,Z,$){let W=J;let X=Z;let B=$;if(q.length<3){return-1}let f=q.indexOf(" ");if(f===-1){f=q.length}let U=q.slice(0,f);X=L.checkMonth(U);if(X===-1){return-1}if(f===q.length){if(X!==Z){if(X>Z){W-=1}B=L.MONTH_DAYS[X]}}else{let Y=q.indexOf(" ",f+1);if(Y===-1){Y=q.length}U=q.slice(f+1,Y);if(U.length===4){W=L.parseYear(U);if(W===-1){return-1}if(W===J&&X>Z){return-1}B=L.MONTH_DAYS[X]}else{B=Number(U);if(Number.isNaN(B)||!Number.isFinite(B)||B<1||B>L.MONTH_DAYS[X]){return-1}if(Y<q.length){U=q.slice(Y+1);if(U.length===0){return-1}W=L.parseYear(U);if(W===-1){return-1}if(J===W&&(X>Z||X===Z&&B>$)){return-1}}else{if(X>Z||X===Z&&B>$){W-=1}}}}z.setDate(B);z.setMonth(X);z.setFullYear(W);return j.createStart(z.valueOf())+K},parse(q){if(q.length===0){return-1}let z=new Date;let J=z.getDay();let Z=z.getDate();let $=z.getMonth();let W=z.getFullYear();if(q==="y"){return j.createStart(Date.now())}else if(q[0]==="-"){q=q.slice(1);if(q.length===0){return-1}return L.parseDatecalc(q)}else if("1"<=q[0]&&q[0]<="9"){return L.parseDateexpr1(q,z,W,$,Z)}else if(q==="yesterday"){return j.createStart(Date.now())}if(q.length===2){for(let X=0;X<L.WDAYS_LEN;X+=1){if(q===L.WDAYS_SHORT[X]){let B=J-(X+1);if(B<=0){B+=7}return j.createStart(Date.now())-K*(B-1)}}}else if(q.length<10){for(let X=0;X<L.WDAYS_LEN;X+=1){if(q===L.WDAYS_LONG[X]){let B=J-(X+1);if(B<=0){B+=7}return j.createStart(Date.now())-K*(B-1)}}}return L.parseDateexpr2(q,z,W,$,Z)}};var y=document.createDocumentFragment();var v={TEMPLATE:function(){const q=document.getElementById("template_range");if(q===null){throw Error("ERROR: #template_range does not exist")}if(q.content===null||q.content===undefined){throw Error("ERROR: #template_range does not have content")}return q.content}(),TEMPLATE_SEARCH:function(){const q=document.getElementById("template_rangesearch");if(q===null){throw Error("ERROR: #template_rangesearch does not exist")}if(q.content===null||q.content===undefined){throw Error("ERROR: #template_rangesearch does not have content")}return q.content}(),create(q){const z=v.TEMPLATE.cloneNode(true);const J=z?.firstElementChild;J.starttime=q;const Z=i.format(q);const $=J?.firstElementChild?.firstElementChild;$?.insertAdjacentText("beforeend",Z);const W=J?.firstElementChild?.lastElementChild;W?.setAttribute("title",`Remove ${Z} browsing history`);return J},createSearch(q){const z=v.TEMPLATE_SEARCH.cloneNode(true);const J=z?.firstElementChild;J.starttime=q;const Z=i.format(q);const $=J?.firstElementChild?.firstElementChild;$?.insertAdjacentText("beforeend",Z);return J},remove(q,z){const J=j.getStartIndex(z);if(J<0){console.error("ERROR: start time does not found");return}d.startTime=j.starts[J];d.endTime=j.ends[J];let Z=j.elements[J];chrome.history.deleteRange(d);j.remove(J);_-=Z;q.nextElementSibling?.firstElementChild?.lastElementChild?.focus();q.remove()}};var S={TEMPLATE:function(){const q=document.getElementById("template_item");if(q===null){throw Error("ERROR: #template_item does not exist")}if(q.content===null||q.content===undefined){throw Error("ERROR: #template_item does not have content")}return q.content}(),create(q,z,J,Z){const $=S.TEMPLATE.cloneNode(true);const W=$.firstElementChild;W?.setAttribute("href",q);W?.setAttribute("data-id",J);W?.children["img"]?.setAttribute("src",Xq(q));if(z===""){W?.setAttribute("title",q);W?.children["title"]?.insertAdjacentText("beforeend",q)}else{W?.setAttribute("title",z+"\n"+q);W?.children["title"]?.insertAdjacentText("beforeend",z)}W?.children["time"]?.insertAdjacentText("beforeend",$q.format(Z));return $},open(q,z,J){if(z===m===J){chrome.tabs.update(undefined,q,undefined)}else{chrome.tabs.create(q,undefined)}},remove(q,z){const J=q.getAttribute("href");R.url=J;try{chrome.history.deleteUrl(R,undefined)}catch($){console.error($.message)}const Z=j.getStartIndex(z);if(Z<0){console.error("ERROR: the start time does not founded");return}j.removeElement(Z);if(j.elements[Z]<1){const $=q.parentElement;$.nextElementSibling?.firstElementChild?.lastElementChild?.focus();$.remove();j.remove(Z)}else{if(q.nextElementSibling==null){q.parentElement?.nextElementSibling?.firstElementChild?.lastElementChild?.focus()}else{q.nextElementSibling?.focus()}q.remove()}_-=1}};var V={FORM:function(){const q=document.forms.namedItem("search");if(q===null){throw Error("ERROR: forms.search does not exist")}return q}(),ontimeout(){C=undefined;const q=V.FORM["text"].value;if(P.text!==q){P.text=q;G.text=q;G.endTime=P.endTime;k.CONTAINER.replaceChildren();j.reset();D.length=0;_=0;E="";H=false;u=false;k.EMPTY.setAttribute("data-css-hidden","");chrome.history.search(G,O);k.CONTAINER.onscroll=null}else{w.LOADING.setAttribute("data-css-hidden","")}},ondatetimeout(){l=undefined;const q=V.FORM["text"].value;const z=V.FORM["date"];let J=0;if(z.value.length===0){J=j.createStart(Date.now())+K}else{J=L.parse(z.value);if(J===-1){z.setAttribute("data-css-invalid","");w.LOADING.setAttribute("data-css-hidden","");return}}if(P.endTime!==J||P.text!==q){P.endTime=J;G.endTime=J;k.CONTAINER.replaceChildren();j.reset();D.length=0;_=0;E="";H=false;u=false;chrome.history.search(G,O);k.CONTAINER.onscroll=null}else{w.LOADING.setAttribute("data-css-hidden","")}},oninput(){let q=V.FORM["text"];if(q.value.length!==0){c=true;V.FORM["clear-text"].removeAttribute("data-css-hidden")}else{c=false;V.FORM["clear-text"].setAttribute("data-css-hidden","")}if(C!==undefined){clearTimeout(C)}w.LOADING.removeAttribute("data-css-hidden");C=setTimeout(V.ontimeout,500)},ondateinput(){let q=V.FORM["date"];q.removeAttribute("data-css-invalid");if(l!==undefined){clearTimeout(l)}w.LOADING.removeAttribute("data-css-hidden");l=setTimeout(V.ondatetimeout,500)},clear(){if(C!==undefined){clearTimeout(C);C=undefined}let q=V.FORM["text"].value;c=false;V.FORM["text"].value="";if(q.length!==0){V.oninput()}else{V.FORM["clear-text"].setAttribute("data-css-hidden","");w.LOADING.setAttribute("data-css-hidden","")}},keydown(q){const z=q.target;const J=z.getAttribute("name");if(J==="text"){if(q.code===h&&q.ctrlKey){V.clear()}}else if(J==="date"){if(q.code===h&&q.ctrlKey){z.value="";V.ondateinput()}}}};var w={LOADING:function(){const q=document.getElementById("h_loading");if(q===null){throw Error("ERROR: #h_loading does not exist")}return q}(),BUTTONS:function(){const q=document.getElementById("h_buttons");if(q===null){throw Error("ERROR: #h_buttons does not exist")}return q}(),onauxclick(q){let z=q.target;let J=z.getAttribute("name");if(J==="history"){Q.url="about://history";chrome.tabs.create(Q,undefined)}},openActiveTab(q){let z=Q.active;Q.url=q;Q.active=true;chrome.tabs.create(Q,undefined);Q.active=z},onclick(q){let z=q.target;let J=z.getAttribute("name");if(J==="history"){Q.url="about://history";S.open(Q,N.open,q.ctrlKey)}else if(J==="clear"){w.openActiveTab("about://settings/clearBrowserData")}else if(J==="more"){F.open()}else if(J==="keyboard"){A.open()}else if(J==="close"){window.close()}else if(J==="about"){w.openActiveTab("https://github.com/AxelArielSaravia/history-quick-view#history-quick-view")}}};var k={EMPTY:function(){const q=document.getElementById("m_empty");if(q===null){throw Error("ERROR: #m_empty does not exist")}return q}(),CONTAINER:function(){const q=document.getElementById("m_container");if(q===null){throw Error("ERROR: #m_container does not exist")}return q}(),onscroll(){if(H){return}if(k.CONTAINER.scrollTop>=k.CONTAINER.scrollHeight-k.CONTAINER.clientHeight-50){w.LOADING.removeAttribute("data-css-hidden");chrome.history.search(G,O);k.CONTAINER.onscroll=null}},onclick(q){const z=q.target;let J=z.getAttribute("data-type");if(J==="remove"){q.preventDefault();let Z=z.getAttribute("data-for");let $=z?.parentElement;let W=$?.parentElement;let X=W?.starttime;if(X===undefined){console.error("ERROR: starttime prototype doesn't exist");return}if(Z==="item"){S.remove($,X);T()}else if(Z==="date"){v.remove(W,X);T()}}else if(J==="item"){if(!q.shiftKey){q.preventDefault();const Z=z.href;Q.url=Z;S.open(Q,N.open,q.ctrlKey)}}},onauxclick(q){let z=q.target;if(z.getAttribute("data-type")==="item"){q.preventDefault();let J=z?.getAttribute("href");if(J===null||J===undefined){console.error('ERROR: [data-type="item"] does not have "href" attribute');return}Q.url=J;chrome.tabs.create(Q,undefined)}},onkeyup(q){let z=q.target;let J=z.getAttribute("data-type");if(J==="item"&&q.code===qq){if(q.ctrlKey){return}if(q.shiftKey){if(!c){const Z=z.parentElement;const $=Z?.starttime;if($===undefined){console.error("ERROR: .range does not have starttime property")}else{v.remove(Z,$);T()}}}else{const Z=z.parentElement;const $=Z?.starttime;if($===undefined){console.error("ERROR: .range does not have starttime property")}else{S.remove(z,$);T()}}}}};var A={MODAL:function(){const q=document.getElementById("modal_keyboard");if(q===null){throw Error("ERROR: #modal_keyboard does not exist")}return q}(),open(){if(b===null){if(document.activeElement===null||document.activeElement===document.body){b=w.BUTTONS.children["keyboard"]}else{b=document.activeElement}}w.BUTTONS.inert=true;V.FORM.inert=true;k.CONTAINER.inert=true;A.MODAL.removeAttribute("data-css-hidden");A.MODAL.firstElementChild.firstElementChild.lastElementChild.focus()}};var F={MODAL:function(){const q=document.getElementById("modal_more");if(q===null){throw Error("ERROR: #modal_config does not exist")}return q}(),FORM:function(){const q=document.forms.namedItem("more");if(q===null){throw Error("ERRORP: forms.config does not exist")}return q}(),init(q){document.firstElementChild.setAttribute("class",q.theme);if(q.showSearch){V.FORM.removeAttribute("data-css-hidden")}else{V.FORM.setAttribute("data-css-hidden","")}F.FORM["theme"].value=q.theme;F.FORM["open"].value=q.open;F.FORM["focus"].checked=q.focusTabs;F.FORM["showsearch"].checked=q.showSearch},open(){if(b===null){if(document.activeElement===null||document.activeElement===document.body){b=w.BUTTONS.children["more"]}else{b=document.activeElement}}w.BUTTONS.inert=true;V.FORM.inert=true;k.CONTAINER.inert=true;F.MODAL.removeAttribute("data-css-hidden");F.FORM["theme"].focus()},onchange(q){let z=q.target;let J=z.getAttribute("name");let Z=false;if(J==="theme"){if(z.value===x||z.value===a){N.theme=z.value;Z=true}else{z.value=x;if(N.theme!==x){N.theme=x;Z=true}console.error("WARNNING: the theme value was wrong, it will set the default")}document.firstElementChild.setAttribute("class",z.value)}else if(J==="showsearch"){N.showSearch=z.checked;if(z.checked){V.FORM.removeAttribute("data-css-hidden")}else{V.FORM.setAttribute("data-css-hidden","")}Z=true}else if(J==="open"){if(z.value===m||z.value===I){N.open=z.value;Z=true}else{z.value=I;if(N.open!==I){N.open=I;Z=true}console.error("WARNNING: the open value was wrong, it will set the default")}}else if(J==="focus"){N.focusTabs=z.checked;Q.active=N.focusTabs;Z=true}if(Z){chrome.storage.local.set(N,undefined)}}};chrome.storage.local.get(undefined,function(q){Bq(q);F.init(N);G.endTime=j.createStart(Date.now())+K;P.endTime=G.endTime;chrome.history.search(G,O);document.addEventListener("keyup",Vq,false);w.BUTTONS.addEventListener("click",w.onclick,false);w.BUTTONS.addEventListener("auxclick",w.onauxclick,false);V.FORM["text"].addEventListener("input",V.oninput,false);V.FORM["clear-text"].addEventListener("click",V.clear,false);V.FORM["date"].addEventListener("input",V.ondateinput,false);V.FORM.addEventListener("keydown",V.keydown,false);k.CONTAINER.onscroll=k.onscroll;k.CONTAINER.addEventListener("click",k.onclick,false);k.CONTAINER.addEventListener("auxclick",k.onauxclick,false);k.CONTAINER.addEventListener("keyup",k.onkeyup,false);F.MODAL.addEventListener("click",r,false);F.FORM.addEventListener("change",F.onchange,false);A.MODAL.addEventListener("click",r,false)});
