<template>
  <div class="push-main">
    <div class="push-content">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" v-hasPermi="['fire:sms:add']" @click="addPushMember">新增</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="tableLoading" element-loading-text="加载中..." :data="tableData" border style="width: 100%; margin-top: 20px;" :header-cell-style="{ 'text-align': 'center' }">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column v-for="(item, index) in column" :key="index" :label="item.label" :width="item.width" :prop="item.prop" :align="item.align">
          <template #default="scope">
            <div v-if="item.label == '是否推送'">
              <el-switch v-model="scope.row.enableSms" @change="pushChange(scope.row)"></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-popconfirm @confirm="deleteMember(scope.row)" confirm-button-text="确定" cancel-button-text="取消" :title="'确定删除' + scope.row.userName + '吗?'">
              <template #reference>
                <el-button v-hasPermi="['fire:sms:remove']" type="text" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination class="pagination" v-show="queryParams.total > 0" :total="queryParams.total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getTableList" />

    <el-dialog title="新增推送人员" v-model="visible" append-to-body destroy-on-close :before-close="dialogClose" width="500px">
      <el-form ref="dialogRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名:" prop="username">
          <el-input v-model="form.username" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phonenumber">
          <el-input v-model="form.phonenumber" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="是否推送:" prop="enable_sms">
          <el-switch v-model="form.enable_sms" style="width: 250px;"></el-switch>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" style="width: 250px;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="dialogConfirm(dialogRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import pushService from '@/api/fire/push';
import { ElMessage, ElMessageBox } from 'element-plus'
import { checkPhonenumber } from '@/utils/validate'
const column = [
  {
    label: '姓名',
    prop: 'userName',
    width: '',
    align: 'left'
  },
  {
    label: '手机号',
    prop: 'phoneNumber',
    width: '110',
    align: 'left'
  },
  {
    label: '是否推送',
    prop: 'enableSms',
    width: '110',
    align: 'center'
  },
  {
    label: '备注',
    prop: 'remark',
    width: '',
    align: 'left'
  },
]

const dialogRef = ref()
let dialogLoading = ref(false)
let tableLoading = ref(false)

let tableData = ref()

let queryParams = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10
})

let visible = ref(false)
let form = reactive({
  username: '',
  phonenumber: '',
  enable_sms: false,
  remark: ''
})

const phonenumberRule = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号！'))
  } else {
    if (checkPhonenumber(value)) {
      callback()
    } else {
      callback(new Error('该手机号格式不规范！'))
    }
  }
}
const rules = {
  username: [
    { required: true, message: '请输入姓名！', trigger: 'blur' }
  ],
  phonenumber: [
    { validator: phonenumberRule, trigger: 'blur', required: true, }
  ],
  enable_sms: [
    { required: true, message: '', trigger: 'blur' }
  ],
}

onBeforeMount(() => {
  getTableList()
})

function addPushMember () {
  visible.value = true;
}

function pushChange (row) {
  row.enableSms = row.enableSms ? '1' : '0';
  pushService.editPusher(row).then(res => {
    ElMessage({
      type: 'success',
      message: '修改成功'
    })
  }).finally(() => {
    getTableList();
  })
}

function deleteMember (row) {
  pushService.deletePusher(row.smsId).then(res => {
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })
  }).finally(() => {
    getTableList();
  })
}

function getTableList () {
  pushService.getPusher().then(res => {
    res.rows.forEach((item, index) => {
      res.rows[index]['enableSms'] = res.rows[index].enableSms == 1 ? true : false;
    })
    tableData.value = res.rows;
    queryParams.total = res.total;
  })
}

function dialogClose () {
  visible.value = false;
  form.username = '';
  form.phonenumber = '';
  form.enable_sms = false;
  form.remark = '';
}

async function dialogConfirm (formEl) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        userName: form.username,
        phoneNumber: form.phonenumber,
        enableSms: form.enable_sms ? '1' : '0',
        remark: form.remark
      }
      dialogLoading.value = true;
      pushService.addPusher(params).then(res => {
        ElMessage({
          type: 'success',
          message: '新增成功!'
        })
      }).finally(() => {
        dialogLoading.value = false;
        dialogClose();
        getTableList();
      })
    }
  })
}

</script>

<style lang="scss" scoped>
.push-main {
  padding: 24px 24px 0 24px;
  width: 100%;
  height: calc(100vh - 70px);

  .push-content {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 24px 24px 0 24px;
  }
}
</style>