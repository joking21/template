<template>
  <div>
    <!--       :current-node-key="selectTreeId"
    :default-expanded-keys="[openParentId]"-->
    <el-tree
      :data="dataTree"
      :props="defaultProps"
      :highlight-current="true"
      node-key="id"
      ref="tree"
      :auto-expand-parent="true"
      :check-on-click-node="true"
      :accordion="true"
      @node-contextmenu="handleRightClick"
      @node-click="handleNodeClick"
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
import { setTimeout } from "timers";
import { Promise } from "q";
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      dataTree: [],
      selectTreeId: 0, // 默认选中的字节
      openParentId: 0, // 默认选中的子节点
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
  props: ["changeId"],
  methods: {
    // 获取列表
    getList() {
      this.$get("/meIndicatorsCategory/list", null, data => {
        // this.selectTreeId = data.list.id; // 默认展开第一个子节点
        // this.openParentId = data.list.id;
        new Promise((resolve, reject) => {
          this.dataTree = [data.list];
          resolve();
        }).then(() => {
          this.changeId(data.list.id);
          this.$refs.tree.setCurrentKey(data.list.id); // 重新渲染树，默认选中
        });
      });
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

