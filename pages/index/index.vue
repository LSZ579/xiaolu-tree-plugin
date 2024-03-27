<template>
	<view>

		<uniPopup borderRadius="10px 10px 0 0" background-color="#fff" ref="popup" type="bottom">
			<view>
				<xiaolu-tree scrollHeight="80vh" :checkList="checkList" v-if="tree.length>0" :props="bprop"
					@sendValue="confirm" :isCheck="true" :treeNone="tree"></xiaolu-tree>
			</view>
		</uniPopup>
		<button class="btn" @click="showPop" type="primary">底部弹出选择</button>
		<button class="btn" @click="toChoose(aprop)" type="primary">多选模式（选择任意一项）</button>
		<button class="btn" @click="toChoose(bprop)" type="primary">多选模式（关联下级）</button>
		<button class="btn" @click="toChoose(cprop)" type="primary">单选模式(任意一项)</button>
		<button class="btn" @click="toChoose(dprop)" type="primary">单选（只选user）</button>

		<button class="btn" @click="clear()" type="default">清空选择</button>
		<view class="children">
			<view v-for="(item,index) in selectListItem" style="font-size: 24rpx;"
				:key="index">
				<view style="color: red;">选中的值：{{item.name}};&nbsp;</view>
				路径：
				<view v-for="(row,k) in item.path" style="display: inline-block;font-size: 24rpx;" :key="k">
					{{row.name}}
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	/*
	 *	已兼容h5和小程序端,其它端没测试过，估计问题不大，只需要改一下传值的方式
	 *	如有问题可以加qq：122720267
	 *	使用该插件的朋友请给个好评，或者到git start一下
	 *   git地址：https://github.com/LSZ579/xiaolu-tree-plugin.git
	 *   插件市场地址： https://ext.dcloud.net.cn/plugin?id=2423
	 * 
	 */
	import uniPopup from '@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue';
	import XiaoluTree from '@/components/xiaolu-tree/tree.vue';
	import {
		treeNode
	} from '../chooseUser/data.js'
	export default {
		components: {
			uniPopup,
			XiaoluTree
		},
		data() {
			return {
				selectListItem: [],
				aprop: {
					label: 'name',
					children: 'children',
					multiple: true,
					hasPath: true
				},
				bprop: {
					label: 'name',
					children: 'children',
					multiple: true,
					checkStrictly: true,
					hasPath: true
				},
				cprop: { //单选模式(任意一项)
					label: 'name',
					children: 'children',
					multiple: false,
					nodes: false,
					hasPath: true
				},
				dprop: { //单选模式选user
					label: 'name',
					children: 'children',
					multiple: false,
					nodes: true,
					hasPath: true
				},
				tree: treeNode,
				checkList:[]
			}
		},
		created() {
			uni.$on('selectSuccess', (data) => {
				this.$set(this, 'selectListItem', [...data.list])
			})
		},
		methods: {
			showPop() {
				this.checkList = JSON.parse(JSON.stringify(this.selectListItem))
				this.$refs.popup.open('bottom')
			},
			confirm(val) {
				this.$set(this, 'selectListItem', [...val])
				this.$refs.popup?.close()
			},
			toChoose(prop) {
				// #ifdef H5
				let items = encodeURIComponent(JSON.stringify(this.selectListItem));
				// #endif
				// #ifdef MP-QQ||MP-WEIXIN
				let items = JSON.stringify(this.selectListItem);
				// #endif
				uni.navigateTo({
					url: `../chooseUser/chooseUser?arr=${items}&prop=${JSON.stringify(prop)}`
				})
			},
			clear() {
				this.selectListItem = [];
			}
		}
	}
</script>

<style scoped lang="scss">
	.children {
		color: #BBB2B2;
	}

	.color {
		color: #bbb2b2;
	}
	.btn {
		margin: 10px auto;
	}
</style>