<template >
    <div class="index-wrapper">
        <div id="container" class="PayList">
            <div class="header">
                <div class="TotalMoney">
                    <span>请选择支付方式，支付金额： <span class="color">￥{{ this.TotalMoneyFormat }}</span></span>
                </div>
            </div>
            <div class="mineThings">
                <ul class="listItem">
                    <li :class="{active:currentIndex === index}" v-for="(item,index) in options" :key="index" @click="PaySubmit(item,index)">
                        <img class="fl" v-if="item.Type == 0" src="../../assets/images/weixin.png" />
                        <img class="fl" v-if="item.Type == 3" src="../../assets/images/lzf.png" />
                        <img class="fl" v-if="item.Type == 4" src="../../assets/images/weixin.png" />
                        <div v-if="item.AccountFormatJson" class="fl" style="width:80%;line-height:0.8rem;">
                            &nbsp;&nbsp;{{ item.Name }} <br />
                            <p class="red" style="font-size:0.4rem;">&nbsp;&nbsp;{{item.AccountFormatJson}}</p>
                        </div>
                        <div v-else class="fl" style="width:80%;">
                            &nbsp;&nbsp;{{ item.Name }} <br />
                        </div>
                        <i class="fa fa-angle-right fr"></i>
                    </li>
                </ul>
                <!-- <a :href="thisurl          " v-if="thisurl" style="padding:1rem;">建行支付</a>
                <a @click="Open()" style="padding:1rem;">Open</a>
                <a @click="Replace()" style="padding:1rem;">Replace</a>
                <a @click="Href()" style="padding:1rem;">Href</a> -->
<!--                <a @click="Href()" style="padding:1rem;">Href</a>-->
            </div>
        </div>
    </div>
</template>

<script type="es6">
    import {setCookie,getCookie,delCookie,formatMoney,Guid} from '../../util'
    import { queryPayAccountByPStructId,payUnifiedOrder,getAccessToken,getSignature,
        createCCBWxPayPara, //获取建行微信支付参数
        completeReceiptBill,cencalBill,
        updatePayWay, // 更新付款方式
        createCCBOnlinePayUrl, // 建行支付下单
        getPayOrderStatus // 获取获取订单状态
    } from '../../api/api.js'
    import defaultImg from '../../assets/images/room_default.jpg'
    import { isNull } from '../../util'
    import { Toast,MessageBox  } from 'mint-ui'
    import { Cell } from 'mint-ui';
    import wx from 'weixin-js-sdk'
    export default {
        data() {
            return {
                options:[],
                TotalMoney:getCookie("Money"),
                TotalMoneyFormat:"",
                PStructIdVal:getCookie("PStructId"),
                ReceiptWay:0, // 支付方式
                payaccountId:"", // 支付渠道id
                out_trade_no: getCookie("FuKuanId"),  //付款单id
                thisurl:'',
                currentIndex:-1
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                window.document.title = "付款";
                document.body.style.backgroundColor = '#eee';
            })
        },
        mounted() {
            this.TotalMoneyFormat = formatMoney(this.TotalMoney);
            this.QueryPayAccountByPStructId();
            // 判断是否支持回退
            if (window.history && window.history.pushState) {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', this.returns, false);
            }
            // 建行支付后 轮询
            if(getCookie("PayType") && (getCookie("PayType") == "3" || getCookie("PayType") == "4")){
                window.InitSetInterval = setInterval(this.LunXun(),1000)
            }
        },
        destroyed() {
            window.removeEventListener('popstate', this.returns, false);
            clearInterval(window.InitSetInterval)
            delCookie("PayType");
            delCookie("FuKuanId");
            delCookie("Money");
        },
        methods: {
            returns(){
                this.CencalBill();
            },
            LunXun() {
                if(getCookie("PayType") == "3" || getCookie("PayType") == "4"){
                    let that = this;
                    let parm = {
                        orderCode: getCookie("FuKuanId"),
                        cmpCode: getCookie("cmpCode")
                    }
                    getPayOrderStatus(parm).then(res =>{
                        if(res.Data == 1){
                            // Toast({
                            //     message: "支付成功！",
                            //     position: 'top',
                            //     iconClass: 'fa fa-check',
                            //     duration: 1500
                            // });
                            delCookie("PayType");
                            delCookie("FuKuanId");
                            setTimeout(() =>{
                                that.$router.push({
                                    path: '/guangGao',
                                    query: {
                                        money: that.TotalMoneyFormat,
                                        code: that.out_trade_no
                                    }
                                })
                                // that.$router.push('/fee');
                            }, 1500);
                            // MessageBox.confirm('是否返回费项列表页？', '支付成功！', {
                            // 			showConfirmButton: true,
                            // 			confirmButtonText:'确定',
                            // 			showCancelButton: true,
                            // 			cancelButtonText:'取消'
                            //         }).then(() => {
                            //             delCookie("PayType");
                            //             delCookie("FuKuanId");
                            //          this.$router.push("/fee");
                            //         }).catch(() => {
                            // 			Toast({
                            // 			  message: "已取消",
                            // 			  position: 'top',
                            // 			  duration: 3000
                            // 		  });
                            //         });
                        }
                        else if(res.Data == 2) {
                            MessageBox.confirm('是否返回费项列表页？', '支付失败！', {
                                showConfirmButton: true,
                                confirmButtonText:'确定',
                                showCancelButton: true,
                                cancelButtonText:'取消'
                            }).then(() => {
                                delCookie("PayType");
                                delCookie("FuKuanId");
                                this.$router.push("/fee");
                            }).catch(() => {
                                Toast({
                                    message: "已取消",
                                    position: 'top',
                                    duration: 3000
                                });
                            });
                        }
                    })
                }
            },
            QueryPayAccountByPStructId() {
                let parm = {
                    PStructId:this.PStructIdVal
                }
                queryPayAccountByPStructId(parm).then(res =>{
                    if(res.Status == 200){
                        console.log(res);
                        this.options = res.Data;
                    }else {
                        Toast({
                            message: res.Message,
                            position: 'top',
                            iconClass: 'fa fa-close',
                            duration: 3000
                        });
                        // this.CencalBill();
                    }
                })
            },
            // 取消付款
            CencalBill() {
                // 取消付款 并删除之前生成的订单id
                delCookie("PayType");
                delCookie("FuKuanId");
                let Domain = getCookie("Domain");
                window.location.href= Domain+"/fee";
            },
            Href(){
                this.$router.push("/pay/guangGao");
            },
            PaySubmit(data,index) {
                this.currentIndex = index;
                let that = this;
                this.ReceiptWay = data.Type;
                let updatePayWayJson = {
                    OrderCode: this.out_trade_no,
                    PayAccountCode: data.Code,
                    PayAccountName: data.Name,
                    cmpCode: getCookie("cmpCode")
                }
                updatePayWay(updatePayWayJson).then(rew =>{
                    if(rew.Status == 200){
                        // type=0 微信支付 type=1 支付宝支付 type=2 建行支付
                        if(data.Type == "0"){
                            setCookie("PayType","0");
                            let parm = {
                                OutTradeNo: this.out_trade_no,
                                PayAccountId: data.Id,
                                TotalFee: Number(this.TotalMoney),
                                cmpCode: getCookie("cmpCode")
                            }
                            payUnifiedOrder(parm).then(res =>{
                                let args = res.Data;
                                if(res.Status == 200){
                                    WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                        "appId": args.appId, //公众号名称，由商户传入
                                        "timeStamp": args.timeStamp, //时间戳
                                        "nonceStr": args.nonceStr, //随机串
                                        "package": args.package, //扩展包
                                        "signType": "MD5", //微信签名方式:MD5
                                        "paySign": args.paySign //微信签名
                                    }, function (arg) {
                                        if (arg.err_msg === "get_brand_wcpay_request:ok") {
                                            this.currentIndex = -1;
                                            // Toast({
                                            //     message: "支付成功！",
                                            //     position: 'top',
                                            //     iconClass: 'fa fa-check',
                                            //     duration: 1500
                                            // });
                                            setTimeout(() =>{
                                                that.$router.push({
                                                    path: '/guangGao',
                                                    query: {
                                                        money: that.TotalMoneyFormat,
                                                        code: that.out_trade_no
                                                    }
                                                })
                                            }, 1500);
                                            // setTimeout(() =>{
                                            //     that.$router.push('/fee');
                                            // }, 1500);
                                        }else if (arg.err_msg === "get_brand_wcpay_request:cancel") {
                                            this.currentIndex = -1;
                                            Toast({
                                                message: "已取消支付",
                                                position: 'top',
                                                duration: 1500
                                            });
                                            setTimeout(() =>{
                                                that.$router.push('/fee');
                                            }, 1500);
                                        }else if(arg.err_msg === "get_brand_wcpay_request:fail") {
                                            this.currentIndex = -1;
                                            Toast({
                                                message: "支付失败，请重新创建订单",
                                                position: 'top',
                                                iconClass: 'fa fa-close',
                                                duration: 1500
                                            });
                                            setTimeout(() =>{
                                                that.$router.push('/fee');
                                            }, 1500);
                                        }
                                    });
                                }else {
                                    this.currentIndex = -1;
                                    Toast({
                                        message: res.Message,
                                        position: 'top',
                                        iconClass: 'fa fa-close',
                                        duration: 3000
                                    });
                                    setTimeout(() =>{
                                        that.$router.push('/fee');
                                    }, 1500);
                                }
                            })
                        }
                        else if (data.Type == "1"){

                        }
                        else if (data.Type == "3") {
                            setCookie("PayType","3");
                            let UserId = getCookie("UserId");
                            let UserName = getCookie("UserName");
                            let Domain = getCookie("Domain");
                            let ApiUrl = escape(window.config.ApiUrl);
                            let CmpCode = getCookie("cmpCode");
                            let LsAppCode = window.config.LsAppCode;
                            let payAccCode = data.Code;
                            let orderId = that.out_trade_no;
                            let amount = this.TotalMoney;
                            window.location.href= ""+Domain+"/lzf/lzf.html?LonUrl="+ApiUrl+"&userId="+UserId+"&userName="+UserName+"&CmpCode="+CmpCode+"&LsAppCode="+LsAppCode+"&payAccCode="+payAccCode+"&orderId="+orderId+"&amount="+amount+"";
                        }
                        else if(data.Type == "4") {
                            setCookie("PayType","4");
                            let parm = {
                                payAccCode: data.Code,
                                orderId: that.out_trade_no,
                                amountStr: this.TotalMoney,
                                cmpCode: getCookie("cmpCode")
                            }
                            createCCBWxPayPara(parm).then(ccb =>{
                                let args = ccb.Data;
                                if(ccb.Status == 200){
                                    WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                        "appId": args.appId, //公众号名称，由商户传入
                                        "timeStamp": args.timeStamp, //时间戳
                                        "nonceStr": args.nonceStr, //随机串
                                        "package": args.package, //扩展包
                                        "signType": args.signType, //微信签名方式:MD5
                                        "paySign": args.paySign //微信签名
                                    }, function (arg) {
                                        if (arg.err_msg === "get_brand_wcpay_request:ok") {
                                            this.currentIndex = -1;
                                            // Toast({
                                            //     message: "支付成功！",
                                            //     position: 'top',
                                            //     iconClass: 'fa fa-check',
                                            //     duration: 1500
                                            // });
                                            setTimeout(() =>{
                                                that.$router.push({
                                                    path: '/guangGao',
                                                    query: {
                                                        money: that.TotalMoneyFormat,
                                                        code: that.out_trade_no,
                                                    }
                                                })
                                                // that.$router.push('/fee');
                                            }, 1500);
                                            // setTimeout(() =>{
                                            //     that.$router.push('/fee');
                                            // }, 1500);
                                        }else if (arg.err_msg === "get_brand_wcpay_request:cancel") {
                                            this.currentIndex = -1;
                                            Toast({
                                                message: "已取消支付",
                                                position: 'top',
                                                duration: 1500
                                            });
                                            setTimeout(() =>{
                                                that.$router.push('/fee');
                                            }, 1500);
                                        }else if(arg.err_msg === "get_brand_wcpay_request:fail") {
                                            this.currentIndex = -1;
                                            Toast({
                                                message: "支付失败，请重新创建订单",
                                                position: 'top',
                                                iconClass: 'fa fa-close',
                                                duration: 1500
                                            });
                                            setTimeout(() =>{
                                                that.$router.push('/fee');
                                            }, 1500);
                                        }
                                    });
                                }else {
                                    this.currentIndex = -1;
                                    Toast({
                                        message: ccb.Message,
                                        position: 'top',
                                        iconClass: 'fa fa-close',
                                        duration: 3000
                                    });
                                    setTimeout(() =>{
                                        that.$router.push('/fee');
                                    }, 1500);
                                }
                            })
                        }
                    }else {
                        this.currentIndex = -1;
                        Toast({
                            message: rew.Message,
                            position: 'top',
                            iconClass: 'fa fa-close',
                            duration: 3000
                        });
                        // let Domain = getCookie("Domain");
                        // window.location.href= Domain+"/fee";
                    }

                })
            }
        }
    }
</script>

<style lang="scss">
    body{
        background-color: #eee;
    }
    .PayList{
        background-color: #eee;
        .header{
            .TotalMoney{
                background-color: #ffd9ab;
                padding: 0.28rem 0.25rem;
                text-align: center;
                .color{
                    background-color: #ff6600;
                    color: white;
                    padding: 0.1rem;
                    font-size: 0.3rem;
                    border-radius: 10%;
                }
            }
        }
        .mineThings{
            margin-bottom: 0.3rem;
        }
        .listItem{
            color: #333;
            li:first-child{
                border-top: 1px solid #dedede;
            }
            li{
                background-color: white;
                padding: 0.4rem 2%;
                border-bottom: 1px solid #dedede;
                color: #333;
                font-size: 0.45rem;
                line-height: 1.2rem;
                width: 96%;
                display: inline-block;
                img{
                    width: 1.2rem;
                    height: 1.2rem;
                }
                i{
                    font-size: 0.4rem;
                    line-height: 1rem;
                }
                .fa-angle-right{
                    color: #c8c8cd;
                    font-size: 0.5rem;
                    margin-top: 0.1rem;
                }
            }
            li:active{
                background-color: #e6e6e6;
            }
            li.active{
                background-color: #e6e6e6;
                pointer-events:none;
            }
        }
    }
</style>
