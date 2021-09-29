<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <PrimetonUniversalButton
      title="指定参与者"
      type="default_submit"
      :viewPartyType="'org,role'.split(',')"
      @loadLinks="loadLinks"
      @loadTreeRootData="loadTreeRootData"
      @loadTreeChildrenData="loadTreeChildrenData"
      @filter="filterData"
      @confirm="confirm"
      @close="close"
    >
      <button type="button" @click="btnClick('你个小辣鸡')">牛逼啊</button>
    </PrimetonUniversalButton>
  </div>
</template>
<script>
import PrimetonUniversalButton from "../packages/PrimetonUniversalButton";

export default {
  name: "App",
  components: {
    PrimetonUniversalButton,
  },
  data() {
    return {};
  },
  methods: {
    loadLinks(resolve) {
      const data = [
        {
          id: "manualActivity4",
          name: "财务审批",
          participants: [
            {
              id: "1021",
              name: "部门经理",
              typeCode: "role",
            },
            {
              id: "41",
              name: "开发部",
              typeCode: "org",
            },
          ],
        },
        {
          id: "leaderActivity4",
          name: "领导审批",
          participants: [
            {
              id: "1021",
              name: "部门经理",
              typeCode: "role",
            },
            {
              id: "41",
              name: "开发部",
              typeCode: "org",
            },
          ],
        },
      ];
      resolve(data);
    },
    // 根数据
    loadTreeRootData(resolve) {
      const rootData = [
        {
          id: "1",
          label: "普元信息技术有限公司",
          type: "company",
          children: [
            [
              {
                id: "1-1",
                label: "济南政企部门",
                type: "org",
              },
              {
                id: "2-1",
                label: "上海产品部",
                type: "org",
              },
            ],
          ],
        },
        {
          id: "2",
          label: "普元信息技术有限公司1",
          type: "company",
          children: [
            [
              {
                id: "1-1",
                label: "济南政企部门",
                type: "org",
              },
              {
                id: "2-1",
                label: "上海产品部",
                type: "org",
              },
            ],
          ],
        },
      ];
      resolve(rootData);
    },
    // 懒加载根据节点查询数据
    loadTreeChildrenData(node, resolve) {
      if (node.data.id == "1") {
        resolve([
          {
            id: "1-1",
            label: "济南政企部门",
            type: "org",
          },
          {
            id: "2-1",
            label: "上海产品部",
            type: "org",
          },
        ]);
      } else if (node.data.id == "1-1") {
        resolve([
          {
            label: "孟凡喜",
            id: "1-1-1",
            type: "person",
            leaf: true,
          },
          {
            label: "傅胤龙",
            id: "1-1-2",
            type: "person",
            leaf: true,
          },
          {
            label: "李文香",
            id: "1-1-3",
            type: "person",
            leaf: true,
          },
        ]);
      } else if (node.data.id == "2-1") {
        resolve([
          {
            label: "马冬梅",
            id: "2-1-1",
            type: "person",
            leaf: true,
          },
        ]);
      } else {
        resolve([]);
      }
    },
    confirm(data, close) {
      console.log(data, "&&&&&&&");
      close();
    },
    close() {
      console.log("close*****************");
    },
    btnClick(val) {
      console.log("🚀 🚀 🚀 🚀 🚀 🚀 牛逼 🚀 🚀 🚀 🚀 🚀 🚀", val);
    },
    filterData(keyword, resolve) {
      // 检索 keyword，获取新的树
      const data = [
        {
          label: "李景亮",
          id: "3-1-1",
          type: "person",
          leaf: true,
        },
        {
          label: "王刘妮",
          id: "3-1-2",
          type: "person",
          leaf: true,
        },
        {
          label: "刘思吉吉",
          id: "3-1-3",
          type: "person",
          leaf: true,
        },
      ];
      resolve(data);
    },
  },
};
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
</style>
