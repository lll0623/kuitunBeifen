<template>
<div class="index-wrapper">
	<div id="container" class="AddPStruct">
		<div class="mineThings">
			<ul class="listItem">
				<router-link :to="`/addwithIdCard`">
					<li>
						<i class="fa fa-address-card-o"></i>&nbsp;&nbsp;手机/身份证绑定
						<i class="fa fa-angle-right fr"></i>
					</li>
				</router-link>
				<router-link :to="`/addwithwizard`">
					<li>
						<i class="fa fa-hand-o-up"></i>&nbsp;&nbsp;自选楼盘
						<i class="fa fa-angle-right fr"></i>
					</li>
				</router-link>
                <li @click="scanQRCode()">
                    <i class="fa fa-qrcode"></i>&nbsp;&nbsp;扫码绑定
                    <i class="fa fa-angle-right fr"></i>
                </li>
				<!-- <router-link :to="`/addwithphone`">
					<li>
						<i class="fa fa-mobile"></i>&nbsp;&nbsp;手机号匹配
						<i class="fa fa-angle-right fr"></i>
					</li>
				</router-link> -->
				<router-link :to="`/addwithArtificial`">
					<li>
						<i class="fa fa-mobile"></i>&nbsp;&nbsp;人工申请
						<i class="fa fa-angle-right fr"></i>
					</li>
				</router-link>
			</ul>
		</div>

	</div>
</div>
</template>
<script type="es6">
//util
import {setCookie,getCookie,delCookie} from '../../util'
import { addPubRoomRelaByQRCode,getWxConf,getAccessToken,getSignature } from '../../api/api.js'
import defaultImg from '../../assets/images/room_default.jpg'
import { isNull } from '../../util'
import { Toast,MessageBox  } from 'mint-ui'
import { Cell } from 'mint-ui';
import wx from 'weixin-js-sdk'
export default {
	data() {
		return {
			Name:"希沉",
			PStructName:"希沉希沉希沉希沉希沉希沉希沉希沉希沉希沉希沉"
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "请选择以下一种选房方式";
			document.body.style.backgroundColor = '#eee'
		})
	},
	mounted() {
        getWxConf({}).then(res =>{
            if(res.Status == 200){
                setCookie("ImageDomain",res.Data.ImageDomain);
                setCookie("Domain",res.Data.Domain);

            }else {
                Toast({
                    message: res.Message,
                    position: 'top',
                    iconClass: 'fa fa-close',
                    duration: 3000
                });
            }
        })
        getAccessToken({}).then(res =>{
            if(res.Status == 200){
                getSignature({url:window.location.href}).then(res =>{
                    wx.config({
                        debug: false,            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.Data.AppId,    // 必填，公众号的唯一标识
                        timestamp: res.Data.TimeSpan,  // 必填，生成签名的时间戳
                        nonceStr: res.Data.Noncestr, // 必填，生成签名的随机串
                        signature: res.Data.Signature,// 必填，签名
                        jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
                    });
                    this.ready = true
                })
            }else {
                Toast({
                    message: res.Message,
                    position: 'top',
                    iconClass: 'fa fa-close',
                    duration: 3000
                });
            }
        })
	},
	methods: {
        scanQRCode(){
            let that = this;
            if(this.ready){
                console.log(wx);
                wx.scanQRCode({
                    needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType : [ "qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success : function(res) {
                        let result = JSON.parse(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
                        MessageBox.confirm('您将于【'+ result.L +'】进行绑定，确认绑定？', '提示', {
                            showConfirmButton: true,
                            confirmButtonText:'确认绑定',
                            showCancelButton: true,
                            cancelButtonText:'取消'
                        }).then(() => {
                            // let nowTime = (new Date()).getTime();
                            // if(nowTime > result.T){
                            //     Toast({
                            //         message: "该二维码已失效！",
                            //         position: 'top',
                            //         iconClass: 'fa fa-close',
                            //         duration: 3000
                            //     });
                            //     return;
                            // }else {
                                that.AddPubRoomRelaByQRCode(result.V);
                            // }
                            
                        }).catch(() => {
                            Toast({
                                message: "已取消",
                                position: 'top',
                                duration: 3000
                            });
                        });
                        
                    },
                    fail : function(res) {
                        alert(JSON.stringify(res));
                    }
                });
            }
        },
        AddPubRoomRelaByQRCode(id){
            addPubRoomRelaByQRCode({pStructId:id}).then(res =>{
                if(res.Status == 200){
                    this.$router.push('/mypstruct');
                    Toast({
                        message: "绑定成功！",
                        position: 'middle',
                        iconClass: 'fa fa-check',
                        duration: 3000
                    });
                }else {
                    Toast({
                        message: res.Message,
                        position: 'top',
                        iconClass: 'fa fa-close',
                        duration: 3000
                    });
                }
            })
        },
		NoClick() {
			Toast({
				message: '该功能暂未开放！',
				position: 'top',
				duration: 3000
			});
		}
	}
}
</script>
<style lang="scss">
body{
	background-color: #eee;
}
.AddPStruct{
	background-color: #eee;
	.mineThings{
		margin-bottom: 0.3rem;
	}
	.listItem{
		color: #333;
		li:first-child{
			border-top: 1px solid #dedede;
		}
		li{
			margin-top:0.5rem;
			background-color: white;
			padding: 0.4rem 0.25rem;
			border-bottom: 1px solid #dedede;
			color: #333;
			font-size: 0.45rem;
			i{
				font-size: 0.5rem;
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
	}
}


</style>
