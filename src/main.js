// Axel Ariel Saravia
// 02-08-2023 (Latam format)
//@ts-check

const MAX_SEARCH_RESULTS = 30;
const MIN_SEARCH_RESULTS = 20;

//60000ms = 1m
//transform the getTimesoneOffset minutes values to miliseconds
const TIME_OFFSET = 60000 * (new Date()).getTimezoneOffset();

const ATTR_DATA_BUTTON   = "data-button";
const ATTR_DATA_DISPLAY  = "data-display";
const ATTR_DATA_URL      = "data-url";
const ATTR_DATA_TYPE     = "data-type";
const ATTR_DATA_SET      = "data-set";
const ATTR_DATA_RANGE    = "data-range";

const DATA_BUTTON_HISTORY   = "0";
const DATA_BUTTON_CLEAR     = "1";
const DATA_BUTTON_MORE      = "2";
const DATA_BUTTON_CLOSE     = "3";

const DATA_TYPE_ITEM    = "0";
const DATA_TYPE_DATE    = "1";
const DATA_TYPE_BREMOVE = "2";
const DATA_TYPE_MODAL   = "3";

const TimeStateFormatter = Intl.DateTimeFormat(undefined, {timeStyle: "short"});
const DateFormatter = Intl.DateTimeFormat(undefined, {dateStyle: "full"});

const url = new URL("a:a.a");

const TabOptions = {
    active: false,
    url: ""
};
const UrlDetails = {
    url: ""
};
const DeleteRangeOptions = {
    endTime:0,
    startTime: 0
};

const Searchptions = {
    text:       "",
    maxResults: MAX_SEARCH_RESULTS,
    startTime:  0,  //ms
    endTime:    0   //ms
};

var CurrentTab = undefined;
var SearchTimeout = undefined;

//DOM
const DOM = {
    /**
    @type {HTMLDivElement | null}*/
    container: null,
    /**
    @type {HTMLDivElement | null}*/
    inputSearch: null,
    /**
    @type {HTMLDivElement | null}*/
    headerButtons: null,
    /**
    @type {HTMLDivElement | null}*/
    buttonSearch: null,
    /**
    @type {HTMLDivElement | null}*/
    noHistory: null,
    /**
    @type {HTMLDivElement | null}*/
    loading: null,
    /**
    @type {HTMLDivElement | null}*/
    modalConfig: null,
    /**
    @type {HTMLDivElement | null}*/
    modalConfigTheme: null,
    /**
    @type {HTMLDivElement | null}*/
    modalConfigOpen: null,
    /**
    @type {HTMLDivElement | null}*/
    modalConfigFocus: null,
    /**
    @type {HTMLDivElement | null}*/
    templateItem: null,
    /**
    @type {HTMLDivElement | null}*/
    templateRange: null,
    /**
    @type {HTMLDivElement | null}*/
    templateIconDelete: null,
    /**
    @type {DocumentFragment}*/
    fragment: document.createDocumentFragment(),
};

const StorageState = {
    focusTabs: false,
    //open can be: "0" (current Tab) | "1" (new tab)
    open: "0",
    /**
    @type {"dark"|"light"} */
    theme: "dark",
};

const HistoryState = {
    lastId: "",
    total: 0,
    noMoreContent: false,
    lastDOMRangeIsFull: false,
    itemsCreated: 0,
    /**
    @type {"d" | "s"}*/ //"d" default and "s" search
    mode: "d",

    reset() {
        HistoryState.lastId = "";
        HistoryState.total = 0;
        HistoryState.noMoreContent = false;
        HistoryState.lastDOMRangeIsFull = false;
        HistoryState.itemsCreated = 0;
    }
};

const Visited = {
    /**
    @type {Array<string>} */
    ids: [],
    /**
    @type {(id: string) => number} */
    add(id) {
        var len = Visited.ids.length;
        var lst = len - 1;
        var fst = 0;
        var mid = 0;
        while (fst <= lst) {
            mid = Math.floor((fst + lst) / 2);
            var s = Visited.ids[mid];
            if (id < s) {
                lst = mid - 1;
            } else if (id > s) {
                fst = mid + 1;
            } else {
                return mid;
            }
        }
        if (fst === len) {
            Visited.ids.push(id);
        } else {
            Visited.ids.length += 1;
            Visited.ids.copyWithin(fst + 1, fst, len);
            Visited.ids[fst] = id;
        }
        return fst;
    },
    /**
    @type {(id: string) => boolean} */
    has(id) {
        var len = Visited.ids.length;
        var lst = len - 1;
        var fst = 0;
        var mid = 0;
        while (fst <= lst) {
            mid = Math.floor((fst + lst) / 2);
            var s = Visited.ids[mid];
            if (id < s) {
                lst = mid - 1;
            } else if (id > s) {
                fst = mid + 1;
            } else {
                return true;
            }
        }
        return false;
    },
    reset() {
        Visited.ids.length = 0;
    },
    /**
    @type {(
        visits: Array<ChromeExtensionAPI.VisitItem>,
        rangeEnd: number
    ) => number} */
    getClosestVisit(visits, rangeEnd) {
        var s;
        if (visits.length < 6) {
            for (var i = visits.length - 1; i >= 0; i -= 1) {
                s = visits[i];
                if (s.visitTime < rangeEnd) {
                    return s.visitTime;
                }
            }
        } else {
            var lst = visits.length - 1;
            var fst = 0;
            var mid = 0;
            while (fst <= lst) {
                mid = Math.floor((fst + lst) / 2);
                s = visits[mid];
                if (rangeEnd < s.visitTime) {
                    lst = mid - 1;
                } else if (rangeEnd > s.visitTime) {
                    fst = mid + 1;
                } else {
                    return 0;
                }
            }
            if (lst < 0) {
                return 0;
            } else {
                return visits[lst].visitTime;
            }
        }
        return 0;
    }
};

const RangeState = {
    /**
    @type {Array<number>} */
    end: [],
    /**
    @type {Array<number>} */
    start: [],
    /**
    @type {Array<number>} */
    count: [],
    /**
    @type {number} */
    length: 0,

    //Methods
    //86400000ms = 24hs
    /**
    @type {(ms: number) => number} */
    createStart(ms) {
        return ms - ((ms - TIME_OFFSET) % 86400000);
    },
    /**
    @type {() => boolean}*/
    addCount() {
        if (RangeState.length > 0) {
            const countArr = RangeState.count;
            countArr[RangeState.length - 1] += 1;
            return true;
        } else {
            return false;
        }
    },
    /**
    @type {() => number} */
    getLastEnd() {
        if (RangeState.length > 0) {
            return RangeState.end[RangeState.length - 1];
        }
        return -1;
    },
    /**
    @type {() => number} */
    getLastStart() {
        if (RangeState.length > 0) {
            return RangeState.start[RangeState.length - 1];
        }
        return -1;
    },
    // target is start element
    /**
    @type {(target: number) => number}*/
    getIndex(target) {
        var arr = RangeState.start;
        var end = arr.length;
        if (end < 11) {
            return arr.indexOf(target);
        }
        //binary search
        var str = 0;
        var mid = 0 ;
        var el = 0;
        while (str < end) {
            mid = Math.floor((str + end) / 2);
            el = arr[mid];
            if (target === el) {
                return mid;
            } else if (el < target) {
                end = mid;
            } else {
                str = mid + 1;
            }
        }
        return -1;
    },
    /**
    @type {(i: number) => boolean}*/
    remove(i) {
        var len = RangeState.length;
        if (i < 0 || len <= i) {
            return false;
        }
        RangeState.end.copyWithin(i, i + 1, len);
        RangeState.end.pop();
        RangeState.start.copyWithin(i, i + 1, len);
        RangeState.start.pop();
        RangeState.count.copyWithin(i, i + 1, len);
        RangeState.count.pop();
        RangeState.length -= 1;
        return true;
    },
    /**
    @type {() => undefined}*/
    reset() {
        RangeState.end.length = 0;
        RangeState.start.length = 0;
        RangeState.count.length = 0;
        RangeState.length = 0;
    },
    //Return the index of the data
    /**
    @type {(end: number, start: number) => number}*/
    create(end, start) {
        RangeState.end.push(end);
        RangeState.start.push(start);
        RangeState.count.push(0);
        RangeState.length += 1
        return RangeState.length - 1;
    },
    /**
    @type {(ms: number) => number} */
    from(ms) {
        var start = RangeState.createStart(ms);
        RangeState.create(start + 86400000, start);
        return start + 86400000;
    },
    /**
    @type {(index: number) => boolean}*/
    subtractCount(i) {
        const countArr = RangeState.count;
        if (i < 0 || countArr.length <= i) {
            return false;
        }
        if (countArr[i] > 0) {
            countArr[i] -= 1;
        }
        return true;
    }
};

/**
@type {(message: string) => never} */
function panic(message) {
    throw Error(message);
}

/**
@type {(items: typeof StorageState) => undefined} */
function getStorage(items) {
    var open = items.open;
    var focusTabs = items.focusTabs;
    var theme = items.theme;
    var set = false;
    if (open === undefined) {
        set = true;
    } else {
        StorageState.open = open;
        DOM.modalConfigOpen.value = open;
    }
    if (focusTabs === undefined) {
        set = true;
    } else {
        StorageState.focusTabs = focusTabs;
        DOM.modalConfigFocus.checked = focusTabs;
    }
    if (theme === undefined) {
        set = true;
    } else {
        StorageState.theme = theme;
        document.firstElementChild?.setAttribute("class", theme);
    }
    if (set) {
        chrome.storage.local.set(StorageState, undefined);
    }
}

/**
@type {(src: string) => string} */
function getFavicon(src) {
    url.href = chrome.runtime.getURL("/_favicon/");
    url.searchParams.set("pageUrl", src);
    url.searchParams.set("size", "16");
    return url.toString();
}

/**
@type {(url: string, ctrl: boolean) => undefined}*/
function openLink(url, ctrl) {
    TabOptions.url = url;
    TabOptions.active = StorageState.focusTabs;
    if ((StorageState.open === "0") === !ctrl) {
        chrome.tabs.update(CurrentTab.id, TabOptions, undefined);
    } else {
        chrome.tabs.create(TabOptions, undefined);
    }
}

/**
@type {(startTime: number) => DOMHRange} */
function createDOMRange(startTime) {
    var FragmentRange = DOM.templateRange.content.cloneNode(true);
    var DOMRange = FragmentRange.firstElementChild;
    DOMRange.setAttribute("data-range", String(startTime));

    //Range header
    var DOMDate = DOMRange.firstElementChild;
    var DOMDTitle = DOMDate.firstElementChild;
    var dateFormat = DateFormatter.format(startTime);
    DOMDTitle.textContent = dateFormat;

    var DOMDDelete = DOMDate.lastElementChild;
    if (HistoryState.mode === "d") {
        DOMDDelete.title = `Remove all browsing history form ${dateFormat}`;
        DOMDDelete.appendChild(DOM.templateIconDelete.content.cloneNode(true));
        DOMDDelete.setAttribute(ATTR_DATA_RANGE, String(startTime));
    } else {
        DOMDDelete.setAttribute(ATTR_DATA_DISPLAY, "0");
    }
    return DOMRange;
}

/**
@type {(
    hitem: HistoryItem,
    visitTime: number,
    startTime: number
) => HTMLDivElement | never} */
function createDOMItem(hitem, visitTime, startTime) {
    var FragmentItem = DOM.templateItem.content.cloneNode(true);
    var DOMItem = FragmentItem.firstElementChild;
    DOMItem.href = hitem.url;
    DOMItem.title = hitem.title + "\n" + hitem.url;

    var DOMItemChildren = DOMItem.children;
    var DOMImg = DOMItemChildren[0];
    if (hitem.url === undefined) {
        panic("hitem.url is undefined");
    }
    DOMImg.src = getFavicon(hitem.url);

    var DOMTitle = DOMItemChildren[1];
    if (hitem.title === "") {
        DOMTitle.textContent = hitem.url;
    } else {
        DOMTitle.textContent = hitem.title;
    }

    var DOMRight = DOMItemChildren[2];

    var DOMRDelete = DOMRight.firstElementChild;
    DOMRDelete.setAttribute(ATTR_DATA_URL, hitem.url);
    DOMRDelete.setAttribute(ATTR_DATA_RANGE, String(startTime));
    DOMRDelete.appendChild(DOM.templateIconDelete.content.cloneNode(true));

    var DOMRTime = DOMRight.lastElementChild;
    DOMRTime.textContent = TimeStateFormatter.format(visitTime);

    return DOMItem;
}

function initSearchToDOM(hitems) {
    if (hitems.length < 1 || (hitems.length === 1 && hitems[0].id === HistoryState.lastId)) {
        HistoryState.noMoreContent = true;
        DOM.loading.setAttribute(ATTR_DATA_DISPLAY, "0");
        DOM.noHistory.setAttribute(ATTR_DATA_DISPLAY, "1");
        return;
    }
    var rangeEnd = hitems[0].lastVisitTime;
    var rangeStart = RangeState.createStart(rangeEnd);
    RangeState.create(rangeEnd, rangeStart);

    var item;
    var i = 0;
    var newRange = false;
    while (i < hitems.length) {
        item = hitems[i];
        if (
            (item.visitCount !== undefined && item.visitCount > 1)
            || (item.typedCount !== undefined && item.typedCount > 0)
        ) {
            Visited.add(item.id);
        }
        if (item.lastVisitTime < rangeStart) {
            newRange = true;
            break;
        }
        HistoryState.total += 1;
        RangeState.addCount();
        DOM.fragment.appendChild(
            createDOMItem(item, item.lastVisitTime, rangeStart)
        );
        i += 1;
    }
    var DOMRange = createDOMRange(rangeStart);
    DOMRange.appendChild(DOM.fragment);
    DOM.container.appendChild(DOMRange);

    if (newRange) {
        Visited.reset();
        HistoryState.lastDOMRangeIsFull = true;
        HistoryState.itemsCreated += i;
        HistoryState.lastId = "";

        RangeState.from(item.lastVisitTime)
        SearchOptions.endTime = RangeState.getLastEnd();

        if(MAX_SEARCH_RESULTS - i <= MIN_SEARCH_RESULTS) {
            SearchOptions.maxResults = MIN_SEARCH_RESULTS;
        } else {
            SearchOptions.maxResults = MAX_SEARCH_RESULTS;
        }
        return chrome.history.search(SearchOptions, searchToDOM);
    } else {
        HistoryState.lastId = item.id;
        SearchOptions.endTime = item.lastVisitTime;
        DOM.loading.setAttribute(ATTR_DATA_DISPLAY, "0");
    }
}

async function searchToDOM(hitems) {
    var rangeStart = RangeState.getLastStart();
    var rangeEnd = RangeState.getLastEnd();
    var DOMRange;

    if (hitems.length < 1 || (hitems.length === 1 && hitems[0].id === HistoryState.lastId)) {
        HistoryState.noMoreContent = true;
        SearchOptions.maxResults = MAX_SEARCH_RESULTS;
        if (DOM.fragment.children.length > 0) {
            if (HistoryState.lastDOMRangeIsFull) {
                DOMRange = createDOMRange(rangeStart);
                DOMRange.appendChild(DOM.fragment);
                DOM.container?.appendChild(DOMRange);
            } else {
                DOM.container.lastElementChild.appendChild(DOM.fragment);
            }
        }
        HistoryState.lastDOMRangeIsFull = false;
        DOM.loading.setAttribute(ATTR_DATA_DISPLAY, "0");
        return;
    }
    var newRange = false;
    var itemVisitTime = 0;
    var item;
    var count = 0;
    var i = 0;
    if (hitems[0].id === HistoryState.lastId) {
        i = 1;
    }
    while (i < hitems.length) {
        item = hitems[i];
        if (
            (item.visitCount !== undefined && item.visitCount > 1)
            || (item.typedCount !== undefined && item.typedCount > 0)
        ) {
            if (Visited.has(item.id)) {
                i += 1;
                continue;
            } else {
                if (SearchOptions.endTime < item.lastVisitTime) {
                    var visits;
                    UrlDetails.url = item.url;
                    try {
                        visits = await chrome.history.getVisits(UrlDetails);
                    } catch (e) {
                        throw new Error(e.message);
                    }
                    itemVisitTime = Visited.getClosestVisit(visits, rangeEnd);
                    if (itemVisitTime === 0) {
                        i += 1;
                        continue;
                    }
                } else {
                    itemVisitTime = item.lastVisitTime;
                }
                Visited.add(item.id);
            }
        } else {
            itemVisitTime = item.lastVisitTime;
        }
        if (itemVisitTime < rangeStart) {
            newRange = true;
            break;
        }
        HistoryState.total += 1;
        RangeState.addCount();

        DOM.fragment.appendChild(
            createDOMItem(item, itemVisitTime, rangeStart)
        );
        count += 1;
        i += 1;
    }
    HistoryState.itemsCreated += count;
    if (newRange) {
        Visited.reset();
        RangeState.from(itemVisitTime)
        SearchOptions.endTime = RangeState.getLastEnd();
        HistoryState.lastId = "";
    } else {
        HistoryState.lastId = item.id;
        SearchOptions.endTime = itemVisitTime;
    }
    if (HistoryState.itemsCreated < MAX_SEARCH_RESULTS) {
        if (MAX_SEARCH_RESULTS - HistoryState.itemsCreated <= MIN_SEARCH_RESULTS) {
            SearchOptions.maxResults = MIN_SEARCH_RESULTS;
        } else {
            SearchOptions.maxResults = MAX_SEARCH_RESULTS;
        }
        if (newRange) {
            if(DOM.fragment.children.length > 0) {
                if (HistoryState.lastDOMRangeIsFull) {
                    DOMRange = createDOMRange(rangeStart);
                    DOMRange.appendChild(DOM.fragment);
                    DOM.container?.appendChild(DOMRange);
                } else {
                    DOM.container?.lastElementChild?.appendChild(DOM.fragment);
                }
            }
            HistoryState.lastDOMRangeIsFull = true;
        }
        return chrome.history.search(SearchOptions, searchToDOM);
    } else {
        HistoryState.itemsCreated = 0;
        SearchOptions.maxResults = MAX_SEARCH_RESULTS;

        if (DOM.fragment.children.length > 0) {
            if (HistoryState.lastDOMRangeIsFull) {
                DOMRange = createDOMRange(rangeStart);
                DOMRange.appendChild(DOM.fragment);
                DOM.container?.appendChild(DOMRange);
            } else {
                DOM.container?.lastElementChild?.appendChild(DOM.fragment);
            }
        }
        HistoryState.lastDOMRangeIsFull = newRange;

        DOM.loading?.setAttribute(ATTR_DATA_DISPLAY, "0");
        DOM.container.onscroll = DOMContainerOnscroll;
    }
}

/**
@type {(hItems: Array<HistoryItem>) => undefined}*/
function handleSearch(HItems) {
    searchToDOM(HItems);
    if (HistoryState.noMoreContent) {
        DOM.noHistory.setAttribute(ATTR_DATA_DISPLAY, "1");
        return;
    } else {
        DOM.noHistory.setAttribute(ATTR_DATA_DISPLAY, "0");
    }
}

/**
@type {() => undefined}*/
function searchAfterDelete() {
    if (HistoryState.noMoreContent) {
        DOM.noHistory.setAttribute(ATTR_DATA_DISPLAY, "1");
        return;
    } else {
        if (DOM.container.clientHeight === DOM.container.scrollHeight) {
            DOM.loading.setAttribute(ATTR_DATA_DISPLAY, "1");
            chrome.history.search(SearchOptions, searchToDOM);
        }
    }
}

/**
@type {(type: string, DOMDelete: HTMLButtonElement) => undefined}*/
function DOMDeleteOnclick(type, DOMDelete) {
    if (type === DATA_TYPE_ITEM) {
        const url = DOMDelete.getAttribute(ATTR_DATA_URL);
        const rangeKey = DOMDelete.getAttribute(ATTR_DATA_RANGE);
        if (url === null || rangeKey === null) {
            return;
        }
        const DOMItem = DOMDelete.parentElement.parentElement;
        UrlDetails.url = url;
        chrome.history.deleteUrl(UrlDetails, undefined);

        const rangeIndex = RangeState.getIndex(Number(rangeKey));
        if (rangeIndex < 0) {
            return;
        }
        RangeState.subtractCount(rangeIndex);

        if (RangeState.count[rangeIndex] < 1) {
            const DOMRange = DOMItem.parentElement;
            DOMRange.remove();
            RangeState.remove(rangeIndex);
        } else {
            DOMItem.remove();
        }
        HistoryState.total -= 1;

        searchAfterDelete();

    } else if (type === DATA_TYPE_DATE) {
        const rangeKey = DOMDelete.getAttribute(ATTR_DATA_RANGE);
        if (rangeKey === null) {
            return;
        }
        const rangeIndex = RangeState.getIndex(Number(rangeKey));
        if (rangeIndex < 0) {
            return;
        }
        let endTime = RangeState.end[rangeIndex];
        let startTime = RangeState.start[rangeIndex];
        let count = RangeState.count[rangeIndex];

        HistoryState.total -= count;

        DeleteRangeOptions.endTime = endTime;
        DeleteRangeOptions.startTime = startTime;
        chrome.history.deleteRange(DeleteRangeOptions);

        const DOMRange = DOMDelete.parentElement.parentElement;
        DOMRange.remove();

        RangeState.remove(rangeIndex);

        searchAfterDelete();
    }
}

/**
@type {(DOMInput: HTMLDivElement) => undefined} */
function DOMInputSearchTimeout(DOMInput) {
    SearchTimeout = undefined;
    DOM.loading.setAttribute(ATTR_DATA_DISPLAY, "1");
    DOM.container.replaceChildren();

    SearchOptions.endTime = Date.now();
    SearchOptions.text = DOMInput.value;

    RangeState.reset();
    HistoryState.reset();
    Visited.reset();

    DOM.noHistory.setAttribute(ATTR_DATA_DISPLAY, "0");
    chrome.history.search(SearchOptions, initSearchToDOM);
};

/**
@type {() => undefined} */
function DOMInputSearchOninput() {
    if (DOM.inputSearch.value.length === 0) {
        DOM.buttonSearch.setAttribute(ATTR_DATA_DISPLAY, "0");
        HistoryState.mode = "d";
    } else {
        DOM.buttonSearch.setAttribute(ATTR_DATA_DISPLAY, "1");
        HistoryState.mode = "s";
    }
    if (SearchTimeout !== undefined) {
        clearTimeout(SearchTimeout);
    }
    SearchTimeout = setTimeout(DOMInputSearchTimeout, 500, DOM.inputSearch);
    DOM.loading.setAttribute(ATTR_DATA_DISPLAY, "1");
};

/**
@type {(e:MouseEvent) => undefined}*/
function DOMHeaderButtonsOnclick(e) {
    var target = e.target;
    var buttonType = target.getAttribute(ATTR_DATA_BUTTON);
    if (buttonType === DATA_BUTTON_HISTORY) {
        openLink("about://history", e.ctrlKey);
    } else if (buttonType === DATA_BUTTON_CLEAR) {
        TabOptions.url = "about://settings/clearBrowserData";
        TabOptions.active = true;
        chrome.tabs.create(TabOptions, undefined);
    } else if (buttonType === DATA_BUTTON_MORE) {
        DOM.modalConfig?.setAttribute(ATTR_DATA_DISPLAY, "1");
    } else if (buttonType === DATA_BUTTON_CLOSE) {
        window.close();
    }
}

/**
@type {(e: MouseEvent) => undefined} */
function DOMHeaderButtonsOnauxclick(e) {
    var target = e.target;
    var DOMType = target.getAttribute(ATTR_DATA_BUTTON);
    if (DOMType === DATA_BUTTON_HISTORY) {
        TabOptions.url = "about://history";
        TabOptions.active = StorageState.focusTabs;
        chrome.tabs.create(TabOptions, undefined);
    }
}

/**
@type {() => undefined}*/
function DOMButtonSearchOnclick() {
    DOM.inputSearch.value = "";
    DOMInputSearchOninput();
}

function DOMContainerOnscroll(e) {
    if (HistoryState.noMoreContent) {
        return;
    }
    const target = e.currentTarget;
    //end of the current scroll
    if (target.scrollTop >= target.scrollHeight - target.clientHeight - 50) {
        DOM.loading.setAttribute(ATTR_DATA_DISPLAY, "1");
        DOM.container.onscroll = null;
        chrome.history.search(SearchOptions, searchToDOM);
    }
};

/**
@type {(e: MouseEvent) => undefined} */
function DOMContainerOnauxclick(e) {
    var target = e.target;
    var DOMType = target.getAttribute(ATTR_DATA_TYPE);
    if (DOMType === DATA_TYPE_ITEM) {
        e.preventDefault();
        var href = target.getAttribute("href");
        TabOptions.url = href;
        TabOptions.active = StorageState.focusTabs;
        chrome.tabs.create(TabOptions, undefined);
    }
}

function DOMContainerOnclick(e) {
    var target = e.target;
    var classAttr = target.getAttribute(ATTR_DATA_TYPE);
    if (classAttr === DATA_TYPE_BREMOVE) {
        const type = target.getAttribute(ATTR_DATA_SET);
        DOMDeleteOnclick(type, target);
        e.preventDefault();
        return;
    }
    if (classAttr === DATA_TYPE_ITEM) {
        if (!e.shiftKey) {
            const url = target.href;
            openLink(url, e.ctrlKey);
            e.preventDefault();
        }
    }
};

function DOMContainerOnkeydown(e) {
    var target = e.target;
    var type = target.getAttribute(ATTR_DATA_TYPE);
    if (type === DATA_TYPE_ITEM) {
        if (e.code === "KeyQ") {
            var DOMDelete = target.lastElementChild.firstElementChild;
            DOMDeleteOnclick(type, DOMDelete);
        }
    }
}

function DOMModalConfigOnclick(e) {
    var target = e.target;
    var domType = target.getAttribute(ATTR_DATA_TYPE);
    if (domType == DATA_TYPE_MODAL || domType === DATA_TYPE_BREMOVE) {
        DOM.modalConfig?.setAttribute("data-display", "0");
    }
}

function DOMModalConfigThemeOnchange(e) {
    var target = e.currentTarget;
    StorageState.theme = target.value;
    document.firstElementChild?.setAttribute("class", target.value);
    chrome.storage.local.set(StorageState, undefined);
}

function DOMModalConfigOpenOnchange(e) {
    var target = e.currentTarget;
    StorageState.open = target.value;
    chrome.storage.local.set(StorageState, undefined);
}

function DOMModalConfigFocusOnchange(e) {
    var target = e.currentTarget;
    StorageState.focusTabs = target.checked;
    chrome.storage.local.set(StorageState, undefined);
}

/**
@type {() => undefined}*/
function main() {
    DOM.loading = document.getElementById("loading");
    if (DOM.loading === null) {
        throw Error("DOM.loading is null");
    }
    DOM.headerButtons = document.getElementById("header_buttons");
    if (DOM.headerButtons === null) {
        throw Error("DOM.headerButtons is null");
    }
    DOM.inputSearch = document.getElementById("input_search");
    if (DOM.inputSearch === null) {
        throw Error("DOM.inputSearch is null");
    }
    DOM.buttonSearch = document.getElementById("button_search");
    if (DOM.buttonSearch === null) {
        throw Error("DOM.buttonSearch is null");
    }
    DOM.noHistory = document.getElementById("no-history");
    if (DOM.noHistory === null) {
        throw Error("DOM.noHistory is null");
    }
    DOM.container = document.getElementById("container");
    if (DOM.container === null) {
        throw Error("DOM.container is null");
    }
    DOM.modalConfig = document.getElementById("modal_config");
    if (DOM.modalConfig === null) {
        throw Error("DOM.modalConfig is null");
    }
    DOM.modalConfigTheme = document.getElementById("modal_config-theme");
    if (DOM.modalConfigTheme === null) {
        throw Error("DOM.modalConfigTheme is null");
    }
    DOM.modalConfigOpen = document.getElementById("modal_config-open");
    if (DOM.modalConfigOpen === null) {
        throw Error("DOM.modalConfigOpen is null");
    }
    DOM.modalConfigFocus = document.getElementById("modal_config-focus");
    if (DOM.modalConfigFocus === null) {
        throw Error("DOM.modalConfigFocus is null");
    }
    DOM.templateRange = document.getElementById("template_range");
    if (DOM.templateRange === null) {
        throw Error("DOM.templateRange is null");
    }
    DOM.templateItem = document.getElementById("template_item");
    if (DOM.templateItem === null) {
        throw Error("DOM.templateItem is null");
    }
    DOM.templateIconDelete = document.getElementById("template_icon-delete");
    if (DOM.templateIconDelete === null) {
        throw Error("DOM.templateIconDelete is null");
    }

    DOM.headerButtons.onclick = DOMHeaderButtonsOnclick;
    DOM.headerButtons.onauxclick = DOMHeaderButtonsOnauxclick;

    DOM.inputSearch.oninput = DOMInputSearchOninput;
    DOM.buttonSearch.onclick = DOMButtonSearchOnclick;

    DOM.container.onscroll = DOMContainerOnscroll;
    DOM.container.onclick = DOMContainerOnclick;
    DOM.container.onauxclick = DOMContainerOnauxclick;
    DOM.container.onkeydown = DOMContainerOnkeydown;

    DOM.modalConfig.onclick = DOMModalConfigOnclick;
    DOM.modalConfigTheme.onchange = DOMModalConfigThemeOnchange;
    DOM.modalConfigOpen.onchange = DOMModalConfigOpenOnchange;
    DOM.modalConfigFocus.onchange = DOMModalConfigFocusOnchange;

    SearchOptions.endTime = Date.now();

    chrome.storage.local.get(undefined, getStorage);
    chrome.tabs.query(
        {active: true, currentWindow: true},
        function (result) {
            CurrentTab = result[0];
            chrome.history.search(SearchOptions, initSearchToDOM);
        }
    );
}

window.addEventListener("DOMContentLoaded", main);
