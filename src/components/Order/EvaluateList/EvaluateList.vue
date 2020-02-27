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
					prop="is_allow"
					label="审核状态"
					width="80">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="goods_name"
					label="商品名称"
					width="500">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="sku_desc"
					label="规格"
					width="200">
				</el-table-column>
				<el-table-column
					prop="rate"
					label="评分"
					width="50">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="evaluate_text"
					label="评论"
					width="400">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="250">
					<template slot-scope="scope">
						<el-button type="text" size="small"
							v-if="tableData[scope.$index].is_allow === 0"
							@click.native.prevent="allow(scope.$index, tableData)">审核通过
						</el-button>
						<el-button type="text" size="small"
							@click.native.prevent="del(scope.$index, tableData)">删除
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
                this.$fetch('cms_get_evaluate_list', {
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
            , allow(index, rows) {
                let evaluate_id = rows[index].id;
                let goods_id = rows[index].goods_id;
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_allow_evaluate', {
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
                            this.getList();
                        }
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