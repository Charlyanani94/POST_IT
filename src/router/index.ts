import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NoteDetail from '../views/NoteDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
   {
      path: '/note/:id',  // ✅ Paramètre dynamique
      name: 'NoteDetail',
      component: NoteDetail,
      props: true // L'id peut être passé en prop si besoin
    }
  ],
})

export default router