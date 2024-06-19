import { BREADCRUMBTYPES, EVENTTYPES } from '@websee2/common';
import { BreadcrumbData, InitOptions } from '@websee2/types';
import { bindOptionsHelp, getTimestamp } from '@websee2/utils';
import { _support } from './global';

class Breadcrumb {
  maxBreadcrumbs = 20; // 用户行为存放的最大长度
  beforePushBreadcrumb: unknown = null;
  stack: BreadcrumbData[] = [];

  /**
   * 添加用户行为栈
   */
  push(data: BreadcrumbData): void {
    if (typeof this.beforePushBreadcrumb === 'function') {
      const result = this.beforePushBreadcrumb(data);
      if (result) {
        this.immediatePush(result);
      }
      return;
    }
    this.immediatePush(data);
  }

  immediatePush(data: BreadcrumbData) {
    data.time || (data.time = getTimestamp());
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.stack.shift();
    }
    this.stack.push(data);
  }

  getStack() {
    return this.stack;
  }

  clear() {
    this.stack = [];
  }

  getCategory(type: EVENTTYPES): BREADCRUMBTYPES {
    switch (type) {
      // 接口请求
      case EVENTTYPES.XHR:
      case EVENTTYPES.FETCH:
        return BREADCRUMBTYPES.HTTP;

      // 用户点击
      case EVENTTYPES.CLICK:
        return BREADCRUMBTYPES.CLICK;

      // 路由变化
      case EVENTTYPES.HISTORY:
      case EVENTTYPES.HASHCHANGE:
        return BREADCRUMBTYPES.ROUTE;

      // 加载资源
      case EVENTTYPES.RESOURCE:
        return BREADCRUMBTYPES.RESOURCE;

      // Js代码报错
      case EVENTTYPES.UNHANDLEDREJECTION:
      case EVENTTYPES.ERROR:
        return BREADCRUMBTYPES.CODEERROR;

      // 用户自定义
      default:
        return BREADCRUMBTYPES.CUSTOM;
    }
  }

  bindOptions(options: InitOptions) {
    bindOptionsHelp(
      this,
      'beforePushBreadcrumb',
      options.beforePushBreadcrumb,
      'function',
    );
    bindOptionsHelp(
      this,
      'maxBreadcrumbs',
      options.maxBreadcrumbs || 20,
      'number',
    );
  }
}

export const breadcrumb = new Breadcrumb();
_support.breadcrumb = breadcrumb;
