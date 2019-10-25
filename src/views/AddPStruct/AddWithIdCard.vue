<template>
<div class="index-wrapper">
	<div id="container" class="AddWithPhoneOrId">
		<div v-show="card1">
			<!-- <div class="mint-msgbox-header">
				<div class="mint-msgbox-title" style="font-size: 0.5rem">身份证号匹配</div>
			</div> -->
			<div class="mint-msgbox-content">
				<el-input type="tel"  placeholder="请输入手机号或身份证号" v-model="PhoneOrId" clearable></el-input>
				<p>该身份证号码为您在物业客服中心预留的手机号或身份证号码。</p>
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
import { getRoomListByCode,addPubRoomRelaByIdCard,addPubRoomRelaByPhone } from '../../api/api.js'
import defaultImg from '../../assets/images/default.jpg'
import md5 from 'js-md5'
import { Toast,Field,DatetimePicker,Indicator,MessageBox  } from 'mint-ui'
import { isNull } from '../../util'
import moment from 'moment'
export default {
	data() {
		return {
			PhoneOrId:"",
			IsPStruct:false,
			options:[],
			radio: "",
			card1:true,
			card2:false
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "手机/身份证绑定";
			//vm.PhoneOrId = !!vm.$route.query.idcard ? vm.$route.query.idcard : "";
		})
	},
	methods: {
		nextBtn(){
			let regPhoneNum = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
			if(this.PhoneOrId == ""){
				Toast({
					message: "请输入手机号或者身份证号！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
				return;
			}
			if(!regPhoneNum.test(this.PhoneOrId) && !this.checkCardIdFunc(this.PhoneOrId)){
				Toast({
					message: "请输入正确的手机号或身份证号！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
				return;
			}
			// if(this.PhoneOrId.length == 13 && !regPhoneNum.test(this.PhoneOrId)){
			// 	Toast({
			// 		message: "请输入正确格式的手机号！",
			// 		position: 'top',
			// 		iconClass: 'fa fa-warning',
			// 		duration: 3000
			// 	});
			// 	return;
			// }
			// if(this.PhoneOrId.length>13 && !this.checkCardIdFunc(this.PhoneOrId)){
			// 	Toast({
			// 		message: "请输入正确的身份证号!",
			// 		position: 'top',
			// 		iconClass: 'fa fa-warning',
			// 		duration: 3000
			// 	});
            //     return false;
            // }
			Indicator.open({
			    text: '加载中...',
			    spinnerType: 'fading-circle'
			});
			let type = (this.PhoneOrId.length == 11) ? 1 : 2;
			let parm = {
				type:type,
				code:this.PhoneOrId
			}
			getRoomListByCode(parm).then(res =>{
				if(res.Status == 200){
					if(!res.Data || res.Data.length == 0) {
						this.card1 = true;
						this.card2 = false;
						MessageBox.confirm('是否通过人工审核绑定房产？', '暂无房间！', {
							showConfirmButton: true,
				  			confirmButtonText:'确定',
				  			showCancelButton: true,
				  			cancelButtonText:'取消'
						}).then(() => {
							 this.$router.push("/addwithArtificial?code="+this.PhoneOrId+"&type="+type+"");
						}).catch(() => {
							Toast({
			  				    message: "已取消",
			  				    position: 'top',
			  				    duration: 3000
			  			    });
						});
					}else{
						this.options = res.Data;
						this.card1 = false;
						this.card2 = true;
					}
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
				Indicator.close();
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
            if(this.PhoneOrId.length == 11){
                let parm ={
                    checkPhone:this.PhoneOrId,
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
            }else {
                let parm ={
                    idCard:this.PhoneOrId,
                    pStructId :this.radio
                }
                addPubRoomRelaByIdCard(parm).then(res =>{
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
		//身份证补全验证
            checkCardIdFunc(value){
                let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                let city = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江 ",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北 ",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏 ",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外 "
                };
                if (reg.test(value) === false || !city[value.substr(0, 2)]) {
                    return false;
                }else{
					return true;
				}
            }
	},
	filters:{
		//时间格式化
		dateFormat:function(date) {
			if (date == undefined) {
			   return "";
			}
			moment.locale('en'); //日期格式汉化
			let localLocale = moment(date).format('YYYY-MM-DD HH:mm');
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
.AddWithPhoneOrId{
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
