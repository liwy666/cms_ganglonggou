<template>
	<div class="main">
		<div class="button-box">
			<el-button type="primary" @click="add">
				添加搜索记录
			</el-button>
		</div>
		<el-table
			:data="tableData"
			height="850px"
			stripe
			border
			style="width: 100%">
			<el-table-column
				show-overflow-tooltip
				prop="search_keyword"
				label="关键词"
				width="300">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="search_count"
				label="搜索量"
				width="100">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="son_into_type"
				label="搜索来源"
				width="200">
			</el-table-column>
			<el-table-column
				fixed="right"
				label="操作"
			>
				<template slot-scope="scope">
					<el-button type="text" size="small"
						@click.native.prevent="del(scope.$index, tableData)">删除
					</el-button>
					<el-button type="text" size="small"
						v-show="tableData[scope.$index].is_verify === 0"
						@click.native.prevent="verify(scope.$index, tableData)">
						审核通过
					</el-button>
					<el-button type="text" size="small"
						v-show="tableData[scope.$index].is_verify === 1"
						@click.native.prevent="cancelVerify(scope.$index, tableData)">
						取消过审
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="img_url" alt="">
		</el-dialog>
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
                path: '/EditedSearchLog',
                dialogVisible: false,
                img_url: '',
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
            add() {
                this.$router.push(
                    {
                        path: this.path,
                        query: {edit_type: 'add'}
                    })
            }
            , getList() {
                let m_loading = this.$loading({
                    text: '加载中'
                });
                this.$fetch('cms_get_all_search_log', {
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
                let id = rows[index].id;
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_del_search_log', {admin_token: this.$store.state.gl_cms_token, id: id})
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
            , verify(index, rows) {
                let id = rows[index].id;
                this.$confirm('确认通过审核?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_verify_search_log', {admin_token: this.$store.state.gl_cms_token, id: id})
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '处理成功!'
                                });
                                rows[index].is_verify = 1;
                            }
                            m_loading.close();
                        })
                });
            }
            , cancelVerify(index, rows) {
                let id = rows[index].id;
                this.$confirm('确认取消审核通过?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_cancel_verify_search_log', {admin_token: this.$store.state.gl_cms_token, id: id})
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '处理成功!'
                                });
                                rows[index].is_verify = 0;
                            }
                            m_loading.close();
                        })
                });
            }

        },
    };
</script>
<style lang="scss" scoped>
</style>