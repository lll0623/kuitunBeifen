<template>
    <div id="app">
        <div class="wapper" ref="box">
            <keep-alive>
                <router-view v-if='$route.meta.keepAlive'/>
            </keep-alive>
            <router-view v-if='!$route.meta.keepAlive'/>
        </div>
    </div>
</template>

<script>
// import { getMemberMSGList } from './api/api.js'
import { mapGetters } from 'vuex'
import { getCookie } from './util'
export default {
    name: 'App',
    mounted(){
        
    },
    components : {
    }
}
</script>

<style lang='scss'>
body{
    background-color: #eee;
    /*overflow-x: hidden;*/
    .wapper{
        width:100%;
    }
}

</style>
