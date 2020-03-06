<template>
	<div class="main">
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
			<el-form-item label="分类名称">
				<el-input v-model="form.classify_name"></el-input>
			</el-form-item>
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
			<el-form-item label="响应类型">
				<el-select v-model="form.click_type" placeholder="请选择">
					<el-option
						v-for="item in click_type_options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="搜索关键词" v-show="form.click_type==='搜索关键词'">
				<el-input v-model="form.key_word"></el-input>
				<el-alert
					title="用户点击该分类，系统会自动搜索包涵关键词的商品,如果您没有设定关键词，系统将自动将分类名称作为关键词"
					type="success">
				</el-alert>
			</el-form-item>
			<el-form-item label="对应商品ID" v-show="form.click_type==='商品ID'">
				<el-select
					v-model="form.goods_id"
					filterable
					remote
					reserve-keyword
					placeholder="请输入关键词，进行商品搜索"
					:remote-method="searchGoods"
					:loading="goods_loading">
					<el-option
						v-for="item in goods_options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="排序:">
				<el-input-number v-model="form.sort_order" :min="1" :max="99999" :precision="0"
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
					:file-list="logo_img_file_list"
					:before-upload="beforeAvatarUpload"
					list-type="picture-card">
					<i class="el-icon-plus"></i>
				</el-upload>
			</el-form-item>
			<el-form-item label="横图" v-show="form.parent_id === 0">
				<el-upload
					:action="$store.state.api_url + 'cms/cms_upload_goods_img'"
					:on-success="headUploadSuccess"
					:on-remove="headRemove"
					:limit="1"
					accept="image/jpeg,image/gif,image/png"
					name='portrait_img'
					:file-list="bar_img_file_list"
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
                    into_type: 'wx',
                    classify_name: '',
                    click_type: '搜索关键词',
                    parent_id: 0,
                    sort_order: 10,
                    key_word: '',
                    goods_id: '',
                },
                rules: {},
                goods_options: [],
                goods_loading: false,
                logo_img_file_list: [],
                bar_img_file_list: [],
                click_type_options: [
                    {
                        label: '搜索关键词',
                        value: '搜索关键词',
                    },
                    {
                        label: '商品ID',
                        value: '商品ID',
                    }
                ],
            };
        },
        computed: {
            options: {
                get: function () {
                    let result = [];
                    if (this.$store.state.parent_classify_ad_list.length > 0) {
                        this.$store.state.parent_classify_ad_list.forEach(item => {
                            result.push({value: item.id, label: item.classify_name})
                        });
                    }
                    result.push({value: 0, label: '顶级分类'});
                    return result;
                }
            }
        },
        watch: {
            'form.parent_id': function (new_val) {
                this.$store.state.page_info_cache.parent_id = new_val;
                if (new_val === 0) {
                    this.form.group_name = '';
                }
            },
        },
        created() {
            this.form.parent_id = this.$store.state.page_info_cache.parent_id;
            this.form.into_type = this.$route.query.into_type;
            if (this.$store.state.parent_classify_ad_list.length < 1) {
                this.getParentClassify();
            }
            if (this.$route.query.edit_type === 'upd') {
                this.form = JSON.parse(this.$route.query.info);
                this.logo_img_file_list.push({name: this.form.logo_img, url: this.form.logo_img});
                this.bar_img_file_list.push({name: this.form.bar_img, url: this.form.bar_img});
                let goods_id_array = [this.form.goods_id];
                this.getGoodsOptions(goods_id_array);
            }
        },
        methods: {

            searchGoods(query) {
                if (query !== '') {
                    this.$fetch('cms_search_goods', {
                        admin_token: this.$store.state.gl_cms_token,
                        goods_name: query.replace(/\s+/g, "")
                    })
                        .then((msg) => {
                            this.goods_options = [];
                            msg.forEach(item => {
                                this.goods_options.push({value: item.goods_id, label: item.goods_name})
                            });
                            this.loading = true;
                        }).catch(() => {
                        this.goods_options = [];
                    })
                } else {
                    this.goods_options = [];
                }
            },
            /*获取商品选项*/
            getGoodsOptions(goods_id_array) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$fetch('cms_get_goods_by_goods_id_array', {
                    admin_token: this.$store.state.gl_cms_token,
                    goods_id_array: goods_id_array
                })
                    .then((msg) => {
                        msg.forEach(item => {
                            this.goods_options.push({value: item.goods_id, label: item.goods_name});
                        });
                        m_loading.close();
                    })
            },
            getParentClassify() {
                let m_loading = this.$loading({
                    text: '获取分类列表'
                });
                this.$fetch('cms_get_parent_classify_ad_list', {
                    admin_token: this.$store.state.gl_cms_token,
                    into_type: this.form.into_type,
                })
                    .then((msg) => {
                        this.$set(this.$store.state, 'parent_classify_ad_list', msg);
                        m_loading.close();
                    })
            },
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
                this.logo_img_file_list.push(img_info);
            },
            headUploadSuccess(response) {
                let img_info = {
                    name: response.goods_img,
                    url: response.goods_img,
                    original_url: response.original_img
                };
                this.bar_img_file_list.push(img_info);
            },
            /*删除成功回调*/
            logoRemove(file) {
                //  清空file_list
                if (this.logo_img_file_list.length > 0 && file.status === 'success') {
                    this.logo_img_file_list.forEach((item, i) => {
                        if (item.name === file.name) {
                            this.logo_img_file_list.splice(i, 1);
                        }
                    });
                }
            },
            headRemove(file) {
                if (this.bar_img_file_list.length > 0 && file.status === 'success') {
                    this.bar_img_file_list.forEach((item, i) => {
                        if (item.name === file.name) {
                            this.bar_img_file_list.splice(i, 1);
                        }
                    });
                }
            },

            onSubmit() {
                let post_info = this.form;
                post_info.admin_token = this.$store.state.gl_cms_token;
                post_info.logo_img = this.logo_img_file_list.length === 0 ? '' : this.logo_img_file_list[0].url;
                post_info.bar_img = this.bar_img_file_list.length === 0 ? '' : this.bar_img_file_list[0].url;
                if (this.$route.query.edit_type === 'add') {
                    this.addIndexAd(post_info);
                } else if (this.$route.query.edit_type === 'upd') {
                    this.updIndexAd(post_info);
                }
            }
            /*添加广告*/
            , addIndexAd(post_info) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_add_classify_ad', post_info
                )
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            if (post_info.parent_id === 0) {
                                this.getParentClassify();
                            }
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
                this.$post('cms_upd_classify_ad', post_info
                )
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            if (post_info.parent_id === 0) {
                                this.getParentClassify();
                            }
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
		width: 70%;
		padding: 50px;
	}
</style>