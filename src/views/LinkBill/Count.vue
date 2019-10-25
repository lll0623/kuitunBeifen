<template>
<div class="index-wrapper">
	<div id="container" class="Count">
        <div class="title">
            <p>报事报修</p>
        </div>
        <div class="content">
            <div class="fl" v-for="(item,index) in BSList" :key="index" @click="countClick(item.Type,item.Count)">
                <p class="p1">{{ item.State }}</p>
                <p class="p2">{{ item.Count }}</p>
            </div>
        </div>
        <div class="title" style="margin-top:0.3rem;">
            <p>投诉</p>
        </div>
        <div class="content">
			<div class="fl" v-for="(item,index) in TSList" :key="index" @click="countClick(item.Type,item.Count)">
                <p class="p1">{{ item.State }}</p>
                <p class="p2">{{ item.Count }}</p>
            </div>
        </div>
        <div class="title" style="margin-top:0.3rem;">
            <p>其他</p>
        </div>
        <div class="content">
			<div class="fl" v-for="(item,index) in QTList" :key="index" @click="countClick(item.Type,item.Count)">
                <p class="p1">{{ item.State }}</p>
                <p class="p2">{{ item.Count }}</p>
            </div>
        </div>
	</div>
</div>
</template>
<script type="es6">
//util
import {setCookie,getCookie,delCookie} from '../../util'
import { queryLinkBillStatistical } from '../../api/api.js'
import { isNull } from '../../util'
import { Loadmore } from 'mint-ui'
import { Toast  } from 'mint-ui'
import { Cell } from 'mint-ui';
export default {

	data() {
		return {
				countList:[],
				BSList:[],
				TSList:[],
				QTList:[]
			}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "我的工单";
			document.body.style.backgroundColor = '#eee'
		})
	},
	mounted() {
		queryLinkBillStatistical({}).then(res =>{
			console.log(res);
			if(res.Status == 200){
				try{
					this.BSList = res.Data.filter(u => u.Title == "报事报修" );
					this.TSList = res.Data.filter(u => u.Title == "投诉" );
		 		    this.QTList = res.Data.filter(u => u.Title == "其它" );
		 	    }catch(e){
		 		   console.log(e)
		 	    }

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
		countClick(type,count) {
			console.log(type)
			if(count == 0){
				Toast({
					message: "暂无数据！",
					position: 'top',
					iconClass: 'fa fa-warning',
					duration: 3000
				});
			}else {
				this.$router.push({
		            path: '/countList',
		            query: {
		            	type: type
		            }
		        })
			}
		}
	}
}
</script>
<style lang="scss">
body{
	background-color: #eee;
}
.Count{
	background-color: #eee;
    padding: 0.3rem;
    .title{
        border-left: 0.1rem solid #0E90D2;
        p{
            padding-left: 0.2rem;
            color: #0E90D2;
            font-size: 0.5rem;
            font-weight: 600;
            line-height: 1rem;
            height: 1rem;
        }
    }
    .content{
        margin-top: 0.2rem;
        border-top: 1px solid #DEDEDE;
        padding-top: 0.25rem;
        display: inline-block;
        width: 100%;
        .fl{
            width: 31%;
            background-color: white;
            height: 1.2rem;
            padding: 0.1rem 0;
            margin-right: 3.5%;
            p{
                text-align: center;
                line-height: 0.65rem;
                color: #808080;
            }

        }
        .fl:last-child{
            margin-right: 0%;
        }
    }
}


</style>
