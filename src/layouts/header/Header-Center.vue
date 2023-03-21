<template>
    <div class="row justify-center items-center text-center">
        <p class="q-ma-none ellipsis" style="max-width:500px;margin:auto;font-size:18px" v-if="pages && page">
            {{ pname }} / {{ pages[currentPageIndex].name || `Page-${currentPageIndex + 1}` }}</p>
    </div>
</template>

<script>
export default {
    name: 'Header-Center',
    data() {
        return {

        }
    },
    computed: {
        pname() {
            return this.$store.state.common.pname
        },
        page: {
            get() {
                return this.$store.state.common.page
            },
            set(val) {
                this.SET_PAGE_ID(val)
            }
        },
        pages() {
            return this.$store.state.common.pages
        },
        currentPageIndex() {
            return this.$store.state.common.pages.findIndex(o => o.id === this.page)
        }
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>

</style>
