import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/pages/home/HomePage.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import AdminLayout from '@/pages/admin/AdminLayout.vue'
import SearchLayout from '@/pages/search/SearchLayout.vue'
import ArticleDetailPage from '@/pages/articles/ArticleDetailPage.vue'
import CircleLayout from '@/pages/circles/CircleLayout.vue'
import MyProfileLayout from '@/pages/profile/MyProfileLayout.vue'
import PublicProfileLayout from '@/pages/profile/PublicProfileLayout.vue'


const routes = [
  
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path:'/circle/:id',
    component:CircleLayout,
    children:[
      {
        path:'',
        component:()=>import('@/components/common/EntityHomePanel.vue')
      },
      {
        path:'article',
        // name:'',
        component: ()=>import('@/pages/circles/CircleArticlesPage.vue')
      },
    ]
  },
  {
    path:'/myhome/:id',
    component:MyProfileLayout,
    children:[
      {
        path:'',
        component:()=>import('@/components/common/EntityHomePanel.vue')
      },
      {
        path:'myarticle',
        // name:'',
        component: ()=>import('@/pages/profile/ProfileArticlesPage.vue')
      },
      {
        path:'myinfo',
        component:()=>import('@/pages/profile/ProfileInfoPage.vue')
      },
      {
        path:'changepass',
        component:()=>import('@/pages/profile/ChangePasswordPage.vue')
      },
      {
        path:'myfans',
        component:()=>import('@/pages/profile/ProfileFollowersPage.vue')
      },
      {
        path:'myconcern',
        component:()=>import('@/pages/profile/ProfileFollowingPage.vue')
      },
      {
        path:'mycircle',
        component:()=>import('@/pages/profile/ProfileCirclesPage.vue')
      },

    ]
  },
  {
    path:'/userhome/:id',
    component:PublicProfileLayout,
    children:[
      {
        path:'',
        component:()=>import('@/components/common/EntityHomePanel.vue')
      },
      {
        path:'hisarticle',
        // name:'',
        component: ()=>import('@/pages/profile/ProfileArticlesPage.vue')
      },
      {
        path:'hisfans',
        // name:'',
        component: ()=>import('@/pages/profile/ProfileFollowersPage.vue')
      },
      {
        path:'hisconcern',
        // name:'',
        component: ()=>import('@/pages/profile/ProfileFollowingPage.vue')
      }
    ]
  },
  {
    path:'/articledetail/:aid',
    component:ArticleDetailPage
  },
  {
    path:'/search',
    // name:'',
    component:SearchLayout,
    children:[
      {
        path:'article',
        // name:'',
        component: ()=>import('@/pages/search/ArticleSearchResults.vue')
      },
      {
        path:'circle',
        // name:'',
        component: ()=>import('@/pages/search/CircleSearchResults.vue')
      },
      {
        path:'user',
        // name:'',
        component: ()=>import('@/pages/search/UserSearchResults.vue')
      }
    ]
  },
  {
    path: '/Manage',
    // name: 'Manage',
    component: AdminLayout,
    children:[
      {
        path:'',
        name:'ManageHome',
        component: ()=>import('@/pages/admin/AdminDashboardPage.vue')
      }
      ,
      {
      path: '/userList',
      name: 'userList',
      component: ()=>import('@/pages/admin/AdminUsersPage.vue')
      },
      {
      path: '/adminList',
      name: 'adminList',
      component: ()=>import('@/pages/admin/AdminCirclesPage.vue')
      },
      {
        path: '/articleList',
        name: 'articleList',
        component: ()=>import('@/pages/admin/AdminArticlesPage.vue')
        }]
  },
  {
    path: '/Login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/Register',
    name: 'Register',
    component: RegisterPage
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
