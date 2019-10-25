<template>
<div class="index-wrapper">
	<div id="container" class="MyPStruct">
		<div class="mint-msgbox-header">
			<div class="mint-msgbox-title" style="font-size: 0.5rem;text-align:left;">房间列表</div>
		</div>
		<el-checkbox-group v-model="checkedRooms" @change="isPStruct">
    		<el-checkbox v-for="(item,index) in options" :label="item.value" :key="index">
				<span class="label">{{item.label}}</span><br><br>
				<span class="code">单元编号 {{item.code}}</span>
				<!-- <el-button class="delBtn" type="danger" size="mini" @click="PStructDel(item.value)">删除</el-button> -->
			</el-checkbox>
  		</el-checkbox-group>

		<button class="mint-button mint-button--default mint-button--large">
			<label class="mint-button-text">提交</label>
		</button>
	</div>
</div>
</template>
<script type="es6">
import { queryPropertyList,getCmps } from '../../api/api.js'
import defaultImg from '../../assets/images/room_default.jpg'
import md5 from 'js-md5'
import { Toast,Field,Loadmore } from 'mint-ui'
import { isNull } from '../../util'
import moment from 'moment'
export default {
	data() {
		return {
			defaultImg,
			options:[
				// {label:"总公司/第01栋/第01层/ZGS001",value:1,code:"ZGS001"},
				// {label:"总公司/第01栋/第01层/ZGS002",value:2,code:"ZGS002"},
				// {label:"总公司/第01栋/第01层/ZGS003",value:3,code:"ZGS002"},
				// {label:"总公司/第01栋/第01层/ZGS004",value:4,code:"ZGS002"},
				// {label:"总公司/第01栋/第01层/ZGS005",value:5,code:"ZGS002"},
				// {label:"总公司/第01栋/第01层/ZGS006",value:6,code:"ZGS002"},
				// {label:"总公司/第01栋/第01层/ZGS007",value:7,code:"ZGS002"},
				// {label:"总公司/第01栋/第01层/ZGS008",value:8,code:"ZGS002"},
				// {label:"总公司/第01栋/第01层/ZGS009",value:9,code:"ZGS002"},
				// {label:"总公司/第01栋/第01层/ZGS0010",value:10,code:"ZGS002"},
				// {label:"总公司/第01栋/第01层/ZGS0011",value:11,code:"ZGS003"}
			],
			checkedRooms:[],
			PSValue:"",
			images: [],
			Content:'',
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
		})
	},
	mounted() {
		this.QueryPropertyListP();
	},
	methods: {

		isPStruct() {
			console.log(this.checkedRooms)
		},
		PStructDel(id) {
			console.log(id)
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
	.mint-msgbox-header {
    padding: 0.5rem 0 0.5rem 0.5rem;
    border-bottom: 1px solid #ddd;
}
	.el-checkbox{
		background-color: white;
		padding: 0.5rem 0.2rem;
		margin-right: 0px;
		display: block;
		border-bottom: 1px solid #dedede;
		.el-checkbox__input{
			float: left;
			margin-top: 0.1rem;
		}
		.el-checkbox__label{
			line-height: 0.5rem;
		}
		.label{
			color: #333;
			overflow: hidden;
		    text-overflow: ellipsis;
		    -webkit-line-clamp: 2;
		    flex-direction: column;
		    width: 90%;
		    display: block;
			position: absolute;
		    top: 0.5rem;
		    left: 0.8rem;
			font-size: 0.5rem;
		    line-height: 0.5rem;
		}
		.code{
			color: #828a8a;
			font-size: 0.2rem;
		}
		.el-button--mini{
			float: right;
			position: absolute;
			right: 10px;
			top: 25px;
		}
	}
	.el-checkbox:last-child{
		margin-bottom: 1.2rem;
	}

	.mint-button--large{
		width: 100%;
		margin: 0rem auto;
		background-color: #ff6600;
		color: white;
		position: fixed;
		bottom: 0;
		font-size: 0.5rem;
		z-index: 2000;
		height: 1.2rem;
		border-radius: 0px;
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
