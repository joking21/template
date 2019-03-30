<template>
  <div class="d-content">
    <div class="d-left" id="leftTree">
      <TreeData :changeId="changeId" />
    </div>
    <div class="d-right">
     <TableList :treeId="treeId" />
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
   getTreeData(){
     this.$get(`/meIndicatorsCategory/info/${this.treeId}`, null , (data)=>{
        //  this.form.information = data.object.information;
        console.log(data);
       })
   },
   changeId(id){
     this.treeId = id;
   }
  },
};
</script>

