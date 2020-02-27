<template>
	<div>
		<div class="button-box">
			<el-button type="primary"
					   @click="$router.push({ path: 'Edit618PC', query: { edit_type: 'add',index_id:'0' }})">
				添加广告
			</el-button>
			<el-button type="primary" @click="cleanCache">清除缓存</el-button>
		</div>
		<div class="table-box">
			<el-table
				:data="tableData"
				height="850px"
				stripe
				border
				style="width: 100%">
				<el-table-column
					prop="position_type"
					label="广告类型"
					width="200">
				</el-table-column>
				<el-table-column
					prop="position_type2"
					label="广告类型2"
					width="150">
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="position_type_name"
					label="楼层名称"
					width="80">
				</el-table-column>
				<el-table-column
					prop="father_position_name"
					label="父楼层名称"
					width="80">
				</el-table-column>
				<el-table-column
					prop="sort_order"
					label="排序"
					width="80">
				</el-table-column>
				<el-table-column
					prop="url"
					label="链接"
					width="200">
				</el-table-column>
				<el-table-column
					prop="goods_name"
					label="商品名称"
					width="200">
				</el-table-column>
				<el-table-column
					prop="goods_price"
					label="商品价格"
					width="180">

				</el-table-column>
				<!--<el-table-column
					prop="origin_goods_price"
					label="商品原价"
					width="180">

				</el-table-column>-->
				<el-table-column
					fixed="right"
					label="操作"
					width="200">
					<template slot-scope="scope">
						<el-button type="text" size="small"
								   @click.native.prevent="del(scope.$index, tableData)">删除广告
						</el-button>
						<el-button type="text" size="small"
								   @click.native.prevent="edit(scope.$index, tableData)">编辑广告
						</el-button>
						<el-button type="text" size="small"
								   @click.native.prevent="showImg(scope.$index, tableData)">查看图片
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
				:page-sizes="[10, 20, 30, 40,80,160]"
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
                tableData: [],
                page: 1,
                limit: 160,
                count: 0,
                into_type: '3c618pc',
                img_url: '',
                dialogVisible:false,
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
                this.$fetch('cms_get_index_ad_list', {
                    admin_token: this.$store.state.gl_cms_token,
                    into_type: this.into_type,
                    page: this.page,
                    limit: this.limit,
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg.list);
                        this.$set(this, 'count', msg.count);
                        m_loading.close();
                    })
            }
            , edit(index, rows) {
                this.$router.push({
                    path: 'Edit618PC',
                    query: {edit_type: 'upd', info: JSON.stringify(rows[index])}
                })
            }
            , del(index, rows) {
                let id = rows[index].id;
                this.$confirm('确认删除广告?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_del_index_ad', {admin_token: this.$store.state.gl_cms_token, id: id})
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
            ,showImg(index, rows){
                this.img_url = rows[index].ad_img;
                this.dialogVisible = true;
            }
            , cleanCache() {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('clean_user_index_ad_list_cache', {into_type: this.into_type})
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }
                        m_loading.close();
                    });
            }
        },
    };
</script>

<style lang="scss" scoped>
	.button-box {
		margin: 10px;
	}
</style>