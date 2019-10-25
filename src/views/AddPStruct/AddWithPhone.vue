<template>
<div class="index-wrapper">
	<div id="container" class="AddWithPhone">
		<div v-show="card1">
			<!-- <div class="mint-msgbox-header">
				<div class="mint-msgbox-title" style="font-size: 0.5rem">手机号匹配</div>
			</div> -->
			<div class="mint-msgbox-content">
				<el-input type="tel"  placeholder="请输入手机号" v-model="phone" clearable></el-input>
				<p>该手机号码为您在物业客服中心预留的手机号码。</p>
			</div>
			<button class="mint-button mint-button--default mint-button--large" v-no-more-click @click="nextBtn()">
				 <label class="mint-button-text">下一步</label>
			 </button>
		</div>

		<div v-show="card2">
			<div style="padding: 2rem;text-align: center;color: #333;" v-show="IsPStruct">
				暂无房产数据
			</div>
			<el-radio v-show="options.length>0" v-for="(item,index) in options" :key="index" v-model="radio" :label="item.PStructId" @change="isPStruct">
				<span class="label">{{item.PStructName}}</span><br><br>
			</el-radio>
			<button class="mint-button mint-button--default mint-button--large" v-no-more-click @click="submit()">
				 <label class="mint-button-text">选择房产</label>
			 </button>
		</div>

	</div>
</div>
</template>
<script type="es6">
import {getRoomListByCode,addPubRoomRelaByPhone} from '../../api/api.js'
import defaultImg from '../../assets/images/default.jpg'
import md5 from 'js-md5'
import { Toast,Field,DatetimePicker,Indicator  } from 'mint-ui'
import { isNull } from '../../util'
import moment from 'moment'
export default {
	data() {
		return {
			phone:"",
			IsPStruct:false,
			options:[],
			radio: "",
			card1:true,
			card2:false
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "手机号匹配";
			vm.phone = !!vm.$route.query.phone ? vm.$route.query.phone : "";
		})
	},
	methods: {
		nextBtn(){
			let regPhoneNum = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
			if(this.phone == ""){
				Toast({
					message: "请输入手机号！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
				return;
			}
			if (!regPhoneNum.test(this.phone)) {
				Toast({
					message: "请输入正确格式手机号！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
				return;
			}
			Indicator.open({
			    text: '加载中...',
			    spinnerType: 'fading-circle'
			});
			var parm = {
				type:1,
				code:this.phone
			}
			getRoomListByCode(parm).then(res =>{
				Indicator.close();
				console.log(res);
				if(res.Status == 200){
					Indicator.close();
					if(!res.Data || res.Data.length == 0) {
						this.card1 = true;
						this.card2 = false;
						Toast({
							message: "暂无房间！",
							position: 'top',
							iconClass: 'fa fa-warning',
							duration: 3000
						});
						this.card1 = true;
						this.card2 = false;
					}else {
						this.options = res.Data;
						this.card1 = false;
						this.card2 = true;
					}
				}else {
					Indicator.close();
					Toast({
						message: res.Message,
						position: 'top',
						iconClass: 'fa fa-close',
						duration: 3000
					});
					this.card1 = true;
					this.card2 = false;
				}
			})
		},
		submit() {
			if(this.radio == ""){
				Toast({
					message: "请选择房间！！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
				return;
			}
			var parm ={
				checkPhone:this.phone,
				pStructId :this.radio
			}
			addPubRoomRelaByPhone(parm).then(res =>{
				console.log(res)
				if(res.Status == 200){
					this.$router.push('/mypstruct')
					Toast({
						message: '绑定成功！',
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
					this.card1 = true;
					this.card2 = false;
				}
			})
		}
	},
	filters:{
		//时间格式化
		dateFormat:function(date) {
			if (date == undefined) {
			   return "";
			}
			moment.locale('en'); //日期格式汉化
			var localLocale = moment(date).format('YYYY-MM-DD HH:mm');
			return localLocale;
		}
	},
	created() {

	},
	mounted() {

	},
}
</script>
<style lang="scss">
body {
    background: #EFEFEF;
}
.AddWithPhone{
	margin-bottom: 2.5rem;
	.el-radio{
		background-color: white;
		padding: 0.5rem 0.2rem;
		margin-right: 0px;
		display: block;
		border-bottom: 1px solid #dedede;
		.label{
			color: #333;
			word-break:normal;
		    display:block;
		    white-space:pre-wrap;
		    word-wrap : break-word ;
		    overflow: hidden ;
		    width: 85%;
		    display: block;
			position: absolute;
		    top: 0.5rem;
		    left: 0.8rem;
			font-size: 0.4rem;
			line-height: 0.45rem;
			text-align: left;
		}
		.code{
			color: #828a8a;
		}
		.el-button--mini{
			float: right;
			position: absolute;
			right: 10px;
			top: 25px;
		}
	}
	.el-radio:last-child{
		padding-bottom: 2rem;
	}
	.mint-button--small {
	    font-size: 1em;
		padding: 0.5em;
		height: auto;
	}
	.mint-msgbox-header{
		padding: 0.5rem 0 0.5rem 0.5rem;
	    border-bottom: 1px solid #ddd;
		.mint-msgbox-title{
			text-align: left;
		}
	}
	.mint-button--primary {
	    color: #fff;
	    background-color: #d90068;
	}
	.mint-field-core{
		height: 1rem;
    	font-size: 0.4rem;
		border-radius: 4px;
    	border: 1px solid #dcdfe6;
	}
	textarea.mint-field-core{
		height: 2rem;
	    font-size: 0.4rem;
		border-radius: 4px;
		background: white;
		border: 1px solid #dcdfe6;
	}
	.mint-cell:last-child{
		background-image: none;
	}
	.mint-msgbox-content{
		border: none;
		margin-bottom: 1.5rem;
		margin-top: 0.5rem;
		p{
			margin-top: 0.2rem;
			font-size: 0.3rem;
			color: #828a8a;
		}
	}
	button{
		background-color: #ff6600;
		color: white;
		width: 70%;
		margin-left: 15%;
		margin-top: 0.5rem;
		display: inline-block;
		position: fixed;
    	bottom: 0.3rem;
	}
}
</style>
