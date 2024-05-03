"use strict";
//@ts-check

const VERSION = "0.3.1";

const SECOND = 1000 * 60;
const DAY = 1000 * 60 * 60 * 24;

const MAX_SEARCH_RESULTS = 30;
const MIN_SEARCH_RESULTS = 20;

const TIME_OFFSET = SECOND * (new Date()).getTimezoneOffset();

const TimeFormatter = Intl.DateTimeFormat(undefined, {timeStyle: "short"});
const DateFormatter = Intl.DateTimeFormat(undefined, {dateStyle: "full"});

const TabsProperties = {
    active: false,
    url: ""
};

const UrlDetails = {
    url: ""
};

const DeleteRange = {
    endTime: 0,
    startTime: 0
};

const SearchQuery = {
    endTime: 0,
    maxResults: MAX_SEARCH_RESULTS,
    startTime: 0,
    text: ""
};

const STORAGE_OPEN_CURRENT = "c";
const STORAGE_OPEN_NEW = "n";
const STORAGE_THEME_DARK = "d";
const STORAGE_THEME_LIGHT = "l";
const storage = {
    focusTabs: false,
    open: STORAGE_OPEN_CURRENT,
    theme: STORAGE_THEME_DARK
};
let storageChange = false;

//Global Variables

/**@type{undefined | number}*/
let searchTimeout = undefined;
let searchMode = false;
let totalItems = 0;
let itemsFromSearch = 0;
let noMoreContent = false;
let visited = [];
let lastRangeIsFull = false;
let lastItemId = "";

const TimeRange = {
    //DATA
    /**@type{Array<number>}*/
    elements: [],
    /**@type{Array<number>}*/
    ends: [],
    /**@type{Array<number>}*/
    starts: [],
    length: 0,

    //METHODS
    /**@type{(ms: number) => number}*/
    createStart(ms) {
        return ms - ((ms - TIME_OFFSET) % DAY);
    },
    /**@type{() => boolean}*/
    addElement() {
        if (TimeRange.length > 0) {
            const elements = TimeRange.elements;
            elements[TimeRange.length - 1] += 1;
            return true;
        } else {
            return false;
        }
    },
    /**@type{(i: number) => boolean}*/
    removeElement(i) {
        if (i < 0 || TimeRange.length <= i) {
            return false;
        }
        if (TimeRange.elements[i] > 0) {
            TimeRange.elements[i] -= 1;
            return true;
        } else {
            return false;
        }
    },
    /**@type{() => number}*/
    getLastEnd() {
        if (TimeRange.length > 0) {
            return TimeRange.ends[TimeRange.length - 1];
        }
        return -1;
    },
    /**@type{() => number}*/
    getLastStart() {
        if (TimeRange.length > 0) {
            return TimeRange.starts[TimeRange.length - 1];
        }
    },
    /**@type{(start: number) => number}*/
    getStartIndex(start) {
        let startRange = TimeRange.starts;
        let lst = TimeRange.length;
        if (lst < 20) {
            return startRange.indexOf(start);
        }
        let fst = 0;
        let mid = 0;
        let el = 0;
        while (fst < lst) {
            mid = Math.floor((fst + lst) / 2);
            el = startRange[mid];
            if (start === el) {
                return mid;
            } else if (el < start) {
                lst = mid;
            } else {
                fst = mid + 1;
            }
        }
        return -1;
    },
    /**@type{(i: number) => boolean}*/
    remove(i) {
        var len = TimeRange.length;
        if (i < 0 || len <= i) {
            return false;
        }
        TimeRange.ends.copyWithin(i, i + 1, len);
        TimeRange.ends.pop();
        TimeRange.starts.copyWithin(i, i + 1, len);
        TimeRange.starts.pop();
        TimeRange.elements.copyWithin(i, i + 1, len);
        TimeRange.elements.pop();
        TimeRange.length -= 1;
        return true;
    },
    /**@type{() => undefined}*/
    reset() {
        TimeRange.ends.length = 0;
        TimeRange.starts.length = 0;
        TimeRange.elements.length = 0;
        TimeRange.length = 0;
    },
    /**@type{(end: number, start: number) => number}*/
    add(end, start) {
        TimeRange.ends.push(end);
        TimeRange.starts.push(start);
        TimeRange.elements.push(0);
        TimeRange.length += 1;
        return TimeRange.length - 1;
    },
    /**
     * @return the end time range value
     * @type{(ms: number) => number}*/
    addFrom(ms) {
        let start = TimeRange.createStart(ms);
        TimeRange.add(start + DAY, start);
        return start + DAY;
    }
};

//DOM Constants

const DOMFragment = document.createDocumentFragment();
const DOMTemplateRangeSearch = document.getElementById("template_rangesearch");
if (DOMTemplateRangeSearch === null) {
    throw Error("ERROR: #template_rangesearch does not exist");
}
const DOMTemplateRange = document.getElementById("template_range");
if (DOMTemplateRange === null) {
    throw Error("ERROR: #template_range does not exist");
}
const DOMTemplateItem = document.getElementById("template_item");
if (DOMTemplateItem === null) {
    throw Error("ERROR: #template_item does not exist");
}
const DOMHeaderLoading = document.getElementById("h_loading");
if (DOMHeaderLoading === null) {
    throw Error("ERROR: #h_loading does not exist");
}
const DOMHeaderButtons = document.getElementById("h_buttons");
if (DOMHeaderButtons === null) {
    throw Error("ERROR: #h_buttons does not exist");
}
const DOMFormSearch = document.forms.namedItem("search");
if (DOMFormSearch === null) {
    throw Error("ERROR: forms.search does not exist");
}
const DOMMainEmpty = document.getElementById("m_empty");
if (DOMMainEmpty === null) {
    throw Error("ERROR: #m_empty does not exist");
}
const DOMMainContainer = document.getElementById("m_container");
if (DOMMainContainer === null) {
    throw Error("ERROR: #m_container does not exist");
}
const DOMModal = document.getElementById("modal");
if (DOMModal === null) {
    throw Error("ERROR: #modal does not exist");
}
const DOMFormConfig = document.forms.namedItem("config");
if (DOMFormConfig === null) {
    throw Error("ERRORP: forms.config does not exist")
}
/**@type{(
    visits: Array<chrome.history.VisitItem>,
    rangeEnd: number
) => number}*/
function getClosestVisit(visits, rangeEnd) {
    if (visits.length === 0) {
        return 0;
    }
    if (visits.length < 20) {
        for (let i = visits.length - 1; i >= 0; i -= 1) {
            let visit = visits[i];
            if (visit.visitTime < rangeEnd) {
                return visit.visitTime;
            }
        }
    } else {
        let lst = visits.length - 1;
        let fst = 0;
        let mid = 0;
        while (fst <= lst) {
            mid = Math.floor((fst + lst) / 2);
            let visit = visits[mid];
            if (rangeEnd < visit.visitTime) {
                lst = mid - 1;
            } else if (rangeEnd > visit.visitTime) {
                fst = mid + 1;
            } else {
                return -1;
            }
        }
        if (lst < 0) {
            return -1;
        } else {
            return visits[lst].visitTime;
        }
    }
    return -1;
}

/**
@type{(src: string) => string}*/
function getFavicon(src) {
    let url = chrome.runtime.getURL("/_favicon/");
    url += "?pageUrl="+src+"&size=16";
    return url;
}

/**
@type{(items: typeof storage) => undefined}*/
function initStorage(items) {
    let open = items.open;
    let focusTabs = items.focusTabs;
    let theme = items.theme
    let set = false;
    if (open === STORAGE_OPEN_NEW || open === STORAGE_OPEN_CURRENT) {
        storage.open = open;
    } else {
        set = true;
    }
    if (focusTabs !== undefined) {
        storage.focusTabs = focusTabs;
        TabsProperties.active = focusTabs;
    } else {
        set = true;
    }
    if (theme === STORAGE_THEME_DARK || theme === STORAGE_THEME_LIGHT) {
        storage.theme = theme;
    } else {
        set = true;
    }
    if (set) {
        chrome.storage.local.set(storage, undefined);
    }
}

/**
@type{(startTime: number) => HTMLElement}*/
function createDOMRangeSearch(startTime) {
    const fragment = DOMTemplateRangeSearch.content.cloneNode(true);
    const DOMRangeSearch = fragment?.firstElementChild;
    DOMRangeSearch?.setAttribute("data-starttime", String(startTime));

    const dateFormat = DateFormatter.format(startTime);
    const DOMTitle = DOMRangeSearch?.firstElementChild?.firstElementChild;
    DOMTitle?.insertAdjacentText("beforeend", dateFormat);
    return DOMRangeSearch;
}

/**
@type{(startTime: number) => HTMLElement}*/
function createDOMRange(startTime) {
    const fragment = DOMTemplateRange.content.cloneNode(true);
    const DOMRange = fragment?.firstElementChild;
    DOMRange?.setAttribute("data-starttime", String(startTime));

    const dateFormat = DateFormatter.format(startTime);
    const DOMTitle = DOMRange?.firstElementChild?.firstElementChild;
    DOMTitle?.insertAdjacentText("beforeend", dateFormat);
    const DOMDelete = DOMRange?.firstElementChild?.lastElementChild;
    DOMDelete?.setAttribute(
        "title",
        `Remove ${dateFormat} browsing history`
    );
    return DOMRange;
}

/**
@type{(
    url: string,
    title: string,
    id: string,
    visitTime: number,
) => DocumentFragment}*/
function createDOMItem(url, title, id, visitTime) {
    const fragment = DOMTemplateItem.content.cloneNode(true);
    const DOMItem = fragment.firstElementChild;
    DOMItem?.setAttribute("href", url);
    DOMItem?.setAttribute("data-id", id);
    DOMItem?.children["img"]?.setAttribute("src", getFavicon(url));

    if (title === "") {
        DOMItem?.setAttribute("title", url);
        DOMItem?.children["title"]?.insertAdjacentText("beforeend", url);
    } else {
        DOMItem?.setAttribute("title", title+"\n"+url);
        DOMItem?.children["title"]?.insertAdjacentText("beforeend", title);
    }

    DOMItem?.children["time"]?.insertAdjacentText(
        "beforeend",
        TimeFormatter.format(visitTime)
    );
    return fragment;
}

/**
 * @throws {Error} If #m_container does not have children
 * @type{(historyItems: Array<chrome.history.HistoryItem>) => Promise<undefined>}*/
async function searchToDOM(historyItems) {
    if (
        historyItems.length < 1
        || (historyItems.length === 1 && historyItems[0].id === lastItemId)
    ) {
        noMoreContent = true;
        SearchQuery.maxResults = MAX_SEARCH_RESULTS;

        if (totalItems === 0) {
            DOMMainEmpty.removeAttribute("data-css-hidden");
        } else {
            if (DOMFragment.children.length > 0) {
                let DOMRange = DOMMainContainer.lastElementChild;
                if (DOMRange !== null) {
                    DOMRange.appendChild(DOMFragment);
                }
            }
        }
        lastRangeIsFull = false;
        DOMHeaderLoading.setAttribute("data-css-hidden", "");
        return;
    }
    let timeRangeEnd = 0;
    let timeRangeStart = 0;
    let i = 0;

    let DOMRange = null;

    if (TimeRange.length == 0) {
        timeRangeEnd = historyItems[0].lastVisitTime;
        timeRangeStart = TimeRange.createStart(timeRangeEnd);
        TimeRange.add(timeRangeEnd, timeRangeStart);

        if (searchMode) {
            DOMRange = createDOMRangeSearch(timeRangeStart);
            DOMMainContainer.appendChild(DOMRange);
        } else {
            DOMRange = createDOMRange(timeRangeStart);
            DOMMainContainer.appendChild(DOMRange);
        }
    } else {
        timeRangeEnd = TimeRange.getLastEnd();
        timeRangeStart = TimeRange.getLastStart();

        if (historyItems[0].id === lastItemId) {
            i = 1;
        }
        if (lastRangeIsFull) {
            lastRangeIsFull = false;

            if (searchMode) {
                DOMRange = createDOMRangeSearch(timeRangeStart);
                DOMMainContainer.appendChild(DOMRange);
            } else {
                DOMRange = createDOMRange(timeRangeStart);
                DOMMainContainer.appendChild(DOMRange);
            }
        } else {
            DOMRange = DOMMainContainer.lastElementChild;
        }

        if (DOMRange === null) {
            throw Error("#m_container.lastElementChild is null");
        }
    }

    let lastVisitTime = 0;
    let item = historyItems[i];
    let itemsCreated = 0;

    while (i < historyItems.length) {
        item = historyItems[i];
        if (item.lastVisitTime < timeRangeStart) {
            lastVisitTime = item.lastVisitTime;
            break;
        }
        if (item.visitCount !== undefined && item.visitCount > 1) {
            if (visited.includes(item.id)) {
                i += 1;
                continue;
            }
            visited.push(item.id);

            if (timeRangeEnd < item.lastVisitTime) {
                let visits;
                UrlDetails.url = item.url;
                try {
                    visits = await chrome.history.getVisits(UrlDetails);
                } catch (e) {
                    console.error(e.message);
                    continue;
                }
                let visitTime = getClosestVisit(visits, timeRangeEnd);
                if (visitTime < 0) {
                    i += 1;
                    continue
                }
                lastVisitTime = visitTime;
                if (lastVisitTime < timeRangeStart) {
                    break;
                }
            } else {
                lastVisitTime = item.lastVisitTime;
            }
        } else {
            lastVisitTime = item.lastVisitTime;
        }

        DOMFragment.appendChild(createDOMItem(
            item.url,
            item.title,
            item.id,
            lastVisitTime
        ));

        TimeRange.addElement();

        itemsCreated += 1;
        i += 1;
    }

    totalItems += itemsCreated;
    itemsFromSearch += itemsCreated;

    if (i < historyItems.length) {
        //new range
        lastRangeIsFull = true;
        visited.length = 0;
        SearchQuery.endTime = TimeRange.addFrom(lastVisitTime);
        lastItemId = "";
    } else {
        SearchQuery.endTime = lastVisitTime;
        lastItemId = item.id;
    }

    if (itemsFromSearch < MIN_SEARCH_RESULTS) {
        if (MAX_SEARCH_RESULTS - itemsFromSearch < MIN_SEARCH_RESULTS) {
            SearchQuery.maxResults = MIN_SEARCH_RESULTS;
        } else {
            SearchQuery.maxResults = MAX_SEARCH_RESULTS;
        }
        DOMRange.appendChild(DOMFragment);
        return chrome.history.search(SearchQuery, searchToDOM);
    } else {
        itemsFromSearch = 0;
        SearchQuery.maxResults = MAX_SEARCH_RESULTS;

        DOMHeaderLoading.setAttribute("data-css-hidden", "");
        DOMRange.appendChild(DOMFragment);
        DOMMainContainer.onscroll = DOMMainContainerOnscroll;
    }
}

/**
 * @type {(s: typeof storage) => undefined}*/
function initDOM(s) {
    document.firstElementChild.setAttribute("class", s.theme);
    DOMFormConfig["theme"].value = s.theme;
    DOMFormConfig["open_behavior"].value = s.open;
    DOMFormConfig["focus"].checked = s.focusTabs;
}

/**
@type{(
    tabsProperties: typeof TabsProperties,
    open: STORAGE_OPEN_NEW | STORAGE_OPEN_CURRENT,
    ctrl: boolean
) => undefined}*/
function openLink(tabsProperties, open, ctrl) {
    if ((open === STORAGE_OPEN_NEW) === ctrl) {
        chrome.tabs.update(undefined, tabsProperties, undefined);
    } else {
        chrome.tabs.create(tabsProperties, undefined);
    }
}

/**
 * @type {(DOMItem: HTMLAnchorElement, startTime: number) => undefined}*/
function deleteLink(DOMItem, startTime) {
    const url = DOMItem.getAttribute("href");
    UrlDetails.url = url;

    try {
        chrome.history.deleteUrl(UrlDetails, undefined);
    } catch(e) {
        console.error(e.message);
    }

    const i = TimeRange.getStartIndex(startTime);
    if (i < 0) {
        console.error("ERROR: the start time does not founded");
        return;
    }
    TimeRange.removeElement(i);
    if (TimeRange.elements[i] < 1) {
        const DOMRange = DOMItem.parentElement;
        DOMRange.remove();

        TimeRange.remove(i);
    } else {
        DOMItem.remove();
    }
    totalItems -= 1;
}

function searchAgain() {
    if (noMoreContent) {
        if (totalItems < 1) {
            DOMMainEmpty.removeAttribute("data-css-hidden");
        }
        return;
    }
    if (DOMMainContainer.scrollTop >= (DOMMainContainer.scrollHeight - DOMMainContainer.clientHeight - 50)) {
        DOMHeaderLoading.setAttribute("data-css-hidden", "");
        chrome.history.search(SearchQuery, searchToDOM);
        DOMMainContainer.onscroll = null;
    }
}

/**
 * @type {(e: MouseEvent) => undefined}*/
function DOMHeaderButtonsOnclick(e) {
    let target = e.target;
    let name = target.getAttribute("name");
    if (name === "history") {
        TabsProperties.url = "about://history"
        openLink(TabsProperties, storage.open, e.ctrlKey);

    } else if (name === "clear") {
        let temp = TabsProperties.active
        TabsProperties.url = "about://settings/clearBrowserData";
        TabsProperties.active = true;
        chrome.tabs.create(TabsProperties, undefined);
        TabsProperties.active = temp;

    } else if (name === "more") {
        DOMModal.removeAttribute("data-css-hidden");

    } else if (name === "close") {
        window.close();
    }
}

/**
 * @type {(e: MouseEvent) => undefined}*/
function DOMHeaderButtonsOnauxclick(e) {
    let target = e.target;
    let name = target.getAttribute("name");
    if (name === "history") {
        TabsProperties.url = "about://history"
        chrome.tabs.create(TabsProperties, undefined);
    }
}

/**
 * @type {() => undefined}*/
function DOMFormSearchTimeout() {
    searchTimeout = undefined;

    DOMHeaderLoading.setAttribute("data-css-hidden", "");
    DOMMainContainer.replaceChildren();

    SearchQuery.endTime = Date.now();
    SearchQuery.text = DOMFormSearch["text"].value;

    TimeRange.reset();
    visited.length = 0;
    totalItems = 0;
    lastItemId = "";
    noMoreContent = false;
    lastRangeIsFull = false;

    DOMMainEmpty.setAttribute("data-css-hidden", "");
    chrome.history.search(SearchQuery, searchToDOM);
    DOMMainContainer.onscroll = null;
}

/**
 * @type {() => undefined}*/
function DOMFormSearchOninput() {
    let target = DOMFormSearch["text"];
    if (target.value.length !== 0) {
        searchMode = true;
        DOMFormSearch["remove"].removeAttribute("data-css-hidden");
    } else {
        searchMode = false;
        DOMFormSearch["remove"].setAttribute("data-css-hidden", "");
    }
    if (searchTimeout !== undefined) {
        clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(DOMFormSearchTimeout, 500);
    DOMHeaderLoading.removeAttribute("data-css-hidden");
}

/**
 * @type {() => undefined}*/
function DOMFormSearchOnclick() {
    DOMFormSearch["text"].value = "";
    DOMFormSearchOninput();
}

/**
 * @type {() => undefined}*/
function DOMMainContainerOnscroll() {
    if (noMoreContent) {
        return;
    }
    if (DOMMainContainer.scrollTop >= (DOMMainContainer.scrollHeight - DOMMainContainer.clientHeight - 50)) {
        DOMHeaderLoading.removeAttribute("data-css-hidden");
        chrome.history.search(SearchQuery, searchToDOM);
        DOMMainContainer.onscroll = null;
    }
}

/**
 * @type {(e: MouseEvent) => undefined}*/
function DOMMainContainerOnclick(e) {
    const target = e.target;
    let type = target.getAttribute("data-type");
    if (type === "remove") {
        e.preventDefault();
        let datafor = target.getAttribute("data-for");
        let DOMParent = target?.parentElement;
        let DOMRange = DOMParent?.parentElement;
        let startTime = DOMRange?.getAttribute("data-starttime");
        if (startTime == null) {
            console.error("ERROR: data-starttime attribute doesn't exist");
            return;
        }
        if (datafor === "item") {
            deleteLink(DOMParent, Number(startTime));

        } else if (datafor === "date") {
            const i = TimeRange.getStartIndex(Number(startTime));
            if (i < 0) {
                console.error("ERROR: start time does not found");
                return;
            }

            DeleteRange.startTime = TimeRange.starts[i];
            DeleteRange.endTime = TimeRange.ends[i];
            let elements = TimeRange.elements[i];

            //throws
            chrome.history.deleteRange(DeleteRange);

            TimeRange.remove(i);
            totalItems -= elements;

            DOMRange.remove();
        }
        searchAgain();

    } else if (type === "item") {
        if (!e.shiftKey) {
            e.preventDefault();
            const url = target.href;
            TabsProperties.url = url;
            openLink(TabsProperties, storage.open, e.ctrlKey);
        }
    }
}

/**
 * @type {(e: MouseEvent) => undefined}*/
function DOMMainContainerOnauxclick(e) {
    let target = e.target;
    if (target.getAttribute("data-type") === "item") {
        e.preventDefault();
        let href = target?.getAttribute("href");
        if (href === null || href === undefined) {
            console.error('ERROR: [data-type="item"] does not have "href" attribute')
            return;
        }

        TabsProperties.url = href;
        //throws
        chrome.tabs.create(TabsProperties, undefined);
    }
}

/**
 * @type {(e: KeyboardEvent) => undefined}*/
function DOMMainContainerOnkeydown(e) {
    let target = e.target;
    let type = target.getAttribute("data-type");
    if (type !== "item") {
        return;
    }
    if (e.key === "q") {
        const DOMRange = target.parentElement;
        const startTime = DOMRange?.getAttribute("data-starttime");
        if (startTime === null || startTime === undefined) {
            console.error('ERROR: .range does not have "data-startitme" attribute');
        } else {
            deleteLink(target, Number(startTime));
            searchAgain();
        }
    }
}

/**
 * @type {(e: MouseEvent) => undefined}*/
function DOMModalOnclick(e) {
    let target = e.target;
    let type = target.getAttribute("data-type");
    if (type === "modal" || type === "close") {
        DOMModal?.setAttribute("data-css-hidden", "");
    }
}

function DOMFormConfigOnchange(e) {
    let target = e.target;
    let name = target.getAttribute("name");
    if (name === "theme") {
        if (
            target.value === STORAGE_THEME_DARK
            || target.value === STORAGE_THEME_LIGHT
        ) {
            storage.theme = target.value;
            document.firstElementChild.setAttribute("class", target.value);
            storageChange = true;
        } else {
            console.error("ERROR: the theme value is wrong");
        }
    } else if (name === "open_behavior") {
        if (
            target.value === STORAGE_OPEN_NEW
            || target.value === STORAGE_OPEN_CURRENT
        ) {
            storage.open = target.value;
            storageChange = true;
        } else {
            console.error("ERROR: the open_behavior value is wrong");
        }
    } else if (name === "focus") {
        storage.focusTabs = target.checked;
        TabsProperties.active = storage.focusTabs;
        storageChange = true;
    }
    if (storageChange) {
        chrome.storage.local.set(storage, undefined);
    }
}

//MAIN
{
    chrome.storage.local.get(
        undefined,
        /**@type{(items: typeof storage) => undefined}*/
        function (items) {
            initStorage(items);
            initDOM(storage);
            SearchQuery.endTime = Date.now();
            //throws
            chrome.history.search(SearchQuery, searchToDOM);
        }
    );

    DOMHeaderButtons.addEventListener("click", DOMHeaderButtonsOnclick, false);
    DOMHeaderButtons.addEventListener("auxclick", DOMHeaderButtonsOnauxclick, false);

    DOMFormSearch["text"].addEventListener("input", DOMFormSearchOninput, false);
    DOMFormSearch["remove"].addEventListener("click", DOMFormSearchOnclick, false);

    DOMMainContainer.onscroll = DOMMainContainerOnscroll;
    DOMMainContainer.addEventListener("click", DOMMainContainerOnclick, false);
    DOMMainContainer.addEventListener("auxclick", DOMMainContainerOnauxclick, false);
    DOMMainContainer.addEventListener("keydown", DOMMainContainerOnkeydown, false);

    DOMModal.addEventListener("click", DOMModalOnclick, false);

    DOMFormConfig.addEventListener("change", DOMFormConfigOnchange, false);
}
