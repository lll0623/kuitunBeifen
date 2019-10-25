<template>
<div class="index-wrapper">
	<div id="container" class="BMPhone">
		<div class="content">
			<div class="red tc bg-eee" style="padding:10px;" v-show="phoneData.length == 0">
				暂无数据
			</div>
			<ul>
				<li v-for="(item,index) in phoneData" :key="index" @click="callPhone(item.Phone)">
					<div class="fl textNotice ellipsis"  style="width:55%;">
						{{item.Name}}
					</div>
					<div class="fl textNotice tr" style="width:45%;">
						{{item.Phone}}
						<i class="fa fa-volume-control-phone"></i>
					</div>
					<div style="clear:both;"></div>
				</li>
			</ul>
		</div>

	</div>
</div>
</template>
<script type="es6">
import {queryGlobalSvrPhone} from '../../api/api.js'
//util
import {setCookie,getCookie,delCookie} from '../../util'
import defaultImg from '../../assets/images/room_default.jpg'
import { Toast  } from 'mint-ui'
export default {
	data() {
		return {
			phoneData:[], // 电话数据
			textarea:'',
			dialogImageUrl: defaultImg,
		    dialogVisible: false
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "便民电话";
			document.body.style.backgroundColor = '#eee'
			// setCookie("PStructId","16dfcb32-d968-41f9-8d6b-34c53814ab94");
		})
	},
	mounted() {
		this.QueryGlobalSvrPhone();
	},
	methods: {
		// 调用拨号功能
		callPhone (phoneNumber) {
		    window.location.href = 'tel:' + phoneNumber
		},
		QueryGlobalSvrPhone(){
			queryGlobalSvrPhone({}).then(res =>{
				if(res.Status == 200){
					this.phoneData = res.Data;
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
.BMPhone{
	background-color: #eee;
	.content{
		background-color: white;
		width: 100%;
		li {
			border-bottom: 1px solid #dedede;
			padding: 0.45rem;
			.imgNotice{
				img{
					width: 0.55rem;
					height: 0.55rem;
				}
			}
			.textNotice{
				font-size: 0.35rem;
				color: #333;
			}
		}

	}
}


</style>
