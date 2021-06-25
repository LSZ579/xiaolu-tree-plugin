<template>
	<view>
		<view class="children">
			<view v-for="(item,index) in query" style="margin: 2px;display: inline-block;" :key="index">
				<text >{{item.name}};</text>
			</view>
		</view>
		
		<view class="parent">
			<view v-for="(item,index) in parent_list" style="margin: 2px;display: inline-block;" :key="index">
				<text >{{item.name}};</text>
			</view>
		</view>
		
		<button class="btn" @click="toChoose(query,0)" type="primary">多选模式（选择任意一项）</button>
		<button  class="btn" @click="toChoose(query,1)" type="primary">多选模式（关联下级）</button>
		<button class="btn" @click="toChoose(query,2)" type="primary">单选模式(任意一项)</button>
		<button class="btn" @click="toChoose(query,3)" type="primary">单选（只选user）</button>
		<button class="btn" @click="clear()" type="default">清空选择</button>
	</view>
	
</template>


<script>
	/*
		*	已兼容h5和小程序端,其它端没测试过，估计问题不大，只需要改一下传值的方式
		* 
		*	如有问题可以加qq：122720267
		* 	
		*	使用该插件的朋友请给个好评，或者到git start一下
		*   git地址：https://github.com/LSZ579/xiaolu-tree-plugin.git
		*   插件市场地址： https://ext.dcloud.net.cn/plugin?id=2423
		* 
	*/
	export default {
		data() {
			return {
				query:[],
				parent_list: [],
				detail:{
					userIds:[],
					organizeIds:[]
				},
				sendObj:[],
				uoData:[],
				isChoose:[]
			}
		},
		onShow() {
			//兼容小程序,获取选中的值
			//#ifdef MP-WEIXIN||MP-QQ
				let pages = getCurrentPages();
				let currPage = pages[pages.length - 1];
				this.query = currPage.data.query;
			  // #endif
		},
		methods: {
			toChoose(item,type){
				// #ifdef H5
					let items = encodeURIComponent(JSON.stringify(this.query));
				// #endif
				// #ifdef MP-QQ||MP-WEIXIN
					let items = JSON.stringify(this.query);
				// #endif
				
				uni.navigateTo({
					url:`../chooseUser/chooseUser?arr=${items}&type=${type}`
				})
			},
			clear(){
				this.query=[];
				this.isChoose=[]
			}
		}
	}
</script>

<style scoped lang="scss">
	.children{
		color: #BBB2B2;
	}
	.parent{
		margin-top: 30px;
	}
.color{
	color: #bbb2b2;
}
.btn{
	margin: 10px auto;
}

</style>
