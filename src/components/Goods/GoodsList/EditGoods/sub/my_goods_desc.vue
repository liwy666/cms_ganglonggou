<template>
	<div class="main">
		<VueUeditorWrap v-model="goods_desc" :config="myConfig"></VueUeditorWrap>
	</div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap'
    export default {
        data() {
            return {
                goods_desc: '',
                myConfig: {
                    autoHeightEnabled: false,
                    initialFrameHeight: 500,
                    initialFrameWidth: '100%',
                    UEDITOR_HOME_URL: process.env.BASE_URL + 'UEditor/',
                    serverUrl:this.$store.state.api_url + 'ueditor_file_upload'
                }
            };
        },
        computed: {},
        props: ["edit_type"],
        created() {
            if (this.edit_type === 'upd'||this.edit_type === 'copy') {
                this.goods_desc = this.$store.state.goods_info.goods_desc;
            }
        },
        methods: {
        
        },
        components: {
            VueUeditorWrap,//富文本编辑器
        },
    };
</script>

<style lang="scss" scoped>

</style>