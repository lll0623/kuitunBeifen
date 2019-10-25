<template>
<div class="index-wrapper">
	<div id="container" class="AboutUs">
		<div class="AboutUs">
			<div class="content">
				<div class="red tc bg-eee" v-show="ArticlesData.length == 0" style="padding: 0.2rem;">
					暂无数据
				</div>
				<ul>
					<li v-for="(item,index) in ArticlesData" :key="index" @click="AboutUsClick(item)">
						<img :src="item.HeadPic" class="fl" alt="">
						<div class="textRight rel">
							<div class="text">{{ item.Title }}</div>
						</div>
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
import { Toast  } from 'mint-ui'
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
			window.document.title = "关于我们";
			document.body.style.backgroundColor = '#eee'
		})
	},
	mounted() {
		getArticles({
			category:"aboutus",
			secCategory:"",
			pageIndex: this.pageNo,
			pageSize: this.pageSize
		}).then(res => {
			switch (res.Status) {
				case 200:
				if (res.Data.Data.length == 0){
					Toast({
						message: "暂无数据！",
						position: 'top',
						iconClass: 'fa fa-warning',
						duration: 3000
					});
				}
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
		AboutUsClick(r) {
			if(r.ContentType == 0){
				this.$router.push('/AboutUsDetail/'+r.Id+'')
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
.AboutUs {
	background-color: #eee;
	.title{
		padding: 0.15rem;
	}
	.content{
		background-color: white;
		width: 100%;
		border-bottom:: 1px solid #dedede;
		li {
			border-top: 1px solid #dedede;
			padding: 0.4rem 2%;
			display: inline-block;
			width: 96%;
			background-color: white;
			img{
				width: 25%;
				float: left;
				height: 1.8rem;
			}
			.textRight{
				width: 75%;
				display: inline-block;
				float: left;
				margin-top: 6%;
				.text{
					font-size: .5rem;
				    text-align: center;
				    overflow: hidden;
				    text-overflow: ellipsis;
					white-space: nowrap;
    				word-wrap: normal;
				}
			}
		}

	}
}
</style>
