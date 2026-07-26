// route table + the guard that protects everything under /dashboard

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/public/HomeView.vue'),
      meta: { title: 'Eventify — Discover Events' },
    },
    {
      // public details page uses the slug, not the numeric id
      path: '/events/:slug',
      name: 'event-details',
      component: () => import('@/views/public/EventDetailsView.vue'),
      props: true,
      meta: { title: 'Event Details' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Log in', guestOnly: true },
    },
    {
      path: '/dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-events',
          component: () => import('@/views/dashboard/DashboardEventsView.vue'),
          meta: { title: 'Manage Events', requiresAuth: true },
        },
        {
          path: 'events/new',
          name: 'dashboard-event-create',
          component: () => import('@/views/dashboard/EventFormView.vue'),
          meta: { title: 'New Event', requiresAuth: true },
        },
        {
          path: 'events/:id/edit',
          name: 'dashboard-event-edit',
          component: () => import('@/views/dashboard/EventFormView.vue'),
          props: true,
          meta: { title: 'Edit Event', requiresAuth: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page Not Found' },
    },
  ],
})

router.beforeEach((to: RouteLocationNormalized) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // send them to login, remember where they were headed
    return {
      name: 'login',
      query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined,
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard-events' }
  }

  return true
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : 'Eventify'
  document.title = title
})

export default router