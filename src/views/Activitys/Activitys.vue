<template>
<div class="index-wrapper">
	<div id="container" class="Information_1">
		<div class="Information">
			<div class="title">

			</div>
			<div class="content">
				<ul>
					<li v-for="(item,index) in ActivitysData" :key="index" @click="ActivitysClick(item)">
						<!-- <router-link :to="`/ActivitysDetails/${item.Id}`"> -->
							<img :src="item.HeadPic" class="fl" alt="">
							<div class="textRight rel">
								<div class="text">
									{{ item.Title }}
								</div>
								<div class="date abs">
									发布日期：{{ item.ReleaseTime | dateFormat}}
								</div>
							</div>
						<!-- </router-link> -->
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
</template>
<script type="es6">
import {getActivitys} from '../../api/api.js'
import defaultImg from '../../assets/images/default.jpg'
import {isNull} from '../../util'
import moment from 'moment'
import { Toast } from 'mint-ui'
export default {
	data() {
		return {
			defaultImg,
			pageSize: 9999,
			pageNo: 1,
			ActivitysData:[], // 社区活动数据
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "社区活动";
			document.body.style.backgroundColor = '#eee'
		})
	},
	mounted() {
		getActivitys({
			pageIndex: this.pageNo,
			pageSize: this.pageSize
		}).then(res => {
			switch (res.Status) {
				case 200:
				this.ActivitysData = res.Data.Data;
					break;
				default:
					Toast({
						message: res.Message,
						position: 'middle',
						iconClass: 'fa fa-close',
						duration: 3000
					});
			}
		})
	},
	methods: {
		ActivitysClick(r) {
			if(r.ContentType == 0){
				this.$router.push('/ActivitysDetails/'+r.Id+'')
			}else if (r.ContentType == 1) {
				window.location.href = r.Url;
			}else if (r.ContentType == 2) {
				// window.location.href = r.Url;
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
			var localLocale = moment(date).format('YYYY-MM-DD');
			return localLocale;
		}
	}
}
</script>
<style lang="scss">
.Information_1{
	background-color: #eee;
	.Information{
		display:inline-block;
		width: 100%;
		margin-bottom: 0.2rem;
		.title{
			padding: 0.2rem 0.3rem;
			border-bottom: 1px solid #dedede;
			font-size: 400;
			.fl{
				color: #6B6B6B;
				font-weight: 600;
			}
			.fr{
				color: #828a8a;
			}
		}
		.content{
			background-color: white;
			li{
				border-bottom: 1px solid #dedede;
				display: inline-block;
				width: 100%;
				img{
					margin: 0.25rem;
					width: 4rem;
				}
				.textRight{
					padding-left: 4rem;
					margin: 0.25rem;
					.text{
						-webkit-line-clamp: 3;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						overflow: hidden;
						font-size: 0.35rem;
					}
					.date{
						top: 2rem;
						color: #6B6B6B;
						font-size: 0.35rem;
					}
				}
			}
		}
	}
}

</style>
