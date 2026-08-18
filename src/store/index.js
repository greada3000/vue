import { createStore } from 'vuex'

export default createStore({
  state:{
    loginStatus:false,
    user:{
      name:'',
      username:'',
      usertype:'',
      pic:''
    }
  },
  getters:{
    getUser(state){
      return state.user;
    },
    getLoginStatus(state){
      return state.loginStatus;
    }
  },

  //修改state的值
  mutations: {
    updateUser(state,user){
      state.user=user;
      state.loginStatus=true;
      localStorage.setItem('teaUserInfo',JSON.stringify(state.user))
    },
    initUser(state){
      let userInfo=JSON.parse(localStorage.getItem('teaUserInfo'))
      if(userInfo){
        state.loginStatus=true;
        state.user=userInfo;
      }
    },
    removeUser(state){
      state.user={};
      state.loginStatus=false;
      localStorage.removeItem('teaUserInfo')
    }
  },
  actions: {
    asyncUpdateUser(context,user){
      context.commit('updateUser',user);
    }
  },
  // modules: {
  // }
})
