<template>
	<div class = "main">
		<div class = "form-box">
			<el-form ref = "form" :model = "form" label-width = "120px" size = "mini" inline>
				<el-form-item label = "订单编号">
					<el-input v-model = "form.order_sn"></el-input>
				</el-form-item>
				<el-form-item label = "收件人姓名">
					<el-input v-model = "form.logistics_address_name"></el-input>
				</el-form-item>
				<el-form-item label = "收件人手机号">
					<el-input v-model = "form.logistics_address_phone"></el-input>
				</el-form-item>
				<el-form-item label = "商品分类" prop = "cat_id">
					<el-select v-model = "form.order_state" placeholder = "请选择">
						<el-option
							v-for = "item in order_state_option"
							:key = "item.value"
							:label = "item.label"
							:value = "item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type = "primary" @click = "getList">搜索</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-alert
			title = "订单状态：0已取消，1未支付，2已支付未发货，3已支付已发货，4已支付已收货，5已评价，6申请售后，7售后失败，8售后成功"
			type = "success">
		</el-alert>
		<div class = "table-box">
			<el-table
				:data = "tableData"
				height = "850px"
				stripe
				border
				style = "width: 100%">
				<el-table-column
					prop = "order_sn"
					label = "订单号"
					width = "180">
				</el-table-column>
				<el-table-column
					prop = "order_price"
					label = "订单金额"
					width = "200">
				</el-table-column>
				<el-table-column
					prop = "create_time"
					label = "创建时间"
					width = "180">
				</el-table-column>
				<el-table-column
					prop = "order_state"
					label = "订单状态"
					width = "100">
				</el-table-column>
				<el-table-column
					prop = "logistics_name"
					label = "收件人"
					width = "180">
				</el-table-column>
				<el-table-column
					prop = "logistics_tel"
					label = "手机号"
					width = "180">
				</el-table-column>
				<el-table-column
					prop = "son_into_type_name"
					label = "订单入口"
					width = "180">
				</el-table-column>
				<el-table-column
					fixed = "right"
					label = "操作"
					width = "250">
					<template slot-scope = "scope">
						<el-button type = "text" size = "small"
							@click.native.prevent = "seeOrder(scope.$index, tableData)">查看
						</el-button>
						<el-button type = "text" size = "small" v-if = "tableData[scope.$index].order_state === 1"
							@click.native.prevent = "callOrder(scope.$index, tableData)">取消订单
						</el-button>
						<el-button type = "text" size = "small" v-if = "tableData[scope.$index].order_state === 0"
							@click.native.prevent = "delOrder(scope.$index, tableData)">删除订单
						</el-button>
						<el-button type = "text" size = "small"
							@click.native.prevent = "payQuery(scope.$index, tableData)">支付查询
						</el-button>
						<el-button type = "text" size = "small"
							@click.native.prevent = "toEditLogistics(scope.$index, tableData)">编辑物流
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class = "my-el-pagination">
			<el-pagination
				@size-change = "getList"
				@current-change = "getList"
				:current-page.sync = "page"
				:page-sizes = "[10, 20, 30, 40]"
				:page-size.sync = "limit"
				layout = "sizes, prev, pager, next"
				:total = "count">
			</el-pagination>
		</div>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    order_sn: '',
                    logistics_address_name: '',
                    logistics_address_phone: '',
                    order_state: 'all'
                },
                order_state_option: [
                    {value: 'all', label: '所有订单'},
                    {value: 'pending_pay', label: '待支付订单'},
                    {value: 'pending_delivery', label: '待发货'},
                    {value: 'pending_take', label: '待收货'},
                    {value: 'pending_service', label: '退换售后'},
                ],
                tableData: [],
                page: 1,
                limit: 10,
                count: 0,
            };
        },
        computed: {},
        created() {
            this.getList();
        },
        methods: {
            getList() {
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
                    order_state: this.form.order_state.replace(/\s+/g, "")
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg.list);
                        this.$set(this, 'count', msg.count);
                        m_loading.close();
                    })
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
            /*导航到编辑物流*/
            , toEditLogistics(index, rows) {
                let order_info = rows[index];
                this.$router.push({
                    path: '/EditLogistics',
                    query: {
                        order_info: JSON.stringify(order_info),
                    }
                });
            }
            /*导航到订单详情*/
            , seeOrder(index, rows) {
                let order_info = JSON.stringify(rows[index]);
                this.$router.push({
                    path: '/seeOrder',
                    query: {
                        order_info: order_info
                    }
                });

            }
        },
    };
</script>
<style lang = "scss" scoped>
	.form-box {
		margin-top: 20px;
	}

	.my-el-pagination {
		z-index: 10;
		position: fixed;
		bottom: 0;
	}
</style>