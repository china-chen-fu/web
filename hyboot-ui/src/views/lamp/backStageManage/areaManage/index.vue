<template>
  <div class="page-container">
    <div class="content">
      <div class="table">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="createDialog"
                       v-hasPermi="['chaoyang:lamp:region:add']">新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Upload" @click="sortTree" v-hasPermi="['chaoyang:lamp:region:move']">排序
            </el-button>
          </el-col>
        </el-row>
        <el-table
            v-loading="loading" :data="tableData" style="width: 100%;" border class="customer-table"
            :header-cell-style="{ 'text-align': 'center' }"
            name="table" element-loading-text="加载中..."
            row-key="regionId"
            default-expand-all
        >
          <el-table-column prop="regionName" label="区域名称" min-width="100px"/>
          <el-table-column prop="remark" label="备注" min-width="200px"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="100px">
            <template #default="scope">
              <el-button type="text" icon="Edit" @click="editBtn(scope.row)"
                         v-hasPermi="['chaoyang:lamp:region:edit']">编辑
              </el-button>
              <el-button type="text" icon="Delete" @click="deleteRow(scope.row)"
                         v-hasPermi="['chaoyang:lamp:region:remove']">删除
              </el-button>

            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

    <!-- 新增弹框 -->
    <el-dialog title="新增" v-model="visible.createVisible" append-to-body destroy-on-close
               :before-close="handleAreaClose" width="500px">
      <el-form class="area-form" ref="createDialogRef" :model="form.dialogData" :rules="rules.dialogRules"
               label-width="100px">
        <template v-if="tableData.length">
          <el-form-item label="上级区域" prop="parentId">
            <el-tree-select v-model="form.dialogData.parentId" :data="treeOptions" :props="treeProps"
                            :check-strictly="true" value-key="regionId" style="width: 250px;"></el-tree-select>
          </el-form-item>
        </template>
        <el-form-item label="区域名称" prop="regionName">
          <el-input v-model="form.dialogData.regionName" style="width: 250px;" placeholder="请输入区域名称">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.dialogData.remark" style="width: 250px;" placeholder="请输入备注">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleAreaClose">取消</el-button>
                    <el-button type="primary" @click="createDialogConfirm">确定
                    </el-button>
                </span>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑" v-model="visible.editVisible" append-to-body destroy-on-close
               :before-close="handleAreaClose" width="500px">
      <el-form class="area-form" ref="editDialogRef" :model="form.dialogData" :rules="rules.dialogRules"
               label-width="100px">

        <el-form-item label="区域名称" prop="regionName">
          <el-input v-model="form.dialogData.regionName" style="width: 250px;" placeholder="请输入区域名称">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.dialogData.remark" style="width: 250px;" placeholder="请输入备注">
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleAreaClose">取消</el-button>
                    <el-button type="primary" @click="editDialogConfirm">确定
                    </el-button>
                </span>
      </template>
    </el-dialog>


    <el-dialog title="区域排序" v-model="visible.sortVisible" append-to-body destroy-on-close
               :before-close="handleSortClose" width="500px">
      <el-tree :data="treeData" draggable :props="treeProps" :expand-on-click-node="false" :allow-drop="allowDrop"
               :allow-drag="allowDrag" default-expand-all node-key="regionId" @node-drop="nodeDrop"></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleSortClose">取消</el-button>
          <el-button type="primary" @click="dragConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>


</template>

<script setup>
import {reactive, ref} from "vue";
import {
  listRegionAPI,//列表接口
  getRegionAPI,//查询区域详情
  addRegionAPI,//新增区域
  updateRegionAPI,//编辑区域
  delRegionAPI,//删除区域
  getRegionOptionsAPI, moveTreeAPI,//树的下拉选项
} from "@/api/lamp/region";
import {ElMessage} from 'element-plus'
//是否有显示搜索框
const showSearch = ref(true);
const {proxy} = getCurrentInstance();
const loading = ref(false);

//获得列表数据
const tableData = ref([]);
const getListData = () => {
  loading.value = true;
  tableData.value = []
  listRegionAPI().then((res) => {
    loading.value = false;
    tableData.value = res.rows;
  })
      .finally(() => {
        loading.value = false;
      });
}

//弹窗显示定义
const visible = reactive({
  createVisible: false,
  editVisible: false,
  sortVisible: false
})

//弹窗数据定义
let form = reactive({
  dialogData: {
    parentId: null,
    regionName: null,
    remark: null
  }
})

//弹窗规则
const rules = reactive({
  dialogRules: {
    parentId: [{required: true, message: "请选择上级区域", trigger: "blur"}],
    regionName: [{required: true, message: "请输入区域名称", trigger: "blur"}],
  },
});

const handleAreaClose = () => {
  //关闭弹窗前清空所有数据
  form.dialogData = {
    parentId: null,
    regionName: null,
    remark: null,
  }
  visible.createVisible = false
  visible.editVisible = false
}

//上级区域树
const treeOptions = ref([])
const treeProps = {
  label: 'regionName',
  children: 'children',
  isLeaf: 'leaf',
  id: 'regionId',
  parentId: 'parentId',
  isEdit: false
}

const getTreeOptions = (regionId) => {
  getRegionOptionsAPI(regionId).then((res) => {
    treeOptions.value = res.rows;
  })
}


//新增弹窗打开
const createDialog = () => {
  form.dialogData = {
    parentId: null,
    regionName: null,
    remark: null,
  }
  getTreeOptions(0)
  visible.createVisible = true
}

//新增弹窗提交
const createDialogConfirm = () => {
  //如果列表没有数据 默认parentId为0
  if (!tableData.value.length)
    form.dialogData.parentId = 0
  proxy.$refs["createDialogRef"].validate((valid) => {//校验是否通过
    if (valid) {
      addRegionAPI(form.dialogData).then(res => {
        ElMessage({
          message: '新增数据成功!',
          type: 'success',
        })
        visible.createVisible = false
        getListData()
      }).catch(err => {
        ElMessage({
          message: '服务器异常',
          type: 'error',
        })
      })
    }
  })
}

//排序按钮
const sortTree = () => {
  getTreeDataRequest()
  visible.sortVisible = true;
}
let treeData = ref(null);

//判定节点能不能拖到目标位置
const allowDrop = (draggingNode, dropNode, type) => {
//1  二级菜单拖动
//1.1 二级下面有没有子菜单 能拖拽到所有
  if (dropNode.level == 1) {
    return false
  } else {
    if (draggingNode.level == 2) {
      if (draggingNode.childNodes.length == 0) {
        if (dropNode.level == 3 && type == 'inner') {
          return false
        } else {
          return true
        }

      } else {
        if (type == 'inner') {
          return false
        } else {
          return true
        }
      }
    } else if (draggingNode.level == 3) {
      if (dropNode.level == 3 && type == 'inner') {
        return false
      } else {
        return true
      }
    }
  }


}

const allowDrag = (node) => {
  return true
}

//
const nodeDrop = (draggedNode, dropNode, type, event) => {
  //拖拽结束 改变拖拽节点的parentId
  //treeData 里面进行比对并且修改对应的parentId
  let DraggedNodeRegionId = draggedNode.data.regionId
  updateParentId(DraggedNodeRegionId)

}

//treeData里面的regionId
const updateParentId = (regionId) => {
  if (treeData.value[0].children.length) {
    for (let i = 0, arr1 = treeData.value[0].children; i < arr1.length; i++) {
      if (arr1[i].regionId == regionId) {
        arr1[i].parentId = treeData.value[0].regionId;
        break;
      } else {
        for (let j = 0, arr2 = arr1[i].children; j < arr2.length; j++) {
          if (arr2[j].regionId == regionId) {
            arr2[j].parentId = arr1[i].regionId
            break;
          }
        }
      }
    }
  }

}

const handleSortClose = () => {
  getTreeDataRequest();
  visible.sortVisible = false;
  treeData.value = null;
}

const dragConfirm = () => {
  console.log(treeData.value)
  if (treeData.value) {
    moveTreeAPI(treeData.value).then(res => {
      ElMessage({
        message: '区域位置修改成功!',
        type: 'success',
      })
    }).catch(err => { }).finally(() => {
      visible.sortVisible = false;
      getListData();
    })
  } else {
    visible.sortVisible = false;
  }
}

const getTreeDataRequest = () => {
  listRegionAPI().then(res => {
    treeData.value = res.rows;
  }).catch(e => {
  }).finally(() => {
  })
}


//编辑弹窗数据回显
const editBtn = (row) => {
  form.dialogData = {
    parentId: row.parentId,
    regionName: row.regionName,
    remark: row.remark
  }
  form.dialogData['regionId'] = row.regionId;
  getTreeOptions(row.regionId)
  visible.editVisible = true
}

//编辑弹窗提交
const editDialogConfirm = async () => {
  proxy.$refs["editDialogRef"].validate((valid) => {
    if (valid) {
      updateRegionAPI(form.dialogData).then(res => {
        ElMessage({
          message: '编辑数据成功!',
          type: 'success',
        })
        visible.editVisible = false
        getListData()
      }).catch(err => {
        ElMessage({
          message: '服务器异常',
          type: 'error',
        })
      })
    }
  });
}

//删除按钮
const deleteRow = (row) => {
  proxy.$modal.confirm('是否确认删除？').then(() => delRegionAPI(row.regionId)).then(() => {
    getListData()
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });

}

getListData()
</script>

<style scoped lang='scss'>

</style>