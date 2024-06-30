import { EVENTTYPES } from '@websee2/common';
import { BasePlugin, SdkBase } from '@websee2/types';
import { generateUUID } from '@websee2/utils';
import { recordScreen } from './recordscreen';
import { _support } from '../../core/src/global';

export interface RecordScreenOptions {
  recordScreenTypes: string[];
  recordScreentime: number;
}

class RecordScreen extends BasePlugin {
  type: string;
  recordScreentime = 10;
  recordScreenTypes: string[] = [
    EVENTTYPES.ERROR,
    EVENTTYPES.UNHANDLEDREJECTION,
    EVENTTYPES.RESOURCE,
    EVENTTYPES.FETCH,
    EVENTTYPES.XHR,
  ];
  constructor(options: RecordScreenOptions) {
    super(EVENTTYPES.RECORDSCREEN);
    this.type = EVENTTYPES.RECORDSCREEN;
    this.recordScreentime = options.recordScreentime;
    this.recordScreenTypes =
      options.recordScreenTypes || this.recordScreenTypes;
  }

  core({ transportData, options }: SdkBase) {
    options.silentRecordScreen = true;
    options.recordScreenTypes = this.recordScreenTypes;
    _support.recordScreenId = generateUUID();
    recordScreen(transportData, this.recordScreentime);
  }
}

export default RecordScreen;
