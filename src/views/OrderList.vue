<template>
  <div class="orderListMain">
    <el-container>
      <el-main>
        <div class="form-box">
          <el-form ref="form" :model="form" label-width="120px" size="mini" inline>
            <el-form-item label="订单编号">
              <el-input v-model="form.order_sn"></el-input>
            </el-form-item>
            <el-form-item label="收件人姓名">
              <el-input v-model="form.logistics_address_name"></el-input>
            </el-form-item>
            <el-form-item label="收件人手机号">
              <el-input v-model="form.logistics_address_phone"></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="form.order_state" placeholder="请选择">
                <el-option
                    v-for="item in order_state_option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-select v-model="form.cat_id" placeholder="请选择">
                <el-option-group
                    v-for="group in cat_option"
                    :key="group.label"
                    :label="group.label">
                  <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="订单入口">
              <el-select v-model="form.son_into_type" placeholder="请选择">
                <el-option
                    v-for="item in son_into_type_option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="goSearch(true,page,limit)">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="button-box">
          <el-form ref="form" :model="importForm" label-width="120px" size="mini" inline>
            <el-form-item label="订单状态">
              <el-select v-model="importForm.order_state" placeholder="请选择">
                <el-option
                    v-for="item in order_state_option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-select v-model="form.cat_id" placeholder="请选择">
                <el-option-group
                    v-for="group in cat_option"
                    :key="group.label"
                    :label="group.label">
                  <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="订单入口">
              <el-select v-model="importForm.son_into_type" placeholder="请选择">
                <el-option
                    v-for="item in son_into_type_option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-date-picker
                  v-model="importForm.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="importOrder">导出订单</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-box">
          <el-table
              :data="tableData"

              stripe
              border
              style="width: 100%">
            <el-table-column
                prop="order_sn"
                label="订单号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="son_into_type_name"
                label="订单入口"
                width="120">
            </el-table-column>
            <el-table-column
                prop="cat_name"
                label="分类"
                width="120">
            </el-table-column>
            <el-table-column
                prop="order_price"
                label="订单金额"
                width="80">
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间"
                width="180">
            </el-table-column>
            <el-table-column
                label="订单状态"
                width="120">
              <template slot-scope="scope">
                <p>{{order_state_info[scope.row.order_state]}}</p>
              </template>
            </el-table-column>
            <el-table-column
                prop="logistics_name"
                label="收件人"
                width="100">
            </el-table-column>
            <el-table-column
                prop="logistics_tel"
                label="手机号"
                width="180">
            </el-table-column>

            <el-table-column
                fixed="right"
                label="操作"
                width="250">
              <template slot-scope="scope">
                <el-button type="text" size="small"
                           @click.native.prevent="seeOrder(scope.$index, tableData)">查看
                </el-button>
                <el-button type="text" size="small" v-if="tableData[scope.$index].order_state === 1"
                           @click.native.prevent="callOrder(scope.$index, tableData)">取消订单
                </el-button>
                <el-button type="text" size="small" v-if="tableData[scope.$index].order_state === 0"
                           @click.native.prevent="delOrder(scope.$index, tableData)">删除订单
                </el-button>
                <el-button type="text" size="small"
                           @click.native.prevent="payQuery(scope.$index, tableData)">支付查询
                </el-button>
                <el-button type="text" size="small"
                           @click.native.prevent="toEditLogistics(scope.$index, tableData)">编辑物流
                </el-button>
                <el-button type="text" size="small"
                           v-if="tableData[scope.$index].order_state === 2 ||tableData[scope.$index].order_state === 4"
                           @click.native.prevent="changeOrderStateAfterSale(scope.$index, tableData)">申请售后
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <el-footer>
        <div class="my-el-pagination">
          <el-pagination
              v-if="showPagination"
              @size-change="(pageSize)=>{
              goSearch(true,1,pageSize)
          }"
              @current-change="(page)=>{
              goSearch(false,page,this.limit)
          }"
              :current-page="page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="limit"
              layout="sizes, prev, pager, next"
              :total="count">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
    import zipcelx from 'zipcelx';

    export default {
        name: "OrderList",
        data() {
            return {
                showPagination: true,
                form: {
                    order_sn: '',
                    logistics_address_name: '',
                    logistics_address_phone: '',
                    order_state: 'all',
                    son_into_type: "all",
                    car_id: 0,
                },
                importForm: {
                    order_state: 'all',
                    son_into_type: "all",
                    date: "",
                    car_id: 0,
                },
                order_state_option: [
                    {value: 'all', label: '所有订单'},
                    {value: 'pending_pay', label: '待支付订单'},
                    {value: 'pending_delivery', label: '待发货'},
                    {value: 'pending_take', label: '待收货'},
                    {value: 'pending_service', label: '退换售后'},
                ],
                son_into_type_option: [
                    {value: 'all', label: '所有入口'},
                    {value: 'wx', label: '微信入口'},
                    {value: 'abc_wx', label: '农行公众号'},
                    {value: 'abc_app', label: '农行app'},
                    {value: 'ios', label: 'ios客户端'},
                    {value: 'android', label: 'android客户端'},
                    {value: 'pc', label: 'pc端'},
                ],
                tableData: [],
                page: 1,
                limit: 10,
                count: 0,
                order_state_info: {
                    0: "已取消",
                    1: "未支付",
                    2: "已支付未发货",
                    3: "已支付已发货",
                    4: "已支付已收货",
                    5: "已评价",
                    6: "申请售后",
                    7: "售后失败",
                    8: "售后成功",
                },
            };
        },
        computed: {
            cat_option: {
                get: function () {
                    let result = [];
                    if (this.$store.state.cat_list.length > 0) {
                        this.$store.state.cat_list.forEach(item => {
                            this.$store.state.cat_list.forEach(item2 => {
                                if (item.parent_id == item2.cat_id) {
                                    /*检查是存在该分类*/
                                    let result_flag = true;
                                    result.forEach((item3, i3) => {
                                        if (item3.label === item2.cat_name) {
                                            result[i3].options.push({value: item.cat_id, label: item.cat_name});
                                            result_flag = false;
                                        }
                                    });
                                    if (result_flag) {
                                        let option = {};
                                        option.label = item2.cat_name;
                                        option.options = [];
                                        option.options.push({value: item.cat_id, label: item.cat_name});
                                        result.push(option);
                                    }
                                }

                            })
                        })
                    }
                    result.push({
                        label: '全部',
                        options: [{
                            value: 0,
                            label: '所有分类'
                        }]
                    });
                    return result;
                }
            }
        },
        created() {
            if (this.$store.state.cat_list.length < 1) {
                this.$store.dispatch("getCatList", this.$store.state.gl_cms_token);
            }
        },
        beforeRouteEnter(to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            next(vm => {
                vm.urlUpdate(to);
            });
        },
        beforeRouteUpdate(to, from, next) {
            this.urlUpdate(to);
            next();
        },
        methods: {
            urlUpdate(url) {
                if (!url || !url.query || Object.keys(url.query).length === 0) {
                    //this.form = Object.create(originForm);
                    this.page = 1;
                    this.limit = 10;
                } else {
                    this.$set(this, 'page', parseInt(url.query.page));
                    //this.page = parseInt(url.query.page);
                    this.$set(this, 'limit', parseInt(url.query.limit));
                    for (let variable in url.query) {
                        if (this.form.hasOwnProperty(variable) && url.query[variable]) {
                            this.form[variable] = url.query[variable];
                        }
                    }
                }
                this.getList();
            },
            getList() {
                this.showPagination = false;
                let m_loading = this.$loading({
                    text: '加载中'
                });
                this.$fetch('cms_get_order_list', {
                    admin_token: this.$store.state.gl_cms_token,
                    page: this.page,
                    limit: this.limit,
                    order_sn: this.form.order_sn.replace(/\s+/g, ""),
                    logistics_address_name: this.form.logistics_address_name.replace(/\s+/g, ""),
                    logistics_address_phone: this.form.logistics_address_phone.replace(/\s+/g, ""),
                    order_state: this.form.order_state.replace(/\s+/g, ""),
                    son_into_type: this.form.son_into_type.replace(/\s+/g, ""),
                    cat_id: this.form.cat_id,
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg.list);
                        this.$set(this, 'count', msg.count);
                        this.showPagination = true;
                        m_loading.close();
                    })
            },
            goSearch(isInit, page, limit) {
                let params = Object.create(this.form);
                Object.defineProperty(params, 'page', {
                    value: page,
                    enumerable: true
                });
                Object.defineProperty(params, 'limit', {
                    value: limit,
                    enumerable: true,
                });
                this.$router.push({path: '/OrderList', query: params});
            }
            /*导出订单*/
            , importOrder() {
                if (!this.importForm.date) {
                    this.$message({
                        message: '请选择下单日期',
                        type: 'warning'
                    });
                    return false;
                }
                // ms时间戳
                //console.log(typeof(Date.parse(this.importForm.date[0])));
                let m_loading = this.$loading({
                    text: '导出中'
                });
                this.$fetch('cms_import_order_list', {
                    admin_token: this.$store.state.gl_cms_token,
                    order_state: this.importForm.order_state.replace(/\s+/g, ""),
                    son_into_type: this.importForm.son_into_type.replace(/\s+/g, ""),
                    start_time: Date.parse(this.importForm.date[0]) / 1000,
                    end_time: Date.parse(this.importForm.date[1]) / 1000 + 86400,
                    cat_id: this.importForm.car_id,
                })
                    .then((msg) => {
                        let orderData = this.frontImportOrder(msg.list);
                        let config = {
                            filename: 'importOrderList',
                            sheet: {
                                data: orderData,
                            }
                        };
                        zipcelx(config);
                        m_loading.close();

                    })
            }
            /*导出订单之前处理*/
            , frontImportOrder(orderDataList) {

                /*订单号、订单金额、订单时间、付款金额、券、物流信息、收件人、手机号、地址、订单入口、订单状态*/
                let result = [];
                result.push([
                    {value: "订单号", type: "string"},
                    {value: "订单状态", type: "string"},
                    {value: "下单时间", type: "string"},
                    {value: "付款时间", type: "string"},
                    {value: "付款方式", type: "string"},
                    {value: "订单金额", type: "string"},
                    {value: "使用优惠券金额", type: "string"},
                    {value: "实际付款金额", type: "string"},
                    {value: "收件人", type: "string"},
                    {value: "手机号", type: "string"},
                    {value: "地址", type: "string"},
                    {value: "商品分类", type: "string"},
                    {value: "订单入口", type: "string"},]);
                if (orderDataList instanceof Array && orderDataList.length > 0) {
                    orderDataList.forEach((item) => {
                        result.push([
                            {value: item.order_sn, type: "string"},
                            {value: this.order_state_info[item.order_state], type: "string"},
                            {value: item.create_time, type: "string"},
                            {value: item.pay_time, type: "string"},
                            {value: item.pay_name + item.bystages_val, type: "string"},
                            {value: item.original_order_price, type: "string"},
                            {
                                value: (parseFloat(item.original_order_price) - parseFloat(item.after_using_coupon_price)).toFixed(2),
                                type: "string"
                            },
                            {value: item.order_price, type: "string"},
                            {value: item.logistics_name, type: "string"},
                            {value: item.logistics_tel, type: "string"},
                            {value: item.logistics_address, type: "string"},
                            {value: item.cat_name, type: "string"},
                            {value: item.son_into_type_name, type: "string"},
                        ])
                    })
                }

                return result;
            }
            /*取消订单*/
            , callOrder(index, rows) {
                let order_sn = rows[index].order_sn;
                this.$confirm('确认取消订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_call_order', {admin_token: this.$store.state.gl_cms_token, order_sn: order_sn})
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '处理成功!'
                                });
                                this.getList();
                            }
                            m_loading.close();
                        })
                });
            }
            /*删除订单*/
            , delOrder(index, rows) {
                let order_sn = rows[index].order_sn;
                this.$confirm('确认删除订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_del_order', {admin_token: this.$store.state.gl_cms_token, order_sn: order_sn})
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '处理成功!'
                                });
                                this.getList();
                            }
                            m_loading.close();
                        })
                });
            }
            /*支付查询*/
            , payQuery(index, rows) {
                let order_sn = rows[index].order_sn;
                this.$confirm('请勿频繁操作', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$fetch('cms_pay_query', {admin_token: this.$store.state.gl_cms_token, order_sn: order_sn})
                        .then((msg) => {
                            m_loading.close();
                            this.$alert(msg, '查询结果', {
                                confirmButtonText: '确定'
                            });
                        })
                });
            }
            /*申请售后*/
            , changeOrderStateAfterSale(index, rows) {
                let order_sn = rows[index].order_sn;
                this.$confirm('如非必要，请勿主动更改订单状态', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_change_order_state_after_sale', {
                        admin_token: this.$store.state.gl_cms_token,
                        order_sn: order_sn
                    })
                        .then((msg) => {
                            m_loading.close();
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '处理成功!'
                                });
                            }

                        })
                });
            }
            /*导航到编辑物流*/
            , toEditLogistics(index, rows) {
                let order_info = rows[index];
                this.$router.push({
                    path: '/EditLogistics',
                    query: {
                        order_sn: order_info.order_sn,
                    }
                });
            }
            /*导航到订单详情*/
            , seeOrder(index, rows) {
                //let order_info = JSON.stringify(rows[index]);
                this.$router.push({
                    path: '/seeOrder',
                    query: {
                        order_sn: rows[index].order_sn
                    }
                });

            }
        },
    };
</script>
<style lang="scss" scoped>
  .orderListMain {
    /*.form-box {
      margin-top: 20px;
    }

    .my-el-pagination {
      z-index: 10;
      position: fixed;
      bottom: 0;
    }*/
  }

</style>