/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { filterObj } from '@/utils/util';
import { deleteAction, getAction, getActionQs, downFile, getFileAccessHttpUrl, postAction } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
// import qs from 'qs'
const qs = require('qs');
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
            if (!this.url.list) {
                this.$message.error("请设置url.list属性!")
                return
            }
            //加载数据 若传入参数1则加载第一页的内容
            if (arg === 1) {
                this.ipagination.current = 1;
            }
            var params = this.getQueryParams(); //查询条件
            this.loading = true;
            // 多选序列化
            getActionQs(this.url.list, params).then((res) => {
                if (res.success) {
                    this.dataSource = res.result.records;
                    this.ipagination.total = res.result.total;
                    // console.log(this.dataSource[0])
                }
                if (res.code === 510) {
                    this.$message.warning(res.message)
                }
                this.loading = false;
            })
        },



        // initDictConfig() {
        //     console.log("--这是一个假的方法!")
        // },
        // handleSuperQuery(params, matchType) {
        //     //高级查询方法
        //     if (!params) {
        //         this.superQueryParams = ''
        //         this.superQueryFlag = false
        //     } else {
        //         this.superQueryFlag = true
        //         this.superQueryParams = JSON.stringify(params)
        //         this.superQueryMatchType = matchType
        //     }
        //     this.loadData(1)
        // },
        getQueryParams() {
            //获取查询条件
            // let sqp = {}
            // if (this.superQueryParams) {
            //     sqp['superQueryParams'] = encodeURI(this.superQueryParams)
            //     sqp['superQueryMatchType'] = this.superQueryMatchType
            // }
            // var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
            // this.queryParam.channel = qs.stringify(this.queryParam.channel)
            var param = Object.assign(this.queryParam, this.isorter, this.filters);

            param.field = this.getQueryField();
            param.pageNo = this.ipagination.current;
            param.pageSize = this.ipagination.pageSize;
            return filterObj(param);
            // return param;
        },
        getQueryField() {
            //TODO 字段权限控制
            var str = "id,";
            this.columns.forEach(function(value) {
                str += "," + value.dataIndex;
            });
            return str;
        },

        onSelectChange(selectedRowKeys, selectionRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectionRows = selectionRows;
        },
        onClearSelected() {
            this.selectedRowKeys = [];
            this.selectionRows = [];
        },
        searchQuery() {
            console.log(this.queryParam)
            this.loadData(1);
        },
        superQuery() {
            this.$refs.superQueryModal.show();
        },
        searchReset() {
            this.queryParam = {}
            this.loadData(1);
        },

        addMyList: function() {
            if (this.selectedRowKeys.length <= 0) {
                console.log(this.selectionRows);
                this.$message.warning('请选择一条记录！');
                return;
            } else {
                var ids = "";
                for (var a = 0; a < this.selectedRowKeys.length; a++) {
                    ids += this.selectedRowKeys[a] + ",";
                }
                console.log(ids);
                // console.log(this.selectionRows);
                var proserialnos = '';
                // for (var a = 0; a < this.selectionRows.length; a++) {
                //     proserialnos += this.selectionRows[a] + ",";
                //     console.log(this.selectionRows[a]);
                // }

                this.selectionRows.forEach(function(row) {
                    proserialnos += row.proserialno + ",";
                })

                // this.$message.success(proserialnos);

                var formdata = new FormData();
                formdata.append("proserialnos", proserialnos);

                postAction(this.url.addMyList, formdata).then((res) => {
                    if (res.success) {
                        this.$message.success(res.message);
                        this.loadData();
                        // this.$router.replace
                        window.location.reload()
                            // this.loadMyData();
                        this.onClearSelected();
                    } else {
                        this.$message.warning(res.message);
                    }
                }).finally(() => {
                    this.loading = false;
                });
            }
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

        // handleToggleSearch() {
        //     this.toggleSearchStatus = !this.toggleSearchStatus;
        // },
    }

}