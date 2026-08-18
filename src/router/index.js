import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Manage from '../views/Manage.vue'
import searchhome from '../views/searchhome.vue'
import articleDetail from '../views/articledetial.vue'
import circleDetail from '../views/circle.vue'
import myhome from '../views/myhome.vue'
import otherhome from '../views/otherhome.vue'


const routes = [
  
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path:'/circle/:id',
    component:circleDetail,
    children:[
      {
        path:'',
        component:()=>import('../views/circle/home.vue')
      },
      {
        path:'article',
        // name:'',
        component: ()=>import('../views/circle/article.vue')
      },
    ]
  },
  {
    path:'/myhome/:id',
    component:myhome,
    children:[
      {
        path:'',
        component:()=>import('../views/userspage/home.vue')
      },
      {
        path:'myarticle',
        // name:'',
        component: ()=>import('../views/userspage/myarticle.vue')
      },
      {
        path:'myinfo',
        component:()=>import('../views/userspage/myinfo.vue')
      },
      {
        path:'changepass',
        component:()=>import('../views/userspage/changepass.vue')
      },
      {
        path:'myfans',
        component:()=>import('../views/userspage/myfans.vue')
      },
      {
        path:'myconcern',
        component:()=>import('../views/userspage/myconcern.vue')
      },
      {
        path:'mycircle',
        component:()=>import('../views/userspage/mycircle.vue')
      },

    ]
  },
  {
    path:'/userhome/:id',
    component:otherhome,
    children:[
      {
        path:'',
        component:()=>import('../views/userspage/home.vue')
      },
      {
        path:'hisarticle',
        // name:'',
        component: ()=>import('../views/userspage/myarticle.vue')
      },
      {
        path:'hisfans',
        // name:'',
        component: ()=>import('../views/userspage/myfans.vue')
      },
      {
        path:'hisconcern',
        // name:'',
        component: ()=>import('../views/userspage/myconcern.vue')
      }
    ]
  },
  {
    path:'/articledetail/:aid',
    component:articleDetail
  },
  {
    path:'/search',
    // name:'',
    component:searchhome,
    children:[
      {
        path:'article',
        // name:'',
        component: ()=>import('../views/search/articlesearch.vue')
      },
      {
        path:'circle',
        // name:'',
        component: ()=>import('../views/search/circlesearch.vue')
      },
      {
        path:'user',
        // name:'',
        component: ()=>import('../views/search/usersearch.vue')
      }
    ]
  },
  {
    path: '/Manage',
    // name: 'Manage',
    component: Manage,
    children:[
      {
        path:'',
        name:'ManageHome',
        component: ()=>import('../views/manage/ManageHome.vue')
      }
      ,
      {
      path: '/userList',
      name: 'userList',
      component: ()=>import('../views/manage/userList.vue')
      },
      {
      path: '/adminList',
      name: 'adminList',
      component: ()=>import('../views/manage/adminList.vue')
      },
      {
        path: '/articleList',
        name: 'articleList',
        component: ()=>import('../views/manage/articleList.vue')
        }]
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
