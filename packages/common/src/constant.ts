import version from '../../core/package.json';
export const SDK_NAME = 'web-see';
export const SDK_VERSION = version.version;
/**
 * 事件类型
 */
export enum EVENTTYPES {
  XHR = 'xhr',
  FETCH = 'fetch',
  CLICK = 'click',
  HISTORY = 'history',
  ERROR = 'error',
  HASHCHANGE = 'hashchange',
  UNHANDLEDREJECTION = 'unhandledrejection',
  RESOURCE = 'resource',
  DOM = 'dom',
  VUE = 'vue',
  REACT = 'react',
  CUSTOM = 'custom',
  PERFORMANCE = 'performance',
  RECORDSCREEN = 'recordScreen',
  WHITESCREEN = 'whiteScreen',
}

/**
 * 用户行为
 */
export enum BREADCRUMBTYPES {
  HTTP = 'Http',
  CLICK = 'Click',
  RESOURCE = 'Resource_Error',
  CODEERROR = 'Code_Error',
  ROUTE = 'Route',
  CUSTOM = 'Custom',
}

/**
 * 状态
 */
export enum STATUS_CODE {
  ERROR = 'error',
  OK = 'ok',
}
