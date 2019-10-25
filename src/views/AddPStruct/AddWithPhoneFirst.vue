<template>
<div class="index-wrapper">
	<div id="container" class="AddWithPhoneFirst">
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
import { Toast,Field,DatetimePicker  } from 'mint-ui'
import { isNull } from '../../util'
import moment from 'moment'
export default {
	data() {
		return {
			phone:"",
			IsPStruct:false,
			options:[],
			radio: "",
			card2:true
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "绑定房间";
		})
	},
	mounted(){
		getRoomListByCode({
			type:1,
			code:getCookie("Phone")
		}).then(res =>{
			if(res.Status == 200){
				if(!res.Data || res.Data.length == 0) {
					Toast({
						message: "暂无房间！",
						position: 'top',
						iconClass: 'fa fa-close',
						duration: 3000
					});
				}else {
					this.options = res.Data;
				}
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
		submit() {
			if(this.radio == ""){
				Toast({
					message: "请选择房间！！",
					position: 'top',
					iconClass: 'fa fa-close',
					duration: 3000
				});
				return;
			}
			var parm ={
				checkPhone:getCookie("Phone"),
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
.AddWithPhoneFirst{
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
