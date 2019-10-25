<template>
<div class="index-wrapper">
	<div id="container" class="activitysDetail">
		<div class="newsView">
            <p class="header" :style="{color:'#'+item.FullheadColor}">{{ item.Title }}</p>
			<p class="date">发布时间：{{ item.ReleaseTime | dateFormat}}</p>
			<div class="newsContent" v-html="item.Content"></div>
        </div>
		<button class="mint-button bao" @click="popupVisible = true" :disabled="disabled">
			 <label class="mint-button-text">{{ BText }}&nbsp;<span>（{{HasApplyCount}}/{{LimitedCount}}）</span></label>
		 </button>
		 <mt-popup
		   v-model="popupVisible"
		   popup-transition="popup-fade">
		   <p class="header tc">活动报名</p>
		   <el-input type="text"  placeholder="请输入报名姓名" v-model="BName" clearable style="margin=bottom:0.2rem;"></el-input>
		   <el-input type="tel"  placeholder="请输入报名人手机号码" v-model="BPhone" clearable></el-input>
		   <button class="mint-button cancel" @click="popupVisible = false">
			    <label class="mint-button-text" >取消</label>
   		 	</button>
		   <button class="mint-button tijiao" @click="baoming()">
   			 	<label class="mint-button-text">提交</label>
   		 	</button>
		 </mt-popup>
	</div>
</div>

</template>
<script type="es6">
import {setCookie,getCookie,delCookie} from '../../util'
import defaultImg from '../../assets/images/room_default.jpg'
import { getActivityDetail,activityApply } from '../../api/api.js'
import {Toast,Popup} from 'mint-ui';
import moment from 'moment'
export default {
	data() {
		return {
			defaultImg,
			item:'',
			BName:"",
			BPhone:"",
			BText:"报名",
			HasApplyCount:'',
			LimitedCount:'',
			AId:"",
			disabled:false,
            popupVisible:false
		}
	},
    beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "社区活动详情";
		})
	},
	created() {
		this.getData();
	},
	methods: {
		getData() {
			let params = {
				"id": this.$route.params.id
			}
			getActivityDetail(params).then((response) =>{
				this.Message = response.Message;
				switch(response.Status){
					  case 500 :
						  Toast({
						   message: response.Message,
						   position: 'middle',
						   iconClass: 'fa fa-close',
						   duration: 3000
						  });
					  break;
					  case 200:
						this.item = response.Data;
						this.AId = response.Data.Id;
						this.HasApplyCount = response.Data.HasApplyCount; // 已报名人数
						this.LimitedCount = response.Data.LimitedCount; // 限制人数
						var nowTime = new Date().getTime(); // 当前时间
						var ApplyEndTime = new Date(response.Data.ApplyEndTime).getTime(); // 报名截止时间
						if(ApplyEndTime<nowTime){
							this.BText = "报名时间已截至";
							this.disabled = true;
						}
						if(ApplyEndTime>nowTime && response.Data.HasApplyCount == response.Data.LimitedCount){
							this.BText = "报名人数已满";
							this.disabled = true;
						}
					  break;
				}
			}).catch(error => {
				Toast({
				 message: this.Message,
				 position: 'middle',
				 iconClass: 'fa fa-close',
				 duration: 3000
				});
			})
		},
		baoming(){
			// 报名接口
			let regPhoneNum = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
			if(this.BName == ""){
				Toast({
					message: "请输入姓名！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
				return;
			}
			if(this.BPhone == ""){
				Toast({
					message: "请输入手机号！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
				return;
			}
			if (!regPhoneNum.test(this.BPhone)) {
				Toast({
					message: "请输入正确格式手机号！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
				return;
			}
			let parm = {
				AId:this.AId,
				Name:this.BName,
				Phone:this.BPhone
			}
			activityApply(parm).then(res =>{
				console.log(res);
				if(res.Status == 200){
					Toast({
    					  message: "报名成功",
    					  position: 'top',
    					  iconClass: 'fa fa-success',
    					  duration: 3000
    				  });
					  this.popupVisible = false;
					  this.BName = "";
					  this.BPhone = "";
					  this.getData();
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
			var localLocale = moment(date).format('YYYY-MM-DD HH:MM:ss');
			return localLocale;
		}
	}
}
</script>
<style lang="scss">
body {
}
.activitysDetail {
	background: white;
	margin-bottom: 2.5rem;
    .newsView{
        padding: 0.25rem 0.25rem 0.8rem;
        background-color: white;
        border-bottom-left-radius: 0.2rem;
        border-bottom-right-radius: 0.2rem;
        .header{
            color: #000;
            font-size: 0.55rem;
            margin: 0.2rem 0rem 0.4rem;
        }
		.date{
			color: #9F9F9F;
			font-size: 0.3rem;
			border-bottom: 1px solid #ccc;
			padding-bottom: 0.4rem;
		}
        .title {
            margin: 0.2rem 0rem;
			color: #888;
    		font-size: 0.35rem;
			font-weight: 500;
            a{
                color: #d90068;
                margin-right: 0.2rem;
            }
        }
    }
	.newsContent{
		color: #444;
		padding-top: 0.4rem;
		p,div{
			padding: 0.2rem 0;
	    	text-indent: 0.5rem;

			img{
				width: 100%;
			    height: auto;
			    max-width: 100%;
			    display: block;
			}
		}
	}
	button{
		background-color: #ff6600;
		color: white;
		margin-top: 0.5rem;
		display: inline-block;
		position: fixed;
    	bottom: 0.3rem;
	}
	.bao{
		width: 70%;
		margin-left: 15%;
		.mint-button-text{
			span{
				font-size: 0.3rem;
			}
		}
	}
	.tijiao{
		width: 30%;
		margin-left: 47%;
	}
	.cancel{
		width: 30%;
		margin-left: 10%;
		color: #656b79 !important;
    	background-color: #f6f8fa !important;
    	-webkit-box-shadow: 0 0 1px #b8bbbf !important;
        box-shadow: 0 0 1px #b8bbbf;
	}
	.mint-popup{
		width: 70%;
	    height: 25%;
	    padding: 5%;
		top: 40%;
		.header,.el-input{
			margin-bottom: 0.2rem;
		}
	}
}
</style>
