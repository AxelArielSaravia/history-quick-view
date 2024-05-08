var focusRelatedTarget=function(){relatedFocusTarget?.focus();relatedFocusTarget=null};var getClosestVisit=function(visits,rangeEnd){if(visits.length===0){return 0}if(visits.length<20){for(let i=visits.length-1;i>=0;i-=1){let visit=visits[i];if(visit.visitTime<rangeEnd){return visit.visitTime}}}else{let lst=visits.length-1;let fst=0;let mid=0;while(fst<=lst){mid=Math.floor((fst+lst)/2);let visit=visits[mid];if(rangeEnd<visit.visitTime){lst=mid-1}else if(rangeEnd>visit.visitTime){fst=mid+1}else{return-1}}if(lst<0){return-1}else{return visits[lst].visitTime}}return-1};var getFavicon=function(src){let url=chrome.runtime.getURL("/_favicon/");url+="?pageUrl="+src+"&size=16";return url};var initStorage=function(items){let open=items.open;let focusTabs=items.focusTabs;let theme=items.theme;let set=false;if(open===STORAGE_OPEN_NEW||open===STORAGE_OPEN_CURRENT){storage.open=open}else{set=true}if(focusTabs!==undefined){storage.focusTabs=focusTabs;TabsProperties.active=focusTabs}else{set=true}if(theme===STORAGE_THEME_DARK||theme===STORAGE_THEME_LIGHT){storage.theme=theme}else{set=true}if(set){chrome.storage.local.set(storage,undefined)}};var createDOMRangeSearch=function(startTime){const fragment=DOMTemplateRangeSearch.content.cloneNode(true);const DOMRangeSearch=fragment?.firstElementChild;DOMRangeSearch?.setAttribute("data-starttime",String(startTime));const dateFormat=DateFormatter.format(startTime);const DOMTitle=DOMRangeSearch?.firstElementChild?.firstElementChild;DOMTitle?.insertAdjacentText("beforeend",dateFormat);return DOMRangeSearch};var createDOMRange=function(startTime){const fragment=DOMTemplateRange.content.cloneNode(true);const DOMRange=fragment?.firstElementChild;DOMRange?.setAttribute("data-starttime",String(startTime));const dateFormat=DateFormatter.format(startTime);const DOMTitle=DOMRange?.firstElementChild?.firstElementChild;DOMTitle?.insertAdjacentText("beforeend",dateFormat);const DOMDelete=DOMRange?.firstElementChild?.lastElementChild;DOMDelete?.setAttribute("title",`Remove ${dateFormat} browsing history`);return DOMRange};var createDOMItem=function(url,title,id,visitTime){const fragment=DOMTemplateItem.content.cloneNode(true);const DOMItem=fragment.firstElementChild;DOMItem?.setAttribute("href",url);DOMItem?.setAttribute("data-id",id);DOMItem?.children["img"]?.setAttribute("src",getFavicon(url));if(title===""){DOMItem?.setAttribute("title",url);DOMItem?.children["title"]?.insertAdjacentText("beforeend",url)}else{DOMItem?.setAttribute("title",title+"\n"+url);DOMItem?.children["title"]?.insertAdjacentText("beforeend",title)}DOMItem?.children["time"]?.insertAdjacentText("beforeend",TimeFormatter.format(visitTime));return fragment};async function searchToDOM(historyItems){if(historyItems.length<1||historyItems.length===1&&historyItems[0].id===lastItemId){noMoreContent=true;SearchQuery.maxResults=MAX_SEARCH_RESULTS;if(totalItems===0){DOMMainEmpty.removeAttribute("data-css-hidden")}else{if(DOMFragment.children.length>0){let DOMRange2=DOMMainContainer.lastElementChild;if(DOMRange2!==null){DOMRange2.appendChild(DOMFragment)}}}lastRangeIsFull=false;DOMHeaderLoading.setAttribute("data-css-hidden","");return}let timeRangeEnd=0;let timeRangeStart=0;let i=0;let DOMRange=null;if(TimeRange.length==0){timeRangeEnd=historyItems[0].lastVisitTime;timeRangeStart=TimeRange.createStart(timeRangeEnd);TimeRange.add(timeRangeEnd,timeRangeStart);if(searchMode){DOMRange=createDOMRangeSearch(timeRangeStart);DOMMainContainer.appendChild(DOMRange)}else{DOMRange=createDOMRange(timeRangeStart);DOMMainContainer.appendChild(DOMRange)}}else{timeRangeEnd=TimeRange.getLastEnd();timeRangeStart=TimeRange.getLastStart();if(historyItems[0].id===lastItemId){i=1}if(lastRangeIsFull){lastRangeIsFull=false;if(searchMode){DOMRange=createDOMRangeSearch(timeRangeStart);DOMMainContainer.appendChild(DOMRange)}else{DOMRange=createDOMRange(timeRangeStart);DOMMainContainer.appendChild(DOMRange)}}else{DOMRange=DOMMainContainer.lastElementChild}if(DOMRange===null){throw Error("#m_container.lastElementChild is null")}}let lastVisitTime=0;let item=historyItems[i];let itemsCreated=0;while(i<historyItems.length){item=historyItems[i];if(item.lastVisitTime<timeRangeStart){lastVisitTime=item.lastVisitTime;break}if(item.visitCount!==undefined&&item.visitCount>1){if(visited.includes(item.id)){i+=1;continue}visited.push(item.id);if(timeRangeEnd<item.lastVisitTime){let visits;UrlDetails.url=item.url;try{visits=await chrome.history.getVisits(UrlDetails)}catch(e){console.error(e.message);continue}let visitTime=getClosestVisit(visits,timeRangeEnd);if(visitTime<0){i+=1;continue}lastVisitTime=visitTime;if(lastVisitTime<timeRangeStart){break}}else{lastVisitTime=item.lastVisitTime}}else{lastVisitTime=item.lastVisitTime}DOMFragment.appendChild(createDOMItem(item.url,item.title,item.id,lastVisitTime));TimeRange.addElement();itemsCreated+=1;i+=1}totalItems+=itemsCreated;itemsFromSearch+=itemsCreated;if(i<historyItems.length){lastRangeIsFull=true;visited.length=0;SearchQuery.endTime=TimeRange.addFrom(lastVisitTime);lastItemId=""}else{SearchQuery.endTime=lastVisitTime;lastItemId=item.id}if(itemsFromSearch<MIN_SEARCH_RESULTS){if(MAX_SEARCH_RESULTS-itemsFromSearch<MIN_SEARCH_RESULTS){SearchQuery.maxResults=MIN_SEARCH_RESULTS}else{SearchQuery.maxResults=MAX_SEARCH_RESULTS}DOMRange.appendChild(DOMFragment);return chrome.history.search(SearchQuery,searchToDOM)}else{itemsFromSearch=0;SearchQuery.maxResults=MAX_SEARCH_RESULTS;DOMHeaderLoading.setAttribute("data-css-hidden","");DOMRange.appendChild(DOMFragment);DOMMainContainer.onscroll=DOMMainContainerOnscroll}}var initDOM=function(s){document.firstElementChild.setAttribute("class",s.theme);DOMFormMore["theme"].value=s.theme;DOMFormMore["open"].value=s.open;DOMFormMore["focus"].checked=s.focusTabs};var openLink=function(tabsProperties,open,ctrl){if(open===STORAGE_OPEN_NEW===ctrl){chrome.tabs.update(undefined,tabsProperties,undefined)}else{chrome.tabs.create(tabsProperties,undefined)}};var removeLink=function(DOMItem,startTime){const url=DOMItem.getAttribute("href");UrlDetails.url=url;try{chrome.history.deleteUrl(UrlDetails,undefined)}catch(e){console.error(e.message)}const i=TimeRange.getStartIndex(startTime);if(i<0){console.error("ERROR: the start time does not founded");return}TimeRange.removeElement(i);if(TimeRange.elements[i]<1){const DOMRange=DOMItem.parentElement;DOMRange.remove();TimeRange.remove(i)}else{DOMItem.remove()}totalItems-=1};var removeRange=function(DOMRange,startTime){const i=TimeRange.getStartIndex(startTime);if(i<0){console.error("ERROR: start time does not found");return}DeleteRange.startTime=TimeRange.starts[i];DeleteRange.endTime=TimeRange.ends[i];let elements=TimeRange.elements[i];chrome.history.deleteRange(DeleteRange);TimeRange.remove(i);totalItems-=elements;DOMRange.remove()};var searchAgain=function(){if(noMoreContent){if(totalItems<1){DOMMainEmpty.removeAttribute("data-css-hidden")}return}if(DOMMainContainer.scrollTop>=DOMMainContainer.scrollHeight-DOMMainContainer.clientHeight-50){DOMHeaderLoading.setAttribute("data-css-hidden","");chrome.history.search(SearchQuery,searchToDOM);DOMMainContainer.onscroll=null}};var openModalMore=function(){DOMModalMore.removeAttribute("data-css-hidden");DOMFormMore["theme"].focus()};var openModalCommand=function(){DOMModalCommand.removeAttribute("data-css-hidden");DOMModalCommand.firstElementChild.firstElementChild.lastElementChild.focus()};var closeModal=function(DOMModal){DOMModal?.setAttribute("data-css-hidden","");focusRelatedTarget();modalopen=false};var DOMOnkeyup=function(e){if(!DOMModalMore.hasAttribute("data-css-hidden")){if(e.key==="q"||e.key==="m"){closeModal(DOMModalMore)}}else if(!DOMModalCommand.hasAttribute("data-css-hidden")){if(e.key==="q"||e.key==="c"){closeModal(DOMModalCommand)}}else{if(e.key==="s"&&!e.ctrlKey){DOMFormSearch["text"].focus()}else if(e.key==="c"&&!searchfocus){openModalCommand()}else if(e.key==="m"&&!searchfocus){openModalMore()}}};var DOMHeaderButtonsOnclick=function(e){let target=e.target;let name=target.getAttribute("name");if(name==="history"){TabsProperties.url="about://history";openLink(TabsProperties,storage.open,e.ctrlKey)}else if(name==="clear"){let temp=TabsProperties.active;TabsProperties.url="about://settings/clearBrowserData";TabsProperties.active=true;chrome.tabs.create(TabsProperties,undefined);TabsProperties.active=temp}else if(name==="more"){openModalMore()}else if(name==="command"){openModalCommand()}else if(name==="close"){window.close()}};var DOMHeaderButtonsOnauxclick=function(e){let target=e.target;let name=target.getAttribute("name");if(name==="history"){TabsProperties.url="about://history";chrome.tabs.create(TabsProperties,undefined)}};var DOMFormSearchTimeout=function(){searchTimeout=undefined;DOMHeaderLoading.setAttribute("data-css-hidden","");DOMMainContainer.replaceChildren();SearchQuery.endTime=Date.now();SearchQuery.text=DOMFormSearch["text"].value;TimeRange.reset();visited.length=0;totalItems=0;lastItemId="";noMoreContent=false;lastRangeIsFull=false;DOMMainEmpty.setAttribute("data-css-hidden","");chrome.history.search(SearchQuery,searchToDOM);DOMMainContainer.onscroll=null};var DOMFormSearchOninput=function(){let target=DOMFormSearch["text"];if(target.value.length!==0){searchMode=true;DOMFormSearch["remove"].removeAttribute("data-css-hidden")}else{searchMode=false;DOMFormSearch["remove"].setAttribute("data-css-hidden","")}if(searchTimeout!==undefined){clearTimeout(searchTimeout)}searchTimeout=setTimeout(DOMFormSearchTimeout,500);DOMHeaderLoading.removeAttribute("data-css-hidden")};var DOMFormSearchOnclick=function(){DOMFormSearch["text"].value="";DOMFormSearchOninput()};var DOMMainContainerOnscroll=function(){if(noMoreContent){return}if(DOMMainContainer.scrollTop>=DOMMainContainer.scrollHeight-DOMMainContainer.clientHeight-50){DOMHeaderLoading.removeAttribute("data-css-hidden");chrome.history.search(SearchQuery,searchToDOM);DOMMainContainer.onscroll=null}};var DOMMainContainerOnclick=function(e){const target=e.target;let type=target.getAttribute("data-type");if(type==="remove"){e.preventDefault();let datafor=target.getAttribute("data-for");let DOMParent=target?.parentElement;let DOMRange=DOMParent?.parentElement;let startTime=DOMRange?.getAttribute("data-starttime");if(startTime==null){console.error("ERROR: data-starttime attribute doesn't exist");return}if(datafor==="item"){removeLink(DOMParent,Number(startTime));searchAgain()}else if(datafor==="date"){removeRange(DOMRange,Number(startTime));searchAgain()}}else if(type==="item"){if(!e.shiftKey){e.preventDefault();const url=target.href;TabsProperties.url=url;openLink(TabsProperties,storage.open,e.ctrlKey)}}};var DOMMainContainerOnauxclick=function(e){let target=e.target;if(target.getAttribute("data-type")==="item"){e.preventDefault();let href=target?.getAttribute("href");if(href===null||href===undefined){console.error('ERROR: [data-type="item"] does not have "href" attribute');return}TabsProperties.url=href;chrome.tabs.create(TabsProperties,undefined)}};var DOMMainContainerOnkeyup=function(e){let target=e.target;let type=target.getAttribute("data-type");if(type==="item"){if(e.key==="r"){const DOMRange=target.parentElement;const startTime=DOMRange?.getAttribute("data-starttime");if(startTime===null||startTime===undefined){console.error('ERROR: .range does not have "data-startitme" attribute')}else{removeLink(target,Number(startTime));searchAgain()}}else if(e.key==="w"&&!searchMode){const DOMRange=target.parentElement;const startTime=DOMRange?.getAttribute("data-starttime");if(startTime===null||startTime===undefined){console.error('ERROR: .range does not have "data-startitme" attribute')}else{removeRange(DOMRange,Number(startTime));searchAgain()}}}};var DOMModalOnclick=function(e){let target=e.target;if(target?.getAttribute("data-action")==="close"){closeModal(e.currentTarget)}};var DOMFormMoreOnchange=function(e){let target=e.target;let name=target.getAttribute("name");let storageChange=false;if(name==="theme"){if(target.value===STORAGE_THEME_DARK||target.value===STORAGE_THEME_LIGHT){storage.theme=target.value;document.firstElementChild.setAttribute("class",target.value);storageChange=true}else{target.value=STORAGE_THEME_DARK;document.firstElementChild.setAttribute("class",STORAGE_THEME_DARK);if(storage.theme!==STORAGE_THEME_DARK){storage.theme=STORAGE_THEME_DARK;storageChange=true}console.error("WARNNING: the theme value was wrong, it will set the default")}}else if(name==="open"){if(target.value===STORAGE_OPEN_NEW||target.value===STORAGE_OPEN_CURRENT){storage.open=target.value;storageChange=true}else{target.value=STORAGE_OPEN_CURRENT;if(storage.open!==STORAGE_OPEN_CURRENT){storage.open=STORAGE_OPEN_CURRENT;storageChange=true}console.error("WARNNING: the open value was wrong, it will set the default")}}else if(name==="focus"){storage.focusTabs=target.checked;TabsProperties.active=storage.focusTabs;storageChange=true}if(storageChange){chrome.storage.local.set(storage,undefined)}};var SECOND=1000*60;var DAY=1000*60*60*24;var MAX_SEARCH_RESULTS=30;var MIN_SEARCH_RESULTS=20;var TIME_OFFSET=SECOND*new Date().getTimezoneOffset();var TimeFormatter=Intl.DateTimeFormat(undefined,{timeStyle:"short"});var DateFormatter=Intl.DateTimeFormat(undefined,{dateStyle:"full"});var TabsProperties={active:false,url:""};var UrlDetails={url:""};var DeleteRange={endTime:0,startTime:0};var SearchQuery={endTime:0,maxResults:MAX_SEARCH_RESULTS,startTime:0,text:""};var STORAGE_OPEN_CURRENT="c";var STORAGE_OPEN_NEW="n";var STORAGE_THEME_DARK="d";var STORAGE_THEME_LIGHT="l";var storage={focusTabs:false,open:STORAGE_OPEN_CURRENT,theme:STORAGE_THEME_DARK};var searchTimeout=undefined;var searchMode=false;var totalItems=0;var itemsFromSearch=0;var noMoreContent=false;var visited=[];var lastRangeIsFull=false;var lastItemId="";var relatedFocusTarget=null;var modalopen=false;var searchfocus=false;var TimeRange={elements:[],ends:[],starts:[],length:0,createStart(ms){return ms-(ms-TIME_OFFSET)%DAY},addElement(){if(TimeRange.length>0){const elements=TimeRange.elements;elements[TimeRange.length-1]+=1;return true}else{return false}},removeElement(i){if(i<0||TimeRange.length<=i){return false}if(TimeRange.elements[i]>0){TimeRange.elements[i]-=1;return true}else{return false}},getLastEnd(){if(TimeRange.length>0){return TimeRange.ends[TimeRange.length-1]}return-1},getLastStart(){if(TimeRange.length>0){return TimeRange.starts[TimeRange.length-1]}},getStartIndex(start){let startRange=TimeRange.starts;let lst=TimeRange.length;if(lst<20){return startRange.indexOf(start)}let fst=0;let mid=0;let el=0;while(fst<lst){mid=Math.floor((fst+lst)/2);el=startRange[mid];if(start===el){return mid}else if(el<start){lst=mid}else{fst=mid+1}}return-1},remove(i){var len=TimeRange.length;if(i<0||len<=i){return false}TimeRange.ends.copyWithin(i,i+1,len);TimeRange.ends.pop();TimeRange.starts.copyWithin(i,i+1,len);TimeRange.starts.pop();TimeRange.elements.copyWithin(i,i+1,len);TimeRange.elements.pop();TimeRange.length-=1;return true},reset(){TimeRange.ends.length=0;TimeRange.starts.length=0;TimeRange.elements.length=0;TimeRange.length=0},add(end,start){TimeRange.ends.push(end);TimeRange.starts.push(start);TimeRange.elements.push(0);TimeRange.length+=1;return TimeRange.length-1},addFrom(ms){let start=TimeRange.createStart(ms);TimeRange.add(start+DAY,start);return start+DAY}};var DOMFragment=document.createDocumentFragment();var DOMTemplateRangeSearch=document.getElementById("template_rangesearch");if(DOMTemplateRangeSearch===null){throw Error("ERROR: #template_rangesearch does not exist")}var DOMTemplateRange=document.getElementById("template_range");if(DOMTemplateRange===null){throw Error("ERROR: #template_range does not exist")}var DOMTemplateItem=document.getElementById("template_item");if(DOMTemplateItem===null){throw Error("ERROR: #template_item does not exist")}var DOMHeaderLoading=document.getElementById("h_loading");if(DOMHeaderLoading===null){throw Error("ERROR: #h_loading does not exist")}var DOMHeaderButtons=document.getElementById("h_buttons");if(DOMHeaderButtons===null){throw Error("ERROR: #h_buttons does not exist")}var DOMFormSearch=document.forms.namedItem("search");if(DOMFormSearch===null){throw Error("ERROR: forms.search does not exist")}var DOMMainEmpty=document.getElementById("m_empty");if(DOMMainEmpty===null){throw Error("ERROR: #m_empty does not exist")}var DOMMainContainer=document.getElementById("m_container");if(DOMMainContainer===null){throw Error("ERROR: #m_container does not exist")}var DOMModalMore=document.getElementById("modal_more");if(DOMModalMore===null){throw Error("ERROR: #modal_config does not exist")}var DOMFormMore=document.forms.namedItem("more");if(DOMFormMore===null){throw Error("ERRORP: forms.config does not exist")}var DOMModalCommand=document.getElementById("modal_command");if(DOMModalCommand===null){throw Error("ERROR: #modal_command does not exist")}(function main(){chrome.storage.local.get(undefined,function(items){initStorage(items);initDOM(storage);SearchQuery.endTime=Date.now();chrome.history.search(SearchQuery,searchToDOM);document.addEventListener("keyup",DOMOnkeyup,true);DOMHeaderButtons.addEventListener("click",DOMHeaderButtonsOnclick,false);DOMHeaderButtons.addEventListener("auxclick",DOMHeaderButtonsOnauxclick,false);DOMFormSearch["text"].addEventListener("input",DOMFormSearchOninput,false);DOMFormSearch["remove"].addEventListener("click",DOMFormSearchOnclick,false);DOMFormSearch["text"].addEventListener("focus",function(e){relatedFocusTarget=e.relatedTarget;searchfocus=true},false);DOMFormSearch["text"].addEventListener("focusout",function(){searchfocus=false},false);DOMFormSearch.addEventListener("keydown",function(e){if(e.ctrlKey&&e.key==="s"){e.preventDefault();focusRelatedTarget()}});DOMMainContainer.onscroll=DOMMainContainerOnscroll;DOMMainContainer.addEventListener("click",DOMMainContainerOnclick,false);DOMMainContainer.addEventListener("auxclick",DOMMainContainerOnauxclick,false);DOMMainContainer.addEventListener("keyup",DOMMainContainerOnkeyup,false);DOMModalMore.addEventListener("click",DOMModalOnclick,false);DOMFormMore.addEventListener("change",DOMFormMoreOnchange,false);DOMFormMore["theme"].addEventListener("focus",function(e){if(modalopen){return}modalopen=true;if(e.relatedTarget!==null){relatedFocusTarget=e.relatedTarget}else{relatedFocusTarget=DOMHeaderButtons.children["more"]}},false);DOMModalCommand.addEventListener("click",DOMModalOnclick,false);DOMModalCommand.querySelector("button").addEventListener("focus",function(e){if(modalopen){return}modalopen=true;if(e.relatedTarget!==null){relatedFocusTarget=e.relatedTarget}else{relatedFocusTarget=DOMHeaderButtons.children["command"]}},false)})})();
