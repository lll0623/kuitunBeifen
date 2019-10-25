<template>
<div class="index-wrapper">
	<div id="container" class="CountList">
		<div class="list" v-for="(item,index) in postData" :key="index" @click="CountViewClick(item.Id)">
			<div class="header">
				单据编号：{{ item.Code }}
			</div>
			<div class="content">
				<div class="">
					维修地点为：{{ item.PStructName }}
				</div>
				<div class="">
					报修内容为：{{ item.Content }}
				</div>
				<div class="">
					状态：
					<span v-if="item.State == 0" class="label label-dtj">未提交</span>
					<span v-if="item.State == 1" class="label label-warning">待处理</span>
					<span v-if="item.State == 2" class="label label-primary">跟进中</span>
					<span v-if="item.State == 3" class="label label-success">已完成</span>
					<span v-if="item.State == 4" class="label label-danger">已退单</span>
					<span v-if="item.State == 5" class="label label-default">不处理</span>
				</div>
			</div>
			<div class="footer">
				单据时间：{{ item.Date | dateFormat}}
			</div>
		</div>
	</div>
</div>
</template>
<script type="es6">
//util
import {setCookie,getCookie,delCookie} from '../../util'
import { queryLinkBillList } from '../../api/api.js'
import { isNull } from '../../util'
import { Loadmore } from 'mint-ui'
import { Toast  } from 'mint-ui'
import { Cell } from 'mint-ui';
import moment from 'moment'
export default {

	data() {
		return {
			postData:[]
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "联系单列表";
			document.body.style.backgroundColor = '#efefef'
		})
	},
	activated() {
		var parm = {
			Type:this.$route.query.type,
			PageIndex:1,
			PageSize:9999
		}
		queryLinkBillList(parm).then(res =>{
			console.log(res);
			if(res.Status == 200){
				this.postData = res.Data.Data;
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
		CountViewClick(id) {
			this.$router.push({
				path: '/countView',
				query: {
					BillId: id
				}
			})
		}
	},
	filters:{
		//时间格式化
		dateFormat:function(date) {
			if (date == undefined) {
			   return "";
			}
			//moment.locale('en'); //日期格式汉化
		 var localLocale = moment(date).utcOffset(480).format('YYYY-MM-DD HH:mm:ss');
		 return localLocale;
		}
	}
}
</script>
<style lang="scss">
body{
	background-color: #efefef;
}
.CountList{
	background-color: #efefef;
	padding: 0.15rem;
	.list{
		margin-bottom: 0.5rem;
		.header{
			padding: 0.2rem;
			background-color: #f5f5f5;
			font-weight: 600;
			border: 1px solid #ddd;
		}
		.content{
			padding: 0.2rem;
			background-color: white;
			line-height: 0.6rem;
			border: 1px solid #ddd;
			border-top: none;
		}
		.footer{
			padding: 0.2rem;
			background-color: #f5f5f5;
			text-align: right;
			border: 1px solid #ddd;
			border-top: none;
		    box-shadow: 0 1px 3px rgba(0,0,0,.1);
		}
	}
}


</style>
