<template>
	<div>
		<div class="table-box">
			<el-table
				:data="tableData"
				height="850px"
				stripe
				border
				style="width: 100%">
				<el-table-column
					prop="feed_back_type"
					label="反馈类型"
					width="180">
				</el-table-column>
				<el-table-column
					prop="problem_details"
					label="描述"
					width="200">
				</el-table-column>
				<el-table-column
					prop="contact"
					label="联系方式"
					width="180">
				</el-table-column>
				<el-table-column
					prop="add_time"
					label="提交时间"
					width="180">
				</el-table-column>
				<el-table-column
					width="300">
					<template slot-scope = "scope">
						<el-button type="text" size="small" v-for="(item,i) in tableData[scope.$index].img_files_url" :key="i"
							@click.native.prevent="showImg(scope.$index, tableData,i)">查看图片
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
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="img_url" alt="">
		</el-dialog>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                page: 1,
                limit: 10,
                count: 0,
                tableData: [],
                img_url: '',
                dialogVisible: false,
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
                this.$fetch('feed_back', {
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
            , showImg(index, rows,img_index) {
                this.img_url = rows[index].img_files_url[img_index];
                this.dialogVisible = true;
            }
		},
    };
</script>
<style lang="scss" scoped>
</style>