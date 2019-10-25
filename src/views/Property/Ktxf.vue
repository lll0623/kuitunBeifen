<template>
<div class="index-wrapper">
	<div id="container" class="Ktxf">
		<div class="content">
            <p>长按扫码进入小程序</p>
            <img src="../../assets/images/ktxf.png" alt="">
		</div>
	</div>
</div>
</template>
<script type="es6">
export default {
	data() {
		return {

		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			window.document.title = "奎城先锋";
			document.body.style.backgroundColor = '#eee';
            var orderHight = window.innerHeight;
            document.getElementById('container').style.height = orderHight + 'px';
		})
	},
	mounted() {

	},
	methods: {

	 }
	}
</script>
<style lang="scss">
body{
	background-color: #eee;
}
.Ktxf{
	background: url("../../assets/images/ktxf_background.png") no-repeat;
    height:100%;
    width:100%;
    overflow: hidden;
    background-size:cover;
	.content{
        width: 100%;
        text-align: center;
        p{
            color: white;font-size: 0.6rem;
            padding: 15% 0;
        }
        img{
            width: 60%;
        }
	}
}


</style>
