<template>
    <div>
        <cube-tab-bar v-model="$store.state.bottomLabel"  :data="tabs"  @change="changeHandler">
        </cube-tab-bar>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                tabs: [{
                    label: '消息',
                    icon: 'cubeic-message',
                    value:'msgList'
                }, {
                    label: '通讯录',
                    icon: 'cubeic-person',
                    value:'friendList'
                }, {
                    label: '附近的人',
                    icon: 'cubeic-location',
                    value:'nearby'
                }]
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