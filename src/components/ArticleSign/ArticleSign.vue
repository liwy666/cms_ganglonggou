<template>
	<div class="main">
		<div class="button-box">
			<el-button type="primary" @click="$router.push('/CreateShareUrl')">
				创建链接
			</el-button>
		</div>
		<el-table
			:data="tableData"
			height="850px"
			stripe
			border
			style="width: 100%">
			<el-table-column
				prop="user_id"
				label="用户标识"
				width="100">
			</el-table-column>
			<el-table-column
				prop="create_time"
				label="创建时间"
				width="200">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="count_day"
				label="累计签到次数"
				width="150">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="continuity_day"
				label="连续签到次数"
				width="150">
			</el-table-column>
			<el-table-column
				prop="avg_time"
				label="平均签到时间"
				width="200">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				prop="count_share"
				label="有效分享次数"
				width="250">
			</el-table-column>
		</el-table>
		<div class="my-el-pagination">
			<el-pagination
				@size-change="getList"
				@current-change="getList"
				:current-page.sync="page"
				:page-sizes="[10, 20, 30, 40,80,160]"
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
                limit: 20,
                count: 0,
            };
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                let m_loading = this.$loading({
                    text: '加载中'
                });
                this.$fetch('article_sign_get_user_list', {
                    admin_token: this.$store.state.gl_cms_token,
                    page: this.page,
                    limit: this.limit,
                })
                    .then((msg) => {
                        this.$set(this, 'tableData', msg.list);
                        this.$set(this, 'count', msg.count);
                        m_loading.close();
                    })
            }
        },
    };
</script>
<style lang="scss" scoped>
</style>