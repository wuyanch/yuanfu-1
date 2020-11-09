<template>
  <div class="operation">
    <a-back-top />
    <a-card size="small" :bordered="false" style="margin-bottom: 20px">
      <a-table
        size="small"
        bordered
        row-key="id"
        :columns="identifyColumns"
        :data-source="loadIdentifyData"
        :pagination="false"
      ></a-table>
    </a-card>
    <a-card size="small" :bordered="false" title="单位信息（询价时）" style="margin-bottom: 20px">
      <a-descriptions>
        <a-descriptions-item label="行业">{{ UnitInformation.industry }}</a-descriptions-item>
        <a-descriptions-item label="人数">{{ UnitInformation.unitnum }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card size="small" :bordered="false" title="补充信息" style="margin-bottom: 20px">
      <a-descriptions v-if="isPicList == true">
        <a-descriptions-item>{{
          BusinessInformation.sideinformation == '' ? '无' : BusinessInformation.sideinformation
        }}</a-descriptions-item>
      </a-descriptions>
      <div v-else>数据疯狂加载中...</div>
    </a-card>
    <a-card size="small" :bordered="false" title="查看业务附件" style="margin-bottom: 20px">
      <div v-if="isPicList == true">
        <div v-if="fileList.length > 0" class="filelist-wrap clearfix">
          <div class="filelist-item" v-for="(item, index) in fileList" :key="index">
            <img :src="item.url" fit="contain" @click="clickImg" />
          </div>
          <a-modal :width="1000" :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>

        <div v-else>无附件</div>
      </div>
      <div v-else>数据疯狂加载中...</div>
      <!-- <a-descriptions>
        <a-descriptions-item label="业务附件"
          >{{ BusinessInformation.fileList == [] ? '无附件' : '请前往附件查看'
          }}<a-button v-if="BusinessInformation.fileList != []" type="primary" icon="download" @click="onDownload">
            下载附件
          </a-button></a-descriptions-item>
      </a-descriptions> -->
    </a-card>
    <a-card size="small" :bordered="false" title="业务信息" style="margin-bottom: 20px">
      <!-- {{ BusinessInformation }} -->
      <a-descriptions v-if="isPicList == true">
        <a-descriptions-item label="TK工号">{{ BusinessInformation.tknumber }}</a-descriptions-item>
        <a-descriptions-item label="业务渠道" span="2">{{ BusinessInformation.saleschannel }}</a-descriptions-item>
        <a-descriptions-item v-if="BusinessInformation.agencyname != null" label="代理机构名称" span="3">{{
          BusinessInformation.agencyname
        }}</a-descriptions-item>
        <a-descriptions-item v-if="BusinessInformation.agencyname != null" label="代理费" span="3">{{
          BusinessInformation.agencyfee
        }}</a-descriptions-item>
        <a-descriptions-item label="拟投保总人数（人）">{{
          BusinessInformation.sum == '' ? '-' : BusinessInformation.sum
        }}</a-descriptions-item>
        <a-descriptions-item label="期望整单总保费" span="2">{{ BusinessInformation.exppremium }}</a-descriptions-item>
      </a-descriptions>
      <div v-else>数据疯狂加载中...</div>
    </a-card>
    <!-- 暂时不做20200909 -->
    <!-- <a-card size="small" :bordered="false" title="费用情况" style="margin-bottom:20px;">
      <a-descriptions>
        <a-descriptions-item label="表格">有</a-descriptions-item>
      </a-descriptions>
    </a-card>-->
    <!-- {{ BasePlanInformation }} -->
    <!-- {{PlanInformation}} -->
    <a-card size="small" :bordered="false" title="计划详情" style="margin-bottom: 20px">
      <div v-if="isPlanInformation == true">
        <a-collapse v-model="activeKey" class="collaps" expand-icon-position="right">
          <a-collapse-panel v-for="item of PlanInformation" :key="item.plancode">
            <div slot="header">
              <a-row>
                <!-- <a-col :span="2">{{item.title}}:</a-col> -->
                <a-col :span="22">
                  <a-descriptions size="small">
                    <a-descriptions-item style="padding-bottom: 0px" label="计划名称">{{
                      item.planname
                    }}</a-descriptions-item>
                    <a-descriptions-item style="padding-bottom: 0px" label="投保人数"
                      >{{ item.insurenum }}人</a-descriptions-item
                    >
                    <a-descriptions-item style="padding-bottom: 0px" label="保费小计"
                      >{{ item.sum }}元/人*{{ item.insurenum }}人={{
                        item.sum | sum(item.insurenum)
                      }}元</a-descriptions-item
                    >
                  </a-descriptions>
                </a-col>
              </a-row>
            </div>
            <a-descriptions :column="{ xxl: 4, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 }">
              <a-descriptions-item label="员工类型">{{ item.ptype }}</a-descriptions-item>
              <a-descriptions-item label="社保情况">{{ item.socialscy }}</a-descriptions-item>
              <a-descriptions-item label="平均年龄（岁）">{{ item.aveage }}</a-descriptions-item>
              <a-descriptions-item label="本计划期望保费（元/人）">{{ item.premium }}</a-descriptions-item>
              <a-descriptions-item label="职业类别">{{ item.jobtype }}</a-descriptions-item>
              <a-descriptions-item label="工种描述" span="3">{{ item.worktype }}</a-descriptions-item>
              <a-descriptions-item v-if="item.shareamount" label="110门诊、住院是否共用保额">是</a-descriptions-item>
            </a-descriptions>
            <!-- {{item.planTableData}} -->
            <!-- planTableData -->
            <!-- 计划信息 -->
            <!-- <plan-table :planTableData="item.planTableData"></plan-table> -->
            <plan-table @handle-change="getPlanData" :planTableData="item.inquiryVoList"></plan-table>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div v-else>数据疯狂加载中...</div>
    </a-card>
    <a-card size="small" :bordered="false" title="核保管理" style="margin-bottom: 20px">
      <a-form-model v-bind="layout" :model="ruleForm" :rules="rules" ref="ruleForm">
        <a-row>
          <a-col>
            <a-form-model-item label="评估过程" prop="assess">
              <a-input
                v-model="ruleForm.assess"
                type="textarea"
                :rows="2"
                @change="onChange"
                placeholder="请输入核保过程"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item label="上传附件" prop="">
              <div class="clearfix">
                <a-upload :file-list="hbfileList" :remove="handleRemove" :before-upload="beforeUpload">
                  <a-button> <a-icon type="upload" /> 选择核保附件 </a-button>
                </a-upload>
                <a-button
                  type="primary"
                  :disabled="hbfileList.length === 0"
                  :loading="uploading"
                  style="margin-top: 16px"
                  @click="handleUpload"
                >
                  {{ uploading ? 'Uploading' : '开始上传' }}
                </a-button>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="accessoryList.length">
          <a-col>
            <a-form-model-item label="核保附件" prop="">
              <a-table
                size="small"
                bordered
                row-key="id"
                :columns="hbColumns"
                :data-source="accessoryList"
                :pagination="false"
              >
                <template slot="operation" slot-scope="text, record">
                  <a-popconfirm v-if="accessoryList.length" title="Sure to delete?" @confirm="() => onDelete(record)">
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                  |
                  <a href="javascript:;" @click="Download(record)">下载文件</a>
                </template>
              </a-table>
              <a-button v-if="accessoryList.length" type="primary" icon="download" @click="onDownloadfile">
                下载核保附件
              </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- {{accessoryList}} -->
      </a-form-model>
    </a-card>
    <a-card size="small" :bordered="false" style="margin-bottom: 20px">
      <div slot="title">
        <div class="header-wrap">
          <span class="tit">核保结果</span>
          <span class="sub-tit"></span>
        </div>
      </div>
      {{ ResultInformation }}
      <a-form-model v-bind="layout" :model="ruleForm" :rules="rules" ref="ruleForm">
        <a-row :gutter="24">
          <!-- 核保结论 -->
          <a-col :span="24">
            <a-form-model-item label="核保结论" prop="conclusion">
              <a-radio-group v-model="ruleForm.conclusion">
                <a-radio-button value="3">核保不通过</a-radio-button>
                <a-radio-button value="4">核保通过</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报价有效期">
              <a-input placeholder="90" style="width: 80px" v-model="ruleForm.loseEfficacy" />
              <span>天</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <!-- 核保意见 -->
          <a-col :span="24">
            <a-form-model-item label="核保意见" prop="applyopinion">
              <a-input
                v-model="ruleForm.applyopinion"
                type="textarea"
                :rows="2"
                @change="onChange"
                placeholder="请输入核保意见"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <!-- 特别约定 -->
          <a-col :span="24">
            <a-form-model-item label="特别约定" prop="speagree">
              <a-input
                v-model="ruleForm.speagree"
                type="textarea"
                :rows="2"
                @change="onChange"
                placeholder="请输入特别约定"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- {{Materials}} -->
        <a-row :gutter="24">
          <!-- 核保资料 -->
          <a-col :span="24">
            <a-form-model-item label="核保资料">
              <a-checkbox-group :default-value="this.defaultValues" style="width: 790px" @change="onChangeCheckbox">
                <a-row class="materials-item" v-for="item of Materials" :key="item.sort">
                  <a-col :span="6">
                    <a-checkbox :value="item.id">{{ item.type }}</a-checkbox>
                  </a-col>
                  <a-col :span="18">
                    <a-input v-model="item.remarks" :placeholder="item.defaulttip" @blur="getRemarks" />
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- <test></test> -->
      </a-form-model>

      <!-- <a-descriptions>
        <a-descriptions-item label="表格">有</a-descriptions-item>
      </a-descriptions>-->
    </a-card>
    <!-- {{hbData}} -->
    <div class="bootom-button">
      <a-button @click="onSave" type="primary">暂存</a-button>
      <a-button @click="onSubmit" style="margin-left: 20px" type="primary">处理完毕</a-button>
    </div>
    <!-- {{ruleForm}} -->
    <!-- {{okPlanInformation}} -->
    <!-- <test></test> -->
  </div>
</template>

<script>
import PlanTable from './PlanTable'
import { getAction, postAction, deleteAction, downloadFile, downloadFileH, downloadFileOne } from '@api/manage'
import NumberInfoVue from '../../../components/NumberInfo/NumberInfo.vue'

import Test from './Test'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default {
  components: {
    PlanTable,
    Test,
  },
  data() {
    return {
      accessoryList: [],
      hbfileList: [],
      uploading: false,
      loadIdentifyData: [],
      isPlanInformation: false,
      isPicList: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      filePicList: [],
      defaultValues: [],
      checkedValues: [],
      information: [],
      okPlanInformation: [],
      curplancode: '',
      prevplancode: '',
      hbData: [],
      placeholder: '请输入核保意见',
      ruleForm: {
        conclusion: '',
        tempsave: '', //新加一个参数tempsave，暂存传temp，提交传commit
        status: '', //2暂存, 3审核不通过, 4审核通过
        loseEfficacy: '90', //报价有效期天数
        applyopinion: '',
        proserialno: '',
        information: [], //核保资料
        speagree: '', //特别约定
        assess: '', //核保过程
      },
      rules: {
        //检验
        conclusion: [{ required: true, message: '请选择核保结论', trigger: 'change' }],
        applyopinion: [{ required: true, message: '请输入核保意见', trigger: 'blur' }],
      },
      submit_review_url: 'yf/audit/submitReview',
      Pdata: [],
      newPlanData: [],
      needDate: { inquiryVoList: [] },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
      },
      proserialno: '',
      UnitInformation: {},
      BusinessInformation: {},
      ResultInformation: '',
      Materials: '',
      PlanInformation: [],
      BasePlanInformation: [],
      business_info_url: 'yf/getInquiryBusinessInformation',
      unit_info_url: 'yf/getInquiryUnitInformation',
      result_url: 'yf/getInquiryResult',
      material_url: '/sys/information/queryall',
      plan_url: 'yf/getInquiryPlan',
      hbfile_upload_url: 'yf/upload',
      accessory_url: 'yf/getAccessory',
      delete_accessory_url: 'yf/delAccessoryByFileName',
      activeKey: ['1'],

      planDatas: [],
      expandIconPosition: 'left',

      hbColumns: [
        {
          title: '附件名',
          align: 'center',
          ellipsis: true,
          dataIndex: 'accessoryname',
        },
        {
          title: '上传时间',
          align: 'center',
          width: 200,
          ellipsis: true,
          dataIndex: 'createtime',
        },
        {
          title: '操作人',
          align: 'center',
          width: 100,
          ellipsis: true,
          dataIndex: 'operator',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'operation' },
        },
      ],

      // 标识信息
      identifyColumns: [
        {
          title: '状态',
          width: 80,
          align: 'center',
          dataIndex: 'status',
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
          width: 150,
          ellipsis: true,
          dataIndex: 'proname',
        },
        {
          title: '业务经理',
          align: 'center',
          width: 120,
          dataIndex: 'realname',
        },
        {
          title: 'tk工号',
          align: 'center',
          width: 110,
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
          width: 150,
          ellipsis: true,
          dataIndex: 'departname',
        },
        {
          title: '询价单号',
          align: 'center',
          width: 230,
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
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
    // 获取询价单号proserialno
    getProserialno() {
      if (this.$route.params.proserialno) {
        return this.$route.params.proserialno
      } else {
        this.$message.warning('必须获取询价单号')
        this.$router.push({ path: '/yf/quotation' })
      }
    },
  },
  filters: {
    sum(a, b) {
      return a * b
    },
  },

  methods: {
    // 单个核保附件下载
    Download(record) {
      console.log(record)
      let url = 'yf/downloadAccessoryByFilename'
      // let url = 'yf/downloadAccessoryZip'
      let fileName = record.accessoryname
      let parameter = {}

      parameter.filename = record.accessoryname
      parameter.proserialno = this.getProserialno
      downloadFileOne(url, fileName, parameter)
      // downloadFileH(url, fileName, parameter)
    },
    // 核保附件删除
    onDelete(record) {
      const dataSource = [...this.accessoryList]
      let that = this

      let params = {}
      params.proserialno = record.proserialno
      params.filename = record.accessoryname
      deleteAction(this.delete_accessory_url, params).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          that.accessoryList = dataSource.filter((item) => item.id !== record.id)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 附件上传
    handleRemove(file) {
      const index = this.hbfileList.indexOf(file)
      const newFileList = this.hbfileList.slice()
      newFileList.splice(index, 1)
      this.hbfileList = newFileList
    },
    beforeUpload(file) {
      this.hbfileList = [...this.hbfileList, file]
      return false
    },
    handleUpload() {
      const { hbfileList } = this
      const formData = new FormData()
      hbfileList.forEach((file) => {
        formData.append('files', file)
      })
      this.uploading = true

      let proserialno = this.getProserialno
      formData.append('proserialno', proserialno)
      // You can use any AJAX library you like
      postAction(this.hbfile_upload_url, formData).then((res) => {
        if (res.success) {
          this.hbfileList = []
          this.uploading = false
          this.$message.success(res.message)
          this.getAccessory()
        } else {
          this.uploading = false
          this.$message.error(res.message)
        }
      })
    },
    // 获取询价单完整信息
    getProserialData() {
      if (this.$route.params.proserialno) {
        this.loadIdentifyData.push(JSON.parse(JSON.stringify(this.$route.params)))
      } else {
        this.$message.warning('必须获取询价单号')
        this.$router.push({ path: '/yf/quotation' })
      }
    },
    // 业务附件下载
    downloadPic() {
      const fileName = '附件' //说白了就是给文件个名字
      this.props.dispatch({
        //发送请求
        type: '/yf/downloadImg',
        payload: {}, //参数
        callback: (response) => {
          //这块是下载的重点
          const blob = new Blob([response]) //创建blob对象
          const aLink = document.createElement('a') //创建a链接
          aLink.style.display = 'none'
          aLink.href = blob
          aLink.download = fileName
          document.body.appendChild(aLink)
          aLink.click()
          document.body.removeChild(aLink) //点击完成后记得删除创建的链接
        },
      })
    },
    onDownloadfile() {
      let url = 'yf/downloadAccessory'
      let fileName = this.getProserialno + '核保附件'
      let parameter = {}
      parameter.proserialno = this.getProserialno
      parameter.filename = fileName

      downloadFileH(url, fileName, parameter)
    },
    // 总保费计算
    getSum() {
      // console.log(this.okPlanInformation)
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    clickImg(e) {
      // console.log(e.currentTarget.src)
      this.previewImage = e.currentTarget.src
      this.previewVisible = true
      // this.showImg = true
      // this.imgSrc = e.currentTarget.src
    },

    getRemarks(value) {
      // console.log(this.checkedValues)
      // console.log(this.Materials)
    },
    // 获取选中核保资料数据
    getInformation() {
      let that = this
      let temp = {}
      let information = []
      this.checkedValues.forEach(function (current, index) {
        that.Materials.forEach(function (cur, idx) {
          if (current == cur.id) {
            temp.informationid = cur.id
            temp.remarks = cur.remarks
            temp.type = cur.type
            information.push(JSON.parse(JSON.stringify(temp)))
          }
        })
      })
      this.ruleForm.information = information
    },
    getPlanData(planData) {
      let that = this

      this.okPlanInformation.forEach(function (current, index) {
        let teOb = {}
        let tempOA = {}
        let auditRespList = []

        let sum = 0

        if (planData[0].plancode === current.plancode) {
          planData.forEach(function (currentLi, indexLi) {
            teOb.confList = currentLi.confList
            teOb.hbamount = currentLi.hbamount
            teOb.hbamountunit = currentLi.amountunit
            teOb.hbinsureamount = currentLi.hbinsureamount
            teOb.respcode = currentLi.respcode
            teOb.riskcode = currentLi.riskcode
            auditRespList.push(JSON.parse(JSON.stringify(teOb)))

            sum += Number(currentLi.hbamount)
          })

          current.auditRespList = auditRespList

          that.PlanInformation.forEach(function (cur, indx) {
            if (planData[0].plancode === cur.plancode) {
              cur.sum = sum
            }
          })
        }
      })
    },
    // 暂存
    onSave() {
      this.ruleForm.proserialno = this.getProserialno
      this.getInformation()
      // this.ruleForm.conclusion = this.ruleForm.status
      this.ruleForm.status = '2' //设置保存状态
      this.ruleForm.tempsave = 'temp'
      let params = {}

      params = this.ruleForm
      params.auditPlanList = this.okPlanInformation
      postAction(this.submit_review_url, params).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 处理完成
    onSubmit() {
      let that = this
      let isEmpty = false
      // 核保报价不为空
      this.okPlanInformation.forEach(function (current, index) {
        current.auditRespList.forEach(function (cur, indx) {
          if (cur.hbamount === null || cur.hbamount === '') {
            isEmpty = true
          }
        })
      })

      this.ruleForm.status = this.ruleForm.conclusion
      this.ruleForm.proserialno = this.getProserialno
      this.ruleForm.tempsave = 'commit'

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //审核不通过
          if (this.ruleForm.status === '3') {
            let params = {}
            // params.tempsave = 'commit'
            params.status = this.ruleForm.status
            params.conclusion = this.ruleForm.conclusion
            params.applyopinion = this.ruleForm.applyopinion
            params.speagree = this.ruleForm.speagree
            params.proserialno = this.getProserialno
            postAction(this.submit_review_url, params).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                setTimeout(() => {
                  this.$router.push('/yf/quotation')
                }, 1000)
              } else {
                this.$message.warning(res.message)
              }
            })
          } else if (this.ruleForm.status === '4') {
            //审核通过
            if (isEmpty) {
              this.$message.warning('核保报价不能为空')
            } else {
              this.getInformation()
              let params = {}
              params = this.ruleForm
              params.auditPlanList = this.okPlanInformation
              postAction(this.submit_review_url, params).then((res) => {
                if (res.success) {
                  this.$message.success(res.message)
                  setTimeout(() => {
                    this.$router.push('/yf/quotation')
                  }, 1000)
                } else {
                  this.$message.warning(res.message)
                }
              })
            }
          }
        } else {
          this.$message.warning('核保结论等必须信息未填写。')
          return false
        }
      })
    },

    onChangeCheckbox(checkedValues) {
      this.checkedValues = checkedValues
    },
    onChange(e) {
      console.log(e)
    },
    // 获取单位信息
    getInquiryUnitInformation() {
      var proserialno = this.getProserialno
      getAction(this.unit_info_url, { proserialno }).then((res) => {
        if (res.result != null) {
          this.UnitInformation = res.result.old
        }
      })
    },
    // 获取核保上传附件数据
    getAccessory() {
      var proserialno = this.getProserialno
      getAction(this.accessory_url, { proserialno }).then((res) => {
        this.accessoryList = res.result
      })
    },

    // 获取业务信息
    getInquiryBusinessInformation() {
      var proserialno = this.getProserialno
      getAction(this.business_info_url, { proserialno }).then((res) => {
        if (res.result != null) {
          this.BusinessInformation = res.result
          let tempOb = {}
          let temp = []
          if (res.result.fileList != '') {
            this.filePicList = res.result.fileList

            this.filePicList.forEach(function (current, index) {
              tempOb.uid = index
              tempOb.url = current.url
              temp.push(JSON.parse(JSON.stringify(tempOb)))
            })
            this.fileList = temp
          }
          this.isPicList = true
        }
      })
    },
    // 获取报价单的核保意见
    getInquiryResult() {
      // var proserialno='5301YF15960169700490011';
      var proserialno = this.getProserialno
      getAction(this.result_url, { proserialno }).then((res) => {
        this.ResultInformation = res.result

        // 读取暂存数据
        this.ruleForm.assess = res.result != null ? this.ResultInformation.assess : ''
        this.ruleForm.loseEfficacy = res.result != null ? this.ResultInformation.loseEfficacy : '90'
        this.ruleForm.speagree = res.result != null ? this.ResultInformation.speagree : ''
        this.ruleForm.applyopinion = res.result != null ? this.ResultInformation.applyopinion : ''
        this.ruleForm.conclusion = res.result != null ? this.ResultInformation.conclusion : ''
        //读取核保资料
        let that = this

        if (res.result != null && this.ResultInformation.information != []) {
          let information = this.ResultInformation.information
          information.forEach(function (current, index) {
            that.defaultValues.push(current.informationid)
            that.Materials.forEach(function (cur, ind) {
              if (current.informationid === cur.id) {
                cur.remarks = current.remarks
              }
            })
          })
        } else {
          // console.log('资料为空')
        }
        this.checkedValues = this.defaultValues
      })
    },
    // 获取核保材料
    getMaterial() {
      var proserialno = this.getProserialno
      let that = this
      getAction(this.material_url, { proserialno }).then((res) => {
        this.Materials = res.result
      })
    },
    // 获取计划信息数据
    getInquiryPlan() {
      var proserialno = this.getProserialno
      getAction(this.plan_url, { proserialno }).then((res) => {
        if (res.result != null) {
          this.PlanInformation = res.result
          this.BasePlanInformation = res.result //保存最原始计划列表
          // 初始化折叠面板
          let actKey = []
          this.PlanInformation.forEach(function (current, index) {
            actKey.push(current.plancode)
          })
          // console.log(this.PlanInformation)
          this.activeKey = actKey
          this.changeDate() //调用函数处理数据
          this.isPlanInformation = true
        }
      })
    },
    // 计划数据处理
    changeDate: function () {
      let that = this
      let newDate = JSON.parse(JSON.stringify(this.PlanInformation))
      newDate.forEach(function (current, index) {
        let temp = []
        let tempOb = {}
        let planOb = {}
        current.inquiryVoList.forEach(function (currentVolist, indexVolist) {
          currentVolist.riskListVo.forEach(function (currentVo, indexVo) {
            // console.log(currentVo.riskcode)
            // 判断是否共用医保
            if (currentVo.riskcode == '110' && currentVo.shareamount == '1') {
              planOb.shareamount = '1'
            }
            currentVo.respList.forEach(function (currenList, indexLi) {
              if (currenList.confList != null) {
                tempOb.key = indexLi + '-' + currentVo.riskcode + currenList.respcode
                tempOb.riskcode = currentVo.riskcode
                tempOb.respcode = currenList.respcode
                tempOb.respcodename =
                  currenList.respcode + '-' + currenList.resptolname + '(' + currenList.respshort + ')'
                tempOb.insureamount = currenList.insureamount
                tempOb.amountunit = currenList.amountunit
                tempOb.hbinsureamount =
                  currenList.hbinsureamount == null ? currenList.insureamount : currenList.hbinsureamount
                tempOb.hbamount = currenList.hbamount
                tempOb.plancode = current.plancode

                currenList.confList.forEach(function (cur, indx) {
                  if (cur.hbvalue == null) {
                    cur.hbvalue = cur.levelvalue
                  }
                })

                tempOb.confList = currenList.confList
              } else {
                tempOb.key = indexLi + '-' + currentVo.riskcode + currenList.respcode
                tempOb.riskcode = currentVo.riskcode
                tempOb.respcode = currenList.respcode
                tempOb.respcodename =
                  currenList.respcode + '-' + currenList.resptolname + '(' + currenList.respshort + ')'
                tempOb.insureamount = currenList.insureamount
                tempOb.amountunit = currenList.amountunit
                tempOb.hbinsureamount =
                  currenList.hbinsureamount == null ? currenList.insureamount : currenList.hbinsureamount
                tempOb.hbamount = currenList.hbamount
                tempOb.plancode = current.plancode
                tempOb.confList = null
                // temp.push(JSON.parse(JSON.stringify(tempOb)))
              }
              // console.log(tempOb)

              // 判断险种及其责任是否显示
              if (currentVo.confoption === '1' && currenList.isconfig === '0') {
                // 不显示
                tempOb = {}
              } else {
                // 显示
                temp.push(JSON.parse(JSON.stringify(tempOb)))
              }
            })
          })
        })

        planOb.inquiryVoList = temp
        planOb.planname = current.planname
        planOb.plancode = current.plancode
        planOb.key = index++
        planOb.ptype = current.ptype
        planOb.socialscy = current.socialscy
        planOb.insurenum = current.insurenum
        planOb.aveage = current.aveage
        planOb.jobtype = current.jobtype
        planOb.worktype = current.worktype
        planOb.premium = current.premium
        planOb.sum = 0
        temp.forEach(function (curr, indx) {
          if (curr.hbamount != null) {
            planOb.sum += Number(curr.hbamount)
          }
        })

        that.newPlanData.push(JSON.parse(JSON.stringify(planOb)))
      })
      this.PlanInformation = this.newPlanData

      //提交核保计划信息数据
      this.PlanInformation.forEach(function (current, index) {
        let teOb = {}
        let tempOA = {}
        let auditRespList = []

        current.inquiryVoList.forEach(function (currentLi, indexLi) {
          teOb.confList = currentLi.confList
          teOb.hbamount = currentLi.hbamount
          teOb.hbamountunit = currentLi.amountunit
          teOb.hbinsureamount = currentLi.hbinsureamount
          teOb.respcode = currentLi.respcode
          teOb.riskcode = currentLi.riskcode
          auditRespList.push(JSON.parse(JSON.stringify(teOb)))
        })

        tempOA.plancode = current.plancode
        tempOA.auditRespList = auditRespList

        that.okPlanInformation.push(JSON.parse(JSON.stringify(tempOA)))
      })
    },
  },
  watch: {
    activeKey(key) {
      // console.log(key)
    },
  },
  created() {
    if (this.$route.params.proserialno != '') {
      this.proserialno = this.$route.params.proserialno
    } else {
      this.$message.warning('无法获取询价单号')
    }
    this.getProserialData()
    this.getInquiryUnitInformation()
    this.getInquiryBusinessInformation()
    this.getInquiryResult()
    this.getInquiryPlan()
    this.getMaterial()
    this.getSum()
    this.getAccessory()
  },
}
</script>

<style lang="less">
.title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 10px 16px;
  overflow-wrap: break-word;
}

// .collaps .ant-descriptions-row > th, .ant-descriptions-row > td {
//     padding-bottom: 0px;
// }

// .drawer-bootom-button {
//   position: absolute;
//   bottom: -8px;
//   width: 100%;
//   border-top: 1px solid #e8e8e8;
//   padding: 10px 16px;
//   text-align: right;
//   left: 0;
//   background: #fff;
//   border-radius: 0 0 2px 2px;
// }

.header-wrap .sub-tit {
  color: #ccc;
  font-size: 14px;
  margin-left: 10px;
}
.materials-item {
  margin-bottom: 10px;
}
.operation .ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.operation .ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.operation .ant-upload-list-item-actions .anticon-delete {
  display: none;
}
.filelist-item {
  float: left;
  width: 104px;
  height: 104px;
  margin: 0 8px 8px 0;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
}
.filelist-item img {
  position: static;
  display: block;
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
}
</style>
