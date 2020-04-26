<template>
  <div class="main">
    <div class="button-box">
      <el-button type="primary"
                 @click="$router.push({ path: 'EditCat', query: { edit_type: 'add',cat_id:'0' }})">
        添加分类
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
            prop="cat_id"
            label="分类id"
            width="100">
        </el-table-column>
        <el-table-column
            prop="cat_name"
            label="分类名称"
            width="600">
        </el-table-column>
        <el-table-column
            prop="parent_name"
            label="父分类名称"
            width="300">
        </el-table-column>
				<el-table-column
						prop="parent_id"
						label="父分类ID"
						width="300">
				</el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="400">
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click.native.prevent="delCat(scope.$index, tableData)">
              删除分类
            </el-button>
            <el-button type="text" size="small"
                       @click.native.prevent="updCat(scope.$index, tableData)">
              编辑分类
            </el-button>
            <el-button type="text" size="small" v-if="tableData[scope.$index].parent_id !== 0"
                       @click.native.prevent="shearGoodsBycatId(scope.$index, tableData)">转移商品
            </el-button>
            <!--<el-button type = "text" size = "small" v-if = "tableData[scope.$index].parent_id !== 0"
              @click.native.prevent = "copyGoodsBycatId(scope.$index, tableData)">复制商品
            </el-button>-->
            <el-button type="text" size="small" v-if="tableData[scope.$index].parent_id !== 0"
                       @click.native.prevent="SeeGoodsByCatId(scope.$index, tableData)">查看下属商品
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
        @size-change="getCatList"
        @current-change="getCatList"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size.sync="limit"
        layout="sizes, prev, pager, next"
        :total="count">
    </el-pagination>
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
            this.getCatList();
        },
        methods: {
            getCatList() {
                let m_loading = this.$loading({
                    text: '获取分类列表'
                });
                this.$fetch('cms_get_cat_list_by_page', {
                    admin_token: this.$store.state.gl_cms_token,
                    page: this.page,
                    limit: this.limit
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg.list);
                        this.$set(this, 'count', msg.count);
                        m_loading.close();
                    })
            },
            delCat(index, rows) {
                let cat_id = rows[index].cat_id;
                this.$confirm('此操作将永久删除该分类和该分类下的所有商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '删除中'
                    });
                    this.$post('cms_del_cat', {admin_token: this.$store.state.gl_cms_token, cat_id: cat_id})
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getCatList();
                                this.$set(this.$store.state, 'cat_list', []);
                            }
                            m_loading.close();
                        })
                });
            }
            , shearGoodsBycatId(index, rows) {
                let cat_id = rows[index].cat_id;
                this.$router.push({path: 'ShearOrCopyGoods', query: {move_type: '转移', cat_id: cat_id}})
            }
            , copyGoodsBycatId(index, rows) {
                let cat_id = rows[index].cat_id;
                this.$router.push({path: 'ShearOrCopyGoods', query: {move_type: '复制', cat_id: cat_id}})
            }
            , updCat(index, rows) {
                let parent_id = rows[index].parent_id;
                let cat_name = rows[index].cat_name;
                let cat_id = rows[index].cat_id;
                let sort_order = rows[index].sort_order;
                this.$router.push({
                    path: 'EditCat',
                    query: {
                        edit_type: 'upd',
                        parent_id: parent_id,
                        cat_name: cat_name,
                        cat_id: cat_id,
                        sort_order: sort_order
                    }
                })
            }
            , SeeGoodsByCatId(index, rows) {
                let cat_id = rows[index].cat_id;
                this.$router.push({path: 'GoodsList', query: {type: 'see', cat_id: cat_id}})
            }
            , cleanCache() {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('clean_user_cat_list_cache', {admin_token: this.$store.state.gl_cms_token})
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
<style lang="scss">
</style>