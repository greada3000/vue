import { createStore } from "vuex";
import { clearBasicAuth } from "@/services/api";

const USER_STORAGE_KEY = "communityUserInfo";

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
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state.user));
    },
    initUser(state){
      let userInfo = JSON.parse(sessionStorage.getItem(USER_STORAGE_KEY));
      if(userInfo){
        state.loginStatus=true;
        state.user=userInfo;
      }
    },
    removeUser(state){
      state.user={};
      state.loginStatus=false;
      sessionStorage.removeItem(USER_STORAGE_KEY);
      clearBasicAuth();
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
