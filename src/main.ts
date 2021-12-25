import { createApp } from 'vue'
import VTooltip from 'v-tooltip'
import App from './App.vue'
import emitter from 'vue3-beautiful-chat/src/emitter'
const app = createApp(App).use(VTooltip)

// 该组件需要挂载全局属性，由于这里把组件拆开用，就得挂到app上
app.config.globalProperties.$event = emitter

app.mount('#app')
