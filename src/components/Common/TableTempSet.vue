<template>
  <el-table :data="tableData" :span-method="objectSpanMethod" border class="d-temp-table">
    <el-table-column
      prop="name"
      v-for="item in columnArr"
      :key="item"
      :label="`${item}级指标分类`"
      width="100"
    >
      <template slot-scope="scope">
        <!-- 查看模板-->
        <div>
          <el-checkbox
            v-if="scope.row[`name${item}`]"
            :name="scope.row[`name${item}`]"
            style="margin-right: 5px"
            :disabled="templatePreview"
            v-model="scope.row[`name${item}Checked`]"
          ></el-checkbox>
          <span>{{ scope.row[`name${item}`] || '-'}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="indexItem" label="指标项">
      <template slot-scope="scope">
        <!-- 查看 -->
        <div>
          <el-checkbox
            v-if="scope.row.indexItemName"
            name="scope.row.indexItemName"
            style="margin-right: 5px"
            :disabled="templatePreview"
            v-model="scope.row.indexItemChecked"
          ></el-checkbox>
          <span>{{ scope.row.indexItemName || '-'}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="indexItemWeight" label="权重" width="80">
      <template slot-scope="scope">
        <div v-if="templatePreview">
          <span>{{ scope.row.indexItemWeight || '-'}}</span>
        </div>
        <div v-else>
          <span v-if="!scope.row.indexItemName">-</span>
          <el-input-number
            v-else
            :min="0"
            v-model="scope.row.indexItemWeight"
            :controls="false"
            style="width: 60px"
          ></el-input-number>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="subIndexItem" label="子指标项">
      <template slot-scope="scope">
        <div>
          <el-checkbox
            :disabled="templatePreview"
            name="subIndexItemName"
            style="margin-right: 5px"
            v-model="scope.row.subIndexItemChecked"
          ></el-checkbox>
          <span>{{ scope.row.subIndexItemName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="权重" width="80">
      <template slot-scope="scope">
        <div v-if="templatePreview || !scope.row.subIndexItemName">
          <span>{{ scope.row.subIndexItemWeight || '-'}}</span>
        </div>
        <div v-else>
          <el-input-number
            :min="0"
            v-model="scope.row.subIndexItemWeight"
            :controls="false"
            style="width: 60px"
          ></el-input-number>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="expectations" label="期望值（%）" width="80">
      <template slot-scope="scope">
        <div v-if="templatePreview || !scope.row.subIndexItemName">
          <span>{{ scope.row.subIndexItemExpectations || '-'}}</span>
        </div>
        <div v-else>
          <el-input-number
            :min="0"
            v-model="scope.row.subIndexItemExpectations"
            :controls="false"
            style="width: 60px"
          ></el-input-number>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<style lang="less">
.d-temp-table {
  .el-input-number.is-without-controls .el-input__inner {
    padding-left: 8px;
    padding-right: 8px;
  }
  .el-input__inner {
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>

<script>
export default {
  data() {
    return {
      uniquenessId: 1,
      level: [], // 所有树枝深度
      columnArr: [], // 此表格应该有的级别数    1级指标分类->2级指标分类
      dataArr: [], // 如果后台传回来的是一颗树，则把树转换成单挑数据解析    【过程：计算数的深度、解析成单条数据->再把单条数据弄成表格想要的】
      tableData: [], // 表格最终数据
      maxLevel: 0, // 深度
      tempData: [], // 把单条数据里面的字段初始化【ps: 方便下一步的把父子关系的对象，合并成一条对象】,若要增删字段，则在处理这个数据时操作
      // dataList: [
      //   {
      //     id: 2,
      //     name: "业务类",
      //     pId: 1,
      //     children: [
      //       {
      //         id: 3,
      //         name: "业务类1",
      //         pId: 2,
      //         children: [
      //           {
      //             id: 3,
      //             name: "指标项3",
      //             superior: 1,
      //             weight: 100,
      //             children: [
      //               {
      //                 id: 5,
      //                 name: "子指标项名称5",
      //                 superior: 2,
      //                 weight: 10,
      //                 expectations: 20
      //               },
      //               {
      //                 id: 6,
      //                 name: "子指标项名称6",
      //                 superior: 2,
      //                 weight: 10,
      //                 expectations: 20
      //               }
      //             ]
      //           }
      //         ],
      //         level: true
      //       },
      //       {
      //         id: 4,
      //         name: "业务类--2",
      //         pId: 2,
      //         children: [],
      //         pIdName: null,
      //         information: null,
      //         level: true
      //       },
      //       {
      //         id: 5,
      //         name: "业务类--3",
      //         pId: 2,
      //         children: [],
      //         pIdName: null,
      //         information: null,
      //         level: true
      //       }
      //     ],
      //     level: true
      //   },
      //   {
      //     id: 6,
      //     name: "技术类",
      //     pId: 1,
      //     children: [
      //       {
      //         id: 7,
      //         name: "技术类--1",
      //         pId: 6,
      //         weight: 100,
      //         children: [
      //           {
      //             id: 11114,
      //             name: "指标项save1",
      //             superior: 1,
      //             children: [
      //               {
      //                 id: 8,
      //                 name: "子指标项名称save1",
      //                 superior: 2
      //               },
      //               {
      //                 id: 9,
      //                 name: "子指标项名称save2",
      //                 superior: 2,
      //                 weight: 10,
      //                 expectations: 20
      //               }
      //             ]
      //           },
      //           {
      //             id: 11115,
      //             name: "指标项save1",
      //             superior: 1,
      //             children: [
      //               {
      //                 id: 10,
      //                 name: "子指标项名称save1",
      //                 superior: 2
      //               },
      //               {
      //                 id: 11,
      //                 name: "子指标项名称save2",
      //                 superior: 2
      //               }
      //             ]
      //           },
      //           {
      //             id: 11116,
      //             name: "指标项save1",
      //             superior: 1,
      //             children: [
      //               {
      //                 id: 12,
      //                 name: "子指标项名称save1",
      //                 superior: 2
      //               },
      //               {
      //                 id: 13,
      //                 name: "子指标项名称save2",
      //                 superior: 2
      //               }
      //             ]
      //           }
      //         ],
      //         level: true
      //       },
      //       {
      //         id: 8,
      //         name: "技术类--2",
      //         pId: 6,
      //         children: [],
      //         level: true
      //       },
      //       {
      //         id: 9,
      //         name: "技术类--3",
      //         pId: 6,
      //         children: [],
      //         level: true
      //       }
      //     ],
      //     level: true
      //   },
      //   {
      //     id: 10,
      //     name: "其他类",
      //     pId: 1,
      //     children: [
      //       {
      //         id: 4,
      //         name: "指标项4",
      //         superior: 1,
      //         children: [
      //           {
      //             id: 7,
      //             name: "子指标项名称7",
      //             superior: 2
      //           }
      //         ]
      //       }
      //     ],
      //     level: true
      //   }
      // ]
    };
  },
  //isTemplatePreview: 查看模板
  props: [
    "templatePreview",
    "dataList",
    "isAdd"
  ],
  created() {
    // // console.log(this.dataList);
    // this.analyticTree(this.dataList); // 计算this.level  所有树支的深度 把树解析成一条单数据  this.dataArr
    // // console.log(this.dataArr);
    // this.getMax(this.level); // 计算最深树枝的深度
    // this.analyticArr(this.dataArr); // 把所有有关联的数据合成一条
    // this.handleRowspan(); // 处理rowspan
    // console.log("最最最忠", this.tableData);
    // // 处理查看、编辑时的check默认选中
    // if(!this.isAdd){
    //   this.hancleCheck();
    // }
    new Promise((resolve, reject) => {
      this.analyticTree(this.dataList); // 计算this.level  所有树支的深度 把树解析成一条单数据  this.dataArr
      resolve();
    })
      .then(() => {
        this.getMax(this.level); // 计算最深树枝的深度
      })
      .then(() => {
        this.analyticArr(this.dataArr); // 把所有有关联的数据合成一条
      })
      .then(() => {
        this.handleRowspan(); // 处理rowspan
      })
      .then(() => {
        // 处理查看、编辑时的check默认选中
        if (!this.isAdd) {
          this.hancleCheck();
        }
      });
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //  以下代码不要轻易改的，连顺序都是有要求的
      const maxLevel = this.maxLevel;
      const index = parseInt(columnIndex + 1, 10);
      if (column.property === "indexItemWeight" && row.indexItemName) {
        return {
          rowspan: row.indexItemNamerowspan,
          colspan: 1
        };
      }
      if (column.label == "权重" || column.property === "expectations") {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
      if (column.property === "indexItem" && row.indexItemName) {
        return {
          rowspan: row.indexItemNamerowspan,
          colspan: 1
        };
      }
      if (column.label == "subIndexItem") {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
      if (index <= maxLevel && row[`name${index}`]) {
        return {
          rowspan: row[`name${index}rowspan`],
          colspan: 1
        };
      }
    },
    analyticTree(data, index, level) {
      for (let i = 0; i < data.length; i++) {
        let tempLevel, tempIndex;
        tempLevel = level === undefined ? -1 : level;
        tempIndex = index === undefined ? -2 : index;
        const temp = {
          pid: tempIndex,
          id: this.uniquenessId,
          level: tempLevel,
          rowspan: 1,
          label: data[i].name,
          itemId: data[i].id,
          itemExp: data[i].expectations,
          itemWeight: data[i].weight,
          isTitle: data[i].level,
          superior: data[i].superior
        };
        this.uniquenessId += 1;
        this.dataArr.push(temp);
        if (
          (data[i].childrenItems && data[i].childrenItems.length) ||
          (data[i].children && data[i].children.length) > 0
        ) {
          tempLevel += 1;
          this.analyticTree(
            data[i].childrenItems || data[i].children,
            temp.id,
            tempLevel
          );
        }
        this.level.push(tempLevel);
      }
    },
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

    // 数据归类
    analyticArr(data) {
      let tempData = JSON.parse(JSON.stringify(data));
      const comData = JSON.parse(JSON.stringify(data));
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].isTitle === true) {
          const name = `name${tempData[i].level + 2}`;
          tempData[i][name] = tempData[i].label;
          tempData[i][`${name}rowspan`] = tempData[i].rowspan;
          tempData[i][`${name}Id`] = tempData[i].id;
          tempData[i][`levelId-${tempData[i].id}`] = tempData[i].id;
          tempData[i][`${name}Checked`] = false;
        }
        // tempData[i].isTitle === false
        else if (!tempData[i].isTitle && tempData[i].superior === 1) {
          tempData[i].indexItemId = tempData[i].id;
          tempData[i].indexSaveId = tempData[i].itemId;
          tempData[i].indexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
          tempData[i].indexItemNamerowspan = tempData[i].rowspan;
          tempData[i].indexItemWeight =
            tempData[i].itemWeight === null
              ? undefined
              : tempData[i].itemWeight; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
          tempData[i].indexItemChecked = false;
        } else if (!tempData[i].isTitle && tempData[i].superior === 2) {
          tempData[i].subIndexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
          tempData[i].subIndexItemWeight =
            tempData[i].itemWeight === null
              ? undefined
              : tempData[i].itemWeight; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
          tempData[i].subIndexItemExpectations =
            tempData[i].itemExp === null ? undefined : tempData[i].itemExp; // 期望值  逻辑同权重
          tempData[i].subIndexItemId = tempData[i].id;
          tempData[i].subIndexSaveId = tempData[i].itemId; // 要传的id
          tempData[i].subIndexItemNamerowspan = tempData[i].rowspan;
          tempData[i].subIndexItemChecked = false;
        }
      }
      this.tempData = tempData;
      this.tableData = this.concatArr();
    },
    // 合并多条数据
    concatArr() {
      let tempData = JSON.parse(JSON.stringify(this.tempData));
      let tempChild = [];
      let tempArr = [];
      for (let i = 0; i < tempData.length; i++) {
        for (let j = 0; j < tempData.length; j++) {
          if (tempData[i].id === tempData[j].pid) {
            tempArr.push(1);
          }
        }
        if (tempArr.length === 0) {
          tempChild.push(tempData[i]);
        }
        tempArr = [];
      }
      for (let m = 0; m < tempChild.length; m++) {
        this.findParent(tempChild[m]);
      }
      for (let i = 0; i < tempChild.length; i++) {
        tempChild[i].id = i;
      }
      return tempChild;
    },
    findParent(obj) {
      let tempData = JSON.parse(JSON.stringify(this.tempData));
      for (let i = 0; i < tempData.length; i++) {
        if (obj.pid === tempData[i].id) {
          obj = Object.assign(obj, tempData[i]);
          this.findParent(obj, tempData);
        }
      }
    },
    hancleCheck() {
      const tempData = this.tableData;
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].subIndexItemWeight) {
          tempData[i].subIndexItemChecked = true;
          for (let j = 0; j < tempData.length; j++) {
            if (
              tempData[j].indexItemId === tempData[i].indexItemId &&
              tempData[j].indexItemNamerowspan != 0
            ) {
              tempData[j].indexItemChecked = true;
            }
            for (let k = 0; k < this.columnArr.length; k++) {
              const name = `name${this.columnArr[k]}`;
              if (
                tempData[j][`${name}Id`] === tempData[i][`${name}Id`] &&
                tempData[j][`${name}rowspan`] != 0
              ) {
                tempData[j][`${name}Checked`] = true;
              }
            }
          }
        }
      }
    },
    handleRowspan() {
      let data = this.tableData;
      let indexItemNamerowspanArr = [];
      let subIndexItemNamerowspanArr = [];
      let nameArr = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (
            data[i].indexItemId === data[j].indexItemId &&
            data[i].id !== data[j].id &&
            !data[i].indexItemFixed &&
            data[i].indexItemNamerowspan
          ) {
            data[i].indexItemNamerowspan++;
            data[j].indexItemNamerowspan = 0;
            data[j].indexItemFixed = true;
          }
          for (let k = 1; k <= this.maxLevel; k++) {
            const name = `name${k}`;
            if (
              data[i][`${name}Id`] === data[j][`${name}Id`] &&
              data[i].id !== data[j].id &&
              !data[i][`${name}Fixed`] &&
              data[i][`${name}rowspan`]
            ) {
              data[i][`${name}rowspan`]++;
              data[j][`${name}rowspan`] = 0;
              data[j][`${name}Fixed`] = true;
            }
          }
        }
      }
    }
  }
};
</script>

