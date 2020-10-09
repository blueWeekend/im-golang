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
                    label: '我',
                    icon: 'cubeic-person',
                    value:'me'
                }]
            }
        },
        created(){
            let route=this.$route.path
        
            // this.selectedLabel=route.split('/')[2]

        },
        methods: {
            changeHandler(label) {
                // if you clicked different tab, this methods can be emitted
                this.$router.push('/home/'+label)
            }
        }
    }
</script>


<style>

</style>