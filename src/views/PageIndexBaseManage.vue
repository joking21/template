<template>
  <div class="d-content d-flex">
    <div class="d-left" id="leftTree">
      <TreeData :changeId="changeId" :changeTree="changeTree"/>
    </div>
    <div class="d-right">
     <TableList ref="tableList" :treeId="treeId" />
    </div>
  </div>
</template>
<script>
import TreeData from "../components/PageIndexBaseManage/TreeData.vue";
import TableList from "../components/PageIndexBaseManage/TableList.vue";
export default {
  data() {
    return {
      treeId: '',
    };
  },
  components:{
    TreeData,
    TableList
  },
  methods: {
   changeId(id){
     this.treeId = id;
   },
   changeTree(){
     this.$refs.tableList.getTreeData(this.treeId);
   }
  },
};
</script>

