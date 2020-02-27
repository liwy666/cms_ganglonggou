<template>
	<div class="main">
		<div class="one-img" v-for="(item,i) in goods_gallery" :key="i"><img :src="item.url" alt=""></div>
	</div>
</template>

<script>
    export default {
        data() {
            return {

			};
        },
        computed: {
            goods_gallery:{
                get:function () {
                    return this.$store.state.goods_gallery;
                },
            }
		},
        created() {

        },
        methods: {},
    };
</script>

<style lang="scss" scoped>
	.main{
		display: flex;
		.one-img{
			width: 150px;
			height: 150px;
			border: #00b7ee solid 2px;
			margin-left: 5px;
			img{
				width: 100%;
			}
		}
	}
</style>