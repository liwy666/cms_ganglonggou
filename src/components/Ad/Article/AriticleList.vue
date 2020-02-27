<template>
	<div class="main">
		<div class="button-box">
			<el-button type="primary" @click="add">
				添加文章
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
				prop="article_name"
				label="标题"
				width="300">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="click_count"
				label="点击量"
				width="300">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="add_time"
				label="添加时间"
				width="200">
			</el-table-column>
			<el-table-column
				fixed="right"
				label="操作"
				width="250">
				<template slot-scope="scope">
					<el-button type="text" size="small"
						v-if="tableData[scope.$index].allow_del === 1"
						@click.native.prevent="del(scope.$index, tableData)">删除
					</el-button>
					<el-button type="text" size="small"
						@click.native.prevent="upd(scope.$index, tableData)">编辑
					</el-button>
					<el-button type="text" size="small"
						@click.native.prevent="cleanCache(scope.$index, tableData)">清除缓存
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="img_url" alt="">
		</el-dialog>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                path: '/EditedArticle',
                tableData: [],
                dialogVisible: false,
                img_url: '',
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
            , upd(index, rows) {
                this.$router.push({
                    path: this.path,
                    query: {edit_type: 'upd', info: JSON.stringify(rows[index])}
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
                    this.$post('cms_del_article', {admin_token: this.$store.state.gl_cms_token, id: id})
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
            , cleanCache(index, rows) {
                let id = rows[index].id;
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('clean_user_article_cache', {article_id: id})
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                type: 'success',
                                message: '处理成功!'
                            });
                        }
                        m_loading.close();
                    })
            }
            , getList() {
                let m_loading = this.$loading({
                    text: '加载中'
                });
                this.$fetch('cms_get_all_article', {
                    admin_token: this.$store.state.gl_cms_token,
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg);
                        m_loading.close();
                    })
            }
            , showImg(index, rows, type) {
                switch (type) {
                    case 'logo':
                        this.img_url = rows[index].logo_img;
                        break;
                    case 'head':
                        this.img_url = rows[index].head_img;
                        break;
                }
                this.dialogVisible = true;
            }
        },
    };
</script>
<style lang="scss" scoped>
</style>