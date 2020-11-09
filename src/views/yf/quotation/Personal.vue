<template>
  <div class="search-public-wrap">
    <a-card size="small" class="card" title="个人池" :bordered="true">
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
          <!-- <span slot="status" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
          </span> -->
        </a-table>
      </div>
      <!-- table区域-end -->
    </a-card>
  </div>
</template>
<script>
import { PublicListMixin } from '@/mixins/PublicListMixin'
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
  name: 'Personal',
  mixins: [PublicListMixin],
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
          width: 60,
          align: 'center',
          dataIndex: 'status',
          // scopedSlots: { customRender: 'status' },
          customRender: function (text) {
            if (text == 1) {
              return '待审核'
            } else if (text == 2) {
              return '审核中'
            } else {
              return text
            }
          },
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
          ellipsis: true,
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
          ellipsis: true,
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
          width: 240,
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
        // 个人池接口
        list: '/yf/audit/mylist',
      },
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

  methods: {
    customRowFn(record, index) {
      return {
        on: {
          click: () => {
            // console.log(record, index)
            let proserialno = record.proserialno
            let departname = record.departname
            let createtime = record.createtime
            let organization = record.organization
            let mouldname = record.mouldname
            let proname = record.proname
            let tknumber = record.tknumber
            let status = record.status
            let realname = record.realname

            this.$router.push({
              name: 'yf-profile',
              params: {
                proserialno: proserialno,
                departname: departname,
                createtime: createtime,
                organization: organization,
                mouldname:mouldname,
                proname:proname,
                tknumber:tknumber,
                status:status,
                realname:realname
              },
            })
          },
        },
      }
    },

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
    // onSelectChange(selectedRowKeys, selectionRows) {
    //   this.selectedRowKeys = selectedRowKeys
    //   this.selectionRows = selectionRows
    //   console.log('selectedRowKeys changed: ', selectedRowKeys)
    //   console.log('selectionRows changed: ', selectionRows)
    // },
  },
  created() {
    this.initColumns()
  },
}
</script>

<style>
@import '~@assets/less/common.less';
.table-operator {
  margin-top: -48px;
}
.ant-table-tbody{
  cursor: pointer;
}
</style>