<template>
  <div class="icbcTableMain">
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
        stripe
        border
        height="850px"
        ref="icbcTableMainTable"
    >
      <el-table-column
          label="商品名称"
          width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click.native.prevent="showEaseEdit(scope.$index, tableData)">
            {{tableData[scope.$index].goods_name}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
          label="价格"
          width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click.native.prevent="showEaseEdit(scope.$index, tableData)">
            {{tableData[scope.$index].goods_price}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
          label="原价"
          width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click.native.prevent="showEaseEdit(scope.$index, tableData)">
            {{tableData[scope.$index].origin_goods_price}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
          label="图片"
          width="100" hight="100">
        <template slot-scope="scope">
          <el-upload
              style="width: 100%;height: 100%"
              :action="$store.state.api_url + 'cms/cms_upd_ad_img'"
              :on-success="(response)=>uploadSuccess(response,scope.$index)"
              :data="{id:tableData[scope.$index].id}"
              accept="image/jpeg,image/gif,image/png"
              name='portrait_img'
              :before-upload="(file)=>beforeAvatarUpload(file,scope.$index)"
              :show-file-list="false">
            <img style="width: 100%" :src="tableData[scope.$index].ad_img" alt="">
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column
          prop="url"
          label="外链接"
          width="250">
      </el-table-column>
      <el-table-column
          prop="click_count"
          label="点击量"
          width="70">
      </el-table-column>
      <el-table-column
          prop="position_type"
          label="广告类型"
          width="200">
      </el-table-column>
      <el-table-column
          prop="ad_type"
          label="响应类型"
          width="200">
      </el-table-column>
      <el-table-column
          prop="sort_order"
          label="排序"
          width="80">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click.native.prevent="del(scope.$index, tableData)">删除
          </el-button>
          <el-button type="text" size="small"
                     @click.native.prevent="edit(scope.$index, tableData)">编辑
          </el-button>
          <el-button type="text" size="small"
                     @click.native.prevent="showImg(scope.$index, tableData)">查看图片
          </el-button>
          <el-button type="text" size="small"
                     v-show="tableData[scope.$index].is_on_sale === 1"
                     @click.native.prevent="endOfSale(scope.$index, tableData)">
            下架
          </el-button>
          <el-button type="text" size="small"
                     v-show="tableData[scope.$index].is_on_sale === 0"
                     @click.native.prevent="allowSale(scope.$index, tableData)">
            上架
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationBox">
      <el-pagination
          v-if="showPagination"
          @size-change="(pageSize)=>{
              goSearch(true,1,pageSize)
          }"
          @current-change="()=>{
                goSearch(true,page,this.limit)
          }"
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
    <el-dialog :visible.sync="dialogVisibleEditMobile" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="外链接">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input-number v-model="form.sort_order" :min="1" :precision="0" :max="999"
                           :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number v-model="form.goods_price" :min="1" :precision="2"
                           :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number v-model="form.goods_price" :min="1" :precision="2"
                           :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="easeEdit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
    export default {
        name: "IcbcTable",
        data() {
            return {
                tableData: [],
                page: 1,
                limit: 160,
                count: 0,
                img_url: '',
                dialogVisible: false,
                loading: null,
                dialogVisibleEditMobile: false,
                index_id: 0,
                form: {
                    goods_name: '',
                    goods_price: 0,
                    url: '',
                    sort_order: 10,
                    id: 0,
                    index: 0,
                },
                showPagination: true,
            };
        },
        props: {
            editPath: {
                type: String,
                required: true,
            },
            thisPath: {
                type: String,
                required: true,
            },
            intoType: {
                type: String,
                required: true,
            },
        },
        created() {

        },
        methods: {
            addAd() {
                this.$router.push(
                    {
                        path: this.editPath,
                        query: {edit_type: 'add', index_id: '0'}
                    })
            }
            , urlUpdate(url) {
                if (url && url.query && Object.keys(url.query).length !== 0) {
                    this.$set(this, 'page', parseInt(url.query.page));
                    this.$set(this, 'limit', parseInt(url.query.limit));
                }
                this.getList();
            }
            , goSearch(isInit, page = 1, limit = 10) {
                let scrollTop = 0;
                if (!isInit) {
                    scrollTop = this.$refs.icbcTableMainTable.bodyWrapper.scrollTop;
                }

                let params = {
                    page: page,
                    limit: limit,
                    scrollTop: scrollTop,
                };
                this.$router.push({path: `/${this.thisPath}`, query: params});
            }
            , getList() {
                this.showPagination = false;
                let m_loading = this.$loading({
                    text: '加载中'
                });
                this.$fetch('cms_get_index_ad_list', {
                    admin_token: this.$store.state.gl_cms_token,
                    into_type: this.intoType,
                    page: this.page,
                    limit: this.limit,
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg.list);
                        this.$set(this, 'count', msg.count);
                        this.showPagination = true;
                        this.$nextTick(function () {
                            // DOM 现在更新了
                            if (this.$refs.icbcTableMainTable) {
                                this.$refs.icbcTableMainTable.bodyWrapper.scrollTop = this.$route.query.scrollTop ? this.$route.query.scrollTop : 0;
                            }

                        });
                        m_loading.close();
                    })
            }
            , edit(index, rows) {
                this.goSearch(false, this.page, this.limit);
                this.$router.push({
                    path: this.editPath,
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
                this.$post('clean_user_index_ad_list_cache', {into_type: this.intoType})
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
            , showEaseEdit(index, rows) {
                this.form.goods_name = rows[index].goods_name;
                this.form.goods_price = rows[index].goods_price;
                this.form.url = rows[index].url;
                this.form.sort_order = rows[index].sort_order;
                this.form.id = rows[index].id;
                this.form.index = index;
                this.dialogVisibleEditMobile = true;
            }
            , easeEdit() {
                this.loading = this.$loading({
                    lock: true,
                    text: '修改中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let post_info = this.form;
                post_info.admin_token = this.$store.state.gl_cms_token;
                this.$post('cms_ease_upd_index_ad', post_info)
                    .then((msg) => {
                        if (msg) {
                            this.$set(this.tableData[this.form.index], 'goods_name', this.form.goods_name);
                            this.$set(this.tableData[this.form.index], 'goods_price', this.form.goods_price);
                            this.$set(this.tableData[this.form.index], 'url', this.form.url);
                            this.$set(this.tableData[this.form.index], 'sort_order', this.form.sort_order);
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }
                        this.loading.close();
                    });
                this.dialogVisibleEditMobile = false;
            }
            /*上下架*/
            , endOfSale(index, rows) {
                let id = rows[index].id;
                let m_loading = this.$loading({
                    text: '下架中'
                });
                this.$post('cms_end_of_index_ad', {
                    admin_token: this.$store.state.gl_cms_token,
                    id: id
                })
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                type: 'success',
                                message: '下架成功!'
                            });
                            this.$set(this.tableData[index], 'is_on_sale', 0);
                        }
                        m_loading.close();
                    })

            }
            , allowSale(index, rows) {
                let id = rows[index].id;
                let m_loading = this.$loading({
                    text: '上架中'
                });
                this.$post('cms_allow_index_ad', {
                    admin_token: this.$store.state.gl_cms_token,
                    id: id
                })
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                type: 'success',
                                message: '上架成功!'
                            });
                            this.$set(this.tableData[index], 'is_on_sale', 1);
                        }
                        m_loading.close();
                    })
            }
            /*上传前处理*/
            , beforeAvatarUpload(file) {
                let check_flag;
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                    this.$message.error('上传图片只能是 JPG/PNG/GIF格式!');
                    check_flag = false;
                }
                if (!isLt1M) {
                    this.$message.error('上传图片大小不能超过 1MB!');
                    check_flag = false;
                }
                this.loading = this.$loading({
                    lock: true,
                    text: '正在上传',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                return check_flag;
            },
            /*上传成功回调*/
            uploadSuccess(response, index) {
                this.$set(this.tableData[index], 'ad_img', response.goods_img);
                this.loading.close();
            },
            /*删除成功回调*/
            remove(file) {
                //  清空file_list
                if (this.file_list.length > 0 && file.status === 'success') {
                    this.file_list.forEach((item, i) => {
                        if (item.name === file.name) {
                            this.file_list.splice(i, 1);
                        }
                    });
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
  .icbcTableMain {
    .paginationBox {
      width: 100%;
      background-color: white;
      position: fixed;
      bottom: 0;
      padding: 5px;
    }
  }
</style>