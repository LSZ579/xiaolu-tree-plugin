<template>
	<view>
		<xiaolu-tree  v-slot:default="{item}" :checkList="checkList"  v-if="tree.length>0" :max="max" :props="prop" @sendValue="confirm"  :parent="true" :isCheck="true" :trees="tree">
			<!-- 内容插槽 -->
			<view>
				<view class="content-item">
					<view class="word">{{item.name}}</view>
				</view>
			</view>
		</xiaolu-tree>
		
	</view>
</template>

<script>
	import XiaoluTree from '@/components/xiaolu-tree/tree.vue';
	import dataList from './data.js'
	export default {
		components: {
			XiaoluTree
		},
		data() {
			return {
				tree: [],
				checkList: [],
				backList: this.checkList,
				prop:{},
				max: 5,
				aprop: {
					label: 'name',
					children: 'children',
					multiple:true
				},
				bprop: {
					label: 'name',
					children: 'children',
					multiple:true,
					checkStrictly:true
				},
				cprop: {//单选模式(任意一项)
					label: 'name',
					children: 'children',
					multiple:false,
					nodes:false
				},
				dprop: {//单选模式选user
					label: 'name',
					children: 'children',
					multiple:false,
					nodes:true
				}
			}
		},
		 onLoad(option) {
			 // #ifdef H5
			let obj = option.arr.replace("\"([^\"]*)\"", "$1");
			let checkList = JSON.parse(obj);
			// #endif

			// #ifdef MP-QQ||MP-WEIXIN||APP-NVUE||APP-PLUS
			let checkList = JSON.parse(option.arr);
			// #endif
			
			this.checkList = []
			this.checkList = checkList;
			
			if(option.type==0){
				this.prop=this.aprop;//多选
			}else if(option.type==1){
				this.prop=this.bprop;//多选
			}else if(option.type==2){
				this.prop=this.cprop;//单选任意一项
			}else{
				this.prop=this.dprop;//单选user
			}
			this.tree=dataList;//树形数据赋值
		},
		methods: {
			//获取选中的值
			confirm(val,back) {
				// this.checkList = val;
				if(back){
					this.backConfirm(val)
					return
				}
				this.backList = val;
			},
			
			
			// 返回上一页传参
			 backConfirm(val) {
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				// #ifdef H5
					prevPage.$vm.query =val//h5写法
				// #endif
				let check = val;
				//#ifdef MP-WEIXIN||MP-QQ
					prevPage.setData({
						query: check,
					}) //小程序写法
				// #endif
				
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	.box_sizing {
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}

	.btn {
		position: fixed;
		bottom: 0;
		padding: 10px;
		background-color: #fff;
		width: 100%;

		.sureBtn {
			background-color: #0095F2;
			color: #fff;
		}
	}
	
	.content-item{
		display: flex;
		position: relative;
		align-items: center;
		.person {
			height: 64rpx;
			min-width: 64rpx;
			border-radius: 50%;
			border: 1rpx solid rgba(0, 149, 235, 0.15);
			background-color: rgba(0, 149, 235, 0.1);
			margin-left: 0px;
			color: #0095F2;
			line-height: 64rpx;
			font-size: 22rpx;
			text-align: center;
			margin-left: 20rpx;
		}
		.word {
			margin-left: 16rpx;
			font-size: 30rpx;
			color: #5b5757;
			width: 500rpx;
			word-break: break-all;
		}
	}
</style>
