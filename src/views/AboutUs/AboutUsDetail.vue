<template>
<div class="index-wrapper">
	<div id="container" class="newsDetails">
		<div class="newsView">
            <p class="header" :style="{color:'#'+item.FullheadColor}">{{ item.Title }}</p>
			<p class="date">发布时间：{{ item.ReleaseTime | dateFormat}}</p>
			<div class="newsContent" v-html="item.Content"></div>
        </div>
	</div>
</div>
</template>
<script type="es6">
import {setCookie,getCookie,delCookie} from '../../util'
import defaultImg from '../../assets/images/room_default.jpg'
import { getArticleDetail } from '../../api/api.js'
import {Toast} from 'mint-ui';
import moment from 'moment'
export default {
	data() {
		return {
			defaultImg,
			item:'',
            popupVisible:false
		}
	},
    beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "关于我们";
			document.body.style.backgroundColor = '#eee';
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
			getArticleDetail(params).then((response) =>{
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
.newsDetails {
	background: white;
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
}
</style>
