import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue')
  },
  {
    path: '/circles/:id',
    alias: '/circle/:id',
    component: () => import('@/pages/circles/CircleLayout.vue'),
    props: true,
    children: [
      {
        path: '',
        name: 'circle-overview',
        component: () => import('@/components/common/EntityHomePanel.vue')
      },
      {
        path: 'articles',
        alias: 'article',
        name: 'circle-articles',
        component: () => import('@/pages/circles/CircleArticlesPage.vue')
      }
    ]
  },
  {
    path: '/profile/:id',
    alias: '/myhome/:id',
    component: () => import('@/pages/profile/MyProfileLayout.vue'),
    props: true,
    children: [
      {
        path: '',
        name: 'my-profile',
        component: () => import('@/components/common/EntityHomePanel.vue')
      },
      {
        path: 'articles',
        alias: 'myarticle',
        name: 'my-articles',
        component: () => import('@/pages/profile/ProfileArticlesPage.vue')
      },
      {
        path: 'settings',
        alias: 'myinfo',
        name: 'profile-settings',
        component: () => import('@/pages/profile/ProfileInfoPage.vue')
      },
      {
        path: 'password',
        alias: 'changepass',
        name: 'change-password',
        component: () => import('@/pages/profile/ChangePasswordPage.vue')
      },
      {
        path: 'followers',
        alias: 'myfans',
        name: 'my-followers',
        component: () => import('@/pages/profile/ProfileFollowersPage.vue')
      },
      {
        path: 'following',
        alias: 'myconcern',
        name: 'my-following',
        component: () => import('@/pages/profile/ProfileFollowingPage.vue')
      },
      {
        path: 'circles',
        alias: 'mycircle',
        name: 'my-circles',
        component: () => import('@/pages/profile/ProfileCirclesPage.vue')
      }
    ]
  },
  {
    path: '/users/:id',
    alias: '/userhome/:id',
    component: () => import('@/pages/profile/PublicProfileLayout.vue'),
    props: true,
    children: [
      {
        path: '',
        name: 'user-profile',
        component: () => import('@/components/common/EntityHomePanel.vue')
      },
      {
        path: 'articles',
        alias: 'hisarticle',
        name: 'user-articles',
        component: () => import('@/pages/profile/ProfileArticlesPage.vue')
      },
      {
        path: 'followers',
        alias: 'hisfans',
        name: 'user-followers',
        component: () => import('@/pages/profile/ProfileFollowersPage.vue')
      },
      {
        path: 'following',
        alias: 'hisconcern',
        name: 'user-following',
        component: () => import('@/pages/profile/ProfileFollowingPage.vue')
      }
    ]
  },
  {
    path: '/articles/:aid',
    alias: '/articledetail/:aid',
    name: 'article-detail',
    component: () => import('@/pages/articles/ArticleDetailPage.vue'),
    props: true
  },
  {
    path: '/search',
    component: () => import('@/pages/search/SearchLayout.vue'),
    children: [
      { path: '', redirect: { name: 'search-articles' } },
      {
        path: 'articles',
        alias: 'article',
        name: 'search-articles',
        component: () => import('@/pages/search/ArticleSearchResults.vue')
      },
      {
        path: 'circles',
        alias: 'circle',
        name: 'search-circles',
        component: () => import('@/pages/search/CircleSearchResults.vue')
      },
      {
        path: 'users',
        alias: 'user',
        name: 'search-users',
        component: () => import('@/pages/search/UserSearchResults.vue')
      }
    ]
  },
  {
    path: '/admin',
    alias: '/Manage',
    component: () => import('@/pages/admin/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/AdminDashboardPage.vue')
      },
      {
        path: 'users',
        alias: '/userList',
        name: 'admin-users',
        component: () => import('@/pages/admin/AdminUsersPage.vue')
      },
      {
        path: 'circles',
        alias: '/adminList',
        name: 'admin-circles',
        component: () => import('@/pages/admin/AdminCirclesPage.vue')
      },
      {
        path: 'articles',
        alias: '/articleList',
        name: 'admin-articles',
        component: () => import('@/pages/admin/AdminArticlesPage.vue')
      }
    ]
  },
  {
    path: '/login',
    alias: '/Login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue')
  },
  {
    path: '/register',
    alias: '/Register',
    name: 'register',
    component: () => import('@/pages/auth/RegisterPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router
