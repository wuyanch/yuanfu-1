<template>
  <div class="search-public-wrap">
    <a-card size="small" class="card" title="条件查询" :bordered="true" style="margin-bottom: 10px">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form @keyup.enter.native="searchQuery" v-bind="layout">
          <a-row :gutter="24">
            <!-- 所属人员渠道 -->
            <!-- <a-col :span="8">
              <a-form-item label="所属人员渠道">
                <a-select v-model="queryParam.channels" placeholder="请选择渠道">
                  <a-select-option 
                  v-for="(channel,channelinde) in channelsList"
                  :key="channelinde.toString()"
                  :value="channel.channelsname"
                  >{{channel.channelsname}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :span="8">
              <a-form-item label="所属人员渠道">
                <a-select mode="multiple" v-model="queryParam.channel" placeholder="请选择渠道" @change="handleChange">
                  <a-select-option value="直销">直销</a-select-option>
                  <a-select-option value="中介">中介</a-select-option>
                  <a-select-option value="综拓">综拓</a-select-option>
                  <a-select-option value="银行">银行</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 项目/单位名称 -->
            <a-col :span="8">
              <a-form-item label="项目/单位名称">
                <a-input placeholder="请输入项目/单位名称" v-model="queryParam.proname" />
              </a-form-item>
            </a-col>
            <!-- 业务经理姓名 -->
            <a-col :span="8">
              <a-form-item label="业务经理姓名">
                <a-input placeholder="请输入业务经理姓名" v-model="queryParam.realname" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <!-- 所属人员机构 -->
            <a-col :span="8">
              <a-form-item label="所属人员机构">
                <a-select mode="multiple" v-model="queryParam.organization" placeholder="请选择机构">
                  <a-select-option
                    v-for="(organization, organizationindex) in organizationList"
                    :key="organizationindex.toString()"
                    :value="organization.organizationname"
                    >{{ organization.organizationname }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>

            <!-- 提交日期 -->
            <a-col :span="8">
              <a-form-item label="提交日期">
                <a-range-picker
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onCreatetimeChange"
                />
              </a-form-item>
            </a-col>
            <!-- 询价单号 -->
            <a-col :span="8">
              <a-form-item label="询价单号">
                <!-- <j-input placeholder="请输入询价单号" v-model="queryParam.proserialno"></j-input> -->
                <a-input placeholder="请输入询价单号" v-model="queryParam.proserialno"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <span class="table-page-search-submitButtons">
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </a-col>
            </span>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card size="small" class="card" title="公共池" :bordered="false" style="margin-bottom: 10px">
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
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
        >
          <!-- <span slot="status" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
          </span> -->
        </a-table>
      </div>
      <!-- table区域-end -->
      <!-- 操作按钮区域 -->
      <div class="table-operator" v-if="hasSelected">
        <span style="margin-right: 8px">
          <template>{{ `已选中： ${selectedRowKeys.length} 条` }}</template>
        </span>
        <a-button type="primary" @click="addMyList">申请</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import { initDictOptions, filterDictText, filterDictTextByCache } from '@/components/dict/JDictSelectUtil'
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
  name: 'SearchForm',
  mixins: [PublicListMixin],
  components: {},
  data() {
    return {
      layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
      description: '公共池',
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
          width: 100,
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
        list: '/yf/audit/list',
        addMyList: 'yf/audit/addMylist',
      },
      // fieldList: superQueryFieldList,
      // 获取机构
      // selectedOrganization: [],
      organizationList: [],
      channelsList: [],
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
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },
  methods: {
    handleChange(value) {
      // console.log(`selected ${value}`);
      this.queryParam.channel = value
      console.log(this.queryParam.channel)
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
    initialOrganizationList() {
      queryallo().then((res) => {
        if (res.success) {
          this.organizationList = res.result
          // console.log(this.organizationList)
        } else {
          console.log(res.message)
        }
      })
    },

    // onetomany: function () {
    //   this.$refs.jeecgDemoTabsModal.add()
    //   this.$refs.jeecgDemoTabsModal.title = '编辑'
    // },
    //跳转单据页面
    // jump() {
    //   this.$router.push({ path: '/jeecg/helloworld' })
    // },
    onCreatetimeChange: function (value, dateString) {
      console.log(dateString[0], dateString[1])
      this.queryParam.startcreatetime = dateString[0] + ' 00:00:00'
      this.queryParam.endcreatetime = dateString[1] + ' 23:59:59'
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
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      console.log('selectionRows changed: ', selectionRows)
    },
  },
  created() {
    this.initColumns()
    this.initialOrganizationList()
    // this.loadOptions()
    getChannels().then((res) => {
      if (res.success) {
        // console.log(res)
        this.channelsList = res.result
      } else {
        console.log(res.message)
      }
    })
  },
}
</script>
<style>
@import '~@assets/less/common.less';

.table-operator {
  margin-top: -48px;
}
.ant-form-item {
  margin-bottom: 4px;
}
.ant-card-head-wrapper .ant-card-head-title {
  color: #3d75ff;
}
.ant-table-thead {
  background: rgba(61, 118, 254, 0.2);
}
</style>