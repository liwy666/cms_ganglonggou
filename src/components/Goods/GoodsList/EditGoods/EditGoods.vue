<template>
	<div class="main">
		<el-tabs v-model="activeName">
			<el-tab-pane label="通用信息" name="goods_currency_info">
				<goodsCurrencyInfo ref="goodsCurrencyInfo" :edit_type="edit_type" v-if="login_flag"></goodsCurrencyInfo>
			</el-tab-pane>
			<el-tab-pane label="详细描述" name="goods_desc">
				<goodsDesc ref="goodsDesc" :edit_type="edit_type" v-if="login_flag"></goodsDesc>
			</el-tab-pane>
			<el-tab-pane label="商品相册" name="goods_gallery">
				<goodsGallery ref="goodsGallery" :edit_type="edit_type" v-if="login_flag"></goodsGallery>
			</el-tab-pane>
			<el-tab-pane label="sku管理" name="goods_sku">
				<goodsSku ref="goodsSku" :edit_type="edit_type" v-if="login_flag"></goodsSku>
			</el-tab-pane>
		</el-tabs>
		<div class="d"></div>
		<div class="save-form-box">
			<el-button type="primary" size="medium" @click="saveForm">确认保存</el-button>
		</div>
	</div>
</template>
<script>
    import goodsCurrencyInfo from './sub/my_goods_currency_info'
    import goodsDesc from './sub/my_goods_desc'
    import goodsGallery from './sub/my_goods_gallery'
    import goodsSku from './sub/my_goods_sku/my_goods_sku'

    export default {
        data() {
            return {
                activeName: 'goods_currency_info',
                goods_id: 0,
                edit_type: 'add',
                login_flag: false,
            };
        },
        computed: {
            ins_evaluate_button_flag: {
                get: function () {
                    let result = false;

                    if ((this.edit_type === 'upd' || this.edit_type === 'copy') && this.login_flag) {
                        result = true;
                    }

                    return result;
                }
            }
        },
        created() {
            this.goods_id = parseInt(this.$route.query.goods_id);
            this.edit_type = this.$route.query.edit_type;
            if (this.edit_type === 'upd' || this.edit_type === 'copy') {
                this.getGoodsInfo();
            } else {
                this.login_flag = true
            }
        },
        methods: {
            /*获取表单信息*/
            saveForm() {
                let check_form = true;
                check_form = this.$refs.goodsCurrencyInfo.checkForm();
                let goods_sku_array = this.$refs.goodsSku.goods_sku_array;
                let goods_gallery = this.$refs.goodsGallery.file_list;
                let attribute = this.$refs.goodsSku.attribute;
                attribute.forEach(item => {
                    if (item.attribute_value.length < 1) {
                        check_form = false;
                        this.$message.error('商品规格下面缺少规格项');
                    }
                });
                //检查sku
                if (goods_sku_array.length < 1) {
                    check_form = false;
                    this.$message.error('你需要添加至少一个sku');
                }
                goods_sku_array.forEach(item => {
                    if (parseFloat(item.integral) > parseFloat(item.sku_shop_price * 100)) {
                        check_form = false;
                        this.$message.error('可使用积分大于销售价格，请检查');
                    }
                    if (parseFloat(item.sku_market_price) < parseFloat(item.sku_shop_price)) {
                        check_form = false;
                        this.$message.error('划线价格小于销售价格，请检查');
                    }
                });
                if (goods_gallery.length < 1) {
                    check_form = false;
                    this.$message.error('你需要至少上传一张图片至商品相册中');
                }
                if (check_form) {
                    let post_info = JSON.parse(JSON.stringify(this.$refs.goodsCurrencyInfo.form));
                    //格式化促销时间
                    if (post_info.promote_date !== null && post_info.is_promote === 1) {
                        post_info.promote_start_date = parseInt(post_info.promote_date[0]) / 1000;
                        post_info.promote_end_date = parseInt(post_info.promote_date[1]) / 1000;
                    } else {
                        post_info.promote_start_date = 0;
                        post_info.promote_end_date = 0;
                    }
                    //商品主图
                    if (this.$refs.goodsCurrencyInfo.file_list.length > 0) {
                        post_info.goods_img = this.$refs.goodsCurrencyInfo.file_list[0].url;
                        post_info.original_img = this.$refs.goodsCurrencyInfo.file_list[0].original_url;
                    }
                    //获取商品详情
                    post_info.goods_desc = this.$refs.goodsDesc.goods_desc;
                    //获取商品相册
                    post_info.goods_gallery = this.$refs.goodsGallery.file_list;
                    //获取商品sku信息
                    post_info.goods_sku_array = [];
                    goods_sku_array.forEach(item => {
                        let result = {
                            sku_desc: item.sku_desc,
                            sku_stock: item.sku_stock,
                            sku_shop_price: item.sku_shop_price,
                            sku_market_price: item.sku_market_price,
                            give_integral: item.give_integral,
                            integral: item.integral,
                            img_url: item.img_url,
                            original_img_url: item.original_img_url,
                        };
                        post_info.goods_sku_array.push(result);
                    });
                    post_info.attribute = this.$refs.goodsSku.attribute;
                    //用户信息
                    post_info.admin_token = this.$store.state.gl_cms_token;
                    //发送请求
                    if (this.edit_type === 'add' || this.edit_type === 'copy') {
                        this.addGoods(post_info);
                    } else if (this.edit_type === 'upd') {
                        this.updGoods(post_info);
                    }
                }
            }
            /*添加商品*/
            , addGoods(post_info) {
                let m_loading = this.$loading({
                    text: '添加中'
                });
                this.$post('cms_add_goods', post_info)
                    .then((msg) => {
                        if (msg) {
                            this.$router.go(-1);
                            this.$message({
                                type: 'success',
                                message: '添加成功!'
                            });
                        } else {
                            this.$message.error('添加失败');
                        }
                        m_loading.close();
                    })
            }
            /*更新商品*/
            , updGoods(post_info) {
                let m_loading = this.$loading({
                    text: '更新中'
                });
                this.$post('cms_upd_goods', post_info)
                    .then((msg) => {
                        if (msg) {
                            this.$router.go(-1);
                            this.$message({
                                type: 'success',
                                message: '更新成功!'
                            });
                        } else {
                            this.$message.error('更新失败');
                        }
                        m_loading.close();
                    })
            }
            /*获取商品信息*/
            , getGoodsInfo() {
                let m_loading = this.$loading({
                    text: '获取商品信息'
                });
                this.$fetch('cms_get_goods_info', {
                    admin_token: this.$store.state.gl_cms_token,
                    goods_id: this.goods_id
                })
                    .then((msg) => {
                        this.$set(this.$store.state, 'goods_info', msg);
                        this.login_flag = true;
                        m_loading.close();
                    })
            }
        },
        components: {
            goodsCurrencyInfo,//商品通用信息
            goodsDesc,//商品详细信息
            goodsGallery,//商品相册
            goodsSku//商品sku管理
        },
    };
</script>
<style lang="scss" scoped>
	.main {
		padding: 30px;

		.d {
			width: 100%;
			height: 50px;
		}

		.save-form-box {
			position: fixed;
			bottom: 0;
			height: 50px;
			width: 100%;
			background-color: white;
		}
	}
</style>