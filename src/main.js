// Axel Ariel Saravia
// 02-08-2023 (Latam format)

const H_DISPLAY_ATTR = "data-display";
const H_URL_ATTR = "data-url";
const H_RANGE_ATTR = "data-range";
const H_CLASS_ATTR = "data-class";
const H_TYPE_ATTR = "data-type";
const H_ITEM_CLASS = "h-item";
const H_ITEM_SELECTOR = "[data-class=h-item]";
const H_ITEM_MATCHES = "[data-class=h-item] *";
const H_DATE_CLASS = "h-date";
const H_BREMOVE_CLASS = "h-remove";
const H_BREMOVE_SELECTOR = "[data-class=h-remove]";
const H_BREMOVE_MATCHES = "[data-class=h-remove] *";

//Date TimeState Formatters
const TimeStateFormatter = Intl.DateTimeFormat(undefined, {timeStyle: "short"});
const DateFormatter = Intl.DateTimeFormat(undefined, {dateStyle: "full"});

//DOM
const DOMHContainer = document.getElementById("h-container");
const DOMHInputSearch = document.getElementById("h-input-search");
const DOMHButtonSearch = document.getElementById("h-button-search");
const DOMHButtonHistory = document.getElementById("h-button-history");
const DOMHButtonClean = document.getElementById("h-button-clean");
const DOMHButtonMore = document.getElementById("h-button-more");
const DOMHNoHistory = document.getElementById("h-no-history");
const DOMHLoading = document.getElementById("h-loading");
const DOMHModal = document.getElementById("h-modal");
const DOMHConfigOpen = document.getElementById("h-config-open");
const DOMHConfigFocus = document.getElementById("h-config-focus");
const DOMTemplateHItem = document.getElementById("template_h-item");
const DOMTemplateHRange = document.getElementById("template_h-range");
const DOMTemplateHDeleteIcon = document.getElementById("template_h-delete-icon");
const DOMFragment = document.createDocumentFragment();

//utils

const BinarySearch = {
    //The arr have a descending order
    /**
    @type {(startTime: number) => number}*/
    indexOf(arr, target) {
        var end = arr.length;
        if (end < 5) {
            return arr.indexOf(target);
        }
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
    }
};

//state

const StorageState = {
    //focusTabs can be: "0" (no) | "1" (yes)
    focusTabs: "0",
    //open can be: "0" (current Tab) | "1" (new tab)
    open: "0",
};

const ExtensionState = {
    MIN_SEARCH_RESULTS: 30,
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

const SearchOptions = {
    text: "",
    maxResults: ExtensionState.MIN_SEARCH_RESULTS,
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
    end: [],
    start: [],
    count: [],
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
    /**
    @type {(start: number) => number}*/
    getIndex(start) {
        //return -1 if element do not exist
        return BinarySearch.indexOf(RangeState.start, start);
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

const url = new URL("http://t.i");
/**
@type {(src: string) => string} */
function getFavicon(src) {
    url.href = chrome.runtime.getURL("/_favicon/");
    url.searchParams.set("pageUrl", src);
    url.searchParams.set("size", "16");
    return url.toString();
}

/**
@type {(startTime: number) => DOMHRange} */
function createDOMHRange(startTime) {
    const FragmentHRange = DOMTemplateHRange.content.cloneNode(true);
    const DOMHRange = FragmentHRange.firstElementChild;

    //Range header
    const DOMHDate = DOMHRange.firstElementChild;
    const DOMHDTitle = DOMHDate.firstElementChild;
    const dateFormat = DateFormatter.format(startTime);
    DOMHDTitle.textContent = dateFormat;

    const DOMHDDelete = DOMHDate.lastElementChild;
    if (ExtensionState.mode === "d") {
        DOMHDDelete.title = `Remove all browsing history form ${dateFormat}`;
        DOMHDDelete.setAttribute(H_RANGE_ATTR, String(startTime));
        DOMHDDelete.appendChild(DOMTemplateHDeleteIcon.content.cloneNode(true));
    } else {
        DOMHDDelete.setAttribute(H_DISPLAY_ATTR, "0");
    }

    return DOMHRange;
}

/**
@type {(hItem: HistoryItem, startTime: number) => DOMHItem} */
function createDOMHItem(hItem, startTime) {
    var FragmentHItem = DOMTemplateHItem.content.cloneNode(true);
    var DOMHItem = FragmentHItem.firstElementChild;
    DOMHItem.href = hItem.url;
    DOMHItem.title = hItem.title + "\n" + hItem.url;

    var DOMHItemChildren = DOMHItem.children;
    var DOMImg = DOMHItemChildren[0];
    DOMImg.src = getFavicon(hItem.url);

    var DOMTitle = DOMHItemChildren[1];
    if (hItem.title === "") {
        DOMTitle.textContent = hItem.url;
    } else {
        DOMTitle.textContent = hItem.title;
    }

    var DOMRight = DOMHItemChildren[2];


    var DOMRDelete = DOMRight.firstElementChild;
    DOMRDelete.setAttribute(H_URL_ATTR, hItem.url);
    DOMRDelete.setAttribute(H_RANGE_ATTR, String(startTime));
    DOMRDelete.appendChild(DOMTemplateHDeleteIcon.content.cloneNode(true));

    var DOMRTime = DOMRight.lastElementChild;
    DOMRTime.textContent = TimeStateFormatter.format(hItem.lastVisitTime);

    return DOMHItem;
}

/**
@type {(hItems: Array<HistoryItem>) => undefined}*/
function searchToDOM(hItems) {
    if (hItems.length < 1
        // see the error below
        || (hItems.length === 1 && hItems[0].id === ExtensionState.lastItemId)
    ) {
        console.info("No more History");
        ExtensionState.historyFinished = true;
        DOMHLoading.setAttribute(H_DISPLAY_ATTR, "0");
        return;
    }
    var DOMHRange;
    var rangeIndex;
    if (RangeState.length > 0) {
        DOMHRange = DOMHContainer.lastElementChild;
        DOMFragment.appendChild(DOMHRange);

        rangeIndex = RangeState.getIndex(TimeState.start);
    }
    var lastVisitTime;
    var i = 0;

    //Exist an error in the History API:
    // If the diference between th endTime parameter in search method call
    // and the lastVisitTime of a HistoryItem is less than 470ms,
    // that HistoryItem is the first element of the new array
    //We need to check if this error continue happens
    if (hItems[0].id === ExtensionState.lastItemId) {
        i = 1;
    }

    while (i < hItems.length) {
        var hItem = hItems[i];
        lastVisitTime = hItem.lastVisitTime;

        //update range section
        if (TimeState.start > lastVisitTime) {
            TimeState.update(lastVisitTime);

            rangeIndex = RangeState.set(TimeState.end, TimeState.start);
            DOMHRange = createDOMHRange(TimeState.start);
            DOMFragment.appendChild(DOMHRange);
        }
        //bad call, this is associate with the upper Error
        //else if (RangeState.length === 0) {
        //    console.warn("WARNING: The History return bad items.");
        //    DOMHContainer.onscroll = null;
        //    return;
        //}

        ExtensionState.lastItemId = hItem.id;
        ExtensionState.totalItems += 1;
        RangeState.addCount(rangeIndex);

        const DOMHItem = createDOMHItem(hItem, TimeState.start);

        DOMHRange.appendChild(DOMHItem);

        i += 1;
    }

    if (lastVisitTime !== undefined) {
        //The next search must have a diference of 500ms with the
        //last history item lastVisitTime. But sometimes breaks
        SearchOptions.endTime = lastVisitTime;
        DOMHContainer.appendChild(DOMFragment);
    }
    DOMHLoading.setAttribute(H_DISPLAY_ATTR, "0");

}

/**
@type {(hItems: Array<HistoryItem>) => undefined}*/
function handleSearch(HItems) {
    searchToDOM(HItems);
    if (ExtensionState.totalItems < 1) {
        DOMHNoHistory.setAttribute(H_DISPLAY_ATTR, "1");
        return;
    }
    DOMHNoHistory.setAttribute(H_DISPLAY_ATTR, "0");
}

/**
@type {() => undefined}*/
function searchAffterDelete() {
    if (ExtensionState.totalItems < 1) {
        DOMHNoHistory.setAttribute(H_DISPLAY_ATTR, "1");
        return;
    }
    if (!ExtensionState.historyFinished
        && DOMHContainer.clientHeight === DOMHContainer.scrollHeight
    ) {
        chrome.history.search(SearchOptions, handleSearch);
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
function DOMHDeleteClickHandler(type, DOMDelete) {
    if (type === H_ITEM_CLASS) {
        const url = DOMDelete.getAttribute(H_URL_ATTR);
        const rangeKey = DOMDelete.getAttribute(H_RANGE_ATTR);
        if (url === null || rangeKey === null) {
            return;
        }
        const DOMItem = DOMDelete.parentElement.parentElement;
        DeleteURLOptions.url = url;
        chrome.history.deleteUrl(DeleteURLOptions);

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

        searchAffterDelete();

    } else if (type === H_DATE_CLASS) {
        const rangeKey = DOMDelete.getAttribute(H_RANGE_ATTR);
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

        searchAffterDelete();
    }
}

function DOMHContainerScrollHandler(e) {
    if (ExtensionState.historyFinished) {
        return;
    }
    const target = e.currentTarget;

    //end of the current scroll
    if (target.scrollTop === target.scrollHeight - target.clientHeight) {
        DOMHLoading.setAttribute(H_DISPLAY_ATTR, "1");
        chrome.history.search(SearchOptions, searchToDOM);
    }
};

function DOMHInputSearchTimeout(DOMInput) {
    SearchOptions.text = DOMInput.value;
    SearchOptions.endTime = Date.now();

    DOMHLoading.setAttribute(H_DISPLAY_ATTR, "1");

    ExtensionState.reset();
    RangeState.reset();
    TimeState.reset();
    DOMHContainer.replaceChildren();

    chrome.history.search(SearchOptions, handleSearch);
    timeout = undefined;
};

let timeout = undefined;
function DOMHInputSearchInputHandler() {
    if (DOMHInputSearch.value.length === 0) {
        DOMHButtonSearch.setAttribute(H_DISPLAY_ATTR, "0");
        ExtensionState.mode = "d";
    } else {
        DOMHButtonSearch.setAttribute(H_DISPLAY_ATTR, "1");
        ExtensionState.mode = "s";
    }
    if (timeout !== undefined) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(DOMHInputSearchTimeout, 500, DOMHInputSearch);
    DOMHLoading.setAttribute(H_DISPLAY_ATTR, "1");
};

const TabOptions = {
    active: false,
    url: ""
};


/**
@type {(url: string, ctrl: boolean) => undefined}*/
function openLink(url, ctrl) {
    TabOptions.url = url;
    TabOptions.active = (StorageState.focusTabs !== "0");
    if ((StorageState.open === "0") === !ctrl) {
        chrome.tabs.update(CurrentTab.id, TabOptions);
    } else {
        chrome.tabs.create(TabOptions);
    }
}


//Events
DOMHInputSearch.oninput = DOMHInputSearchInputHandler;
DOMHButtonSearch.onclick = function () {
    DOMHInputSearch.value = "";
    DOMHInputSearchInputHandler();
}

let open = false;
DOMHButtonMore.onclick = function () {
    if (open) {
        DOMHModal.setAttribute(H_DISPLAY_ATTR, "0");
    } else {
        DOMHModal.setAttribute(H_DISPLAY_ATTR, "1");
    }
    open = !open;
}

DOMHConfigOpen.onchange = function (e) {
    var target = e.currentTarget;
    StorageState.open = target.value;
    chrome.storage.local.set(StorageState);
}
DOMHConfigFocus.onchange = function (e) {
    var target = e.currentTarget;
    StorageState.focusTabs = target.value;
    chrome.storage.local.set(StorageState);
}

DOMHContainer.onscroll = DOMHContainerScrollHandler;

DOMHButtonClean.onclick = function () {
    TabOptions.url = "chrome://settings/clearBrowserData";
    TabOptions.active = true;
    chrome.tabs.create(TabOptions);
}

DOMHButtonHistory.onclick = function () {
    openLink("chrome://history", false);
}

DOMHContainer.onclick = function (e) {
    var target = e.target;
    var classAttr = target.getAttribute(H_CLASS_ATTR);
    if (classAttr === H_BREMOVE_CLASS
        || target.matches(H_BREMOVE_MATCHES)
    ) {
        const DOMDelete = target.closest(H_BREMOVE_SELECTOR);
        const type = DOMDelete.getAttribute(H_TYPE_ATTR);
        DOMHDeleteClickHandler(type, DOMDelete);
        e.preventDefault();
        return;
    }
    if (classAttr === H_ITEM_CLASS
        || target.matches(H_ITEM_MATCHES)
    ) {
        if (!e.shiftKey) {
            const HItem = target.closest(H_ITEM_SELECTOR);
            const url = HItem.href;
            openLink(url, e.ctrlKey);
            e.preventDefault();
        }
    }
};

//Main
chrome.storage.local.get(undefined, function (data) {
    var open = data.open;
    var focusTabs = data.focusTabs;
    var set = false;
    if (open === undefined || (open !== "0" && open !== "1")) {
        set = true;
    } else {
        StorageState.open = open;
        DOMHConfigOpen.value = open;
    }
    if (focusTabs === null || (focusTabs !== "0" && focusTabs !== "1")) {
        set = true;
    } else {
        StorageState.focusTabs = focusTabs;
        DOMHConfigFocus.value = focusTabs;
    }
    if (set) {
        chrome.storage.local.set(StorageState);
    }
});

chrome.tabs.query(
    {active: true, currentWindow: true},
    function (tabs) {
        CurrentTab = tabs[0];
    }
);

chrome.history.search(SearchOptions, handleSearch);
