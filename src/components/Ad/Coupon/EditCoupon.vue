<template>
	<div class="main">
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="150px" :rules="rules" size="mini">
				<el-form-item label="优惠券名称" prop="coupon_name">
					<el-input v-model="form.coupon_name"></el-input>
				</el-form-item>
				<el-form-item label="优惠券描述" prop="coupon_desc">
					<el-input v-model="form.coupon_desc"></el-input>
					<el-alert
						title="用户可见"
						type="warning">
					</el-alert>
				</el-form-item>
				<el-form-item label="发放时间" prop="grant_time">
					<el-date-picker
						v-model="form.grant_time"
						type="datetimerange"
						value-format="timestamp"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="使用时间" prop="use_time">
					<el-date-picker
						v-model="form.use_time"
						type="datetimerange"
						value-format="timestamp"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="满足金额:">
					<el-input-number v-model="form.found_sum" :min="1" :precision="2"
									 prop="found_sum"
									 :controls="false"></el-input-number>
				</el-form-item>
				<el-form-item label="减免金额:">
					<el-input-number v-model="form.cut_sum" :min="0" :precision="2"
									 prop="cut_sum"
									 :controls="false"></el-input-number>
				</el-form-item>
				<el-form-item label="发放数量:">
					<el-input-number v-model="form.coupon_number" :min="0" :precision="0"
									 prop="coupon_number"
									 :controls="false"></el-input-number>
				</el-form-item>
				<el-form-item label="剩余数量:">
					<el-input-number v-model="form.coupon_remainder_number" :min="0" :max="form.coupon_number"
									 :precision="0"
									 prop="coupon_remainder_number"
									 :controls="false"></el-input-number>
				</el-form-item>
				<el-form-item label="入口类型:">
					<el-select v-model="form.into_type" placeholder="请选择">
						<el-option
							v-for="item in coupon_inlet_options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="优惠券类型:">
					<el-select v-model="form.grant_type" placeholder="请选择">
						<el-option
							v-for="item in grant_type_options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="可用分类" v-show="form.grant_type === 'classify'">
					<el-select v-model="form.classify" placeholder="请选择" multiple>
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
				<el-form-item label="可用商品" v-show="form.grant_type === 'solo'">
					<el-select
						v-model="form.solo"
						multiple
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
                    coupon_name: '',
                    coupon_desc: '',
                    grant_time: null,
                    use_time: null,
                    classify: [],
                    solo: [],
                    found_sum: 1,
                    cut_sum: 0,
                    coupon_number: 0,
                    coupon_remainder_number: 0,
                    into_type: 'wx',
                    grant_type: 'all',
                },
                rules: {
                    coupon_name: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                    coupon_desc: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                    grant_time: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                    use_time: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                    found_sum: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                    cut_sum: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                    coupon_number: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                    coupon_remainder_number: [
                        {required: true, message: '必选项', trigger: 'blur'},
                    ],
                },
                coupon_inlet_options: [{value: 'wx', label: '微信公众号入口'}, {value: 'abc', label: '农行入口'}],
                grant_type_options: [
                    {value: 'all', label: '全场券'},
                    {value: 'solo', label: '商品券'},
                    {value: 'classify', label: '分类券'}],
                classify_options: [],
                goods_options: [],
                goods_loading: false,
                coupon_info: {},
            };
        },
        computed: {
            cat_option: {
                get: function () {
                    let result = [];
                    if (this.$store.state.cat_list.length > 0) {
                        this.$store.state.cat_list.forEach(item => {
                            if (item.parent_id === 0) {
                                let options = [];
                                this.$store.state.cat_list.forEach(item2 => {
                                    if (item.cat_id === item2.parent_id) {
                                        options.push({label: item2.cat_name, value: item2.cat_id})
                                    }
                                });
                                result.push({label: item.cat_name, options: options});
                            }
                        })
                    }
                    return result;
                }
            }
        },
        created() {
            if (this.$store.state.cat_list.length < 1) {
                this.$store.dispatch("getCatList", this.$store.state.gl_cms_token);
            }
            if (this.$route.query.type === 'upd') {
                this.coupon_info = JSON.parse(this.$route.query.coupon_info);
                this.getCouponInfo();
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
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.$message.error('表单验证不通过！，检查必要信息是否填写完成');
                    } else {
                        let m_loading = this.$loading({
                            text: '处理中'
                        });
                        let post_url = 'cms_add_coupon';
                        if (this.$route.query.type === 'upd') {
                            post_url = 'cms_upd_coupon'
                        }
                        let post_info = this.form;
                        post_info.start_grant_time = parseInt(this.form.grant_time[0]) / 1000;
                        post_info.end_grant_time = parseInt(this.form.grant_time[1]) / 1000;
                        post_info.start_use_time = parseInt(this.form.use_time[0]) / 1000;
                        post_info.end_use_time = parseInt(this.form.use_time[1]) / 1000;
                        post_info.admin_token = this.$store.state.gl_cms_token;
                        this.$post(post_url, post_info)
                            .then((msg) => {
                                if (msg) {
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.$router.go(-1);
                                }
                                m_loading.close();
                            })
                    }
                });
            }
            , getCouponInfo() {
                this.form = this.coupon_info;
                this.$set(this.form, 'grant_time', new Array(new Date(this.coupon_info.start_grant_time).getTime(), new Date(this.coupon_info.end_grant_time).getTime()));
                this.$set(this.form, 'use_time', new Array(new Date(this.coupon_info.start_use_time).getTime(), new Date(this.coupon_info.end_use_time).getTime()));
                if (this.form.grant_type === 'solo') {
                    this.getGoodsOptions(this.form.solo);
                }
            }
            /*获取商品选项*/
            , getGoodsOptions(goods_id_array) {
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
            /*获取分类选项*/
            , getCatOptions(cat_id_array) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$fetch('cms_get_cat_by_cat_id_array', {
                    admin_token: this.$store.state.gl_cms_token,
                    cat_id_array: cat_id_array
                })
                    .then((msg) => {
                        msg.forEach(item => {
                            this.goods_options.push({value: item.goods_id, label: item.goods_name});
                        });
                        m_loading.close();
                    })
            }
        },
    };
</script>

<style lang="scss" scoped>
	.form-box {
		width: 70%;
		margin-top: 50px;
	}
</style>