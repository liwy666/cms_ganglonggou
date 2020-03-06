<template>
	<div class="main">
		<div class="button-box">
			<el-button type="primary" @click="add">
				添加供应商
			</el-button>
		</div>
		<el-table
			:data="tableData"
			height="850px"
			stripe
			border
			style="width: 100%">
			<el-table-column
				show-overflow-tooltip
				prop="supplier_name"
				label="供应商名称"
				width="150">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="company_name"
				label="公司名称"
				width="300">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="service_tel"
				label="服务电话"
				width="120">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="after_sale_tel"
				label="售后电话"
				width="120">
			</el-table-column>
			<el-table-column
				prop="describe_rate"
				label="宝贝评分"
				width="80">
			</el-table-column>
			<el-table-column
				prop="service_rate"
				label="售后评分"
				width="80">
			</el-table-column>
			<el-table-column
				prop="logistics_rate"
				label="物流评分"
				width="80">
			</el-table-column>
			<el-table-column
				prop="follow_number"
				label="关注人数"
				width="100">
			</el-table-column>
			<el-table-column
				label="主题色"
				width="160">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>颜色: {{ scope.row.colour }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" :color="scope.row.colour"></el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column
				fixed="right"
				label="操作"
				width="250">
				<template slot-scope="scope">
					<el-button type="text" size="small"
						v-if="tableData[scope.$index].allow_del === 1"
						@click.native.prevent="del(scope.$index, tableData)">删除
					</el-button>
					<el-button type="text" size="small"
						@click.native.prevent="upd(scope.$index, tableData)">编辑
					</el-button>
					<el-button type="text" size="small"
						@click.native.prevent="showImg(scope.$index, tableData,'logo')">查看logo
					</el-button>
					<el-button type="text" size="small"
						@click.native.prevent="showImg(scope.$index, tableData,'head')">查看头图
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="img_url" alt="">
		</el-dialog>
	</div>
</template>
<script>
    export default {
        data() {
            return {
                path: '/EditSupplier',
                tableData: [],
                dialogVisible: false,
                img_url: '',
            };
        },
        computed: {},
        created() {
            this.getList();
        },
        methods: {
            add() {
                this.$router.push(
                    {
                        path: this.path,
                        query: {edit_type: 'add'}
                    })
            }
            , upd(index, rows) {
                this.$router.push({
                    path: this.path,
                    query: {edit_type: 'upd', info: JSON.stringify(rows[index])}
                })
            }
            , del(index, rows) {
                let id = rows[index].id;
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let m_loading = this.$loading({
                        text: '处理中'
                    });
                    this.$post('cms_del_supplier', {admin_token: this.$store.state.gl_cms_token, id: id})
                        .then((msg) => {
                            if (msg) {
                                this.$message({
                                    type: 'success',
                                    message: '处理成功!'
                                });
                                //删除操作
                                rows.splice(index, 1);
                            }
                            m_loading.close();
                        })
                });
            }
            , getList() {
                let m_loading = this.$loading({
                    text: '加载中'
                });
                this.$fetch('cms_get_all_supplier', {
                    admin_token: this.$store.state.gl_cms_token,
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg);
                        m_loading.close();
                    })
            }
            , showImg(index, rows, type) {
                switch (type) {
                    case 'logo':
                        this.img_url = rows[index].logo_img;
                        break;
                    case 'head':
                        this.img_url = rows[index].head_img;
                        break;
                }
                this.dialogVisible = true;
            }
        },
    };
</script>
<style lang="scss" scoped>
</style>