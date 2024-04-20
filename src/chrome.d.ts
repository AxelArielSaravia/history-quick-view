//chrome extension API
//https://developer.chrome.com/docs/extensions/reference/api/

//Author: axarisar


declare var chrome: {
    action: ChromeExtensionAPI.Action
    alarms: ChromeExtensionAPI.Alarms
    bookmarks: ChromeExtensionAPI.Bookmarks
    browsingData: ChromeExtensionAPI.BrowsingData
    dom: ChromeExtensionAPI.Dom
    extension: ChromeExtensionAPI.Extension
    history: ChromeExtensionAPI.History
    runtime: ChromeExtensionAPI.Runtime
    scripting: ChromeExtensionAPI.Scripting
    storage: ChromeExtensionAPI.Storage
    tabs: ChromeExtensionAPI.Tabs
}


declare namespace ChromeExtensionAPI {
//action
//https://developer.chrome.com/docs/extensions/reference/api/action

//Author: axarisar
//Date: 13/04/2024

//must include events.d.ts
//must include tabs.d.ts

/**
 *
 * [ColorArray](https://developer.chrome.com/docs/extensions/mv2/reference/browserAction#type-ColorArray)
 */
type ColorArray = [number, number, number, number]

/**
 *
 * [OpenPopupOptions](https://developer.chrome.com/docs/extensions/reference/api/action#type-OpenPopupOptions)
 */
type OpenPopupOptions = {
    /**
     * The ID of the window to open the action popup in. Defaults to the
     * currently-active window if unspecified.
     */
    windowId: undefined | number
}
/**
 *
 * [TabDetails](https://developer.chrome.com/docs/extensions/reference/api/action#type-TabDetails)
 */
type TabDetails = {
    /**
     * The ID of the tab to query state for. If no tab is specified, the
     * non-tab-specific state is returned.
     */
    tabId: undefined | number
}

/**
 *
 * [UserSettings](https://developer.chrome.com/docs/extensions/reference/api/action#type-UserSettings)
 */
type UserSettings = {
    /**
     * Whether the extension's action icon is visible on browser windows'
     * top-level toolbar (i.e., whether the extension has been 'pinned' by the
     * user).
     */
    isOnToolbar: boolean
}

/**
 *
 * [chrome.action](https://developer.chrome.com/docs/extensions/reference/api/action)
 */
interface Action {
    /**
     * Disables the action for a tab.
     *
     * [disable()](https://developer.chrome.com/docs/extensions/reference/api/action#method-disable)
     */
    disable(tabId: undefined | number, callback: () => undefined): undefined,
    disable(tabId: undefined | number): Promise<undefined>,

    /**
     * Enables the action for a tab. By default, actions are enabled.
     *
     * [enable()](https://developer.chrome.com/docs/extensions/reference/api/action#method-enable)
     */
    enable(tablId: undefined| number, callback: () => undefined): undefined,
    enable(tablId: undefined| number): Promise<undefined>,

    /**
     * Gets the background color of the action.
     *
     * [getBadgeBackgroundColor()](https://developer.chrome.com/docs/extensions/reference/api/action#method-getBadgeBackgroundColor)
     */
    getBadgeBackgroundColor(
        details: TabDetails,
        callback: (result: ColorArray) => undefined
    ): undefined,
    getBadgeBackgroundColor(
        details: TabDetails
    ): Promise<ColorArray>,

    /**
     * Gets the badge text of the action. If no tab is specified, the
     * non-tab-specific badge text is returned. If
     * displayActionCountAsBadgeText is enabled, a placeholder text will be
     * returned unless the declarativeNetRequestFeedback permission is present
     * or tab-specific badge text was provided.
     *
     * [getBadgeText()](https://developer.chrome.com/docs/extensions/reference/api/action#method-getBadgeText)
     */
    getBadgeText(
        details: TabDetails,
        callback: (result: string) => undefined
    ): undefined,
    getBadgeText(details: TabDetails): Promise<string>,

    /**
     * Gets the text color of the action.
     *
     * [getBadgeTextColor()](https://developer.chrome.com/docs/extensions/reference/api/action#method-getBadgeTextColor)
     */
    getBadgeTextColor(
        details: TabDetails,
        callback: (result: ColorArray) => undefined
    ): undefined,
    getBadgeTextColor(details: TabDetails): Promise<ColorArray>,

    /**
     * Gets the html document set as the popup for this action.
     *
     * [getPopup()](https://developer.chrome.com/docs/extensions/reference/api/action#method-getPopup)
     */
    getPopup(
        details: TabDetails,
        callback: (result: string) => undefined
    ): undefined,
    getPopup(details: TabDetails): Promise<string>,

    /**
     * Gets the title of the action.
     *
     * [getTitle()](https://developer.chrome.com/docs/extensions/reference/api/action#method-getTitle)
     */
    getTitle(
        details: TabDetails,
        callback: (result: string) => undefined
    ): undefined,
    getTitle(details: TabDetails): Promise<string>,

    /**
     * Returns the user-specified settings relating to an extension's action.
     *
     * [getUserSettings()](https://developer.chrome.com/docs/extensions/reference/api/action#method-getUserSettings)
     */
    getUserSettings(
        callback: (userSettings: UserSettings) => undefined
    ): undefined,
    getUserSettings(): Promise<UserSettings>,

    /**
     * Indicates whether the extension action is enabled for a tab (or globally
     * if no tabId is provided). Actions enabled using only declarativeContent
     * always return false.
     *
     * [isEnabled()](https://developer.chrome.com/docs/extensions/reference/api/action#method-isEnabled)
     */
    isEnabled(
        tabId: undefined | number,
        callback: (isEnabled: boolean) => undefined
    ): undefined,
    isEnabled(tabId: undefined | number): Promise<boolean>,

    /**
     *
     * [openPopup()](https://developer.chrome.com/docs/extensions/reference/api/action#method-openPopup)
     */
    openPopup(
        options: undefined | OpenPopupOptions,
        callback: () => undefined
    ): undefined,
    openPopup(options: undefined | OpenPopupOptions): Promise<undefined>,

    /**
     *
     * [setBadgeBackgroundColor()](https://developer.chrome.com/docs/extensions/reference/api/action#method-setBadgeBackgroundColor)
     */
    setBadgeBackgroundColor(
        details: {
            color: string | ColorArray,
            tabId: undefined | number
        },
        callback: () => undefined
    ): undefined,
    setBadgeBackgroundColor(
        details: {
            color: string | ColorArray,
            tabId: undefined | number
        }
    ): Promise<undefined>,

    /**
     * Sets the badge text for the action. The badge is displayed on top of the
     * icon.
     *
     * [setBadgeText()](https://developer.chrome.com/docs/extensions/reference/api/action#method-setBadgeText)
     */
    setBadgeText(
        details: {
            tabId: undefined | number,
            text: undefined | string
        },
        callback: () => undefined
    ): undefined,
    setBadgeText(
        details: {
            tabId: undefined | number,
            text: undefined | string
        }
    ): Promise<undefined>,

    /**
     *
     * [setBadgeTextColor()](https://developer.chrome.com/docs/extensions/reference/api/action#method-setBadgeTextColor)
     */
    setBadgeTextColor(
        detais: {
            color: string | ColorArray,
            tabId: undefined | number
        },
        callback: () => undefined
    ): undefined,
    setBadgeTextColor(
        detais: {
            /**
             * Not setting this value will cause a color to be automatically
             * chosen that will contrast with the badge's background color so
             * the text will be visible. Colors with alpha values equivalent to
             * 0 will not be set and will return an error.
             */
            color: string | ColorArray,
            tabId: undefined | number
        }
    ): Promise<undefined>,

    /**
     * Sets the icon for the action. The icon can be specified either as the
     * path to an image file or as the pixel data from a canvas element, or as
     * dictionary of either one of those. Either the path or the imageData
     * property must be specified.
     *
     * [setIcon()](https://developer.chrome.com/docs/extensions/reference/api/action#method-setIcon)
     */
    setIcon(
        details: {
            /**
             * Either an ImageData object or a dictionary {size -> ImageData}
             * representing icon to be set. If the icon is specified as a
             * dictionary, the actual image to be used is chosen depending on
             * screen's pixel density. If the number of image pixels that fit
             * into one screen space unit equals scale, then image with size
             * scale * n will be selected, where n is the size of the icon in
             * the UI. At least one image must be specified. Note that
             * 'details.imageData = foo' is equivalent to
             * 'details.imageData = {'16': foo}'
             */
            imageData: undefined | ImageData | object,
            path: undefined | string | object,
            /**
             * Limits the change to when a particular tab is selected.
             * Automatically resets when the tab is closed.
             */
            tabId: undefined | number
        },
        callback: () => undefined,
    ): undefined,
    setIcon(
        details: {
            /**
             * Either an ImageData object or a dictionary {size -> ImageData}
             * representing icon to be set. If the icon is specified as a
             * dictionary, the actual image to be used is chosen depending on
             * screen's pixel density. If the number of image pixels that fit
             * into one screen space unit equals scale, then image with size
             * scale * n will be selected, where n is the size of the icon in
             * the UI. At least one image must be specified. Note that
             * 'details.imageData = foo' is equivalent to
             * 'details.imageData = {'16': foo}'
             */
            imageData: undefined | ImageData | object,
            path: undefined | string | object,
            /**
             * Limits the change to when a particular tab is selected.
             * Automatically resets when the tab is closed.
             */
            tabId: undefined | number
        }
    ): Promise<undefined>,

    /**
     * Sets the HTML document to be opened as a popup when the user clicks on
     * the action's icon.
     *
     * [setPopup()](https://developer.chrome.com/docs/extensions/reference/api/action#method-setPopup)
     */
    setPopup(
        details: {
            popup: string,
            tabId: undefined | number
        },
        callback: () => undefined
    ): undefined,
    setPopup(
        details: {
            popup: string,
            tabId: undefined | number
        }
    ): Promise<undefined>,

    /**
     *
     * [setTitle()](https://developer.chrome.com/docs/extensions/reference/api/action#method-setTitle)
     */
    setTitle(
        details: {
            tabId: undefined | number,
            title: string
        },
        callback: () => undefined
    ): undefined,
    setTitle(
        details: {
            tabId: undefined | number,
            title: string
        }
    ): Promise<undefined>,

    /**
     * Fired when an action icon is clicked. This event will not fire if the
     * action has a popup.
     *
     * [onClicked](https://developer.chrome.com/docs/extensions/reference/api/action#event-onClicked)
     */
    onClicked: Event<(tab: Tab) => undefined>,
}
//alarms
//https://developer.chrome.com/docs/extensions/reference/api/alarms

//Author: axarisar
//Date: 13/04/2024

//Chrome 120: Starting in Chrome 120, the minimum alarm interval has been
//reduced from 1 minute to 30 seconds. For an alarm to trigger in 30 seconds,
//set periodInMinutes: 0.5.

//Chrome 117: Starting in Chrome 117, the number of active alarms is limited to
//500. Once this limit is reached, chrome.alarms.create() will fail. When using
//a callback, chrome.runtime.lastError will be set. When using promises, the
//promise will be rejected.

/**
 *
 * [Alarm](https://developer.chrome.com/docs/extensions/reference/api/alarms#type-Alarm)
 */
type Alarm = {
    name: string,
    periodInMinutes: undefined | number,
    /**
     * Time at which this alarm was scheduled to fire, in milliseconds past the
     * epoch (e.g. Date.now() + n). For performance reasons, the alarm may have
     * been delayed an arbitrary amount beyond this.
     */
    scheduledTime: number,
}

/**
 *
 * [AlarmCreateInfo](https://developer.chrome.com/docs/extensions/reference/api/alarms#type-AlarmCreateInfo)
 */
type AlarmCreateInfo = {
    /**
     * Length of time in minutes after which the onAlarm event should fire.
     */
    delayInMinutes: undefined | number,
    /**
     * If set, the onAlarm event should fire every periodInMinutes minutes
     * after the initial event specified by when or delayInMinutes. If not set,
     * the alarm will only fire once.
     */
    periodInMinutes: undefined | number,
    /**
     * Time at which the alarm should fire, in milliseconds past the epoch
     */
    when: undefined | number
}

/**
 *
 * [chrome.alarms](https://developer.chrome.com/docs/extensions/reference/api/alarms)
 */
interface Alarms {
    /**
     * Clears the alarm with the given name.
     *
     * [clear()](https://developer.chrome.com/docs/extensions/reference/api/alarms#method-clear)
     */
    clear(
        name: undefined | string,
        callback: (wasCleared: boolean) => undefined
    ): undefined,
    clear(name: undefined | string): Promise<boolean>,

    /**
     *
     * [clearAll()](https://developer.chrome.com/docs/extensions/reference/api/alarms#method-clearAll)
     */
    clearAll(callback: (wasCleared: boolean) => undefined): undefined,
    clearAll(): Promise<boolean>,

    /**
     * Creates an alarm. Near the time(s) specified by alarmInfo, the onAlarm
     * event is fired. If there is another alarm with the same name (or no name
     * if none is specified), it will be cancelled and replaced by this alarm.
     *
     * In order to reduce the load on the user's machine, Chrome limits alarms
     * to at most once every 30 seconds but may delay them an arbitrary amount
     * more. That is, setting delayInMinutes or periodInMinutes to less than
     * 0.5 will not be honored and will cause a warning. when can be set to
     * less than 30 seconds after "now" without warning but won't actually
     * cause the alarm to fire for at least 30 seconds.
     *
     * [create()](https://developer.chrome.com/docs/extensions/reference/api/alarms#method-create)
     */
    create(
        name: undefined | string,
        /**
         * The initial time must be specified by either when or delayInMinutes
         * (but not both). If periodInMinutes is set, the alarm will repeat
         * every periodInMinutes minutes after the initial event. If neither
         * when or delayInMinutes is set for a repeating alarm, periodInMinutes
         * is used as the default for delayInMinutes.
         */
        alarmInfo: AlarmCreateInfo,
        callback: () => undefined,
    ): undefined,
    create(
        name: undefined | string,
        /**
         * The initial time must be specified by either when or delayInMinutes
         * (but not both). If periodInMinutes is set, the alarm will repeat
         * every periodInMinutes minutes after the initial event. If neither
         * when or delayInMinutes is set for a repeating alarm, periodInMinutes
         * is used as the default for delayInMinutes.
         */
        alarmInfo: AlarmCreateInfo
    ): Promise<undefined>,

    /**
     * Retrieves details about the specified alarm.
     *
     * [get()](https://developer.chrome.com/docs/extensions/reference/api/alarms#method-get)
     */
    get(
        name: undefined | string,
        callback: (alarm: undefined | Alarm) => undefined
    ): undefined,
    get(name: undefined | string): Promise<undefined | Alarm>,

    /**
     * Gets an array of all the alarms.
     *
     * [getAll()](https://developer.chrome.com/docs/extensions/reference/api/alarms#method-getAll)
     */
    getAll(callback: (alarms: Array<Alarm>) => undefined): undefined,
    getAll(): Promise<Array<Alarm>>,

    /**
     * Fired when an alarm has elapsed. Useful for event pages.
     *
     * [onAlarm](https://developer.chrome.com/docs/extensions/reference/api/alarms#event-onAlarm)
     */
    onAlarm: Event<(alarm: Alarm) => undefined>
}
//bookmarks
//https://developer.chrome.com/docs/extensions/reference/api/bookmarks

//Author: axarisar
//Date: 13/04/2024

//Must include events.d.ts

/**
 *
 * [BookmarkTreeNode](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#type-BookmarkTreeNode)
 */
type BookmarkTreeNode = {
    /**
     * An ordered list of children of this node.
     */
    children: undefined | Array<BookmarkTreeNode>,

    /**
     * When this node was created, in milliseconds since the epoch
     * (new Date(dateAdded)).
     */
    dateAdded: undefined | number,

    /**
     * When the contents of this folder last changed, in milliseconds since
     * the epoch.
     */
    dateGroupModified: undefined | number,

    /**
     * When this node was last opened, in milliseconds since the epoch. Not set
     * for folders.
     */
    dateLastUsed: undefined | number,

    /**
     * The unique identifier for the node. IDs are unique within the current
     * profile, and they remain valid even after the browser is restarted.
     */
    id: string,

    /**
     * The 0-based position of this node within its parent folder.
     */
    index: undefined | number,

    /**
     * The id of the parent folder. Omitted for the root node.
     */
    parentId: undefined | string,

    /**
     * The text displayed for the node.
     */
    title: string,

    /**
     * Indicates the reason why this node is unmodifiable. The managed value
     * indicates that this node was configured by the system administrator or
     * by the custodian of a supervised user. Omitted if the node can be
     * modified by the user and the extension (default).
     */
    unmodificable: undefined | "managed",

    /**
     * The URL navigated to when a user clicks the bookmark. Omitted for 
     * folders.
     */
    url: undefined | string,
};

/**
 * Indicates the reason why this node is unmodifiable. The managed value
 * indicates that this node was configured by the system administrator. Omitted
 * if the node can be modified by the user and the extension (default).
 *
 * [BookmarkTreeNodeUnmodifiable](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#type-BookmarkTreeNodeUnmodifiable)
 */
type BookmarkTreeNodeUnmodifiable = "managed"

/**
 *
 * [CreateDetails](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#type-CreateDetails)
 */
type CreateDetails = {
    index: undefined | number,
    //Defaults to the Other Bookmarks folder.
    parentId: undefined | string,
    title: undefined | string,
    url: undefined | string,
};

/**
 *
 * [chrome.bookmarks](https://developer.chrome.com/docs/extensions/reference/api/bookmarks)
 */
interface Bookmarks {
    /**
     * Creates a bookmark or folder under the specified parentId. If url is
     * NULL or missing, it will be a folder.
     *
     * [create()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-create)
     */
    create(
        bookmark: CreateDetails,
        callback: (result: BookmarkTreeNode) => undefined
    ): undefined,
    create(bookmark: CreateDetails): Promise<BookmarkTreeNode>,

    /**
     * Retrieves the specified BookmarkTreeNode(s).
     *
     * [get()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-get)
     */
    get(
        idOridList: string | [string,...Array<string>],
        callback: (results: Array<BookmarkTreeNode>) => undefined
    ): undefined,
    get(
        idOridList: string | [string,...Array<string>]
    ): Promise<Array<BookmarkTreeNode>>,

    /**
     * Retrieves the children of the specified BookmarkTreeNode id.
     *
     * [getChildren(0](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-getChildren)
     */
    getChildren(
        id: string,
        callback: (results: Array<BookmarkTreeNode>) => undefined,
    ): undefined,
    getChildren(id: string): Promise<Array<BookmarkTreeNode>>,

    /**
     * Retrieves the recently added bookmarks.
     *
     * [getRecent()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-getRecent)
     */
    getRecent(
        numberOfItems: number,
        callback: (results: Array<BookmarkTreeNode>) => undefined,
    ): undefined,
    getRecent(numberOfItems: number): Promise<Array<BookmarkTreeNode>>,

    /**
     * Retrieves part of the Bookmarks hierarchy, starting at the specified node
     *
     * [getSubTree()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-getSubTree)
     */
    getSubTree(
        id: string,
        callback: (results: Array<BookmarkTreeNode>) => undefined,
    ): undefined,
    getSubTree(id: string): Promise<Array<BookmarkTreeNode>>,

    /**
     * Retrieves the entire Bookmarks hierarchy.
     *
     * [getTree()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-getTree)
     */
    getTree(
        callback: (results: Array<BookmarkTreeNode>) => undefined,
    ): undefined,
    getTree(): Promise<Array<BookmarkTreeNode>>,

    /**
     * Moves the specified BookmarkTreeNode to the provided location.
     *
     * [move()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-move)
     */
    move(
        id: string,
        destination: {
            index: undefined | number,
            parentId: undefined | string
        },
        callback: (result: BookmarkTreeNode) => undefined,
    ): undefined,
    move(
        id: string,
        destination: {
            index: undefined | number,
            parentId: undefined | string
        }
    ): Promise<BookmarkTreeNode>,

    /**
     * Removes a bookmark or an empty bookmark folder.
     *
     * [remove()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-remove)
     */
    remove( id: string, callback: () => undefined): undefined,
    remove( id: string): Promise<undefined>,

    /**
     * Recursively removes a bookmark folder.
     *
     * [removeTree()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-remove)
     */
    removeTree( id: string, callback: () => undefined): undefined,
    removeTree( id: string): Promise<undefined>,

    /**
     * Searches for BookmarkTreeNodes matching the given query. Queries
     * specified with an object produce BookmarkTreeNodes matching all
     * specified properties.
     *
     * [search()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-search)
     */
    search(
        query: string | {
            query: undefined | string,
            title: undefined | string,
            url: undefined | string
        },
        callback: (results: Array<BookmarkTreeNode>) => undefined
    ): undefined,
    search(
        query: string | {
            query: undefined | string,
            title: undefined | string,
            url: undefined | string
        }
    ): Promise<Array<BookmarkTreeNode>>,

    /**
     * Updates the properties of a bookmark or folder. Specify only the
     * properties that you want to change; unspecified properties will be left
     * unchanged. Note: Currently, only 'title' and 'url' are supported.
     *
     * [update()](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#method-update)
     */
    update(
        id: string,
        changes: {
            title: undefined | string,
            url: undefined | string
        },
        callback: (result: BookmarkTreeNode) => undefined
    ): undefined,
    update(
        id: string,
        changes: {
            title: undefined | string,
            url: undefined | string
        }
    ): Promise<BookmarkTreeNode>,


    //Events

    /**
     * Fired when a bookmark or folder changes. Note: Currently, only title and
     * url changes trigger this.
     *
     * [onChanged](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#event-onChanged)
     */
    onChanged: Event<(
        id: string,
        changeInfo: {
            title: string,
            url: undefined | string
        }
    ) => undefined>,

    /**
     * Fired when the children of a folder have changed their order due to the
     * order being sorted in the UI. This is not called as a result of a move().
     *
     * [onChildrenReordered](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#event-onChildrenReordered)
     */
    onChildrenReordered: Event<(
        id: string,
        reorderInfo: {
            id: string,
            reorderInfo: {childIds: Array<string>},
        }
    ) => undefined>,

    /**
     * Fired when a bookmark or folder is created.
     *
     * [onCreate](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#event-onCreated)
     */
    onCreate: Event<(
        id: string,
        bookmark: BookmarkTreeNode
    ) => undefined>,

    /**
     * Fired when a bookmark import session is begun. Expensive observers
     * should ignore onCreated updates until onImportEnded is fired. Observers
     * should still handle other notifications immediately.
     *
     * [onImportBegan](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#event-onImportBegan)
     */
    onImportBegan: Event<() => undefined>,

    /**
     * Fired when a bookmark import session is ended.
     *
     * [onImportEnded](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#event-onImportEnded)
     */
    onImportEnded: Event<() => undefined>,

    /**
     * Fired when a bookmark or folder is moved to a different parent folder.
     *
     * [onMoved](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#event-onMoved)
     */
    onMoved: Event<(
        id: string,
        moveInfo: {
            index: number,
            oldIndex: number,
            oldParentId: string,
            parentId: string
        }
    ) => undefined>,

    /**
     * Fired when a bookmark or folder is removed. When a folder is removed 
     * recursively, a single notification is fired for the folder, and none for
     * its contents.
     *
     * [onRemoved](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#event-onMoved)
     */
    onRemoved: Event<(
        id: string,
        removeInfo: {
            index: number,
            node: BookmarkTreeNode,
            parentId: string
        }
    ) => undefined>
}
//browsingData
//https://developer.chrome.com/docs/extensions/reference/api/browsingData

//Author: axarisar
//Date: 13/04/2024

//Must include events.d.ts

/**
 * A set of data types. Missing data types are interpreted as false.
 *
 * [DataTypeSet](https://developer.chrome.com/docs/extensions/reference/api/browsingData#type-DataTypeSet)
 */
type DataTypeSet = {
    appcache: undefined | boolean,
    cache: undefined | boolean,
    cacheStorage: undefined | boolean,
    cookies: undefined | boolean,
    downloads: undefined | boolean,
    fileSystems: undefined | boolean,
    formData: undefined | boolean,
    history: undefined | boolean,
    indexedDB: undefined | boolean,
    localStorage: undefined | boolean,
    passwords: undefined | boolean,
    serviceWorkers: undefined | boolean,
    webSWL: undefined | boolean
}

/**
 *
 * [RemovalOprtions](https://developer.chrome.com/docs/extensions/reference/api/browsingData#type-RemovalOptions)
 */
type RemovalOptions = {
    /**
     * When present, data for origins in this list is excluded from deletion.
     * Can't be used together with origins. Only supported for cookies, storage
     * and cache. Cookies are excluded for the whole registrable domain.
     */
    excludeOrigins: undefined | Array<string>,

    /**
     * An object whose properties specify which origin types ought to be
     * cleared. If this object isn't specified, it defaults to clearing only
     * "unprotected" origins. Please ensure that you really want to remove
     * application data before adding 'protectedWeb' or 'extensions'.
     */
    originTypes: undefined | {
        /**
         * Extensions and packaged applications a user has installed 
         * (be _really_ careful!).
         */
        extension: undefined | boolean,

        /**
         * Websites that have been installed as hosted applications
         * (be careful!).
         */
        protectedWeb: undefined | boolean,

        /**
         * Normal websites.
         */
        unprotectedWeb: undefined | boolean,
    }

    /**
     * When present, only data for origins in this list is deleted. Only
     * supported for cookies, storage and cache. Cookies are cleared for the
     * whole registrable domain.
     */
    origins: undefined | Array<string>,

    /**
     * Remove data accumulated on or after this date, represented in
     * milliseconds since the epoch (accessible via the getTime method of the
     * JavaScript Date object). If absent, defaults to 0 (which would remove
     * all browsing data).
     */
    since: undefined | number
}

/**
 *
 * [chrome.browsingData](https://developer.chrome.com/docs/extensions/reference/api/browsingData)
 */
interface BrowsingData {
    /**
     * Clears various types of browsing data stored in a user's profile.
     *
     * [remove()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-remove)
     */
    remove(
        options: RemovalOptions,
        dataToRemove: DataTypeSet,
        callback: () => undefined
    ): undefined,
    remove(
        options: RemovalOptions,
        dataToRemove: DataTypeSet,
        callback: undefined
    ): Promise<undefined>,

    /**
     *
     * [removeAppcache()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeAppcache)
     */
    removeAppcache(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeAppcache(options: RemovalOptions,): Promise<undefined>,

    /**
     *
     * [removeCache()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeCache)
     */
    removeCache(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeCache(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeCacheStorage()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeCacheStorage)
     */
    removeCacheStorage(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeCacheStorage(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeCookies()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeCookies)
     */
    removeCookies(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeCookies(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeDownloads()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeDownloads)
     */
    removeDownloads(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeDownloads(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeFileSystems()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeFileSystems)
     */
    removeFileSystems(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeFileSystems(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeFormData()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeFileSystems)
     */
    removeFormData(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeFormData(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeHistory()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeHistory)
     */
    removeHistory(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeHistory(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeIndexedDB()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeHistory)
     */
    removeIndexedDB(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeIndexedDB(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeLocalStorage()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeLocalStorage)
     */
    removeLocalStorage(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeLocalStorage(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removePasswords()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removePasswords)
     */
    removePasswords(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removePasswords(options: RemovalOptions): Promise<undefined>,

    /**
     * Deprecated!!
     *
     * [removePluginData()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removePluginData)
     */
    removePluginData(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removePluginData(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeServiceWorkers()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeServiceWorkers)
     */
    removeServiceWorkers(
        options: RemovalOptions,
        callback: () => undefined
    ): undefined,
    removeServiceWorkers(options: RemovalOptions): Promise<undefined>,

    /**
     *
     * [removeWebSQL()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-removeWebSQL)
     */
    removeWebSQL(options: RemovalOptions, callback: () => undefined): undefined,
    removeWebSQL(options: RemovalOptions): Promise<undefined>,

    /**
     * Reports which types of data are currently selected in the 'Clear
     * browsing data' settings UI. Note: some of the data types included in
     * this API are not available in the settings UI, and some UI settings
     * control more than one data type listed here.
     *
     * [settings()](https://developer.chrome.com/docs/extensions/reference/api/browsingData#method-settings)
     */
    settings(
        callback: (result: {
            dataRemovalPermitted: DataTypeSet,
            dataToRemove: DataTypeSet,
            options: RemovalOptions
        }) => undefined
    ): undefined,
    settings(): Promise<{
        dataRemovalPermitted: DataTypeSet,
        dataToRemove: DataTypeSet,
        options: RemovalOptions
    }>
}
//dom
//https://developer.chrome.com/docs/extensions/reference/api/dom

//Author: axarisar
//Date: 13/04/2024

/**
 *
 * [chrome.dom](https://developer.chrome.com/docs/extensions/reference/api/dom)
 */
interface Dom {
    /**
     * Gets the open shadow root or the closed shadow root hosted by the
     * specified element. If the element doesn't attach the shadow root, it
     * will return null.
     *
     * [openOrClosedShadowRoot()](https://developer.chrome.com/docs/extensions/reference/api/dom#method-openOrClosedShadowRoot)
     */
    openOrClosedShadowRoot(element: HTMLElement): undefined
}
//events
//https://developer.chrome.com/docs/extensions/reference/api/events

//Author: axarisar
//Date: 13/04/2024

/**
 *
 * [Rule](https://developer.chrome.com/docs/extensions/reference/api/events#type-Rule)
 */
type Rule = {
    /**
     * List of actions that are triggered if one of the conditions is fulfilled
     */
    actions: Array<any>,
    /**
     * List of conditions that can trigger the actions.
     */
    conditions: Array<any>,
    /**
     * Optional identifier that allows referencing this rule.
     */
    id: undefined | string,
    /**
     * Optional priority of this rule. Defaults to 100.
     */
    priority: undefined | number,
    /**
     * Tags can be used to annotate rules and perform operations on sets of rules.
     */
    tags: undefined | Array<string>,
}

/**
 *
 * [UrlFilter](https://developer.chrome.com/docs/extensions/reference/api/events#type-UrlFilter)
 */
type UrlFilter = {
    /**
     * Matches if the host part of the URL is an IP address and is contained in
     * any of the CIDR blocks specified in the array.
     */
    cidrBlocks: undefined | Array<string>,

    /**
     * Matches if the host name of the URL contains a specified string.
     * To test whether a host name component has a prefix 'foo', use
     * hostContains: '.foo'. This matches 'www.foobar.com' and 'foo.com',
     * because an implicit dot is added at the beginning of the host name.
     * Similarly, hostContains can be used to match against component suffix
     * ('foo.') and to exactly match against components ('.foo.'). Suffix- and
     * exact-matching for the last components need to be done separately using
     * hostSuffix, because no implicit dot is added at the end of the host
     * name.
     */
    hostContains: undefined | string,

    /**
     * Matches if the host name of the URL is equal to a specified string.
     */
    hostEquals: undefined | string,

    /**
     * Matches if the host name of the URL starts with a specified string.
     */
    hostPrefix: undefined | string,

    /**
     * Matches if the host name of the URL ends with a specified string.
     */
    hostSuffix: undefined | string,

    /**
     * Matches if the URL without query segment and fragment identifier matches
     * a specified regular expression. Port numbers are stripped from the URL
     * if they match the default port number. The regular expressions use the
     * RE2 syntax (https://github.com/google/re2/blob/main/doc/syntax.txt).
     */
    originAndPathMatches: undefined | string,

    /**
     * Matches if the path segment of the URL contains a specified string.
     */
    pathContains: undefined | string,

    /**
     * Matches if the path segment of the URL is equal to a specified string.
     */
    pathEquals: undefined | string,

    /**
     * Matches if the path segment of the URL starts with a specified string.
     */
    pathPrefix: undefined | string,

    /**
     * Matches if the path segment of the URL ends with a specified string.
     */
    pathSuffix: undefined | string,

    /**
     * Matches if the port of the URL is contained in any of the specified port
     * lists. For example [80, 443, [1000, 1200]] matches all requests on port
     * 80, 443 and in the range 1000-1200.
     */
    ports: undefined | (Array<number | Array<number>>)

    /**
     * Matches if the query segment of the URL contains a specified string.
     */
    queryContains: undefined | string,

    /**
     * Matches if the query segment of the URL is equal to a specified string.
     */
    queryEquals: undefined | string,

    /**
     * Matches if the query segment of the URL starts with a specified string.
     */
    queryPrefix: undefined | string,

    /**
     * Matches if the query segment of the URL ends with a specified string.
     */
    querySuffix: undefined | string,

    /**
     * Matches if the scheme of the URL is equal to any of the schemes
     * specified in the array.
     */
    schemes: undefined | Array<string>,

    /**
     * Matches if the URL (without fragment identifier) contains a specified
     * string. Port numbers are stripped from the URL if they match the default
     * port number.
     */
    urlContains: undefined | string,

    /**
     * Matches if the URL (without fragment identifier) is equal to a specified
     * string. Port numbers are stripped from the URL if they match the default
     * port number.
     */
    urlEquals: undefined | string,

    /**
     * Matches if the URL (without fragment identifier) matches a specified
     * regular expression. Port numbers are stripped from the URL if they match
     * the default port number. The regular expressions use the RE2 syntax.
     * (https://github.com/google/re2/blob/main/doc/syntax.txt).
     */
    urlMatches: undefined | string,

    /**
     * Matches if the URL (without fragment identifier) starts with a specified
     * string. Port numbers are stripped from the URL if they match the default
     * port number.
     */
    urlPrefix: undefined | string,

    /**
     * Matches if the URL (without fragment identifier) ends with a specified
     * string. Port numbers are stripped from the URL if they match the default
     * port number.
     */
    urlSuffix: undefined | string,
}

/**
 *
 * [Event](https://developer.chrome.com/docs/extensions/reference/api/events#type-Event)
 */
type Event<F extends Function> = {
    addListener: (callback: F) => undefined,
    addRules: (
        rules: Array<Rule>,
        callback: undefined | ((rules: Array<Rule>) => undefined)
    ) => undefined,

    /**
     * Sets in rules callback argument the currently registered rules.
     */
    getRules: (
        ruleIdentifiers: undefined | Array<string>,
        callback: (rules: Array<Rule>) => undefined
    ) => undefined,
    hasListener: (callback: F) => boolean,
    hasListeners: () => boolean,
    /**
     * Deregisters an event listener callback from an event.
     */
    removeListener: (callback: F) => undefined,
    /**
     * Unregisters currently registered rules.
     */
    removeRules: (
        ruleIdentifiers: undefined | Array<string>,
        callback: () => undefined,
    ) => undefined
}
//extension
//https://developer.chrome.com/docs/extensions/reference/api/extension

//Author: axarisar
//Date: 13/04/2024

/**
 *
 * [ViewType](https://developer.chrome.com/docs/extensions/reference/api/extension#type-ViewType)
 */
type ViewType = ("tab" | "popup")


/**
 *
 * [chrome.extension](https://developer.chrome.com/docs/extensions/reference/api/extension)
 */
interface Extension {
    /**
     * True for content scripts running inside incognito tabs, and for
     * extension pages running inside an incognito process. The latter only
     * applies to extensions with 'split' incognito_behavior.
     *
     * [inIncognitoContext](https://developer.chrome.com/docs/extensions/reference/api/extension#property-inIncognitoContext)
     */
    readonly inIncognitoContext: boolean,

    /**
     * Returns the JavaScript 'window' object for the background page running
     * inside the current extension. Returns null if the extension has no
     * background page.
     *
     * [getBackgroundPage()](https://developer.chrome.com/docs/extensions/reference/api/extension#method-getBackgroundPage)
     */
    getBackgroundPage(): Window | undefined,

    /**
     * Returns an array of the JavaScript 'window' objects for each of the
     * pages running inside the current extension.
     *
     * [getViews()](https://developer.chrome.com/docs/extensions/reference/api/extension#method-getViews)
     */
    getViews(fetchProperties: undefined | {
        /**
         * Find a view according to a tab id. If this field is omitted, returns
         * all views.
         */
        tabId: undefined | number,
        /**
         * The type of view to get. If omitted, returns all views (including
         * background pages and tabs).
         */
        type: undefined | ViewType,
        /**
         * The window to restrict the search to. If omitted, returns all views.
         */
        windowId: undefined | number,
    }): Array<Window>,

    /**
     * Retrieves the state of the extension's access to the 'file://' scheme.
     * This corresponds to the user-controlled per-extension 'Allow access to
     * File URLs' setting accessible via the chrome://extensions page.
     *
     * [isAllowedFileSchemeAccesss()](https://developer.chrome.com/docs/extensions/reference/api/extension#method-isAllowedFileSchemeAccess)
     */
    isAllowedFileSchemeAccess(
        callback: (isAllowedAccess: boolean) => undefined
    ): undefined,
    isAllowedFileSchemeAccess(): Promise<boolean>,

    /**
     * Retrieves the state of the extension's access to Incognito-mode. This
     * corresponds to the user-controlled per-extension 'Allowed in Incognito'
     * setting accessible via the chrome://extensions page.
     *
     * [siAllowedIncognitoAccess()](https://developer.chrome.com/docs/extensions/reference/api/extension#method-isAllowedIncognitoAccess)
     */
    isAllowedIncognitoAccess(
        callback: (isAllowedAccess: boolean) => undefined
    ): undefined,
    isAllowedIncognitoAccess(): Promise<boolean>,

    /**
     * Sets the value of the ap CGI parameter used in the extension's update
     * URL. This value is ignored for extensions that are hosted in the Chrome
     * Extension Gallery.
     *
     * [sendUpdateUrlData()](https://developer.chrome.com/docs/extensions/reference/api/extension#method-setUpdateUrlData)
     */
    sendUpdateUrlData(data: string): undefined,
}
//extensionType
//https://developer.chrome.com/docs/extensions/reference/api/extensionType

//Author: axarisar
//Date: 13/04/2024

/**
 * The origin of injected CSS.
 *
 * [CSSOrigin](https://developer.chrome.com/docs/extensions/reference/api/extensionTypes#type-CSSOrigin)
 */
type CSSOrigin = (
    "author"
    | "user"
)

/**
 * Details of the CSS to remove. Either the code or the file property must be
 * set, but both may not be set at the same time.
 *
 * [DeleteInjectionDetails](https://developer.chrome.com/docs/extensions/reference/api/extensionTypes#type-DeleteInjectionDetails)
 */
type DeleteInjectionDetails = {
    /**
     * If allFrames is true, implies that the CSS should be removed from all
     * frames of current page. By default, it's false and is only removed from
     * the top frame. If true and frameId is set, then the code is removed from
     * the selected frame and all of its child frames.
     */
    allFrames: undefined | boolean,

    /**
     * CSS code to remove.
     */
    code: undefined | string,

    /**
     * The origin of the CSS to remove. Defaults to "author".
     */
    cssOrigin: undefined | CSSOrigin,

    /**
     * CSS file to remove.
     */
    file: undefined | string,

    /**
     * The frame from where the CSS should be removed. Defaults to 0 (the
     * top-level frame).
     */
    frameId: undefined | number,

    /**
     * If matchAboutBlank is true, then the code is also removed from
     * about:blank and about:srcdoc frames if your extension has access to its
     * parent document. By default it is false.
     */
    matchAboutBlank: undefined | boolean
}

/**
 *
 * [DocumentLifecycle](https://developer.chrome.com/docs/extensions/reference/api/extensionTypes#type-DocumentLifecycle)
 */
type DocumentLifecycle = (
    "prerender"
    | "active"
    | "cached"
    | "pending_deletion"
)

/**
 *
 * [FrameType](https://developer.chrome.com/docs/extensions/reference/api/extensionTypes#type-FrameType)
 */
type FrameType = (
    "outermost_frame"
    | "fenced_frame"
    | "sub_frame"
)

/**
 *
 * [ImageDetails](https://developer.chrome.com/docs/extensions/reference/api/extensionTypes#type-ImageDetails)
 */
type ImageDetails = {
    /**
     * The format of the resulting image. Default is "jpeg".
     */
    format: undefined | ImageFormat,

    /**
     * When format is "jpeg", controls the quality of the resulting image. This
     * value is ignored for PNG images. As quality is decreased, the resulting
     * image will have more visual artifacts, and the number of bytes needed to
     * store it will decrease.
     */
    quality: undefined | number,
}

/**
 *
 * [ImageFormat](https://developer.chrome.com/docs/extensions/reference/api/extensionTypes#type-ImageFormat)
 */
type ImageFormat = ("jpeg" | "png")

/**
 * Details of the script or CSS to inject. Either the code or the file property
 * must be set, but both may not be set at the same time.
 *
 * [InjectDetails](https://developer.chrome.com/docs/extensions/reference/api/extensionTypes#type-InjectDetails)
 */
type InjectDetails = {
    /**
     * If allFrames is true, implies that the JavaScript or CSS should be
     * injected into all frames of current page. By default, it's false and is
     * only injected into the top frame. If true and frameId is set, then the
     * code is inserted in the selected frame and all of its child frames.
     */
    allFrames: undefined | boolean,

    /**
     * JavaScript or CSS code to inject.
     * Warning: Be careful using the code parameter. Incorrect use of it may
     * open your extension to cross site scripting attacks
     */
    code: undefined | string,

    /**
     * The origin of the CSS to inject. This may only be specified for CSS, not
     * JavaScript. Defaults to "author".
     */
    cssOrigin: undefined | CSSOrigin,

    /**
     * JavaScript or CSS file to inject.
     */
    file: undefined | string,

    /**
     * The frame where the script or CSS should be injected. Defaults to 0 (the
     * top-level frame).
     */
    frameId: undefined | number,

    /**
     * If matchAboutBlank is true, then the code is also injected in
     * about:blank and about:srcdoc frames if your extension has access to its
     * parent document. Code cannot be inserted in top-level about:-frames. By
     * default it is false.
     */
    matchAboutBlank: undefined | boolean,

    /**
     * The soonest that the JavaScript or CSS will be injected into the tab.
     * Defaults to "document_idle".
     */
    runAt: undefined | RunAt
}

/**
 * The soonest that the JavaScript or CSS will be injected into the tab.
 *
 * [RunAt](https://developer.chrome.com/docs/extensions/reference/api/extensionTypes#type-RunAt)
 */
type RunAt = (
    /**
     * Script is injected after any files from css, but before any other DOM is
     * constructed or any other script is run.
     */
    "document_start"
    /**
     * Script is injected immediately after the DOM is complete, but before
     * subresources like images and frames have loaded.
     */
    | "document_end"
    /**
     * The browser chooses a time to inject the script between "document_end"
     * and immediately after the window.onload event fires. The exact moment of
     * injection depends on how complex the document is and how long it is
     * taking to load, and is optimized for page load speed. Content scripts
     * running at "document_idle" don't need to listen for the window.onload
     * event; they are guaranteed to run after the DOM completes. If a script
     * definitely needs to run after window.onload, the extension can check if
     * onload has already fired by using the document.readyState property.
     */
    | "document_idle"
)
//history
//https://developer.chrome.com/docs/extensions/reference/api/history

//Author: axarisar
//Date: 13/04/2024

//must include events.d.ts

/**
 *
 * [HistoryItem](https://developer.chrome.com/docs/extensions/reference/api/history#type-HistoryItem)
 */
type HistoryItem = {
    id: string,

    /**
     * When this page was last loaded, represented in milliseconds since the
     * epoch.
     */
    lastisitTime: undefined | number,
    title: undefined | string,

    /**
     * The number of times the user has navigated to this page by typing in the
     * address.
     */
    typedCount: undefined | number,
    url: undefined | string,

    /**
     * The number of times the user has navigated to this page.
     */
    visitCount: undefined | number
}

/**
 *
 * [TransitionType](https://developer.chrome.com/docs/extensions/reference/api/history#type-TransitionType)
 */
type TransitionType = (
    /**The user arrived at this page by clicking a link on another page.*/
    "link"
    /**
     * The user arrived at this page by typing the URL in the address bar. This
     * is also used for other explicit navigation actions.
     */
    | "typed"
    /**
     * The user arrived at this page through a suggestion in the UI, for
     * example, through a menu item.
     */
    | "auto_bookmark"
    /**
     * The user arrived at this page through subframe navigation that they 
     * didn't request, such as through an ad loading in a frame on the previous
     * page. These don't always generate new navigation entries in the back and
     * forward menus.
     */
    | "auto_subframe"
    /**The user arrived at this page by selecting something in a subframe.*/
    | "manual_subframe"
    /**
     * The user arrived at this page by typing in the address bar and selecting
     * an entry that didn't look like a URL, such as a Google Search
     * suggestion. For example, a match might have the URL of a Google Search
     * result page, but it might appear to the user as "Search Google for ...".
     * These are different from typed navigations because the user didn't type
     * or see the destination URL. They're also related to keyword navigations.
     */
    | "generated"
    /**The page was specified in the command line or is the start page.*/
    | "auto_toplevel"
    /**
     * The user arrived at this page by filling out values in a form and
     * submitting the form. Not all form submissions use this transition type.
     */
    | "from_submit"
    /**
     * The user reloaded the page, either by clicking the reload button or by
     * pressing Enter in the address bar. Session restore and Reopen closed tab
     * also use this transition type.
     */
    | "reload"
    /**
     * The URL for this page was generated from a replaceable keyword other
     * than the default search provider.
     */
    | "keyword"
    /**Corresponds to a visit generated for a keyword.*/
    | "keyword_generated"
)

/**
 *
 * [UrlDetails](https://developer.chrome.com/docs/extensions/reference/api/history#type-UrlDetails)
 */
type UrlDetails = {
    url: string
}

/**
 *
 * [VisitItem](https://developer.chrome.com/docs/extensions/reference/api/history#type-VisitItem)
 */
type VisitItem = {
    id: string,
    /**
     * True if the visit originated on this device. False if it was synced from
     * a different device.
     */
    isLocal: boolean,
    referringVisitId: string,
    transition: TransitionType,
    visitId: string,
    /**
     * When this visit occurred, represented in milliseconds since the epoch.
     */
    visitTime: undefined | number
}

/**
 *
 * [chrome.history](https://developer.chrome.com/docs/extensions/reference/api/history)
 */
interface History {
    /**
     * Adds a URL to the history at the current time with a transition type of
     * "link".
     *
     * [addUrl()](https://developer.chrome.com/docs/extensions/reference/api/history#method-addUrl)
     */
    addUrl(details: UrlDetails, callback: () => undefined): undefined,
    addUrl(details: UrlDetails): Promise<undefined>,

    /**
     *
     * [deleteAll()](https://developer.chrome.com/docs/extensions/reference/api/history#method-deleteAll)
     */
    deleteAll(callback: () => undefined): undefined,
    deleteAll(): Promise<undefined>,

    /**
     * Removes all items within the specified date range from the history.
     * Pages will not be removed from the history unless all visits fall within
     * the range.
     *
     * [deleteRange()](https://developer.chrome.com/docs/extensions/reference/api/history#method-deleteRange)
     */
    deleteRange(
        range: {
            /**
             * Items added to history before this date, represented in
             * milliseconds since the epoch.
             */
            endTime: number,
            /**
             * Items added to history after this date, represented in
             * milliseconds since the epoch.
             */
            startTime: number
        },
        callback: () => undefined
    ): undefined,
    deleteRange(
        range: {
            /**
             * Items added to history before this date, represented in
             * milliseconds since the epoch.
             */
            endTime: number,
            /**
             * Items added to history after this date, represented in
             * milliseconds since the epoch.
             */
            startTime: number
        }
    ): Promise<undefined>,

    /**
     *
     * [deleteUrl()](https://developer.chrome.com/docs/extensions/reference/api/history#method-deleteUrl)
     */
    deleteUrl(details: UrlDetails, callback: () => undefined): undefined,
    deleteUrl(details: UrlDetails): Promise<undefined>,

    /**
     *
     * [getVisits()](https://developer.chrome.com/docs/extensions/reference/api/history#method-getVisits)
     */
    getVisits(
        details: UrlDetails,
        callback: (results: Array<VisitItem>) => undefined
    ): undefined,
    getVisits(details: UrlDetails): Promise<Array<VisitItem>>,

    /**
     * Searches the history for the last visit time of each page matching the
     * query.
     *
     * [search()](https://developer.chrome.com/docs/extensions/reference/api/history#method-search)
     */
    search(
        query: {
            /**
             * Limit results to those visited before this date, represented in
             * milliseconds since the epoch.
             */
            endTime: undefined | number
            /**
             * The maximum number of results to retrieve. Defaults to 100.
             */
            maxResults: undefined | number,
            /**
             * Limit results to those visited after this date, represented in
             * milliseconds since the epoch. If property is not specified, it
             * will default to 24 hours.
             */
            startTime: undefined | number,
            /**
             * A free-text query to the history service. Leave this empty to
             * retrieve all pages.
             */
            text: string
        },
        callback: (results: Array<HistoryItem>) => undefined
    ): undefined,
    search(
        query: {
            /**
             * Limit results to those visited before this date, represented in
             * milliseconds since the epoch.
             */
            endTime: undefined | number
            /**
             * The maximum number of results to retrieve. Defaults to 100.
             */
            maxResults: undefined | number,
            /**
             * Limit results to those visited after this date, represented in
             * milliseconds since the epoch. If property is not specified, it
             * will default to 24 hours.
             */
            startTime: undefined | number,
            /**
             * A free-text query to the history service. Leave this empty to
             * retrieve all pages.
             */
            text: string
        },
    ): Promise<Array<HistoryItem>>,

    /**
     * Fired when a URL is visited, providing the HistoryItem data for that
     * URL. This event fires before the page has loaded.
     *
     * [onVisited](https://developer.chrome.com/docs/extensions/reference/api/history#event-onVisited)
     */
    onVisited: Event<(result: HistoryItem) => undefined>,

    /**
     * Fired when one or more URLs are removed from history. When all visits
     * have been removed the URL is purged from history.
     *
     * [onVisitRemoved](https://developer.chrome.com/docs/extensions/reference/api/history#event-onVisitRemoved)
     */
    onVisitRemoved: Event<(
        removed: {allHistory: boolean, urls: undefined | Array<string>}
    ) => undefined>,
}
//runtime
//https://developer.chrome.com/docs/extensions/reference/api/runtime
//alias to "nativeMessaging"

//Author: axarisar
//Date: 13/04/2024

//Must include tabs.d.ts
//Must include events.d.ts

/**
 * A filter to match against certain extension contexts. Matching contexts must
 * match all specified filters; any filter that is not specified matches all
 * available contexts. Thus, a filter of `{}` will match all available contexts.
 *
 * [ContextFilter](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-ContextFilter)
 */
type ContextFilter  = {
    contextIds: undefined | Array<string>,
    contextTypes: undefined | Array<ContextType>
    documentIds: undefined | Array<string>,
    documentOrigins: undefined | Array<string>,
    documentUrls: undefined | Array<string>,
    frameIds: undefined | Array<number>,
    incognito: undefined | boolean,
    tabIds: undefined | Array<number>,
    windowIds: undefined | Array<number>
}

/**
 *
 * [ContextType](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-ContextType)
 */
type ContextType = (
    /**Specifies the context type as a tab.*/
    "TAB"
    /**Specifies the context type as an extension popup window*/
    | "POPUP"
    /**Specifies the context type as a service worker.*/
    | "BACKGORUND"
    /**Specifies the context type as an offscreen document.*/
    | "OFFSCREEN_DOCUMENT"
    /**Specifies the context type as a side panel.*/
    | "SIDE_PANEL"
)

/**
 * A context hosting extension content.
 *
 * [ExtensionContext](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-ExtensionContext)
 */
type ExtensionContext = {
    /**
     * A unique identifier for this context
     */
    contextId: string,

    /**
     * The type of context this corresponds to.
     */
    contextType: ContextType,

    /**
     * A UUID for the document associated with this context, or undefined if
     * this context is hosted not in a document.
     */
    documentId: undefined | string,

    /**
     * The origin of the document associated with this context, or undefined if
     * the context is not hosted in a document.
     */
    documentOrigin: undefined | string,

    /**
     * The URL of the document associated with this context, or undefined if
     * the context is not hosted in a document.
     */
    documentUrl: undefined | string,

    /**
     * The ID of the frame for this context, or -1 if this context is not
     * hosted in a frame.
     */
    frameId: number,

    /**
     * Whether the context is associated with an incognito profile.
     */
    incognito: boolean,

    /**
     * The ID of the tab for this context, or -1 if this context is not hosted
     * in a tab.
     */
    tabId: number,

    /**
     * The ID of the window for this context, or -1 if this context is not
     * hosted in a window.
     */
    windowId: number
}

/**
 * An object containing information about the script context that sent a
 * message or request.
 *
 * [MessageSender](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-MessageSender)
 */
type MessageSender = {
    /**
     * A UUID of the document that opened the connection.
     */
    documentId: undefined | string,

    /**
     * The lifecycle the document that opened the connection is in at the time
     * the port was created. Note that the lifecycle state of the document may
     * have changed since port creation.
     */
    documentLifecycle: undefined | string,

    /**
     * The frame that opened the connection. 0 for top-level frames, positive
     * for child frames. This will only be set when tab is set.
     */
    frameId: undefined | number,

    /**
     * The ID of the extension that opened the connection, if any.
     */
    id: undefined | string,

    /**
     * The name of the native application that opened the connection, if any.
     */
    nativeApplication: undefined | string,

    /**
     * The origin of the page or frame that opened the connection. It can vary
     * from the url property (e.g., about:blank) or can be opaque (e.g.,
     * sandboxed iframes). This is useful for identifying if the origin can be
     * trusted if we can't immediately tell from the URL.
     */
    origin: undefined | string,

    /**
     * The tabs.Tab which opened the connection, if any. This property will
     * only be present when the connection was opened from a tab (including
     * content scripts), and only if the receiver is an extension, not an app.
     */
    tab: undefined | Tab,

    /**
     * The TLS channel ID of the page or frame that opened the connection, if
     * requested by the extension, and if available.
     */
    tlsChannelld: undefined | string,

    /**
     * The URL of the page or frame that opened the connection. If the sender
     * is in an iframe, it will be iframe's URL not the URL of the page which
     * hosts it.
     */
    url: undefined | string
}

/**
 *
 * [OnInstalledReason](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-OnInstalledReason)
 */
type OnInstalledReason = (
    /**Specifies the event reason as an installation.*/
    "install"
    /**Specifies the event reason as an extension update.*/
    | "update"
    /**Specifies the event reason as a Chrome update.*/
    | "chrome_update"
    /**Specifies the event reason as an update to a shared module.*/
    | "shared_module_update"
)

/**
 * The reason that the event is being dispatched. 'app_update' is used when the
 * restart is needed because the application is updated to a newer version.
 * 'os_update' is used when the restart is needed because the browser/OS is
 * updated to a newer version. 'periodic' is used when the system runs for more
 * than the permitted uptime set in the enterprise policy.
 *
 * [OnRestartRequiredReason](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-OnRestartRequiredReason)
 */
type OnRestartRequiredReason = (
    /**Specifies the event reason as an update to the app.*/
    "app_update"
    /**Specifies the event reason as an update to the operating system.*/
    | "os_update"
    /**Specifies the event reason as a periodic restart of the app.*/
    | "periodic"
)

/**
 *
 * [PlataformArch](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-PlatformArch)
 */
type PlatformArch = (
    "arm"
    | "arm64"
    | "x86-32"
    | "x86-64"
    | "mips"
    | "mips64"
)

/**
 *
 * [PlataformInfo](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-PlatformInfo)
 */
type PlataformInfo = (
    /**The machine's processor architecture.*/
    "arc"
    /**
     * The native client architecture. This may be different from arch on some
     * platforms.
     */
    | "nacl_arch"
    /**The operating system Chrome is running on.*/
    | "os"
)

/**
 *
 * [PlataformNaclArch](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-PlatformNaclArch)
 */
type PlatformNaclArch = (
    "arm"
    | "x86-32"
    | "x86-64"
    | "mips"
    | "mips64"
)

/**
 *
 * [PlataformOs](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-PlatformOs)
 */
type PlatformOs = (
    "mac"
    | "win"
    | "android"
    | "cros" //Chrome os
    | "linux"
    | "openbsd"
    | "fuchsia"
)

/**
 *
 * [Port](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-Port)
 */
type Port = {
    name: string,

    /**
     * Fired when the port is disconnected from the other end(s).
     * runtime.lastError may be set if the port was disconnected by an error.
     * If the port is closed via disconnect, then this event is only fired on
     * the other end. This event is fired at most once (see also Port
     * lifetime).
     */
    onDisconnect: Event<(port: Port) => undefined>,

    /**
     * This event is fired when postMessage is called by the other end of the
     * port.
     */
    onMessage: Event<(message: any, port: Port) => undefined>,

    /**
     * This property will only be present on ports passed to onConnect /
     * onConnectExternal / onConnectNative listeners.
     */
    sender: undefined | MessageSender,

    disconnect: () => undefined,

    /**
     * Send a message to the other end of the port. If the port is
     * disconnected, an error is thrown.
     * The argument message should be JSON-ifiable.
     */
    postMessage: (message: any) => undefined
}

/**
 *
 * [RequestUpdateCheckStatus](https://developer.chrome.com/docs/extensions/reference/api/runtime#type-RequestUpdateCheckStatus)
 */
type RequestUpdateCheckStatus = (
    /**
     * Specifies that the status check has been throttled. This can occur after
     * repeated checks within a short amount of time.
     */
    "throttled"
    /**Specifies that there are no available updates to install.*/
    | "no_update"
    /**Specifies that there is an available update to install.*/
    | "update_available"
)

/**
 *
 * [chrome.runtime](https://developer.chrome.com/docs/extensions/reference/api/runtime)
 */
interface Runtime {
    /**
     *
     * [id](https://developer.chrome.com/docs/extensions/reference/api/runtime#property-id)
     */
    readonly id: string,

    /**
     * Populated with an error message if calling an API function fails;
     * otherwise undefined. This is only defined within the scope of that
     * function's callback. If an error is produced, but runtime.lastError is
     * not accessed within the callback, a message is logged to the console
     * listing the API function that produced the error. API functions that
     * return promises do not set this property.
     *
     * [lastError](https://developer.chrome.com/docs/extensions/reference/api/runtime#property-lastError)
     */
    readonly lastError: {
        readonly message: undefined | string,
    },

    /**
     * Attempts to connect listeners within an extension (such as the
     * background page), or other extensions/apps. This is useful for content
     * scripts connecting to their extension processes, inter-app/extension
     * communication, and web messaging. Note that this does not connect to any
     * listeners in a content script. Extensions may connect to content scripts
     * embedded in tabs via tabs.connect.
     *
     * [connect()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-connect)
     */
    connect(
        extensionId: undefined | string,
        connectInfo: undefined | {
            includeTlsChannelld: undefined | boolean,
            name: undefined | string
        }
    ): Port,

    /**
     * Connects to a native application in the host machine. This method
     * requires the "nativeMessaging" permission.
     *
     * [connectNative()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-connectNative)
     */
    connectNative(application: string): Port,

    /**
     * Retrieves the JavaScript 'window' object for the background page running
     * inside the current extension/app. If the background page is an event
     * page, the system will ensure it is loaded before calling the callback.
     * If there is no background page, an error is set.
     *
     * [getBackgroundPage()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-getBackgroundPage)
     */
    getBackgroundPage(
        callback: (backgorundPage: undefined | Window) => undefined
    ): undefined,
    getBackgroundPage(): Promise<undefined | Window>,

    /**
     * Fetches information about active contexts associated with this extension.
     *
     * [getContexts()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-getContexts)
     */
    getContexts(
        filter: ContextFilter,
        callback: (contexts: Array<ExtensionContext>) => undefined
    ): undefined,
    getContexts(filter: ContextFilter): Promise<Array<ExtensionContext>>,

    /**
     * Returns details about the app or extension from the manifest. The object
     * returned is a serialization of the full manifest file.
     *
     * [getManifest()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-getManifest)
     */
    getManifest(): Object

    /**
     *
     * [getPackageDirectoryEntry()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-getPackageDirectoryEntry)
     */
    getPackageDirectoryEntry(
        callback: (directoryEntry: DirectoryEntry) => undefined
    ): undefined,
    getPackageDirectoryEntry(): Promise<DirectoryEntry>,

    /**
     *
     * (getPlatformInfo())[https://developer.chrome.com/docs/extensions/reference/api/runtime#method-getPlatformInfo]
     */
    getPlatformInfo(
        callback: (plataformInfo: PlataformInfo) => undefined
    ): undefined,
    getPlatformInfo(): Promise<PlataformInfo>,

    /**
     * Converts a relative path within an app/extension install directory to a
     * fully-qualified URL.
     *
     * [getURL()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-getURL)
     */
    getURL(path: string): string,

    /**
     * Open your Extension's options page, if possible.
     * If your Extension does not declare an options page, or Chrome failed to
     * create one for some other reason, the callback will set lastError.
     *
     * [openOptionsPage()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-openOptionsPage)
     */
    openOptionsPage(callback: () => undefined): undefined,
    openOptionsPage(): Promise<undefined>,

    /**
     * Reloads the app or extension. This method is not supported in kiosk mode.
     * For kiosk mode, use chrome.runtime.restart() method.
     *
     * [reload()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-reload)
     */
    reload(): undefined,

    /**
     * Requests an immediate update check be done for this app/extension.
     * Important: Most extensions/apps should not use this method, since Chrome
     * already does automatic checks every few hours, and you can listen for
     * the runtime.onUpdateAvailable event without needing to call
     * requestUpdateCheck.
     * This method is only appropriate to call in very limited circumstances,
     * such as if your extension talks to a backend service, and the backend
     * service has determined that the client extension version is very far out
     * of date and you'd like to prompt a user to update. Most other uses of
     * requestUpdateCheck, such as calling it unconditionally based on a
     * repeating timer, probably only serve to waste client, network, and
     * server resources.
     * Note: When called with a callback, instead of returning an object this
     * function will return the two properties as separate arguments passed to
     * the callback.
     *
     * [requestUpdateCheck()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-requestUpdateCheck)
     */
    requestUpdateCheck(
        callback: (result:{
            status: RequestUpdateCheckStatus,
            version: undefined | string
        }) => undefined
    ): undefined,
    requestUpdateCheck(): Promise<{
        status: RequestUpdateCheckStatus,
        version: undefined | string
    }>,

    /**
     * Restart the ChromeOS device when the app runs in kiosk mode. Otherwise,
     * it's no-op.
     *
     * [restart()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-restart)
     */
    restart(): undefined,

    /**
     * Restart the ChromeOS device when the app runs in kiosk mode after the
     * given seconds. If called again before the time ends, the reboot will be
     * delayed. If called with a value of -1, the reboot will be cancelled. It
     * is a no-op in non-kiosk mode. It's only allowed to be called repeatedly
     * by the first extension to invoke this API.
     *
     * [restartAfterDelay()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-restartAfterDelay)
     */
    restartAfterDelay(
        seconds: number,
        callback: undefined | (() => undefined)
    ): undefined,
    restartAfterDelay(seconds: number): Promise<undefined>,

    /**
     * Sends a single message to event listeners within your extension or a
     * different extension/app. Similar to runtime.connect but only sends a
     * single message, with an optional response. If sending to your extension,
     * the runtime.onMessage event will be fired in every frame of your
     * extension (except for the sender's frame), or runtime.onMessageExternal,
     * if a different extension. Note that extensions cannot send messages to
     * content scripts using this method. To send messages to content scripts,
     * use tabs.sendMessage.
     *
     * [sendMessage()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-sendMessage)
     */
    sendMessage(
        extensionId: undefined | string,
        /**
        * This message should be a JSON-ifiable object.
        */
        message: any,
        options: undefined | {includeTlsChannelld: undefined | boolean},
        /**
         * The JSON response object sent by the handler of the message. If
         * an error occurs while connecting to the extension, the callback
         * will be called with no arguments and runtime.lastError will be
         * set to the error message.
         */
        callback: (response: any) => undefined
    ): undefined,
    sendMessage(
        extensionId: undefined | string,
        /**
        * This message should be a JSON-ifiable object.
        */
        message: any,
        options: undefined | {includeTlsChannelld: undefined | boolean},
    ): Promise<any>, //Same as response

    /**
     * Send a single message to a native application. This method requires the
     * "nativeMessaging" permission.
     *
     * [sendNativeMessage()](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-sendNativeMessage)
     */
    sendNativeMessage(
        application: string,
        message: object,
        /**
         * The response message sent by the native messaging host. If an
         * error occurs while connecting to the native messaging host, the
         * callback will be called with no arguments and runtime.lastError
         * will be set to the error message.
         */
        callback: (response: any) => undefined
    ): undefined,
    sendNativeMessage(
        application: string,
        message: object,
    ): Promise<any>, //Same as response

    /**
     * Sets the URL to be visited upon uninstallation. This may be used to
     * clean up server-side data, do analytics, and implement surveys. Maximum
     * 1023 characters.
     *
     * [setUninstallURL](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-setUninstallURL)
     */
    setUninstallURL(url: string, callback: () => undefined): undefined,
    setUninstallURL(url: string): Promise<undefined>,

    /**
     * Fired when a connection is made from either an extension process or a
     * content script (by runtime.connect).
     *
     * [onConnect](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onConnect)
     */
    onConnect: Event<(port: Port) => undefined>,

    /**
     * Fired when a connection is made from another extension
     * (by runtime.connect), or from an externally connectable web site.
     *
     * [onConnectExternal](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onConnectExternal)
     */
    onConnectExternal: Event<(port: Port) => undefined>,

    /**
     * Fired when a connection is made from a native application. This event
     * requires the "nativeMessaging" permission. It is only supported on
     * Chrome OS.
     *
     * [onConnectNative](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onConnectNative)
     */
    onConnectNative: Event<(port: Port) => undefined>,

    /**
     * Fired when the extension is first installed, when the extension is
     * updated to a new version, and when Chrome is updated to a new version
     *
     * [onInstalled](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onInstalled)
     */
    onInstalled: Event<(details: {
        id: undefined | string,
        previousVersion: undefined | string,
        reason: OnInstalledReason
    }) => undefined>,

    /**
     * Fired when a message is sent from either an extension process
     * (by runtime.sendMessage) or a content script (by tabs.sendMessage).
     *
     * [onMessage](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage)
     */
    onMessage: Event<(
        message: any,
        sender: MessageSender,
        senderResponse: () => undefined
    ) => undefined | boolean>,

    /**
     * Fired when a message is sent from another extension
     * (by runtime.sendMessage). Cannot be used in a content script.
     *
     * [onMessageExternal](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessageExternal)
     */
    onMessageExternal: Event<(
        message: any,
        sender: MessageSender,
        sendResponse: () => undefined
    ) => undefined>,

    /**
     * Fired when an app or the device that it runs on needs to be restarted.
     * The app should close all its windows at its earliest convenient time to
     * let the restart to happen. If the app does nothing, a restart will be
     * enforced after a 24-hour grace period has passed. Currently, this event
     * is only fired for Chrome OS kiosk apps.
     *
     * [onRestartRequired](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onRestartRequired)
     */
    onRestartRequired: Event<(reason: OnRestartRequiredReason) => undefined>,

    /**
     * Fired when a profile that has this extension installed first starts up.
     * This event is not fired when an incognito profile is started, even if
     * this extension is operating in 'split' incognito mode.
     *
     * [onStartup](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onStartup)
     */
    onStartup: Event<() => undefined>,

    /**
     * Sent to the event page just before it is unloaded. This gives the
     * extension opportunity to do some clean up. Note that since the page is
     * unloading, any asynchronous operations started while handling this event
     * are not guaranteed to complete. If more activity for the event page
     * occurs before it gets unloaded the onSuspendCanceled event will be sent
     * and the page won't be unloaded.
     *
     * [onSuspend](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onSuspend)
     */
    onSuspend: Event<() => undefined>,

    /**
     * Sent after onSuspend to indicate that the app won't be unloaded after
     * all.
     *
     * [onSuspendCanceled](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onSuspendCanceled)
     */
    onSuspendCanceled: Event<() => undefined>,

    /**
     * Fired when an update is available, but isn't installed immediately
     * because the app is currently running. If you do nothing, the update will
     * be installed the next time the background page gets unloaded, if you
     * want it to be installed sooner you can explicitly call
     * chrome.runtime.reload(). If your extension is using a persistent
     * background page, the background page of course never gets unloaded, so
     * unless you call chrome.runtime.reload() manually in response to this
     * event the update will not get installed until the next time Chrome
     * itself restarts. If no handlers are listening for this event, and your
     * extension has a persistent background page, it behaves as if
     * chrome.runtime.reload() is called in response to this event.
     *
     * [onUpdateAvailable](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onUpdateAvailable)
     */
    onUpdateAvailable: Event<(details: {version: string}) => undefined>,

    /**
     * Fired when a connection is made from a user script from this extension.
     *
     * [onUserScriptConnect](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onUserScriptConnect)
     */
    onUserScriptConnect: Event<(port: Port) => undefined>,

    /**
     * Fired when a message is sent from a user script associated with the same
     * extension.
     *
     * [onUserScriptMessage](https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onUserScriptMessage)
     */
    onUserScriptMessage: Event<(
        message: any,
        sender: MessageSender,
        senderResponse: () => undefined
    ) => undefined | boolean>
}
//scripting
//https://developer.chrome.com/docs/extensions/reference/api/scripting

//Author: axarisar
//Date: 13/04/2024

/**
 *
 * [ContentScriptFilter](https://developer.chrome.com/docs/extensions/reference/api/scripting#type-ContentScriptFilter)
 */
type ContentScriptFilter = {
    /**
     * If specified, getRegisteredContentScripts will only return scripts with
     * an id specified in this list.
     */
    ids: undefined | Array<string>
}

/**
 * Exactly one of files and css must be specified.
 *
 * [CSSInjection](https://developer.chrome.com/docs/extensions/reference/api/scripting#type-CSSInjection)
 */
type CSSInjection = {
    css: undefined | string,
    files: undefined | Array<string>,
    /**The style origin for the injection. Defaults to 'AUTHOR'.*/
    origin: undefined | StyleOrigin,
    target: InjectionTarget
}

/**
 * The JavaScript world for a script to execute within.
 *
 * [ExecutionWorld](https://developer.chrome.com/docs/extensions/reference/api/scripting#type-ExecutionWorld)
 */
type ExecutionWorld = (
    /**
     * Specifies the isolated world, which is the execution environment unique
     * to this extension.
     */
    "ISOLATED"
    /**
     * Specifies the main world of the DOM, which is the execution environment
     * shared with the host page's JavaScript.
     */
    | "MAIN"
)

/**
 *
 * [InjectionResult](https://developer.chrome.com/docs/extensions/reference/api/scripting#type-InjectionResult)
 */
type InjectionResult = {
    documentId: string,
    frameId: number,
    result: undefined | any
}

/**
 *
 * [InjectionTarget](https://developer.chrome.com/docs/extensions/reference/api/scripting#type-InjectionTarget)
 */
type InjectionTarget = {
    /**Defaults to false. This must not be true if frameIds is specified.*/
    allFrames: undefined | boolean,
    documentIds: undefined | Array<string>,
    frameIds: undefined | Array<number>,
    tabId: number
}

/**
 *
 * [RegisteredContentScript](https://developer.chrome.com/docs/extensions/reference/api/scripting#type-RegisteredContentScript)
 */
type RegisteredContentScript = {
    /**
     * If specified true, it will inject into all frames, even if the frame is
     * not the top-most frame in the tab. Each frame is checked independently
     * for URL requirements; it will not inject into child frames if the URL
     * requirements are not met. Defaults to false, meaning that only the top
     * frame is matched.
     */
    allFrames: undefined | boolean,
    /**
     * The list of CSS files to be injected into matching pages. These are
     * injected in the order they appear in this array, before any DOM is
     * constructed or displayed for the page.
     */
    css: undefined | Array<string>,
    /**
     * Excludes pages that this content script would otherwise be injected
     * into.
     */
    excludeMatches: undefined | Array<string>,
    /**
     * The id of the content script, specified in the API call. Must not start
     * with a '_' as it's reserved as a prefix for generated script IDs.
     */
    id: string,
    /**
     * The list of JavaScript files to be injected into matching pages.
     */
    js: undefined | Array<string>,
    /**
     * Indicates whether the script can be injected into frames where the URL
     * contains an unsupported scheme; specifically: about:, data:, blob:, or
     * filesystem:. In these cases, the URL's origin is checked to determine if
     * the script should be injected. If the origin is null (as is the case for
     * data: URLs) then the used origin is either the frame that created the
     * current frame or the frame that initiated the navigation to this frame.
     * Note that this may not be the parent frame.
     */
    matchOriginAsFallback: undefined | boolean,
    /**
     * Specifies which pages this content script will be injected into.
     */
    matches: undefined | Array<string>,
    persistAcrossSessions: undefined | boolean,
    /**
     * Specifies when JavaScript files are injected into the web page. The
     * preferred and default value is document_idle.
     */
    runAt: undefined | RunAt,
    /**
     * The JavaScript "world" to run the script in. Defaults to ISOLATED.
     */
    world: undefined | ExecutionWorld,
}

/**
 * Exactly one of files or func must be specified.
 *
 * [ScriptInjection](https://developer.chrome.com/docs/extensions/reference/api/scripting#type-ScriptInjection)
 */
type ScriptInjection = {
    /**
     * The arguments to pass to the provided function. This is only valid if
     * the func parameter is specified. These arguments must be
     * JSON-serializable.
     */
    args: undefined | Array<any>,
    /**
     * The path of the JS or CSS files to inject, relative to the extension's
     * root directory. Exactly one of files or func must be specified.
     */
    files: undefined | Array<string>,
    /**
     * Whether the injection should be triggered in the target as soon as
     * possible. Note that this is not a guarantee that injection will occur
     * prior to page load, as the page may have already loaded by the time the
     * script reaches the target.
     */
    injectImmediately: undefined | boolean,
    target: InjectionTarget,
    /**
     * The JavaScript "world" to run the script in. Defaults to ISOLATED.
     */
    world: undefined | ExecutionWorld,
    /**
     * A JavaScript function to inject. This function will be serialized, and
     * then deserialized for injection. This means that any bound parameters
     * and execution context will be lost.
     */
    func: undefined | (() => undefined)
}

/**
 *
 * [StyleOrigin](https://developer.chrome.com/docs/extensions/reference/api/scripting#type-StyleOrigin)
 */
type StyleOrigin = ("AUTHOR" | "USER")

/**
 *
 * [chrome.scripting](https://developer.chrome.com/docs/extensions/reference/api/scripting)
 */
interface Scripting {
    /**
     * Injects a script into a target context. By default, the script will be
     * run at document_idle, or immediately if the page has already loaded. If
     * the injectImmediately property is set, the script will inject without
     * waiting, even if the page has not finished loading. If the script
     * evaluates to a promise, the browser will wait for the promise to settle
     * and return the resulting value.
     *
     * [executeScript()](https://developer.chrome.com/docs/extensions/reference/api/scripting#method-executeScript)
     */
    executeScript(
        injection: ScriptInjection,
        callback: (results: Array<InjectionResult>) => undefined
    ): undefined
    executeScript(injection: ScriptInjection): Promise<Array<InjectionResult>>

    /**
     * Returns all dynamically registered content scripts for this extension
     * that match the given filter.
     *
     * [getRegisteredContentScripts()](https://developer.chrome.com/docs/extensions/reference/api/scripting#method-getRegisteredContentScripts)
     */
    getRegisteredContentScripts(
        filter: undefined | ContentScriptFilter,
        callback: (scripts: Array<RegisteredContentScript>) => undefined
    ): undefined
    getRegisteredContentScripts(
        filter: undefined | ContentScriptFilter
    ): Promise<Array<RegisteredContentScript>>

    /**
     * Inserts a CSS stylesheet into a target context. If multiple frames are
     * specified, unsuccessful injections are ignored.
     *
     * [insertCSS()](https://developer.chrome.com/docs/extensions/reference/api/scripting#method-insertCSS)
     */
    insertCSS(
        injection: CSSInjection,
        callback: () => undefined
    ): undefined,
    insertCSS(injection: CSSInjection): Promise<undefined>,

    /**
     * Registers one or more content scripts for this extension.
     *
     * [registerContentScripts()](https://developer.chrome.com/docs/extensions/reference/api/scripting#method-registerContentScripts)
     */
    registerContentScripts(
        scripts: Array<RegisteredContentScript>,
        callback: () => undefined
    ): undefined,
    registerContentScripts(
        scripts: Array<RegisteredContentScript>
    ): Promise<undefined>,

    /**
     * Removes a CSS stylesheet that was previously inserted by this extension
     * from a target context.
     *
     * [removeCSS()](https://developer.chrome.com/docs/extensions/reference/api/scripting#method-removeCSS)
     */
    removeCSS(injection: CSSInjection, callback: () => undefined): undefined,
    removeCSS(injection: CSSInjection): Promise<undefined>,

    /**
     * Unregisters content scripts for this extension.
     *
     * [unregisterContentScripts()](https://developer.chrome.com/docs/extensions/reference/api/scripting#method-unregisterContentScripts)
     */
    unregisterContentScripts(
        filter: undefined | ContentScriptFilter,
        callback: () => undefined
    ): undefined
    unregisterContentScripts(
        filter: undefined | ContentScriptFilter
    ): Promise<undefined>

    /**
     * Updates one or more content scripts for this extension.
     *
     * [updateContentScripts()](https://developer.chrome.com/docs/extensions/reference/api/scripting#method-updateContentScripts)
     */
    updateContentScripts(
        scripts: undefined | Array<RegisteredContentScript>,
        callback: () => undefined
    ): undefined,
    updateContentScripts(
        scripts: undefined | Array<RegisteredContentScript>
    ): Promise<undefined>,
}
//storage
//https://developer.chrome.com/docs/extensions/reference/api/storage
//alias to "nativeMessaging"

//Author: axarisar
//Date: 13/04/2024

/**
 *
 * [AccessLevel](https://developer.chrome.com/docs/extensions/reference/api/storage#type-AccessLevel)
 */
type AccessLevel = (
    /**Specifies contexts originating from the extension itself.*/
    "TRUSTED_CONTEXTS"
    /**Specifies contexts originating from outside the extension.*/
    | "TURSTED_AND_UNTRUSTED_CONTEXTS"
)

/**
 *
 * [StorageArea](https://developer.chrome.com/docs/extensions/reference/api/storage#type-StorageArea)
 */
interface StorageArea {
    /**
     * Fired when one or more items change.
     */
    onChange: Event<(chages: Object) => undefined>,

    /**
    * Removes all items from storage.
    */
    clear(callback: () => undefined): undefined,
    clear(): Promise<undefined>,

    /**
     * Gets one or more items from storage.
     */
    get(
        /**
         * A single key to get, list of keys to get, or a dictionary specifying
         * default values (see description of the object). An empty list or
         * object will return an empty result object. Pass in null to get the
         * entire contents of storage.
         */
        keys: undefined | string | Array<string> | object,
        callback: (items: object) => undefined
    ): undefined
    get(keys: undefined | string | Array<string> | object): Promise<object>,

    /**
     * Gets the amount of space (in bytes) being used by one or more items.
     */
    getBytesInUse(
        /**
         * A single key or list of keys to get the total usage for. An empty
         * list will return 0. Pass in null to get the total usage of all of
         * storage.
         */
        keys: undefined | string | Array<string>,
        callback: (bytesInUse: number) => undefined
    ): undefined
    getBytesInUse(keys: undefined | string | Array<string>): Promise<number>,

    /**
     * Removes one or more items from storage.
     */
    remove(
        keys: string | Array<string>,
        callback: () => undefined
    ): undefined,
    remove(keys: string | Array<string>): Promise<undefined>,

    /**
     * Sets multiple items.
     */
    set(
        /**
         * An object which gives each key/value pair to update storage with. Any other key/value pairs in
         * storage will not be affected.
         * Primitive values such as numbers will serialize as expected. Values
         * with a typeof "object" and "function" will typically serialize to
         * {}, with the exception of Array (serializes as expected), Date, and
         * Regex (serialize using their String representation).
         */
        items: object,
        callback: () => undefined
    ): undefined,
    set(items: object): Promise<undefined>,

    /**
    * Sets the desired access level for the storage area. The default will be
    * only trusted contexts.
    */
    setAccessLevel(
        accessOtions: {accessLevel: AccessLevel},
        callback: () => undefined
    ): undefined
    setAccessLevel(accessOtions: {accessLevel: AccessLevel}): Promise<undefined>
}

/**
 *
 * [StorageChange ](https://developer.chrome.com/docs/extensions/reference/api/storage#type-StorageChange)
 */
type StorageChange = {
    newValue: undefined | any,
    oldValue: undefined | any
}

/**
 *
 * [chrome.storage](https://developer.chrome.com/docs/extensions/reference/api/storage)
 */
interface Storage {
    /**
     *
     * [local](https://developer.chrome.com/docs/extensions/reference/api/storage#property-local)
     */
    local: StorageArea & {
        /**
         * The maximum amount (in bytes) of data that can be stored in local
         * storage, as measured by the JSON stringification of every value
         * plus every key's length. This value will be ignored if the extension
         * has the unlimitedStorage permission.
         */
        readonly QUOTA_BYTES: 10485760
    },

    /**
     * Items in the managed storage area are set by an enterprise policy
     * configured by the domain administrator, and are read-only for the
     * extension; trying to modify this namespace results in an error.
     *
     * [managed](https://developer.chrome.com/docs/extensions/reference/api/storage#property-managed)
     */
    managed: StorageArea,

    /**
     * Items in the session storage area are stored in-memory and will not be
     * persisted to disk.
     *
     * [session](https://developer.chrome.com/docs/extensions/reference/api/storage#property-session)
     */
    session: StorageArea & {
        /**
         * The maximum amount (in bytes) of data that can be stored in memory,
         * as measured by estimating the dynamically allocated memory usage of
         * every value and key.
         */
        readonly QUOTA_BYTES: 10485760
    },

    /**
     * Items in the sync storage area are synced using Chrome Sync.
     *
     * [sync](https://developer.chrome.com/docs/extensions/reference/api/storage#property-sync)
     */
    sync: StorageArea & {
        /**
         * The maximum number of items that can be stored in sync storage.
         */
        readonly MAX_ITEMS: 512,
        /**
         * The maximum number of set, remove, or clear operations that can be
         * performed each hour. This is 1 every 2 seconds, a lower ceiling than
         * the short term higher writes-per-minute limit.
         */
        readonly MAX_WRITE_OPERATIONS_PER_HOUR: 1800,
        /**
         * The maximum number of set, remove, or clear operations that can be
         * performed each minute. This is 2 per second, providing higher
         * throughput than writes-per-hour over a shorter period of time.
         */
        readonly MAX_WRITE_OPREATIONS_PER_MINUTE: 120,
        /**
         * The maximum total amount (in bytes) of data that can be stored in
         * sync storage, as measured by the JSON stringification of every
         * value plus every key's length. Updates
         */
        readonly QUOTA_BYTES: 102400,
        /**
         * The maximum size (in bytes) of each individual item in sync storage,
         * as measured by the JSON stringification of its value plus its key
         * length.
         */
        readonly QUOTA_BYTES_PER_ITEM: 8192,
    },

    /**
     * Fired when one or more items change.
     *
     * [onChanged](https://developer.chrome.com/docs/extensions/reference/api/storage#event-onChanged)
     */
    onChanged: Event<(changes: {}, areaName: string) => undefined>
}
//tabs
//https://developer.chrome.com/docs/extensions/reference/api/tabs

//Author: axarisar
//Date: 13/04/2024

//must include extensionTypes.d.ts
//must include runtime.d.ts

/**
 *
 * [MutedInfo](https://developer.chrome.com/docs/extensions/reference/api/tabs#type-MutedInfo)
 */
type MutedInfo = {
    extensionId: undefined | string,
    muted: boolean,
    readon: undefined | MutedInfoReason
}

/**
 *
 * [MutedInfoReason](https://developer.chrome.com/docs/extensions/reference/api/tabs#type-MutedInfoReason)
 */
type MutedInfoReason = (
    /**A user input action set the muted state.*/
    "user"
    /**Tab capture was started, forcing a muted state change.*/
    | "capture"
    /**An extension, identified by the extensionId field, set the muted state.*/
    | "extension"
)

/**
 *
 * [Tab](https://developer.chrome.com/docs/extensions/reference/api/tabs#type-Tab)
 */
type Tab = {
    /**
     * Whether the tab is active in its window. Does not necessarily mean the
     * window is focused.
     */
    active: boolean,
    /**
     * Whether the tab has produced sound over the past couple of seconds (but
     * it might not be heard if also muted). Equivalent to whether the 'speaker
     * audio' indicator is showing.
     */
    audible: undefined | boolean,
    /**
     * A discarded tab is one whose content has been unloaded from memory, but
     * is still visible in the tab strip. Its content is reloaded the next time
     * it is activated.
     */
    discarded: boolean,
    /**
     * This property is only present if the extension's manifest includes the
     * "tabs" permission. It may also be an empty string if the tab is loading.
     */
    faviconUrl: undefined | string,
    groupId: number,
    height: undefined | number,
    /**
     * Whether the tab is highlighted.
     */
    highlighted: boolean,
    id: undefined | number,
    incognito: boolean,
    index: number,
    lastAccessed: undefined | number,
    mutedInfo: undefined | MutedInfo,
    openerTabId: undefined | number,
    pendingUrl: undefined | number,
    pinned: boolean,
    sessionId: undefined | string,
    status: undefined | TabStatus,
    title: undefined | string,
    url: undefined | string,
    width: undefined | number,
    windowId: number
}

/**
 *
 * [TabStatus](https://developer.chrome.com/docs/extensions/reference/api/tabs#type-TabStatus)
 */
type TabStatus = (
    "unloaded"
    | "loading"
    | "complete"
)

/**
 *
 * [WindowType](https://developer.chrome.com/docs/extensions/reference/api/tabs#type-WindowType)
 */
type WindowType = (
    "normal"
    | "popup"
    | "panel"
    | "app"
    | "devtools"
)

/**
 *
 * [ZoomSettings](https://developer.chrome.com/docs/extensions/reference/api/tabs#type-ZoomSettings)
 */
type ZoomSettings = {
    defaultZoomFactor: undefined | number,

    /**
     * Defines how zoom changes are handled, i.e., which entity is responsible
     * for the actual scaling of the page; defaults to automatic.
     */
    mode: undefined | ZoomSettingsMode,

    /**
     * Defines whether zoom changes persist for the page's origin, or only take
     * effect in this tab; defaults to per-origin when in automatic mode, and
     * per-tab otherwise.
     */
    scope: undefined | ZoomSettingsScope
}

/**
 *
 * [ZoomSettingsMode](https://developer.chrome.com/docs/extensions/reference/api/tabs#type-ZoomSettingsMode)
 */
type ZoomSettingsMode = (
    "automatic"
    | "manual"
    | "disable"
)

/**
 * Defines whether zoom changes persist for the page's origin, or only take
 * effect in this tab
 *
 * [ZoomSettingsScope](https://developer.chrome.com/docs/extensions/reference/api/tabs#type-ZoomSettingsScope)
 */
type ZoomSettingsScope = (
    /**
     * Zoom changes persist in the zoomed page's origin, i.e., all other tabs
     * navigated to that same origin are zoomed as well. Moreover, per-origin
     * zoom changes are saved with the origin, meaning that when navigating to
     * other pages in the same origin, they are all zoomed to the same zoom
     * factor. The per-origin scope is only available in the automatic mode.
     */
    "per-origin"
    /**
     * Zoom changes only take effect in this tab, and zoom changes in other
     * tabs do not affect the zooming of this tab. Also, per-tab zoom changes
     * are reset on navigation; navigating a tab always loads pages with their
     * per-origin zoom factors.
     */
    | "per-tab"
)

/**
 *
 * [chrome.tabs](https://developer.chrome.com/docs/extensions/reference/api/tabs)
 */
interface Tabs {
    /**
     * The maximum number of times that captureVisibleTab can be called per
     * second. captureVisibleTab is expensive and should not be called too
     * often.
     *
     * [MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND](https://developer.chrome.com/docs/extensions/reference/api/tabs#property-MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND)
     */
    readonly MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND: 2,

    /**
     * The absence of a browser tab.
     *
     * [TAB_ID_NONE](https://developer.chrome.com/docs/extensions/reference/api/tabs#property-TAB_ID_NONE)
     */
    readonly TAB_ID_NONE: -1,

    /**
     * The absence of a tab index in a tab_strip.
     *
     * [TAB_INDEX_NONE](https://developer.chrome.com/docs/extensions/reference/api/tabs#property-TAB_INDEX_NONE)
     */
    readonly TAB_INDEX_NONE: -1,

    /**
     * Captures the visible area of the currently active tab in the specified
     * window. In order to call this method, the extension must have either the
     * <all_urls> permission or the activeTab permission. In addition to sites
     * that extensions can normally access, this method allows extensions to
     * capture sensitive sites that are otherwise restricted, including
     * chrome:-scheme pages, other extensions' pages, and data: URLs. These
     * sensitive sites can only be captured with the activeTab permission. File
     * URLs may be captured only if the extension has been granted file access.
     *
     * [captureVisibleTab()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-captureVisibleTab)
     */
    captureVisibleTab(
        windowId: undefined | number,
        options: undefined | ImageDetails,
        callback: (dataUrl: string) => undefined,
    ): undefined
    captureVisibleTab(
        windowId: undefined | number,
        options: undefined | ImageDetails
    ): Promise<string>

    /**
     * Connects to the content script(s) in the specified tab. The
     * runtime.onConnect event is fired in each content script running in the
     * specified tab for the current extension.
     *
     * [connect()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-connect)
     */
    connect(
        tabId: number,
        connectInfo: undefined | {
            documentId: undefined | string,
            frameId: undefined | number,
            name: undefined | string
        }
    ): Port,

    /**
     *
     * [create()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-create)
     */
    create(
        createProperties: {
            active: undefined | boolean,
            index: undefined | number,
            openerTabId: undefined | number,
            pinned: undefined | boolean,
            url: undefined | string,
            windowId: undefined | number
        },
        callback: (tab: Tab) => undefined
    ): undefined,
    create(
        createProperties: {
            active: undefined | boolean,
            index: undefined | number,
            openerTabId: undefined | number,
            pinned: undefined | boolean,
            url: undefined | string,
            windowId: undefined | number
        },
    ): Promise<Tab>,

    /**
     *
     * [detectLanguge()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-detectLanguage)
     */
    detectLanguage(
        tabId: undefined | number,
        callback: (language: string) => undefined
    ): undefined,
    detectLanguage(tabId: undefined | number): Promise<string>,

    /**
     * Discards a tab from memory. Discarded tabs are still visible on the tab
     * strip and are reloaded when activated.
     *
     * [discard()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-discard)
     */
    discard(
        tabId: undefined | number,
        callback: (tab: undefined | Tab) => undefined
    ): undefined,
    discard(tabId: undefined | number): Promise<undefined | Tab>,

    /**
     * Retrieves details about the specified tab.
     *
     * [get()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-get)
     */
    get(
        tabId: number,
        callback: (tab: Tab) => undefined
    ): undefined,
    get(tabId: number): Promise<Tab>,

    /**
     * Gets the tab that this script call is being made from. Returns undefined
     * if called from a non-tab context (for example, a background page or
     * popup view).
     *
     * [getCurrent()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-getCurrent)
     */
    getCurrent(callback: (tab: undefined | Tab) => undefined): undefined,
    getCurrent(): Promise<undefined | Tab>,

    /**
     * Gets the current zoom factor of a specified tab.
     *
     * [getZoom()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-getZoom)
     */
    getZoom(
        tabId: undefined | number,
        callback: (zoomFactor: number) => undefined
    ): undefined,
    getZoom(tabId: undefined | number): Promise<number>,

    /**
     *
     * [getZoomSettings()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-getZoomSettings)
     */
    getZoomSettings(
        tabId: undefined | number,
        callback: (zoomSettings: ZoomSettings) => undefined
    ): undefined,
    getZoomSettings(tabId: undefined | number): Promise<ZoomSettings>,

    /**
     * Go back to the previous page, if one is available.
     *
     * [goBack()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-goBack)
     */
    goBack(
        tabId: undefined | number,
        callback: () => undefined
    ): undefined,
    goBack(tabId: undefined | number): Promise<undefined>,

    /**
     * Go foward to the next page, if one is available.
     *
     * [goForward()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-goForward)
     */
    goForward(
        tabId: undefined | number,
        callback: () => undefined
    ): undefined,
    goForward(tabId: undefined | number): Promise<undefined>,

    /**
     * Adds one or more tabs to a specified group, or if no group is specified,
     * adds the given tabs to a newly created group.
     *
     * [group()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-group)
     */
    group(
        options: {
            /**
             * Configurations for creating a group. Cannot be used if groupId
             * is already specified.
             */
            createProperties: undefined | {windowId: undefined | number},
            groupId: undefined | number,
            tabIds: number | [number, ...Array<number>]
        },
        callback: (groupId: number) => undefined
    ): undefined,
    group(
        options: {
            /**
             * Configurations for creating a group. Cannot be used if groupId
             * is already specified.
             */
            groupId: undefined | number,
            tabIds: number | [number, ...Array<number>]
        }
    ): Promise<number>,

    /**
     * Highlights the given tabs and focuses on the first of group. Will appear
     * to do nothing if the specified tab is currently active.
     *
     * [highlight()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-highlight)
     */
    highlight(
        highlightInfo: {
            tabs: number | Array<number>,
            windowId: undefined | number,
        },
        callback: (window: Window) => undefined
    ): undefined,
    highlight(
        highlightInfo: {
            tabs: number | Array<number>,
            windowId: undefined | number,
        }
    ): Promise<Window>,


    /**
     * Moves one or more tabs to a new position within its window, or to a new
     * window. Note that tabs can only be moved to and from normal
     * (window.type === "normal") windows.
     *
     * [move()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-move)
     */
    move(
        tabIds: number | Array<number>,
        moveProperties: {
            /**
             * The position to move the window to. Use -1 to place the tab at
             * the end of the window.
             */
            index: number,
            windowId: undefined | number
        },
        callback: (tabs: Tab | Array<Tabs>) => undefined
    ): undefined,
    move(
        tabIds: number | Array<number>,
        moveProperties: {
            /**
             * The position to move the window to. Use -1 to place the tab at
             * the end of the window.
             */
            index: number,
            windowId: undefined | number
        }
    ): Promise<Tab | Array<Tab>>,

    /**
     * Gets all tabs that have the specified properties, or all tabs if no
     * properties are specified.
     *
     * [query()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-query)
     */
    query(
        queryInfo: {
            active: undefined | boolean,
            audible: undefined | boolean,
            autoDisable: undefined | boolean,
            currentWindow: undefined | boolean,
            discarded: undefined | boolean,
            /**
             * the group that the tabs are in, or tabGroups.TAB_GROUP_ID_NONE
             * for ungrouped tabs.
             */
            groupId: undefined | number,
            highlighted: undefined | boolean,
            index: undefined | number,
            lastFocusedWindow: undefined | boolean,
            muted: undefined | boolean,
            pinned: undefined | boolean,
            status: undefined | TabStatus,
            title: undefined | string,
            /**
             * Match tabs against one or more URL patterns. Fragment
             * identifiers are not matched. This property is ignored if the
             * extension does not have the "tabs" permission.
             */
            url: undefined | string | Array<string>,
            /**
             * The ID of the parent window, or windows.WINDOW_ID_CURRENT for
             * the current window.
             */
            windowId: undefined | number,
            windowType: undefined | WindowType
        },
        callback: (result: Array<Tab>) => undefined
    ): undefined,
    query (
        queryInfo: {
            active: undefined | boolean,
            audible: undefined | boolean,
            autoDisable: undefined | boolean,
            currentWindow: undefined | boolean,
            discarded: undefined | boolean,
            /**
             * the group that the tabs are in, or tabGroups.TAB_GROUP_ID_NONE
             * for ungrouped tabs.
             */
            groupId: undefined | number,
            highlighted: undefined | boolean,
            index: undefined | number,
            lastFocusedWindow: undefined | boolean,
            muted: undefined | boolean,
            pinned: undefined | boolean,
            status: undefined | TabStatus,
            title: undefined | string,
            /**
             * Match tabs against one or more URL patterns. Fragment
             * identifiers are not matched. This property is ignored if the
             * extension does not have the "tabs" permission.
             */
            url: undefined | string | Array<string>,
            /**
             * The ID of the parent window, or windows.WINDOW_ID_CURRENT for
             * the current window.
             */
            windowId: undefined | number,
            windowType: undefined | WindowType
        }
    ): Promise<Array<Tab>>,

    /**
     *
     * [reload()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-reload)
     */
    reload(
        tabId: undefined | number,
        /**
         * Whether to bypass local caching. Defaults to false.
         */
        reloadProperties: undefined | {bypassCache: boolean},
        callback: () => undefined,
    ): undefined,
    reload(
        tabId: undefined | number,
        /**
         * Whether to bypass local caching. Defaults to false.
         */
        reloadProperties: undefined | {bypassCache: boolean},
    ): Promise<undefined>,

    /**
     *
     * [remove()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-remove)
     */
    remove(
        tabIds: undefined | number | Array<number>,
        callback: () => undefined
    ): undefined,
    remove(tabIds: undefined | number | Array<number>): Promise<undefined>,

    /**
     * Sends a single message to the content script(s) in the specified tab,
     * with an optional callback to run when a response is sent back. The
     * runtime.onMessage event is fired in each content script running in the
     * specified tab for the current extension.
     *
     * [sendMessage()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-sendMessage)
     */
    sendMessage(
        tabId: number,
        /**
         * The message to send. This message should be a JSON-ifiable object.
         */
        message: any,
        options: undefined | {
            /**
             * Send a message to a specific document identified by documentId
             *instead of all frames in the tab.
             */
            documentId: undefined | string,
            /**
             * Send a message to a specific frame identified by frameId instead
             * of all frames in the tab.
             */
            frameId: undefined | number
        },
        callback: (response: any) => undefined
    ): undefined,
    sendMessage(
        tabId: number,
        /**
         * The message to send. This message should be a JSON-ifiable object.
         */
        message: any,
        options: undefined | {
            /**
             * Send a message to a specific document identified by documentId
             *instead of all frames in the tab.
             */
            documentId: undefined | string,
            /**
             * Send a message to a specific frame identified by frameId instead
             * of all frames in the tab.
             */
            frameId: undefined | number
        },
    ): Promise<any>,

    /**
     *
     * [setZoom()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom)
     */
    setZoom(
        tabId: undefined | number,
        /**
         * The new zoom factor. A value of 0 sets the tab to its current
         * default zoom factor. Values greater than 0 specify a
         * (possibly non-default) zoom factor for the tab.
         */
        zoomFactor: number,
        callback: () => undefined,
    ): undefined,
    setZoom(
        tabId: undefined | number,
        /**
         * The new zoom factor. A value of 0 sets the tab to its current
         * default zoom factor. Values greater than 0 specify a
         * (possibly non-default) zoom factor for the tab.
         */
        zoomFactor: number
    ): Promise<undefined>,

    /**
     * Sets the zoom settings for a specified tab, which define how zoom
     * changes are handled. These settings are reset to defaults upon
     * navigating the tab.
     *
     * [setZoomSettings()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoomSettings)
     */
    setZoomSettings(
        tabId: undefined | number,
        zoomSettings: ZoomSettings,
        callback: () => undefined
    ): undefined,
    setZoomSettings(
        tabId: undefined | number,
        zoomSettings: ZoomSettings,
    ): Promise<undefined>,

    /**
     * Removes one or more tabs from their respective groups. If any groups
     * become empty, they are deleted.
     *
     * [ungroup()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-ungroup)
     */
    ungroup(
        tabIds: number | [number, ...Array<number>],
        callback: () => undefined
    ): undefined,
    ungroup(tabIds: number | [number, ...Array<number>]): Promise<undefined>,

    /**
     * Modifies the properties of a tab. Properties that are not specified in
     * updateProperties are not modified.
     *
     * [update()](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-update)
     */
    update(
        tabId: undefined | number,
        updatePRoperties: {
            active: undefined | boolean,
            autoDiscardable: undefined | boolean,
            highlighted: undefined | boolean,
            muted: undefined | boolean,
            openertabId: undefined | number,
            pinned: undefined | number,
            /**
             * A URL to navigate the tab to. JavaScript URLs are not supported;
             * use scripting.executeScript instead.
             */
            url: undefined | string
        },
        callback: (tab: undefined | Tab) => undefined
    ): undefined,
    update(
        tabId: undefined | number,
        updatePRoperties: {
            active: undefined | boolean,
            autoDiscardable: undefined | boolean,
            highlighted: undefined | boolean,
            muted: undefined | boolean,
            openertabId: undefined | number,
            pinned: undefined | number,
            /**
             * A URL to navigate the tab to. JavaScript URLs are not supported;
             * use scripting.executeScript instead.
             */
            url: undefined | string
        }
    ): Promise<undefined | Tab>,

    //Events

    /**
     * Fires when the active tab in a window changes. Note that the tab's URL
     * may not be set at the time this event fired, but you can listen to
     * onUpdated events so as to be notified when a URL is set.
     *
     * [onActivated](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onActivated)
     */
    onActivated: Event<(activeIndo: {
        tabId: number,
        windowId: number
    }) => undefined>,

    /**
     * Fired when a tab is attached to a window; for example, because it was
     * moved between windows.
     *
     * [onAttached](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onAttached)
     */
    onAttached: Event<(
        tabId: number,
        attachInfo: {newPosition: number, newWindowId: number}
    ) => undefined>,

    /**
     * Fired when a tab is created. Note that the tab's URL and tab group
     * membership may not be set at the time this event is fired, but you can
     * listen to onUpdated events so as to be notified when a URL is set or the
     * tab is added to a tab group.
     *
     * [onCreated](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onCreated)
     */
    onCreated: Event<(tab: Tab) => undefined>,

    /**
     * Fired when a tab is detached from a window; for example, because it was
     * moved between windows.
     *
     * [onDetached](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onDetached)
     */
    onDetached: Event<(
        tabId: number,
        detachInfo: {oldPosition: number, oldWindowId: number}
    ) => undefined>,

    /**
     * Fired when the highlighted or selected tabs in a window changes.
     *
     * [onHighlighted](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onHighlighted)
     */
    onHighlighted: Event<(highlightInfo: {
        tabIds: Array<number>,
        windowId: number
    }) => undefined>,

    /**
     * Fired when a tab is moved within a window. Only one move event is fired,
     * representing the tab the user directly moved. Move events are not fired
     * for the other tabs that must move in response to the manually-moved tab.
     * This event is not fired when a tab is moved between windows.
     *
     * [onMoved](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onMoved)
     */
    onMoved: Event<(
        tabId: number,
        moveInfo: {fromIndex: number, toIndex: number, windowId: number}
    ) => undefined>,

    /**
     * Fired when a tab is closed.
     *
     * [onRemove](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onRemoved)
     */
    onRemove: Event<(
        tabId: number,
        removeInfo: {
            isWindowClosing: boolean,
            windowId: number
        }
    ) => undefined>

    /**
     * Fired when a tab is replaced with another tab due to prerendering or
     * instant.
     *
     * [onReplaced](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onReplaced)
     */
    onReplaced: Event<(addedTabId: number, removedId: number) => undefined>

    /**
     * Fired when a tab is updated.
     *
     * [onUpdate](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onUpdated)
     */
    onUpdate: Event<(
        tabId: number,
        changeInfo: {
            active: undefined | boolean,
            autoDiscardable: undefined | boolean,
            discarded: undefined | boolean,
            highlighted: undefined | boolean,
            faviconUrl: undefined | boolean,
            groupId: undefined | number,
            mutedInfo: undefined | MutedInfo,
            pinned: undefined | number,
            status: undefined | TabStatus,
            title: undefined | string,
            url: undefined | string
        },
        tab: Tab
    ) => undefined>

    /**
     * Fired when a tab is zoomed.
     *
     * [onZoomChange](https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onZoomChange)
     */
    onZoomChange: Event<(zoomChangeInfo: {
        newZoomFactor: number,
        oldZoomFactor: number,
        tabId: number,
        zoomSettings: ZoomSettings
    }) => undefined>
}
}
