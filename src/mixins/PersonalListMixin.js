/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { filterObj } from '@/utils/util';
import { deleteAction, getAction, downFile, getFileAccessHttpUrl, postAction } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"

export const PublicListMixin = {
    data() {
        return {
            //token header
            tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
            /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
            queryParam: {},
            /* 公共池数据源 */
            dataSource: [],
            /* 分页参数 */
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条"
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            /* 排序参数 */
            isorter: {
                column: 'createTime',
                order: 'desc',
            },
            /* 筛选参数 */
            filters: {},
            /* table加载状态 */
            loading: false,
            /* table选中keys*/
            selectedRowKeys: [],
            /* table选中records*/
            selectionRows: [],
            /* 查询折叠 */
            toggleSearchStatus: false,
        }
    },
    created() {
        if (!this.disableMixinCreated) {
            console.log(' -- mixin created -- ')
            this.loadData();
            // this.loadMyData();
            // this.loadOptions();
            //初始化字典配置 在自己页面定义
            // this.initDictConfig();
        }
    },
    methods: {
        loadData(arg) {
            if (!this.url.mylist) {
                this.$message.error("请设置url.list属性!")
                return
            }
            //加载数据 若传入参数1则加载第一页的内容
            if (arg === 1) {
                this.ipagination.current = 1;
            }
            var params = this.getQueryParams(); //查询条件
            this.loading = true;
            getAction(this.url.mylist, params).then((res) => {
                if (res.success) {
                    this.dataSource = res.result.records;
                    this.ipagination.total = res.result.total;
                    console.log(this.dataSource[0])
                }
                if (res.code === 510) {
                    this.$message.warning(res.message)
                }
                this.loading = false;
            })
        },


        handleTableChange(pagination, filters, sorter) {
            //分页、排序、筛选变化时触发
            //TODO 筛选
            if (Object.keys(sorter).length > 0) {
                this.isorter.column = sorter.field;
                this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
            }
            this.ipagination = pagination;
            this.loadData();
        },
    }

}