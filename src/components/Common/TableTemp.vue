<template>
    <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        border
    >
        <el-table-column v-for="item in columnArr" :key="item" :label="`${item}级指标分类`" width="100">
            <template slot-scope="scope">
                <el-checkbox v-if="scope.row[`name${item}`]" :name="scope.row[`name${item}`]" style="margin-right: 5px"></el-checkbox>
                <span>{{ scope.row[`name${item}`] || '-'}}</span>
            </template>
        </el-table-column>
        <!-- <el-table-column  v-for="item in columnArr" :key="item" :label="`${item}级指标分类`" :prop="`name${item}`" width="100"></el-table-column> -->
        <el-table-column label="指标项">
            <template slot-scope="scope">
                <el-checkbox name="scope.row.indexItemName" style="margin-right: 5px"></el-checkbox>
                <span>{{ scope.row.indexItemName }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="indexItemWeight" label="权重" width="80">
              <template slot-scope="scope">
                  <el-input v-model="scope.row.indexItemWeight"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="子指标项">
            <template slot-scope="scope">
                <el-checkbox name="subIndexItemName" style="margin-right: 5px"></el-checkbox>
                <span>{{ scope.row.subIndexItemName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="权重" width="80">
            <template slot-scope="scope">
                <el-input v-model="scope.row.subIndexItemWeight"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="期望值（%）" width="80">
            <template slot-scope="scope">
                <el-input v-model="scope.row.subIndexItemExpectations"></el-input>
            </template>
        </el-table-column>
    </el-table> 
</template>
<script>
export default {
  data() {
    return {
      data6: [
        {
          id: 1,
          label: "一级1a",
          children: [
            {
              id: 2,
              label: "二级2a",
              children: [
                {
                  id: 3,
                  label: "指标项3a",
                  children: [
                    {
                      id: 4,
                      label: "子指标项4a"
                    }
                  ]
                },
                {
                  id: 5,
                  label: "子指标项5a"
                }
              ]
            }
          ]
        },
        {
          id: 7,
          label: "一级b",
          children: [
            {
              id: 8,
              label: "二级b"
            },
            {
              id: 9,
              label: "指标项b",
              children: [
                {
                  id: 10,
                  label: "子指标项10b"
                },
                {
                  id: 11,
                  label: "子指标项11b"
                }
              ]
            }
          ]
        }
      ],
      level: [],
      columnArr: [],
      dataArr: [], // 如果后台传回来的是一颗树，则把树转换成单挑数据解析    【过程：计算数的深度、解析成单条数据->再把单条数据弄成表格想要的】
      tableData: [], // 表格最终数据
      maxLevel: 0, // 深度
      tempData: [],
      tempObj:{},
      tempArr:[],
    };
  },
  //   props: ["templateModel", "changeParent", "isTemplateEdit"],
  //   computed: {
  //     reversedMessage: function() {
  //       return this.templateModel;
  //     }
  //   },
  created() {
    let attributes = {
      id: "index",
      parentId: "pid",
      name: "key",
      rootId: -1
    };
    const tt = [
      { index: 1, title: "10.0.5.11", key: "10.0.5.11", pid: -1 },
      { index: 2, title: "10.0.5.11", key: "10.0.5.11", pid: 1 },
      { index: 3, title: "7.4_1", key: "7.4_1", pid: 2 },
      { index: 5, title: "7.4_2", key: "7.4_2", pid: 2 },
      { index: 2, title: "10.0.5.11", key: "10.0.5.11", pid: -1 }
    ];
    //  如果后台传回来的是单条数据，转换过程为  解析成树（便于计算深度）-> 去掉空值children、计算树的最深度->再把单条数据弄成表格想要的
    // let gData = this.toTreeData(tt, attributes);
    // this.analyticTree(gData, 0, -1); // 可以增加去掉空的children
    // console.log(gData);
  },
  created() {
    this.analyticTree(this.data6); // 计算this.level  所有树支的深度 把树解析成一条单数据  this.dataArr
    this.getMax(this.level); // 计算最深树枝的深度
    this.analyticArr(this.dataArr); // 把所有有关联的数据合成一条
    // 处理rowspan
    // this.handleRowspan();
    console.log("最最最忠", this.tableData);
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // const maxLevel = this.maxLevel;
      // const index = parseInt(columnIndex + 1, 10);
      // if (index <= maxLevel && row[`name${index}`]) {
      //   return {
      //     rowspan: row[`name${index}rowspan`],
      //     colspan: 1
      //   };
      // } else if (columnIndex === maxLevel) {
      //   return {
      //     rowspan: row.indexItemNamerowspan,
      //     colspan: 1
      //   };
      // } else if (columnIndex === maxLevel + 1) {
      //   return {
      //     rowspan: row.subIndexItemNamerowspan,
      //     colspan: 1
      //   };
      // } else {
      //   return {
      //     rowspan: 1,
      //     colspan: 1
      //   };
      // }
    },
    analyticTree(data, index, level) {
      for (let i = 0; i < data.length; i++) {
        let tempLevel, tempIndex;
        tempLevel = level === undefined ? -1 : level;
        tempIndex = index === undefined ? -2 : index;
        const temp = {
          pid: tempIndex,
          id: data[i].id,
          label: data[i].label,
          level: tempLevel,
          rowspan: 1
        };
        this.dataArr.push(temp);
        if (data[i].children && data[i].children.length > 0) {
          tempLevel += 1;
          this.analyticTree(data[i].children, data[i].id, tempLevel);
        }
        // else {
        //     delete data[i].children;   // 如果后台传回来的是pid的形式，则需要计算出最深的层级，然后把之前递归增加多出来的children清空
        // }
        this.level.push(tempLevel);
      }
    },
    // analyticTree(data, level) {
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].children && data[i].children.length > 0) {
    //       level += 1;
    //       this.analyticTree(data[i].children, level, data[i].id);
    //     }
    //   }
    //   this.level.push(level);
    //   return level;
    // },
    // 取最大层级渲染表格
    getMax(arr) {
      arr.sort(function(a, b) {
        return a - b;
      });
      const max = arr[arr.length - 1];
      for (let i = 1; i <= max; i++) {
        this.columnArr.push(i);
      }
      this.maxLevel = max;
    },
    // 封装成想要渲染表格的数据
    // analyticArr(data){
    //   let tempData = JSON.parse(JSON.stringify(data));
    //   const maxLevel = this.maxLevel;   // 最深层次   第一层   -2
    //    for (let i = 0; i < tempData.length; i++) {
    //      if(tempData[i].level === maxLevel){
    //        // 表示是子指标项
    //       tempData[i].subIndexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
    //       tempData[i].subIndexItemWeight = ""; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
    //       tempData[i].subIndexItemExpectations = ""; // 期望值  逻辑同权重
    //       tempData[i].subIndexItemId = tempData[i].id;
    //       tempData[i].subIndexItemNamerowspan = tempData[i].rowspan;
    //      }else if(tempData[i].level === maxLevel-1){
    //         tempData[i].indexItemId = tempData[i].id;
    //         tempData[i].indexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
    //         tempData[i].indexItemNamerowspan = tempData[i].rowspan;
    //         tempData[i].indexItemWeight = ""; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
    //         tempData[i].indexItemId = tempData[i].id;
    //      }else{
    //       const name = `name${tempData[i].level + 2}`;
    //       tempData[i][name] = tempData[i].label;
    //       tempData[i][`${name}rowspan`] = tempData[i].rowspan;
    //       tempData[i][`${name}Id`] = tempData[i].id;
    //       tempData[i][`levelId-${tempData[i].id}`] = tempData[i].id;
    //      }
    //    }
    //    console.log(JSON.parse(JSON.stringify(tempData)));
    //     this.tempData = tempData;
    //     this.tableData = this.concatArr();
    // },

    analyticArr(data){
      let tempData = JSON.parse(JSON.stringify(data));
      const comData = JSON.parse(JSON.stringify(data));
      // const maxLevel = this.maxLevel;   // 最深层次   第一层   -2
      //  for (let i = 0; i < tempData.length; i++) {
      //    if(tempData[i].level === maxLevel){
      //      // 表示是子指标项
      //     tempData[i].subIndexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
      //     tempData[i].subIndexItemWeight = ""; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
      //     tempData[i].subIndexItemExpectations = ""; // 期望值  逻辑同权重
      //     tempData[i].subIndexItemId = tempData[i].id;
      //     tempData[i].subIndexItemNamerowspan = tempData[i].rowspan;
      //    }else if(tempData[i].level === maxLevel-1){
      //       tempData[i].indexItemId = tempData[i].id;
      //       tempData[i].indexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
      //       tempData[i].indexItemNamerowspan = tempData[i].rowspan;
      //       tempData[i].indexItemWeight = ""; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
      //       tempData[i].indexItemId = tempData[i].id;
      //    }else{
      //     const name = `name${tempData[i].level + 2}`;
      //     tempData[i][name] = tempData[i].label;
      //     tempData[i][`${name}rowspan`] = tempData[i].rowspan;
      //     tempData[i][`${name}Id`] = tempData[i].id;
      //     tempData[i][`levelId-${tempData[i].id}`] = tempData[i].id;
      //    }
      //  }
       console.log(JSON.parse(JSON.stringify(tempData)));
       debugger
       for(let i = 0; i<tempData.length; i++){
         if(this.isSubIndexItem(tempData[i].id, comData)){
          tempData[i].subIndexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
          tempData[i].subIndexItemWeight = ""; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
          tempData[i].subIndexItemExpectations = ""; // 期望值  逻辑同权重
          tempData[i].subIndexItemId = tempData[i].id;
          tempData[i].subIndexItemNamerowspan = tempData[i].rowspan;
         }
         else if(this.isIndexItem(tempData[i].id, comData)){
            tempData[i].indexItemId = tempData[i].id;
            tempData[i].indexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
            tempData[i].indexItemNamerowspan = tempData[i].rowspan;
            tempData[i].indexItemWeight = ""; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
         }
         else{
          const name = `name${tempData[i].level + 2}`;
          tempData[i][name] = tempData[i].label;
          tempData[i][`${name}rowspan`] = tempData[i].rowspan;
          tempData[i][`${name}Id`] = tempData[i].id;
          tempData[i][`levelId-${tempData[i].id}`] = tempData[i].id;
         }
       }
        this.tempData = tempData;
        this.tableData = this.concatArr();
    },
    // 判断是否是指标项 -> 判断依据：子类是否还有子类
    isIndexItem(id, data) {
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].pid) {
          for(let j = 0;j<data.length;j++){
            if(data[i].id === data[j].pid){
              temp.push(1);
            }
          }
        }
      }
       if(temp.length !== 0){
          return false;
        }
        return true;
    },
    isSubIndexItem(id, data){
      let temp = [];
      for (let i = 0; i < data.length; i++) {
          if (id === data[i].pid) {
            temp.push(1);
          }
        }
        if(temp.length !== 0){
          return false;
        }
        return true;
    },
    // 合并多条数据
    concatArr() {
      let tempData = JSON.parse(JSON.stringify(this.tempData));
      let tempChild = [];
      let tempArr = [];
      for (let i = 0; i < tempData.length; i++) {
        console.log(tempData[i]);
        for(let j = 0; j<tempData.length;j++){
          if(tempData[i].id === tempData[j].pid){
            tempArr.push(1);
          }
        }

        if(tempArr.length === 0){
          tempChild.push(tempData[i]);
        }
        tempArr = [];
      }
      for(let m = 0; m < tempChild.length; m++){
        this.findParent(tempChild[m]);
      }
      return tempChild;
    },
    findParent(obj){
      let tempData = JSON.parse(JSON.stringify(this.tempData));
      for(let i = 0; i < tempData.length; i++){
        if(obj.pid === tempData[i].id){
          obj = Object.assign(obj, tempData[i]);
          this.findParent(obj, tempData);
        }
      }
    },
    test(data, id){
      let temp = [];
        for (let i = 0; i < data.length; i++) {
          if(data.pid === id){
            temp.push(i);  // 找到对应位置
          }
        }
        // debugger
        return temp;
    },
    //  concatArr(id, obj) {
    //   let tempData = JSON.parse(JSON.stringify(this.tempData));
    //   let yy = [];
    //   for (let i = 0; i < tempData.length; i++) {
    //     // debugger
    //     if (id === tempData[i].pid ) {
    //       const objFirst = JSON.parse(JSON.stringify(this.tempObj));
    //       this.tempObj = Object.assign(this.tempObj, tempData[i]);
    //       this.concatArr(tempData[i].id, objFirst);
    //       yy = [];
    //     } else {
    //       yy.push(1);
    //     }
    //   }
    //   if (yy.length === tempData.length) {
    //     this.tableData.push(JSON.parse(JSON.stringify(this.tempObj)));
    //     this.tempObj = {};
    //   }
    // },
    handleRowspan(){
      let data = this.tableData; 
      let indexItemNamerowspanArr = [];
      let subIndexItemNamerowspanArr = [];
      let nameArr = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = i; j < data.length; j++) {
          if (data[i].id !== data[j].id) {
            if (data[i].indexItemId === data[j].indexItemId) {
              indexItemNamerowspanArr.push(1);
            }
            if (data[i].subIndexItemId === data[j].subIndexItemId) {
              subIndexItemNamerowspanArr.push(1);
            }
            for (let k = 1; k <= this.maxLevel; k++) {
              if (data[i][`name${k}Id`] === data[j][`name${k}Id`]) {
                //  data[j][`name${k}rowspan`] = 0;
                debugger
                nameArr[k] = nameArr[k] ? nameArr[k] + 1 : 1;
              }
            }
          }
        }
        if (indexItemNamerowspanArr.length === 0){
          data[i].indexItemNamerowspan = 1;
        } else {
           data[i].indexItemNamerowspan = indexItemNamerowspanArr.length;
        }
        if (subIndexItemNamerowspanArr.length === 0){
          data[i].subIndexItemNamerowspan = 1;
        } else {
           data[i].subIndexItemNamerowspan = subIndexItemNamerowspanArr.length;
        }
          for (let k = 1; k <= this.maxLevel; k++) {
          if (!nameArr[k]) {
            data[i][`name${k}rowspan`] = nameArr[k];
            //  data[j][`name${k}rowspan`] = 0;
            // let name = `name${k}`;
            // nameArr[name] = nameArr[name] ? nameArr[name] + 1 : 1;
          }
        }
      }
    }
    // handleRowspan() {
    //   let data = this.tableData;
    //   let indexItemNamerowspanArr = [];
    //   let subIndexItemNamerowspanArr = [];

    //   for (let i = 0; i < data.length; i++) {
    //     for (let j = i; j < data.length; j++) {
    //       if (data[i].id !== data[j].id) {
    //         if (data[i].indexItemId === data[j].indexItemId) {
    //           data[j].indexItemNamerowspan = 0;
    //         }
    //         if (data[i].subIndexItemId === data[j].subIndexItemId) {
    //           data[j].subIndexItemNamerowspan = 0;
    //         }
    //         for (let k = 1; k <= this.maxLevel; k++) {
    //           if (data[i][`name${k}Id`] === data[j][`name${k}Id`]) {
    //             data[j][`name${k}rowspan`] = 0;
    //           }
    //         }
    //       }
    //     }
    //   }
    //   for (let m = 0; m < data.length; m++) {
    //     for (let n = 0; n < data.length; n++) {
    //       // debugger
    //       if (data[m].indexItemId !== data[n].indexItemId) {
    //         indexItemNamerowspanArr.push(1);
    //       }
    //       if (data[m].subIndexItemId !== data[n].subIndexItemId) {
    //         subIndexItemNamerowspanArr.push(1);
    //       }
    //       // if (data[i].id !== data[j].id) {
    //       //   if (data[i].indexItemId !== data[j].indexItemId) {
    //       //     indexItemNamerowspanArr.push(1);
    //       //   }
    //       //   if (data[i].subIndexItemId !== data[j].subIndexItemId) {
    //       //     subIndexItemNamerowspanArr.push(1);
    //       //   }
    //       //   // for (let k = 1; k <= this.maxLevel; k++) {
    //       //   //   if (data[i][`name${k}Id`] === data[j][`name${k}Id`]) {
    //       //   //     data[j][`name${k}rowspan`] = 0;
    //       //   //   }
    //       //   // }
    //       // }
    //     }
    //     if (indexItemNamerowspanArr.length === data.length) {
    //       data[m].indexItemNamerowspan = 1;
    //     }
    //     if (subIndexItemNamerowspanArr.length === data.length) {
    //       data[m].subIndexItemNamerowspanArr = 1;
    //     }
    //   }
    // }

    // 单条数据转换成树测试
    // toTreeData(data, attributes) {
    //   let resData = data;
    //   let tree = [];
    //   for (let i = 0; i < resData.length; i++) {
    //     if (resData[i][attributes.parentId] === attributes.rootId) {
    //       let obj = {
    //         id: resData[i][attributes.id],
    //         title: resData[i][attributes.name],
    //         key: resData[i][attributes.name],
    //         children: []
    //       };
    //       tree.push(obj);
    //       resData.splice(i, 1);
    //       i--;
    //     }
    //   }
    //   run(tree);
    //   function run(chiArr) {
    //     if (resData.length !== 0) {
    //       for (let i = 0; i < chiArr.length; i++) {
    //         for (let j = 0; j < resData.length; j++) {
    //           if (chiArr[i].id === resData[j][attributes.parentId]) {
    //             let obj = {
    //               id: resData[j][attributes.id],
    //               key: resData[j][attributes.name],
    //               title: resData[j][attributes.name],
    //               children: []
    //             };
    //             chiArr[i].children.push(obj);
    //             resData.splice(j, 1);
    //             j--;
    //           }
    //         }
    //         run(chiArr[i].children);
    //       }
    //     }
    //   }
    //   return tree;
    // }

    // 表格增加合计
    //   getSummaries(param) {
    //     const { columns, data } = param;
    //     const sums = [];
    //     columns.forEach((column, index) => {
    //       if (index === 0) {
    //         sums[index] = "——————";
    //         return;
    //       }
    //     });
    //     return sums;
    //   }
  }
};
</script>

