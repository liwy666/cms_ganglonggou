<template>
	<div class="main">
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="80px" size="mini" inline>
				<el-form-item label="商品名称">
					<el-input v-model="form.goods_name"></el-input>
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
				<el-form-item>
					<el-button type="primary" @click="getGoodsList">搜索</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="button-box">
			<el-button type="primary"
				@click="$router.push({ path: 'EditGoods', query: { edit_type: 'add',goods_id:'0' }})">
				添加商品
			</el-button>
			<el-button type="primary" @click="$router.push({ path: 'BatchUpdGoodsHeadName'})">
				批量修改商品头
			</el-button>
			<el-button type="primary" @click="$router.push({ path: 'CopyGoodsByParentId'})">
				通过顶级分类复制商品
			</el-button>
			<el-button type="primary" @click="exportExcel">
				导出
			</el-button>
			<el-button type="primary" @click="cleanCache">清除缓存</el-button>
			<!--<el-upload
				class="upload-excel"
				ref="upload"
				:show-file-list="false"
				action=""
				:on-change="importfxx"
				:auto-upload="false">
				<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
				<div slot="tip" class="el-upload__tip">选取excel文件,进行sku的批量修改</div>
			</el-upload>-->
		</div>
		<div class="table-box">
			<el-table
				:data="tableData"
				height="850px"
				stripe
				border
				:row-class-name='rowClassName'
				ref="table"
				style="width: 100%">
				<el-table-column
					prop="goods_id"
					label="商品id"
					width="100">
				</el-table-column>
				<el-table-column
					prop="goods_name"
					label="商品名称"
					width="600">
				</el-table-column>
				<el-table-column
					prop="shop_price"
					label="商品基础价格"
					width="200">
				</el-table-column>
				<el-table-column
					prop="goods_sales_volume"
					label="商品销量"
					width="180">
				</el-table-column>
				<el-table-column
					prop="evaluate_count"
					label="评论总数"
					width="180">
				</el-table-column>
				<el-table-column
					prop="click_count"
					label="点击量"
					width="100">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="300">
					<template slot-scope="scope">
						<el-button type="text" size="small"
							@click.native.prevent="insEvaluate(scope.$index, tableData)">
							添加评论
						</el-button>
						<el-button type="text" size="small"
							@click.native.prevent="delGoods(scope.$index, tableData)">
							删除
						</el-button>
						<el-button type="text" size="small"
							@click.native.prevent="updGoods(scope.$index, tableData)">
							编辑
						</el-button>
						<el-button type="text" size="small"
							@click.native.prevent="copyGoods(scope.$index, tableData)">
							复制
						</el-button>
						<el-button type="text" size="small"
							v-if="tableData[scope.$index].is_on_sale === 1"
							@click.native.prevent="endOfSale(scope.$index, tableData)">
							下架
						</el-button>
						<el-button type="text" size="small"
							v-if="tableData[scope.$index].is_on_sale === 0"
							@click.native.prevent="allowSale(scope.$index, tableData)">
							上架
						</el-button>
						<el-button type="text" size="small">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="my-el-pagination">
			<el-pagination
				@size-change="getGoodsList"
				@current-change="getGoodsList"
				:current-page.sync="page"
				:page-sizes="[10, 20, 30, 40]"
				:page-size.sync="limit"
				layout="sizes, prev, pager, next"
				:total="count">
			</el-pagination>
		</div>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                tableData: [],
                page: 1,
                limit: 10,
                count: 0,
                form: {
                    goods_name: '',
                    cat_id: ''
                }
                , fileList: []
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
                    result.push({
                        label: '全部',
                        options: [{
                            value: '',
                            label: '所有分类'
                        }]
                    });
                    return result;
                }
            }
        },
        watch: {
            'page': function (newVal) {
                this.$store.state.page_info_cache.page = newVal;
            },
            'limit': function (newVal) {
                this.$store.state.page_info_cache.limit = newVal;
            },
            'form.goods_name': function (newVal) {
                this.$store.state.page_info_cache.goods_name = newVal;
            },
            'form.cat_id': function (newVal) {
                this.$store.state.page_info_cache.cat_id = newVal;
            },
        },
        created() {
            this.page = this.$store.state.page_info_cache.page;
            this.limit = this.$store.state.page_info_cache.limit;
            this.form.goods_name = this.$store.state.page_info_cache.goods_name;
            this.form.cat_id = this.$store.state.page_info_cache.cat_id;

            if (this.$store.state.cat_list.length < 1) {
                this.$store.dispatch("getCatList", this.$store.state.gl_cms_token);
            }
            if (this.$route.query.type === 'see') {
                this.form.cat_id = this.$route.query.cat_id;
                this.getGoodsList();
            } else {
                this.getGoodsList();
            }
        },
        methods: {
            getGoodsList() {
                let m_loading = this.$loading({
                    text: '获取商品列表'
                });
                this.$fetch('cms_get_goods_list', {
                    admin_token: this.$store.state.gl_cms_token,
                    page: this.page,
                    limit: this.limit,
                    goods_name: this.form.goods_name,
                    cat_id: this.form.cat_id
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg.list);
                        this.$set(this, 'count', msg.count);
                        m_loading.close();
                    })
            },
            /*正在秒杀商品显示特殊颜色*/
            rowClassName(row) {
                if (row.is_promote > 0 && parseInt(row.promote_start_date * 1000) < parseInt(new Date().getTime()) && parseInt(row.promote_end_date * 1000) > parseInt(new Date().getTime())) {
                    return 'warning-row';
                }
            }
            /*删除商品*/
            , delGoods(index, rows) {
                let goods_id = rows[index].goods_id;
                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '删除中'
                    });
                    this.$post('cms_del_goods', {admin_token: this.$store.state.gl_cms_token, goods_id: goods_id})
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                rows.splice(index, 1);
                            }
                            m_loading.close();
                        })


                });
            }
            /*上下架*/
            , endOfSale(index, rows) {
                let goods_id = rows[index].goods_id;
                this.$confirm('下架商品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '下架中'
                    });
                    this.$post('cms_end_of_sale_goods', {
                        admin_token: this.$store.state.gl_cms_token,
                        goods_id: goods_id
                    })
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '下架成功!'
                                });
                                this.getGoodsList();
                            }
                            m_loading.close();
                        })


                });
            }
            , allowSale(index, rows) {
                let goods_id = rows[index].goods_id;
                this.$confirm('上架商品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '上架中'
                    });
                    this.$post('cms_allow_sale_goods', {
                        admin_token: this.$store.state.gl_cms_token,
                        goods_id: goods_id
                    })
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '下架成功!'
                                });
                                this.getGoodsList();
                            }
                            m_loading.close();
                        })
                });
            }
            , updGoods(index, rows) {
                let goods_id = rows[index].goods_id;
                this.$router.push({path: 'EditGoods', query: {edit_type: 'upd', goods_id: goods_id}})
            }
            , copyGoods(index, rows) {
                let goods_id = rows[index].goods_id;
                this.$router.push({path: 'EditGoods', query: {edit_type: 'copy', goods_id: goods_id}})
            }
            /*添加评论*/
            , insEvaluate(index, rows) {
                let goods_id = rows[index].goods_id;
                this.$router.push({
                    path: "/AddEvaluate",
                    query: {
                        goods_id: goods_id
                    }
                })
            }
            /*excle操作*/
            , exportExcel() {
                this.$prompt('请输入导出名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '名称不能为空',
                }).then(({value}) => {
                    require.ensure([], () => {
                        const {export_json_to_excel} = require('../../../excel/Export2Excel');
                        const tHeader = ['goods_id', 'goods_name'];
                        // 上面设置Excel的表格第一行的标题
                        const filterVal = ['goods_id', 'goods_name'];
                        // 上面的index、nickName、name是tableData里对象的属性
                        const list = this.tableData;  //把data里的tableData存到list
                        const data = this.formatJson(filterVal, list);
                        export_json_to_excel(tHeader, data, value);
                    })
                });
            }
            , formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            /* importfxx(file) {
				 //let _this = this;
				 //let inputDOM = this.$refs.inputer;
				 // 通过DOM取文件数据
				 //this.file = event.currentTarget.files[0];
				 var rABS = false; //是否将文件读取为二进制字符串
				 var f = file;
				 var reader = new FileReader();
				 FileReader.prototype.readAsBinaryString = function (f) {
					 var binary = "";
					 var rABS = false; //是否将文件读取为二进制字符串
					 //var pt = this;
					 var wb; //读取完成的数据
					 //var outdata;
					 var reader = new FileReader();
					 reader.onload = function (e) {
						 var bytes = new Uint8Array(reader.result);
						 var length = bytes.byteLength;
						 for (var i = 0; i < length; i++) {
							 binary += String.fromCharCode(bytes[i]);
						 }
						 var XLSX = require('xlsx');
						 if (rABS) {
							 wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
								 type: 'base64'
							 });
						 } else {
							 wb = XLSX.read(binary, {
								 type: 'binary'
							 });
						 }
						 let outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
					 };
					 reader.readAsArrayBuffer(f);
				 };
				 if (rABS) {
					 reader.readAsArrayBuffer(f);
				 } else {
					 reader.readAsBinaryString(f);
				 }
			 },*/
            cleanCache() {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('clean_user_goods_list_cache', {admin_token: this.$store.state.gl_cms_token})
                    .then((msg) => {
                        if (msg) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }
                        m_loading.close();
                    });
            }
        },
    }
    ;
</script>
<style lang="scss" scoped>
	.button-box {
		padding: 10px;
		display: flex;

		.upload-excel {
			margin-left: 20px;
		}
	}

	.form-box {
		margin-top: 20px;
	}

	.warning-row {
		background: #f0f9eb;
	}

	.my-el-pagination {
		z-index: 10;
		position: fixed;
		bottom: 0;
	}
</style>