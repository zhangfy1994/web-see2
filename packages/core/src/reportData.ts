import { SDK_VERSION } from '@websee2/common';
import { InitOptions, ReportData } from '@websee2/types';
import { Queue, bindOptionsHelp, generateUUID } from '@websee2/utils';
import { _support } from './global';
import { breadcrumb } from './breadcrumb';

class TransportData {
  userId = '';
  apikey = '';
  dsn = '';
  uuid = '';
  queue = new Queue();
  beforeDataReport?: (data: ReportData) => ReportData;
  getUserId?: () => string;
  useImageUpload = false;

  constructor() {
    this.uuid = generateUUID();
  }

  beacon(url: string, data: ReportData) {
    return navigator.sendBeacon(url, new Blob([JSON.stringify(data)]));
  }

  imgRequest(url: string, data: ReportData) {
    const request = () => {
      const img = new Image();
      const spliceStr = url.indexOf('?') > -1 ? '&' : '?';
      img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`;
    };
    this.queue.addFn(request);
  }

  xhrRequest(url: string, data: ReportData) {
    const request = () => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    };
    this.queue.addFn(request);
  }

  // 添加公告信息
  getTransportData(data: ReportData): ReportData {
    return {
      ...data,
      uuid: this.uuid,
      userId: this.getUserId ? this.getUserId() : this.userId,
      apikey: this.apikey,
      sdkVersion: SDK_VERSION,
      pageUrl: location.href || '',
      deviceInfo: _support.deviceInfo,
      breadcrumb: breadcrumb.getStack(),
    };
  }

  // 发送数据
  send(data: ReportData) {
    const { beforeDataReport, useImageUpload, dsn } = this;
    if (!dsn) return;
    let transportData = this.getTransportData(data);
    if (typeof beforeDataReport === 'function') {
      transportData = beforeDataReport(data);
    }
    if (!transportData) return;

    const beaconResult = this.beacon(dsn, transportData);
    if (!beaconResult) {
      if (useImageUpload) {
        this.imgRequest(this.dsn, data);
      } else {
        this.xhrRequest(this.dsn, data);
      }
    }
  }

  bindOptions(options: InitOptions) {
    const { dsn, apikey, userId, beforeDataReport, getUserId, useImgUpload } =
      options;
    bindOptionsHelp(this, 'dsn', dsn, 'string');
    bindOptionsHelp(this, 'apikey', apikey, 'string');
    bindOptionsHelp(this, 'userId', userId, 'string');
    bindOptionsHelp(this, 'beforeDataReport', beforeDataReport, 'function');
    bindOptionsHelp(this, 'getUserId', getUserId, 'function');
    bindOptionsHelp(this, 'useImgUpload', useImgUpload, 'boolean');
  }
}

const transportData =
  _support.transportData || (_support.transportData = new TransportData());
export { transportData };
