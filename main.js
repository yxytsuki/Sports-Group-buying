import App from './App'
import Component from './myComponents/component.vue'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
// main.js
import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.component('my-component', Component)
	return {
		app
	}
}
// #endif