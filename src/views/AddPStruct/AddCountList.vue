<template>
    <div class="index-wrapper">
        <div id="container" class="CountList">
            <p class="tc" style="padding-top:1rem;" v-if="postData.length == 0">暂无数据</p>
            <div class="list" v-for="(item,index) in postData" :key="index" @click="CountViewClick(item.Id)">
                <div class="header">
                    绑定房间：{{ item.FullName }}
                </div>
                <div class="content">
                    <div class="">
                        业主名称：{{ item.Name }}
                    </div>
<!--                    <div>-->
<!--                        申请人: {{ item.CreateUserName }}-->
<!--                    </div>-->
                    <div>
                        手机号: {{ item.Phone }}
                    </div>
                    <div>
                        证件号: {{ item.IDCard }}
                    </div>
                    <div class="">
                        状态：
                        <span v-if="item.State == 1" class="label label-warning">待审批</span>
                        <span v-if="item.State == 2" class="label label-primary">审批通过</span>
                        <span v-if="item.State == 3" class="label label-danger">审批未通过</span>
                    </div>
<!--                    <div v-if="item.State == 2">-->
<!--                        审批时间: {{ item.ApprovalDate | dateFormat }}-->
<!--                    </div>-->
                    <div v-if="item.State == 3">
                        审批意见: {{ item.ApprovalMemo }}
                    </div>
                </div>
                <div class="footer">
                    申请时间：{{ item.CreateDate | dateFormat}}
                </div>
            </div>
        </div>
    </div>
</template>
<script type="es6">
    //util
    import {setCookie, getCookie, delCookie} from '../../util'
    import {getRoomBindingApplyOpenID} from '../../api/api.js'
    import {isNull} from '../../util'
    import {Loadmore} from 'mint-ui'
    import {Toast} from 'mint-ui'
    import {Cell} from 'mint-ui';
    import moment from 'moment'

    export default {

        data() {
            return {
                postData: []
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                window.document.title = "房源绑定进度列表";
                document.body.style.backgroundColor = '#efefef'
            })
        },
        mounted() {
            getRoomBindingApplyOpenID({}).then(res => {
                console.log(res);
                if (res.Status == 200) {
                    this.postData = res.Data;
                    this.postData.sort(function(a,b) {
                        return Date.parse(b.CreateDate)-Date.parse(a.CreateDate);
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
        },
        methods: {
            CountViewClick(id) {
                // this.$router.push({
                //     path: '/countView',
                //     query: {
                //         BillId: id
                //     }
                // })
            }
        },
        filters: {
            //时间格式化
            dateFormat: function (date) {
                if (date == undefined) {
                    return "";
                }
                //moment.locale('en'); //日期格式汉化
                let localLocale = moment(date).utcOffset(480).format('YYYY-MM-DD HH:mm:ss');
                return localLocale;
            }
        }
    }
</script>
<style lang="scss">
    body {
        background-color: #efefef;
    }
    
    .AddCountList {
        background-color: #efefef;
        padding: 0.15rem;
        
        .list {
            margin-bottom: 0.5rem;
            
            .header {
                padding: 0.2rem;
                background-color: #f5f5f5;
                font-weight: 600;
                border: 1px solid #ddd;
            }
            
            .content {
                padding: 0.2rem;
                background-color: white;
                line-height: 0.6rem;
                border: 1px solid #ddd;
                border-top: none;
            }
            
            .footer {
                padding: 0.2rem;
                background-color: #f5f5f5;
                text-align: right;
                border: 1px solid #ddd;
                border-top: none;
                box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
            }
        }
    }
</style>
