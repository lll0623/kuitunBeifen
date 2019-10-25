<template>
<div class="index-wrapper">
	<div id="container" class="AddWithWizard">
		<mt-search
	    	autofocus
	    	v-model="value"
	    	:result="filterResult">
    	</mt-search>
        <el-breadcrumb separator="/">
            <i class="fa fa-home fl" @click="QueryPropertyList()"></i>
			<!-- <a href="#" v-for="(item,index) in breadcrumbs" :key="index" @click="CheckPS(item.id,item.type,item.name)">
				<el-breadcrumb-item>
					{{ item.name }}
				</el-breadcrumb-item>
			</a> -->
			<el-breadcrumb-item>
				{{ breadcrumbs }}
			</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="minePStruct">
            <ul class="listItem" v-show="show1">
				<div v-for="(item,index) in options" :key="index">
					<li @click="CheckPS(item.PStructId,item.PStructType,item.PStructName)">
						{{ item.PStructName }}<i class="fa fa-angle-right fr"></i>
					</li>
				</div>
			</ul>

            <div class="checkPhone" v-show="show2_1">
				<p>请补全此房屋业主的预留手机号码</p>
                <div class="phone">
                    <input type="text" name="" maxlength="1" readonly v-model="phone1">
                    <input type="text" name="" maxlength="1" readonly v-model="phone2">
                    <input type="text" name="" maxlength="1" readonly v-model="phone3">
                    <input type="text" name="" maxlength="1" v-model="phone4" @keyup="focues(4)" v-focus="focusState4">
                    <input type="text" name="" maxlength="1" v-model="phone5" @keyup="focues(5)" v-focus="focusState5">
                    <input type="text" name="" maxlength="1" v-model="phone6" @keyup="focues(6)" v-focus="focusState6">
                    <input type="text" name="" maxlength="1" v-model="phone7" @keyup="focues(7)" v-focus="focusState7">
                    <input type="text" name="" maxlength="1" readonly v-model="phone8">
                    <input type="text" name="" maxlength="1" readonly v-model="phone9">
                    <input type="text" name="" maxlength="1" readonly v-model="phone10">
                    <input type="text" name="" maxlength="1" readonly v-model="phone11">
                </div>
				<button class="mint-button mint-button--default mint-button--large" v-no-more-click @click="submit()">
					 <label class="mint-button-text">提交</label>
				 </button>
            </div>

			<div class="checkPhone" v-show="show2_2">
                <p>请补全此房屋业主的预留身份证号码</p>
                <div class="phone" style="text-align:center">
					<div class="inline">
						<input type="text" name="" maxlength="1" readonly v-model="card1">
	                    <input type="text" name="" maxlength="1" readonly v-model="card2">
	                    <input type="text" name="" maxlength="1" readonly v-model="card3">
	                    <input type="text" name="" maxlength="1" readonly v-model="card4">
	                    <input type="text" name="" maxlength="1" readonly v-model="card5">
	                    <input type="text" name="" maxlength="1" readonly v-model="card6">
					</div>
					<div class="inline">
						<input type="text" name="" maxlength="1" v-model="card7" @keyup="focues2(7)" v-focus="focusStateCard7">
	                    <input type="text" name="" maxlength="1" v-model="card8" @keyup="focues2(8)" v-focus="focusStateCard8">
	                    <input type="text" name="" maxlength="1" v-model="card9" @keyup="focues2(9)" v-focus="focusStateCard9">
	                    <input type="text" name="" maxlength="1" v-model="card10" @keyup="focues2(10)" v-focus="focusStateCard10">
						<input type="text" name="" maxlength="1" v-model="card11" @keyup="focues2(11)" v-focus="focusStateCard11">
						<input type="text" name="" maxlength="1" v-model="card12" @keyup="focues2(12)" v-focus="focusStateCard12">
						<input type="text" name="" maxlength="1" v-model="card13" @keyup="focues2(13)" v-focus="focusStateCard13">
						<input type="text" name="" maxlength="1" v-model="card14" @keyup="focues2(14)" v-focus="focusStateCard14">
					</div>
					<div class="inline">
						<input type="text" name="" maxlength="1" readonly v-model="card15">
						<input type="text" name="" maxlength="1" readonly v-model="card16">
						<input type="text" name="" maxlength="1" readonly v-model="card17">
						<input type="text" name="" maxlength="1" readonly v-model="card18">
					</div>
                </div>
				<button class="mint-button mint-button--default mint-button--large" v-no-more-click @click="submit()">
					 <label class="mint-button-text">提交</label>
				</button>
            </div>

			<div class="checkName" v-show="show2_3">
				<p>请输入此房屋业主的预留名称</p>
				<div class="phone">
                    <input type="text" name="" v-model="custName">
                </div>
				<button class="mint-button mint-button--default mint-button--large" v-no-more-click @click="submit()">
					 <label class="mint-button-text">提交</label>
				</button>
			</div>

			<div class="checkPhone" v-show="show3">
				<p>请选择手机号，业主名称，身份证号码获取房间</p>
				<div class="RadioGroup">
					<el-radio v-model="radio" label="1">手机号</el-radio>
					<el-radio v-model="radio" label="2">身份证号</el-radio>
					<!-- 业主名称搜索暂时隐藏 -->
		 			<!-- <el-radio v-model="radio" label="3">业主名称</el-radio> -->
				</div>
				<button class="mint-button mint-button--default mint-button--large" v-no-more-click @click="subCheck3()">
					 <label class="mint-button-text">确定</label>
				 </button>
			</div>
        </div>
	</div>
</div>
</template>
<script type="es6">
import md5 from 'js-md5'
import { queryPropertyList,addPubRoomRelaByPhone,addPubRoomRelaByCustName,addPubRoomRelaByIdCard,getRoomCurrentRenterInfo } from '../../api/api.js'
import { Toast,Field,DatetimePicker,Search,MessageBox  } from 'mint-ui'
import { isNull,stringSort } from '../../util'
import moment from 'moment'
export default {
	data() {
		return {
			value: '',
			PStructId:"",
			PStructType:1,
			breadcrumbs:"全部", // 面包屑
			options:[], // 房产数据
            show1:true,
			show2_1:false,
			show2_2:false,
			show2_3:false,
            show3:false,
			radio: '1',
			phone1:"",
            phone2:"",
            phone3:"",
            phone4:"",
            phone5:"",
            phone6:"",
            phone7:"",
            phone8:"",
            phone9:"",
            phone10:"",
            phone11:"",
			focusState4:true,
			focusState5:false,
			focusState6:false,
			focusState7:false,
			card1:"",
			card2:"",
			card3:"",
			card4:"",
			card5:"",
			card6:"",
			card7:"",
			card8:"",
			card9:"",
			card10:"",
			card11:"",
			card12:"",
			card13:"",
			card14:"",
			card15:"",
			card16:"",
			card17:"",
			card18:"",
			focusStateCard7:true,
			focusStateCard8:false,
			focusStateCard9:false,
			focusStateCard10:false,
			focusStateCard11:false,
			focusStateCard12:false,
			focusStateCard13:false,
			focusStateCard14:false,
			custName:"",
			pStructId:""
		}
	},
	directives: {	 
		focus: {	 
	        update: function (el, value) {	       
	            if (value.value) {	 
	                 el.focus();	 
	            }
  	        }
		},
		focues2:{
			update: function (el, value) {	       
	   	            if (value.value) {	 
	   	                 el.focus();	 
	   	            }
 	        }
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "添加绑定房产";
			//document.body.style.backgroundColor = 'white'
		})
	},
	mounted() {
		this.QueryPropertyList();
	},
	computed: {
    filterResult() {
		if(this.value != ""){
			console.log(this.value)
			if(this.PStructType == 1){
				var parm = {
					type:this.PStructType,
					name:this.value
				}
			}else{
				var parm = {
					type:this.PStructType,
					name:this.value,
					parentId:this.PStructId
				}
			}
			queryPropertyList(parm).then(res =>{
				if(res.Status == 200){
					this.options = stringSort(res.Data,"PStructName",true);

				}else {
					Toast({
						message: res.Message,
						position: 'top',
						iconClass: 'fa fa-warning',
						duration: 3000
					});
				}
			})
		}else {
			if(this.PStructType >1 && this.PStructType <5){
				var parm = {
					type:this.PStructType +1,
					parentId:this.PStructId
				}
				queryPropertyList(parm).then(res =>{
					if(res.Status == 200){
						this.options = stringSort(res.Data,"PStructName",true);

					}else {
						Toast({
							message: res.Message,
							position: 'top',
							iconClass: 'fa fa-warning',
							duration: 3000
						});
					}
				})
			}
		}
    }
},
	methods: {
		QueryPropertyList(){
			this.show1 = true;
			this.show2_1= false;
			this.show2_2= false;
			this.show2_3= false;
			this.show3= false;
			this.PStructType = 1;
			this.PStructId = "";
			var parm = {
				type:1
			}
			queryPropertyList(parm).then(res =>{
				if(res.Status == 200){
					this.options = stringSort(res.Data,"PStructName",true);
					this.breadcrumbs = "全部";
				}else {
					Toast({
						message: res.Message,
						position: 'top',
						iconClass: 'fa fa-warning',
						duration: 3000
					});
				}
			})
		},
		CheckPS(parentId,type,name) {
			this.PStructType = type;
			this.PStructId = parentId;
			this.breadcrumbs = name; // 面包屑赋值
			type = Number(type) +1;
			if(type < 6){
				var parm = {
					type:type,
					parentId :parentId
				}
				queryPropertyList(parm).then(res =>{
					if(res.Status == 200){
						this.options = stringSort(res.Data,"PStructName",true);
					}else {
						Toast({
							message: res.Message,
							position: 'top',
							iconClass: 'fa fa-warning',
							duration: 3000
						});
					}
				})
				this.show1 = true;
				this.show2_1= false;
				this.show2_2= false;
				this.show2_3= false;
				this.show3= false;
			}
			if(type == "6"){
				this.pStructId = parentId;
				this.show1 = false;
				this.show2_1= false;
				this.show2_2= false;
				this.show2_3= false;
				this.show3 = true;
			}
		},
		subCheck3() {
			var parm = {
				type:parseInt(this.radio),
				pStructId: this.pStructId
			}
			if(this.radio == 3){
				this.show1 = false;
				this.show3 = false;
				this.show2_1 = false;
				this.show2_2 = false;
				this.show2_3 = true;
			}else {
				getRoomCurrentRenterInfo(parm).then(res =>{
					if(res.Status == 200){
						console.log(res);
						if(this.radio == "1" && (res.Data == "" || res.Data.length !== 11)){
							Toast({
								message: "该房间未设置手机号码或不正确，请到服务中心更新后再使用该功能!",
								position: 'top',
								iconClass: 'fa fa-warning',
								duration: 1500
							});
							return;
						}
						if(this.radio == "2" && (res.Data == "" || res.Data.length !== 18)){
							Toast({
								message: "该房间未设置身份证号码或不正确，请到服务中心更新后再使用该功能!",
								position: 'top',
								iconClass: 'fa fa-warning',
								duration: 1500
							});
							return;
						}
						this.show1 = false;
						this.show3 = false;
						if(this.radio == "1"){
							this.show2_1 = true;
							this.show2_2 = false;
							this.show2_3 = false;
							this.phone1 = res.Data.substr(0, 1);
							this.phone2 = res.Data.substr(1, 1);
							this.phone3 = res.Data.substr(2, 1);
							this.phone4 = "";
							this.phone5 = "";
							this.phone6 = "";
							this.phone7 = "";
							this.phone8 = res.Data.substr(7, 1);
							this.phone9 = res.Data.substr(8, 1);
							this.phone10 = res.Data.substr(9, 1);
							this.phone11 = res.Data.substr(10, 1);
						}else {
							this.show2_1 = false;
							this.show2_2 = true;
							this.show2_3 = false;
							this.card1 = res.Data.substr(0, 1),
							this.card2 = res.Data.substr(1, 1),
							this.card3 = res.Data.substr(2, 1),
							this.card4 = res.Data.substr(3, 1),
							this.card5 = res.Data.substr(4, 1),
							this.card6 = res.Data.substr(5, 1),
							this.card7 = "",
							this.card8 = "",
							this.card9 = "",
							this.card10 = "",
							this.card11 = "",
							this.card12 = "",
							this.card13 = "",
							this.card14 = "",
							this.card15 = res.Data.substr(14, 1),
							this.card16 = res.Data.substr(15, 1),
							this.card17 = res.Data.substr(16, 1),
							this.card18 = res.Data.substr(17, 1)
						}
					}else {
                        MessageBox.confirm('是否通过人工审核绑定房产？', res.Message, {
                            showConfirmButton: true,
                            confirmButtonText:'确定',
                            showCancelButton: true,
                            cancelButtonText:'取消'
                        }).then(() => {
                            this.$router.push("/addwithArtificial?name="+this.breadcrumbs+"&id="+this.pStructId+"");
                        }).catch(() => {
                            Toast({
                                message: "已取消",
                                position: 'top',
                                duration: 3000
                            });
                            this.QueryPropertyList();
                            this.show1 = true;
                            this.show2 = false;
                            this.show3 = false;
                        });
					}
				})
			}
		},
		submit() {
			if(this.radio == "1"){
				if(this.phone6 == '' || this.phone7 == "" || this.phone8 == "" || this.phone9 == ""){
					Toast({
						message: '请补全手机号码',
						position: 'top',
						duration: 3000
					});
					return;
				}
				var phoneNum = this.phone1 + this.phone2 + this.phone3 + this.phone4 + this.phone5 + this.phone6 + this.phone7 + this.phone8 + this.phone9 + this.phone10 + this.phone11
				var parm = {
					checkPhone:phoneNum,
					pStructId :this.pStructId
				}
				addPubRoomRelaByPhone(parm).then(res =>{
					console.log(res)
					if(res.Status == 200){
						this.$router.push('/mypstruct')
						Toast({
							message: '绑定成功！',
							position: 'middle',
							iconClass: 'fa fa-check',
							duration: 3000
						});
					}else {
						Toast({
							message: res.Message,
							position: 'top',
							iconClass: 'fa fa-close',
							duration: 3000
						});
					}
				})
			}else if (this.radio == "3") {
				if(this.custName == ''){
					Toast({
						message: '请输入业主名称',
						position: 'top',
						duration: 3000
					});
					return;
				}
				var parm = {
					custName:this.custName,
					pStructId :this.pStructId
				}
				addPubRoomRelaByCustName(parm).then(res =>{
					if(res.Status == 200){
						this.$router.push('/mypstruct')
						Toast({
							message: '绑定成功！',
							position: 'middle',
							iconClass: 'fa fa-check',
							duration: 3000
						});
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
				if(this.card7 == '' || this.card8 == "" || this.card9 == "" || this.card10 == ""|| this.card11 == ""|| this.card12 == ""|| this.card13 == ""|| this.card14 == ""){
					Toast({
						message: '请补全身份证号码',
						position: 'top',
						duration: 3000
					});
					return;
				}
				var idCardNum = this.card1 + this.card2 + this.card3 + this.card4 + this.card5 + this.card6 + this.card7 + this.card8 + this.card9 + this.card10
								 + this.card11 + this.card12 + this.card13 + this.card14 + this.card15 + this.card16 + this.card17 + this.card18;
				var parm = {
					idCard:idCardNum,
					pStructId :this.pStructId
				}
				addPubRoomRelaByIdCard(parm).then(res =>{
					console.log(res)
					if(res.Status == 200){
						this.$router.push('/mypstruct')
						Toast({
							message: '绑定成功！',
							position: 'middle',
							iconClass: 'fa fa-check',
							duration: 3000
						});
					}else {
						Toast({
							message: res.Message,
							position: 'top',
							iconClass: 'fa fa-close',
							duration: 3000
						});
					}
				})
			}
		},
        focues(num) {
			console.log(num)
			switch (num) {
				case 4:
				if((this.phone4 + "").length >0){
					this.focusState4 = false;
					this.focusState5 = true;
					this.focusState6 = false;
					this.focusState7 = false;
				}
				this.focusState4 = false;
				this.focusState6 = false;
				this.focusState7 = false;
					break;
				case 5:
				if((this.phone5 + "").length >0){
					this.focusState4 = false;
					this.focusState5 = false;
					this.focusState6 = true;
					this.focusState7 = false;
				}
				this.focusState4 = false;
				this.focusState5 = false;
				this.focusState7 = false;
					break;
				case 6:
				if((this.phone6 + "").length >0){
					this.focusState4 = false;
					this.focusState5 = false;
					this.focusState6 = false;
					this.focusState7 = true;
				}
				this.focusState4 = false;
				this.focusState5 = false;
				this.focusState6 = false;
		            break;
				case 7:
				this.focusState4 = false;
				this.focusState5 = false;
				this.focusState6 = false;
				this.focusState7 = false;
					break;
				default:
			}
        },
		focues2(num) {
			console.log(num)
			switch (num) {
				case 7:
				if((this.card7 + "").length >0){
					this.focusStateCard7 = false;
					this.focusStateCard8 = true;
					this.focusStateCard9 = false;
					this.focusStateCard10 = false;
					this.focusStateCard11 = false;
					this.focusStateCard12 = false;
					this.focusStateCard13 = false;
					this.focusStateCard14 = false;
				}
				this.focusStateCard7 = false;
				this.focusStateCard9 = false;
				this.focusStateCard10 = false;
				this.focusStateCard11 = false;
				this.focusStateCard12 = false;
				this.focusStateCard13 = false;
				this.focusStateCard14 = false;
					break;
				case 8:
				if((this.card8 + "").length >0){
					this.focusStateCard7 = false;
					this.focusStateCard8 = false;
					this.focusStateCard9 = true;
					this.focusStateCard10 = false;
					this.focusStateCard11 = false;
					this.focusStateCard12 = false;
					this.focusStateCard13 = false;
					this.focusStateCard14 = false;
				}
				this.focusStateCard7 = false;
				this.focusStateCard8 = false;
				this.focusStateCard10 = false;
				this.focusStateCard11 = false;
				this.focusStateCard12 = false;
				this.focusStateCard13 = false;
				this.focusStateCard14 = false;
					break;
				case 9:
				if((this.card9 + "").length >0){
					this.focusStateCard7 = false;
					this.focusStateCard8 = false;
					this.focusStateCard9 = false;
					this.focusStateCard10 = true;
					this.focusStateCard11 = false;
					this.focusStateCard12 = false;
					this.focusStateCard13 = false;
					this.focusStateCard14 = false;
				}
				this.focusStateCard7 = false;
				this.focusStateCard8 = false;
				this.focusStateCard9 = false;
				this.focusStateCard11 = false;
				this.focusStateCard12 = false;
				this.focusStateCard13 = false;
				this.focusStateCard14 = false;
		            break;
				case 10:
				if((this.card10 + "").length >0){
					this.focusStateCard7 = false;
					this.focusStateCard8 = false;
					this.focusStateCard9 = false;
					this.focusStateCard10 = false;
					this.focusStateCard11 = true;
					this.focusStateCard12 = false;
					this.focusStateCard13 = false;
					this.focusStateCard14 = false;
				}
				this.focusStateCard7 = false;
				this.focusStateCard8 = false;
				this.focusStateCard9 = false;
				this.focusStateCard10 = false;
				this.focusStateCard12 = false;
				this.focusStateCard13 = false;
				this.focusStateCard14 = false;
		            break;
				case 11:
				if((this.card11 + "").length >0){
					this.focusStateCard7 = false;
					this.focusStateCard8 = false;
					this.focusStateCard9 = false;
					this.focusStateCard10 = false;
					this.focusStateCard11 = false;
					this.focusStateCard12 = true;
					this.focusStateCard13 = false;
					this.focusStateCard14 = false;
				}
				this.focusStateCard7 = false;
				this.focusStateCard8 = false;
				this.focusStateCard9 = false;
				this.focusStateCard10 = false;
				this.focusStateCard11 = false;
				this.focusStateCard13 = false;
				this.focusStateCard14 = false;
		            break;
				case 12:
				if((this.card12 + "").length >0){
					this.focusStateCard7 = false;
					this.focusStateCard8 = false;
					this.focusStateCard9 = false;
					this.focusStateCard10 = false;
					this.focusStateCard11 = false;
					this.focusStateCard12 = false;
					this.focusStateCard13 = true;
					this.focusStateCard14 = false;
				}
				this.focusStateCard7 = false;
				this.focusStateCard8 = false;
				this.focusStateCard9 = false;
				this.focusStateCard10 = false;
				this.focusStateCard11 = false;
				this.focusStateCard12 = false;
				this.focusStateCard14 = false;
		            break;
				case 13:
				if((this.card13 + "").length >0){
					this.focusStateCard7 = false;
					this.focusStateCard8 = false;
					this.focusStateCard9 = false;
					this.focusStateCard10 = false;
					this.focusStateCard11 = false;
					this.focusStateCard12 = false;
					this.focusStateCard13 = false;
					this.focusStateCard14 = true;
				}
				this.focusStateCard7 = false;
				this.focusStateCard8 = false;
				this.focusStateCard9 = false;
				this.focusStateCard10 = false;
				this.focusStateCard11 = false;
				this.focusStateCard12 = false;
				this.focusStateCard13 = false;
		            break;
				case 14:
				this.focusStateCard7 = false;
				this.focusStateCard8 = false;
				this.focusStateCard9 = false;
				this.focusStateCard10 = false;
				this.focusStateCard11 = false;
				this.focusStateCard12 = false;
				this.focusStateCard13 = false;
				this.focusStateCard14 = false;
					break;
				default:
			}
        }
	},
	created() {

	},
}
</script>
<style lang="scss">
body {
    background: white
    ;
}
.AddWithWizard{
	.mint-search-list{
		display: none;
	}
    .el-breadcrumb {
        padding: 0.5rem 0.2rem 0.5rem 0.2rem;
        border-bottom: 1px solid #ccc;
		line-height: 0.6rem;
		font-size: 0.4rem;
		i{
			margin-right: 10px;
		    font-size: 0.5rem;
		}
		.el-breadcrumb__separator {
		    margin: 0 3px;
		}
    }
	.mint-search{
		height: auto;
	}
	.minePStruct{
		.listItem {
			color: #333;
			li{
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
	.checkPhone{
		padding: 0.5rem;
		text-align: center;
		.phone{
			margin-top: 0.5rem;
			input{
				float: left;
				border: 1px solid #ddd;
				width: 0.5rem;
				height: 0.5rem;
				padding: 0.1rem;
				margin-right: 0.05rem;
				text-align: center;
				color: #ff6600;
			}
			input[readonly]{
				background-color: #ddd;
				color: black;
			}
		}
		.RadioGroup{
			margin: 0.4rem 0 0 0;
		}
		button{
			background-color: #ff6600;
			color: white;
			margin-top: 0.5rem;
			display: inline-block;
		}
	}
	.checkName{
		padding: 0.5rem;
		display: inline-block;
		width: calc(100% - 1rem);
		text-align: center;
		input{
			margin: 0.5rem 0rem;
			border: 1px solid #ddd;
			height: 0.7rem;
		}
		button{
			background-color: #ff6600;
			color: white;
			display: inline-block;
		}
	}
}
</style>
