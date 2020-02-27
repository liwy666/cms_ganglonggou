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
					prop="user_id"
					label="Id"
					width="50">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="user_name"
					label="用户名"
					width="180">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="integral"
					label="积分"
					width="100">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="login_count"
					label="登录次数"
					width="100">
				</el-table-column>
				<el-table-column
					prop="login_ip"
					label="IP"
					width="150">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="login_time"
					label="登录时间"
					width="180">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="add_time"
					label="创建时间"
					width="180">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="name"
					label="姓名"
					width="150">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="email"
					label="email"
					width="180">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="phone"
					label="电话"
					width="180">
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
                this.$fetch('cms_get_user_list', {
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
            , del(index, rows) {
                let evaluate_id = rows[index].id;
                let goods_id = rows[index].goods_id;
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_del_evaluate', {
                    admin_token: this.$store.state.gl_cms_token,
                    evaluate_id: evaluate_id,
                    goods_id: goods_id
                })
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                type: 'success',
                                message: '处理成功!'
                            });
                            rows.splice(index, 1);
                        }
                        m_loading.close();
                    })
            }
        },
    };
</script>

<style lang="scss" scoped>

</style>