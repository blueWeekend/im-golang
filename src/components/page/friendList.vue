<template>
    <cube-index-list :data="cityData" :title="title" @select="selectItem" @title-click="clickTitle">
    </cube-index-list>
</template>

<script>
    import {SRC_MAP} from '@/utils/global'
    const cityData = [
        {
            "name": "A",
            "items": [
               
            ]
        }
    ]

    export default {
        data() {
            return {
                title: '通讯录',
                cityData: cityData
            }
        },
        created() {
            if(this.$store.state.isInit){
                this.init()
            }
        },
        methods: {
            init(){
                let data=this.$store.state.friendList
                
                let arr=[]
                for(let i in data){
                    arr.push({
                        'name':data[i]['nickname'],
                        'value':data[i]['friend_id']
                    })
                }
                this.cityData[0].items=arr
            },
            selectItem(item) {
                 let msg={
                    key:SRC_MAP.FRIEND+'-'+item.value,
                    content:'',
                }
                this.$store.commit('pushMsg',msg)
                this.$router.push('/home/friendList/dialog/'+item.value+'/'+SRC_MAP.FRIEND)
            },
            clickTitle(title) {
                console.log(title)
            }
        },
        watch:{
            "$store.state.isInit":function(val){
                if(!val){
                    return
                }
                this.init()
            }
            
        }
    }
</script>


<style lang="stylus">
   
</style>