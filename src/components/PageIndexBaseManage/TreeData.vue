<template>
  <div>
    <el-tree
      :data="dataTree"
      :props="defaultProps"
      :highlight-current="true"
      node-key="id"
      :default-expanded-keys="[openParentId]"
      ref="tree"
      :auto-expand-parent="true"
      :check-on-click-node="true"
      :accordion="true"
      :expand-on-click-node="false"
      @node-contextmenu="handleRightClick"
      @node-click="handleNodeClick"
      :render-content="renderContent"
    ></el-tree>
    <div v-show="menuVisible" id="menu">
      <div class="d-btnitem">
        <el-button size="mini" @click="handleNewclassification">新增</el-button>
      </div>
      <div class="d-btnitem">
        <el-button size="mini" @click="handleEditNewclassification">编辑</el-button>
      </div>
      <div class="d-btnitem">
        <el-button size="mini" @click="deleteType" type="danger">删除</el-button>
      </div>
    </div>
    <!-- 新增编辑分类 -->
    <Newclassification
      v-if="NewclassificationModel"
      :NewclassificationModel="NewclassificationModel"
      :NewclassificationIsEdit="NewclassificationIsEdit"
      :changeParent="changeParent"
      :selectData="selectData"
      :getList="getList"
    />
  </div>
</template>
<style lang="less" scoped>
#menu {
  position: absolute;
  z-index: 10000;
  box-shadow: 0 0 10px #e9e9e9;
  padding: 10px;
  background-color: #ffffff;
  .d-btnitem {
    margin-top: 8px;
  }
}
</style>
<script>
import Newclassification from "./Newclassification.vue";
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      dataTree: [],
      openParentId: 0, // 默认选中的子节点
      storageTreeId: "",
      NewclassificationModel: false,
      NewclassificationIsEdit: false,
      menuVisible: false,
      childrenIds: [],
      selectData: {}
    };
  },
  mounted() {},
  created() {
    const _this = this;
    document.body.addEventListener(
      "click",
      function(event) {
        _this.menuVisible = false;
      },
      false
    );
    this.getList();
    // this.changeFirst(this.dataTree[0].children); // 获取所有的子节点
  },
  components: {
    Newclassification
  },
  props: ["changeId", "changeTree"],
  methods: {
    renderContent(h, { node, data, store }) {
      let label = node.label;
      return (
        <span class="custom-tree-node">
          <span
            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; width: 180px;"
            class="el-tree-node__label"
            title={node.label}
          >
            {node.label}
          </span>
        </span>
      );
    },
    // 获取列表
    getList() {
      this.$get("/meIndicatorsCategory/list", null, data => {
        // this.selectTreeId = data.list.id; // 默认展开第一个子节点
        new Promise((resolve, reject) => {
          this.dataTree = [data.list];
          resolve();
        }).then(() => {
          const dataArr = this.analyticTree(this.dataTree, []);
          // 编辑当前选中节点时，重新渲染
          if (
            this.storageTreeId === this.selectData.id &&
            this.NewclassificationIsEdit
          ) {
            this.changeTree();
          }
          if (dataArr.indexOf(this.storageTreeId) <= -1) {
            this.storageTreeId = data.list.id;
          }
          this.openParentId = this.storageTreeId;
          this.changeId(this.storageTreeId);
          this.$refs.tree.setCurrentKey(this.storageTreeId); // 重新渲染树，默认选中
        });
      });
    },
    analyticTree(data, dataArr) {
      for (let i = 0; i < data.length; i++) {
        dataArr.push(data[i].id);
        if (data[i].children) {
          this.analyticTree(data[i].children, dataArr);
        }
      }
      return dataArr;
    },
    changeFirst(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length === 0) {
          this.childrenIds.push(data[i].id);
        } else {
          this.changeFirst(data[i].children);
        }
      }
    },
    changeParent(name, value) {
      this[name] = value;
    },
    // 选择树
    handleNodeClick(data, node) {
      this.menuVisible = false;
      this.changeId(data.id);
      this.storageTreeId = data.id;
    },
    handleRightClick(event, data, node, self) {
      this.selectData = {
        pId: data.pId,
        pIdName: node.parent.label,
        id: data.id,
        name: data.name
      };
      this.menuVisible = true;
      let menu = document.querySelector("#menu");
      //   if (event.clientX - 194 > 178) {
      //     menu.style.left = 178 + "px";
      //   } else if (event.clientX - 194 < 148) {
      //     menu.style.left = 148 + "px";
      //   } else {
      //     menu.style.left = event.clientX - 194 + "px";
      //   }
      menu.style.left = event.clientX - 194 + "px";
      menu.style.top = event.clientY - 140 + "px";
    },
    handleNewclassification(index) {
      this.NewclassificationModel = true;
      this.NewclassificationIsEdit = false;
    },
    handleEditNewclassification() {
      this.NewclassificationModel = true;
      this.NewclassificationIsEdit = true;
    },
    //删除分类
    deleteType() {
      this.NewclassificationIsEdit = false;
      this.$confirm(
        `是否确定删除指标分类【${this.selectData.name}】？`,
        "删除分类",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$post(
            `/meIndicatorsCategory/delete/${this.selectData.id}`,
            null,
            () => {
              this.getList();
            }
          );
        })
        .catch(() => {});
    }
  }
};
</script>

