/**
 * Created by levy on 2018/2/12.
 */
import Vue from 'vue'
import Element, {MessageBox, Message, Notification} from 'element-ui'
import ElFormRenderer from '@femessage/el-form-renderer'
import ElDataTable from '@femessage/el-data-table'

Vue.prototype.$ELEMENT = {size: 'medium'}

Vue.use(Element)

Vue.component('el-form-renderer', ElFormRenderer)
Vue.component('el-data-table', ElDataTable)

Vue.prototype.$notify = Notification
Vue.$notify = Notification

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message
