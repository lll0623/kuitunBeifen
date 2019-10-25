<template>
<div class="index-wrapper">
	<div id="container" class="Repair">
		<div class="RadioGroup">
			<el-radio v-model="radio" label="1">报修</el-radio>
 			<el-radio v-model="radio" label="2">报事</el-radio>
		</div>

		<div class="PStructSelect">
			<el-select v-model="value8" @change="change()" filterable placeholder="请选择房产">
			    <el-option
			      v-for="item in options"
			      :key="item.PStructId"
			      :label="item.PStructName"
			      :value="item.PStructId">
			     </el-option>
			</el-select>
		</div>
		<div class="TextareaImg">
			<el-input type="textarea" @blur.prevent="changeLiuYan()" max="500" min="10" v-model="textarea" placeholder="输入报事报修内容，你可以输入10-500个字。"></el-input>
			<ul class="listImg">
				<li v-for="(item,index) in imgList" :key="index">
					 <img :src="item.RealImgUrl" alt="" @click="handleView(item.RealImgUrl)"> <i class="el-icon-delete" @click="handleRemove(item.Id)"></i>
				 </li>
				<li @click="addFile()" v-show="AddHide">
					<div tabindex="0" class="el-upload el-upload--picture-card">
						<i class="el-icon-plus"></i>
					</div>
				</li>
			</ul>
		</div>
		<button class="mint-button mint-button--default mint-button--large" v-no-more-click  @click="submit()">
			 <label class="mint-button-text">提交</label>
		 </button>
	</div>
</div>
</template>
<script type="es6">
//util
import {setCookie,getCookie,delCookie} from '../../util'
import {
	queryPubRoomRelaInfoList,
	createLinkBill,
	getAccessToken,
	getWxConf,
	saveFileByServerId,
	getSignature
} from '../../api/api.js'
import defaultImg from '../../assets/images/room_default.jpg'
import { isNull } from '../../util'
import { Loadmore,Toast,Cell } from 'mint-ui'
import wx from 'weixin-js-sdk'

export default {
	components: {
		"v-loadmore": Loadmore
	},
	data() {
		return {
			radio: '1',
			uploadDisabled:false,
			options: [],
	        value8: getCookie("PStructId"),
			CmpCode: "",
			textarea:'',
			dialogImageUrl: defaultImg,
		    dialogVisible: false,
			AddHide:true,
			defaultImg:[],
			ready:false,
			imgList:[]  // 上传的图片列表
			}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "实时报修";
			document.body.style.backgroundColor = '#eee';
		})
	},
	mounted() {
		queryPubRoomRelaInfoList({}).then(res =>{
			if(res.Status == 200){
				this.options = res.Data;
			}else {
				Toast({
					message: res.Message,
					position: 'top',
					iconClass: 'fa fa-close',
	 				duration: 3000
				});
			}
		})
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
		getAccessToken({}).then(ret =>{
			if(ret.Status == 200){
				getSignature({url:window.location.href}).then(res =>{
					if(res.Status == 200){
						wx.config({
							 debug: false,            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							 appId: res.Data.AppId,    // 必填，公众号的唯一标识
							 timestamp: res.Data.TimeSpan,  // 必填，生成签名的时间戳
							 nonceStr: res.Data.Noncestr, // 必填，生成签名的随机串
							 signature: res.Data.Signature,// 必填，签名
							 jsApiList: [ 'chooseImage', 'uploadImage'] // 必填，需要使用的JS接口列表
						});
						this.ready = true
					}
				})
			}else {
				Toast({
					message: ret.Message,
					position: 'top',
					iconClass: 'fa fa-close',
					duration: 3000
				});
			}
		})
	},
	methods: {
		addFile(){
			let that = this;
			if(this.ready){
				wx.chooseImage({
					count: 9, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						if (localIds.length > 4) {
							Toast({
								message: "最多上传4张图片!",
								position: 'top',
								iconClass: 'fa fa-close',
				 				duration: 3000
							});
							return;
						}
						for (var i = 0; i < localIds.length; i++) {
							wx.uploadImage({
								localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function(res) {
									that.wenzi = res.serverId;
									var serverId = res.serverId; // 返回图片的服务器端ID
									saveFileByServerId(
										{mediaId:serverId,isOriginal:false}).then(res =>{
										let ImageDomain = ""
										if(getCookie("ImageDomain")){
											ImageDomain = getCookie("ImageDomain");
										}
										// alert(ImageDomain+res.Data.ImgUrl);
										that.imgList.push({
											RealImgUrl:ImageDomain+res.Data.ImgUrl,
											ImgUrl:res.Data.ImgUrl,
											Id:res.Data.ServerId
										})
										if(that.imgList.length >= 4){
											that.AddHide = false;
										}
									})
								}
							});
						}
					}
				});
			}
		},
		changeLiuYan() {
			document.body && (document.body.scrollTop = document.body.scrollTop);
		},
		handleRemove(id) {
			try{
	 		   this.imgList = this.imgList.filter(u => id!= u.Id);
			   if(that.imgList.length < 4){
				   that.AddHide = true;
			   }
	 	    }catch(e){
	 		   console.log(e)
	 	    }
	 	},
	    handleView(file) {
			var array = [];
			array.push(file);
			wx.previewImage({
			    current: file, // 当前显示图片的http链接
			    urls: array // 需要预览的图片http链接列表
			});
	    },
		change(){

		},
		submit(){
			var lastImgList = [];
				this.imgList.forEach(item =>{
					lastImgList.push(item.ImgUrl);
				})
			var obj = [];
			obj = this.options.filter(item => this.value8 == item.PStructId)
			this.CmpCode = obj[0].CmpCode;
			console.log(this.CmpCode)
			var phone = "",username = "";
			if(!!getCookie("Phone")){
				phone = getCookie("Phone");
			}
			if(!!getCookie("UserName")){
				username = getCookie("UserName");
			}
			var parm = {
				Name:username,
				Phone: phone,
				Type: this.radio,
				PStructId:this.value8,
				CmpCode:this.CmpCode,
				LinkContent: this.textarea,
				Files: lastImgList,
			}
			createLinkBill(parm).then( res=>{
				if(res.Status == 200){
					Toast({
						message: '报修报事成功！',
						position: 'middle',
						iconClass: 'fa fa-check',
						duration: 3000
					});
					setTimeout(() => {
						this.$router.push("/propertyService");
					}, 1500)
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
	}
}
</script>
<style lang="scss">
body{
	background-color: #eee;
}
.Repair{
	background-color: #eee;
	button{
		background-color: #ff6600;
		color: white;
		margin-top: 0.5rem;
		display: inline-block;
		width: 80%;
		margin-left: 10%;
		margin-bottom: 0.3rem;
	}
	.disabled .el-upload--picture-card {
        display: none;
    }
	.RadioGroup{
		height: 1.2rem;
	    background-color: white;
	    line-height: 1.1rem;
	    text-align: center;
	}
	.PStructSelect{
		text-align: center;
		.el-input__inner{
			border: none;
    		background-color: #eee;
		}
		.el-select{
			width: 90% !important;
			text-align: center !important;
		}
	}
	.TextareaImg{
		padding: 0.25rem;
		// height: 5rem;
		background-color: white;
		textarea{
			height: 4rem;
		}
		.listImg{
			display: inline-block;
			width: 100%;
			li{
				float: left;
				width: 50%;
				margin-top: 0.2rem;
				text-align: center;
				position: relative;
				.el-icon-delete{
					color: red;
					position: absolute;
					right: 0.3rem;
				    font-size: 0.5rem;
					top: 0.2rem;
				}
				.el-upload{
					width: 92%;
					height: 4rem;
				}
				img{
					width: 92%;
					height: 4rem;
				}
			}
		}
	}


}


</style>
