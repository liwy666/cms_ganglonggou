<template>
  <div class="icbcFormMain">
    <div class="formBox">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="广告位置">
          <el-select v-model="form.position_type" placeholder="请选择">
            <el-option
                v-for="item in positionTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="响应类型">
          <el-select v-model="form.ad_type" placeholder="请选择">
            <el-option
                v-for="item in ad_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外链接" v-show="form.ad_type==='外链接'">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="商品名称"
                      v-show="form.position_type.indexOf('N')>-1">
          <el-input v-model="form.goods_name"></el-input>
          <el-alert
              title="以符号“|”分割商品名与标签"
              type="success">
          </el-alert>
        </el-form-item>
        <el-form-item label="商品价格" v-show="form.position_type.indexOf('G')>-1">
          <el-input-number v-model="form.goods_price" :min="1" :precision="2"
                           :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="商品原价" v-show="form.position_type.indexOf('G')>-1">
          <el-input-number v-model="form.origin_goods_price" :min="1" :precision="2"
                           :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input-number v-model="form.sort_order" :min="1" :max="99999" :precision="0"
                           :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
              :action="$store.state.api_url + 'cms/cms_upload_goods_img'"
              :on-success="uploadSuccess"
              :on-remove="remove"
              :limit="1"
              accept="image/jpeg,image/gif,image/png"
              name='portrait_img'
              :file-list="file_list"
              :before-upload="beforeAvatarUpload"
              list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="imgBox">
      <img :src="previewImgUrl">
    </div>
  </div>
</template>

<script>
    export default {
        name: "EditFashionSciTech",
        data() {
            return {
                form: {
                    position_type: '',
                    url: '',
                    text: '',
                    ad_type: '无响应',
                    sort_order: 10
                },
                ad_type_options: [
                    {
                        value: '无响应',
                        label: '无响应'
                    },
                    {
                        value: '外链接',
                        label: '外链接'
                    },
                ],
                file_list: [],
                info: {}
            }
        },
        props: {
            previewImgUrl: {
                type: String,
                required: false,
            },
            positionTypeOptions: {
                type: Array,
                required: true,
            },
            intoType: {
                type: String,
                required: true,
            }
        },
        watch: {
            'form.position_type': function (new_val) {
                this.$store.state.page_info_cache.position_type = new_val;
            },
            'form.ad_type': function (new_val) {
                this.$store.state.page_info_cache.ad_type = new_val;
            },
        },
        created() {
            this.form.position_type = this.$store.state.page_info_cache.position_type;
            this.form.ad_type = this.$store.state.page_info_cache.ad_type;
            if (this.$route.query.edit_type === 'upd') {
                this.form = JSON.parse(this.$route.query.info);
                this.file_list.push({name: this.form.ad_img, url: this.form.ad_img})
            }
        },
        methods: {

            /*上传前处理*/
            beforeAvatarUpload(file) {
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
                return check_flag;
            },
            /*上传成功回调*/
            uploadSuccess(response) {
                let img_info = {
                    name: response.goods_img,
                    url: response.goods_img,
                    original_url: response.original_img
                };
                this.file_list.push(img_info);
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
            onSubmit() {
                let post_info = this.form;
                post_info.admin_token = this.$store.state.gl_cms_token;
                post_info.ad_img = this.file_list.length === 0 ? '' : this.file_list[0].url;
                post_info.into_type = this.intoType;
                if (this.$route.query.edit_type === 'add') {
                    this.addIndexAd(post_info);
                } else if (this.$route.query.edit_type === 'upd') {
                    this.updIndexAd(post_info);
                }
            },
            /*添加广告*/
            addIndexAd(post_info) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_add_index_ad', post_info
                )
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.$router.go(-1)
                        }

                        m_loading.close();
                    })
            }
            /*编辑广告*/
            , updIndexAd(post_info) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_upd_index_ad', post_info
                )
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.$router.go(-1)
                        }

                        m_loading.close();
                    })
            }
        }
        ,
    }
</script>

<style scoped lang="scss">
  .icbcFormMain {
    width: 100%;
    display: flex;

    .formBox {
      width: 50%;
      margin: 50px;
    }

    .imgBox {
      width: 30%;
      margin-top: 50px;
      height: 900px;
      overflow-y: auto;

      img {
        width: 100%;
      }
    }
  }
</style>