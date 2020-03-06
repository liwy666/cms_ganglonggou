<template>
	<div class="main">
		<el-alert
			title="处理状态中，1代表已经退款，0需要处理"
			type="warning">
		</el-alert>
		<div class="table-box">
			<el-table
				:data="tableData"
				height="850px"
				stripe
				border
				style="width: 100%">
				<el-table-column
					prop="order_sn"
					label="订单号"
					width="180">
				</el-table-column>
				<el-table-column
					prop="is_allow"
					label="处理状态"
					width="100">
				</el-table-column>
				<el-table-column
					prop="allow_time"
					label="处理时间"
					width="200">
				</el-table-column>
				<el-table-column
					prop="create_time"
					label="提交时间"
					width="180">
				</el-table-column>
				<el-table-column
					prop="user_id"
					label="用户id"
					width="100">
				</el-table-column>
				<el-table-column
					prop="after_sale_cause"
					label="提交原因"
					width="180">
				</el-table-column>
				<el-table-column
					prop="after_sale_type"
					label="售后类型"
					width="180">
				</el-table-column>
				<el-table-column
					prop="after_sale_text"
					label="用户备注"
					width="180">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="200">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-if="tableData[scope.$index].is_allow === 0"
							@click.native.prevent="orderRefund(scope.$index, tableData)">开始退款
						</el-button>
						<el-button type="text" size="small" @click.native.prevent="seeOrder(scope.$index, tableData)">
							查看订单
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="my-el-pagination">
			<el-pagination
				@size-change="getList"
				@current-change="getList"
				:current-page.sync="page"
				:page-sizes="[10, 20, 30, 40]"
				:page-size.sync="limit"
				layout="sizes, prev, pager, next"
				:total="count">
			</el-pagination>
		</div>
	</div>
</template>
<script>
    export default {
        data() {
            return {
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
                this.$fetch('cms_get_after_sale_list', {
                    admin_token: this.$store.state.gl_cms_token,
                    page: this.page,
                    limit: this.limit,
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg.list);
                        this.$set(this, 'count', msg.count);
                        m_loading.close();
                    })
            }
            /*处理退款*/
            , orderRefund(index, rows) {
                let order_sn = rows[index].order_sn;
                let after_sale_id = rows[index].id;
                this.$confirm('确认退款?该操作不可撤回！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_order_refund', {
                        admin_token: this.$store.state.gl_cms_token,
                        order_sn: order_sn,
                        after_sale_id: after_sale_id
                    })
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
            /*导航到订单详情*/
            , seeOrder(index, rows) {
                let order_sn = rows[index].order_sn;
                this.$router.push({
                    path: '/seeOrder',
                    query: {
                        order_sn: order_sn
                    }
                });

            }
        },
    };
</script>
<style lang="scss" scoped>
	.my-el-pagination {
		z-index: 10;
		position: fixed;
		bottom: 0;
	}
</style>