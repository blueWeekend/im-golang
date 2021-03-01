<template>
    <div style="text-align:center;height:36px;line-height: 36px;background-color: #f7f7f7;">
        <span>{{tab[$store.state.bottomLabel]['label']}}</span>
        <i class="cubeic-more" style="float: right;margin-right: 12px;"></i>
    </div>
</template>

<script>
    import {COMMON_UNIT_TAB} from '@/utils/global'
    export default {
        
        data() {
            return {
               tab:COMMON_UNIT_TAB
            }
        },
        created(){
            

        },
        methods: {
            
        }
    }
</script>


<style>

</style>