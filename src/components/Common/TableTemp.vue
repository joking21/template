<template>
  <el-table :data="tableData" :span-method="objectSpanMethod" border>
    <el-table-column
      prop="name"
      v-for="item in columnArr"
      :key="item"
      :label="`${item}级指标分类`"
      width="100"
    >
      <template slot-scope="scope">
        <!-- 查看详情、开始审核、开始填报、重新填报-->
        <div v-if="preview || startReview || startReport || reReport">
          <span>{{ scope.row[`name${item}`] || '-'}}</span>
        </div>
        <div v-else>
          <el-checkbox
            v-if="scope.row[`name${item}`]"
            :name="scope.row[`name${item}`]"
            style="margin-right: 5px"
          ></el-checkbox>
          <span>{{ scope.row[`name${item}`] || '-'}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="indexItem" label="指标项">
      <template slot-scope="scope">
        <!-- 查看 -->
        <div v-if="preview || startReview || startReport || reReport">
          <span>{{ scope.row.indexItemName || '-'}}</span>
        </div>
        <div v-else>
          <el-checkbox
            v-if="scope.row.indexItemName"
            name="scope.row.indexItemName"
            style="margin-right: 5px"
          ></el-checkbox>
          <span>{{ scope.row.indexItemName || '-'}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="indexItemWeight" label="权重" width="80">
      <template slot-scope="scope">
        <div v-if="preview || startReview || startReport || reReport">
          <span>{{ scope.row.indexItemWeight || '-'}}</span>
        </div>
        <div v-else>
          <el-input v-if="scope.row.indexItemName" v-model="scope.row.indexItemWeight"></el-input>
          <span v-if="!scope.row.indexItemName">-</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="subIndexItem" label="子指标项">
      <template slot-scope="scope">
        <div v-if="preview || startReview || startReport || reReport">
          <span>{{ scope.row.subIndexItemName}}</span>
        </div>
        <div v-else>
          <el-checkbox name="subIndexItemName" style="margin-right: 5px"></el-checkbox>
          <span>{{ scope.row.subIndexItemName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="权重" width="80">
      <template slot-scope="scope">
        <div v-if="preview || startReview || startReport || reReport">
          <span>{{ scope.row.subIndexItemWeight}}</span>
        </div>
        <div v-else>
          <el-input v-model="scope.row.subIndexItemWeight"></el-input>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="expectations" label="期望值（%）" width="80">
      <template slot-scope="scope">
        <div v-if="preview || startReview || startReport || reReport">
          <span>{{ scope.row.subIndexItemExpectations}}</span>
        </div>
        <div v-else>
          <el-input v-model="scope.row.subIndexItemExpectations"></el-input>
        </div>
      </template>
    </el-table-column>
    <el-table-column v-if="preview || startReview || startReport || reReport" label="实际值" width="80">
      <template slot-scope="scope">
        <div v-if="preview">
          <span>{{ scope.row.subIndexItemactualvalues}}</span>
        </div>
        <div v-else>
          <el-input v-model="scope.row.subIndexItemactualvalues"></el-input>
        </div>
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
                    },
                    {
                      id: 4,
                      label: "子指标项4a"
                    },
                    {
                      id: 4,
                      label: "子指标项4a"
                    },
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
      level: [], // 所有树枝深度
      columnArr: [], // 此表格应该有的级别数    1级指标分类->2级指标分类
      dataArr: [], // 如果后台传回来的是一颗树，则把树转换成单挑数据解析    【过程：计算数的深度、解析成单条数据->再把单条数据弄成表格想要的】
      tableData: [], // 表格最终数据
      maxLevel: 0, // 深度
      tempData: [] // 把单条数据里面的字段初始化【ps: 方便下一步的把父子关系的对象，合并成一条对象】,若要增删字段，则在处理这个数据时操作
    };
  },
  // preview:查看  startReview:开始审核  startReport :开始填报 reReport:重新填报 
  props: ["preview", "startReview", "startReport", "reReport"],
  created() {
    this.analyticTree(this.data6); // 计算this.level  所有树支的深度 把树解析成一条单数据  this.dataArr
    this.getMax(this.level); // 计算最深树枝的深度
    this.analyticArr(this.dataArr); // 把所有有关联的数据合成一条
    this.handleRowspan(); // 处理rowspan
    console.log("最最最忠", this.tableData);
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
    analyticArr(data) {
      let tempData = JSON.parse(JSON.stringify(data));
      const comData = JSON.parse(JSON.stringify(data));
      for (let i = 0; i < tempData.length; i++) {
        if (this.isSubIndexItem(tempData[i].id, comData)) {
          tempData[i].subIndexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
          tempData[i].subIndexItemWeight = ""; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
          tempData[i].subIndexItemExpectations = ""; // 期望值  逻辑同权重
          tempData[i].subIndexItemactualvalues = ""; // 实际值 
          tempData[i].subIndexItemId = tempData[i].id;
          tempData[i].subIndexItemNamerowspan = tempData[i].rowspan;
        } else if (this.isIndexItem(tempData[i].id, comData)) {
          tempData[i].indexItemId = tempData[i].id;
          tempData[i].indexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
          tempData[i].indexItemNamerowspan = tempData[i].rowspan;
          tempData[i].indexItemWeight = ""; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
        } else {
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
          for (let j = 0; j < data.length; j++) {
            if (data[i].id === data[j].pid) {
              temp.push(1);
            }
          }
        }
      }
      if (temp.length !== 0) {
        return false;
      }
      return true;
    },
    isSubIndexItem(id, data) {
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].pid) {
          temp.push(1);
        }
      }
      if (temp.length !== 0) {
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
    test(data, id) {
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        if (data.pid === id) {
          temp.push(i); // 找到对应位置
        }
      }
      return temp;
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

