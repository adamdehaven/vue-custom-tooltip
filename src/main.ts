import { createApp } from 'vue'
import App from './App.vue'
import VueCustomTooltip from './index'

const app = createApp(App)

const tooltipOptions = {
  // name: 'VueCustomTooltip',
  // color: '#fff',
  background: '#ff0000',
  // borderRadius: 12,
  // fontWeight: 400,
}

app.use(VueCustomTooltip, tooltipOptions)

app.mount('#app')
