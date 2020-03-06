<template>
	<div class="main">
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
			<el-form-item label="商品名称">
				<el-input v-model="form.goods_name" disabled></el-input>
			</el-form-item>
			<el-form-item label="商品id">
				<el-input v-model="form.goods_id" disabled></el-input>
			</el-form-item>
			<el-form-item label="评价日期" prop="create_time">
				<el-date-picker
					v-model="form.create_time"
					type="date"
					placeholder="选择日期"
					format="yyyy 年 MM 月 dd 日"
					value-format="timestamp">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="sku" prop="sku_desc">
				<el-select v-model="form.sku_desc" placeholder="请选择">
					<el-option
						v-for="item in sku_desc_options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="评分">
				<el-rate v-model="form.rate" :max="5" :min="1"></el-rate>
			</el-form-item>
			<el-form-item label="用户名称" prop="user_name">
				<el-input v-model="form.user_name"></el-input>
			</el-form-item>
			<el-form-item label="评价内容" prop="evaluate_text">
				<el-input
					type="textarea"
					:rows="2"
					placeholder="请输入内容"
					v-model="form.evaluate_text">
				</el-input>
			</el-form-item>
			<el-form-item label="用户头像">
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
				<el-button type="primary" @click="submitEvaluate">确认保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    create_time: '',
                    goods_id: 0,
                    user_id: 0,
                    user_name: '',
                    goods_name: '',
                    sku_desc: null,
                    rate: 5,
                    evaluate_text: '该用户没有填写评价。',
                },
                file_list: [{
                    name: this.$store.state.img_url + 'head_portrait.png',
                    url: this.$store.state.img_url + 'head_portrait.png',
                    original_url: this.$store.state.img_url + 'head_portrait.png'
                }],
                rules: {
                    user_name: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                    ],
                    sku_desc: [
                        {required: true, message: '请选择商品sku', trigger: 'blur'},
                    ],
                    create_time: [
                        {required: true, message: '请选择评价日期', trigger: 'blur'},
                    ],
                    evaluate_text: [
                        {required: true, message: '请输入评价内容', trigger: 'blur'},
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ],

                },
                sku_desc_options: [],
            };
        },
        computed: {},
        created() {

            this.form.goods_id = this.$route.query.goods_id;
            this.getUserName();
            /*生成当前时间戳*/
            this.form.create_time = new Date().getTime();
            this.getGoodsInfo();
        },
        methods: {
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
            uploadSuccess(response, file, fileList) {
                let img_info = {
                    name: response.goods_img,
                    url: response.goods_img,
                    original_url: response.original_img
                };
                this.file_list.push(img_info);
            },
            /*删除成功回调*/
            remove(file, fileList) {
                //  清空file_list
                if (this.file_list.length > 0 && file.status === 'success') {
                    this.file_list.forEach((item, i) => {
                        if (item.name === file.name) {
                            this.file_list.splice(i, 1);
                        }
                    });
                }
            },
            submitEvaluate() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.$message.error('表单验证不通过！，检查必要信息是否填写完成');
                    } else {
                        let post_info = this.form;
                        post_info.create_time = parseInt(post_info.create_time.toString().substring(0, 10));
                        post_info.admin_token = this.$store.state.gl_cms_token;
                        post_info.user_img = this.file_list.length === 0 ? '' : this.file_list[0].url;
                        let m_loading = this.$loading({
                            text: '处理中'
                        });
                        this.$post('cms_add_evaluate', post_info)
                            .then((msg) => {
                                if (msg) {
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    //this.$route.go(-1);
                                }
                                m_loading.close();
                            });
                    }
                });
            },
            /*获取商品信息*/
            getGoodsInfo() {
                let m_loading = this.$loading({
                    text: '获取商品信息'
                });
                this.$fetch('cms_get_goods_info', {
                    admin_token: this.$store.state.gl_cms_token,
                    goods_id: this.form.goods_id
                })
                    .then((msg) => {
                        if (msg) {
                            let goods_sku_array = msg.goods_sku;
                            goods_sku_array.forEach(item => {
                                this.sku_desc_options.push({
                                    label: item.sku_desc,
                                    value: item.sku_desc
                                })
                            });
                            this.form.goods_name = msg.goods_name;
                        }
                        m_loading.close();
                    })
            },
            /*生成随机用户名*/
            getUserName() {
                let len = 6;
                let $chars = 'ABCDEFGHJKMNPQRSTWXYZ';
                /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
                let maxPos = $chars.length;
                let user_name = '';
                for (let i = 0; i < len; i++) {
                    user_name += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                this.form.user_name = 'default' + (new Date().getTime()).toString().substring(0, 11) + user_name;
            }

        },
    };
</script>
<style lang="scss" scoped>
	.main {
		margin-top: 50px;
		width: 70%;
	}
</style>