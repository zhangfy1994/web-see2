/* eslint-disable @typescript-eslint/no-explicit-any */
import { BREADCRUMBTYPES, EVENTTYPES } from '@websee2/common';

export interface BreadcrumbData {
  type: EVENTTYPES; // 事件类型
  category: BREADCRUMBTYPES; // 用户行为类型
  status?: number; // 行为状态
  time: number; // 发生时间
  data: unknown;
}

/**
 * 上报的数据接口
 */
export interface ReportData
  extends HttpData,
    ResouceError,
    LongTask,
    PerformanceData,
    MemoryData,
    CodeError,
    RecordScreen {
  type: string; // 事件类型
  pageUrl: string; // 页面地址
  time: number; // 发生时间
  uuid: string; // 页面唯一标识
  userId: string; // 用户id
  apikey: string; // 项目id
  status: number; // 事件状态
  statusText: string;
  sdkVersion: string; // 版本信息
  breadcrumb?: BreadcrumbData[]; // 用户行为

  // 设备信息
  deviceInfo: {
    browserVersion: string | number; // 版本号
    browser: string; // Chrome
    osVersion: string | number; // 电脑系统 10
    os: string; // 设备系统
    ua: string; // 设备详情
    device: string; // 设备种类描述
    device_type: string; // 设备种类，如pc
  };
}

/**
 * http请求
 */
export interface HttpData {
  type?: string;
  method?: string;
  time: number;
  url: string; // 接口地址
  elapsedTime: number; // 接口时长
  message: string; // 接口信息
  statusText?: string; // 接口状态编码
  status?: number; // 接口状态
  requestData?: {
    httpType: string; // 请求类型 xhr fetch
    method: string; // 请求方式
    data: unknown;
  };
  response?: {
    Status: number; // 接口状态
    data?: unknown;
  };
}

/**
 * 资源加载失败
 */
export interface ResouceError {
  time: number;
  message: string; // 加载失败的信息
  name: string; // 脚本类型：js脚本
}

/**
 * 长任务列表
 */
export interface LongTask {
  time: number;
  name: string; // longTask
  longTask: unknown; // 长任务详情
}

/**
 * 性能指标
 */
export interface PerformanceData {
  name: string; // FCP
  value: number; // 数值
  rating: string; // 等级
}

/**
 * 内存信息
 */
export interface MemoryData {
  name: string; // memory
  memory: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

/**
 * 代码错误
 */
export interface CodeError {
  column: number;
  line: number;
  message: string;
  fileName: string; // 发出错误的文件
}

/**
 * 录屏信息
 */
export interface RecordScreen {
  recordScreenId: string; // 录屏id
  events: string; // 录屏内容
}

export type VoidFn = (...args: unknown[]) => void;

export interface ReplaceHandler {
  type: EVENTTYPES;
  callback: Callback;
}

export interface Callback {
  (...args: any[]): any;
}

export type ReplaceCallback = (data: any) => void;

export interface IAnyObject {
  [key: string]: any;
}

export interface ErrorTarget {
  target?: {
    localName?: string;
  };
  error?: any;
  message?: string;
}

export interface RouteHistory {
  from: string;
  to: string;
}

export interface SdkBase {
  transportData: any; // 数据上报
  breadcrumb: any; // 用户行为
  options: any; // 公共配置
  notify: any; // 发布消息
}

export abstract class BasePlugin {
  public type: string;
  constructor(type: string) {
    this.type = type;
  }

  abstract core(args: SdkBase): void;
}
