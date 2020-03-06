<template>
	<div class="main">
		<div class="form-box">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="form.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="排序:" prop="sort_order">
					<el-input-number v-model="form.sort_order" :min="1" :precision="0" :max="999"
						:controls="false"></el-input-number>
				</el-form-item>
				<el-alert
					title="数字越大越靠前显示"
					type="warning">
				</el-alert>
				<el-form-item label="父级分类" prop="parent_id">
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
	</div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    cat_name: '',
                    parent_id: 0,
                    sort_order: 10,
                },
                rules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                        {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                    ],
                    sort_order: [
                        {required: true, message: '请输入排序', trigger: 'blur'},
                    ],
                    parent_id: [
                        {required: true, message: '请选择父级分类', trigger: 'blur'},
                    ],
                },
                edit_type: '',
                cat_id: 0,
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
                        result.push({value: 0, label: '顶级分类'})
                    }
                    return result;
                }
            }
        },
        created() {
            if (this.$store.state.cat_list.length < 1) {
                this.getCatList();
            }
            this.edit_type = this.$route.query.edit_type;
            if (this.edit_type === 'upd') {
                this.form.cat_name = this.$route.query.cat_name;
                this.form.parent_id = this.$route.query.parent_id;
                this.form.sort_order = this.$route.query.sort_order;
                this.cat_id = this.$route.query.cat_id;
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
                        let post_url = 'cms_add_cat';
                        if (this.edit_type === 'upd') {
                            post_url = 'cms_upd_cat'
                        }
                        this.$post(post_url, {
                            admin_token: this.$store.state.gl_cms_token,
                            cat_name: this.form.cat_name,
                            parent_id: this.form.parent_id,
                            sort_order: this.form.sort_order,
                            cat_id: this.cat_id
                        })
                            .then((msg) => {
                                if (msg) {
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.$set(this.$store.state, 'cat_list', []);
                                    this.$router.go(-1);
                                }
                                m_loading.close();
                            })

                    }
                });
            }
            /*获取分类表*/
            , getCatList() {
                let m_loading = this.$loading({
                    text: '获取分类列表'
                });
                this.$fetch('cms_get_cat_list', {
                    admin_token: this.$store.state.gl_cms_token,
                })
                    .then((msg) => {
                        this.$set(this.$store.state, 'cat_list', msg);
                        m_loading.close();
                    })
            },
        },
    };
</script>
<style lang="scss" scoped>
	.form-box {
		margin-top: 50px;
		width: 60%;
	}
</style>