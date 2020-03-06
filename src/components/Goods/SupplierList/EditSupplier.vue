<template>
	<div class="main">
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
			<el-form-item label="供应商名称">
				<el-input v-model="form.supplier_name" placeholder="岗隆数码专营店"></el-input>
			</el-form-item>
			<el-form-item label="公司名称">
				<el-input v-model="form.company_name" placeholder="江苏岗隆数码科技有限公司"></el-input>
			</el-form-item>
			<el-form-item label="主题色">
				<el-color-picker v-model="form.colour"></el-color-picker>
			</el-form-item>
			<el-form-item label="服务电话">
				<el-input v-model="form.service_tel" placeholder="4008282323"></el-input>
			</el-form-item>
			<el-form-item label="售后电话">
				<el-input v-model="form.after_sale_tel" placeholder="0510-80336188-8002"></el-input>
			</el-form-item>
			<el-form-item label="宝贝评分:">
				<el-input-number v-model="form.describe_rate" :min="1" :max="5" :precision="1"
					:controls="false"></el-input-number>
			</el-form-item>
			<el-form-item label="售后评分:">
				<el-input-number v-model="form.service_rate" :min="1" :max="5" :precision="1"
					:controls="false"></el-input-number>
			</el-form-item>
			<el-form-item label="物流评分:">
				<el-input-number v-model="form.logistics_rate" :min="1" :max="5" :precision="1"
					:controls="false"></el-input-number>
			</el-form-item>
			<el-form-item label="关注人数:">
				<el-input-number v-model="form.follow_number" :min="1" :max="9999999" :precision="0"
					:controls="false"></el-input-number>
			</el-form-item>
			<el-form-item label="logo">
				<el-upload
					:action="$store.state.api_url + 'cms/cms_upload_goods_img'"
					:on-success="logoUploadSuccess"
					:on-remove="logoRemove"
					:limit="1"
					accept="image/jpeg,image/gif,image/png"
					name='portrait_img'
					:file-list="logo_file_list"
					:before-upload="beforeAvatarUpload"
					list-type="picture-card">
					<i class="el-icon-plus"></i>
				</el-upload>
			</el-form-item>
			<el-form-item label="头图">
				<el-upload
					:action="$store.state.api_url + 'cms/cms_upload_goods_img'"
					:on-success="headUploadSuccess"
					:on-remove="headRemove"
					:limit="1"
					accept="image/jpeg,image/gif,image/png"
					name='portrait_img'
					:file-list="head_img_file_list"
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
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    supplier_name: '',
                    company_name: '',
                    colour: '#EB1912',
                    service_tel: '',
                    after_sale_tel: '',
                    describe_rate: 5,
                    service_rate: 5,
                    logistics_rate: 5,
                    follow_number: 20000,
                    logo_img: '',
                    head_img: ''
                }
                , rules: {}
                , logo_file_list: []
                , head_img_file_list: []
            };
        },
        computed: {},
        created() {
            if (this.$route.query.edit_type === 'upd') {
                this.form = JSON.parse(this.$route.query.info);
                this.logo_file_list.push({name: this.form.logo_img, url: this.form.logo_img});
                this.head_img_file_list.push({name: this.form.head_img, url: this.form.head_img})
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
            logoUploadSuccess(response) {
                let img_info = {
                    name: response.goods_img,
                    url: response.goods_img,
                    original_url: response.original_img
                };
                this.logo_file_list.push(img_info);
            },
            headUploadSuccess(response) {
                let img_info = {
                    name: response.goods_img,
                    url: response.goods_img,
                    original_url: response.original_img
                };
                this.head_img_file_list.push(img_info);
            },
            /*删除成功回调*/
            logoRemove(file) {
                //  清空file_list
                if (this.logo_file_list.length > 0 && file.status === 'success') {
                    this.logo_file_list.forEach((item, i) => {
                        if (item.name === file.name) {
                            this.logo_file_list.splice(i, 1);
                        }
                    });
                }
            },
            headRemove(file) {
                if (this.head_img_file_list.length > 0 && file.status === 'success') {
                    this.head_img_file_list.forEach((item, i) => {
                        if (item.name === file.name) {
                            this.head_img_file_list.splice(i, 1);
                        }
                    });
                }
            },
            onSubmit() {
                let post_info = this.form;
                post_info.admin_token = this.$store.state.gl_cms_token;
                post_info.logo_img = this.logo_file_list.length === 0 ? '' : this.logo_file_list[0].url;
                post_info.head_img = this.head_img_file_list.length === 0 ? '' : this.head_img_file_list[0].url;
                if (this.$route.query.edit_type === 'add') {
                    this.add(post_info);
                } else if (this.$route.query.edit_type === 'upd') {
                    this.upd(post_info);
                }
            }
            , add(post_info) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_add_supplier', post_info
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
            , upd(post_info) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_upd_supplier', post_info
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
        },
    };
</script>
<style lang="scss" scoped>
	.main {
		margin-top: 50px;
		width: 70%;
	}
</style>