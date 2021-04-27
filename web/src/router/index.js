import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Test from '../views/test.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Management from '../views/Management.vue'
import UserManagement from '../views/usermanagement.vue'
import Query from '../views/Query.vue'
//import Detail from '../views/Detail.vue'
import companyManagement from '../views/companyManagement.vue'
import Transaction from '../views/Transaction.vue'
import TransactionData from '../views/Transactiondata.vue'
import marketMonitoring from '../views/Marketmonitoring.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    children: [
      {
        path: '/management',
        name: 'Management',
        component: Management
      },
      {
        path: '/userManagement',
        component: UserManagement
      },
      {
        path: '/query',
        name: 'query',
        component: Query
      },
      // {
      //   path: '/detail',
      //   name: 'detail',
      //   component: Detail
      // }
      {
        path: '/companyManagement',
        name: 'companyManagement',
        component: companyManagement
      },
      {
        path: '/transaction',
        name: 'transaction',
        component: Transaction
      },
      {
        path: '/transactionData',
        name: 'transactionData',
        component: TransactionData
      },
      {
        path: '/marketMonitoring',
        name: 'marketMonitoring',
        component: marketMonitoring
      }
    ]
  }
  //{
    //path: '/about',
    //name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  //}
]

const router = new VueRouter({
  routes
})

export default router
