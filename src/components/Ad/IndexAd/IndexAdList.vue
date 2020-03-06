<template>
	<div class="main">
		<div class="form-box">
			<el-form label-width="80px" size="mini" inline>
				<el-form-item label="入口类型">
					<el-select v-model="into_type" placeholder="请选择" @change="getList">
						<el-option
							v-for="item in into_type_option"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<div class="button-box">
			<el-button type="primary" @click="addAd">
				添加广告
			</el-button>
			<el-button type="primary" @click="cleanCache">
				清除缓存
			</el-button>
		</div>
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
				prop="sort_order"
				label="排序"
				width="80">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="position_type_name"
				label="楼层名称"
				width="80">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="text"
				label="文本"
				width="250">
			</el-table-column>
			<el-table-column
				prop="ad_type"
				label="响应类型"
				width="200">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="url"
				label="外链接"
				width="250">
			</el-table-column>
			<el-table-column
				prop="goods_id"
				label="商品ID"
				width="100">
			</el-table-column>
			<el-table-column
				prop="cat_id"
				label="分类ID"
				width="100">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="goods_name"
				label="商品名"
				width="200">
			</el-table-column>
			<el-table-column
				prop="goods_price"
				label="价格"
				width="100">
			</el-table-column>
			<el-table-column
				prop="origin_goods_price"
				label="原价"
				width="100">
			</el-table-column>
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
                into_type: "wx",
                into_type_option: [
                    {label: '微信专区', value: "wx"},
                    {label: '农行专区', value: "abc"},
                    {label: '走进红牛-华为', value: "redBullMake-hw"},
                    {label: '走进红牛-岗隆', value: "redBullMake-gl"},
                ],
                path: 'EditWxIndexAd',
                tableData: [],
                page: 1,
                limit: 10,
                count: 0,
                img_url: '',
                dialogVisible: false
            };
        },
        watch: {
            'into_type': function (new_val) {
                switch (new_val) {
                    case 'wx':
                        this.path = 'EditWxIndexAd';
                        break;
                    case 'abc':
                        this.path = 'EditAbcIndexAd';
                        break;
                    case 'redBullMake-hw':
                        this.path = 'EditRedBullHWGoodsIndexAd';
                        break;
                    case 'redBullMake-gl':
                        this.path = 'EditRedBullGoodsIndexAd';
                        break;
                    default:
                        this.path = '';
                }
                this.$store.state.page_info_cache.into_type = new_val;
            },
            'page': function (new_val) {
                this.$store.state.page_info_cache.page = new_val;
            },
            'limit': function (new_val) {
                this.$store.state.page_info_cache.limit = new_val;
            },
        },
        created() {
            this.page = this.$store.state.page_info_cache.page;
            this.limit = this.$store.state.page_info_cache.limit;
            this.into_type = this.$store.state.page_info_cache.into_type;
            this.getList();
        },
        methods: {
            addAd() {
                this.$router.push(
                    {
                        path: this.path,
                        query: {edit_type: 'add', index_id: '0'}
                    })
            }
            , getList() {
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
                    path: this.path,
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
            , showImg(index, rows) {
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
</style>