/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Import the router
import router from './router'

import { createPinia } from 'pinia';

const app = createApp(App)

// Register plugins
registerPlugins(app)

// Add the router.beforeEach hook
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Game Statistics'
  next()
})

// Use the router
app.use(router)

app.use(createPinia());

// Mount the app
app.mount('#app')
