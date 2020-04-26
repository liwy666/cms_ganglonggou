<template>
	<div class="main">
		<div class="button-box">
			<el-button type="primary"
				@click="$router.push({ path: 'EditCoupon', query: { edit_type: 'add',coupon_id:'0' }})">
				添加优惠券
			</el-button>
		</div>
		<div class="table-box">
			<el-table
				:data="tableData"
				height="850px"
				stripe
				border
				style="width: 100%">
				<el-table-column
					prop="coupon_name"
					label="优惠券名称"
					width="150">
				</el-table-column>
				<el-table-column
					prop="grant_type"
					label="优惠券类型"
					width="100">
				</el-table-column>
				<el-table-column
					prop="into_type"
					label="入口"
					width="50">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="coupon_desc"
					label="优惠券描述"
					width="150">
				</el-table-column>
				<el-table-column
					prop="start_grant_time"
					label="开始发放时间"
					width="200">
				</el-table-column>
				<el-table-column
					prop="end_grant_time"
					label="结束发放时间"
					width="180">
				</el-table-column>
				<el-table-column
					prop="start_use_time"
					label="开始使用时间"
					width="200">
				</el-table-column>
				<el-table-column
					prop="end_use_time"
					label="结束使用时间"
					width="200">
				</el-table-column>
				<el-table-column
					prop="coupon_number"
					label="优惠券数量"
					width="100">
				</el-table-column>
				<el-table-column
					prop="coupon_remainder_number"
					label="优惠券剩余数量"
					width="150">
				</el-table-column>
				<el-table-column
					prop="found_sum"
					label="满足金额"
					width="100">
				</el-table-column>
				<el-table-column
					prop="cut_sum"
					label="减免金额"
					width="100">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="180">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click.native.prevent="delCoupon(scope.$index, tableData)">
							删除优惠券
						</el-button>
						<el-button type="text" size="small" @click.native.prevent="editCoupon(scope.$index, tableData)">
							编辑优惠券
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
                this.$fetch('cms_get_coupon_list', {
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
            , editCoupon(index, rows) {
                this.$router.push({path: 'EditCoupon', query: {type: 'upd', couponId: rows[index]['coupon_id']}})
            }
            , delCoupon(index, rows) {
                let coupon_id = rows[index].coupon_id;
                this.$confirm('确认删除优惠券?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_del_coupon', {admin_token: this.$store.state.gl_cms_token, coupon_id: coupon_id})
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
        },
    };
</script>
<style lang="scss" scoped>
	.button-box {
		margin: 10px;
	}

	.my-el-pagination {
		z-index: 10;
		position: fixed;
		bottom: 0;
	}
</style>