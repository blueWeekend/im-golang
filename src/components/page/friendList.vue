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
                // let index=this.getMsgIndex(item.value,1)
                // console.log(index)
                this.$router.push('/home/friendList/dialog/'+item.value+'/'+SRC_MAP.FRIEND)
            },
            getMsgIndex(friendId,type){
                
                for(let i in this.$store.state.latelyMsgList){
                    if(this.$store.state.latelyMsgList[i]['key']==friendId && this.$store.state.latelyMsgList[i]['type']==type){
                        return i
                    }
                }
                this.$store.commit('pushMsg',{key:friendId,type:type,content:'',time:0,isSelf:1})
                return 0

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