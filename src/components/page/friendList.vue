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
            let data=JSON.parse(localStorage.getItem('im:friend_list'))
            this.$store.commit('setFriendList',data)
            console.log(this.$store.state)
            //let data=this.$store.state.friendList
            for(let item of data){
                this.cityData[0].items.push({
                    'name':item.nickname,
                    'value':item.friend_id
                })
            }
         
        },
        methods: {
            selectItem(item) {
            
                this.$router.push('/home/friendList/dialog/'+item.value)
            },
            clickTitle(title) {
                console.log(title)
            }
        },
    }
</script>


<style lang="stylus">
   
</style>