<template>
  <div class="main">
    <div class="form-box">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
        <el-form-item :label="move_type + '到分类'" prop="parent_id">
          <select-category v-model="form.aim_cat_id" :delete-cat-id="parseInt(cat_id)"></select-category>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{'确认'+ this.move_type + '商品'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    import SelectCategory from "../../../SelectCategory";

    export default {
        data() {
            return {
                form: {
                    aim_cat_id: 0
                },
                rules: {
                    aim_cat_id: [
                        {required: true, message: '请选择分类', trigger: 'blur'},
                    ],
                },
                move_type: '复制',
                cat_id: 0,
            };
        },
        created() {
            this.move_type = this.$route.query.move_type;
            this.cat_id = this.$route.query.cat_id;
        },
        methods: {
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.$message.error('表单验证不通过！，检查必要信息是否填写完成');
                    } else {
                        let post_url = '';
                        if (this.move_type === '转移') {
                            post_url = 'shear_goods_by_catid';
                        } else if (this.move_type === '复制') {
                            post_url = 'cms_copy_goods_by_catid';
                        }
                        let m_loading = this.$loading({
                            text: '处理中'
                        });
                        this.$post(post_url, {
                            admin_token: this.$store.state.gl_cms_token,
                            cat_id: this.cat_id,
                            aim_cat_id: this.form.aim_cat_id
                        })
                            .then((msg) => {
                                if (msg) {
                                    this.$message({
                                        message: msg,
                                        type: 'success'
                                    });
                                    this.$router.go(-1);
                                }
                                m_loading.close();
                            })

                    }
                });
            }
        },
        components: {
            "select-category": SelectCategory,
        }
    };
</script>

<style lang="scss" scoped>
  .form-box {
    margin-top: 50px;
    width: 60%;
  }
</style>