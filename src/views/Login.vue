<template>
<div class="index-wrapper">
	<div id="container" class="Login">
				<div class="mint-msgbox-header">
					<div class="mint-msgbox-title" style="font-size: 0.5rem">登录</div>
				</div>
				<div class="mint-msgbox-content">
					<div class="height50">
						<div class="titleFormat fl">
							<i class="fa fa-mobile" aria-hidden="true"></i>
						</div>
						<div class="textFormat">
							<input class="width100" type="tel" placeholder="请输入手机号" v-model="phone">
						</div>
					</div>

					<div class="height50">
						<div class="titleFormat fl">
							<i class="fa fa-key" aria-hidden="true"></i>
						</div>
						<div class="textFormat">
							<div style="height:100%">
								<input type="number" v-model="ContactVerifyCode" placeholder="请输入手机验证码" style="width: 3.2rem;height: 100%;">
								<mt-button type="primary" size="small" :disabled="disabled" @click="sendcode" class="fr" style="top:0.3rem;right: 0.2rem;">{{ getBtnTxt }}</mt-button>
							</div>
						</div>
					</div>
				</div>
				<mt-button type="primary" size="large" :disabled="btnDisabled" @click="saveMemo">登录</mt-button>
				<router-link :to="`/registration`">
					<mt-button type="default" size="large" :disabled="btnDisabled">注册</mt-button>
				</router-link>
	</div>
</div>
</template>
<script type="es6">
import {getLoginVaildateCode,phoneLogin} from '../api/api.js'
import defaultImg from '../assets/images/default.jpg'
import md5 from 'js-md5'
import {setCookie,getCookie} from '../util'
import { Toast,Field,DatetimePicker  } from 'mint-ui'
import { isNull } from '../util'
import moment from 'moment'
export default {
	data() {
		return {
			username:'',
			phone:'',
			ContactVerifyCode:'', // 输入的验证码
			getBtnTxt:'获取验证码',
			disabled:false,
			inputPhone:'',
			SMCode:'',//获取的验证码
			time: 0,
			dialogReservation: false,
			btnDisabled: false
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = window.config.Title;
			// document.body.style.backgroundColor = 'white'
		})
	},
	methods: {
		// 提交
		saveMemo() {
			console.log("登录页面")
			var reg = 11 && /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
			if(this.phone == ''){
				Toast({
				    message: '手机号码不能为空',
				    position: 'top',
				    duration: 5000
				});
				return;
			}
			if (!reg.test(this.phone)) {
				Toast({
				    message: '手机格式不正确',
				    position: 'top',
				    duration: 3000
				});
				return;
            }
			if (this.ContactVerifyCode == '') {
				Toast({
				    message: '手机验证码不能为空',
				    position: 'top',
				    duration: 3000
				});
				return;
            }
			this.btnDisabled = true;
			var params = {
				token : getCookie("Token"),
				phone : this.phone,//手机号码
				vaildateCode:this.ContactVerifyCode // 短信验证码
			}
			phoneLogin(params).then(res=> {
				if(res.Status == 200){
					this.btnDisabled = false;
					this.dialogReservation = false
					this.disable = false
					this.time = 0;
					this.getBtnTxt = "获取验证码";
					this.disabled = false;
					this.timer()
					Toast({
						message: '登录成功',
						position: 'middle',
						iconClass: 'fa fa-check',
						duration: 3000
					});
					setCookie("HasBindPhone",1);
					setCookie("Token",res.Data.Token);
					setCookie("Phone",res.Data.Phone);
					setCookie("UserId",res.Data.UserId);
					setTimeout(() => {
						this.$router.push("/index");
					}, 1500)
				}
				else{
					Toast({
						message: res.Message,
						position: 'top',
						iconClass: 'fa fa-close',
						duration: 3000
					});
					this.btnDisabled = false;
				}
			})
		},
		sendcode() {
			var that = this;
            var reg = 11 && /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
            //var url="/nptOfficialWebsite/apply/sendSms?mobile="+this.registerForm.phone;
            if (this.phone == '') {
				Toast({
				    message: '请输入手机号码',
				    position: 'top',
				    duration: 3000
				});
            } else if (!reg.test(this.phone)) {
				Toast({
				    message: '手机格式不正确',
				    position: 'top',
				    duration: 3000
				});
            } else {
                let params = {
                    phone: this.phone
                }
                getLoginVaildateCode(params).then((response) => {
                    var errorText = response.Message;
                    switch (response.Status) {
                        case 200:
						if(response.Data.Code == 400) {
							Toast({
							    message: response.Data.Message,
							    position: 'middle',
								iconClass: 'fa fa-check',
							    duration: 3000
							});
							this.time = 0;
                            this.getBtnTxt = "获取验证码";
                            this.disabled = false;
							setTimeout(function(){
								that.$router.push('/registration')
							},3000);
						}else{
							Toast({
							    message: '短信验证码发送成功，请注意查收！',
							    position: 'middle',
								iconClass: 'fa fa-check',
							    duration: 3000
							});
	                            this.time = 60;
	                            this.disabled = true;
	                            this.timer();
						}
                        break;
                        case 500:
						Toast({
						    message: errorText,
						    position: 'top',
						    duration: 3000
						});
                            this.time = 0;
                            this.getBtnTxt = "获取验证码";
                            this.disabled = false;
                        break;
                        default:
						Toast({
						    message: '短信验证码发送失败！',
						    position: 'middle',
							iconClass: 'fa fa-close',
						    duration: 3000
						});
                            this.time = 0;
                            this.getBtnTxt = "获取验证码";
                            this.disabled = false;
                    }
                })
            }
        },
        timer() {
            if (this.time > 0) {
                this.time--;
                this.getBtnTxt = this.time + "s后获取";
                setTimeout(this.timer, 1000);
            } else {
                this.time = 0;
                this.getBtnTxt = "获取验证码";
                this.disabled = false;
            }
        },
		orderHouseBtn() {
			setTimeout(() => {
				this.dialogReservation = true;
			}, 500)
		},

	},
	created() {

	},
	mounted() {

	},
}
</script>
<style lang="scss">
body {
background: #eee;
}
.Login{
	background: eee;
    .mint-msgbox-content{
        padding: 0px;
    }
	.mint-button--small {
	    font-size: 1em;
		padding: 0.5em;
		height: auto;
	}
	.mint-msgbox-header{
		padding: 0.5rem 0 0.5rem 0.5rem;
		.mint-msgbox-title{
			text-align: left;
		}
	}
	.mint-button--primary {
	    color: #fff !important;
	    background-color: #FF6600 !important;
	}
	.mint-button--large{
		width: 80%;
		margin: 0rem auto;
		font-size: 0.5rem;
		z-index: 2000.5;
		height: 1.2rem;
		border-radius: 0px;
		margin-top: 0.5rem;
	}
	.titleFormat{
	    width: 1rem;
		text-align: center;
		i{
			font-size: 0.5rem;
			margin-top: 0.55rem;
		}
	}
	.textFormat{
	    margin-left: 1rem;
		height: 100%;
		input,select{
			height: 100%;
			width: 97%;
			border: none;
		}
		select:invalid { color: gray; }
		textarea{
			background-color: white;
		    height: 1.7rem;
			margin-top: 0.5rem;
		}
	}
	.height50{
	    height: 1.5rem;
	    border: 1px solid #ddd;
        background-color: white;margin-bottom: -1px;
	}
	.height100{
	    height: 100%;
	}
	.width100{
	    width: 100%;
	}
	// .mint-popup{
	// 	z-index: 2018 !important;
	// }
}
</style>
