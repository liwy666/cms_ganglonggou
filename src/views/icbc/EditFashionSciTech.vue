<template>
  <div class="editFashionSciTechMain">
    <icbc-form :position-type-options="positionTypeOptions" into-type="fashion_sci_tech"
               :preview-img-url="previewImgUrl"></icbc-form>
  </div>
</template>

<script>
    import icbcForm from "../../components/icbcForm";

    export default {
        name: "EditFashionSciTech",
        data() {
            return {
                positionTypeOptions: [

                    {
                        value: '顶部轮播',
                        label: '顶部轮播'
                    },
                    {
                        value: '新品尝鲜-商品GN',
                        label: '新品尝鲜-商品'
                    },
                    {
                        value: '热销手机-商品N',
                        label: '热销手机-商品'
                    },
                    {
                        value: '平板电脑-商品GN',
                        label: '平板电脑-商品'
                    },
                    {
                        value: '潮流周边-商品GN',
                        label: '潮流周边-商品'
                    },
                    {
                        value: '办公好物-商品GN',
                        label: '办公好物-商品'
                    },
                    {
                        value: '底部文章',
                        label: '底部文章'
                    }
                ],
                previewImgUrl: `${process.env.BASE_URL}images/fashion_sci_tech_show.jpeg`,
            }
        },
        mounted() {
        },
        components: {
            'icbc-form': icbcForm,
        }
    }
</script>

<style scoped lang="scss">
  .editFashionSciTechMain {
    width: 100%;
  }
</style>