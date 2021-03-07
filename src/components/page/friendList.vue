<template>
    <cube-index-list :data="listData" :title="title" @select="selectItem" @title-click="clickTitle">
    </cube-index-list>
</template>

<script>
    import {SRC_MAP} from '@/utils/global'
    import chinesePy from '@/utils/chinesePy'
    const listData = [
        {
            "name": "我的好友",
            "items": [
               
            ]
        }
    ]

    export default {
        data() {
            return {
                title: '新的朋友',
                listData: listData
            }
        },
        created() {
            if(this.$store.state.isInit){
                this.init()
            }
        
        },
        methods: {
            init(){
                let friendList=this.$store.state.friendList
                let data={}
                for(let i in friendList){
                    let code=chinesePy.GetJP(friendList[i]['nickname'][0])
                    if(!isNaN(code)){
                        code='#'
                    }
                    if(data[code]){
                        data[code]['items'].push({
                            'name':friendList[i]['nickname'],
                            'value':friendList[i]['friend_id']
                        })
                    }else{
                        data[code]={
                            "name": code,
                            "items": [
                                {
                                    'name':friendList[i]['nickname'],
                                    'value':friendList[i]['friend_id']
                                }
                            ]
                        }
                    }
                }
                let arr=[]
                for (var i = 0; i < 26; i++) {
                    let code=String.fromCharCode((65 + i))
                    if(data[code]){
                        arr.push(data[code])
                    }
                }
                if(data['#']){
                    data['#']['items'].sort((a,b)=>{
                        return a['name']>b['name']?1:-1
                    })
                    arr.push(data['#'])
                }
                this.listData=arr
            },
            selectItem(item) {
                this.$router.push('/home/friendList/dialog/'+item.value+'/'+SRC_MAP.FRIEND)
            },
            clickTitle(title) {
                console.log(title)
            }
        },
        watch:{
            "$store.state.isInit":function(val){
                if(val){
                    this.init()
                } 
            }
            
        }
    }
</script>


<style lang="stylus">
   
</style>