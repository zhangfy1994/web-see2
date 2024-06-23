import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import webSee from '../../packages/core/dist/index.esm';
import performance from '../../packages/performance/dist/index.esm';
// import recordscreen from '../../packages/recordscreen/src';

// import webSee from '@websee/core';
// import performance from '@websee/performance';
// import recordscreen from '@websee/recordscreen';

Vue.use(webSee, {
  dsn: 'http://localhost:8080/reportData',
  apikey: 'abcd',
  silentWhiteScreen: true,
  skeletonProject: true,
  repeatCodeError: true,
  userId: '123',
  handleHttpStatus(data) {
    let { url, response } = data;
    // code为200，接口正常，反之亦然
    let { code } =
      typeof response === 'string' ? JSON.parse(response || '{}') : response;
    if (url.includes('/getErrorList')) {
      return code === 200 ? true : false;
    } else {
      return true;
    }
  },
});
webSee.use(performance);
// webSee.use(recordscreen, { recordScreentime: 15 });

Vue.use(ElementUI, { size: 'mini' });
Vue.config.productionTip = false;

setTimeout(() => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
}, 2000);

const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(entry);
  });
});

observer.observe({ type: 'resource', buffered: true });
