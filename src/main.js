"use strict";

//@ts-check

//version: 0.4.2

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

const InitSearchQuery = {
    endTime: 0,
    text: ""
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
    theme: STORAGE_THEME_DARK,
    showSearch: true,
};

//Global Variables

/**@type{undefined | number}*/
let searchTimeout = undefined;
let searchDateTimeout = undefined;
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
    /**@type{(n: number) => boolean}*/
    addElements(n) {
        if (TimeRange.length > 0) {
            const elements = TimeRange.elements;
            elements[TimeRange.length - 1] += n;
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
        if (end < start
            || (
                TimeRange.length > 0
                && (
                    end > TimeRange.starts[TimeRange.length-1]
                    || start === TimeRange.starts[TimeRange.length-1]
                )
            )
        ) {
            return -1;
        }
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
        if (TimeRange.add(start + DAY, start) === -1) {
            return -1;
        };
        return start + DAY;
    }
};

const DateParser = {
    MAX_VAL:       730,
    MAX_WEEK_VAL:  240,
    MAX_MONTH_VAL: 120,
    MAX_YEAR_VAL:  10,

    WDAYS_LEN: 7,
    WDAYS_SHORT: [
        "mo","tu","we","th",
        "fr","sa","su"
    ],
    WDAYS_LONG: [
        "monday","tuesday","wednesday","thursday",
        "friday","saturday", "sunday"
    ],
    MONTH_LEN: 12,
    MONTH_SHORT: [
        "Jan","Feb","Mar","Apr",
        "May","Jun","Jul","Aug",
        "Sep","Oct","Nov","Dec"
    ],
    MONTH_LONG: [
        "January",  "February","March",   "April",
        "May",      "June",    "July",    "August",
        "September","October", "November","December"
    ],
    MONTH_DAYS: (function() {
        let year = (new Date()).getFullYear();
        let feb = 28;
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            feb = 29;
        }
        return [31,feb,31,30,31,30,31,31,30,31,30,31];
    }()),
    /**
     * return MONTH_<SHORT|LONG> index if success, otherwise -1
     * @type {(month: string) => number}*/
    checkMonth(month) {
        for (let j = 0; j < DateParser.MONTH_LEN; j += 1) {
            if ((month.length === 3 && month === DateParser.MONTH_SHORT[j])
                || month === DateParser.MONTH_LONG[j]
            ) {
                return j;
            }
        }
        return -1;
    },
    /**
     * Expected string: "YYYY"
     * return -1 if error, otherwise year
     * @type {(year: string, tyear: number) => number}*/
    parseYear(year, tyear) {
        if (year.length !== 4) {
            return -1;
        }
        let nyear = Number(year);
        if (Number.isNaN(nyear)
            || !Number.isFinite(nyear)
            || nyear > tyear
            || nyear < (tyear-DateParser.MAX_YEAR_VAL)
        ) {
            return -1;
        }
        return nyear;
    },
    /**
     * Parse <datecalc> expression
     * <datecalc>:
     *  "-NN[ PP]"
     *  <-><num>[<space><period>]
     *
     * <period>:
     *  - day:   "d" | "day"   | "days"
     *  - week:  "w" | "week"  | "weeks"
     *  - month: "m" | "month" | "months"
     *  - year:  "y" | "year"  | "years"
     *
     * examples:
     *      "-4 d"
     *      "-1 week"
     *      "-5 months"
     *
     * periords values: 
     *  - day:   1..MAX_DAY_VAL
     *  - week:  1..MAX_WEEK_VAL
     *  - month: 1..MAX_MONTH_VAL
     *  - year:  1..MAX_YEAR_VAL
     *
     * returns <endtime> if success, otherwise -1
     * @type{(expr: string) => number}*/
    parseDatecalc(expr) {
        //TODO: Concat <dateclac> like "<datecalc>, <datecalc>, ..."
        let res = -1;
        let i = expr.indexOf(" ");
        if (i == -1) {
            i = expr.length;
        } else if (i+1 >= expr.length) {
            return res;
        }
        let val = Number(expr.slice(0,i));
        if (Number.isNaN(val)
            || !Number.isFinite(val)
            || val < 1
            || DateParser.MAX_VAL < val
        ) {
            return res;
        }
        if (i === expr.length) {
            res = TimeRange.createStart(Date.now()) + DAY - (DAY * val);
            return res;
        }
        let kword = expr.slice(i+1);
        if (kword === "d" || kword == "day" || kword === "days") {
            res = TimeRange.createStart(Date.now()) + DAY - (DAY * val);
        } else if (kword === "w" || kword == "week" || kword === "weeks") {
            if (val > DateParser.MAX_WEEK_VAL) {
                return res;
            }
            res = TimeRange.createStart(Date.now() - (DAY * 7 * val)) + DAY;
        } else if (kword === "m" || kword == "month" || kword === "months") {
            if (val > DateParser.MAX_MONTH_VAL) {
                return res;
            }
            let d = new Date();
            d.setMonth(d.getMonth() - val);
            res = TimeRange.createStart(d.valueOf()) + DAY;
        } else if (kword === "y" || kword == "year" || kword === "years") {
            if (val > DateParser.MAX_YEAR_VAL) {
                return res;
            }
            let d = new Date();
            d.setFullYear(d.getFullYear() - val);
            res = TimeRange.createStart(d.valueOf()) + DAY;
        }
        return res;
    },
    /**
     * Parse <dateexpr1> expression
     *
     * <dateexpr1>:
     * "DD MM[ YYYY]"
     *  <Day><space><MonthFull|MonthShort>[<space><Year>]
     *
     *  example:
     *      "1 Oct" "1 October"
     *      "1 Oct 2020" "1 October 2020"
     *
     * returns <endtime> if success, otherwise -1
     * @type {(
     *  dexp: string,
     *  d: Date,
     *  tyear: number,
     *  tmonth: number,
     *  tday: number
     * ) => number} */
    parseDateexpr1(dexp, d, tyear, tmonth, tday) {
        let nyear = tyear;
        let nmonth = tmonth;
        let nday = tday;
        if (dexp.length < 5) {//expect min: "d mmm"
            return -1;
        }
        //search nday
        let p1 = dexp.indexOf(" ");
        if (p1 === -1) {
            return -1;
        }
        let sub = dexp.slice(0, p1);
        nday = Number(sub);
        if (Number.isNaN(nday)
            && !Number.isFinite(nday)
            && nday < 1
        ) {
            return -1;
        }
        if (dexp.length - (p1 + 1) < 3) { //expect min: "mmm"
            return -1;
        }
        //search month expression
        let p2 = dexp.indexOf(" ", p1+1);
        if (p2 == -1) {
            p2 = dexp.length;
        }
        sub = dexp.slice(p1+1, p2);
        nmonth = DateParser.checkMonth(sub);
        if (nmonth === -1
            || nday > DateParser.MONTH_DAYS[nmonth]
        ) {
            return -1;
        }
        if (p2 < dexp.length) {
            //check year expression
            sub = dexp.slice(p2+1);
            if (sub.length === 0) {
                return -1;
            }
            nyear = DateParser.parseYear(sub, tyear);
            if (nyear === -1) {
                return -1;
            }
            if (tyear === nyear
                && (
                    nmonth > tmonth
                    || (nmonth === tmonth && nday > tday)
                )
            ) {
                return -1;
            }
        } else if (tyear === nyear
            && (
                nmonth > tmonth
                || (nmonth === tmonth && nday > tday)
            )
        ) {
            nyear -= 1;
        }
        d.setDate(nday);
        d.setMonth(nmonth);
        d.setFullYear(nyear)
        return TimeRange.createStart(d.valueOf())+DAY;
    },
    /**
     * Parse <dateexpr1> expression
     *
     * <dateexpr1>:
     *  "MM[ DD[ YYYY]]"
     *  <monthfull|monthshort>[<space>{<day>|<year>}]
     *
     *  example:
     *      "Oct" "October",           <- shows from the end of the month
     *      "Oct 2023" "October 2023"  <- shows from the end of the month
     *      "Oct 1" "October 1"
     *      "Oct 1 2023" "October 1 2023"
     *
     * returns <endtime> if success, otherwise -1
     * @type {(
     *  dexp: string,
     *  d: Date,
     *  tyear: number,
     *  tmonth: number,
     *  tday: number
     * ) => number} */
    parseDateexpr2(dexp, d, tyear, tmonth, tday) {
     // <MonthFull|MonthShort>[<space>{<Day>|<Year>}]
        let nyear = tyear;
        let nmonth = tmonth;
        let nday = tday;
        if (dexp.length < 3) { //min expect: "mmm"
            return -1;
        }

        let p1 = dexp.indexOf(" ");
        if (p1 === -1) {
            p1 = dexp.length;
        }
        let sub = dexp.slice(0, p1);
        nmonth = DateParser.checkMonth(sub);
        if (nmonth === -1) {
            return -1;
        }
        if (p1 === dexp.length) {
            if (nmonth !== tmonth) {
                if (nmonth > tmonth) {
                    nyear -= 1;
                }
                nday = DateParser.MONTH_DAYS[nmonth];
            }
        } else {
            let p2 = dexp.indexOf(" ", p1+1);
            if (p2 === -1) {
                p2 = dexp.length;
            }

            sub = dexp.slice(p1+1, p2);
            if (sub.length === 4) { //assume that is a year
                nyear = DateParser.parseYear(sub);
                if (nyear === -1) {
                    return -1;
                }
                if (nyear === tyear && nmonth > tmonth) {
                    return -1;
                }
                nday = DateParser.MONTH_DAYS[nmonth];

            } else { //asume that is a day
                nday = Number(sub);
                if (Number.isNaN(nday)
                    || !Number.isFinite(nday)
                    || nday < 1
                    || nday > DateParser.MONTH_DAYS[nmonth]
                ) {
                    return -1;
                }
                if (p2 < dexp.length) {
                    //search year
                    sub = dexp.slice(p2+1);
                    if (sub.length === 0) {
                        return -1;
                    }
                    nyear = DateParser.parseYear(sub);
                    if (nyear === -1) {
                        return -1;
                    }
                    if (tyear === nyear
                        && (
                            nmonth > tmonth
                            || (nmonth === tmonth && nday > tday)
                        )
                    ) {
                        return -1;
                    }
                } else {
                    if (nmonth > tmonth || (nmonth === tmonth && nday > tday)) {
                        nyear -= 1;
                    }
                }
            }
        }
        d.setDate(nday);
        d.setMonth(nmonth);
        d.setFullYear(nyear)
        return TimeRange.createStart(d.valueOf())+DAY;
    },
    /**
     * Parse diferent date expressions:
     *  - "y" | "yesterday"
     *  - <weekDayShort>: "mo" "tu" "we" "th" "fr" "sa" "su"
     *  - <weekDayLong>: "monday" "tuesday" "wednesday" "thursday" "friday" "saturday" "sunday"
     *  - <datecalc>: <-><num>[<space><period>]
     *  - <dateexp1>: <Day><space><MonthFull|MonthShort>[<space><Year>]
     *  - <dateexp2>: <MonthFull|MonthShort>[<space><Day>[<space><Year>]]
     *
     * return <endtime>ms if success, otherwise -1
     * @type{(dateStr: string) => number}*/
    parse(expr) {
        if (expr.length === 0) {
            return -1;
        }
        let d = new Date();
        let twday = d.getDay();
        let tday = d.getDate();
        let tmonth = d.getMonth();
        let tyear = d.getFullYear();

        if (expr === "y") { //yesterday
            return TimeRange.createStart(Date.now());
        } else if (expr[0] === "-") {
            expr = expr.slice(1);
            if (expr.length === 0) {
                return -1;
            }
            return DateParser.parseDatecalc(expr);
        } else if ("1" <= expr[0] && expr[0] <= "9") {
            return DateParser.parseDateexpr1(expr, d, tyear, tmonth, tday);
        } else if (expr === "yesterday") {
            return TimeRange.createStart(Date.now());
        }
        //check <wday> expression
        if (expr.length === 2) {
            for (let i = 0; i < DateParser.WDAYS_LEN; i += 1) {
                if (expr === DateParser.WDAYS_SHORT[i]) {
                    let n = twday - (i+1);
                    if (n <= 0) {
                        n += 7;
                    }
                    return TimeRange.createStart(Date.now()) - (DAY * (n - 1))
                }

            }
        } else if (expr.length < 10) {
            for (let i = 0; i < DateParser.WDAYS_LEN; i += 1) {
                if (expr === DateParser.WDAYS_LONG[i]) {
                    let n = twday - (i+1);
                    if (n <= 0) {
                        n += 7;
                    }
                    return TimeRange.createStart(Date.now()) - (DAY * (n - 1))
                }

            }
        }
        return DateParser.parseDateexpr2(expr, d, tyear, tmonth, tday);
    },
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
    let showSearch = items.showSearch;
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
    if (showSearch !== undefined) {
        storage.showSearch = showSearch;
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
    /** @type{HTMLElement} */
    FORM: (function () {
        const DOMFormSearch = document.forms.namedItem("search");
        if (DOMFormSearch === null) {
            throw Error("ERROR: forms.search does not exist");
        }
        return DOMFormSearch;
    }()),
    TIMEOUT: 500, //ms
    ontimeout() {
        searchTimeout = undefined;
        const text = HSearch.FORM["text"].value;
        if (InitSearchQuery.text !== text) {
            InitSearchQuery.text = text;
            SearchQuery.text = text;
            SearchQuery.endTime = InitSearchQuery.endTime;

            HMain.CONTAINER.replaceChildren();

            TimeRange.reset();
            visited.length = 0;
            totalItems = 0;
            lastItemId = "";
            noMoreContent = false;
            lastRangeIsFull = false;

            HMain.EMPTY.setAttribute("data-css-hidden", "");

            chrome.history.search(SearchQuery, searchToDOM);

            HMain.CONTAINER.onscroll = null;
        } else {
            HHeader.LOADING.setAttribute("data-css-hidden", "");
        }
    },
    ondatetimeout() {
        searchDateTimeout = undefined;
        const text = HSearch.FORM["text"].value;
        const target = HSearch.FORM["date"]
        let endtime = 0;
        if (target.value.length === 0) {
            endtime = TimeRange.createStart(Date.now()) + DAY;
        } else {
            endtime = DateParser.parse(target.value);
            if (endtime === -1) {
                target.setAttribute("data-css-invalid", "");
                HHeader.LOADING.setAttribute("data-css-hidden", "");
                return;
            }
        }
        if (InitSearchQuery.endTime !== endtime
            || InitSearchQuery.text !== text
        ) {
            InitSearchQuery.endTime = endtime;
            SearchQuery.endTime = endtime;

            HMain.CONTAINER.replaceChildren();

            TimeRange.reset();

            visited.length = 0;
            totalItems = 0;
            lastItemId = "";
            noMoreContent = false;
            lastRangeIsFull = false;

            chrome.history.search(SearchQuery, searchToDOM);

            HMain.CONTAINER.onscroll = null;
        } else {
            HHeader.LOADING.setAttribute("data-css-hidden", "");
        }
    },
    oninput() {
        let target = HSearch.FORM["text"];
        if (target.value.length !== 0) {
            searchMode = true;
            HSearch.FORM["clear-text"].removeAttribute("data-css-hidden");
        } else {
            searchMode = false;
            HSearch.FORM["clear-text"].setAttribute("data-css-hidden", "");
        }
        if (searchTimeout !== undefined) {
            clearTimeout(searchTimeout);
        }
        HHeader.LOADING.removeAttribute("data-css-hidden");
        searchTimeout = setTimeout(HSearch.ontimeout, HSearch.TIMEOUT);
    },
    ondateinput() {
        let target = HSearch.FORM["date"];
        target.removeAttribute("data-css-invalid");
        if (searchDateTimeout !== undefined) {
            clearTimeout(searchDateTimeout);
        }
        HHeader.LOADING.removeAttribute("data-css-hidden");
        searchDateTimeout = setTimeout(HSearch.ondatetimeout, HSearch.TIMEOUT);
    },
    clear() {
        if (searchTimeout !== undefined) {
            clearTimeout(searchTimeout);
            searchTimeout = undefined;
        }
        let text = HSearch.FORM["text"].value;
        searchMode = false;
        HSearch.FORM["text"].value = "";
        if (text.length !== 0) {
            HSearch.oninput();
        } else {
            HSearch.FORM["clear-text"].setAttribute("data-css-hidden", "");
            HHeader.LOADING.setAttribute("data-css-hidden", "");
        }
    },
    /**
     * @type {(e: KeyboardEvent) => undefined} */
    keydown(e) {
        const target = e.target;
        const name = target.getAttribute("name");
        if (name === "text") {
            if (e.code === KEYBOARD_CODE_CLOSE && e.ctrlKey) {
                HSearch.clear();
            }
        } else if (name === "date") {
            if (e.code === KEYBOARD_CODE_CLOSE && e.ctrlKey) {
                target.value = "";
                HSearch.ondateinput();
            }
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
    /**
     * @type{(url: string) => undefined}*/
    openActiveTab(url) {
        let temp = TabsProperties.active
        TabsProperties.url = url;
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
            HHeader.openActiveTab("about://settings/clearBrowserData");

        } else if (name === "more") {
            HModalMore.open();

        } else if (name === "keyboard") {
            HModalKeyboard.open();

        } else if (name === "close") {
            window.close();
        } else if (name === "about") {
            HHeader.openActiveTab("https://github.com/AxelArielSaravia/history-quick-view#history-quick-view");
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
        if (s.showSearch) {
            HSearch.FORM.removeAttribute("data-css-hidden");
        } else {
            HSearch.FORM.setAttribute("data-css-hidden", "");
        }
        HModalMore.FORM["theme"].value = s.theme;
        HModalMore.FORM["open"].value = s.open;
        HModalMore.FORM["focus"].checked = s.focusTabs;
        HModalMore.FORM["showsearch"].checked = s.showSearch;
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
                storageChange = true;
            } else {
                target.value = STORAGE_THEME_DARK;
                if (storage.theme !== STORAGE_THEME_DARK) {
                    storage.theme = STORAGE_THEME_DARK;
                    storageChange = true;
                }
                console.error("WARNNING: the theme value was wrong, it will set the default");
            }
            document.firstElementChild.setAttribute("class", target.value);
        } else if (name === "showsearch") {
            storage.showSearch = target.checked;
            if (target.checked) {
                HSearch.FORM.removeAttribute("data-css-hidden");
            } else {
                HSearch.FORM.setAttribute("data-css-hidden", "");
            }
            storageChange = true;
        } else if (name === "open") {
            if (target.value === STORAGE_OPEN_NEW
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


const HError = {
    COMPONENT: (function () {
        const DOMError = document.getElementById("m_error");
        if (DOMError === null) {
            throw Error("ERRORP: #m_error does not exist")
        }
        return DOMError;
    }()),
    /**@type{(msg:string) => undefined}*/
    set(msg) {
        HMain.CONTAINER.replaceChildren();
        HMain.EMPTY.setAttribute("data-css-hidden", "");
        HError.COMPONENT.children["msg"].textContent = msg;
        HError.COMPONENT.removeAttribute("data-css-hidden");

        HSearch.FORM["text"].removeEventListener("input", HSearch.oninput, false);
        HSearch.FORM["clear-text"].removeEventListener("click", HSearch.clear, false);
        HSearch.FORM["date"].removeEventListener("input", HSearch.ondateinput, false);
        HSearch.FORM.removeEventListener("keydown", HSearch.keydown, false);

        HMain.CONTAINER.onscroll = null;
        HMain.CONTAINER.removeEventListener("click", HMain.onclick, false);
        HMain.CONTAINER.removeEventListener("auxclick", HMain.onauxclick, false);
        HMain.CONTAINER.removeEventListener("keyup", HMain.onkeyup, false);

        throw Error(msg);
    }
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
        if (historyItems[0].lastVisitTime < SearchQuery.endTime) {
            timeRangeStart = TimeRange.createStart(
                historyItems[0].lastVisitTime
            );
            timeRangeEnd = timeRangeStart + DAY;
            console.info("New range");
            console.info("timeRangeEnd:", timeRangeEnd);
            console.info("timeRangeStart:", timeRangeStart);
        } else {
            timeRangeEnd = SearchQuery.endTime;
        }
    } else {
        timeRangeEnd = TimeRange.getLastEnd();
        timeRangeStart = TimeRange.getLastStart();

        if (historyItems[0].id === lastItemId) {
            i = 1;
        }
        console.info("timeRangeEnd:", timeRangeEnd);
        console.info("timeRangeStart:", timeRangeStart);
    }

    let lastVisitTime = 0;
    let item = historyItems[i];
    let itemsCreated = 0;

    while (i < historyItems.length) {
        item = historyItems[i];
        if (item.lastVisitTime < timeRangeStart) {
            lastVisitTime = item.lastVisitTime;
            console.info("End of range");
            break;
        }
        if (item.visitCount > 1 || timeRangeEnd < item.lastVisitTime) {
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
                    i += 1;
                    continue;
                }
                let visitTime = getClosestVisit(visits, timeRangeEnd);
                if (visitTime < 0) {
                    i += 1;
                    continue
                }
                lastVisitTime = visitTime;

                if (timeRangeStart === 0) {
                    timeRangeStart = TimeRange.createStart(visitTime);
                    timeRangeEnd = timeRangeStart + DAY;
                    console.info("timeRangeEnd:", timeRangeEnd);
                    console.info("timeRangeStart:", timeRangeStart);
                } else if (lastVisitTime < timeRangeStart) {
                    console.info("End of range");
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

        itemsCreated += 1;
        i += 1;
    }
    console.info("item:")
    console.info("\tlastVisitTime:", lastVisitTime);
    console.info("\turl:", item.url);


    if (TimeRange.length == 0) {
        if (-1 === TimeRange.add(timeRangeEnd, timeRangeStart)) {
            HError.set("Creating Time Range fails");
        }
        if (searchMode) {
            DOMRange = HRange.createSearch(timeRangeStart);
        } else {
            DOMRange = HRange.create(timeRangeStart);
        }
        HMain.CONTAINER.appendChild(DOMRange);
    } else if (lastRangeIsFull) {
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
        HError.set("DOMRange is null");
    }

    TimeRange.addElements(itemsCreated);

    totalItems += itemsCreated;
    itemsFromSearch += itemsCreated;

    console.info("items created:", itemsCreated);
    console.info("items from search:", itemsFromSearch);
    console.info("total items:", totalItems);

    if (i < historyItems.length) {
        //new range
        lastRangeIsFull = true;
        visited.length = 0;
        console.info("New range");
        let t = TimeRange.addFrom(lastVisitTime);
        if (t === -1) {
            HError.set("Creating Time Range fails");
        }
        SearchQuery.endTime = t
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
        if (document.activeElement !== HSearch.FORM["text"]
            && document.activeElement !== HSearch.FORM["date"]
        ) {
            if (e.code === KEYBOARD_CODE_SEARCH) {
                HSearch.FORM["text"].focus();
            }else if (e.code === KEYBOARD_CODE_KEYBOARD) {
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


        SearchQuery.endTime = TimeRange.createStart(Date.now()) + DAY;
        InitSearchQuery.endTime = SearchQuery.endTime;
        //throws
        chrome.history.search(SearchQuery, searchToDOM);

        document.addEventListener("keyup", DocumentOnkeyup, false);

        HHeader.BUTTONS.addEventListener("click", HHeader.onclick, false);
        HHeader.BUTTONS.addEventListener("auxclick", HHeader.onauxclick, false);

        HSearch.FORM["text"].addEventListener("input", HSearch.oninput, false);
        HSearch.FORM["clear-text"].addEventListener("click", HSearch.clear, false);
        HSearch.FORM["date"].addEventListener("input", HSearch.ondateinput, false);
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
