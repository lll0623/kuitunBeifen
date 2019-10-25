<template>
<div class="index-wrapper">
	<div id="container" class="AddPStruct">
		<div class="mineThings">
			<ul class="listItem">
				<router-link :to="`/addwithIdCard`">
					<li>
						<i class="fa fa-address-card-o"></i>&nbsp;&nbsp;手机/身份证绑定
						<i class="fa fa-angle-right fr"></i>
					</li>
				</router-link>
				<router-link :to="`/addwithwizard`">
					<li>
						<i class="fa fa-hand-o-up"></i>&nbsp;&nbsp;自选楼盘
						<i class="fa fa-angle-right fr"></i>
					</li>
				</router-link>
				<!-- <router-link :to="``"> -->
					<!-- <li @click="NoClick()">
						<i class="fa fa-qrcode"></i>&nbsp;&nbsp;扫码绑定
						<i class="fa fa-angle-right fr"></i>
					</li> -->
				<!-- </router-link> -->
				<!-- <router-link :to="`/addwithphone`">
					<li>
						<i class="fa fa-mobile"></i>&nbsp;&nbsp;手机号匹配
						<i class="fa fa-angle-right fr"></i>
					</li>
				</router-link> -->
				<router-link :to="`/addwithArtificial`">
					<li>
						<i class="fa fa-mobile"></i>&nbsp;&nbsp;人工申请
						<i class="fa fa-angle-right fr"></i>
					</li>
				</router-link>
			</ul>
		</div>

	</div>
</div>
</template>
<script type="es6">
//util
import {setCookie,getCookie,delCookie} from '../../util'
import { getHouseLists } from '../../api/api.js'
import defaultImg from '../../assets/images/room_default.jpg'
import { isNull } from '../../util'
import { Loadmore } from 'mint-ui'
import { Toast  } from 'mint-ui'
import { Cell } from 'mint-ui';
export default {
	components: {
		"v-loadmore": Loadmore
	},
	data() {
		return {
			Name:"希沉",
			PStructName:"希沉希沉希沉希沉希沉希沉希沉希沉希沉希沉希沉"
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "请选择以下一种选房方式";
			document.body.style.backgroundColor = '#eee'
		})
	},
	mounted() {

	},
	methods: {
		NoClick() {
			Toast({
				message: '该功能暂未开放！',
				position: 'top',
				duration: 3000
			});
		}
	}
}
</script>
<style lang="scss">
body{
	background-color: #eee;
}
.AddPStruct{
	background-color: #eee;
	.mineThings{
		margin-bottom: 0.3rem;
	}
	.listItem{
		color: #333;
		li:first-child{
			border-top: 1px solid #dedede;
		}
		li{
			margin-top:0.5rem;
			background-color: white;
			padding: 0.4rem 0.25rem;
			border-bottom: 1px solid #dedede;
			color: #333;
			font-size: 0.45rem;
			i{
				font-size: 0.5rem;
			}
			.fa-angle-right{
				color: #c8c8cd;
				font-size: 0.5rem;
				margin-top: 0.1rem;
			}
		}
		li:active{
			background-color: #e6e6e6;
		}
	}
}


</style>
