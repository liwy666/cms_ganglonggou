<template>
	<div class = "main">
		<!--订单-->
		<el-card class = "box-card" shadow = "hover">
			<div slot = "header" class = "clearfix">
				<span>订单信息</span>
			</div>
			<div class = "text item">订单号：{{this.order_info.order_sn}}</div>
			<div class = "text item">退款单号：{{this.order_info.refund_order_sn}}</div>
			<div class = "text item">用户id：{{this.order_info.user_id}}</div>
			<div class = "text item">用户名：{{this.order_info.user_name}}</div>
			<div class = "text item">订单状态码：{{this.order_info.order_state}}</div>
			<div class = "text item">入口：{{this.order_info.son_into_type_name}}</div>
			<div class = "text item">订单原价：￥{{this.order_info.original_order_price}}</div>
			<div class = "text item">使用优惠券后价格：￥{{this.order_info.after_using_coupon_price}}</div>
			<div class = "text item">使用积分后价格：￥{{this.order_info.after_using_integral_price}}</div>
			<div class = "text item">支付打折后价格：￥{{this.order_info.after_using_pay_price}}</div>
			<div class = "text item">最终价格：￥{{this.order_info.order_price}}</div>
			<div class = "text item">本单赠送积分：{{this.order_info.give_integral}}</div>
			<div class = "text item">支付方式：{{this.order_info.pay_name}}{{this.order_info.bystages_val}}</div>
			<div class = "text item">创建时间：{{this.order_info.create_time}}</div>
			<div class = "text item">最后修改时间：{{this.order_info.upd_time}}</div>
			<div class = "text item">支付时间：{{this.order_info.pay_time}}</div>
			<div class = "text item">退款时间：{{this.order_info.refund_time}}</div>
		</el-card>
		<!--商品-->
		<el-card class = "box-card" shadow = "hover" v-if = "get_extra_order_info_load">
			<div slot = "header" class = "clearfix">
				<span>商品信息</span>
			</div>
			<div class = "goods-box" v-for = "(item) in extra_order_info.mid_order" :key = "item.id">
				<div class = "goods-img"><img :src = "item.img_url" class = "image"></div>
				<div class = "goods-info">
					<p class = "goods-name">{{item.goods_name}}</p>
					<p class = "sku-desc">属性：{{item.sku_desc}}</p>
					<p class = "goods-number">购买数量：{{item.goods_number}}</p>
					<p class = "goods-number">购买价格：￥{{item.mid_order_price}}</p>
					<p class = "goods-number">赠送积分：{{item.give_integral}}</p>
				</div>
			</div>
		</el-card>
		<!--物流-->
		<el-card class = "box-card" shadow = "hover">
			<div slot = "header" class = "clearfix">
				<span>物流信息</span>
			</div>
			<div class = "text item">收件人：{{this.order_info.logistics_name}}</div>
			<div class = "text item">手机号：{{this.order_info.logistics_tel}}</div>
			<div class = "text item">地址：{{this.order_info.logistics_address}}</div>
			<div class = "text item">物流类型：{{this.order_info.logistics_code}}</div>
			<div class = "text item">运单号：{{this.order_info.logistics_sn}}</div>
			<div class = "text item">发货时间：{{this.order_info.deliver_goods_time}}</div>
			<div class = "text item">签收时间：{{this.order_info.sign_goods_time}}</div>
		</el-card>
		<!--发票-->
		<el-card class = "box-card" shadow = "hover" v-if = "get_extra_order_info_load">
			<div slot = "header" class = "clearfix">
				<span>发票信息</span>
			</div>
			<div class = "text item">类型：{{this.extra_order_info.order_invoice.invoice_type}}</div>
			<div class = "text item">抬头：{{this.extra_order_info.order_invoice.invoice_head}}</div>
			<div class = "text item">手机号：{{this.extra_order_info.order_invoice.invoice_phone}}</div>
			<div class = "text item">企业名称：{{this.extra_order_info.order_invoice.invoice_qymc}}</div>
			<div class = "text item">纳税人识别号：{{this.extra_order_info.order_invoice.invoice_nsrsbh}}</div>
			<div class = "text item">开票地址：{{this.extra_order_info.order_invoice.invoice_kpdz}}</div>
			<div class = "text item">座机号：{{this.extra_order_info.order_invoice.invoice_zj}}</div>
			<div class = "text item">开户行名称：{{this.extra_order_info.order_invoice.invoice_khh}}</div>
			<div class = "text item">银行账号：{{this.extra_order_info.order_invoice.invoice_yhzh}}</div>
		</el-card>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                order_info: {},
                order_sn: '',
                extra_order_info: {},
                get_extra_order_info_load: false
            };
        },
        computed: {},
        created() {
            if (typeof (this.$route.query.order_info) !== 'undefined') {
                this.order_info = JSON.parse(this.$route.query.order_info);
                this.getExtraOrderInfo(this.order_info.order_sn);
            } else {
                this.order_sn = this.$route.query.order_sn;
                this.getOrderInfo(this.order_sn);
                this.getExtraOrderInfo(this.order_sn);
            }


        },
        methods: {
            getOrderInfo(order_sn) {
                this.$fetch('cms_get_order_info', {
                    admin_token: this.$store.state.gl_cms_token,
                    order_sn: order_sn
                })
                    .then((msg) => {
                        if (msg) {
                            this.order_info = msg;
                        }
                    })
            },
            getExtraOrderInfo(order_sn) {
                this.$fetch('cms_get_extra_order_info', {
                    admin_token: this.$store.state.gl_cms_token,
                    order_sn: order_sn
                })
                    .then((msg) => {
                        if (msg) {
                            this.extra_order_info = msg;
                            this.get_extra_order_info_load = true;
                        }
                    })
            }
        },
    };
</script>
<style lang = "scss" scoped>
	.main {
		.box-card {
			width: 90%;
			margin-top: 20px;
			margin-bottom: 20px;
			margin-left: 5%;

			.text {
				color: #2D64B3;
				font-size: 14px;
				line-height: 25px;
				height: 25px;
			}

			.goods-box {
				width: 600px;
				display: flex;
				border: 1px solid #EBEEF5;
				padding: 10px;
				border-radius: 5px;
				margin-top: 10px;
				cursor: pointer;

				.goods-img {
					width: 140px;

					img {
						width: 100%;
					}
				}

				.goods-info {
					p {
						margin-top: 5px;
					}

					.goods-name {
						color: #2D64B3;
						font-size: 14px;
						font-weight: bolder;
					}

					.sku-desc {
						color: rgb(80, 80, 80);
						font-size: 12px;
					}

					.goods-number {
						color: rgb(80, 80, 80);
						font-size: 12px;
					}
				}
			}
		}
	}
</style>