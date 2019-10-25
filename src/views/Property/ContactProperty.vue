<template>
<div class="index-wrapper">
	<div id="container" class="ContactProperty">

		<div class="PStructSelect">
			<el-select v-model="PStructId" @change="change()" filterable placeholder="请选择房产">
			    <el-option
			      v-for="item in options"
			      :key="item.PStructId"
			      :label="item.PStructName"
			      :value="item.PStructId">
			     </el-option>
			</el-select>
		</div>

		<div class="content">
			<div class="red tc bg-eee" v-show="contacts.length == 0">
				暂无数据
			</div>
			<ul>
				<li v-for="(item,index) in contacts" :key="index" @click="callPhone(item.Phone)">
					<div class="fl textNotice ellipsis"  style="width:55%;">
						{{ item.Name }}
					</div>
					<div class="fl textNotice tr" style="width:45%;">
						{{ item.Phone }}
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
//util
import {setCookie,getCookie,delCookie} from '../../util'
import { queryPubRoomRelaInfoList,getSvrPhones } from '../../api/api.js'
import defaultImg from '../../assets/images/room_default.jpg'
import { Toast  } from 'mint-ui'
export default {
	data() {
		return {
			options: [], // 房产数据
			contacts:[], // 联系人数据
	        PStructId: getCookie("PStructId"),
			textarea:'',
			dialogImageUrl: defaultImg,
		    dialogVisible: false,
			defaultImg:[{name:'12',url:defaultImg},{name:'12',url:defaultImg},{name:'12',url:defaultImg},{name:'12',url:defaultImg}]
			}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "联系物业";
			document.body.style.backgroundColor = '#eee'
			// setCookie("PStructId","16dfcb32-d968-41f9-8d6b-34c53814ab94");
		})
	},
	mounted() { //
		queryPubRoomRelaInfoList({}).then(res =>{
			// console.log(res);
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
		getSvrPhones({pStructIds:[this.PStructId]}).then(res =>{
			console.log(res);
			if(res.Status == 200){
				if (res.Data.length == 0){
					Toast({
						message: "暂无数据！",
						position: 'top',
						iconClass: 'fa fa-warning',
						duration: 3000
					});
				}
				this.contacts = res.Data;
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
		change(){
			getSvrPhones({pStructIds:[this.PStructId]}).then(res =>{
				console.log(res); // contacts
				if(res.Status == 200){
					if (res.Data.length == 0){
						Toast({
							message: "暂无数据！",
							position: 'top',
							iconClass: 'fa fa-check',
							duration: 3000
						});
					}
					this.contacts = res.Data;
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
		// 调用拨号功能
		callPhone (phoneNumber) {
		    window.location.href = 'tel:' + phoneNumber
		},
		handleRemove(file, fileList) {
	   console.log(file, fileList);
	 },
	 handlePictureCardPreview(file) {
	   this.dialogImageUrl = file.url;
	   this.dialogVisible = true;
	 }
	}
}
</script>
<style lang="scss">
body{
	background-color: #eee;
}
.ContactProperty{
	background-color: #eee;
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
	.content{
		background-color: white;
		width: 100%;
		li {
			border-bottom: 1px solid #dedede;
			padding: 0.25rem 0.25rem;
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
