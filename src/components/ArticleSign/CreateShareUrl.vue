<template>
	<div class="create-share-url-main">
		<el-form ref="form" :model="form" label-width="150px" :rules="rules" size="mini">
			<el-form-item label="发布日期" prop="start_date" required>
				<el-date-picker
					v-model="form.start_date"
					align="right"
					type="date"
					placeholder="选择日期"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item label="文章名称" prop="article_name" required>
				<el-input v-model="form.article_name"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">创建</el-button>
			</el-form-item>
		</el-form>
		生成链接：
		<el-input v-model="url" placeholder=""></el-input>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    start_date: null,
                    article_name: ""
                },
                rules: {
                    start_date: [
                        {required: true, message: '请选择发布日期', trigger: 'change'}
                    ],
                    article_name: [
                        {required: true, message: '请输入文章名称', trigger: 'change'}
                    ],
                },
                url: "",
            };
        },
        computed: {},
        created() {

        },
        methods: {
            onSubmit(formName) {

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let m_loading = this.$loading({
                            text: '处理中'
                        });
                        let post_info = this.form;
                        post_info.admin_token = this.$store.state.gl_cms_token;
                        post_info.start_date =this.form.start_date.getTime();
                        this.$post('create_share_url', post_info).then((msg)=>{
                            this.url = msg;
                            m_loading.close();
						})
                    } else {
                        return false;
                    }
                });


            }
        },
    };
</script>
<style lang="scss" scoped>
	.create-share-url-main {
		padding: 50px 20px;
		width: 60%;
	}
</style>