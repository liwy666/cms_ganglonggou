<template>
	<div class="main">
		<div class="table-box">
			<el-table
				:data="tableData"
				height="850px"
				stripe
				border
				style="width: 100%">
				<el-table-column
					prop="make_order_sn"
					label="订单号"
					width="180">
				</el-table-column>
				<el-table-column
					prop="make_state"
					label="处理状态"
					width="80">
				</el-table-column>
				<el-table-column
					prop="goods_id"
					label="商品id"
					width="80">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="goods_name"
					label="商品名称"
					width="150">
				</el-table-column>
				<el-table-column
					prop="sku_desc"
					label="预约规格"
					width="150">
				</el-table-column>
				<el-table-column
					prop="goods_number"
					label="预约数量"
					width="80">
				</el-table-column>
				<el-table-column
					prop="make_order_price"
					label="预约价格"
					width="100">
				</el-table-column>
				<el-table-column
					prop="make_name"
					label="姓名"
					width="100">
				</el-table-column>
				<el-table-column
					prop="make_phone"
					label="电话"
					width="150">
				</el-table-column>
				<el-table-column
					prop="make_time"
					label="时间"
					width="180">
				</el-table-column>
				<el-table-column
					prop="make_address"
					label="地址"
					width="150">
				</el-table-column>
				<el-table-column
					prop="make_remake"
					label="备注"
					width="150">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="180">
					<template slot-scope="scope">
						<el-button type="text" size="small"
							v-if="tableData[scope.$index].make_state === 0"
							@click.native.prevent="handleOrder(scope.$index, tableData)">处理订单
						</el-button>
						<el-button type="text" size="small"
							@click.native.prevent="delOrder(scope.$index, tableData)">删除
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
                this.$fetch('cms_get_make_order_list', {
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
            , delOrder(index, rows) {
                let make_order_sn = rows[index].make_order_sn;
                this.$confirm('确认删除订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_del_make_order', {
                        admin_token: this.$store.state.gl_cms_token,
                        make_order_sn: make_order_sn
                    })
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '处理成功!'
                                });
                                //删除操作
                                rows.splice(index, 1);
                            }
                            m_loading.close();
                        })
                });
            }
            , handleOrder(index, rows) {
                let make_order_sn = rows[index].make_order_sn;
                this.$confirm('确认处理订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_handle_make_order', {
                        admin_token: this.$store.state.gl_cms_token,
                        make_order_sn: make_order_sn
                    })
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '处理成功!'
                                });
                                //删除操作
                                //rows.splice(index, 1);
                                this.getList();
                            }
                            m_loading.close();
                        })
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