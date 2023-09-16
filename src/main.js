// Axel Ariel Saravia
// 02-08-2023 (Latam format)

//@ts-check

const DOM_BUTTON_ATTR = "data-button";
const DOM_HHISTORY_V = "0";
const DOM_HCLEAR_V = "1";
const DOM_HMORE_V = "2";
const DOM_HCLOSE_V = "3";


const DOM_DISPLAY_ATTR = "data-display";
const DOM_URL_ATTR = "data-url";
const DOM_RANGE_ATTR = "data-range";

const DOM_TYPE_ATTR = "data-type";
const DOM_PARENT_ATTR = "data-parent";

const DOM_ITEM_V = "0";
const DOM_ITEM_ATTR = `[${DOM_TYPE_ATTR}="${DOM_ITEM_V}"]`;

const DOM_DATE_V = "1";

const DOM_BREMOVE_V = "2";
const DOM_BREMOVE_ATTR = `[${DOM_TYPE_ATTR}="${DOM_BREMOVE_V}"]`;

const DOM_MODAL_V = "3";

//Date TimeState Formatters
const TimeStateFormatter = Intl.DateTimeFormat(undefined, {timeStyle: "short"});
const DateFormatter = Intl.DateTimeFormat(undefined, {dateStyle: "full"});

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


//state
const StorageState = {
    focusTabs: false,
    //open can be: "0" (current Tab) | "1" (new tab)
    open: "0",
    /**
    @type {"dark"|"light"} */
    theme: "dark",
};

const ExtensionState = {
    MIN_SEARCDOM_RESULTS: 30,
    lastItemId: "",
    totalItems: 0,
    historyFinished: false,
    //mode can be: "d" (default) | "s" (search)
    mode: "d",

    /**
    @type {() => undefined} */
    reset() {
        ExtensionState.lastItemId = "";
        ExtensionState.totalItems = 0;
        ExtensionState.historyFinished = false;
    }
};

let CurrentTab = undefined;

/**@type {QueryDetails} */
const SearchOptions = {
    text: "",
    maxResults: ExtensionState.MIN_SEARCDOM_RESULTS,
    startTime: 0,       //ms
    endTime: Date.now() //ms
};

const TimeState = {
    //60000ms = 1m
    //transform the getTimesoneOffset minutes values to miliseconds
    OFFSET: 60000 * (new Date()).getTimezoneOffset(),
    start: SearchOptions.endTime,
    end: SearchOptions.endTime,

    //Methods
    /**
    @type {(ms: number) => undefined} */
    update(ms) {
        TimeState.end = TimeState.start;
        //86400000ms = 24hs
        //set the 00:00hs of the day that represents ms
        TimeState.start = ms - ((ms - TimeState.OFFSET) % 86400000);
    },
    /**
    @type {() => undefined} */
    reset() {
        var now = Date.now();
        TimeState.end = now;
        TimeState.start = now;
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
    /**
    @type {(i: number) => boolean}*/
    addCount(i) {
        const countArr = RangeState.count;
        if (i < 0 || countArr.length <= i) {
            return false;
        }
        countArr[i] += 1;
        return true;
    },
    // target is start element
    /**
    @type {(target: number) => number}*/
    getIndex(target) {
        var arr = RangeState.start;
        var end = arr.length;
        if (end < 5) {
            return arr.indexOf(target);
        }
        //binary search
        var str = 0;
        var mid = 0 ;
        var el = 0;
        while (str < end) {
            mid = str + Math.floor((end - str) / 2);
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
    set(end, start) {
        RangeState.end.push(end);
        RangeState.start.push(start);
        RangeState.count.push(0);
        RangeState.length += 1
        return RangeState.length - 1;
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

const url = new URL("http://t.i");
/**
@type {(src: string) => string} */
function getFavicon(src) {
    url.href = chrome.runtime.getURL("/_favicon/");
    url.searchParams.set("pageUrl", src);
    url.searchParams.set("size", "16");
    return url.toString();
}

const TabOptions = {
    active: false,
    url: ""
};

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
    const FragmentRange = DOM.templateRange.content.cloneNode(true);
    const DOMRange = FragmentRange.firstElementChild;

    //Range header
    const DOMDate = DOMRange.firstElementChild;
    const DOMDTitle = DOMDate.firstElementChild;
    const dateFormat = DateFormatter.format(startTime);
    DOMDTitle.textContent = dateFormat;

    const DOMDDelete = DOMDate.lastElementChild;
    if (ExtensionState.mode === "d") {
        DOMDDelete.title = `Remove all browsing history form ${dateFormat}`;
        DOMDDelete.setAttribute(DOM_RANGE_ATTR, String(startTime));
        DOMDDelete.appendChild(DOM.templateIconDelete.content.cloneNode(true));
    } else {
        DOMDDelete.setAttribute(DOM_DISPLAY_ATTR, "0");
    }

    return DOMRange;
}

/**
@type {(hitem: HistoryItem, startTime: number) => HTMLDivElement | never} */
function createDOMItem(hitem, startTime) {
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
    DOMRDelete.setAttribute(DOM_URL_ATTR, hitem.url);
    DOMRDelete.setAttribute(DOM_RANGE_ATTR, String(startTime));
    DOMRDelete.appendChild(DOM.templateIconDelete.content.cloneNode(true));

    var DOMRTime = DOMRight.lastElementChild;
    DOMRTime.textContent = TimeStateFormatter.format(hitem.lastVisitTime);

    return DOMItem;
}

/**
@type {(hitems: Array<HistoryItem>) => undefined}*/
function searchToDOM(hitems) {
    if (hitems.length < 1
        // see the error below
        || (hitems.length === 1 && hitems[0].id === ExtensionState.lastItemId)
    ) {
        console.info("No more History");
        ExtensionState.historyFinished = true;
        DOM.loading.setAttribute(DOM_DISPLAY_ATTR, "0");
        return;
    }
    var DOMRange;
    /**@type {maybe<number>}*/
    var rangeIndex;
    if (RangeState.length > 0) {
        DOMRange = DOM.container.lastElementChild;
        DOM.fragment.appendChild(DOMRange);

        rangeIndex = RangeState.getIndex(TimeState.start);
    }
    var lastVisitTime;
    var i = 0;

    //Exist an error in the History API:
    // If the diference between th endTime parameter in search method call
    // and the lastVisitTime of a HistoryItem is less than 470ms,
    // that HistoryItem is the first element of the new array
    //We need to check if this error continue happens
    if (hitems[0].id === ExtensionState.lastItemId) {
        i = 1;
    }

    while (i < hitems.length) {
        var hitem = hitems[i];
        lastVisitTime = hitem.lastVisitTime;
        if (lastVisitTime === undefined) {
            panic("hitem.lastVisitTime is undefined");
        }
        //update range section
        if (TimeState.start > lastVisitTime) {
            TimeState.update(lastVisitTime);

            rangeIndex = RangeState.set(TimeState.end, TimeState.start);
            DOMRange = createDOMRange(TimeState.start);
            DOM.fragment.appendChild(DOMRange);
        }
        //bad call, this is associate with the upper Error
        //else if (RangeState.length === 0) {
        //    console.warn("WARNING: The History return bad items.");
        //    DOMHContainer.onscroll = null;
        //    return;
        //}

        if (rangeIndex === undefined) {
            panic("rangeIndex is undefind");
        }
        ExtensionState.lastItemId = hitem.id;
        ExtensionState.totalItems += 1;
        RangeState.addCount(rangeIndex);

        const DOMItem = createDOMItem(hitem, TimeState.start);

        DOMRange.appendChild(DOMItem);

        i += 1;
    }

    if (lastVisitTime !== undefined) {
        //The next search must have a diference of 500ms with the
        //last history item lastVisitTime. But sometimes breaks
        SearchOptions.endTime = lastVisitTime;
        DOM.container.appendChild(DOM.fragment);
    }
    DOM.loading.setAttribute(DOM_DISPLAY_ATTR, "0");

}

/**
@type {(hItems: Array<HistoryItem>) => undefined}*/
function handleSearch(HItems) {
    searchToDOM(HItems);
    if (ExtensionState.totalItems < 1) {
        DOM.noHistory.setAttribute(DOM_DISPLAY_ATTR, "1");
        return;
    }
    DOM.noHistory.setAttribute(DOM_DISPLAY_ATTR, "0");
}

/**
@type {() => undefined}*/
function searchAfterDelete() {
    if (ExtensionState.totalItems < 1) {
        DOM.noHistory.setAttribute(DOM_DISPLAY_ATTR, "1");
        return;
    }
    if (!ExtensionState.historyFinished
        && DOM.container.clientHeight === DOM.container.scrollHeight
    ) {
        chrome.history.search(SearchOptions, handleSearch);
    }
}

/**
@type {(items: StorageState) => undefined} */
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

const DeleteURLOptions = {
    url: ""
};

const DeleteRangeOptions = {
    endTime:0,
    startTime: 0
};


/**
@type {(type: string, DOMDelete: HTMLButtonElement) => undefined}*/
function DOMDeleteOnclick(type, DOMDelete) {
    if (type === DOM_ITEM_V) {
        const url = DOMDelete.getAttribute(DOM_URL_ATTR);
        const rangeKey = DOMDelete.getAttribute(DOM_RANGE_ATTR);
        if (url === null || rangeKey === null) {
            return;
        }
        const DOMItem = DOMDelete.parentElement.parentElement;
        DeleteURLOptions.url = url;
        chrome.history.deleteUrl(DeleteURLOptions,undefined);

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

        ExtensionState.totalItems -= 1;

        searchAfterDelete();

    } else if (type === DOM_DATE_V) {
        const rangeKey = DOMDelete.getAttribute(DOM_RANGE_ATTR);
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

        ExtensionState.totalItems -= count;

        DeleteRangeOptions.endTime = endTime;
        DeleteRangeOptions.startTime = startTime;
        chrome.history.deleteRange(DeleteRangeOptions);

        const DOMRange = DOMDelete.parentElement.parentElement;
        DOMRange.remove();

        RangeState.remove(rangeIndex);

        searchAfterDelete();
    }
}

function DOMContainerOnscroll(e) {
    if (ExtensionState.historyFinished) {
        return;
    }
    const target = e.currentTarget;

    //end of the current scroll
    if (target.scrollTop >= target.scrollHeight - target.clientHeight - 50) {
        DOM.loading.setAttribute(DOM_DISPLAY_ATTR, "1");
        chrome.history.search(SearchOptions, searchToDOM);
    }
};

/**
@type {(DOMInput: HTMLDivElement) => undefined} */
function DOMInputSearchTimeout(DOMInput) {
    SearchOptions.text = DOMInput.value;
    SearchOptions.endTime = Date.now();

    DOM.loading.setAttribute(DOM_DISPLAY_ATTR, "1");

    ExtensionState.reset();
    RangeState.reset();
    TimeState.reset();
    DOM.container.replaceChildren();

    chrome.history.search(SearchOptions, handleSearch);
    timeout = undefined;
};

let timeout = undefined;

/**
@type {() => undefined} */
function DOMInputSearchOninput() {
    if (DOM.inputSearch.value.length === 0) {
        DOM.buttonSearch.setAttribute(DOM_DISPLAY_ATTR, "0");
        ExtensionState.mode = "d";
    } else {
        DOM.buttonSearch.setAttribute(DOM_DISPLAY_ATTR, "1");
        ExtensionState.mode = "s";
    }
    if (timeout !== undefined) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(DOMInputSearchTimeout, 500, DOM.inputSearch);
    DOM.loading.setAttribute(DOM_DISPLAY_ATTR, "1");
};

/**
@type {(e:MouseEvent) => undefined}*/
function DOMHeaderButtonsOnclick(e) {
    var target = e.target;
    var buttonType = target.getAttribute(DOM_BUTTON_ATTR);
    if (buttonType === DOM_HHISTORY_V) {
        openLink("chrome://history", false);
    } else if (buttonType === DOM_HCLEAR_V) {
        TabOptions.url = "chrome://settings/clearBrowserData";
        TabOptions.active = true;
        chrome.tabs.create(TabOptions, undefined);
    } else if (buttonType === DOM_HMORE_V) {
        DOM.modalConfig?.setAttribute(DOM_DISPLAY_ATTR, "1");
    } else if (buttonType === DOM_HCLOSE_V) {
        window.close();
    }
}

/**
@type {() => undefined}*/
function DOMButtonSearchOnclick() {
    DOM.inputSearch.value = "";
    DOMInputSearchOninput();
}


/**
@type {(e: MouseEvent) => undefined} */
function DOMContainerOnauxclick(e) {
    var target = e.target;
    var DOMType = target.getAttribute(DOM_TYPE_ATTR);
    if (DOMType === DOM_ITEM_V) {
        e.preventDefault();
        var href = target.getAttribute("href");
        TabOptions.url = href;
        TabOptions.active = StorageState.focusTabs;
        chrome.tabs.create(TabOptions, undefined);
    }
}

function DOMContainerOnclick(e) {
    var target = e.target;
    var classAttr = target.getAttribute(DOM_TYPE_ATTR);
    if (classAttr === DOM_BREMOVE_V) {
        const type = target.getAttribute(DOM_PARENT_ATTR);
        DOMDeleteOnclick(type, target);
        e.preventDefault();
        return;
    }
    if (classAttr === DOM_ITEM_V) {
        if (!e.shiftKey) {
            const url = target.href;
            openLink(url, e.ctrlKey);
            e.preventDefault();
        }
    }
};

function DOMModalConfigOnclick(e) {
    var target = e.target;
    var domType = target.getAttribute(DOM_TYPE_ATTR);
    if (domType == DOM_MODAL_V || domType === DOM_BREMOVE_V) {
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
@type {(result: Array<Tab>) => undefined} */
function futureMain(result) {
    CurrentTab = result[0];
    chrome.history.search(SearchOptions, handleSearch);
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

    DOM.inputSearch.oninput = DOMInputSearchOninput;
    DOM.buttonSearch.onclick = DOMButtonSearchOnclick;

    DOM.container.onscroll = DOMContainerOnscroll;
    DOM.container.onclick = DOMContainerOnclick;
    DOM.container.onauxclick = DOMContainerOnauxclick;

    DOM.modalConfig.onclick = DOMModalConfigOnclick;
    DOM.modalConfigTheme.onchange = DOMModalConfigThemeOnchange;
    DOM.modalConfigOpen.onchange = DOMModalConfigOpenOnchange;
    DOM.modalConfigFocus.onchange = DOMModalConfigFocusOnchange;

    chrome.storage.local.get(undefined, getStorage);
    chrome.tabs.query(
        {active: true, currentWindow: true},
        futureMain
    );
}
window.addEventListener("DOMContentLoaded", main);
