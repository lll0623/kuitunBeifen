// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
//全局css
import './assets/css/base.css'
import 'font-awesome/css/font-awesome.min.css'
//util
import {setCookie,getCookie,setCookie_onePointNine} from './util/index.js'

// 全局js
import './assets/js/index.js'

// 引入Mint UI全部组件
import Mint from 'mint-ui';
Vue.use(Mint);
import 'mint-ui/lib/style.css';
// 引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './element-variables.scss'
Vue.use(ElementUI);

import noMoreClick from './util/noMoreClick.js'

Vue.use(VueRouter)
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
// Require dependencies
let VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);

// 引入全局变量
import GLOBAL_ from './util/Global.js'
Vue.prototype.GLOBAL = GLOBAL_



Vue.config.productionTip = false
import qs from 'qs'
import axios from 'axios'
import {wXLoginWithOpenId,getWxConf,getPStructBindStatus} from './api/api.js'
import { Toast } from 'mint-ui'
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    // store,
    render: h => h(App),
    components: { App },
    template: '<App/>'
})
router.beforeResolve((to,from,next) => {
    let u = navigator.userAgent;
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(!getCookie("Token") || typeof(getCookie("Token"))=="undefined" || getCookie("Token") == null){
        setCookie("beforeUrl",to.fullPath);
        let redirect_uri = encodeURIComponent(window.location.href);
        let APPID = "",  CODE = "";
       //解决重复登录url添加重复的code与state问题
       let parseUrl = qs.parse(window.location.href.split('?')[1]);
       // Array.isArray(value)
       if(Array.isArray(parseUrl.code)){
          CODE = parseUrl.code[0];
       }else {
           CODE = parseUrl.code
       }
        // console.log(CODE)
        let parm = {
             code:CODE,
             state:""
         }
        // 获取获取appid ImageDomain
        getWxConf({}).then(res =>{
            if(res.Status == 200){
                APPID = res.Data.AppId;
                setCookie("ImageDomain",res.Data.ImageDomain);
                setCookie("Domain",res.Data.Domain);
            }else {
                Toast({
                    message: res.Message,
                    position: 'top',
                    iconClass: 'fa fa-warning',
                    duration: 3000
                });
            }
        })
        // 写入Cookie操作
        wXLoginWithOpenId(parm).then(res =>{
            // console.log(res)
            if(res.Status == 200){
                setCookie_onePointNine("Token",res.Data.Token);
                // setCookie("AccountId",res.Data.AccountId);
                setCookie("HasBindPhone",res.Data.HasBindPhone);
                setCookie("UserId",res.Data.UserId);
                let beforeUrl = getCookie("beforeUrl");
                window.location.href = beforeUrl
            }else {
                // 跳转到微信授权页面
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+APPID+"&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
            }
        })
    }
    else if(getCookie("HasBindPhone") == 0 && !to.meta.isHistory && (!getCookie("UserId") || typeof(getCookie("UserId"))=="undefined" || getCookie("UserId") == null)){
        next('/login');
    }
    else if(getCookie("HasBindPhone") == 1 && to.meta.isHistory){
        WeixinJSBridge.call('closeWindow');// 关闭wx页面，回到聊天界面，不会弹出询问
    }
    // 等个几秒
    else if (to.meta.idWait) {
        window.setTimeout({
        },1000)
        next();
    }
    else if(isiOS && to.path !== location.pathname) {
        location.assign(to.fullPath)
    }else if(!!getCookie("PStructId") && to.meta.BindStatus === true && window.config.BindStatus === true) { // 需要判断房产是否审批的页面
        let parm = {
            pStructId:getCookie("PStructId")
        }
        getPStructBindStatus(parm).then(res =>{
            if(res.Status == 200){
                setCookie("BindStatus",res.Data);
                if(!!getCookie("PStructId") && getCookie("BindStatus") === "false"){
                    Toast({
                      message: '该房间未通过审核，请就近联系物业',
                      position: 'top',
                      className:"BindStatusClass",
                      iconClass: 'icon icon-success',
                      duration: 500000
                    });
                }
                next();
            }else {
                setCookie("BindStatus",false);
                if(!!getCookie("PStructId") && getCookie("BindStatus") === "false"){
                    Toast({
                      message: '该房间未通过审核，请就近联系物业',
                      position: 'top',
                      className:"BindStatusClass",
                      iconClass: 'icon icon-success',
                      duration: 500000
                    });
                }
                next();
            }
        })
    }
    else {
        next();
    }
})
router.afterEach((to,from,next) => {
    window.scrollTo(0,0);
})
