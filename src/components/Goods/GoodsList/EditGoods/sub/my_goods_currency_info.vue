<template>
	<div class="main">
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="150px" :rules="rules" size="mini">
				<el-form-item label="商品名称" prop="goods_name">
					<el-input v-model="form.goods_name"></el-input>
				</el-form-item>
				<el-form-item label="商品名称头">
					<el-input v-model="form.goods_head_name"></el-input>
				</el-form-item>
				<el-form-item label="商品分类" prop="cat_id">
					<el-select v-model="form.cat_id" placeholder="请选择">
						<el-option-group
							v-for="group in cat_option"
							:key="group.label"
							:label="group.label">
							<el-option
								v-for="item in group.options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-option-group>
					</el-select>
				</el-form-item>
				<el-form-item label="供应商" prop="supplier_id">
					<el-select v-model="form.supplier_id" placeholder="请选择">
						<el-option
							v-for="item in supplier_options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="响应类型" prop="click_type">
					<el-select v-model="form.click_type" placeholder="请选择">
						<el-option
							v-for="item in click_type_options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="外链接：" v-show="form.click_type === 'external'">
					<el-input v-model="form.url"></el-input>
				</el-form-item>
				<el-form-item label="销量:">
					<el-input-number v-model="form.goods_sales_volume" :min="0" :precision="0"
						:controls="false"></el-input-number>
				</el-form-item>
				<el-form-item label="评论量:">
					<el-input-number v-model="form.evaluate_count" :min="0" :precision="0"
						:controls="false"></el-input-number>
				</el-form-item>
				<el-form-item label="排序:">
					<el-input-number v-model="form.sort_order" :min="1" :precision="0" :max="999"
						:controls="false"></el-input-number>
					<el-alert
						title="数字越大越靠前显示"
						type="warning">
					</el-alert>
				</el-form-item>
				<el-form-item label="是否秒杀商品">
					<el-switch
						v-model="form.is_promote"
						active-text="开启秒杀"
						:active-value="1"
						:inactive-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item v-show="form.is_promote === 1" label="预计秒杀数量(台)">
					<el-input-number v-model="form.promote_number" :min="1" :precision="0"></el-input-number>
					<el-alert
						title="预计秒杀数量 - 该商品sku库存 = 前端显示已抢百分比"
						type="warning">
					</el-alert>
				</el-form-item>
				<el-form-item v-show="form.is_promote === 1" label="秒杀周期" prop="promote_date">
					<el-date-picker
						v-model="form.promote_date"
						type="datetimerange"
						value-format="timestamp"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
					<el-alert
						title="为了保证在秒杀结束之后及时下架商品，请将秒杀时间设置为整点"
						type="warning">
					</el-alert>
				</el-form-item>
				<el-form-item label="是否精品">
					<el-switch
						v-model="form.is_best"
						active-text="是"
						:active-value="1"
						:inactive-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item label="是否新品">
					<el-switch
						v-model="form.is_new"
						active-text="是"
						:active-value="1"
						:inactive-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item label="是否热销">
					<el-switch
						v-model="form.is_hot"
						active-text="是"
						:active-value="1"
						:inactive-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item label="是否上架">
					<el-switch
						v-model="form.is_on_sale"
						active-text="是"
						:active-value="1"
						:inactive-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item label="商品关键词">
					<el-input v-model="form.keywords" prop="keywords"></el-input>
					<el-alert
						title="使用 | 进行分割，为了前端美观，单个关键词不建议大于4个字 如：免息分期|岗隆专享"
						type="warning">
					</el-alert>
				</el-form-item>
				<el-form-item label="商品描述信息" prop="goods_brief">
					<el-input v-model="form.goods_brief" type="textarea"></el-input>
					<el-alert
						title="使用 | 代表换行符"
						type="warning">
					</el-alert>
				</el-form-item>
				<el-form-item label="商品主图">
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
					<el-alert
						title="只需上传一张,如果你发现图片是空白的，则需要重新上传这张图片"
						type="warning">
					</el-alert>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
    export default {
        data() {
            var checkPromoteDate = (rule, value, callback) => {
                if (this.form.is_promote === 1 && this.form.promote_date === null) {
                    callback(new Error('请选择秒杀周期'));
                }
            };
            return {
                form: {
                    goods_name: '',
                    goods_head_name: '',
                    cat_id: '',
                    supplier_id: 1,
                    is_promote: 0,
                    goods_sales_volume: 0,
                    evaluate_count: 0,
                    promote_number: 0,
                    promote_date: null,
                    is_best: 0,
                    is_new: 0,
                    is_hot: 0,
                    is_on_sale: 1,
                    keywords: '',
                    goods_brief: '',
                    goods_img: '',
                    original_img: '',
                    click_type: 'inside',
                    url: '',
                    sort_order: 10
                },
                file_list: [],
                rules: {
                    goods_name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
                    ],
                    cat_id: [
                        {required: true, message: '请选择分类名称', trigger: 'blur'},
                    ],
                    supplier_id: [
                        {required: true, message: '请选择供应商', trigger: 'blur'},
                    ],
                    click_type: [
                        {required: true, message: '请选择响应类型', trigger: 'blur'},
                    ],
                    keywords: [
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
                    ],
                    goods_brief: [
                        {min: 1, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur'}
                    ],
                    promote_date: [
                        {validator: checkPromoteDate, trigger: 'blur'}
                    ]
                },
                supplier_options: [],
                click_type_options: [
                    {
                        value: "inside",
                        label: "内部流程"
                    },
                    {
                        value: "external",
                        label: "外部链接"
                    }
                ],
            };
        },
        computed: {
            cat_option: {
                get: function () {
                    let result = [];
                    if (this.$store.state.cat_list.length > 0) {
                        this.$store.state.cat_list.forEach(item => {
                            this.$store.state.cat_list.forEach(item2 => {
                                if (item.parent_id == item2.cat_id) {
                                    /*检查是存在该分类*/
                                    let result_flag = true;
                                    result.forEach((item3, i3) => {
                                        if (item3.label === item2.cat_name) {
                                            result[i3].options.push({value: item.cat_id, label: item.cat_name});
                                            result_flag = false;
                                        }
                                    });
                                    if (result_flag) {
                                        let option = {};
                                        option.label = item2.cat_name;
                                        option.options = [];
                                        option.options.push({value: item.cat_id, label: item.cat_name});
                                        result.push(option);
                                    }
                                }

                            })
                        })
                    }
                    return result;
                }
            }
        },
        props: ["edit_type"],
        created() {
            if (this.$store.state.cat_list.length < 1) {
                this.getCatList();
            }
            this.getSupplier();
            if (this.edit_type === 'upd' || this.edit_type === 'copy') {
                this.form = this.$store.state.goods_info;
                if (this.form.is_promote === 1) {
                    this.$set(this.form, 'promote_date', new Array(new Date(this.$store.state.goods_info.promote_start_date * 1000).getTime(), new Date(this.$store.state.goods_info.promote_end_date * 1000).getTime()));
                }
                let file_list_object = {
                    name: this.form.goods_img,
                    url: this.form.goods_img,
                    original_url: this.form.original_img
                };
                this.file_list.push(file_list_object);
            }
        },
        methods: {
            /*获取分类表*/
            getCatList() {
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
            /*获取供应商*/
            getSupplier() {
                let m_loading = this.$loading({
                    text: '加载中'
                });
                this.$fetch('cms_get_all_supplier', {
                    admin_token: this.$store.state.gl_cms_token,
                })
                    .then((msg) => {
                        msg.forEach(item => {
                            this.supplier_options.push({
                                label: item.supplier_name,
                                value: item.id
                            })
                        });
                        m_loading.close();
                    })
            },
            /*上传前处理*/
            beforeAvatarUpload(file) {
                let check_flag;
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    this.$message.error('上传图片只能是 JPG 或PNG格式!');
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
            /*表单验证*/
            checkForm() {
                let check_flag = true;
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.$message.error('表单验证不通过！，检查必要信息是否填写完成');
                        check_flag = false;
                    }
                });
                return check_flag;
            }
        }
        ,
    }
    ;
</script>
<style lang="scss" scoped>
	.main {
		.form-box {
			width: 60%;
		}
	}
</style>