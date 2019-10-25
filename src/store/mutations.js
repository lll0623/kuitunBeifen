export default {
    SET_HEADTOGGLE:(state,toggle)=>{//重置headerbar
        state.headToggle = toggle
    },
    SET_USERINFO:(state,val)=>{//重置登录信息
        state.userInfo = val
    },
}
