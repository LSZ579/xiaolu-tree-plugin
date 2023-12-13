<template>
	<view>
		<xiaolu-tree  :checkList="checkList"  v-if="tree.length>0"  :props="prop" @sendValue="confirm"  :isCheck="true" :treeNone="tree"></xiaolu-tree>
		
	</view>
</template>

<script>
	import XiaoluTree from '@/components/xiaolu-tree/tree.vue';
	import {treeNode} from './data.js'

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
			}
		},
		 onLoad(option) {
			 let { prop,arr } = option
			 // #ifdef H5
			let checkList = JSON.parse(decodeURIComponent(arr));
			// #endif
			// #ifdef MP-QQ||MP-WEIXIN||APP-NVUE||APP-PLUS
			let checkList = JSON.parse(arr);
			// #endif
			this.prop = JSON.parse(prop)
			console.log(this.prop)
			this.checkList = checkList;
			this.tree=treeNode;//树形数据赋值
		},
		methods: {
			//获取选中的值
			confirm(val,back) {
				if(back){
					this.backConfirm(val)
					return
				}
				this.backList = val;
			},
			
			// 返回上一页传参
			 backConfirm(val) {
				uni.$emit('selectSuccess',{list:val})
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	
</style>
