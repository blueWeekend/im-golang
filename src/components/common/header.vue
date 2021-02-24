<template>
    <div style="text-align:center;height:30px;background-color:black">
        <span>im</span>
        <i class="cubeic-add"></i>
    </div>
</template>

<script>
    export default {

        data() {
            return {
               
            }
        },
        created(){
            

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