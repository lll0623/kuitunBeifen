<template>
    <div class="index-wrapper">
        <div id="container" class="indexPStruct">
            <div class="mineTital">
                <div class="leftImg fl abs">
                    <img :src="HeadPic" width="24" height="24">
                </div>
                <div class="rightText fl">
                    <span>{{ Name }}&nbsp;<span v-if="BindPhone || UserName">({{ UserName }}&nbsp;&nbsp; {{ BindPhone }}&nbsp;)</span></span><br/>
                    <span>{{ PStructName }}</span>
                </div>
                <div style="clear:both;">
                
                </div>
            </div>
            <div class="mineThings">
                <ul class="listItem">
                    <router-link :to="`/mypstruct`">
                        <li style="border-bottom:none;">
                            <i class="fa fa-home"></i>&nbsp;&nbsp;我的房产
                            <i class="fa fa-angle-right fr"></i>
                        </li>
                    </router-link>
                    <router-link :to="`/count`">
                        <li style="border-bottom:none;">
                            <i class="fa fa-newspaper-o"></i>&nbsp;&nbsp;我的工单
                            <i class="fa fa-angle-right fr"></i>
                        </li>
                    </router-link>
                    <router-link :to="`/addCountList`">
                        <li>
                            <i class="fa fa-newspaper-o"></i>&nbsp;&nbsp;房源绑定进度列表
                            <i class="fa fa-angle-right fr"></i>
                        </li>
                    </router-link>
                    <li style="display: none;">
                        <i class="fa fa-birthday-cake"></i>&nbsp;&nbsp;我的活动
                        <i class="fa fa-angle-right fr"></i>
                    </li>
                </ul>
            </div>
            
            <div class="mineJiaofei" style="display: none;">
                <ul class="listItem">
                    <li>
                        <i class="fa fa-yen"></i>&nbsp;&nbsp;缴费记录
                        <i class="fa fa-angle-right fr"></i>
                    </li>
                </ul>
            </div>
            
            <!-- <div class="mineOther">
                <div class="fl">
                    <img src="../assets/images/wdsp.png" />
                    <p>我的商品</p>
                </div>
                <div class="fl">
                    <img src="../assets/images/wdsc.png" />
                    <p>我的收藏</p>
                </div>
                <div class="fl">
                    <img src="../assets/images/wdpt.png" />
                    <p>我的拼团</p>
                </div>
                <div class="fl">
                    <img src="../assets/images/wdzs.png" />
                    <p>我的租售</p>
                </div>
                <div class="fl">
                    <img src="../assets/images/tkh.png" />
                    <p>退款/货</p>
                </div>
            </div> -->
            
            <div class="mineOrder" style="display:none;">
                <div class="title">
                    <div class="fl">
                        我的订单
                    </div>
                    <div class="fr">
                        查询全部
                        <i class="fa fa-angle-double-right"></i>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="content">
                    <div class="fl">
                        <img src="../assets/images/dfk.png"/>
                        <p>待付款</p>
                    </div>
                    <div class="fl">
                        <img src="../assets/images/dcy.png"/>
                        <p>待成团</p>
                    </div>
                    <div class="fl">
                        <img src="../assets/images/dfh.png"/>
                        <p>待发货</p>
                    </div>
                    <div class="fl">
                        <img src="../assets/images/dsh.png"/>
                        <p>待收货</p>
                    </div>
                    <div class="fl">
                        <img src="../assets/images/dpj.png"/>
                        <p>待评价</p>
                    </div>
                </div>
            </div>
            
            <div class="mineThings" style="display:none;">
                <ul class="listItem">
                    <li>
                        <i class="fa fa-map-marker"></i>&nbsp;&nbsp;收货地址
                        <i class="fa fa-angle-right fr"></i>
                    </li>
                    <li>
                        <i class="fa fa-home"></i>&nbsp;&nbsp;家政服务订单
                        <i class="fa fa-angle-right fr"></i>
                    </li>
                </ul>
            </div>
            
            <div class="mineThings" style="display:none;">
                <ul class="listItem">
                    <li>
                        <i class="fa fa-user"></i>&nbsp;&nbsp;员工通道
                        <i class="fa fa-angle-right fr"></i>
                    </li>
                </ul>
            </div>
            
            <div class="liveSys">
                <ul class="listItem">
                    <li @click="unbindAccountClick()">
                        <i class="fa fa-sign-out"></i>&nbsp;&nbsp;退出系统
                        <!-- <i class="fa fa-angle-right fr"></i> -->
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script type="es6">
    //util
    import {setCookie, getCookie, delCookie} from '../util'
    import {unbindAccount, getAccount, queryPubRoomRelaInfoList} from '../api/api.js'
    import defaultImg from '../assets/images/room_default.jpg'
    import {isNull} from '../util'
    import {Loadmore} from 'mint-ui'
    import {Toast, MessageBox} from 'mint-ui'
    import {Cell} from 'mint-ui';

    export default {
        data() {
            return {
                APPID: this.GLOBAL.APPID, // 微信appid
                HeadPic: defaultImg,
                Name: "",
                BindPhone: "",
                UserName: "",
                PStructName: ""
            }
        },
        beforeRouteEnter(to, from, next) {
            if (getCookie("HasBindPhone") == 0 || !getCookie("HasBindPhone")) {
                next(vm => {
                    vm.$router.push('/login')
                })
            } else {
                next(vm => {
                    window.document.title = "个人中心";
                    document.body.style.backgroundColor = '#eee';
                    vm.GetAccount();
                })
            }
        },
        mounted() {

        },
        methods: {
            isLogin() {
                if (getCookie("HasBindPhone") == 0 || getCookie("Token") == null) {
                    this.$router.push('/login')
                }
            },
            QueryPubRoomRelaInfoList() {
                queryPubRoomRelaInfoList({}).then(res => {
                    console.log(res);
                    if (res.Status == 200) {
                        this.options = res.Data;
                        if (res.Data.length == "0" && (getCookie("PStructId") == null || getCookie("PStructId") == "" || !getCookie("PStructId"))) {
                            MessageBox.confirm('暂无绑定的房产!', '去绑定？', {
                                showConfirmButton: true,
                                confirmButtonText: '确定',
                                showCancelButton: true,
                                cancelButtonText: '取消'
                            }).then(() => {
                                this.$router.push('/addWithIdCard')
                            }).catch(() => {
                                Toast({
                                    message: "已取消",
                                    position: 'top',
                                    duration: 3000
                                });
                            });
                        }
                        if (res.Data.length.length > 0 && (getCookie("PStructId") == null || getCookie("PStructId") == "" || !getCookie("PStructId"))) {
                            this.$router.push('/myPStruct')
                        }
                    } else {
                        Toast({
                            message: res.Message,
                            position: 'top',
                            iconClass: 'fa fa-close',
                            duration: 3000
                        });
                    }

                })
            },
            GetAccount() {
                getAccount({}).then(res => {
                    if (res.Status == 200) {
                        setCookie("Name", res.Data.Name);
                        setCookie("HeadPic", res.Data.HeadPic);
                        setCookie("PStructId", res.Data.PStructId);
                        setCookie("PStructName", res.Data.PStructName);
                        setCookie("Phone", res.Data.Phone);
                        setCookie("UserName", res.Data.RealName);
                        console.log(res)
                        this.HeadPic = res.Data.HeadPic;
                        this.Name = res.Data.Name;
                        this.BindPhone = res.Data.Phone;
                        this.UserName = res.Data.RealName;
                        this.PStructName = res.Data.PStructName;
                        this.QueryPubRoomRelaInfoList(); // 获取绑定的房产列表
                    } else {
                        Toast({
                            message: res.Message,
                            position: 'top',
                            iconClass: 'fa fa-close',
                            duration: 3000
                        });
                    }

                })
            },
            unbindAccountClick() {
                MessageBox.confirm('退出后需要重新绑定手机号！', '退出登录？', {
                    showConfirmButton: true,
                    confirmButtonText: '确定',
                    showCancelButton: true,
                    cancelButtonText: '取消'
                }).then(() => {
                    unbindAccount({}).then(res => {
                        if (res.Status == 200) {
                            setCookie("HasBindPhone", 0);
                            setCookie("Token", res.Data.Token);
                            // setCookie("ThirdId",res.Data.ThirdId);
                            delCookie("Phone");
                            delCookie("Token");
                            this.$router.push('/login')
                            Toast({
                                message: '退出成功！',
                                position: 'middle',
                                iconClass: 'fa fa-check',
                                duration: 3000
                            });
                        } else {
                            Toast({
                                message: res.Message,
                                position: 'top',
                                iconClass: 'fa fa-close',
                                duration: 3000
                            });
                        }
                    })
                }).catch(() => {
                    Toast({
                        message: "已取消",
                        position: 'top',
                        duration: 3000
                    });
                });
            }
        }
    }
</script>
<style lang="scss">
    body {
        background-color: #eee;
    }
    
    .indexPStruct {
        background-color: #eee;
        
        .mineTital {
            background-color: #ff6600;
            color: white;
            padding: 3%;
            display: inline-block;
            margin-bottom: 0.3rem;
            width: 94%;
            min-height: 1rem;
            
            .leftImg {
                width: 2rem;
                
                img {
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                }
            }
            
            .rightText {
                margin-left: 2.1rem;
            }
        }
        
        .mineThings {
            margin-bottom: 0.3rem;
        }
        
        .listItem {
            color: #333;
            
            li:first-child {
                border-top: 1px solid #dedede;
            }
            
            li {
                background-color: white;
                padding: 0.4rem 0.25rem;
                border-bottom: 1px solid #dedede;
                color: #333;
                font-size: 0.45rem;
                
                i {
                    font-size: 0.4rem;
                }
                
                .fa-angle-right {
                    color: #c8c8cd;
                    font-size: 0.5rem;
                    margin-top: 0.1rem;
                }
            }
            
            li:active {
                background-color: #e6e6e6;
            }
        }
        
        .mineJiaofei {
            margin-bottom: 0.15rem;
        }
        
        .mineOther {
            background-color: white;
            display: inline-block;
            width: 100%;
            padding: 0.4rem 0;
            margin-bottom: 0.1rem;
            
            div {
                width: 20%;
                text-align: center;
                
                img {
                    width: 1rem;
                    height: 1rem;
                }
                
                p {
                    color: #828a8a;
                    font-size: 0.3rem;
                    margin-top: 0.1rem;
                }
            }
        }
        
        .mineOrder {
            background-color: white;
            display: inline-block;
            width: 100%;
            margin-bottom: 0.2rem;
            
            .title {
                padding: 0.2rem 0.3rem;
                border-bottom: 1px solid #dedede;
                
                .fl {
                    color: #6B6B6B;
                    font-weight: 600;
                }
                
                .fr {
                    color: #828a8a;
                }
            }
            
            .content {
                background-color: white;
                display: inline-block;
                width: 100%;
                padding: 0.4rem 0 0.1rem 0;
                
                div {
                    width: 20%;
                    text-align: center;
                    
                    img {
                        width: 1rem;
                        height: 1rem;
                    }
                    
                    p {
                        color: #828a8a;
                        font-size: 0.3rem;
                        margin-top: 0.1rem;
                    }
                }
            }
        }
        
        .liveSys {
            position: fixed;
            width: 80%;
            margin-left: 10%;
            bottom: 0.3rem;
            
            li {
                background-color: #ff6600;
                color: white;
                border-radius: 0.1rem;
                text-align: center;
                
                i {
                    color: white !important;
                }
            }
        }
    }
</style>
