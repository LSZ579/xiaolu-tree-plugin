import search from './search/index.vue'
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
	name: "treeComponent",
	data() {
		return {
			is_search: false,
			tree: Object.freeze(this.treeNone),
			newNum: 0,
			oldNum: 0,
			catchTreeNone: [...this.treeNone],
			tree_stack: [1],
			searchResult: [],
			newCheckList: this.checkList,
			scrollLeft: 999,
			nodePathArray: []
		}
	},
	components: {
		search
	},
	computed: {
		isSelect() {
			return (item) => {
				const checkList = this.newCheckList
				if (checkList.length == 0) {
					this.props.checkStrictly ? (item.bx = 0, item.qx = 0) : ''
					return false
				}
				const select = checkList.some(e => item[this.keyValue] == e[this.keyValue]);
				return select && !item.qx
			}
		},
		radioSelect() {
			const list = this.newCheckList
			return (item) => {
				return list.length > 0 && item[this.keyValue] == list[0][this.keyValue]
			}
		},
		isActive() {
			return (index) => {
				return index === this.tree_stack.length - 1
			}
		}
	},
	created() {
		this.Init()
	},
	methods: {
		// 初始化
		Init() {
			if (this.newCheckList.length !== 0) {
				let {
					tree_stack,
					props,
					catchTreeNone,
					newCheckList
				} = this, index = 0, flag = props.multiple && props.checkStrictly;
				flag && (index = newCheckList.length - 1);
				this.getNodeRoute(catchTreeNone, newCheckList[index][this.keyValue])
				let arr = this.nodePathArray.reverse()
				if (arr.length == 0) return;
				this.tree_stack = tree_stack.concat(arr);
				this.tree = this.tree_stack[this.tree_stack.length - 1][this.props.children];
				flag && this.checkAllChoose();
			}
		},
		// 点击项目处理
		handleClick(item, index) {
			let children = item[this.props.children]
			if (index > -1 && children && children.length > 0) {
				this.toChildren(item)
			} else if (this.props.multiple) {
				this.checkboxChange(item, index, item.bx, item.qx)
			} else {
				this.checkbox(item, index)
			}
		},
		// (tree为目标树，targetId为目标节点id)
		getNodeRoutePath(tree, targetId, nodePathArray = []) {
			for (let index = 0; index < tree.length; index++) {
				if (tree[index][this.props.children]) {
					let endRecursiveLoop = this.getNodeRoutePath(tree[index][this.props.children], targetId,
						nodePathArray)
					if (endRecursiveLoop) {
						nodePathArray.push(tree[index])
						return true
					}
				}
				if (tree[index][this.keyValue] === targetId) {
					return true
				}
			}
		},
		// 获取路径
		getPath(id) {
			if (!this.props.hasPath) return '';
			const {
				keyValue,
				tree_stack,
				props
			} = this
			if (this.is_search) {
				// 搜索情况下，无法获取完整的路径，如果需要获取，则只能通过完整的树去查找
				let path = []
				this.getNodeRoutePath(this.catchTreeNone, id, path)
				console.log(path)
				return path.reverse();
			}
			const path = [...tree_stack].map(e => {
				const item = Object.assign({}, e)
				delete item[props.child]
				return item
			})
			return path.slice(1, path.length) || []
		},
		//多选
		async checkboxChange(item, index, bx, qx) {
			let that = this;
			const {
				props
			} = that
			if (!props.multiple) return;
			let findIdex = that.newCheckList.findIndex(e => item[this.keyValue] == e[this.keyValue]);
			const path = this.getPath(item[this.keyValue])
			if (findIdex > -1) { //反选
				if (props.checkStrictly) { //关联子级
					if (item.user) { //用户
						that.newCheckList.splice(findIdex, 1)
					} else { //非用户，取消所有下一级
						that.getIdBydelete(item[this.props.children])
					}
				} else {
					that.newCheckList.splice(findIdex, 1)
				}
				// if (props.checkStrictly && !item.user) { //关联子级 非用户，取消所有下一级
				// 	item.qx = item.bx = 0
				// 	that.getIdBydelete(item[this.props.children])
				// }
			} else { //选中
				if (!item.user && props.checkStrictly) { //选中下一级
					if (qx || bx) { //取消下级
						await that.getIdBydelete(item[this.props.children]);
						item.qx = item.bx = 0
						that.newCheckList.splice(findIdex, 1)
					} else {
						item.qx = 1;
						item.bx = 0;
						const {
							id,
							name,
							user
						} = item
						const newObj = {
							id,
							name,
							user
						}
						const pathList = this.tree_stack.length === 1 ? [newObj, ...path] : [...path, newObj]
						await that.chooseChild(item[this.props.children], pathList);
						// that.newCheckList.push({
						// 	...item,
						// 	paths
						// });
					}
					this.$forceUpdate()
					return
				}
				that.newCheckList.push({
					...item,
					path
				});
			}
		},
		// 取消下一级的选中
		getIdBydelete(arr) {
			arr.forEach(e => {
				if (e.user) {
					for (var i = 0; i < this.newCheckList.length; i++) {
						if (e[this.keyValue] == this.newCheckList[i][this.keyValue]) {
							this.newCheckList.splice(i, 1)
							break;
						}
					}
				} else {
					this.getIdBydelete(e[this.props.children])
				}
			})
		},

		// 关联下一级,选中
		chooseChild(arr, path) {
			let that = this;
			const oldPath = [...path]
			for (var i = 0, len = arr.length; i < len; i++) {
				let item = arr[i];
				if (item.user) {
					that.newCheckList.push({
						...item,
						path: oldPath
					})
				} else {
					const newItem = {
						...item
					}
					delete newItem[that.props.children]
					const newPath = [...oldPath, newItem]
					that.chooseChild(item[this.props.children], newPath)
				}
			}
		},

		// (tree为目标树，targetId为目标节点id) 
		getNodeRoute(tree, targetId) {
			for (let index = 0; index < tree.length; index++) {
				if (tree[index][this.props.children]) {
					let endRecursiveLoop = this.getNodeRoute(tree[index][this.props.children], targetId)
					if (endRecursiveLoop) {
						this.nodePathArray.push(tree[index])
						return true
					}
				}
				if (tree[index][this.keyValue] === targetId) {
					return true
				}
			}
		},

		//单选
		checkbox(item, index) {
			const path = this.getPath(item[this.keyValue])
			this.$set(this, 'newCheckList', [{
				...item,
				path
			}])
		},
		//到下一级
		toChildren(item) {
			if (item.user) return
			var that = this;
			uni.showLoading({
				title: '加载中'
			})
			let children = that.props.children;
			if (!item.user && item[children].length > 0 && !(that.tree_stack[0][this.keyValue] == item[this
					.keyValue])) {
				that.tree = item[children];
				that.tree_stack.push(item);
			}
			this.$nextTick(() => {
				uni.hideLoading()
				this.scrollLeft += 200;
			})
			if (this.props.checkStrictly) this.checkAllChoose();
		},
		//搜索
		confirmSearch(val) {
			this.searchResult = []
			this.search(this.catchTreeNone, val)
			this.is_search = true
			this.tree_stack.splice(1, 1000)
			uni.showLoading({
				title: '正在查找'
			})
			setTimeout(() => {
				this.tree = this.searchResult
				if (this.props.checkStrictly) this.checkAllChoose();
				uni.hideLoading()
			}, 300)
		},
		search(data, keyword) {
			let that = this
			let {
				label,
				children
			} = that.props
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i][label].indexOf(keyword) >= 0) {
					that.searchResult.push(data[i])
				}
				if (!data[i].user && data[i][children].length > 0) {
					that.search(data[i][children], keyword)
				}
			}
		},
		checkAllChoose() {
			this.tree.forEach((e, i) => {
				if (!e.user) {
					e.qx = e.bx = false;
					this.computAllNumber(e.children);
					// console.log(this.newNum,this.oldNum)
					if (this.newNum != 0 && this.oldNum != 0) {
						e.qx = this.newNum == this.oldNum
						e.bx = !e.qx
					}
					if (this.newNum != 0 && this.oldNum == 0) {
						this.$set(this.tree[i], 'bx', false);
						this.$set(this.tree[i], 'qx', false);
					}
					this.$forceUpdate()
					this.newNum = this.oldNum = 0
				}
			})
		},
		computAllNumber(arr) {
			for (let j = 0; j < arr.length; j++) {
				var e = arr[j];
				this.checkSum(e[this.keyValue])
				if (e.user) {
					this.newNum++;
				} else {
					this.computAllNumber(e.children)
				}
			}
		},
		checkSum(id) {
			for (let i = 0; i < this.newCheckList.length; i++) {
				if (id == this.newCheckList[i][this.keyValue]) {
					this.oldNum++;
					break
				}
			}
		},
		//返回其它层
		backTree(item, index) {
			let that = this,
				tree_stack = that.tree_stack,
				max = 300;
			if (index === -1) {
				that.tree = that.catchTreeNone
				that.tree_stack.splice(1, max)
				that.is_search = false
				that.$refs.sea?.clears()
			} else if (index === -2) { //搜索
				that.tree = that.searchResult
				that.tree_stack.splice(1, max)
			} else {
				if (tree_stack.length - index > 2) {
					that.tree_stack.splice(index + 1, max)
				} else if (index !== tree_stack.length - 1) {
					that.tree_stack.splice(tree_stack.length - 1, 1)
				}
				that.tree = item[that.props.children]
			}
			if (this.props.checkStrictly) this.checkAllChoose();
			this.$forceUpdate()
		},
		backConfirm() {
			this.$emit('sendValue', this.newCheckList, 'back')
		}
	},
	props: {
		// 树形数据源
		treeNone: {
			type: Array,
			default: () => {
				return []
			}
		},
		//是否开启选中
		isCheck: {
			type: Boolean,
			default: () => {
				return false
			}
		},
		// 弹出模式时需传的列表滚动高度
		scrollHeight: {
			type: String,
			default: '',
		},
		// 选中的值的 必传[{[keyValue]:value}] 
		checkList: {
			type: Array,
			default: () => []
		},
		searchIf: {
			type: Boolean,
			default: () => true
		},
		// 默认key 
		keyValue: {
			type: String,
			default: 'id',
		},
		props: {
			type: Object,
			default: () => {
				return {
					label: 'name',
					children: 'children',
					multiple: false,
					checkStrictly: false, //不关联
					hasPath: false, //返回值是否都带路径
				}
			}
		}
	},
}