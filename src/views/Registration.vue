<template>
<div class="index-wrapper">
	<div id="container" class="Registeration">
				<div class="mint-msgbox-header">
					<div class="mint-msgbox-title" style="font-size: 0.5rem">注册须知</div>
				</div>
				<div class="mint-msgbox-content" v-html="Content">

				</div>
				<div class="btnGroup">
					<mt-button type="default" @click="Agree(1)">不同意</mt-button>
					<mt-button type="primary" @click="Agree(2)">同意</mt-button>
				</div>
	</div>
</div>
</template>
<script type="es6">
import {getWxAccProtocol} from '../api/api.js'
import { Toast,Field,DatetimePicker  } from 'mint-ui'
import { isNull } from '../util'
export default {
	data() {
		return {
			Content:""
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = window.config.Title;
			document.body.style.backgroundColor = '#eee'
		})
	},
	methods: {
		Agree(type){
			if(type == 1){
				WeixinJSBridge.call('closeWindow');// 关闭wx页面，回到聊天界面，不会弹出询问
			}
			else if (type == 2) {
				this.$router.push('/register')
			}
		}
	},
	created() {

	},
	mounted() {
		getWxAccProtocol({}).then(res =>{
			if(res.Status == 200){
				this.Content = unescape(res.Data);
			}else{
				Toast({
					message: res.Message,
					position: 'top',
					iconClass: 'fa fa-close',
					duration: 3000
				});
			}
		})
	},
}
</script>
<style lang="scss">
body {
background: #eee;
}
.Registeration{
	background: #eee;
    .mint-msgbox-content{
        padding: 0.2rem;
		border: none;
    }
	.mint-button--small {
	    font-size: 1em;
		padding: 0.5em;
		height: auto;
	}
	.mint-msgbox-header{
		padding: 0.5rem 0 0.5rem 0.5rem;
		border-bottom: 1px solid #ddd;
		.mint-msgbox-title{
			text-align: left;
		}
	}
	.mint-button--primary {
	    color: #fff;
	    background-color: #FF6600;
	}
	.titleFormat{
	    width: 1rem;
		text-align: center;
		i{
			font-size: 0.5rem;
			margin-top: 0.55rem;
		}
	}
	.textFormat{
	    margin-left: 1rem;
		height: 100%;
		input,select{
			height: 100%;
			width: 100%;
			border: none;
		}
		select:invalid { color: gray; }
		textarea{
			background-color: white;
		    height: 1.7rem;
			margin-top: 0.5rem;
		}
	}
	.height50{
	    height: 1.5rem;
	    border: 1px solid #ddd;
        background-color: white;margin-bottom: -1px;
	}
	.height100 {
	    height: 100%;
	}
	.width100{
	    width: 100%;
	}
	.btnGroup{
		position: fixed;
		bottom: 0.3rem;
		width: 100%;
		text-align: center;
		button{
			width: 45%;
		}
	}
}
</style>
