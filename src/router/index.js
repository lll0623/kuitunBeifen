import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Index from '@/views/Index.vue'

//组件的异步加载,注意后缀vue
// 登录
const Login = resolve => {
	require.ensure([], () => resolve(require('@/views/Login.vue')), 'Login')
}
// 注册
const Register = resolve => {
	require.ensure([], () => resolve(require('@/views/Register.vue')), 'Register')
}
// 注册须知 Registration
const Registration = resolve => {
	require.ensure([], () => resolve(require('@/views/Registration.vue')), 'Registration')
}
// 物业服务PropertyService
const PropertyService = resolve => {
	require.ensure([], () => resolve(require('@/views/Property/PropertyService.vue')), 'PropertyService')
}
// 实时报修
const Repair = resolve => {
	require.ensure([], () => resolve(require('@/views/Property/Repair.vue')), 'Repair')
}
// 投诉建议 FeedBack
const FeedBack = resolve => {
	require.ensure([], () => resolve(require('@/views/Property/FeedBack.vue')), 'FeedBack')
}
// 查费缴费
const Fee = resolve => {
	require.ensure([], () => resolve(require('@/views/Pay/Fee.vue')), 'Fee')
}
// 付款页面
const PayList = resolve => {
	require.ensure([], () => resolve(require('@/views/Pay/PayList.vue')), 'PayList')
}
// 付款成功后广告业
const GuangGao = resolve => {
    require.ensure([], () => resolve(require('@/views/Pay/GuangGao.vue')), 'GuangGao')
}
// 联系物业
const ContactProperty = resolve => {
	require.ensure([], () => resolve(require('@/views/Property/ContactProperty.vue')), 'ContactProperty')
}
// 奎屯风采
const BMPhone = resolve => {
	require.ensure([], () => resolve(require('@/views/Property/BMPhone.vue')), 'BMPhone')
}
// 奎屯先锋
const Ktxf = resolve => {
	require.ensure([], () => resolve(require('@/views/Property/Ktxf.vue')), 'Ktxf')
}
// 关于我们
const AboutUs = resolve => {
	require.ensure([], () => resolve(require('@/views/AboutUs/AboutUs.vue')), 'AboutUs')
}
///关于我们-详情  AboutUsDetail
const AboutUsDetail = resolve => {
	require.ensure([], () => resolve(require('@/views/AboutUs/AboutUsDetail.vue')), 'AboutUsDetail')
}
// 我的房产
const MyPStruct = resolve => {
	require.ensure([], () => resolve(require('@/views/AddPStruct/MyPStruct.vue')), 'MyPStruct')
}
// 我的房产列表
const MyPStructList = resolve => {
	require.ensure([], () => resolve(require('@/views/AddPStruct/MyPStructList.vue')), 'MyPStructList')
}
// 添加房产页面
const AddPStruct = resolve => {
	require.ensure([], () => resolve(require('@/views/AddPStruct/AddPStruct.vue')), 'AddPStruct')
}
// 手机号添加房产addwithphone
const AddWithPhone = resolve => {
	require.ensure([], () => resolve(require('@/views/AddPStruct/AddWithPhone.vue')), 'AddWithPhone')
}
// 初始手机号添加房产 AddWithPhoneFirst
const AddWithPhoneFirst = resolve => {
	require.ensure([], () => resolve(require('@/views/AddPStruct/AddWithPhoneFirst.vue')), 'AddWithPhoneFirst')
}
// 身份证号添加房产AddWithIdCard
const AddWithIdCard = resolve => {
	require.ensure([], () => resolve(require('@/views/AddPStruct/AddWithIdCard.vue')), 'AddWithIdCard')
}
// 自选楼盘 添加房产AddWithWizard
const AddWithWizard = resolve => {
	require.ensure([], () => resolve(require('@/views/AddPStruct/AddWithWizard.vue')), 'AddWithWizard')
}
// 人工申请审核房产
const AddwithArtificial = resolve => {
	require.ensure([], () => resolve(require('@/views/AddPStruct/AddwithArtificial.vue')), 'AddwithArtificial')
}
// 人工申请审核房产进度列表
const AddCountList = resolve => {
  require.ensure([], () => resolve(require('@/views/AddPStruct/AddCountList.vue')), 'AddCountList')
}
// 通过补全手机或者身份证号添加房产
const AddWithPhoneID = resolve => {
   require.ensure([], () => resolve(require('@/views/AddPStruct/AddWithPhoneID.vue')), 'AddWithPhoneID')
}
const News = resolve => {
	require.ensure([], () => resolve(require('@/views/News/News.vue')), 'News')
}
const NewsDetails = resolve => {
	require.ensure([], () => resolve(require('@/views/News/NewsDetails.vue')), 'NewsDetails')
}
const Notice = resolve => {
	require.ensure([], () => resolve(require('@/views/Notice/Notice.vue')), 'Notice')
}
const NoticeDetails = resolve => {
	require.ensure([], () => resolve(require('@/views/Notice/NoticeDetails.vue')), 'NoticeDetails')
}
const Activitys = resolve => {
	require.ensure([], () => resolve(require('@/views/Activitys/Activitys.vue')), 'Notice')
}
const ActivitysDetails = resolve => {
	require.ensure([], () => resolve(require('@/views/Activitys/ActivitysDetails.vue')), 'NoticeDetails')
}
// 我的工单
const Count = resolve => {
	require.ensure([], () => resolve(require('@/views/LinkBill/Count.vue')), 'Count')
}
// 工单列表
const CountList = resolve => {
	require.ensure([], () => resolve(require('@/views/LinkBill/CountList.vue')), 'CountList')
}
// 工单详情
const CountView = resolve => {
	require.ensure([], () => resolve(require('@/views/LinkBill/CountView.vue')), 'CountView')
}

const router = new Router({
	base: __dirname,
	mode:'history',
	routes: [
		{
			path: '/index',
			routerName: 'index',
			name: '首页',
			component: Index,
			iconCls: '',
			hidden: true,
			alias: '/',
			meta: {
				requireAuth:true,
				BindStatus:true, // 需要检测房产是否审批的页面
				isHistory:false, // 登录状态判断后退
				keepAlive: false //
			}
		},{
			path: '/propertyService',
			routerName: 'propertyService',
			name: '物业服务',
			component: PropertyService,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				BindStatus:true, // 需要检测房产是否审批的页面
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},{
			path: '/repair',
			routerName: 'repair',
			name: '实时报修',
			component: Repair,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},{
			path: '/feedBack',
			routerName: 'feedBack',
			name: '投诉建议',
			component: FeedBack,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},{
			path: '/fee',
			routerName: 'fee',
			name: '查费缴费',
			component: Fee,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},{
			path: '/pay/payList',
			routerName: 'payList',
			name: '付款',
			component: PayList,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},{
            path: '/guangGao',
            routerName: 'guangGao',
            name: '付款成功',
            component: GuangGao,
            iconCls: '',
            hidden: false,
            meta: {
                requireAuth:true,
                isHistory:false, // 登录状态判断后退
                keepAlive: false,
                idWait:true
            }
        },{
			path: '/contactProperty',
			routerName: 'contactProperty',
			name: '联系物业',
			component: ContactProperty,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},{
			path: '/bMPhone',
			routerName: 'bMPhone',
			name: '奎屯风采',
			component: BMPhone,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},{
			path: '/ktxf',
			routerName: 'ktxf',
			name: '奎城先锋',
			component: Ktxf,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},
		// 关于我们 AboutUs
		{
			path: '/aboutUs',
			routerName: 'aboutUs',
			name: '关于我们',
			component: AboutUs,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},
		// 关于我们详情 AboutUsDetail
		{
			path: '/aboutUsDetail/:id',
			routerName: 'aboutUs_id',
			name: '关于我们',
			component: AboutUsDetail,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},{
			path: '/login',
			routerName: 'login',
			name: '登录',
			component: Login,
			hidden: false,
			meta: {
				isHistory:true, // 登录状态判断后退到登陆注册页面
				keepAlive: false // MyPStructList
			}
		},{
			path: '/register',
			routerName: 'register',
			name: '注册',
			component: Register,
			hidden: false,
			meta: {
				isHistory:true, // 登录状态判断后退到登陆注册页面
				keepAlive: false // MyPStructList
			}
		},{
			path: '/registration',
			routerName: 'registration',
			name: '注册须知',
			component: Registration,
			hidden: false,
			meta: {
				isHistory:true, // 登录状态判断后退到登陆注册页面
				keepAlive: false // MyPStructList
			}
		},
		{
			path: '/myPStruct',
			routerName: 'myPStruct',
			name: '我的房产',
			component: MyPStruct,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				BindStatus:true, // 需要检测房产是否审批的页面
				isHistory:false, // 登录状态判断后退
				keepAlive: false // MyPStructList
			}
		},
		{
			path: '/myPStructList',
			routerName: 'myPStructList',
			name: '我的房产列表',
			component: MyPStructList,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false // MyPStructList
			}
		},
		{
			path: '/addPStruct',
			routerName: 'addPStruct',
			name: '添加房产',
			component: AddPStruct,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		},
		// AddWithPhoneFirst
		{
			path: '/addWithPhonefirst',
			routerName: 'addWithPhonefirst',
			name: '初始手机号添加房产',
			component: AddWithPhoneFirst,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false //AddWithWizard
			}
		},
		{
			path: '/addWithPhone',
			routerName: 'addWithPhone',
			name: '手机号添加房产',
			component: AddWithPhone,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false //AddWithWizard
			}
		},
		{
			path: '/addWithIdCard',
			routerName: 'addWithIdCard',
			name: '身份证号添加房产',
			component: AddWithIdCard,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false //AddWithWizard
			}
		},
		{
			path: '/addWithWizard',
			routerName: 'addWithWizard',
			name: '自选楼盘添加房产',
			component: AddWithWizard,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false //
			}
		},{
			path: '/addwithArtificial',
			routerName: 'addwithArtificial',
			name: '人工申请审核房产',
			component: AddwithArtificial,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false //
			}
		},{
      path: '/addCountList',
      routerName: 'addCountList',
      name: '人工申请审核房产进度列表',
      component: AddCountList,
      iconCls: '',
      hidden: false,
      meta: {
        requireAuth:true,
        isHistory:false, // 登录状态判断后退 AddCountList
        keepAlive: false //
      }
    },{
			path: '/addWithPhoneID',
			routerName: 'addWithPhoneID',
			name: '补全手机号或者身份证添加房产',
			component: AddWithPhoneID,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false //
			}
		},{
			path: '/news',
			routerName: 'news',
			name: '新闻',
			component: News,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		}, {
			path: '/newsdetails/:id',
			routerName: 'news_id',
			name: '新闻详情',
			component: NewsDetails,
			iconCls: '',
			hidden: true,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		}, {
			//mode: 'history',
			path: '/notice',
			routerName: 'notice',
			name: '公告',
			component: Notice,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: true
			}
		}, {
			//mode: 'history',
			path: '/noticedetails/:id',
			routerName: 'notice_id',
			name: '公告详情',
			component: NoticeDetails,
			iconCls: '',
			hidden: true,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		}, {
			//mode: 'history',
			path: '/activitys',
			routerName: 'activitys',
			name: '活动',
			component: Activitys,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: true
			}
		}, {
			path: '/activitysdetails/:id',
			routerName: 'activitys_id',
			name: '活动详情',
			component: ActivitysDetails,
			iconCls: '',
			hidden: true,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: false
			}
		}, {
			path: '/count',
			routerName: 'count',
			name: '我的工单',
			component: Count,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: true
			}
		}, {
			path: '/countList',
			routerName: 'countList',
			name: '我的工单列表',
			component: CountList,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: true
			}
		}, {
			path: '/countView',
			routerName: 'countView',
			name: '我的工单详情',
			component: CountView,
			iconCls: '',
			hidden: false,
			meta: {
				requireAuth:true,
				isHistory:false, // 登录状态判断后退
				keepAlive: true
			}
		},
		{
            //mode: 'history',
            path: '/index.html',
            component:Index,
            hidden:true,
            meta: {
                keepAlive: false,
				BindStatus:true, // 需要检测房产是否审批的页面
				isHistory:false, // 登录状态判断后退
            },
        },
        {
            //mode: 'history',
            path: '*',
            component:Index,
            hidden:true,
            meta: {
                keepAlive: false,
				isHistory:false, // 登录状态判断后退
            },
        }
	]
})
export default router;
