import { createApp } from 'vue'
import App from './App.vue'
import VueCustomTooltipPlugin from './index'
import { TooltipOptions } from './types'

const app = createApp(App)

const tooltipOptions: TooltipOptions = {
  // name: 'VueCustomTooltip',
  // color: '#fff',
  background: '#ff0000',
  // borderRadius: 12,
  // fontWeight: 400,
}

app.use(VueCustomTooltipPlugin, tooltipOptions)

app.mount('#app')
