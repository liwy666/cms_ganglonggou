<template>
  <div class="fashionSciTechMain">
    <icbc-table thisPath="ghFashionSciTech" editPath="ghEditFashionSciTech" intoType="fashion_sci_tech"
                ref="icbcTable"></icbc-table>
  </div>
</template>
<script>
    import icbcTable from '../../components/IcbcTable'

    export default {
        name: "FashionSciTech",
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.$nextTick(() => {
                    vm.$refs.icbcTable.urlUpdate(to);
                });

            });
        },
        beforeRouteUpdate(to, from, next) {
            this.$nextTick(() => {
                this.$refs.icbcTable.urlUpdate(to);
            });

            next();
        },
        components: {
            "icbc-table": icbcTable
        }
    }
</script>
<style lang="scss" scoped>

</style>