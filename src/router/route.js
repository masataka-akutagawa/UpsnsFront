import { createRouter, createWebHistory } from 'vue-router'
import TimeLine from '@/pages/TimeLine.vue'
import MyPage from '@/pages/MyPage.vue'
import SaveArticle from '@/pages/SaveArticle.vue'
import ProfileEdit from '@/pages/ProfileEdit.vue'
import SearchArticle from '@/pages/SearchArticle.vue'
import MyArticle from '@/pages/MyArticle.vue'
import OthersPage from '@/pages/OthersPage.vue'
import MainArticle from '@/pages/MainArticle.vue'
import NewPost from '@/pages/NewPost.vue'
import Login from '@/pages/LoginForm.vue'
import Notification from '@/pages/NotificationList.vue'
import Cognito from '@/cognito/Cognito.js'



const routes = [
{ //タイムライン
    path: '/time-line',
    name: 'TimeLine',
    component: TimeLine,
    meta: { requiresAuth:true }
},
{ //マイページ
    path: '/mypage',
    name: 'MyPage',
    component: MyPage,
    meta: { requiresAuth:true }
},
{ //保存した記事
    path: '/save-article',
    name: 'SaveArticle',
    component: SaveArticle,
    meta: { requiresAuth:true }

},
{ //編集ページ
    path: '/profile-edit',
    name: 'Edit',
    component: ProfileEdit,
    props:true,
    meta: { requiresAuth:true }

},
{ //検索ページ
    path: '/search',
    name: 'SearchArticle',
    component: SearchArticle,
    meta: { requiresAuth:true }

},
{ //投稿した記事
    path: '/my-article',
    name: 'MyArticle',
    component: MyArticle,
    meta: { requiresAuth:true }

},
{ //他人のマイページ
    path: '/others-page',
    name: 'OthersPage',
    component: OthersPage,
    meta: { requiresAuth:true }

},
{ //記事(タイムライン・検索時に表示される記事)
    path: '/main-article',
    name: 'MainArticle',
    component: MainArticle,
    meta: { requiresAuth:true }

},
{ //投稿を記述するページ
    path: '/new-post',
    name: 'NewPost',
    component: NewPost,
    meta: { requiresAuth:true }

},
{ //ログイン
    path: '/',
    name: 'Login',
    component: Login
},
{ //通知一覧
    path: '/notification',
    name: 'Notification',
    component: Notification,
    meta: { requiresAuth:true }
},

]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
  
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // このルートはログインされているかどうか認証が必要です。
      // もしされていないならば、ログインページにリダイレクトします。
      Cognito.isAuthenticated().then(res => {
        if (!res) {
            next({
              path: '/',
              query: { redirect: to.fullPath }
            })
          } else {
            next()
          }
      } )
      
    } else {
      next() // next() を常に呼び出すようにしてください!
    }
  })
  
  export default router