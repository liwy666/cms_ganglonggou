<template>
	<div class="main">
		<div class="form-box">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
				<el-form-item label="广告位置">
					<el-select v-model="form.position_type" placeholder="请选择">
						<el-option
							v-for="item in position_type_options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="广告名称" v-show="form.position_type.indexOf('专区')>=0">
					<el-input v-model="form.position_type_name"></el-input>
					<el-alert
						title="同一广告位置，当通栏名称与内容名称相同，系统会自动将他们摆放到同一区域"
						type="success">
					</el-alert>
				</el-form-item>
				<el-form-item label="响应类型">
					<el-select v-model="form.ad_type" placeholder="请选择">
						<el-option
							v-for="item in ad_type_options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="对应商品ID" v-show="form.ad_type==='商品ID'">
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
				<el-form-item label="对应分类ID" v-show="form.ad_type==='分类ID'">
					<el-select v-model="form.cat_id" placeholder="请选择">
						<el-option-group
							v-for="group in cat_options"
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
				<el-form-item label="对应文章ID" v-show="form.ad_type==='文章ID'">
					<el-select v-model="form.cat_id" placeholder="请选择">
						<el-option-group
							v-for="group in cat_options"
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
				<el-form-item label="文本或关键词或外链接"
					v-show="form.ad_type==='文本'||form.ad_type==='搜索关键词'||form.ad_type==='外链接'">
					<el-input v-model="form.text"></el-input>
				</el-form-item>
				<el-form-item label="排序:">
					<el-input-number v-model="form.sort_order" :min="1" :max="99999" :precision="0"
						:controls="false"></el-input-number>
				</el-form-item>
				<el-form-item label="图片">
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
					<el-button type="primary" @click="onSubmit">确认保存</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="img-box"><img src="../../../assets/images/abc_index_ad_show.jpg"></div>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    position_type: '顶部轮播',
                    position_type_name: '',
                    into_type: 'abc',
                    goods_id: '',
                    cat_id: '',
                    text: '',
                    ad_type: '无响应',
                    sort_order: 10,
                },
                rules: {},
                position_type_options: [
                    {
                        value: '压屏广告',
                        label: '压屏广告'
                    },
                    {
                        value: '顶部轮播',
                        label: '顶部轮播'
                    }, {
                        value: '公告',
                        label: '公告'
                    }, {
                        value: '分类区域',
                        label: '分类区域'
                    },
                    {
                        value: '孤立通栏',
                        label: '孤立通栏'
                    }, {
                        value: '合作伙伴',
                        label: '合作伙伴'
                    }, {
                        value: '服务说明',
                        label: '服务说明'
                    }, {
                        value: '每周特惠横图',
                        label: '每周特惠横图'
                    }, {
                        value: '每周特惠商品',
                        label: '每周特惠商品'
                    }, {
                        value: '专区短横图',
                        label: '专区短横图'
                    }, {
                        value: '专区长横图',
                        label: '专区长横图'
                    },
                    {
                        value: '专区商品',
                        label: '专区商品'
                    },{
                        value: '顶部广告轮播图',
                        label: '顶部广告轮播图(老版本用的)'
                    },
                ],
                ad_type_options: [
                    {
                        value: '无响应',
                        label: '无响应'
                    },
                    {
                        value: '商品ID',
                        label: '商品ID'
                    },
                    {
                        value: '分类ID',
                        label: '分类ID'
                    },
                    {
                        value: '文本',
                        label: '文本'
                    },
                    {
                        value: '搜索关键词',
                        label: '搜索关键词'
                    },
                    {
                        value: '外链接',
                        label: '外链接'
                    },
                ],
                goods_options: [],
                goods_loading: false,
                file_list: [],
                info: {}
            };
        },
        watch: {
            'form.position_type': function (new_val) {
                this.$store.state.page_info_cache.position_type = new_val;
            },
            'form.position_type_name': function (new_val) {
                this.$store.state.page_info_cache.position_type_name = new_val;
            },
            'form.ad_type': function (new_val) {
                this.$store.state.page_info_cache.ad_type = new_val;
            },
        },

        computed: {
            cat_options: {
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
        created() {
            this.form.position_type = this.$store.state.page_info_cache.position_type;
            this.form.position_type_name = this.$store.state.page_info_cache.position_type_name;
            this.form.ad_type = this.$store.state.page_info_cache.ad_type;
            if (this.$store.state.cat_list.length < 1) {
                this.$store.dispatch("getCatList", this.$store.state.gl_cms_token);
            }
            if (this.$route.query.edit_type === 'upd') {
                this.form = JSON.parse(this.$route.query.info);
                let goods_id_array = [this.form.goods_id];
                this.gitGoodsOptions(goods_id_array);
                this.file_list.push({name: this.form.ad_img, url: this.form.ad_img})
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
            }
            , onSubmit() {
                let post_info = this.form;
                post_info.admin_token = this.$store.state.gl_cms_token;
                post_info.ad_img = this.file_list.length === 0 ? '' : this.file_list[0].url;
                if (this.$route.query.edit_type === 'add') {
                    this.addIndexAd(post_info);
                } else if (this.$route.query.edit_type === 'upd') {
                    this.updIndexAd(post_info);
                }
            }
            /*上传前处理*/
            , beforeAvatarUpload(file) {
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
            /*添加广告*/
            addIndexAd(post_info) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_add_index_ad', post_info
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
            /*获取商品选项*/
            , gitGoodsOptions(goods_id_array) {
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
            }
            /*编辑广告*/
            , updIndexAd(post_info) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_upd_index_ad', post_info
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
		width: 100%;
		display: flex;

		.form-box {
			width: 50%;
			margin: 50px;
		}

		.img-box {
			width: 70%;
			margin-top: 50px;
			height: 900px;
			overflow-y: auto;

			img {
				width: 100%;
			}
		}
	}
</style>