<template>
  <div class="editFashionSciTechMain">
    <icbc-form :position-type-options="positionTypeOptions" into-type="new_3c_mobile"
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
                        value: '24期分期-通栏',
                        label: '24期分期-通栏'
                    },
                    {
                        value: '24期分期-商品GN',
                        label: '24期分期-商品'
                    },
                    {
                        value: '12期分期-通栏',
                        label: '12期分期-通栏'
                    },
                    {
                        value: '12期分期-商品GN',
                        label: '12期分期-商品'
                    },
                    {
                        value: '6期分期-通栏',
                        label: '6期分期-通栏'
                    },
                    {
                        value: '6期分期-商品GN',
                        label: '6期分期-商品'
                    },
                    {
                        value: '品质配件-通栏',
                        label: '品质配件-通栏'
                    },
                    {
                        value: '品质配件-商品GN',
                        label: '品质配件-商品'
                    },
                    {
                        value: '手机通讯-商品GN',
                        label: '手机通讯-商品'
                    },
                    {
                        value: '数码配件-商品GN',
                        label: '数码配件-商品'
                    },
                    {
                        value: '车载配件-商品GN',
                        label: '车载配件-商品'
                    },
                    {
                        value: '穿戴设备-商品GN',
                        label: '穿戴设备-商品'
                    },
                    {
                        value: '影音娱乐-商品GN',
                        label: '影音娱乐-商品'
                    },
                    {
                        value: '智能设备-商品GN',
                        label: '智能设备-商品'
                    },
                ],
                previewImgUrl: `${process.env.BASE_URL}images/new_3c_mobile_ad_show.jpg`,
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