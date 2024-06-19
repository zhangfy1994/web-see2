import { EVENTTYPES, BREADCRUMBTYPES } from '@websee2/common';

interface BreadcrumbData {
    type: EVENTTYPES;
    category: BREADCRUMBTYPES;
    status?: number;
    time: number;
    data: unknown;
}
/**
 * 上报的数据接口
 */
interface ReportData extends HttpData, ResouceError, LongTask, PerformanceData, MemoryData, CodeError, RecordScreen {
    type: string;
    pageUrl: string;
    time: number;
    uuid: string;
    userId: string;
    apikey: string;
    status: number;
    statusText: string;
    sdkVersion: string;
    breadcrumb?: BreadcrumbData[];
    deviceInfo: {
        browserVersion: string | number;
        browser: string;
        osVersion: string | number;
        os: string;
        ua: string;
        device: string;
        device_type: string;
    };
}
/**
 * http请求
 */
interface HttpData {
    type?: string;
    method?: string;
    time: number;
    url: string;
    elapsedTime: number;
    message: string;
    statusText?: string;
    status?: number;
    requestData?: {
        httpType: string;
        method: string;
        data: unknown;
    };
    response?: {
        Status: number;
        data?: unknown;
    };
}
/**
 * 资源加载失败
 */
interface ResouceError {
    time: number;
    message: string;
    name: string;
}
/**
 * 长任务列表
 */
interface LongTask {
    time: number;
    name: string;
    longTask: unknown;
}
/**
 * 性能指标
 */
interface PerformanceData {
    name: string;
    value: number;
    rating: string;
}
/**
 * 内存信息
 */
interface MemoryData {
    name: string;
    memory: {
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
        usedJSHeapSize: number;
    };
}
/**
 * 代码错误
 */
interface CodeError {
    column: number;
    line: number;
    message: string;
    fileName: string;
}
/**
 * 录屏信息
 */
interface RecordScreen {
    recordScreenId: string;
    events: string;
}
type VoidFn = (...args: unknown[]) => void;
interface ReplaceHandler {
    type: EVENTTYPES;
    callback: Callback;
}
interface Callback {
    (...args: any[]): any;
}
type ReplaceCallback = (data: any) => void;
interface IAnyObject {
    [key: string]: any;
}
interface ErrorTarget {
    target?: {
        localName?: string;
    };
    error?: any;
    message?: string;
}
interface RouteHistory {
    from: string;
    to: string;
}

interface InitOptions {
    dsn: string;
    apikey: string;
    userId?: string;
    disabled?: boolean;
    silentXhr?: boolean;
    silentFetch?: boolean;
    silentClick?: boolean;
    silentError?: boolean;
    silentUnhandledrejection?: boolean;
    silentHashchange?: boolean;
    silentHistory?: boolean;
    silentPerformance?: boolean;
    silentRecordScreen?: boolean;
    recordScreentime?: number;
    recordScreenTypeList?: string[];
    silentWhiteScreen?: boolean;
    skeletonProject?: boolean;
    whiteBoxElements?: string[];
    filterXhrUrlRegExp?: RegExp;
    useImgUpload?: boolean;
    throttleDelayTime?: number;
    overTime?: number;
    maxBreadcrumbs?: number;
    beforePushBreadcrumb?(data: BreadcrumbData): BreadcrumbData;
    beforeDataReport?(data: ReportData): Promise<ReportData | boolean>;
    getUserId?: () => string | number;
    handleHttpStatus?: (data: unknown) => boolean;
    repeatCodeError?: boolean;
}

export type { BreadcrumbData, Callback, CodeError, ErrorTarget, HttpData, IAnyObject, InitOptions, LongTask, MemoryData, PerformanceData, RecordScreen, ReplaceCallback, ReplaceHandler, ReportData, ResouceError, RouteHistory, VoidFn };
