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
    Cascader
} from 'element-ui'

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
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm