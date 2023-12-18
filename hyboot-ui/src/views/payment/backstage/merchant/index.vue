<template>
  <div class="page-container">
    <div class="content">

      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="摊位名称" prop="stallName">
            <el-input v-model="queryParams.stallName" placeholder="请输入摊位名称" clearable style="width: 240px" @keyup.enter="getListData" />
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="queryParams.contacts" placeholder="请输入联系人" clearable style="width: 240px" @keyup.enter="getListData" />
          </el-form-item>
          <el-form-item label="手机号" prop="phonenumber">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号" clearable style="width: 240px" @keyup.enter="getListData" />
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" clearable style="width: 240px" @keyup.enter="getListData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getListData" v-hasPermi="['chaoyang:business:query']">搜索</el-button>
            <el-button icon="Refresh" @click="clear" v-hasPermi="['chaoyang:business:query']">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table">
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getListData"></right-toolbar>
        </el-row>
        <el-table :data="tableData" border class="customer-table" style="width: 100%" :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading">
          <el-table-column type="index" label="序号" width="60" fixed align="center" />
          <el-table-column v-for="item in columns" :key="item" :prop="item.prop" :label="item.label" :fixed="item.fixed" :align="item.align" :min-width="item.minWidth" :width="item.width"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['chaoyang:business:admin:edit']">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination class="pagination" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getListData" />

      </div>
      <el-dialog title="编辑" v-model="dialogOpen" width="400px">
        <el-form ref="diaref" :model="upload" :rules="rules" label-width="80px">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="upload.contacts" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="手机号" prop="phonenumber">
            <el-input v-model="upload.phonenumber" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="upload.idCard" placeholder="请输入身份证号" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="upload.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm()">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getList, uploadData } from "@/api/backstage/merchant";
import { validIDCard } from '@/utils/validate'
const { proxy } = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(true);
const searchType = ref(undefined);
const searchValue = ref("");
const typeOption = ref([
  { label: "摊位名称", value: "stallName" },
  { label: "联系人", value: "contacts" },
  { label: "手机号", value: "phonenumber" },
  { label: "身份证号", value: "idCard" },
]);
let tableData = ref([]);
let columns = ref([
  {
    prop: "phonenumber",
    label: "手机号",
    align: 'left',
    width: '110',
    minWidth: '110'
  },
  {
    prop: "stallName",
    label: "摊位名称",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "contacts",
    label: "联系人",
    align: 'left',
    width: '100',
    minWidth: ''
  },
  {
    prop: "idCard",
    label: "身份证号",
    align: 'left',
    width: '',
    minWidth: '160'
  },
  {
    prop: "remark",
    label: "备注",
    align: 'left',
    width: '',
    minWidth: '120'
  },
]);
const total = ref(0);
const dialogOpen = ref(false);
let upload = reactive({});
const validIDCardRules = (rule, value, callback) => {
  if (value) {
    if (!validIDCard(value)) {
      callback(new Error('请输入合法的身份证'))
    }
  }
  return true
}
const rules = ref({
  contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  phonenumber: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
    {
      pattern:
        /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
      message: "请输入正确的手机号码",
    },
  ],
  idCard: [{ message: "请输入合法的身份证", validator: validIDCardRules, trigger: ["blur", 'change'] }]
});



const queryParams = ref({
  stallName: "",
  contacts: "",
  phonenumber: "",
  idCard: "",
  pageSize: 10,
  pageNum: 1,
});

const clear = () => {
  queryParams.value = {
    stallName: "",
    contacts: "",
    phonenumber: "",
    idCard: "",
    pageSize: 10,
    pageNum: 1,
  }
  getListData()
}

function getListData () {
  loading.value = true;
  tableData.value = [];
  getList(queryParams.value)
    .then((res) => {
      tableData.value = res.rows;
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
}
//换页
function handleSizeChange (number) {
  pageSize.value = number;
  getListData();
}
function handleCurrentChange (number) {
  currentPage.value = number;
  getListData();
}
//编辑
function submitForm () {
  proxy.$refs["diaref"].validate((valid) => {
    if (valid) {
      uploadData(upload).then((res) => {
        proxy.$modal.msgSuccess("修改成功");
        dialogOpen.value = false;
        getListData();
      });
    }
  });
}
/** 取消按钮 */
function cancel () {
  dialogOpen.value = false;
  reset();
}
/** 表单重置 */
function reset () {
  upload.value = {
    businessId: "",
    contacts: "",
    idCard: "",
    phonenumber: "",
    stallName: "",
    remark: "",
  };
  proxy.resetForm("dictRef");
}
function handleUpdate (row) {
  dialogOpen.value = true;
  upload.businessId = row.businessId;
  upload.phonenumber = row.phonenumber;
  upload.contacts = row.contacts;
  upload.idCard = row.idCard;
  upload.remark = row.remark;
}

getListData();
</script>

<style scoped lang="scss">

</style>
