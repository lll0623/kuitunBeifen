<template>
    <div class="index-wrapper">
        <div id="container" class="GuangGao">
            <div class="header">
                <p>支付成功</p>
                <i class="fa fa-check-circle-o"></i>
            </div>
            <div class="content">
<!--                <p>订单编号： <span>{{code}}</span></p>-->
                <p>实付金额： <span class="red">{{ money }}</span></p>
            </div>
            <button class="mint-button mint-button--success mint-button--large" v-no-more-click @click="submit2()">
                <label class="mint-button-text">继续缴费</label>
            </button>
            <button class="mint-button mint-button--default mint-button--large" v-no-more-click @click="submit1()">
                <label class="mint-button-text">返回物业中心</label>
            </button>
            <div class="footer">
                <img src="http://36.189.242.36:815/201909/2243ed1c2d9945e89776cdb27eeafadb.jpg" alt="">
            </div>
        </div>
    </div>
</template>
<script type="es6">
    export default {
        data() {
            return {
                code:"",
                money:""
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                window.document.title = "付款成功";
                document.body.style.backgroundColor = '#eee';
                vm.code = vm.$route.query.code;
                vm.money = vm.$route.query.money;
                let orderHight = window.innerHeight;
                console.log(orderHight)
                document.getElementById('container').style.height = orderHight + 'px';
                // 判断是否支持回退
                if (window.history && window.history.pushState) {
                    history.pushState(null, null, document.URL);
                    window.addEventListener('popstate', vm.returns, false);
                }
            })
        },
        mounted() {

        },
        destroyed() {
            window.removeEventListener('popstate', this.returns, false);
        },
        methods: {
            returns(){
                this.$router.replace({path: '/fee'});
            },
            submit1(){
                this.$router.push('/propertyService');
            },
            submit2(){
                this.$router.push('/fee');
            }
        }
    }
</script>
<style lang="scss">
    body{
        background-color: #eee;
    }
    .GuangGao{
        height:100%;
        width:100%;
        overflow: hidden;
        background-size:cover;
        .header{
            background-color: #0b0;
            text-align: center;
            color: #fff;
            p{
                padding-top: 5%;
                font-size: 0.6rem;
                color: #fff;
            }
            i{
                padding-top: 5%;
                font-size: 1.8rem;
                padding-bottom: 5%;
            }
        }
        .content{
            width: 100%;
            background-color: #fff;
            margin-top: 0.5rem;
            padding:0.4rem 0.4rem 0 0.4rem;
            p{
                color: #898989;
                padding-bottom: 0.4rem;
            }
        }
        button{
            margin-left: 10%;
            margin-top: 0.5rem;
        }
        .mint-button--default{
            color: #333;
            width: 80%;
        }
        .mint-button--success{
            background-color: #ff6600;
            color: white;
            width: 80%;
        }
        .footer{
            width: 100%;
            margin-top: 0.5rem;
            img{
                height: auto;
                width: 100%;
            }
        }
    }


</style>
