<template>
  <div class="search-public-wrap">

    <a-card class="card" title="个人池" :bordered="false">
      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          size="small"
          bordered
          rowKey="proserialno"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :customRow="customRowFn"
          @change="handleTableChange"
        >
          <span slot="status" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
          </span>
        </a-table>
      </div>
      <!-- table区域-end -->
    </a-card>
  </div>
</template>

<script>
import { initDictOptions, filterDictText, filterDictTextByCache } from '@/components/dict/JDictSelectUtil'
import { PersonalListMixin } from '@/mixins/PersonalListMixin'
import Vue from 'vue'
import { filterObj } from '@/utils/util'

import { getChannels, queryUserOrganization, queryallo } from '@/api/api'

const statusMap = {
  1: {
    status: 'default',
    text: '待审核',
  },
  2: {
    status: 'processing',
    text: '审核中',
  },
  3: {
    status: 'success',
    text: '核保通过',
  },
  4: {
    status: 'error',
    text: '核保不通过',
  },
}

export default {
  name: 'PersonalForm',
  mixins: [PersonalListMixin],
  components: {},
  data() {
    return {
      description: '个人池',
      //表头
      columns: [],
      //列设置
      settingColumns: [],
      //列定义
      defColumns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '状态',
          width: 120,
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '项目/单位名称',
          align: 'center',
          width: 120,
          ellipsis: true,
          dataIndex: 'proname',
        },
        {
          title: '业务经理',
          align: 'center',
          width: 80,
          dataIndex: 'realname',
        },
        {
          title: 'TK工号',
          align: 'center',
          width: 90,
          ellipsis: true,
          dataIndex: 'tknumber',
        },
        {
          title: '机构',
          align: 'center',
          width: 60,
          dataIndex: 'organization',
        },
        {
          title: '营业部',
          align: 'center',
          width: 120,
          ellipsis: true,
          dataIndex: 'departname',
        },
        {
          title: '询价单号',
          align: 'center',
          width: 200,
          ellipsis: true,
          dataIndex: 'proserialno',
        },
        {
          title: '提交时间',
          align: 'center',
          ellipsis: true,
          dataIndex: 'createtime',
        },
        {
          title: '模板类型',
          align: 'center',
          ellipsis: true,
          dataIndex: 'mouldname',
        },
      ],
      url: {
        // list: '/yf/audit/list',
        // list:'/yf/audit/mylist',
        mylist:'/yf/audit/mylist',
      },
      // fieldList: superQueryFieldList,
      // 获取机构
      // selectedOrganization: [],
      // organizationList: [],
      // channelsList:[]
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    },
  },
  // computed: {
  //   hasSelected() {
  //     return this.selectedRowKeys.length > 0
  //   },
  // },
  methods: {
    customRowFn(record,index) {
      return {
        on: {
          click: () => {
            console.log(record,index)
            let proserialno = record.proserialno
            console.log(proserialno)
            this.$router.push({ name: 'dashboard', params: { proserialno: proserialno }})
          },
        }
      }
    },
    // 获取机构
    // loadUserOrganization() {
    //   queryUserOrganization().then((res) => {
    //     if (res.success) {
    //       this.selectedOrganization = res.result
    //     } else {
    //       console.log(res.message)
    //     }
    //   })
    // },

    // onetomany: function () {
    //   this.$refs.jeecgDemoTabsModal.add()
    //   this.$refs.jeecgDemoTabsModal.title = '编辑'
    // },
    //跳转单据页面
    // jump() {
    //   this.$router.push({ path: '/jeecg/helloworld' })
    // },
    // onCreatetimeChange: function (value, dateString) {
    //   console.log(dateString[0], dateString[1])
    //   this.queryParam.startcreatetime = dateString[0]
    //   this.queryParam.endcreatetime = dateString[1]
    // },
    //列设置更改事件
    onColSettingsChange(checkedValues) {
      var key = this.$route.name + ':colsettings'
      Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
      this.settingColumns = checkedValues
      const cols = this.defColumns.filter((item) => {
        if (item.key == 'rowIndex' || item.dataIndex == 'action') {
          return true
        }
        if (this.settingColumns.includes(item.dataIndex)) {
          return true
        }
        return false
      })
      this.columns = cols
    },
    initColumns() {
      //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
      //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');

      var key = this.$route.name + ':colsettings'
      let colSettings = Vue.ls.get(key)
      if (colSettings == null || colSettings == undefined) {
        let allSettingColumns = []
        this.defColumns.forEach(function (item, i, array) {
          allSettingColumns.push(item.dataIndex)
        })
        this.settingColumns = allSettingColumns
        this.columns = this.defColumns
      } else {
        this.settingColumns = colSettings
        const cols = this.defColumns.filter((item) => {
          if (item.key == 'rowIndex' || item.dataIndex == 'action') {
            return true
          }
          if (colSettings.includes(item.dataIndex)) {
            return true
          }
          return false
        })
        this.columns = cols
      }
    },
    // addMylist() {
    //   console.log(this)
    // },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      console.log('selectionRows changed: ', selectionRows)
    },
  },
  created() {
    this.initColumns()
    // this.initialOrganizationList()
    // this.loadOptions()
    // getChannels().then((res) => {
    //   if (res.success) {
    //     console.log(res)
    //     this.channelsList = res.result
    //   } else {
    //     console.log(res.message)
    //   }
    // })
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.table-operator {
  margin-top: -48px;
}
</style>