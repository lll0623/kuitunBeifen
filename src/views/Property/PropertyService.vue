<template>
<div class="index-wrapper">
	<div id="container" class="PropertyService">
		<mt-swipe :auto="4000" class="image" ref="swipe" v-if="images.length == 0">
			<mt-swipe-item>
				<img :src="defaultImg" />
			</mt-swipe-item>
		</mt-swipe>
		<mt-swipe :auto="4000" class="image" ref="swipe" v-else>
			<mt-swipe-item v-for="img in images" :key="img.id">
				<img :src="img.ImageUrl" />
			</mt-swipe-item>
		</mt-swipe>
		<div class="operationModule">
			<div class="fl" v-for="(item,index) in optionData" :key="index" @click="UrlClick(item)" >
				<img v-if="!!item.PicPath" :src="ImageDomain + item.PicPath" />
				<img v-else :src="defaultOPtionImg" />
				<p>{{ item.Name }}</p>
			</div>
		</div>

		<div class="Notice">
			<div class="titleService">
				<div class="fl">
					社区公告
				</div>
				<div class="fr" @click="NoticeMore()">
					更多
					<i class="fa fa-angle-double-right"></i>
				</div>
				<div class="clear"></div>
			</div>
			<div class="content">
				<ul>
					<li v-for="(item,index) in NoticeData" :key="index">
						<router-link :to="`/NoticeDetails/${item.Id}`">
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
						</router-link>
					</li>
				</ul>
			</div>
		</div>

		<div class="Notice" style="display:none;">
			<div class="titleService">
				<div class="fl">
					社区新闻
				</div>
				<div class="fr" @click="NewsMore()">
					更多
					<i class="fa fa-angle-double-right"></i>
				</div>
				<div class="clear"></div>
			</div>
			<div class="content">
				<ul>
					<li v-for="(item,index) in ArticlesData" :key="index">
						<router-link :to="`/NewsDetails/${item.Id}`">
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
						</router-link>
					</li>
				</ul>
			</div>
		</div>

		<div class="Information" style="display:none;">
			<div class="titleService">
				<div class="fl">
					社区活动
				</div>
				<div class="fr" @click="ActivitysMore()">
					更多
					<i class="fa fa-angle-double-right"></i>
				</div>
				<div class="clear"></div>
			</div>
			<div class="content">
				<ul>
					<li v-for="(item,index) in ActivitysData" :key="index">
						<router-link :to="`/ActivitysDetails/${item.Id}`">
							<img :src="item.HeadPic" class="fl" alt="">
							<div class="textRight rel">
								<div class="text">
									{{ item.Title }}
								</div>
								<div class="date abs">
									发布日期：{{ item.ReleaseTime | dateFormat}}
								</div>
							</div>
						</router-link>
					</li>
				</ul>
			</div>
		</div>

	</div>
</div>
</template>
<script type="es6">
import {
	getAccount, // 获取用户信息
	queryPubRoomRelaInfoList, // 所绑定的房产
	getDomains, // 菜单接口
	getHouseTypeDetails,
	getSMSHelper,
	getReservationHouse,
	getNotices, // 社区公告接口
	getArticles, // 获取新闻接口
	getActivitys, // 社区活动
	getCarouseList  //轮播图
} from '../../api/api.js'
import defaultImg from '../../assets/images/room_default.jpg'
import defaultOPtionImg from '../../assets/images/notpic.png'
import {setCookie,getCookie,delCookie} from '../../util'
import md5 from 'js-md5'
import { Toast,Field,MessageBox } from 'mint-ui'
import { isNull } from '../../util'
import moment from 'moment'
export default {
	data() {
		return {
			defaultImg,
			defaultOPtionImg,
			images: [],
			Content:'',
			pageSize: 3,
			pageNo: 1,
			optionData:[], // 菜单数据
			ImageDomain:window.config.ImgUrl, // 文件根目录
			NoticeData:[], // 社区公告数据
			ArticlesData:[], // 新闻数据
			ActivitysData:[], // 社区活动数据
			PubRoomRelaInfoList:[], // 绑定房间数据
			isLoadOver:false // 判断页面加载是否完成
		}
	},
	beforeRouteEnter(to, from, next) {
		if(getCookie("HasBindPhone") == "0"  || !getCookie("HasBindPhone")){
			next(vm => {
				vm.$router.push('/login')
			})
		}else{
			next(vm => {
				window.document.title = "物业服务";
				document.body.style.backgroundColor = '#eee';
				vm.GetAccount();
			})
		}
	},
	mounted() {
		if(getCookie("HasBindPhone") == "1") {
			this.GetCarouseList(); // 轮播图
			this.GetDomains(); // 菜单管理
			this.GetNotices(); // 公告
			this.GetArticles(); // 新闻
			this.GetActivitys(); // 活动
			this.QueryPubRoomRelaInfoList(); // 判断是否绑定房间
		}
		// 判断是否支持回退
		if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', this.returns, false);
        }
	},
	destroyed() {
        window.removeEventListener('popstate', this.returns, false);
    },
	methods: {
		returns(){
			WeixinJSBridge.call('closeWindow');// 关闭wx页面，回到聊天界面，不会弹出询问
        },
		GetAccount() {
				getAccount({}).then(res => {
					if(res.Status == 200){
						if(!!res.Data){
							setCookie("PStructId",res.Data.PStructId);
							setCookie("Phone",res.Data.Phone);
							setCookie("UserName",res.Data.RealName);
						}
						this.isLoadOver = true;
					}else {
						Toast({
							message: res.Message,
							position: 'top',
							iconClass: 'fa fa-close',
							duration: 3000
						});
						this.isLoadOver = true;
					}

				})
		},
		// 判断是否绑定房间
		QueryPubRoomRelaInfoList() {
			queryPubRoomRelaInfoList({}).then(res =>{
				console.log(res);
				if(res.Status == 200){
					this.PubRoomRelaInfoList = res.Data;
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
		GetCarouseList(){
			getCarouseList({}).then(res =>{
				if(res.Status == 200){
					this.images = res.Data;
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
		// 菜单管理
		GetDomains(){
			var parm = {
				groupCode:"wxhome",
			}
			getDomains(parm).then(res =>{
				// console.log(res);
				if(res.Status == 200){
					this.optionData = res.Data;
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
		UrlClick(data){
			if(!this.isLoadOver){
				Toast({
				  message: "页面尚未加载完成",
				  position: 'top',
				  duration: 1500
			  });
			  return;
			}
			if(!data.Domain || data.Domain == ""){
				Toast({
				  message: "敬请期待！",
				  position: 'top',
				  duration: 1000
				});
				return;
			}
			if(!!getCookie("PStructId") && getCookie("BindStatus") === "false"){
				return;
			}
			if(this.PubRoomRelaInfoList.length>0 && !!getCookie("PStructId") && getCookie("PStructId") != "null"){
				var Domain = document.location.origin;
				var url = data.Domain;
				if(url.substr(0,7).toLowerCase() == "http://" || url.substr(0,8).toLowerCase() == "https://"){
				    url = url;
				}else{
				    url = Domain + url;
				}
				location.assign(url)
			}else {
				MessageBox.confirm('该功能需要绑定房间才能使用，马上绑定!', '绑定房产？', {
							showConfirmButton: true,
							confirmButtonText:'确定',
							showCancelButton: true,
							cancelButtonText:'取消'
				        }).then(() => {
				         this.$router.push("/mypstruct");
				        }).catch(() => {
							Toast({
  							  message: "已取消",
  							  position: 'top',
  							  duration: 3000
  						  });
				        });
			}
		},
		GetNotices() {
			var parm = {
				pageIndex: this.pageNo,
				pageSize: this.pageSize
			}
			getNotices(parm).then(res =>{
				// console.log(res);
				if(res.Status == 200){
					this.NoticeData = res.Data.Data;
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
		GetArticles() {
			var parm = {
				category:"news",
				secCategory:"",
				pageIndex: this.pageNo,
				pageSize: this.pageSize
			}
			getArticles(parm).then(res =>{
				// console.log(res);
				if(res.Status == 200){
					this.ArticlesData = res.Data.Data;
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
		GetActivitys() {
			var parm = {
				pageIndex: this.pageNo,
				pageSize: this.pageSize
			}
			getActivitys(parm).then(res =>{
				// console.log(res);
				if(res.Status == 200){
					this.ActivitysData = res.Data.Data;
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
		NoticeMore() {
			if(this.NoticeData.length == 0){
				Toast({
					message: "暂无数据！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
			}else {
				this.$router.push("/Notice");
			}
		},
		NewsMore() {
			if(this.ArticlesData.length == 0){
				Toast({
					message: "暂无数据！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
			}else {
				this.$router.push("/News");
			}
		},
		yzmj() {
			Toast({
				message: "敬请期待！",
				position: 'top',
				duration: 3000
			});
		},
		wgzf() {
			Toast({
				message: "敬请期待！",
				position: 'top',
				duration: 3000
			});
		},
		ActivitysMore() { // Activitys
			if(this.ActivitysData.length == 0){
				Toast({
					message: "暂无数据！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
			}else {
				this.$router.push("/Activitys");
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
.PropertyService {
	background-color: #eee;
	.operationModule{
		background-color: white;
		display:inline-block;
		width: 100%;
		padding: .4rem 0rem 0;
		margin-bottom: 0.1rem;
		div{
			width: 20%;
			text-align: center;
			margin-bottom: 0.5rem;
			img{
				width: 1.3rem;
				height: 1.3rem;
			}
			p{
				color: #828a8a;
				font-size: 0.3rem;
				margin-top: 0.3rem;
			}
		}
	}
	.Notice{
		background-color: white;
		display:inline-block;
		width: 100%;
		margin-bottom: 0.1rem;
		.titleService{
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
			width: 100%;
			li {
				border-bottom: 1px solid #dedede;
			    padding: 0.25rem 0;
				.textNotice{
					font-size: 0.35rem;
					color: #333;
				}
				.imgNotice{
					img{
						width: 0.55rem;
						height: 0.55rem;
					}
				}
				.dateNotice{
					color: #828a8a;
					font-size: 0.3rem;
				}
			}

		}
	}
	.Information{
		background-color: white;
		display:inline-block;
		width: 100%;
		margin-bottom: 0.2rem;
		.titleService{
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
			li{
				border-bottom: 1px solid #dedede;
				display: inline-block;
    			width: 100%;
				img{
					margin: 0.25rem;
					width: 4rem;
					height: 2.5rem;
				}
				.textRight{
					padding-left: 4rem;
					margin: 0.25rem;
					.text{
						overflow: hidden;
					    text-overflow: ellipsis;
					    display: -webkit-box;
					    -webkit-line-clamp: 3;
					    -webkit-box-orient: vertical;
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
