import Vue from 'vue';
import App from './App.vue';
import store from './store';

store.init();

Vue.prototype.$store = store;

if (!window.fetch) {
  require('whatwg-fetch');
}


new Vue({
  el: '#app',
  render: h => h(App)
})
