<template>
	<view>
		<view class="header">
			<search v-if="searchIf" ref="sea" @confirm="confirmSearch" />
			<view class="title">
				<scroll-view scroll-x style="width: 100%;white-space: nowrap;" :scroll-left="scrollLeft">
					<view v-for="(item,index) in tree_stack" class="inline-item" :key="index">
						<view class="inline-item" v-if="index==0" @click="backTree(item,-1)">
							<text v-if="index==tree_stack.length-1&&!isre" class="none">全部</text>
							<text v-else class="active">全部</text>
						</view>
						<view v-if="index==0&&isre" @click="backTree(item,-2)" :class="[index==tree_stack.length-1&&isre]?'none inline-item':'active inline-item'">
							<i class="iconfont icon-z043 iconclass"/>
							搜索结果
						</view>
						<view class="inline-item" @click="backTree(item,index)" v-if="index!=0">
							<i v-if="index!=0" class="iconfont icon-z043 iconclass"/>
							<text v-if="index==tree_stack.length-1" class="none inline-item">
								{{item[props.label]}}
							</text>
							<text v-else class="active">
								{{item[props.label]}}
							</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view>
			<view class="container-list">
				<view class="common" v-for="(item, index) in tree" @click="toChildren(item)" :key="index">
					<label class="content">
						<view class="checkbox" v-if="isCheck&&props.multiple" @click.stop="checkboxChange(item,index,item.bx,item.qx)">
							<span v-if="(newCheckList.findIndex(e=>{return item.id==e.id}))>-1&&!item.qx">
								<i v-if="item.bx&&props.multiple" class="iconfont icon-banxuanzhongshousuo1-shi icons"/>
								<i v-else class="iconfont icon-xuanzhong txt icon-selected"/>
							</span>
							<i v-else-if="props.multiple&&item.qx" class="iconfont icon-xuanzhong txt icon-selected"/>
							<i v-else-if="item.bx&&props.multiple" class="iconfont icon-banxuanzhongshousuo1-shi icons"/>
							<i style="color: #b8b8b8;" v-else class="iconfont icon-weixuanzhong txt"/>
						</view>
						<view class="checkbox" v-if="isCheck&&!props.multiple&&props.nodes&&item.user" @click.stop="checkbox(item,index)">
							<i v-if="newCheckList.length>0&&item.id == newCheckList[0].id" class="txt iconfont icon-selected"/>
							<i style="color: #b8b8b8;" v-else class="txt iconfont icon-weixuanzhong1"/>
						</view>
						<view class="checkbox" v-if="isCheck&&!props.multiple&&!props.nodes" @click.stop="checkbox(item,index)">
							<i v-if="newCheckList.length>0&&item.id == newCheckList[0].id" class="txt iconfont icon-selected"/>
							<i style="color: #b8b8b8;" v-else class="txt iconfont icon-weixuanzhong1"/>
						</view>
						<view v-if="item.user" @click.stop="checkboxChange(item,index,item.bx,item.qx)"><slot v-bind:item="item"></slot></view>
						<slot v-else v-bind:item="item"></slot>
						<view class="right"><i v-if="!item.user&&item.children.length>0" class="iconfont icon-z043"></i></view>
					</label>
				</view>
			</view>
		</view>
		<view class="btn box_sizing">
			<button class="sureBtn" type="primary" @click="backConfirm">确认</button>
		</view>
	</view>
</template>

<script src="./code.js" type="text/javascript"></script>
<style lang="scss" scoped>
	@import './css/style.scss';
	@import url("./css/icon.css");
</style>


