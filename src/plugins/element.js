import Vue from 'vue'
import {
    Button,
    FormItem,
    Input,
    Form,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    menuItem,
    Switch,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    Upload
} from 'element-ui'

// 引入时间轴文件
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Form)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(menuItem)
Vue.use(Switch)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

// 在全局原型对象上添加$message方法
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm