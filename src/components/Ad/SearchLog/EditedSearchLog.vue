<template>
	<div class="main">
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="150px" :rules="rules" size="mini">
				<el-form-item label="关键词" prop="search_keyword">
					<el-input v-model="form.search_keyword"></el-input>
				</el-form-item>
				<el-form-item label="搜索次数:">
					<el-input-number v-model="form.search_count" :min="0" :precision="0"
						prop="search_count"
						:controls="false"></el-input-number>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">确认添加</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    search_keyword: '',
                    search_count: 0,
                },
                rules: {
                    search_keyword: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                    search_count: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                },
            };
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
                        let post_url = 'cms_add_search_log';
                        let post_info = this.form;
                        post_info.admin_token = this.$store.state.gl_cms_token,
                            this.$post(post_url, post_info)
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
	.form-box {
		width: 70%;
		margin-top: 50px;
	}
</style>