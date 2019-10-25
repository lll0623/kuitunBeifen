<template>
    <div class="">
        <p>请补全此房屋业主的预留手机号码</p>
        <div class="phone">
            <input type="text" name="" maxlength="1" v-model="phone1">
            <input type="text" name="" maxlength="1" v-model="phone2">
            <input type="text" name="" maxlength="1" v-model="phone3">
            <input type="text" name="" maxlength="1" v-model="phone4" @keyup="focues(4)" v-focus="focusState4">
            <input type="text" name="" maxlength="1" v-model="phone5" @keyup="focues(5)" v-focus="focusState5">
            <input type="text" name="" maxlength="1" v-model="phone6" @keyup="focues(6)" v-focus="focusState6">
            <input type="text" name="" maxlength="1" v-model="phone7" @keyup="focues(7)" v-focus="focusState7">
            <input type="text" name="" maxlength="1" v-model="phone8">
            <input type="text" name="" maxlength="1" v-model="phone9">
            <input type="text" name="" maxlength="1" v-model="phone10">
            <input type="text" name="" maxlength="1" v-model="phone11">
        </div>
        <button class="mint-button mint-button--default mint-button--large" @click="submit()">
             <label class="mint-button-text">提交</label>
         </button>
    </div>
</template>
<script>
    export default {
        props: {
            data:String
        },
        data() {
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
			focusState7:false
        },
        directives: {	 
    		focus: {	 
    	        update: function (el, value) {	       
    	            if (value.value) {	 
    	                 el.focus();	 
    	            }
      	        }
            }
    	},
        methods:{

        }
    }
</script>
