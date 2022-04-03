import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { cloud } from '@tarojs/taro';

import './app.less'

const App = createApp({
  
})

cloud.init({
  env: 'cloud1-0gdb05jw5581957d'
})

App.use(createPinia())

export default App
