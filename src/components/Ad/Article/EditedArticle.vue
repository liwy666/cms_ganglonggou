<template>
	<div class="main">
		<VueUeditorWrap v-model="article_body" :config="myConfig"></VueUeditorWrap>
		<div class="input">
			<el-input v-model="article_name" placeholder="请输入文章标题"></el-input>
		</div>
		<div class="input">
			<el-button type="primary" @click="onSubmit">保存文章</el-button>
		</div>
	</div>
</template>
<script>
    import VueUeditorWrap from 'vue-ueditor-wrap'

    export default {
        data() {
            return {
                article_body: '',
                article_name: '',
                article_id: 0,
                myConfig: {
                    autoHeightEnabled: false,
                    initialFrameHeight: 500,
                    initialFrameWidth: '100%',
                    UEDITOR_HOME_URL: process.env.BASE_URL + 'UEditor/',
                    serverUrl: this.$store.state.api_url + 'ueditor_file_upload'
                }
            };
        },
        computed: {},
        created() {
            if (this.$route.query.edit_type === 'upd') {
                this.article_body = JSON.parse(this.$route.query.info).article_body;
                this.article_name = JSON.parse(this.$route.query.info).article_name;
                this.article_id = JSON.parse(this.$route.query.info).id;
            }
        },
        methods: {
            onSubmit() {
                let post_info = {};
                post_info.admin_token = this.$store.state.gl_cms_token;
                post_info.article_body = this.article_body;
                post_info.article_name = this.article_name;
                if (this.$route.query.edit_type === 'add') {
                    this.add(post_info);
                } else if (this.$route.query.edit_type === 'upd') {
                    this.upd(post_info);
                }
            }
            , add(post_info) {
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_add_article', post_info
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
            , upd(post_info) {
                post_info.article_id = this.article_id;
                let m_loading = this.$loading({
                    text: '处理中'
                });
                this.$post('cms_upd_article', post_info
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
        components: {
            VueUeditorWrap,//富文本编辑器
        },
    };
</script>
<style lang="scss" scoped>
	.main {
		width: 70%;
		margin-top: 50px;
		margin-left: 15%;

		.input {
			margin-top: 20px;
		}
	}
</style>