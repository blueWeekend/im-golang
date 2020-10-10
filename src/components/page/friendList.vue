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
                // this.$store.commit('pushMsg',{
                //     item: {
                //         text: '测试3',
                //         value: 3
                //     },
                //     btns: [
                //         {
                //             action: 'delete',
                //             text: '删除',
                //             color: '#ff3a32'
                //         }
                //     ]
                // })
                this.$router.push('/home/friendList/dialog')
            },
            clickTitle(title) {
                console.log(title)
            }
        },
    }
</script>


<style lang="stylus">
   
</style>