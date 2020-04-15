<template>
  <div class="main">
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="物流单号" prop="cat_name">
          <el-input v-model="form.logistics_sn"></el-input>
        </el-form-item>
        <el-form-item label="订单号" prop="cat_name">
          <el-input v-model="form.order_sn" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="cat_name">
          <el-input v-model="form.order_state" disabled></el-input>
          <el-alert
              title="订单状态：0已取消，1未支付，2已支付未发货，3已支付已发货，4已支付已收货，5已评价，6申请售后，7售后失败，8售后成功"
              type="success">
          </el-alert>
        </el-form-item>
        <el-form-item label="发货时间" prop="cat_name">
          <el-input v-model="form.deliver_goods_time" disabled></el-input>
        </el-form-item>
        <el-form-item label="物流名称" prop="cat_id">
          <el-select v-model="form.logistics_code" placeholder="请选择">
            <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人姓名" prop="cat_name">
          <el-input v-model="form.logistics_name"></el-input>
        </el-form-item>
        <el-form-item label="收件人手机号" prop="cat_name">
          <el-input v-model="form.logistics_tel"></el-input>
        </el-form-item>
        <el-form-item label="收件地址" prop="cat_name">
          <el-input v-model="form.logistics_address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" v-if="form.order_state === 2" @click="deliveryOrder">确认发货</el-button>
          <el-button type="primary" @click="updLogistics">只是修改</el-button>
          <el-alert
              title="“确认发货”会将订单状态设置为已发货，并更新发货时间；“只是修改”不更新订单状态，只更新物流信息"
              type="warning">
          </el-alert>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {},
                option: [
                    {label: '顺丰速递', value: 'shunfeng'},
                    {label: '邮政小包', value: 'youzhenxiaobao'},
                    {label: '百世快递', value: 'bestex'},
                    {label: '邮政', value: 'ems'},
                ],
            };
        },
        computed: {},
        created() {
            this.order_sn = this.$route.query.order_sn;
            this.getOrderInfo(this.order_sn);


        },
        methods: {
            getOrderInfo(order_sn) {
                this.$fetch('cms_get_order_info', {
                    admin_token: this.$store.state.gl_cms_token,
                    order_sn: order_sn
                })
                    .then((msg) => {
                        if (msg) {
                            this.form = msg;
                        }
                    })
            },
            /*订单发货*/
            deliveryOrder() {
                /* (new CurrencyValidate())
                ->myGoCheck(['order_sn', 'logistics_code', 'logistics_name', 'logistics_tel', 'logistics_address', 'logistics_sn'], 'require');*/
                let m_loading = this.$loading({
                    text: '处理中'
                });
                let post_info = this.form;
                post_info.admin_token = this.$store.state.gl_cms_token;
                this.$post('cms_delivery_order', post_info)
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.$router.go(-1);
                        }
                        m_loading.close();
                    });


            }
            /*编辑物流信息*/
            , updLogistics() {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                let post_info = this.form;
                post_info.admin_token = this.$store.state.gl_cms_token;
                this.$post('cms_upd_logistics', post_info)
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.$router.go(-1);
                        }
                        m_loading.close();
                    });


            }
        },
    };
</script>

<style lang="scss" scoped>
  .form-box {
    width: 70%;
    margin-top: 50px;
  }
</style>