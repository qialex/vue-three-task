import Home from './views/Home.vue'
import Geometry from './views/Geometry.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { 
    path: '/', 
    component: Home, 
    meta: { 
      title: 'Home' 
    } 
  },
  { 
    path: '/geometry/:id', 
    component: Geometry, 
    meta: { 
      title: 'Geometry',
    },
  },
  {
    path: '/:path(.*)',
    // example of route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('./views/NotFound.vue'),
  },
]
