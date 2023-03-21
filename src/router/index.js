import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Blogs from '../views/Blogs.vue'
import BlogEdit from '../views/BlogEdit.vue'
import BlogDetail from '../views/BlogDetail.vue'
import Article from '../views/Article.vue'
import Questions from '../views/Questions'
import QuestionEdit from '../views/question/QuestionEdit'
import QuestionDetail from '../views/question/QuestionDetail'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: {name: "Blogs"}
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs
  },
  {
    path: '/article',
    name: 'Article',
    component: Article
  },
  {
    path: '/questions',
    name: 'questions',
    component: Questions
  },
  {
    path: '/question/add',
    name: '/QuestionAdd',
    component: QuestionEdit,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/question/:questionId',
    name: 'QuestionDetail',
    component: QuestionDetail
  },
  {
    path: '/question/:questionId/edit',
    name: 'QuestionEdit',
    component: QuestionEdit,
    meta: {
      requireAuth: true
    }
  },



  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/blog/add',
    name: 'BlogAdd',
    component: BlogEdit,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/blog/:blogId',
    name: 'BlogDetail',
    component: BlogDetail
  },
  {
    path: '/blog/:blogId/edit',
    name: 'BlogEdit',
    component: BlogEdit,
    meta: {
      requireAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
