import { EVENTTYPES, STATUS_CODE } from '@websee2/common';
import { BasePlugin, SdkBase } from '@websee2/types';
import { getLongTask, getResource, getWebVitals } from './performance';
import { getTimestamp } from '@websee2/utils';

class WebPerformance extends BasePlugin {
  type: string;
  constructor() {
    super(EVENTTYPES.PERFORMANCE);
    this.type = EVENTTYPES.PERFORMANCE;
  }

  core({ transportData }: SdkBase) {
    // 获取FCP、LCP、TTFB、FID等指标
    getWebVitals((res: any) => {
      // name指标名称、rating 评级、value数值
      const { name, rating, value } = res;
      transportData.send({
        type: this.type,
        time: getTimestamp(),
        statusType: STATUS_CODE.OK,
        name,
        rating,
        value,
      });
    });

    getLongTask((res: any) => {
      transportData.send({
        type: this.type,
        time: getTimestamp(),
        statusType: STATUS_CODE.OK,
        name: res.name,
        value: res.value,
      });
    });

    getResource((res: any) => {
      transportData.send({
        type: this.type,
        time: getTimestamp(),
        statusType: STATUS_CODE.OK,
        resourceList: res,
      });
    });
  }
}

export default WebPerformance;
