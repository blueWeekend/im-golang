<template>
    <cube-index-list :data="cityData" :title="title" @select="selectItem" @title-click="clickTitle">
    </cube-index-list>
</template>

<script>
    const cityData = [
        {
            "name": "★Hot City",
            "items": [
                {
                    "name": "BEIJING",
                    "value": 1
                },
                {
                    "name": "SHANGHAI",
                    "value": 2
                }
            ]
        },
        {
            "name": "A",
            "items": [
                {
                    "name": "ANSHAN",
                    "value": 3
                },
                {
                    "name": "ANQING",
                    "value": 4
                }
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
            console.log(this.$store.state)
            for (let index = 0; index < 10; index++) {
                this.cityData.push(this.cityData[0])
                
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