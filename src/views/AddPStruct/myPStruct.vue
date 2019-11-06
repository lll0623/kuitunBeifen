<template>
<div class="index-wrapper">
	<div id="container" class="MyPStruct">
		<mt-swipe :auto="4000" class="image" ref="swipe" v-if="images.length == 0">
			<mt-swipe-item>
				<img :src="defaultImg" />
			</mt-swipe-item>
		</mt-swipe>
		<mt-swipe :auto="4000" class="image" ref="swipe" v-else>
			<mt-swipe-item v-for="img in images" :key="img.id">
				<img :src="img.Url" />
			</mt-swipe-item>
		</mt-swipe>
		<div style="padding: 2rem;text-align: center;color: #333;" v-show="IsPStruct">
			暂无房产数据
		</div>
		<el-radio v-show="options.length>0" v-for="(item,index) in options" :key="index" v-model="radio" :label="item.PStructId" @change="isPStruct(item.CmpCode)">
			<span class="label">{{item.PStructName}}</span><br><br>
			<!-- <span class="code">单元编号 {{item.code}}</span> -->
			<el-button class="delBtn" type="danger" size="mini" @click="PStructDel(item.PStructId,item.PStructName)">删除</el-button>
		</el-radio>

		<div class="footButton">
			<!-- <a class="orderHouse btn tc" @click="SetDefaultPubRoom()">选择房产</a> -->
			<router-link :to="`/addpstruct`">
				<a class="orderOnline btn tc" @click=""><i class="fa fa-plus"></i>&nbsp;添加房产</a>
			</router-link>
		</div>
	</div>
</div>
</template>
<script type="es6">
import { queryPubRoomRelaInfoList,setDefaultPubRoom,removePubRoomRela } from '../../api/api.js'
import {setCookie,getCookie,delCookie,isNull} from '../../util'
import defaultImg from '../../assets/images/room_default.jpg'
import md5 from 'js-md5'
import { Toast,Field,MessageBox   } from 'mint-ui'
import moment from 'moment'
export default {
	data() {
		return {
			IsPStruct:false,
			cmpCode:"",
			defaultImg,
			options:[],
			PSValue:"",
			radio: "",
			images: [],
			Content:'',
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "我的房产列表";
		})
	},
	mounted() {
		if(getCookie("PStructId")){
			this.radio = getCookie("PStructId");
		}
		this.QueryPubRoomRelaInfoList(); // 获取绑定的房产列表
	},
	methods: {
		QueryPubRoomRelaInfoList() {
			queryPubRoomRelaInfoList({}).then(res =>{
				console.log(res);
				if(res.Status == 200){
					this.options = res.Data;
					if(!getCookie("PStructId") && res.Data.length>0){
						this.radio = res.Data[0].PStructId;
						var parm = {
							pStructId:this.radio
						}
						setDefaultPubRoom(parm).then(res =>{
							if(res.Status == 200){
								setCookie("PStructId",this.radio);
								this.$router.push('/index');
								Toast({
									message: res.Message,
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
		SetDefaultPubRoom(){
			MessageBox.confirm('绑定成功后返回个人中心！', '是否绑定该房间？', {
						showConfirmButton: true,
						confirmButtonText:'确定',
						showCancelButton: true,
						cancelButtonText:'取消'
					}).then(() => {
						if(!this.radio){
							Toast({
								message: "请选择房产！",
								position: 'top',
								iconClass: 'fa fa-warning',
								duration: 3000
							});
							return;
						}
						let parm = {
							pStructId:this.radio
						}
						setDefaultPubRoom(parm).then(res =>{
							if(res.Status == 200){
								setCookie("PStructId",this.radio);
								setCookie("cmpCode",this.cmpCode);
								this.$router.push('/index');
								Toast({
									message: res.Message,
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
					}).catch(() => {
						Toast({
						  message: "已取消",
						  position: 'top',
						  duration: 3000
					  });
					  this.radio = getCookie("PStructId");
					});
		},
		isPStruct(cmpCode) {
			this.cmpCode = cmpCode;
			console.log(this.radio)
			this.SetDefaultPubRoom();
		},
		PStructDel(id,name) {
			var parm = {
				pStructId:id
			}
			MessageBox.confirm('删除后只能重新绑定！', '确定删除房产：'+name+'？', {
				showConfirmButton: true,
	  			confirmButtonText:'确定',
	  			showCancelButton: true,
	  			cancelButtonText:'取消'
			}).then(() => {
				removePubRoomRela(parm).then(res =>{
					if(res.Status == 200){
						if(getCookie("PStructId") == id){
							delCookie("PStructId");
							delCookie("cmpCode");
						}
						this.QueryPubRoomRelaInfoList(); // 获取绑定的房产列表
						Toast({
							message: res.Message,
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
			}).catch(() => {
				Toast({
  				    message: "已取消",
  				    position: 'top',
  				    duration: 3000
  			    });
			});
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

}
</script>
<style lang="scss">
.MyPStruct {
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
		    width: 72%;
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
    .image {
        height: 6rem;
        .mint-swipe-indicator.is-active {
            background: #d90068 !important;
        }
        .mint-swipe-indicator {
            background: white;
            opacity: 1.2;
        }
		img{
			width: 100%;
			height: 100%;
		}
    }
	.mint-button--primary {
	    color: #fff;
	    background-color: #d90068;
	}
	.mint-msgbox-cancel{
		background: #ddd;
	}
	.mint-msgbox-confirm {
	    color: white;
		background: #d90068;
	    width: 50%;
	}
    .nameAddress {
        p {
            padding: 0.2rem 0.5rem 0 0.4rem;
            label {
                margin-top: 7px;
                display: -webkit-inline-box;
            }
            .moneyColor {
                font-weight: 700;
                font-size: 0.6rem;
                color: #ff4081;
            }
        }
    }
    .houseBody {
        .hrB {
            position: relative;
            border-top: 1rem solid #797979;
            width: 80%;
            margin: 1rem auto 1rem;
            .hrT {
                position: absolute;
                width: 2.5rem;
                text-align: center;
                top: -0.3rem;
                background: white;
                left: 37%;
            }
        }
        .houseConfig {
            ul {
                li {
                    width: 25%;
                    float: left;
                    text-align: center;
                    margin-bottom: 0.5rem;
                    .fa_25x {
                        font-size: 1rem;
                        padding: 0.3rem;
                        background-color: #ccc;
                        border-radius: 1rem;
                    }
                    p {
                        color: #333;
                        font-size: 0.1rem;
                        margin-top: 0.2rem;
                    }
					h4{
						margin-top: 0.4rem;
					}
					&.active{
						color: #d90068
					}
                }
            }
        }
        .houseType {
            white-space: pre-wrap;
            color: #333;
            padding: 0.5rem;
            margin-bottom: 2.5rem;
        }
    }
	.mint-cell:last-child{
		background-image: none;
	}
    .footButton {
        position: fixed !important;
        bottom: 0;
        width: 100%;
		background-color: #eee;
        .orderHouse {
			color: #ff8533;
		    background-color: #ffffff;
		    padding: 0.5rem 0;
		    position: relative;
		    width: 41%;
		    margin: 4%;
		    border-radius: 5px;
		    float: left;
		    border: 1px solid #ff8533;
        }
        .orderOnline {
			color: #ffffff;
		    background-color: #ff8533;
		    padding: 0.3rem 0;
		    position: relative;
		    width: 92%;
		    margin: 4%;
		    border-radius: 5px;
		    float: left;
			 border: 1px solid #ff8533;
        }
        .btn:after {
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            //设置径向渐变
            background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: scale(10, 10);
            opacity: 0;
            transition: transform 0.3s, opacity 0.5s;
        }

        .btn:active:after {
            transform: scale(0, 0);
            opacity: 0.3;
            //设置初始状态
            transition: 0s;
        }
    }
    .mint-msgbox-wrapper {
        .mint-msgbox-title {
            text-align: left;
            margin-left: 1rem;
		    font-size: 0.5rem;
        }
    }
	.mint-field .mint-cell-title {
	    width: 2.19rem;
		font-size: 0.4rem;
		text-align: right;
    	padding-right: 0.2rem;
	}
	.mint-toast {
	    z-index: 2051;
	}
	.mint-msgbox-content {
		padding: 0.5rem 0.1rem 0.5rem 0.1rem;
	}
	.mint-field-core {
	    height: 1rem;
	    font-size: 0.4rem;
	    border-radius: 4px;
	    border: 1px solid #dcdfe6;
	}
	.mint-cell-wrapper{
		background-image:none;
		margin-bottom: 0.2rem;
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
			width: 100%;
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
	    border-bottom: 1px solid #ddd;
	}
	.height100{
	    height: 100%;
	}
	.width100{
	    width: 100%;
	}
	.picker-slot {
    font-size: 12px;
}
}
/*icon*/
@font-face {font-family: "iconfont";
  src: url('../../assets/css/iconfont.eot'); /* IE9*/
  src: url('../../assets/css/iconfont.eot#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('../../assets/css/iconfont.woff') format('woff'), /* chrome, firefox */
  url('../../assets/css/iconfont.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('../../assets/css/iconfont.svg#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
</style>
