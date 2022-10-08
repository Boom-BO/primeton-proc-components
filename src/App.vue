<template>
	<div id="app">
		<!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
		<p class="tip">*注：目前测试接口服务已停；</p>
		<PrimetonUniversalButton
			title="指定参与者"
			:type="btn.buttonAuthConfig.buttonType"
			:view-party-type="btn.buttonAuthConfig.viewPartyType.split(',')"
			:config="btn.buttonAuthConfig"
			@loadLinks="loadLinks"
			@loadTreeRootData="loadTreeRootData"
			@loadTreeChildrenData="loadTreeChildrenData"
			@filter="filterData"
			@confirm="confirm"
			@close="close"
			:before-open="beforeOpen"
		>
			<button class="btn" type="button" @click="btnClick('over')">
				选人（组织树与角色树无缝切换，懒加载并可检索）
			</button>
		</PrimetonUniversalButton>
		<PrimetonSelectPerson title="选人" @confirm="confirmPerson">
			<button class="btn" type="button" @click="btnClick('over')">选人</button>
		</PrimetonSelectPerson>
		<PrimetonBackButton
			title="选择回退环节"
			@loadData="loadBackLinks"
			@confirm="confirm"
			@close="close"
			:before-open="beforeOpen"
		>
			<button class="btn" type="button" @click="back('回退')">环节回退</button>
		</PrimetonBackButton>
		<!-- <PrimetonBaseTree
      layout-style="tb"
      :before-open="beforeOpen"
      @loadTreeRootData="loadTreeRootData"
      @loadTreeChildrenData="loadTreeChildrenData"
      @filter="filterData"
      @confirm="confirm"
      @close="close"
    /> -->
	</div>
</template>
<script>
import PrimetonUniversalButton from '../packages/PrimetonUniversalButton'
import PrimetonBackButton from '../packages/PrimetonBackButton'
import PrimetonSelectPerson from '../packages/PrimetonSelectPerson'
// import PrimetonBaseTree from "../packages/PrimetonBaseTree";

export default {
	name: 'App',
	components: {
		PrimetonUniversalButton,
		PrimetonBackButton,
		PrimetonSelectPerson
		// PrimetonBaseTree,
	},
	data() {
		return {
			btn: {
				buttonCode: 'submit',
				buttonChName: '提交',
				buttonIcon: 'el-icon-position',
				buttonClickName: 'submitProcess',
				buttonEvent: 'this.submit()',
				buttonAuthConfig: {
					buttonType: 'select_party',
					isNotAllowParentChild: true,
					orgScope: 'all',
					roleScope: 'all',
					selectPartyType: 'company,emp,role,org,position',
					viewPartyType: 'org,role'
				}
			}
		}
	},
	methods: {
		beforeOpen(open) {
			console.log('弹窗之前的回调')
			setTimeout(() => {
				console.log('*********************')
				open()
			}, 100)
		},
		loadLinks(resolve) {
			const data = [
				{
					id: 'manualActivity4',
					name: '财务审批',
					participants: [
						{
							id: '1021',
							name: '部门经理',
							typeCode: 'role'
						},
						{
							id: '41',
							name: '开发部',
							typeCode: 'org'
						}
					]
				},
				{
					id: 'leaderActivity4',
					name: '领导审批',
					participants: [
						{
							id: '1021',
							name: '部门经理',
							typeCode: 'role'
						},
						{
							id: '41',
							name: '开发部',
							typeCode: 'org'
						}
					]
				}
			]
			console.log('🚀 ~ file: App.vue ~ line 92 ~ loadLinks ~ data', data)
			resolve(data)
		},
		// 根数据
		loadTreeRootData(type, config, resolve) {
			let rootData = []
			if (type === 'org') {
				rootData = [
					{
						id: '1',
						name: '普元信息技术有限公司',
						typeCode: 'company',
						children: [
							[
								{
									id: '1-1-1',
									name: '济南政企部门',
									typeCode: 'org'
								},
								{
									id: '1-2-1',
									name: '上海产品部',
									typeCode: 'org'
								}
							]
						]
					},
					{
						id: '2',
						name: '普元信息技术有限公司1',
						typeCode: 'company',
						children: [
							[
								{
									id: '2-1-1',
									name: '济南政企部门',
									typeCode: 'org'
								},
								{
									id: '2-2-1',
									name: '上海产品部',
									typeCode: 'org'
								}
							]
						]
					}
				]
			} else {
				rootData = [
					{
						id: '1',
						name: '董事长',
						typeCode: 'role',
						children: [
							[
								{
									id: '1-1',
									name: '副董事长',
									typeCode: 'role'
								},
								{
									id: '1-2',
									name: '董秘',
									typeCode: 'role'
								}
							]
						]
					},
					{
						id: '2',
						name: '经理',
						typeCode: 'role',
						children: [
							[
								{
									id: '2-1',
									name: '部门经理',
									typeCode: 'org'
								},
								{
									id: '2-1',
									name: '部门副经理',
									typeCode: 'role'
								}
							]
						]
					},
					{
						id: 'c',
						name: '员工',
						typeCode: 'role'
					}
				]
			}
			console.log(
				'🚀 ~ file: App.vue ~ line 210 ~ loadTreeRootData ~ rootData',
				rootData
			)
			resolve(rootData)
		},
		// 懒加载根据节点查询数据
		loadTreeChildrenData(node, type, config, resolve) {
			if (node.data.id == '1') {
				if (type === 'org') {
					resolve([
						{
							id: '1-1',
							name: '济南政企部门',
							typeCode: 'org'
						},
						{
							id: '2-1',
							name: '上海产品部',
							typeCode: 'org'
						}
					])
				} else {
					resolve([
						{
							id: '1-1',
							name: '大董',
							typeCode: 'role'
						},
						{
							id: '2-1',
							name: '小董',
							typeCode: 'role'
						}
					])
				}
			} else if (node.data.id == '1-1') {
				if (type === 'org') {
					resolve([
						{
							name: '孟凡喜',
							id: '1-1-1',
							typeCode: 'emp',
							isLeaf: true
						},
						{
							name: '傅胤龙',
							id: '1-1-2',
							typeCode: 'emp',
							isLeaf: true
						},
						{
							name: '李文香',
							id: '1-1-3',
							typeCode: 'emp',
							isLeaf: true
						}
					])
				} else {
					resolve([
						{
							name: '孟凡喜-角色',
							id: '1-1-1',
							typeCode: 'emp',
							isLeaf: true
						},
						{
							name: '傅胤龙-角色',
							id: '1-1-2',
							typeCode: 'emp',
							isLeaf: true
						},
						{
							name: '李文香-角色',
							id: '1-1-3',
							typeCode: 'emp',
							isLeaf: true
						}
					])
				}
			} else if (node.data.id == '2-1') {
				if (type === 'org') {
					resolve([
						{
							name: '马冬梅',
							id: '2-1-1',
							typeCode: 'emp',
							isLeaf: true
						}
					])
				} else {
					resolve([
						{
							name: '马冬梅-角色',
							id: '2-1-1',
							typeCode: 'emp',
							isLeaf: true
						}
					])
				}
			} else {
				resolve([])
			}
		},
		confirm(data, close) {
			console.log(data, '已选数据!!!')
			close()
		},
		confirmPerson(data, obj) {
			console.log(data, obj, '已选数据!!!')
		},
		close() {
			console.log('close*****************')
		},
		btnClick(val) {
			console.log('🚀 🚀 🚀 🚀 🚀 🚀 牛逼 🚀 🚀 🚀 🚀 🚀 🚀', val)
		},
		back(val) {
			console.log('🚀 ~ 选择回退环节', val)
		},
		filterData(keyword, type, config, resolve) {
			// 检索 keyword，获取新的树
			let data = []
			if (type === 'org') {
				data = [
					{
						name: '李景亮',
						id: '3-1-1',
						typeCode: 'emp',
						isLeaf: true
					},
					{
						name: '王刘妮',
						id: '3-1-2',
						typeCode: 'emp',
						isLeaf: true
					},
					{
						name: '刘思吉吉',
						id: '3-1-3',
						typeCode: 'emp',
						isLeaf: true
					}
				]
			} else {
				data = [
					{
						name: '李景亮-角色',
						id: '3-1-1',
						typeCode: 'emp',
						isLeaf: true
					},
					{
						name: '王刘妮-角色',
						id: '3-1-2',
						typeCode: 'emp',
						isLeaf: true
					},
					{
						name: '刘思吉吉-角色',
						id: '3-1-3',
						typeCode: 'emp',
						isLeaf: true
					}
				]
			}
			resolve(data)
		},
		loadBackLinks(resolve) {
			resolve({
				报销单填报: [
					{
						approver: '燕兵哲',
						id: 'manualActivity1',
						name: '报销单填报',
						opinionTime: '2022-02-28 10:38:41',
						opinions: '发起申请'
					},
					{
						approver: '燕兵哲',
						id: 'manualActivity2',
						name: '报销单填报',
						opinionTime: '2022-02-28 10:38:41',
						opinions: '发起申请'
					},
					{
						approver: '燕兵哲',
						id: 'manualActivity3',
						name: '报销单填报',
						opinionTime: '2022-02-28 10:38:41',
						opinions: '发起申请'
					},
					{
						approver: '燕兵哲',
						id: 'manualActivity4',
						name: '报销单填报',
						opinionTime: '2022-02-28 10:38:41',
						opinions: '发起申请'
					}
				],
				报销单填报1: [
					{
						approver: '燕兵哲',
						id: 'manualActivity11',
						name: '报销单填报',
						opinionTime: '2022-02-28 10:38:41',
						opinions: '发起申请'
					},
					{
						approver: '燕兵哲',
						id: 'manualActivity21',
						name: '报销单填报',
						opinionTime: '2022-02-28 10:38:41',
						opinions: '发起申请'
					},
					{
						approver: '燕兵哲',
						id: 'manualActivity3',
						name: '报销单填报',
						opinionTime: '2022-02-28 10:38:41',
						opinions: '发起申请'
					},
					{
						approver: '燕兵哲',
						id: 'manualActivity41',
						name: '报销单填报',
						opinionTime: '2022-02-28 10:38:41',
						opinions: '发起申请'
					}
				]
			})
		}
	}
}
</script>
<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
.tip {
	color: red;
	margin-bottom: 20px;
}
.btn {
	margin: 50px 50px 0 0;
}
</style>
