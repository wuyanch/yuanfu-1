<template>
  <a-table
    size="small"
    bordered
    rowKey="key"
    :expandedRowKeys="expandedRowKeys"
    @expand="handleExpand"
    :columns="columns"
    :data-source="planData"
    :pagination="false"
    ><template v-for="col in ['hbinsureamount', 'hbvalue', 'hbamount']" :slot="col" slot-scope="text, record, index">
      <div :key="col">
        <a-input style="margin: -5px 0" :value="text" @change="(e) => handleChange(e.target.value, record.key, col)" />
      </div>
      <!-- <div :key="col">
        <a-input-number style="margin: -5px 0" :value="text" @change="(e) => handleChange(e.target.value, record.key, col)" />
      </div> -->
    </template>
    <a-table
      bordered
      key="levelname"
      size="small"
      slot="expandedRowRender"
      slot-scope="text"
      :columns="innerColumns"
      :data-source="innerData"
      :pagination="false"
    >
      <template v-for="col in ['hbvalue']" :slot="col" slot-scope="text, record, index">
        <div :key="col">
          <a-input
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleChange(e.target.value, record.levelname, col)"
          />
        </div>
      </template>
    </a-table>
  </a-table>
</template>

<script>


const columns = [
  {
    title: '险种代码',
    dataIndex: 'riskcode',
    //customRender这个函数返回要合并的数据
  },
  {
    title: '险种责任代码及名称',
    dataIndex: 'respcodename',
  },
  {
    title: '保额',
    children: [
      {
        title: '申请',
        dataIndex: 'insureamount',
      },
      {
        title: '核保',
        dataIndex: 'hbinsureamount',
        width: 100,
        scopedSlots: { customRender: 'hbinsureamount' },
      },
    ],
  },
  {
    title: '单位',
    dataIndex: 'amountunit',
    key: 'amountunit',
  },
  {
    title: '核保报价（元）',
    dataIndex: 'hbamount',
    width: 150,
    scopedSlots: { customRender: 'hbamount' },
  },
]
const innerColumns = [
  {
    title: '赔付条件',
    children: [
      {
        title: '参数',
        dataIndex: 'levelname',
        key: 'levelname',
      },
      {
        title: '申请',
        dataIndex: 'levelvalue',
        key: 'levelvalue',
        width: 200,
      },
      {
        title: '核保',
        dataIndex: 'hbvalue',
        key: 'hbvalue',
        width: 200,
        scopedSlots: { customRender: 'hbvalue' },
      },
    ],
  },
]
export default {
  data() {
    return {
      planData: this.planTableData,
      columns: [],
      innerColumns,
      innerData: [],
      expandedRowKeys: [],
    }
  },
  props: {
    planTableData: Array,
    required: true,
  },
  created() {
    this.columns = columns
    this.innerColumns = innerColumns
  },
  methods: {
    // 核保输入
    handleChange(value, key, column) {
      if (column === 'hbvalue') {
        const newData = [...this.innerData]
        const target = newData.filter((item) => key === item.levelname)[0]
        if (target) {
          let that = this
          target[column] = value
          this.planData.forEach(function (current, index) {
            if (that.expandedRowKeys === current.key) {
              current.confList = newData
            }
          })
        }
      } else {
        const newData = [...this.planData]
        const target = newData.filter((item) => key === item.key)[0]
        if (target) {
          target[column] = value
          this.planData = newData
        }
      }
      // console.log(this.planData)
      this.$emit('handle-change', this.planData)
    },
    handleChangeinner(value, key, column) {
      const newData = [...this.innerData]
      const target = newData.filter((item) => key === item.levelname)[0]
      if (target) {
        let that = this
        target[column] = value
        this.planData.forEach(function (current, index) {
          if (that.expandedRowKeys === current.key) {
            current.confList = newData
          }
        })
      }
      this.$emit('handle-change', this.planData)
    },
    handleExpand(expanded, record) {
      let that = this
      this.expandedRowKeys = []
      if (expanded === true) {
        this.expandedRowKeys.push(record.key)
        this.planData.forEach(function (current, index) {
          if (record.key === current.key) {
            that.innerData = current.confList
          }
          console.log(that.innerData)
          // that.innerData.forEach(function(cur,indx){
          //   if(cur.hbvalue == null){
          //     cur.hbvalue = cur.levelvalue
          //   }
          // })
        })
        console.log(this.expandedRowKeys)
      }
    },
  },
}
</script>
<style lang="less">

</style>