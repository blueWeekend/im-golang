<template>
    <div>
        <cube-tab-bar v-model="$store.state.bottomLabel"  :data="tabs"  @change="changeHandler">
        </cube-tab-bar>
    </div>
</template>

<script>
    import {COMMON_UNIT_TAB} from '@/utils/global'
    export default {

        data() {
            return {
                tabs: Object.values(COMMON_UNIT_TAB)
            }
        },
        created(){
            

        },
        methods: {
            changeHandler(label) {
                this.$router.push('/home/'+label)
            }
        }
    }
</script>


<style>

</style>