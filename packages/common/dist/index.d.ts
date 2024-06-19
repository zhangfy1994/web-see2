declare const SDK_NAME = "web-see";
declare const SDK_VERSION: string;
/**
 * 事件类型
 */
declare enum EVENTTYPES {
    XHR = "xhr",
    FETCH = "fetch",
    CLICK = "click",
    HISTORY = "history",
    ERROR = "error",
    HASHCHANGE = "hashchange",
    UNHANDLEDREJECTION = "unhandledrejection",
    RESOURCE = "resource",
    DOM = "dom",
    VUE = "vue",
    REACT = "react",
    CUSTOM = "custom",
    PERFORMANCE = "performance",
    RECORDSCREEN = "recordScreen",
    WHITESCREEN = "whiteScreen"
}
/**
 * 用户行为
 */
declare enum BREADCRUMBTYPES {
    HTTP = "Http",
    CLICK = "Click",
    RESOURCE = "Resource_Error",
    CODEERROR = "Code_Error",
    ROUTE = "Route",
    CUSTOM = "Custom"
}
/**
 * 状态
 */
declare enum STATUS_CODE {
    ERROR = "error",
    OK = "ok"
}

export { BREADCRUMBTYPES, EVENTTYPES, SDK_NAME, SDK_VERSION, STATUS_CODE };
