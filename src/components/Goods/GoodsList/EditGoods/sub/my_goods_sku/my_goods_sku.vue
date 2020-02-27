<template>
	<div class="main">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>规格</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="addAttribute">添加规格</el-button>
			</div>
			<el-card class="box-card" v-for="(item,i) in attribute" :key="i">
				<div slot="header" class="clearfix">
					<span>{{item.attribute_name}}</span>
					<el-button style="float: right; padding: 3px 0;color: red" type="text" @click="removeAttribute(i)">
						删除此规格
					</el-button>
					<el-button style="float: right; padding: 3px 0;margin-right: 20px" type="text"
						@click="addAttributeValue(i)">
						添加规格项
					</el-button>
				</div>
				<div>
					<el-tag
						v-for="(item2,i2) in item.attribute_value" :key="i2"
						closable
						@click="updAttributeValue(i,i2)"
						@close="removeAttributeValue(i,i2)"
						type="success">
						{{item2}}
					</el-tag>
				</div>
			</el-card>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>生成的SKU</span>
			</div>
			<el-alert
				title="100积分 = 1元人民币"
				type="warning">
			</el-alert>
			<div v-for="(item,i) in goods_sku_array" :key="i" class="text item">
				<el-form ref="form" :model="item" label-width="80px" inline size="mini">
					<el-form-item label="">
						<el-input v-model="item.sku_desc" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="库存:">
						<el-input-number v-model="item.sku_stock" :min="0" :precision="0"
							:controls="false"></el-input-number>
						<el-tooltip class="item" effect="dark" content="向下同步库存" placement="bottom">
							<el-button v-if="i===0&&goods_sku_array.length>1" icon="el-icon-refresh" circle
								@click="synchronization('sku_stock')"></el-button>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="赠送积分:">
						<el-input-number v-model="item.give_integral" :min="0" :precision="0"
							:controls="false"></el-input-number>
						<el-tooltip class="item" effect="dark" content="向下同步赠送积分数量" placement="bottom">
							<el-button v-if="i===0&&goods_sku_array.length>1" icon="el-icon-refresh" circle
								@click="synchronization('give_integral')"></el-button>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="可用积分:">
						<el-input-number v-model="item.integral" :min="0" :precision="0"
							:max="item.sku_shop_price * 100"
							:controls="false"></el-input-number>
						<el-tooltip class="item" effect="dark" content="向下同步使用积分数量" placement="bottom">
							<el-button v-if="i===0&&goods_sku_array.length>1" icon="el-icon-refresh" circle
								@click="synchronization('integral')"></el-button>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="销售价:">
						<el-input-number v-model="item.sku_shop_price" :min="0" :precision="2" :controls="false"
							@change="$forceUpdate()"></el-input-number>
						<el-tooltip class="item" effect="dark" content="向下同步销售价" placement="bottom">
							<el-button v-if="i===0&&goods_sku_array.length>1" icon="el-icon-refresh" circle
								@click="synchronization('sku_shop_price')"></el-button>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="划线价:">
						<el-input-number v-model="item.sku_market_price" :min="item.sku_shop_price" :precision="2"
							:controls="false"></el-input-number>
						<el-tooltip class="item" effect="dark" content="向下同步划线价" placement="bottom">
							<el-button v-if="i===0&&goods_sku_array.length>1" icon="el-icon-refresh" circle
								@click="synchronization('sku_market_price')"></el-button>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="">
						<div class="img-url-box">
							<div class="img-url"><img :src="item.img_url" alt=""></div>
							<el-button type="primary" @click="showDialog(i)">选择图片</el-button>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
		<el-dialog title="点击选择一张照片" :visible.sync="dialog_visible">
			<div class="dialog-goods-gallery-box">
				<div class="one-img" v-for="(item,i) in goods_gallery" :key="i"
					@click="selectSkuImg(item.url,item.original_url)"><img :src="item.url" alt=""></div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    //import dialogGoodsGallery from './sub/dialog_goods_gallery'

    export default {
        data() {
            return {
                attribute: [],
                login_flag: false,
                dialog_visible: false,
                goods_sku_array_index: 0
            };
        },
        computed: {
            goods_sku_array: {
                get: function () {
                    let resultArry = [];
                    this.attribute.forEach((arrItem) => {
                        if (resultArry.length === 0) {
                            resultArry = arrItem.attribute_value
                        } else {
                            const emptyArray = [];
                            resultArry.forEach((item) => {
                                arrItem.attribute_value.forEach((value) => {
                                    emptyArray.push([item, value])
                                })
                            });
                            resultArry = emptyArray
                        }
                    });
                    let result = [];
                    if (!this.login_flag) {
                        resultArry.forEach(item => {
                            if (Array.isArray(item)) {
                                result.push({
                                    sku_desc: item.join(','),
                                    sku_stock: 0,
                                    give_integral: 0,
                                    integral: 0,
                                    sku_shop_price: 0,
                                    img_url: '',
                                    original_img_url: '',
                                    sku_market_price: 0,
                                })
                            } else {
                                result.push({
                                    sku_desc: item,
                                    sku_stock: 0,
                                    give_integral: 0,
                                    integral: 0,
                                    img_url: '',
                                    original_img_url: '',
                                    sku_shop_price: 0,
                                    sku_market_price: 0,
                                })
                            }
                        });
                    } else {
                        let goods_sku_ = this.$store.state.goods_info.goods_sku;
                        let goods_sku_array_ = [];
                        if (goods_sku_.length > 0) {
                            goods_sku_.forEach(item => {
                                let goods_sku_array_object = {
                                    sku_desc: item.sku_desc,
                                    img_url: item.img_url,
                                    original_img_url: item.original_img_url,
                                    give_integral: parseInt(item.give_integral),
                                    integral: parseInt(item.integral),
                                    sku_shop_price: parseFloat(item.sku_shop_price),
                                    sku_market_price: parseFloat(item.sku_market_price),
                                    sku_stock: parseInt(item.sku_stock),
                                };

                                goods_sku_array_.push(goods_sku_array_object);
                            })
                        }
                        result = goods_sku_array_;
                        this.login_flag = false;
                    }
                    this.sortChinese(result, 'sku_desc');
                    return result;
                }
                , set: function () {

                }
            },
            goods_gallery: {
                get: function () {
                    return this.$store.state.goods_gallery;
                },
            }
        },
        watch: {
            'goods_sku_array'(nweVal, lodVal) {
                nweVal.forEach((item, i) => {
                    lodVal.forEach(item2 => {
                        if (item.sku_desc === item2.sku_desc) {
                            this.goods_sku_array[i] = item2;
                        }
                    })
                });
                this.$forceUpdate();
            }
        },
        props: ["edit_type"],
        created() {
            if (this.edit_type === 'upd' || this.edit_type === 'copy') {
                if (this.$store.state.goods_info.attribute !== '' && this.$store.state.goods_info.attribute !== null) {
                    this.attribute = this.$store.state.goods_info.attribute;
                } else {
                    this.attribute = [];
                }
                this.login_flag = true;
            }
        },
        methods: {
            /*添加规格*/
            addAttribute() {
                this.$prompt('请输入规格名称（如：颜色）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '名称不能为空'
                }).then(({value}) => {
                    //判断名称是否重复
                    let check_flag = true;
                    if (this.attribute.length > 0) {
                        this.attribute.forEach(item => {
                            if (item.attribute_name === value) {
                                check_flag = false;
                                this.$message.error('规格名称重复');
                            }
                        })
                    }
                    if (check_flag) {
                        let result = {attribute_name: value, attribute_value: []};
                        this.attribute.push(result);
                    }
                })
            }
            /*删除规格*/
            , removeAttribute(i) {
                this.attribute.splice(i, 1);
            }
            /*添加规格项*/
            , addAttributeValue(i) {
                this.$prompt('请输入规格项名称（如：金色）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '名称不能为空'
                }).then(({value}) => {
                    //判断名称是否重复
                    let check_flag = true;
                    if (this.attribute[i].attribute_value.length > 0) {
                        this.attribute[i].attribute_value.forEach(item => {
                            if (item === value) {
                                check_flag = false;
                                this.$message.error('规格项名称重复');
                            }
                        })
                    }
                    if (check_flag) {
                        this.attribute[i].attribute_value.push(value);
                    }

                })
            },
            /*删除规格项*/
            removeAttributeValue(i1, i2) {
                this.attribute[i1].attribute_value.splice(i2, 1);
            },
            /*向下同步*/
            synchronization(synchronization_type) {
                if (synchronization_type === 'sku_stock') {
                    this.goods_sku_array.forEach((item, i) => {
                        if (i !== 0) {
                            this.$set(this.goods_sku_array[i], 'sku_stock', this.goods_sku_array[0].sku_stock)
                        }
                    })
                } else if (synchronization_type === 'sku_shop_price') {
                    this.goods_sku_array.forEach((item, i) => {
                        if (i !== 0) {
                            this.$set(this.goods_sku_array[i], 'sku_shop_price', this.goods_sku_array[0].sku_shop_price)
                        }

                    })
                } else if (synchronization_type === 'sku_market_price') {
                    this.goods_sku_array.forEach((item, i) => {
                        if (i !== 0) {
                            this.$set(this.goods_sku_array[i], 'sku_market_price', this.goods_sku_array[0].sku_market_price)
                        }

                    })
                } else if (synchronization_type === 'give_integral') {
                    this.goods_sku_array.forEach((item, i) => {
                        if (i !== 0) {
                            this.$set(this.goods_sku_array[i], 'give_integral', this.goods_sku_array[0].give_integral)
                        }
                    })
                } else if (synchronization_type === 'integral') {
                    this.goods_sku_array.forEach((item, i) => {
                        if (i !== 0) {
                            this.$set(this.goods_sku_array[i], 'integral', this.goods_sku_array[0].integral)
                        }
                    })
                }
                this.$forceUpdate();
            }
            /*显示商品相册*/
            , showDialog(index) {
                this.dialog_visible = true;
                this.goods_sku_array_index = index;
            }
            /*选择图片*/
            , selectSkuImg(url, original_url) {
                this.$set(this.goods_sku_array[this.goods_sku_array_index], 'img_url', url);
                this.$set(this.goods_sku_array[this.goods_sku_array_index], 'original_img_url', original_url);
                this.dialog_visible = false;
            }
            /*修改属性名*/
            , updAttributeValue(index1, index2) {
                this.$prompt('请输入规格项名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '名称不能为空',
                    inputPlaceholder: this.attribute[index1].attribute_value[index2]
                }).then(({value}) => {
                    //判断名称是否重复
                    let check_flag = true;
                    if (this.attribute[index1].attribute_value.length > 0) {
                        this.attribute[index1].attribute_value.forEach(item => {
                            if (item === value) {
                                check_flag = false;
                                this.$message.error('规格项名称重复');
                            }
                        })
                    }
                    if (check_flag) {
                        this.$set(this.attribute[index1].attribute_value, index2, value)
                    }
                })
            }
            /**
             * 数组排序
             * @param property
             * @returns {function(*, *): number}
             */
            , sortChinese(arr, dataLeven) { // 参数：arr 排序的数组; dataLeven 数组内的需要比较的元素属性
                /* 获取数组元素内需要比较的值 */
                function getValue(option) { // 参数： option 数组元素
                    if (!dataLeven) return option;
                    var data = option;
                    dataLeven.split('.').filter(function (item) {
                        data = data[item]
                    });
                    return data + ''
                }

                arr.sort(function (item1, item2) {
                    return getValue(item1).localeCompare(getValue(item2), 'zh-CN');
                })
            }
        },
        //挂载子组件
        components: {
            // dialogGoodsGallery,
        },
    }
    ;
</script>
<style lang="scss" scoped>
	.box-card {
		margin-bottom: 50px;
	}

	.img-url-box {
		display: flex;

		.img-url {
			width: 80px;
			height: 80px;

			img {
				width: 100%;
			}
		}
	}

	.dialog-goods-gallery-box {
		display: flex;
		flex-wrap: wrap;

		.one-img {
			width: 150px;
			height: 150px;
			border: #00b7ee solid 5px;
			margin-left: 5px;
			margin-bottom: 5px;

			img {
				width: 100%;
			}
		}
	}
</style>