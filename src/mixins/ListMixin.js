/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { filterObj } from '@/utils/util';
import { deleteAction, getAction, downFile, getFileAccessHttpUrl, postAction } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"

export const ListMixin = {
    data() {
        return {
            //token header
            tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
            /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
            queryParam: {},
            /* 数据源 */
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
            /* 高级查询条件生效状态 */
            superQueryFlag: false,
            /* 高级查询条件 */
            superQueryParams: '',
            /** 高级查询拼接方式 */
            superQueryMatchType: 'and',
        }
    },
    created() {
        if (!this.disableMixinCreated) {
            console.log(' -- mixin created -- ')
            this.loadData();
            // this.loadOptions();

        }
    },
    methods: {
        loadOptions() {
            console.log('jinglai');
            const url = '/sys/saleschannels/queryall';
            var params = '';
            getAction(url, params).then((res) => {
                if (res.success) {
                    console.log(res)
                }
                if (res.code === 510) {
                    this.$message.warning(res.message)
                }
                this.loading = false
            })
        },

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

        getQueryParams() {
            //获取查询条件
            let sqp = {}
            if (this.superQueryParams) {
                sqp['superQueryParams'] = encodeURI(this.superQueryParams)
                sqp['superQueryMatchType'] = this.superQueryMatchType
            }
            var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
            param.field = this.getQueryField();
            param.pageNo = this.ipagination.current;
            param.pageSize = this.ipagination.pageSize;
            return filterObj(param);
        },
        getQueryField() {
            //TODO 字段权限控制
            var str = "id,";
            this.columns.forEach(function(value) {
                str += "," + value.dataIndex;
            });
            return str;
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