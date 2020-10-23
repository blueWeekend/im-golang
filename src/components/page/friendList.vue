<template>
    <cube-index-list :data="cityData" :title="title" @select="selectItem" @title-click="clickTitle">
    </cube-index-list>
</template>

<script>
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
                let index=this.getMsgIndex(item.value,1)
                this.$router.push('/home/friendList/dialog/'+item.value+'/'+index)
            },
            getMsgIndex(friendId,type){
                for(const [key,item] of this.$store.state.latelyMsgList){
                   
                    if(item['key']==friendId && item['type']==type){
                        return key
                    }
                }
                this.$store.commit('pushMsg',{'key':friendId,'type':type,'content':''})
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
                console.log(val)
                this.init()
            }
            
        }
    }
</script>


<style lang="stylus">
   
</style>