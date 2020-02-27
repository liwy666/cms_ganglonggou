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
				<el-form-item label="广告位置2" v-show="form.position_type.indexOf('专区') > 0">
					<el-select v-model="form.position_type2" placeholder="请选择">
						<el-option
							v-for="item in position2_type_options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序:">
					<el-input-number v-model="form.sort_order" :min="1" :precision="0" :max="999"
									 :controls="false"></el-input-number>
					<el-alert
						title="数字越大越靠前显示"
						type="warning">
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
				<el-form-item label="外链接" v-show="form.ad_type==='外链接'">
					<el-input v-model="form.url"></el-input>
				</el-form-item>
				<el-form-item label="父楼层名称" v-show="form.position_type==='券享最惠，品悦好物-商品'">
					<el-select v-model="form.father_position_name" placeholder="请选择">
						<el-option
							v-for="item in position_type_name_options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="楼层名称" v-show="form.position_type==='券享最惠，品悦好物-楼层'">
					<el-input v-model="form.position_type_name"></el-input>
				</el-form-item>
				<el-form-item label="商品名称" v-show="form.position_type2==='内容'|| form.position_type==='券享最惠，品悦好物-商品'">
					<el-input v-model="form.goods_name"></el-input>
				</el-form-item>
				<el-form-item label="商品价格" v-show="form.position_type2==='内容'||form.position_type==='券享最惠，品悦好物-商品'">
					<el-input-number v-model="form.goods_price" :min="1" :precision="2"
									 :controls="false"></el-input-number>
				</el-form-item>
			<!--	<el-form-item label="商品原价" v-show="form.position_type2==='内容'||form.position_type==='券享最惠，品悦好物-商品'">
					<el-input-number v-model="form.origin_goods_price" :min="1" :precision="2"
									 :controls="false"></el-input-number>
				</el-form-item>-->
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
		<div class="img-box"><img :src="'./images/'+img_name+'.png'"></div>
	</div>

</template>

<script>
    export default {
        data() {
            return {
                form: {
                    position_type: '顶部图片',
                    position_type_name: '',
                    father_position_name:'',
                    into_type:'3c618pc',
                    position_type2: '内容',
                    goods_name:'',
                    goods_price:0,
                    origin_goods_price:0,
                    ad_type: '外链接',
					url:'',
                    sort_order:10,
                },

                rules: {},
                position_type_options: [
                    {
                        value: '顶部图片',
                        label: '顶部图片'
                    }, {
                        value: '优惠券',
                        label: '优惠券'
                    }, {
                        value: '券享最惠，品悦好物-楼层',
                        label: '券享最惠，品悦好物-楼层'
                    },
                    {
                        value: '券享最惠，品悦好物-商品',
                        label: '券享最惠，品悦好物-商品'
                    },
                    {
                        value: '券享最惠，品悦好物-专区',
                        label: '券享最惠，品悦好物-专区'
                    },
                    {
                        value: '手机数码专区',
                        label: '手机数码专区'
                    }, {
                        value: '电脑办公专区',
                        label: '电脑办公专区'
                    },
                    {
                        value: '品牌专区',
                        label: '品牌专区'
                    },
					{
                        value: '其他专区',
                        label: '其他专区'
                    },
				],
                position2_type_options: [
                    {
                        value: '横图',
                        label: '横图'
                    }, {
                        value: '内容',
                        label: '内容'
                    },],
                ad_type_options: [
                    {
                        value: '无响应',
                        label: '无响应'
                    },
                    {
                        value: '外链接',
                        label: '外链接'
                    },
                ],
                goods_options: [],
                position_type_name_options:[],
                goods_loading: false,
                file_list: [],
                info: {}
            };
        },
        computed: {
            img_name: {
                get: function () {
                    if (this.form.position_type !== '区域板块') {
                        return this.form.position_type;
                    } else {
                        return this.form.position_type + '-' + this.form.position_type2;
                    }
                }
            }
            ,cat_options: {
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
            this.getPositionTypeName();
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
            /*获取楼层名称选项*/
            , getPositionTypeName() {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$fetch('cms_get_all_ad', {
                    admin_token: this.$store.state.gl_cms_token,
                    into_type:this.form.into_type
                })
                    .then((msg) => {
                        msg.forEach(item => {
                            if(item.position_type_name !== '' && item.position_type_name !== null ){
                                this.position_type_name_options.push({value: item.position_type_name, label: item.position_type_name});
							}
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
			width: 40%;
			margin-top: 50px;

			img {
				width: 100%;
			}
		}
	}

</style>