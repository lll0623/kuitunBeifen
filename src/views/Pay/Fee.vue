<template>
<div class="index-wrapper">
	<div id="container" class="Fee">
        <div class="header">
            <div class="PStructSelect">
    			<el-select v-model="PStructId" @change="change()" filterable placeholder="请选择房产">
    			    <el-option
    			      v-for="item in options"
    			      :key="item.PStructId"
    			      :label="item.PStructName"
    			      :value="item.PStructId">
    			     </el-option>
    			</el-select>
    		</div>
            <div class="TotalMoney">
                <span>本期共缴费： <span class="color">￥{{ this.TotalMoneyFormat }}</span></span>
            </div>
        </div>
        <div class="FeeList">
            <ul>
                <li v-show="checklists.length>0" v-for="(item,index) in checklists">
					<div class="fl" style="width:80%;margin-left:4%;">
                        <el-collapse>
                          <el-collapse-item :title="item.FeeItemName">
                            <div class="DateMoney" v-for="items in item.Detail">
                                <div class="fl">
                                    {{ items.BeginDate | dateFormat }}&nbsp;至&nbsp;{{ items.EndDate | dateFormat }}
                                </div>
                                <div class="fr">
                                    <span>￥{{items.Money}}</span>
                                </div>
                            </div>
                          </el-collapse-item>
                        </el-collapse>
                        <div class="TotalDateMoney">
                            <div class="fl">
                                {{ item.BeginDate | dateFormat }}&nbsp;至&nbsp;{{ item.EndDate | dateFormat }}
                            </div>
                            <div class="fr">
                                <span class="themeCol">￥{{item.ReceivableMoney}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="fl checkboxLeft" style="width:15%">
                        <i class="el-icon-success" @click="chooseOrder($event,item.ReceivableMoney,item.FeeItemId,item.Detail)"></i>
                    </div>
                </li>
            </ul>
            <!-- <el-checkbox-group
                v-model="checkbox">
                <el-checkbox v-show="checklists.length>0" v-for="(item,index) in checklists" :key="index" :label="item.value" @change="isPStruct">
                    <el-collapse>
                      <el-collapse-item :title="item.label">
                        <div class="DateMoney">
                            <div class="fl">
                                2018-10-01&nbsp;至&nbsp;2018-11-30
                            </div>
                            <div class="fr">
                                <span>￥0.00</span>
                            </div>
                        </div>
                      </el-collapse-item>
                    </el-collapse>
                    <div class="TotalDateMoney">
                        <div class="fl">
                            2018-10-01&nbsp;至&nbsp;2018-11-30
                        </div>
                        <div class="fr">
                            <span>￥0.00</span>
                        </div>
                    </div>
                </el-checkbox> -->
          </el-checkbox-group>

        </div>
		<button class="mint-button mint-button--default mint-button--large" v-no-more-click  @click="submit()">
			 <label class="mint-button-text">去付款</label>
		 </button>
	</div>
</div>
</template>
<script type="es6">
//util
import {setCookie,getCookie,delCookie,formatMoney} from '../../util'
import {
	queryWxReceivableFee,queryPubRoomRelaInfoList,createReceiptBill,cencalBill,createPayOrderCode
} from '../../api/api.js'
import defaultImg from '../../assets/images/room_default.jpg'
import { isNull } from '../../util'
import {Toast,Cell,MessageBox } from 'mint-ui'
import moment from 'moment'
export default {
	data() {
		return {
			radio: '1',
            checkbox:[],
			uploadDisabled:false,
			options:[],
            value:[],
			TotalMoney:0.00,
			TotalMoneyFormat:0.00,
			ReceivableRecordIds:[],
			checklists: [],
	        PStructId: getCookie("PStructId"),
			// cmpCode: "getCookie("cmpCode")",
			cmpCode: "",
			textarea:'',
			dialogImageUrl: defaultImg,
		    dialogVisible: false,
			AddHide:true,
			}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "欠费查询";
			document.body.style.backgroundColor = '#eee';
		})
	},
	mounted() {
		var that = this;
		queryPubRoomRelaInfoList({}).then(res =>{
			if(res.Status == 200){
				that.options = res.Data;
				res.Data.forEach(function (v) {
					if(v.PStructId == that.PStructId){
						that.cmpCode = v.CmpCode;
					}
				})
			}else {
				Toast({
					message: res.Message,
					position: 'top',
					iconClass: 'fa fa-close',
	 				duration: 3000
				});
			}
		})
		// if(getCookie("FuKuanId")){
		// 	cencalBill({BillId:getCookie("FuKuanId")}).then(ress =>{
		// 		if(ress.Status == 200){
		// 			delCookie("Money");
		// 			delCookie("FuKuanId");
		// 			this.GetArticleDetail();
		// 		}else {
		// 			Toast({
		// 				message: ress.Message,
		// 				position: 'top',
		// 				iconClass: 'fa fa-close',
		//  				duration: 3000
		// 			});
		// 		}
		// 	})
		// }else {
		// 	this.GetArticleDetail();
		// }
		this.GetArticleDetail();
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
            this.$router.push("/propertyService");
        },
		change() {
			this.GetArticleDetail();
		},
		GetArticleDetail() {
			var that = this;
			if(that.PStructId){
				that.options.forEach(function (v) {
					console.log(v);
					if(v.PStructId == that.PStructId){
						that.cmpCode = v.CmpCode;
					}
				})
				queryWxReceivableFee({PStructId:that.PStructId,cmpCode:that.cmpCode}).then(res =>{
					if(res.Status == 200){
						that.checklists = res.Data;
					}else {
						Toast({
							message: res.Message,
							position: 'top',
							iconClass: 'fa fa-close',
							duration: 3000
						});
					}
				})
			}else {
				MessageBox.confirm('该功能需要绑定房间才能使用，马上绑定!', '绑定房产？', {
							showConfirmButton: true,
							confirmButtonText:'确定',
							showCancelButton: true,
							cancelButtonText:'取消'
						}).then(() => {
						 that.$router.push("/mypstruct");
						}).catch(() => {
							Toast({
							 message: "已取消",
							 position: 'top',
							 duration: 3000
						 });
						});
			}
		},
        chooseOrder(e,money,id,ids){
            if (e.target.className.indexOf("selected") == -1) {
                e.target.className = "el-icon-success selected"; //切换按钮样式
                var json = {
					id:id,
                    ids:ids,
                    money:money,
                }
                this.checkbox.push(json);
                this.checkMoney();
            } else {
                e.target.className = "el-icon-success";//切换按钮样式
               this.checkbox = this.checkbox.filter(item => {
                   return item.id != id
               })
               this.checkMoney();
            }
        },
        checkMoney(){
			this.ReceivableRecordIds = [];
            console.log(this.checkbox)
			if(this.checkbox.length == 0){
				this.TotalMoney = 0;
				this.TotalMoneyFormat = 0.00
				this.ReceivableRecordIds = [];
			}else {
				this.TotalMoney = 0;
				this.TotalMoneyFormat = 0;
				this.checkbox.forEach(row => {
					this.TotalMoney += Number(row.money);
					row.ids.forEach(res => {
						this.ReceivableRecordIds.push(res.FeeId);
					})

	        	});
				this.TotalMoneyFormat = formatMoney(this.TotalMoney)
			}
        },
		submit(){
			if(this.ReceivableRecordIds.length == 0){
				Toast({
					message: "请选择应付费项！",
					position: 'top',
					iconClass: 'fa fa-warning',
	 				duration: 1500
				});
				return;
			}

			let parm = {
				amtStr:this.TotalMoney,
				cmpCode:this.cmpCode,
				ids:this.ReceivableRecordIds
			}
			createPayOrderCode(parm).then( res =>{
				if(res.Status == 200){
					if(res.Data){
						console.log(res)
						setCookie("cmpCode",this.cmpCode);
						setCookie("FuKuanId",res.Data);
						setCookie("Money",this.TotalMoney);
						// delCookie("PayType");
						// var Domain = getCookie("Domain");
						var Domain = document.location.origin;
						location.assign(Domain +"/pay/payList")
						// this.$router.push("/pay/payList");
					}else {
						Toast({
							message: "付款单创建失败！",
							position: 'top',
							iconClass: 'fa fa-close',
							duration: 3000
						});
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
			// let parm = {
			// 	PStructId:this.PStructId,
			// 	ReceivableRecordIds:this.ReceivableRecordIds
			// }
			// createReceiptBill(parm).then( res =>{
			// 	if(res.Status == 200){
			// 		if(res.Data){
			// 			setCookie("FuKuanId",res.Data);
			// 			setCookie("Money",this.TotalMoney);
			// 			delCookie("PayType");
			// 	        delCookie("orderId");
			// 			var Domain = getCookie("Domain");
			// 			location.assign(Domain +"/pay/payList")
			// 			// this.$router.push("/pay/payList");
			// 		}else {
			// 			Toast({
			// 				message: "付款单创建失败！",
			// 				position: 'top',
			// 				iconClass: 'fa fa-close',
			// 				duration: 3000
			// 			});
			// 		}
			// 	}else {
			// 		Toast({
			// 			message: res.Message,
			// 			position: 'top',
			// 			iconClass: 'fa fa-close',
			// 			duration: 3000
			// 		});
			// 	}
			//
			// })
        }
	},
    filters:{
  	  //时间格式化
  	  dateFormat:function(date) {
  		  if (date == undefined) {
  			 return "";
  		  }
  		  //moment.locale('en'); //日期格式汉化
  		  var localLocale = moment(date).utcOffset(480).format('YYYY-MM-DD');
  		  return localLocale;
  	  }
    }
}
</script>
<style lang="scss">
body{
	background-color: #eee;
}
.Fee{
	background-color: #eee;
    margin-bottom: 2.5rem;
	button{
		background-color: #ff6600;
		color: white;
		margin-top: 0.5rem;
		display: inline-block;
		width: 80%;
		margin-left: 10%;
        position: fixed;
        bottom: 0.3rem;
	}
	.disabled .el-upload--picture-card {
        display: none;
    }
	.RadioGroup{
		height: 1.2rem;
	    background-color: white;
	    line-height: 1.1rem;
	    text-align: center;
	}
	.PStructSelect{
		text-align: center;
        background-color: #eee;
		.el-input__inner{
			border: none;
    		background-color: #eee;
		}
		.el-select{
			width: 90% !important;
			text-align: center !important;
		}
	}
    .header{
        position: fixed;
        top: 0;
        height: 2rem;
        width: 100%;
        .TotalMoney{
            background-color: white;
            padding: 0.28rem 0.25rem;
            border-bottom: 1px solid #ccc;
            .color{
                background-color: #ff6600;
                color: white;
                padding: 0.1rem;
                font-size: 0.3rem;
                border-radius: 10%;
            }
        }
    }
    .FeeList{
        margin-top: 2rem;
        li{
            display: inline-block;
            width: 100%;
            background-color: white;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            padding-bottom: 0.3rem;
            .checkboxLeft{
                text-align: center;
                padding-top: 7%;
            }
            .el-icon-success{
                color: rgba(186, 186, 186, 0.37);
                font-size: 0.6rem;
            }
            .el-icon-success.selected{
                color: #ff6600 !important;
            }
            .TotalDateMoney{
                padding-top: 0.2rem;
            }
        }
    }


}


</style>
