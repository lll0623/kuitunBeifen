import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import {generateMixed,getCookie,delCookie} from '../util'
import router from '../router'
import store from '../store'
import GLOBAL from '../util/Global.js' // 全局参数
import { Message, Loading } from 'element-ui';
import $ from 'jquery'
//axios 配置
var service = null;
let secDomain = window.location.href.split(".")[0].split("//")[1];
if(process.env.NODE_ENV == 'production'){
    $.ajax({
        url:'/serverconfig.json',
        type:'GET',
        async:false,
        timeout:5000, //超时时间
        dataType:'json', //返回的数据格式：
        beforeSend:function(xhr){

        },
        success:function(data){
            window.config = data;
			$.ajax({
				url: window.config.ApiUrl+'/Conf/GetServiceConf?cmpCode='+data.CmpCode+'&secDomain='+secDomain+'',
				type:'POST',
				async:false,
				timeout:5000, //超时时间
				dataType:'json', //返回的数据格式：
				//headers:{
					//CmpCode: window.config.CmpCode,
					//LsAppCode: window.config.LsAppCode
				//},
				beforeSend:function(xhr){

				},
				success:function(data){
					if(data.Status == 200){
						window.config.ApiUrl = data.Data.APIUrl;
						window.config.isOriginal = data.Data.IsOriginal;
						window.config.Title = data.Data.Title;
						window.config.CmpCode = data.Data.CmpCodes[0];
						window.config.LsAppCode = data.Data.LsAppCode;
					}else {
						Toast({
							message: data.Message,
							position: 'top',
							iconClass: 'fa fa-warning',
							duration: 3000
						});
					}

				},
				error:function(xhr,textStatus){

				}
			})
        },
        error:function(xhr,textStatus){
        }
    })

    console.log(window.config)
    service = axios.create({
       baseURL: window.config.ApiUrl, // api 的 base_url
       timeout: 100000 // request timeout
    })
}

// if(process.env.NODE_ENV === 'production'){  // 生产环境\
//     service = axios.create({
//        baseURL:window.config.ApiUrl, // api 的 base_url
//        timeout: 100000 // request timeout
//    })
// }

let loading        //定义loading变量
function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        // text: '加载中……',
        // background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}

let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

//axios httpHeader固定参数
service.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json'
        config.headers['X-Requested-With'] = 'XMLHttpRequest'
        config.headers['CmpCode'] = window.config.CmpCode
        config.headers['LsAppCode'] = window.config.LsAppCode
        let Token = getCookie('Token') || ''
        if (Token) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
            config.headers.Token = Token;
        }
        let UserId = getCookie('UserId') || ''
        if (UserId) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
            config.headers.UserId = UserId;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

    //http response 服务器响应拦截器，这里拦截409错误，并重新跳入登页重新获取token
    service.interceptors.response.use(
        response => {
            // tryHideFullScreenLoading(); // loading
            // console.log(response)
            if(response.data.Status == 409 || response.data.Message == "令牌无效" || response.data.Message == "令牌过期") {
                delCookie("Token");
                setTimeout(() => {
                    var Domain = getCookie("Domain");
                    window.location.href= Domain+"/login";
                    this.$router.push("/login");
                }, 1500)
            }else {
                return response;
            }
        },
        error => {
            return Promise.reject(error.response)
        });

// 写入cookie数据 通过获取微信 微信授权后的code  code:"微信授权后的code"
export const wXLoginWithOpenId = params => {
return service.post('/Auth/WXLoginWithOpenId',params).then(response => response.data)
}
// 获取appid 文件的根域名ImageDomain 参数无
export const getWxConf = params => {
return service.post('/Wx/GetWxConf',params).then(response => response.data)
}
//短信接口 注册页面  phone："需要注册的手机号码"
export const getSMSHelper = params => {
return service.post('/Auth/GetVerificationCode',params).then(response => response.data)
}
// 绑定手机号 /Auth/BindPhone phone：“手机号码”，name:"用户名称"，vaildateCode:"短信验证码",token:"写入cookie操作接口获取的值，存在cookie里面"
export const bindPhone = params => {
return service.post('/Auth/BindPhone',params).then(response => response.data)
}
//解除第三方账号和系统登陆账号绑定关系 （退出登录） 参数无
export const unbindAccount = params => {
return service.post('/Pub/Account/UnbindAccount',params).then(response => response.data)
}
// 获取微信用户信息  参数无
export const getAccount = params => {
    return service.post('/Pub/Account/GetWxAccount',params).then(response => response.data)
}
// 设置默认房间  pStructId："房间id"
export const setDefaultPubRoom = params => {
    return service.post('/Rs/WxPStruct/SetDefaultPubRoom',params).then(response => response.data)
}
// 通过手机号添加绑定房产    checkPhone："手机号码"，pStructId:"房间id"
export const addPubRoomRelaByPhone = params => {
    return service.post('/Rs/WxPStruct/AddPubRoomRelaByPhone',params).then(response => response.data)
}
// 通过姓名添加绑定房间  custName="名称"pStructId=   房间绑定接口
export const addPubRoomRelaByCustName = params => {
    return service.post('/Rs/WxPStruct/AddPubRoomRelaByCustName',params).then(response => response.data)
}
// 判断房产是否审批接口  pStructId："房间id"
export const getPStructBindStatus = params => {
    return service.post('/Rs/WxPStruct/GetPStructBindStatus',params).then(response => response.data)
}
// 通过身份证号码 添加绑定房产  idCard："身份证号码"，pStructId："房产id"
export const addPubRoomRelaByIdCard = params => {
    return service.post('/Rs/WxPStruct/AddPubRoomRelaByIdCard',params).then(response => response.data)
}
 //获取绑定的房间列表 参数无
 export const queryPubRoomRelaInfoList = params => {
     return service.post('/Rs/WxPStruct/QueryPubRoomRelaInfoList',params).then(response => response.data)
 }
 // 删除绑定房间  pStructId："房间id"
 export const removePubRoomRela = params => {
     return service.post('/Rs/WxPStruct/RemovePubRoomRela',params).then(response => response.data)
 }
//房间列表 -- 获取所有房产列表  type："房产级数"，name："房产名称(用于模糊搜索)"，parentId："上级房产id"
export const queryPropertyList = params => {
    return service.post('/Rs/WxPStruct/QueryPropertyList',params).then(response => response.data)
}
// 通过房间id 获取手机号或者 身份证 type:[1-电话号码|2-身份证]  pStructId:房间Id
export const getRoomCurrentRenterInfo = params => {
    return service.post('/Rs/WxPStruct/GetRoomCurrentRenterInfo',params).then(response => response.data)
}
// 通过手机号或者身份证号获取房间列表
export const getRoomListByCode = params => {
    return service.post('/Rs/WxPStruct/GetRoomListByCode',params).then(response => response.data)
}
 //获取公众号关联的公司信息
export const getCmps = params => {
    return service.post('/Home/GetCmps',params).then(response => response.data)
}
// 获取公告 pageIndex，pageSize
export const getNotices = params => {
    return service.post('/Pub/Article/GetNotices',params).then(response => response.data)
}
// 获取新闻  category:"news"，secCategory:"",pageIndex，pageSize
export const getArticles = params => {
    return service.post('/Pub/Article/GetArticles',params).then(response => response.data)
}
// 获取公告，获取新闻 详情   id:"消息id"
export const getArticleDetail = params => {
    return service.post('/Pub/Article/GetArticleDetail',params).then(response => response.data)
}
// 获取社区活动  pageIndex，pageSize
export const getActivitys = params => {
    return service.post('/Pub/Article/GetActivitys',params).then(response => response.data)
}
// 获取社区活动详情 GetActivityDetail  id:"消息id"
export const getActivityDetail = params => {
    return service.post('/Pub/Article/GetActivityDetail',params).then(response => response.data)
}
// 获取房产物业联系方式  pStructIds:[房产id]
export const getSvrPhones = params => {
    return service.post('/Pub/SvrPhone/GetSvrPhones',params).then(response => response.data)
}

//区域筛选
export const getScreenArea = params => {
    return service.post('/WxPStruct/GetAreaList',params).then(response => response.data)
}
// 判断手机号是否注册
export const getIsExistPhone = params => {
return service.post('/Member/IsExistPhone',params).then(response => response.data)
}
// 获取微信个人信息
export const getUserInfo = params => {
    return service.post('/Member/QueryInfo',params).then(response => response.data)
}
// 添加报事报修
export const createLinkBill = params => {
    return service.post('/CS/LinkBill/CreateLinkBill',params).then(response => response.data)
}
// 联系单统计列表
export const queryLinkBillStatistical = params => {
    return service.post('/CS/LinkBill/QueryLinkBillStatistical',params).then(response => response.data)
}
// 联系单 单据列表
export const queryLinkBillList = params => {
    return service.post('/CS/LinkBill/QueryLinkBillList',params).then(response => response.data)
}
// 联系单单据详情
export const getBillDetail = params => {
    return service.post('/CS/LinkBill/GetBillDetail',params).then(response => response.data)
}
// 留言接口
export const addMsg = params => {
    return service.post('/CS/LinkBill/AddMsg',params).then(response => response.data)
}
// 注册协议
export const getWxAccProtocol = params => {
    return service.post('/Wx/GetWxAccProtocol',params).then(response => response.data)
}
// 获取手机登陆验证码 登录页面
export const getLoginVaildateCode = params => {
    return service.post('/Auth/GetLoginVaildateCode',params).then(response => response.data)
}
// 手机直接登陆
export const phoneLogin = params => {
    return service.post('/Auth/PhoneLogin',params).then(response => response.data)
}
//获取AssToken
export const getAccessToken = params => {
    return service.post('/Wx/GetAccessToken',params).then(response => response.data)
}
// /Wx/getSignature//获取签名
export const getSignature = params => {
    return service.post('/Wx/GetSignature',params).then(response => response.data)
}
// 文件上传
export const saveFileByServerId = params => {
    return service.post('/File/SaveFileByServerId',params).then(response => response.data)
}
// 获取轮播图 /Wx/GetCarouseList
export const getCarouseList = params => {
    return service.post('/Wx/GetCarouseList',params).then(response => response.data)
}
// 社区活动报名  /Pub/Article/ActivityApply   {AId:"",Name:"",Phone:""}  // 报名
export const activityApply = params => {
    return service.post('/Pub/Article/ActivityApply',params).then(response => response.data)
}
// 评价打分  BillId Level VisitMemo
export const visit = params => {
    return service.post('/CS/LinkBill/Visit',params).then(response => response.data)
}
// 获取支付费项 PStructId String 联系房产Id
export const queryWxReceivableFee = params => {
    return service.post('/FM/ReceivableFee/QueryWxReceivableFee',params).then(response => response.data)
}
// 获取支付渠道 PStructId
export const queryPayAccountByPStructId = params => {
    return service.post('/FM/PayAccount/QueryPayAccountByPStructId',params).then(response => response.data)
}
// 微信下单
export const payUnifiedOrder = params => {
    return service.post('/FM/Pay/PayUnifiedOrder',params).then(response => response.data)
}
// 创建付款单 PStructId	String ReceivableRecordIds /// 旧的
export const createReceiptBill = params => {
    return service.post('/FM/ReceiptBill/CreateReceiptBill',params).then(response => response.data)
}
/// 创建订单编号 新的  ids=费用id列表& amtStr=总金额
export const createPayOrderCode = params => {
    return service.post('/FM/ReceiptBill/CreatePayOrderCode',params).then(response => response.data)
}
// 更新付款方式/FM/ReceiptBill/UpdatePayWay?OrderCode=123&PayAccountCode=123123&PayAccountName=12345789
export const updatePayWay = params => {
    return service.post('/FM/ReceiptBill/UpdatePayWay',params).then(response => response.data)
}

// --获取建行微信支付参数 /FM/Pay/CreateCCBWxPayPara?payAccCode=123&orderId=123&amountStr=123
export const createCCBWxPayPara = params => {
    return service.post('/FM/Pay/CreateCCBWxPayPara',params).then(response => response.data)
}

// 获取获取订单状态  /FM/ReceiptBill/GetPayOrderStatus?orderCode
export const getPayOrderStatus = params => {
    return service.post('/FM/ReceiptBill/GetPayOrderStatus',params).then(response => response.data)
}

// 完成付款
export const completeReceiptBill = params => {
    return service.post('/FM/ReceiptBill/CompleteReceiptBill',params).then(response => response.data)
}
// 取消付款
export const cencalBill = params => {
    return service.post('/FM/ReceiptBill/CencalBill',params).then(response => response.data)
}
// 建行下单支付  orderId="12312312312312" amount=0.01
export const createCCBOnlinePayUrl = params => {
    return service.post('/FM/Pay/CreateCCBOnlinePayUrl',params).then(response => response.data)
}
// 建行支付后轮询   Amount=0.01,QryTime=1,QrCodeType=1,OrderId="12312312312312"
export const cCBPayPolling = params => {
    return service.post('/FM/Pay/CCBPayPolling',params).then(response => response.data)
}
// 物业菜单管理 /Base/Domain/GetDomains
export const getDomains = params => {
    return service.post('/Base/Domain/GetDomains',params).then(response => response.data)
}
// 便民电话
export const queryGlobalSvrPhone = params => {
    return service.post('/Pub/SvrPhone/QueryGlobalSvrPhone',params).then(response => response.data)
}
// 房间绑定申请 /RoomBindingApply/Apply
export const roomBindingApply = params => {
    return service.post('/RoomBindingApply/Apply',params).then(response => response.data)
}
// 查询房源绑定申请单 进度
export const getRoomBindingApplyOpenID = params => {
  return service.post('/Pub/RoomBindingApply/GetRoomBindingApplyOpenID',params).then(response => response.data)
}
// 通过二维码绑定房产
export const addPubRoomRelaByQRCode = params => {
    return service.post('/Rs/WxPStruct/AddPubRoomRelaByQRCode',params).then(response => response.data)
}
