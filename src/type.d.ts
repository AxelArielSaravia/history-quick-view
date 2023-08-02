//All this data is from https://developer.chrome.com/docs/extensions/reference/history/

//The transition type for this visit from its referrer
type TransitionType = (
    "link"
    | "typed"
    | "auto_bookmark"
    | "auto_subframe"
    | "manual_subrame"
    | "generated"
    | "auto_toplevel"
    | "form_submit"
    | "reload"
    | "keywork"
    | "keyword_generated"
);

type HistoryItem = {
    //The unique identifier for the item.
    id: string,

    //When this page was last loaded, represented in milliseconds since the epoch.
    lasVisitTime?: number,

    //The title of the page when it was last loaded.
    title?: string,

    //The number of times the user has navigated to this page by typing in the address.
    typedCOunt?: number,

    url?: string,

    //The number of times the user has navigated to this page.
    visitCount?: number,
};

type VisitItem = {
    //The unique identifier for the corresponding history.HistoryItem.
    id: string,

    //True if visit originated on this device.
    //False if it was synced from a different device.
    isLocal: boolean, //chrome 115+

    //The visit id of the referrer.
    referringVisitId: string,

    //The transition type for this visit from its referrer.
    transition: TransitionType,

    //The unique identifier for this visit.
    visitId: string,

    //When this visit occurred, represented in milliseconds since the epoch.
    visitTime?: number,
};

type UrlDetails = {url: string};

type TimeDetails = {
    //Items added to history before this date, represented in milliseconds since the epoch.
    endTime: number,

    //Items added to history after this date, represented in milliseconds since the epoch.
    startTime: number,
};

type QueryDetails = {
    //Limit results to those visited before this date, represented in milliseconds since the epoch
    endTime?: number,

    //The maximum number of result to retrieve. Default to 100.
    maxResult?: number,

    //Limit results to those visited after this date, represented in
    //milliseconds since the epoch. Default to 24 hours in the past.
    startTime?: number,

    //A free-text query to the history service. Leave empty to retrieve all pages.
    text: string,
};

//You cannot use Promises and callbacks on the same function call
interface ChromeHistory_I {
    addUrl(details: UrlDetails, callback?: () => undefined): Promise<undefined>,
    deleteAll(callback?: () => undefined): Promise<undefined>,
    deleteRange(range: TimeDetails, callback?: () => undefined): Promise<undefined>,
    deleteUrl(details: UrlDetails, callback?: () => undefined): Promise<undefined>,
    getVisits(
        details: UrlDetails,
        callback?: (results: Array<VisitItem>) => undefined
    ): Promise<Array<VisitItem>>,
    search(
        query: Array<HistoryItem>,
        callback: (results: Array<HistoryItem>) => undefined
    ): Promise<Array<HistoryItem>>,
}

interface Chrome_I {
    history: ChromeHistory_I
}

declare var chrome: Chrome_I
