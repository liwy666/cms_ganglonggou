<template>
	<div class="main">
		<div class="form-box">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
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
				<el-form-item label="复制到" prop="to_parent_id">
					<el-select v-model="form.to_parent_id" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">开始复制</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-alert
			title="分类复制操作需要一定时间，请不要离开或关闭窗口，以免造成数据错乱"
			type="warning">
		</el-alert>
	</div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    parent_id: '',
                    to_parent_id:''
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
                    to_parent_id: [
                        {required: true, message: '请选择复制到那个分类', trigger: 'blur'},
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
                    }
                    return result;
                }
            }
        },
        created() {
            if (this.$store.state.cat_list.length < 1) {
                this.getCatList();
            }
        },
        methods: {
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.$message.error('表单验证不通过！，检查必要信息是否填写完成');
                    }else if(this.form.parent_id === this.form.to_parent_id){
                        this.$message.error('自己复制到自己？？？？');
					}
                    else {
                        let m_loading = this.$loading({
                            text: '正在复制请勿离开'
                        });
                        this.$post('cms_copy_goods_by_parent_id?XDEBUG_SESSION_START=1476', {
                            admin_token: this.$store.state.gl_cms_token,
                            parent_id: this.form.parent_id,
							to_parent_id:this.form.to_parent_id,
                        })
                            .then((msg) => {
                                if (msg) {
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.$set(this.$store.state,'cat_list',[]);
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