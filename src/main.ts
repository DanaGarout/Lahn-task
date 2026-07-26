import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import { useThemeStore } from '@/stores/theme'
import '@/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Apply the persisted/OS dark-mode preference before mounting so there's no
// flash of the wrong theme on first paint.
useThemeStore().init()

app.mount('#app')
