"use strict";
//@ts-check

const VERSION = "0.3.3";

const SECOND = 1000 * 60;
const DAY = 1000 * 60 * 60 * 24;

const MAX_SEARCH_RESULTS = 30;
const MIN_SEARCH_RESULTS = 20;

const KEYBOARD_CODE_CLOSE = "KeyQ";
const KEYBOARD_CODE_REMOVE = "KeyR";
const KEYBOARD_CODE_SEARCH = "KeyS";
const KEYBOARD_CODE_MORE = "KeyM";
const KEYBOARD_CODE_KEYBOARD = "KeyK";
const KEYBOARD_CODE_CLEAN = "KeyC";

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

/**
 * @type {null | HTMLElement} */
let relatedFocusTarget = null;
function focusRelatedTarget() {
    relatedFocusTarget?.focus();
    relatedFocusTarget = null;
}

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

const Fragment = document.createDocumentFragment();

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

function closeModal(DOMModal) {
    HHeader.BUTTONS.inert = false;
    HSearch.FORM.inert = false;
    HMain.CONTAINER.inert = false;
    DOMModal?.setAttribute("data-css-hidden", "");
    focusRelatedTarget();
}

const HRange = {
    /** @type {DocumentFragment} */
    TEMPLATE: (function () {
        const template = document.getElementById("template_range");
        if (template === null) {
            throw Error("ERROR: #template_range does not exist");
        }
        if (template.content === null || template.content === undefined) {
            throw Error("ERROR: #template_range does not have content");
        }
        return template.content;
    }()),
    /** @type {DocumentFragment} */
    TEMPLATE_SEARCH: (function () {
        const template = document.getElementById("template_rangesearch");
        if (template === null) {
            throw Error("ERROR: #template_rangesearch does not exist");
        }
        if (template.content === null || template.content === undefined) {
            throw Error("ERROR: #template_rangesearch does not have content");
        }
        return template.content;
    }()),
    /**
     * @type{(startTime: number) => HTMLElement}*/
    create(startTime) {
        const fragment = HRange.TEMPLATE.cloneNode(true);
        const DOMRange = fragment?.firstElementChild;
        DOMRange.starttime = startTime;

        const dateFormat = DateFormatter.format(startTime);
        const DOMTitle = DOMRange?.firstElementChild?.firstElementChild;
        DOMTitle?.insertAdjacentText("beforeend", dateFormat);
        const DOMDelete = DOMRange?.firstElementChild?.lastElementChild;
        DOMDelete?.setAttribute(
            "title",
            `Remove ${dateFormat} browsing history`
        );
        return DOMRange;
    },
    /**
     * @type{(startTime: number) => HTMLElement}*/
    createSearch(startTime) {
        const fragment = HRange.TEMPLATE_SEARCH.cloneNode(true);
        const DOMRangeSearch = fragment?.firstElementChild;
        DOMRangeSearch.starttime = startTime;

        const dateFormat = DateFormatter.format(startTime);
        const DOMTitle = DOMRangeSearch?.firstElementChild?.firstElementChild;
        DOMTitle?.insertAdjacentText("beforeend", dateFormat);
        return DOMRangeSearch;
    },
    /**
     * @type {(DOMRange: HTMLElement, startTime: number) => undefined}*/
    remove(DOMRange, startTime) {
        const i = TimeRange.getStartIndex(startTime);
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
        DOMRange
            .nextElementSibling
            ?.firstElementChild
            ?.lastElementChild
            ?.focus();
        DOMRange.remove();
    }
};

const HItem = {
    /** @type {DocumentFragment} */
    TEMPLATE: (function () {
        const template = document.getElementById("template_item");
        if (template === null) {
            throw Error("ERROR: #template_item does not exist");
        }
        if (template.content === null || template.content === undefined) {
            throw Error("ERROR: #template_item does not have content");
        }
        return template.content;
    }()),
    /**
     * @type{(
        url: string,
        title: string,
        id: string,
        visitTime: number,
     ) => DocumentFragment} */
    create(url, title, id, visitTime) {
        const fragment = HItem.TEMPLATE.cloneNode(true);
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
    },
    /**
     * @type {(
     *  tabsProperties: typeof TabsProperties,
     *  open: STORAGE_OPEN_CURRENT | STORAGE_OPEN_NEW,
     *  ctrl: boolean
     * ) => undefined} */
    open(tabsProperties, open, ctrl) {
        if ((open === STORAGE_OPEN_NEW) === ctrl) {
            chrome.tabs.update(undefined, tabsProperties, undefined);
        } else {
            chrome.tabs.create(tabsProperties, undefined);
        }
    },
    /**
     * @type {(DOMItem: HTMLAnchorElement, startTime: number) => undefined}*/
    remove(DOMItem, startTime) {
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
            DOMRange
                .nextElementSibling
                ?.firstElementChild
                ?.lastElementChild
                ?.focus()
            DOMRange.remove();

            TimeRange.remove(i);
        } else {
            if (DOMItem.nextElementSibling == null) {
                DOMItem
                    .parentElement
                    ?.nextElementSibling
                    ?.firstElementChild
                    ?.lastElementChild
                    ?.focus();
            } else {
                DOMItem.nextElementSibling?.focus();
            }
            DOMItem.remove();
        }
        totalItems -= 1;
    },
};

const HSearch = {
    focus: false,
    /** @type{HTMLElement} */
    FORM: (function () {
        const DOMFormSearch = document.forms.namedItem("search");
        if (DOMFormSearch === null) {
            throw Error("ERROR: forms.search does not exist");
        }
        return DOMFormSearch;
    }()),
    ontimeout() {
        searchTimeout = undefined;

        HHeader.LOADING.setAttribute("data-css-hidden", "");
        HMain.CONTAINER.replaceChildren();

        SearchQuery.endTime = Date.now();
        SearchQuery.text = HSearch.FORM["text"].value;

        TimeRange.reset();
        visited.length = 0;
        totalItems = 0;
        lastItemId = "";
        noMoreContent = false;
        lastRangeIsFull = false;

        HMain.EMPTY.setAttribute("data-css-hidden", "");
        chrome.history.search(SearchQuery, searchToDOM);
        HMain.CONTAINER.onscroll = null;
    },
    oninput() {
        let target = HSearch.FORM["text"];
        if (target.value.length !== 0) {
            searchMode = true;
            HSearch.FORM["remove"].removeAttribute("data-css-hidden");
        } else {
            searchMode = false;
            HSearch.FORM["remove"].setAttribute("data-css-hidden", "");
        }
        if (searchTimeout !== undefined) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(HSearch.ontimeout, 500);
        HHeader.LOADING.removeAttribute("data-css-hidden");
    },
    onclick() {
        HSearch.FORM["text"].value = "";
        HSearch.oninput();
    },
    /**
     * @type {(e: KeyboardEvent) => undefined} */
    keydown(e) {
        if (e.code === KEYBOARD_CODE_CLOSE && e.ctrlKey) {
            HSearch.onclick();
        }
    },
};

const HHeader = {
    /** @type{HTMLElement} */
    LOADING: (function () {
        const loading = document.getElementById("h_loading");
        if (loading === null) {
            throw Error("ERROR: #h_loading does not exist");
        }
        return loading;
    }()),
    /** @type{HTMLElement} */
    BUTTONS: (function () {
        const buttons = document.getElementById("h_buttons");
        if (buttons === null) {
            throw Error("ERROR: #h_buttons does not exist");
        }
        return buttons;
    }()),
    /**
     * @type {(e: MouseEvent) => undefined}*/
    onauxclick(e) {
        let target = e.target;
        let name = target.getAttribute("name");
        if (name === "history") {
            TabsProperties.url = "about://history"
            chrome.tabs.create(TabsProperties, undefined);
        }
    },
    openClear() {
        let temp = TabsProperties.active
        TabsProperties.url = "about://settings/clearBrowserData";
        TabsProperties.active = true;
        chrome.tabs.create(TabsProperties, undefined);
        TabsProperties.active = temp;
    },
    /**
     * @type {(e: MouseEvent) => undefined}*/
    onclick(e) {
        let target = e.target;
        let name = target.getAttribute("name");
        if (name === "history") {
            TabsProperties.url = "about://history"
            HItem.open(TabsProperties, storage.open, e.ctrlKey);

        } else if (name === "clear") {
            HHeader.openClear();

        } else if (name === "more") {
            HModalMore.open();

        } else if (name === "keyboard") {
            HModalKeyboard.open();

        } else if (name === "close") {
            window.close();
        }
    }
};

const HMain = {
    /** @type{HTMLElement} */
    EMPTY: (function() {
        const empty = document.getElementById("m_empty");
        if (empty === null) {
            throw Error("ERROR: #m_empty does not exist");
        }
        return empty;
    }()),
    /** @type{HTMLElement} */
    CONTAINER: (function () {
        const container = document.getElementById("m_container");
        if (container === null) {
            throw Error("ERROR: #m_container does not exist");
        }
        return container;
    }()),
    onscroll() {
        if (noMoreContent) {
            return;
        }
        if (HMain.CONTAINER.scrollTop
            >= (HMain.CONTAINER.scrollHeight - HMain.CONTAINER.clientHeight - 50)
        ) {
            HHeader.LOADING.removeAttribute("data-css-hidden");
            chrome.history.search(SearchQuery, searchToDOM);
            HMain.CONTAINER.onscroll = null;
        }
    },
    /**
     * @type {(e: MouseEvent) => undefined} */
    onclick(e) {
        const target = e.target;
        let type = target.getAttribute("data-type");
        if (type === "remove") {
            e.preventDefault();
            let datafor = target.getAttribute("data-for");
            let DOMParent = target?.parentElement;
            let DOMRange = DOMParent?.parentElement;
            let starttime = DOMRange?.starttime;
            if (starttime === undefined) {
                console.error("ERROR: starttime prototype doesn't exist");
                return;
            }
            if (datafor === "item") {
                HItem.remove(DOMParent, starttime);
                searchAgain();
            } else if (datafor === "date") {
                HRange.remove(DOMRange, starttime);
                searchAgain();
            }
        } else if (type === "item") {
            if (!e.shiftKey) {
                e.preventDefault();
                const url = target.href;
                TabsProperties.url = url;
                HItem.open(TabsProperties, storage.open, e.ctrlKey);
            }
        }
    },
    /**
     * @type {(e: MouseEvent) => undefined} */
    onauxclick(e) {
        let target = e.target;
        if (target.getAttribute("data-type") === "item") {
            e.preventDefault();
            let href = target?.getAttribute("href");
            if (href === null || href === undefined) {
                console.error('ERROR: [data-type="item"] does not have "href" attribute')
                return;
            }
            TabsProperties.url = href;
            chrome.tabs.create(TabsProperties, undefined);
        }
    },
    /**
     * @type {(e: KeyboardEvent) => undefined} */
    onkeyup(e) {
        let target = e.target;
        let type = target.getAttribute("data-type");
        if (type === "item" && e.code === KEYBOARD_CODE_REMOVE) {
            if (e.ctrlKey) {
                return;
            }
            if (e.shiftKey) {
                if (!searchMode) {
                    const DOMRange = target.parentElement;
                    const starttime = DOMRange?.starttime;
                    if (starttime === undefined) {
                        console.error('ERROR: .range does not have starttime property');
                    } else {
                        HRange.remove(DOMRange, starttime);
                        searchAgain();
                    }
                }
            } else {
                const DOMRange = target.parentElement;
                const starttime = DOMRange?.starttime;
                if (starttime === undefined) {
                    console.error('ERROR: .range does not have starttime property');
                } else {
                    HItem.remove(target, starttime);
                    searchAgain();
                }
            }
        }
    }
};

const HModalKeyboard = {
    /** @type{HTMLElement} */
    MODAL: (function (){
        const DOMModal = document.getElementById("modal_keyboard");
        if (DOMModal === null) {
            throw Error("ERROR: #modal_keyboard does not exist");
        }
        return DOMModal;
    }()),
    open() {
        if (relatedFocusTarget === null) {
            if (document.activeElement === null
                || document.activeElement === document.body
            ) {
                relatedFocusTarget = HHeader.BUTTONS.children["keyboard"];
            } else {
                relatedFocusTarget = document.activeElement;
            }
        }
        HHeader.BUTTONS.inert = true;
        HSearch.FORM.inert = true;
        HMain.CONTAINER.inert = true;

        HModalKeyboard.MODAL.removeAttribute("data-css-hidden");
        HModalKeyboard.MODAL
            .firstElementChild
            .firstElementChild
            .lastElementChild
            .focus();
    }
};

const HModalMore = {
    MODAL: (function () {
        const modal = document.getElementById("modal_more");
        if (modal === null) {
            throw Error("ERROR: #modal_config does not exist");
        }
        return modal;
    }()),
    FORM: (function () {
        const form = document.forms.namedItem("more");
        if (form === null) {
            throw Error("ERRORP: forms.config does not exist")
        }
        return form;
    }()),
    /**
     * @type {(s: typeof storage) => undefined}*/
    init(s) {
        document.firstElementChild.setAttribute("class", s.theme);
        HModalMore.FORM["theme"].value = s.theme;
        HModalMore.FORM["open"].value = s.open;
        HModalMore.FORM["focus"].checked = s.focusTabs;
    },
    open() {
        if (relatedFocusTarget === null) {
            if (document.activeElement === null
                || document.activeElement === document.body
            ) {
                relatedFocusTarget = HHeader.BUTTONS.children["more"];
            } else {
                relatedFocusTarget = document.activeElement;
            }
        }
        HHeader.BUTTONS.inert = true;
        HSearch.FORM.inert = true;
        HMain.CONTAINER.inert = true;

        HModalMore.MODAL.removeAttribute("data-css-hidden");
        HModalMore.FORM["theme"].focus();
    },
    /**
     * @type {(e: InputEvent) => undefined} */
    onchange(e) {
        let target = e.target;
        let name = target.getAttribute("name");
        let storageChange = false;
        if (name === "theme") {
            if (
                target.value === STORAGE_THEME_DARK
                    || target.value === STORAGE_THEME_LIGHT
            ) {
                storage.theme = target.value;
                document.firstElementChild.setAttribute("class", target.value);
                storageChange = true;
            } else {
                target.value = STORAGE_THEME_DARK;
                document.firstElementChild.setAttribute("class", STORAGE_THEME_DARK);
                if (storage.theme !== STORAGE_THEME_DARK) {
                    storage.theme = STORAGE_THEME_DARK;
                    storageChange = true;
                }
                console.error("WARNNING: the theme value was wrong, it will set the default");
            }
        } else if (name === "open") {
            if (
                target.value === STORAGE_OPEN_NEW
                    || target.value === STORAGE_OPEN_CURRENT
            ) {
                storage.open = target.value;
                storageChange = true;
            } else {
                target.value = STORAGE_OPEN_CURRENT;
                if (storage.open !== STORAGE_OPEN_CURRENT) {
                    storage.open = STORAGE_OPEN_CURRENT;
                    storageChange = true;
                }
                console.error("WARNNING: the open value was wrong, it will set the default");
            }
        } else if (name === "focus") {
            storage.focusTabs = target.checked;
            TabsProperties.active = storage.focusTabs;
            storageChange = true;
        }
        if (storageChange) {
            chrome.storage.local.set(storage, undefined);
        }
    },
};

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
            HMain.EMPTY.removeAttribute("data-css-hidden");
        } else {
            if (Fragment.children.length > 0) {
                let DOMRange = HMain.CONTAINER.lastElementChild;
                if (DOMRange !== null) {
                    DOMRange.appendChild(Fragment);
                }
            }
        }
        lastRangeIsFull = false;
        HHeader.LOADING.setAttribute("data-css-hidden", "");
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
            DOMRange = HRange.createSearch(timeRangeStart);
            HMain.CONTAINER.appendChild(DOMRange);
        } else {
            DOMRange = HRange.create(timeRangeStart);
            HMain.CONTAINER.appendChild(DOMRange);
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
                DOMRange = HRange.createSearch(timeRangeStart);
                HMain.CONTAINER.appendChild(DOMRange);
            } else {
                DOMRange = HRange.create(timeRangeStart);
                HMain.CONTAINER.appendChild(DOMRange);
            }
        } else {
            DOMRange = HMain.CONTAINER.lastElementChild;
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

        Fragment.appendChild(
            HItem.create(item.url, item.title, item.id, lastVisitTime)
        );

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
        DOMRange.appendChild(Fragment);
        return chrome.history.search(SearchQuery, searchToDOM);
    } else {
        itemsFromSearch = 0;
        SearchQuery.maxResults = MAX_SEARCH_RESULTS;

        HHeader.LOADING.setAttribute("data-css-hidden", "");
        DOMRange.appendChild(Fragment);
        HMain.CONTAINER.onscroll = HMain.onscroll;
    }
}


function searchAgain() {
    if (noMoreContent) {
        if (totalItems < 1) {
            HMain.EMPTY.removeAttribute("data-css-hidden");
        }
        return;
    }
    if (HMain.CONTAINER.scrollTop
        >= (HMain.CONTAINER.scrollHeight - HMain.CONTAINER.clientHeight - 50)
    ) {
        HHeader.LOADING.setAttribute("data-css-hidden", "");
        chrome.history.search(SearchQuery, searchToDOM);
        HMain.CONTAINER.onscroll = null;
    }
}


/**
 * @type {(e: MouseEvent) => undefined}*/
function HModalOnclick(e) {
    let target = e.target;
    if (target?.getAttribute("data-action") === "close") {
        closeModal(e.currentTarget);
    }
}

/**
 * @type {(e: KeyboardEvent) => undefined}*/
function DocumentOnkeyup (e) {
    if (!HModalMore.MODAL.hasAttribute("data-css-hidden")) {
        if (e.code === KEYBOARD_CODE_CLOSE || e.code === KEYBOARD_CODE_MORE) {
            closeModal(HModalMore.MODAL);
        }
    } else if (!HModalKeyboard.MODAL.hasAttribute("data-css-hidden")) {
        if (e.code === KEYBOARD_CODE_CLOSE || e.code === KEYBOARD_CODE_KEYBOARD) {
            closeModal(HModalKeyboard.MODAL);
        }
    } else {
        if (e.ctrlKey || e.shiftKey) {
            return;
        }
        if (e.code === KEYBOARD_CODE_SEARCH) {
            HSearch.FORM["text"].focus();
            return;

        }
        if (document.activeElement !== HSearch.FORM["text"]) {
            if (e.code === KEYBOARD_CODE_KEYBOARD) {
                HModalKeyboard.open();
            } else if (e.code === KEYBOARD_CODE_MORE) {
                HModalMore.open();
            } else if (e.code === KEYBOARD_CODE_CLEAN) {
                HHeader.openClear();
            }
        }
    }
}

chrome.storage.local.get(
    undefined,
    /**@type{(items: typeof storage) => undefined}*/
    function (items) {
        initStorage(items);
        HModalMore.init(storage);

        SearchQuery.endTime = Date.now();
        //throws
        chrome.history.search(SearchQuery, searchToDOM);

        document.addEventListener("keyup", DocumentOnkeyup, false);

        HHeader.BUTTONS.addEventListener("click", HHeader.onclick, false);
        HHeader.BUTTONS.addEventListener("auxclick", HHeader.onauxclick, false);

        HSearch.FORM["text"].addEventListener("input", HSearch.oninput, false);
        HSearch.FORM["remove"].addEventListener("click", HSearch.onclick, false);
        HSearch.FORM.addEventListener("keydown", HSearch.keydown, false);

        HMain.CONTAINER.onscroll = HMain.onscroll;
        HMain.CONTAINER.addEventListener("click", HMain.onclick, false);
        HMain.CONTAINER.addEventListener("auxclick", HMain.onauxclick, false);
        HMain.CONTAINER.addEventListener("keyup", HMain.onkeyup, false);

        HModalMore.MODAL.addEventListener("click", HModalOnclick, false);
        HModalMore.FORM.addEventListener("change", HModalMore.onchange, false);

        HModalKeyboard.MODAL.addEventListener("click", HModalOnclick, false);
    }
);
