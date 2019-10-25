<template>
<div class="index-wrapper">
	<div id="container" class="New">
		<div class="New">
			<div class="title">

			</div>
			<div class="content">
				<ul>
					<li v-for="(item,index) in ArticlesData" :key="index" @click="NewsClick(item)">
						<!-- <router-link :to="`/NewsDetails/${item.Id}`"> -->
							<div class="fl tc imgNotice" style="width:10%;">
								<img src="../../assets/images/notice.png" alt="">
							</div>
							<div class="fl textNotice ellipsis"  style="width:65%;">
								{{ item.Title }}
							</div>
							<div class="fl dateNotice tc" style="width:25%;">
								<span>{{ item.ReleaseTime | dateFormat}}</span>
							</div>
							<div style="clear:both;"></div>
						<!-- </router-link> -->
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
</template>
<script type="es6">
import {getArticles} from '../../api/api.js'
import defaultImg from '../../assets/images/default.jpg'
import {isNull} from '../../util'
import { Toast } from 'mint-ui'
import moment from 'moment'
export default {
	data() {
		return {
			defaultImg,
			pageSize: 9999,
			pageNo: 1,
			ArticlesData: [],
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "社区新闻";
			document.body.style.backgroundColor = '#eee'
		})
	},
	mounted() {
		getArticles({
			category:"news",
			secCategory:"",
			pageIndex: this.pageNo,
			pageSize: this.pageSize
		}).then(res => {
			switch (res.Status) {
				case 200:
				this.ArticlesData = res.Data.Data;
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
		NewsClick(r){
			if(r.ContentType == 0){
				this.$router.push('/NewsDetails/'+r.Id+'')
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
.New {
	background-color: #eee;
	.title{
		padding: 0.15rem;
	}
	.content{
		background-color: white;
		width: 100%;
		li {
			border-bottom: 1px solid #dedede;
			padding: 0.25rem 0;
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
			.dateNotice{
				color: #828a8a;
				font-size: 0.3rem;
			}
		}

	}
}
</style>
