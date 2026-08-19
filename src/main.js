import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { api } from './services/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Search } from '@element-plus/icons-vue'
import './assets/styles/global.css'

const app = createApp(App)
app.component('DeleteIcon', Delete)
app.component('EditIcon', Edit)
app.component('SearchIcon', Search)
app.config.globalProperties.$api = api
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$confirm = ElMessageBox.confirm
app.use(store)
app.use(router)
app.mount('#app')
