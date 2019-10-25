<template>
<div class="index-wrapper">
	<div id="container" class="addWithPhoneID">
        <div class="minePStruct">
			<p style="padding: 0.5rem 0.1rem 0rem;font-size: 0.5rem;color:#009688;" class="tc">{{ PStructNmae }}</p>
            <div class="checkPhone" v-show="show2_1">
				<p>请补全此房屋业主的预留手机号码</p>
                <div class="phone">
                    <input type="text" name="" maxlength="1" readonly v-model="phone1">
                    <input type="text" name="" maxlength="1" readonly v-model="phone2">
                    <input type="text" name="" maxlength="1" readonly v-model="phone3">
                    <input type="text" name="" maxlength="1" v-model="phone4" @keyup.delete.prevent="deleteFun($event,4)" @keyup="focues(4)" v-focus="focusState4">
                    <input type="text" name="" maxlength="1" v-model="phone5" @keyup.delete.prevent="deleteFun($event,5)" @keyup="focues(5)" v-focus="focusState5">
                    <input type="text" name="" maxlength="1" v-model="phone6" @keyup.delete.prevent="deleteFun($event,6)" @keyup="focues(6)" v-focus="focusState6">
                    <input type="text" name="" maxlength="1" v-model="phone7" @keyup.delete.prevent="deleteFun($event,7)" @keyup="focues(7)" v-focus="focusState7">
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
        </div>
	</div>
</div>
</template>
<script type="es6">
import md5 from 'js-md5'
import { queryPropertyList,addPubRoomRelaByPhone,addPubRoomRelaByIdCard,getRoomCurrentRenterInfo } from '../../api/api.js'
import { Toast,Field,DatetimePicker,Search,MessageBox  } from 'mint-ui'
import { isNull,stringSort } from '../../util'
import moment from 'moment'
export default {
	data() {
		return {
			Code:"",
			PStructNmae:"",
			PStructId:"",
			show2_1:false,
			show2_2:false,
			show2_3:false,
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
			window.document.title = "补全手机/身份证绑定";
			vm.PStructNmae = !!vm.$route.query.name ? unescape(vm.$route.query.name) : "";
			vm.PStructId = !!vm.$route.query.id ? unescape(vm.$route.query.id) : "";
			vm.Code = !!vm.$route.query.code ? unescape(vm.$route.query.code) : "";
			if(vm.Code.length == "11"){
				vm.show2_1 = true;
			}
			if(vm.Code.length == "18") {
				vm.show2_2 = true;
			}
			vm.AssignmentCode();
		})
	},
	mounted() {

	},
	methods: {
		AssignmentCode(){  // 赋值
			if(this.Code.length == "11"){
				this.phone1 = this.Code.substr(0, 1);
				this.phone2 = this.Code.substr(1, 1);
				this.phone3 = this.Code.substr(2, 1);
				this.phone4 = "";
				this.phone5 = "";
				this.phone6 = "";
				this.phone7 = "";
				this.phone8 = this.Code.substr(7, 1);
				this.phone9 = this.Code.substr(8, 1);
				this.phone10 = this.Code.substr(9, 1);
				this.phone11 = this.Code.substr(10, 1);
			}
			if(this.Code.length == "18"){
				this.card1 = this.Code.substr(0, 1),
				this.card2 = this.Code.substr(1, 1),
				this.card3 = this.Code.substr(2, 1),
				this.card4 = this.Code.substr(3, 1),
				this.card5 = this.Code.substr(4, 1),
				this.card6 = this.Code.substr(5, 1),
				this.card7 = "",
				this.card8 = "",
				this.card9 = "",
				this.card10 = "",
				this.card11 = "",
				this.card12 = "",
				this.card13 = "",
				this.card14 = "",
				this.card15 = this.Code.substr(14, 1),
				this.card16 = this.Code.substr(15, 1),
				this.card17 = this.Code.substr(16, 1),
				this.card18 = this.Code.substr(17, 1)
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
					PStructId :this.PStructId
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
					PStructId :this.PStructId
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
		deleteFun(e,num){
			switch (num) {
				case 5:
				console.log(e.target.value)
					if (e.target.value) {
			          	e.target.value = '';
			        }else {
						this.focusState4 = true;
			        }
					break;
				case 6:
					if (e.target.value) {
			          	e.target.value = '';
			        }else {
						this.focusState5 = true;
			        }
					break;
				case 7:
					if (e.target.value) {
			          	e.target.value = '';
			        }else {
						this.focusState6 = true;
			        }
					break;
				default:

			}
		},
        focues(num) {
			// console.log(num)
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
				// this.focusState4 = false;
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
				// this.focusState5 = false;
				this.focusState6 = false;
		            break;
				case 7:
				this.focusState4 = false;
				this.focusState5 = false;
				// this.focusState6 = false;
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
    background: white;
}
.addWithPhoneID{
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
