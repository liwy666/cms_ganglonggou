<template>
	<div class="form-box">
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
			<el-form-item label="商品名称头" prop="goods_head_name">
				<el-input v-model="form.goods_head_name"></el-input>
			</el-form-item>
			<el-form-item label="顶级分类名称" prop="parent_id">
				<el-select v-model="form.parent_id" placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">确认保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    goods_head_name: '',
                    parent_id: '',
                },
                rules: {
                    goods_head_name: [
                        {required: true, message: '请输入商品名称头', trigger: 'blur'},
                        {min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur'}
                    ],
                    parent_id: [
                        {required: true, message: '请选择顶级分类', trigger: 'blur'},
                    ],
                },
			};
        },
        computed: {
            options: {
                get: function () {
                    let result = [];
                    if (this.$store.state.cat_list.length > 0) {
                        this.$store.state.cat_list.forEach(item => {
                            if (item.parent_id === 0) {
                                result.push({value: item.cat_id, label: item.cat_name})
                            }
                        });
                    }
                    return result;
                }
            }
		},
        created() {
            if (this.$store.state.cat_list.length < 1) {
                this.$store.dispatch("getCatList", this.$store.state.gl_cms_token);
            }
        },
        methods: {
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.$message.error('表单验证不通过！，检查必要信息是否填写完成');
                    } else {
                        let m_loading = this.$loading({
                            text: '处理中'
                        });
                        let post_url = 'cms_batch_upd_goods_head_name';
                        this.$post(post_url, {
                            admin_token: this.$store.state.gl_cms_token,
                            goods_head_name: this.form.goods_head_name,
                            parent_id: this.form.parent_id,
                        })
                            .then((msg) => {
                                if (msg) {
                                    this.$message({
                                        message: '操作成功',
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
    };
</script>

<style lang="scss" scoped>
	.form-box{
		margin: 50px;
		width: 60%;
	}
</style>