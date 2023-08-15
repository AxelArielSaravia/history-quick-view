//All this data is from https://developer.chrome.com/docs/extensions/reference

type maybe<T> = T | undefined;
type Chromer = {
    history: Historier,
    tabs: Tabser,
    storage: Storager,
    runtime: Ruintimer,
};

declare var chrome: Chromer
