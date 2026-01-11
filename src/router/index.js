import { createRouter, createWebHashHistory } from 'vue-router'
import LocalMap from '../views/LocalMap.vue'
import LabsView from '../views/LabsView.vue'
// 如果你创建了 StoriesView 和 ActivitiesView，记得也引入
import StoriesView from '../views/StoriesView.vue'
import ActivitiesView from '../views/ActivitiesView.vue'
import DevTools from '../views/DevTools.vue'

const router = createRouter({
  // 2. 这里改为 createWebHashHistory()
  // 注意：括号里不需要再传 base url 了，Hash 模式自动兼容
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LocalMap
    },
    {
      path: '/labs',
      name: 'labs',
      component: LabsView
    },
    // 添加其他页面的路由
    { path: '/stories', component: StoriesView },
    { path: '/activities', component: ActivitiesView },
    {
      path: '/dev',     // 访问路径
      name: 'dev',
      component: DevTools
    }
  ]
})

export default router
