IDCard<template>
    <div class="index-wrapper">
        <div id="container" class="addwithArtificial">
            <mt-field label="手机号" class="imp" :readonly="readPhone" placeholder="请输入手机号" type="tel" v-model="Phone"></mt-field>
            <mt-field label="身份证" class="imp" :readonly="readIDCard" placeholder="请输入身份证号" type="text" v-model="IDCard"></mt-field>
            <mt-field label="业主姓名" class="" placeholder="请输入业主姓名" type="text" v-model="Name"></mt-field>
            <mt-field label="房产地址" class="imp" placeholder="请选择房产地址（点击）" v-on:click.native="openProp()" type="text" v-model="Address" :readonly="true"></mt-field>
            <mt-field label="申请材料" class="imp" type="text" :readonly="true"></mt-field>
            <div class="img">
                <ul class="listImg">
                    <li v-for="(item,index) in FlieList" :key="index">
                        <img :src="item.FileName" alt="" @click="handleView(item.FileName)"> <i class="el-icon-delete" @click="handleRemove(item.Id)"></i>
                    </li>
                    <li @click="addFile()" v-show="AddHide">
                        <div tabindex="0" class="el-upload el-upload--picture-card">
                            <i class="el-icon-plus"></i>
                        </div>
                    </li>
                </ul>
            </div>
            <p class="imgExplain">
                *需要上传合法的证明材料，需要能证明申请的身份证与房产存在关系。如房产证、物业缴费证明等。
            </p>
            <button class="mint-button mint-button--default mint-button--large" v-no-more-click @click="submit()">
                <label class="mint-button-text">提交</label>
            </button>
            <mt-popup style="width:100%;height:100%;"
                      v-model="popupVisible"
                      position="right">
                <mt-search
                        autofocus
                        v-model="filterValue"
                        :result="filterResult">
                </mt-search>
                <el-breadcrumb separator="/">
                    <i class="fa fa-home fl" @click="QueryPropertyList()"></i>
                    <el-breadcrumb-item>
                        {{ breadcrumbs }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <div class="minePStruct">
                    <ul class="listItem">
                        <div v-for="(item,index) in options" :key="index">
                            <li @click="CheckPS(item.PStructId,item.PStructType,item.PStructName)">
                                {{ item.PStructName }}<i class="fa fa-angle-right fr"></i>
                            </li>
                        </div>
                    </ul>
                </div>
                <button class="mint-button close mint-button--default mint-button--large" @click="popupVisible=false">
                    <label class="mint-button-text">关闭</label></button>
                <button class="mint-button save mint-button--default mint-button--large" v-no-more-click @click="saveFj()">
                    <label class="mint-button-text">确定</label>
                </button>
            </mt-popup>
            
            <div class="mint-msgbox-wrapper" v-show="isYanZhenModel" style="position: absolute; z-index: 2003;">
                <div class="mint-msgbox" style="">
                    <div class="mint-msgbox-header">
                        <div class="mint-msgbox-title">请先验证手机号</div>
                    </div>
                    <div class="mint-msgbox-content">
                        <div class="mint-msgbox-message">
                            <div class="height50">
                                <div class="titleFormat fl">
                                    <i class="fa fa-key" aria-hidden="true"></i>
                                </div>
                                <div class="textFormat">
                                    <div class="rel" style="height:100%">
                                        <input class="fl" type="number" v-model="ContactVerifyCode" placeholder="请输入手机验证码" style="height: 100%;">
                                        <button  type="primary" size="small" :disabled="disabled" @click="sendcode" class="fr vaiclCode">{{ getBtnTxt }}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mint-msgbox-input" style="display: none;">
                            <input placeholder="" type="text">
                            <div class="mint-msgbox-errormsg" style="visibility: hidden;"></div>
                        </div>
                    </div>
                    <div class="mint-msgbox-btns">
                        <a class="mint-msgbox-btn mint-msgbox-cancel tc" style="color:#333;" @click="isYanZhenModel=false">取消</a>
                        <a class="mint-msgbox-btn mint-msgbox-confirm tc"  @click="submit2()">确定</a>
                    </div>
                </div>
            </div>
            <div class="v-modal" v-show="isYanZhenModel" style="z-index: 2002;"></div>
        </div>
    </div>
</template>
<script type="es6">
    //util
    import {setCookie,getCookie,delCookie} from '../../util'
    import {
        getLoginVaildateCode, // 验证码
        roomBindingApply, // 房间绑定申请
        getRoomCurrentRenterInfo, // 判断房间是否有手机号和身份证
        queryPropertyList,
        getAccessToken,
        getWxConf,
        saveFileByServerId,
        getSignature } from '../../api/api.js'
    import defaultImg from '../../assets/images/room_default.jpg'
    import { isNull,stringSort  } from '../../util'
    import { Cell,MessageBox,Indicator,Toast,Loadmore } from 'mint-ui'
    import wx from 'weixin-js-sdk'
    export default {
        components: {
            "v-loadmore": Loadmore
        },
        data() {
            return {
                filterValue: '',
                Phone:"",
                readPhone:false,
                ContactVerifyCode:'', // 输入的验证码
                getBtnTxt:'获取验证码',
                disabled:false,
                SMCode:'',//获取的验证码
                time: 0,
                IDCard:"",
                readIDCard:false,
                Name:unescape(getCookie("UserName")),
                Address:"",
                FlieList:[],  // 上传的图片列表
                AddHide:true,
                options:[], // 房产数据
                PStructType:1,
                breadcrumbs:"全部", // 面包屑
                PStructId:"",
                popupVisible:false, // 选择房产的弹出层
                isYanZhenModel:false,
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                window.document.title = "人工申请";
                document.body.style.backgroundColor = '#eee';
                if(getCookie("Phone")){
                    vm.Phone = getCookie("Phone");
                }
                if(vm.$route.query.name && vm.$route.query.id){
                    vm.Address = vm.$route.query.name;
                    vm.PStructId = vm.$route.query.id;
                    vm.PStructType = 6;
                }
                if(vm.$route.query.type == "1"){
                    vm.Phone = vm.$route.query.code;
                    vm.readPhone = true;
                }
                if(vm.$route.query.type == "2") {
                    vm.readIDCard = true;
                    vm.IDCard = vm.$route.query.code;
                }
            })
        },
        mounted() {
            getWxConf({}).then(res =>{
                if(res.Status == 200){
                    setCookie("ImageDomain",res.Data.ImageDomain);
                    setCookie("Domain",res.Data.Domain);

                }else {
                    Toast({
                        message: res.Message,
                        position: 'top',
                        iconClass: 'fa fa-close',
                        duration: 3000
                    });
                }
            })
            getAccessToken({}).then(res =>{
                if(res.Status == 200){
                    getSignature({url:window.location.href}).then(res =>{
                        wx.config({
                            debug: false,            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: res.Data.AppId,    // 必填，公众号的唯一标识
                            timestamp: res.Data.TimeSpan,  // 必填，生成签名的时间戳
                            nonceStr: res.Data.Noncestr, // 必填，生成签名的随机串
                            signature: res.Data.Signature,// 必填，签名
                            jsApiList: [ 'chooseImage', 'uploadImage'] // 必填，需要使用的JS接口列表
                        });
                        this.ready = true
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
            this.QueryPropertyList();
        },
        computed: {
            filterResult() {
                if(this.filterValue != ""){
                    //console.log(this.filterValue)
                    if(this.PStructType == 1){
                        let parm = {
                            type:this.PStructType,
                            name:this.filterValue
                        }
                    }else{
                        let parm = {
                            type:this.PStructType,
                            name:this.filterValue,
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
                }
                // else {
                // 	if(this.PStructType >1 && this.PStructType <5) {
                // 		console.log("shibushiui")
                // 		let parm = {
                // 			type:this.PStructType +1,
                // 			parentId:this.PStructId
                // 		}
                // 		queryPropertyList(parm).then(res =>{
                // 			if(res.Status == 200){
                // 				this.options = stringSort(res.Data,"PStructName",true);
                // 			}else {
                // 				Toast({
                // 					message: res.Message,
                // 					position: 'top',
                // 					iconClass: 'fa fa-warning',
                // 					duration: 3000
                // 				});
                // 			}
                // 		})
                // 	}
                // }
            }
        },
        methods: {
            openProp(){
                this.popupVisible = true;
            },
            QueryPropertyList(){
                this.PStructType = 1;
                this.PStructId = "";
                let parm = {
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
                this.PStructId = parentId;
                this.breadcrumbs = name; // 面包屑赋值
                type = Number(type) +1;
                if(type < 6){
                    let parm = {
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
                }
                this.PStructType = type;
                if(type == "6"){
                    this.PStructId = parentId;
                    this.GetRoomCurrentRenterInfo(1,this.PStructId); // 判断是否有手机号
                }
            },
            saveFj(){
                if(this.PStructType != 6){
                    Toast({
                        message: "请选择到房间！",
                        position: 'top',
                        iconClass: 'fa fa-close',
                        duration: 2000
                    });
                    return;
                }
                this.Address = this.breadcrumbs;
                this.popupVisible = false;
            },
            sendcode() {
                let params = {
                    phone: this.Phone
                }
                getLoginVaildateCode(params).then((response) => {
                    let errorText = response.Message;
                    switch (response.Status) {
                        case 200:
                            if(response.Data.Code == 400) {
                                Toast({
                                    message: response.Data.Message,
                                    position: 'middle',
                                    iconClass: 'fa fa-check',
                                    duration: 3000
                                });
                                this.time = 0;
                                this.getBtnTxt = "获取验证码";
                                this.disabled = false;
                                setTimeout(function(){
                                    that.$router.push('/registration')
                                },3000);
                            }else{
                                Toast({
                                    message: '短信验证码发送成功，请注意查收！',
                                    position: 'middle',
                                    iconClass: 'fa fa-check',
                                    duration: 3000
                                });
                                this.time = 60;
                                this.disabled = true;
                                this.timer();
                            }
                            break;
                        case 500:
                            Toast({
                                message: errorText,
                                position: 'top',
                                duration: 3000
                            });
                            this.time = 0;
                            this.getBtnTxt = "获取验证码";
                            this.disabled = false;
                            break;
                        default:
                            Toast({
                                message: '短信验证码发送失败！',
                                position: 'middle',
                                iconClass: 'fa fa-close',
                                duration: 3000
                            });
                            this.time = 0;
                            this.getBtnTxt = "获取验证码";
                            this.disabled = false;
                    }
                })
            },
            timer() {
                if (this.time > 0) {
                    this.time--;
                    this.getBtnTxt = this.time + "s后获取";
                    setTimeout(this.timer, 1000);
                } else {
                    this.time = 0;
                    this.getBtnTxt = "获取验证码";
                    this.disabled = false;
                }
            },
            addFile(){
                let that = this;
                if(this.ready){
                    console.log(wx);
                    wx.chooseImage({
                        count: 9, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function(res) {
                            console.log(res);
                            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            if (localIds.length > 4) {
                                Toast({
                                    message: "最多上传4张图片!",
                                    position: 'top',
                                    iconClass: 'fa fa-close',
                                    duration: 3000
                                });
                                return;
                            }
                            for (let i = 0; i < localIds.length; i++) {
                                wx.uploadImage({
                                    localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                                    isShowProgressTips: 1, // 默认为1，显示进度提示
                                    success: function(res) {
                                        console.log(res);
                                        that.wenzi = res.serverId;
                                        let serverId = res.serverId; // 返回图片的服务器端ID
                                        saveFileByServerId({mediaId:serverId,isOriginal:false}).then(res =>{
                                            let ImageDomain = ""
                                            if(getCookie("ImageDomain")){
                                                ImageDomain = getCookie("ImageDomain");
                                            }
                                            that.FlieList.push({
                                                FileName:ImageDomain+res.Data.ImgUrl,
                                                FileUrl:res.Data.ImgUrl,
                                                Id:res.Data.ServerId
                                            })
                                            if(that.FlieList.length >= 4){
                                                that.AddHide = false;
                                            }
                                        })
                                    }
                                });
                            }
                        }
                    });
                }
            },
            handleRemove(id) {
                try{
                    this.FlieList = this.FlieList.filter(u => id!= u.Id);
                    if(that.FlieList.length < 4){
                        that.AddHide = true;
                    }
                }catch(e){
                    console.log(e)
                }
            },
            handleView(file) {
                let array = [];
                array.push(file);
                wx.previewImage({
                    current: file, // 当前显示图片的http链接
                    urls: array // 需要预览的图片http链接列表
                });
            },
            submit(){
                let that = this;
                let reg = 11 && /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
                //let url="/nptOfficialWebsite/apply/sendSms?mobile="+this.registerForm.phone;
                if (this.Phone == '') {
                    Toast({
                        message: '请输入手机号码',
                        position: 'top',
                        duration: 3000
                    });
                    return;
                }
                if (!reg.test(this.Phone)) {
                    Toast({
                        message: '手机格式不正确',
                        position: 'top',
                        duration: 3000
                    });
                    return;
                }
                if(this.IDCard == ""){
                    Toast({
                        message: "请输入身份证号！",
                        position: 'top',
                        iconClass: 'fa fa-warning',
                        duration: 3000
                    });
                    return;
                }
                if(!this.checkCardIdFunc(this.IDCard)){
                    Toast({
                        message: "请输入正确的手机号或身份证号！",
                        position: 'top',
                        iconClass: 'fa fa-warning',
                        duration: 3000
                    });
                    return;
                }
                if(this.Name == ""){
                    Toast({
                        message: "请输入业主姓名！",
                        position: 'top',
                        iconClass: 'fa fa-warning',
                        duration: 3000
                    });
                    return;
                }
                if(this.PStructType != 6){
                    Toast({
                        message: "请选择房产地址！",
                        position: 'top',
                        iconClass: 'fa fa-warning',
                        duration: 3000
                    });
                    return;
                }
                if(this.FlieList.length == 0){
                    Toast({
                        message: "请上传申请材料！",
                        position: 'top',
                        iconClass: 'fa fa-warning',
                        duration: 3000
                    });
                    return;
                }
                this.isYanZhenModel = true;
            },
            submit2(){  // 弹出验证码的那个确定
                if(this.ContactVerifyCode !=""){
                    let parms = {
                        PubAccountId:getCookie("UserId"),
                        PStructId:this.PStructId,
                        Phone:this.Phone,
                        Name:this.Name,
                        IDCard:this.IDCard,
                        FlieList:this.FlieList,
                        ContactVerifyCode:this.ContactVerifyCode
                    }
                    roomBindingApply(parms).then( res=>{
                        if(res.Status == 200){
                            Toast({
                                message: "您的申请已提交，预计2~3个工作日受理！",
                                position: 'top',
                                iconClass: 'fa fa-check',
                                duration: 3000
                            });
                            setTimeout(() => {
                                this.$router.push("/index");
                            }, 3000)
                        }else {
                            Toast({
                                message: res.Message,
                                position: 'top',
                                iconClass: 'fa fa-close',
                                duration: 3000
                            });
                            this.ContactVerifyCode = "";
                            this.time = 0;
                            this.getBtnTxt = "获取验证码";
                            this.disabled = false;
                        }
                    })
                }else{
                    Toast({
                        message: "请输入验证码！",
                        position: 'top',
                        iconClass: 'fa fa-close',
                        duration: 3000
                    });
                }
            },
            GetRoomCurrentRenterInfo(radio,id){
                let parm = {
                    type:parseInt(radio),
                    pStructId: id
                }
                getRoomCurrentRenterInfo(parm).then(res =>{
                    if(res.Status == 200 && radio == 1){
                        if(!!res.Data && res.Data.length == "11"){
                            MessageBox.confirm('是否直接用已有的手机号绑定？', '当前房间已经有绑定的手机号！', {
                                showConfirmButton: true,
                                confirmButtonText:'确定',
                                showCancelButton: true,
                                cancelButtonText:'取消'
                            }).then(() => {
                                // this.$router.push("/addWithPhoneID?code="+res.Data+"");
                                this.$router.push({
                                    path: '/addWithPhoneID',
                                    query: {
                                        code: res.Data,
                                        name: this.breadcrumbs,
                                        id:id
                                    }
                                })
                            }).catch(() => {
                                Toast({
                                    message: "已取消",
                                    position: 'top',
                                    duration: 3000
                                });
                            });
                        }else {
                            this.GetRoomCurrentRenterInfo(2,id);
                        }
                    }
                    else if (res.Status == 200 && radio == 2) {
                        if(!!res.Data && res.Data.length == "18"){
                            MessageBox.confirm('当前房间已经有绑定的身份证号！', '是否直接用已有的身份证号绑定？', {
                                showConfirmButton: true,
                                confirmButtonText:'确定',
                                showCancelButton: true,
                                cancelButtonText:'取消'
                            }).then(() => {
                                // this.$router.push("/addWithPhoneID?code="+res.Data+"");
                                this.$router.push({
                                    path: '/addWithPhoneID',
                                    query: {
                                        code: res.Data,
                                        name: this.breadcrumbs,
                                        id:id
                                    }
                                })
                            }).catch(() => {
                                Toast({
                                    message: "已取消",
                                    position: 'top',
                                    duration: 3000
                                });
                            });
                        }else {
                            return "";
                        }
                    }
                    else {
                        return "";
                    }
                })
            },
            //身份证补全验证
            checkCardIdFunc(value){
                let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                let city = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江 ",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北 ",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏 ",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外 "
                };
                if (reg.test(value) === false || !city[value.substr(0, 2)]) {
                    return false;
                }else{
                    return true;
                }
            },
        }
    }
</script>
<style lang="scss">
    body{
        background-color: #eee;
    }
    .addwithArtificial{
        background-color: #eee;
        .mint-cell-text{
            padding-left: 0.2rem;
            font-size: 0.4rem;
        }
        .imp{
            .mint-cell-text{
                padding-left: 0.2rem;
                font-size: 0.4rem;
            }
            .mint-cell-text:before{
                content: "*";
                position: absolute;
                font-size: 16px;
                color: red;
                left: 6px;
                top: 19px;
            }
        }
        .img{
            padding: 0rem 0rem 0.25rem 0rem;
            background-color: white;
            margin-bottom: 0.15rem;
            .listImg{
                display: inline-block;
                width: 100%;
                li{
                    float: left;
                    width: 50%;
                    margin-top: 0.2rem;
                    text-align: center;
                    position: relative;
                    .el-icon-delete{
                        color: red;
                        position: absolute;
                        right: 0.3rem;
                        font-size: 0.5rem;
                        top: 0.2rem;
                    }
                    .el-upload{
                        width: 92%;
                        height: 4rem;
                    }
                    img{
                        width: 92%;
                        height: 4rem;
                    }
                }
            }
        }
        .imgExplain{
            color: #f44336;
            font-size: 0.35rem;
            margin-bottom: 1.5rem;
        }
        button{
            float: left;
            margin-top: 0.5rem;
            display: inline-block;
            margin-bottom: 0.3rem;
            margin-left: 10%;
            background-color: #ff6600;
            color: white;
            width: 80%;
        }
        button.vaiclCode{
            background-color: #ff6600;
            position: absolute;
            top: 0;
            right: 0;
            height: 1rem;
            margin-top: 0px;
            width: 2rem;
        }
        button.vaiclCode:disabled {
            opacity: .6;
        }
        button.save{
            width: 40%;
            background-color: #ff6600;
            color: white;
        }
        button.close{
            background-color: #eee;
            width: 30%;
            color:#333;
        }
        .mint-search {
            height: auto;
        }
        .minePStruct{
            height: calc(100% - 5rem);
            overflow-y: auto;
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
        .height50{
            height: 1rem;
            border: 1px solid #ddd;
            background-color: white;margin-bottom: -1px;
            .titleFormat{
                width: 1rem;
                text-align: center;
                i{
                    font-size: 0.5rem;
                    margin-top: 0.30rem;
                }
            }
            .textFormat{
                margin-left: 1rem;
                height: 100%;
                input,select{
                    height: 100%;
                    width: 97%;
                    border: none;
                }
                select:invalid { color: gray; }
                textarea{
                    background-color: white;
                    height: 1.7rem;
                    margin-top: 0.5rem;
                }
            }
        }
        .height100{
            height: 100%;
        }
    }
</style>
