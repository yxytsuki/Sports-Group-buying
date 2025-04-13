import App from './App'
import {
	createPinia
} from 'pinia'
import {
	useUserStore
} from './store/user'
import Component from './myComponents/component.vue'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
// main.js
import uView from "uview-ui";
import axios from './utils/request.js'
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
// 添加前置导航守卫
// const authUrl = ['/pages/order/index', '/pages/pay/pay']
// global.beforeEach((to, from, next) => {
// 	// console.log(to, from, next())
// 	if (!authUrl.includes(to.path)) {
// 		next()
// 		return
// 	}
// 	const token = useUserStore().userInfo.token
// 	if (token) {
// 		next()
// 	} else {
// 		next('pages/getUserInfo/getUserInfo')
// 	}
// })
export function createApp() {
	const app = createSSRApp(App)
	// 创建//pinia实例
	const pinia = createPinia()
	app.use(pinia)
	app.component('my-component', Component)
	return {
		app,
		pinia
	}
}
// #endif