<template>
    <cube-index-list :data="listData" :title="title" @select="selectItem" @title-click="clickTitle">
    </cube-index-list>
</template>

<script>
    import {SRC_MAP} from '@/utils/global'
    const listData = [
        {
            "name": "A",
            "items": [
               
            ]
        }
    ]
    export default {
        data() {
            return {
                title: '附近的人',
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
                let data=this.$store.state.friendList
                let arr=[]
                for(let i in data){
                    arr.push({
                        'name':data[i]['nickname'],
                        'value':data[i]['friend_id']
                    })
                }
                this.listData[0].items=arr

                if (navigator.geolocation){
            　　　　navigator.geolocation.getCurrentPosition(loc=>{
                       console.log(loc)
                    },e=>{
                        console.log('error',e)
                    })
            　　}else{
                    console.log(111)
                }
            },
            getLocation(loc){
                console.log(1)
                const location = {
                    latitude: loc.coords.latitude,  // 纬度
                    longitude: loc.coords.longitude,  // 经度
                    accuracy: loc.coords.accuracy // 精确度
                }
                console.log(location)
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