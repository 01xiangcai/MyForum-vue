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
import MyQuestion from '../views/question/MyQuestion'
import ArticleEdit from '../views/article/ArticleEdit'
import ArticleDetail from '../views/article/ArticleDetail'
import MyArticle from '../views/article/MyArticle'
import CommentNotification from '../views/Notification/CommentNotification'
import UserById from '../views/UserInfo/UserById'

import MyTestIndex from '../views/test/MyTestIndex'


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
    path: '/myQuestions',
    name: 'MyQuestion',
    component: MyQuestion
  },
  {
    path: '/myArticles',
    name: 'MyArticle',
    component: MyArticle
  },

  {
    path: '/commentNotification',
    name: 'CommentNotification',
    component: CommentNotification
  },

  {
    path: '/myTest',
    name: 'MyTestIndex',
    component: MyTestIndex
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
    path: '/article/add',
    name: '/ArticleAdd',
    component: ArticleEdit,
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
    path: '/aticle/:articleId',
    name: 'ArticleDetail',
    component: ArticleDetail
  },
  {
    path: '/user/:userId',
    name: 'UserById',
    component:UserById
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
    path: '/article/:articleId/edit',
    name: 'ArticleEdit',
    component: ArticleEdit,
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
  },



]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
