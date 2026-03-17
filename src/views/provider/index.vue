<template>
  <div class="provider-page">
    <el-card class="main-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h2>模型提供商管理</h2>
        </div>
      </template>
      <div class="actions">
        <el-button type="primary" icon="Plus" @click="addModel"
          >新增模型</el-button
        >
        <el-button
          type="danger"
          icon="Delete"
          @click="batchDelete"
          :disabled="selectedModels.length === 0"
          >批量删除</el-button
        >
      </div>
      <el-table
        :data="models"
        @selection-change="handleSelectionChange"
        stripe
        border
        style="width: 100%; margin-bottom: 20px"
        :header-cell-style="{ background: '#f5f5f5', color: '#606266' }"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="50">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="模型名称"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="modelType"
          label="模型类型"
          width="100"
        ></el-table-column>
        <el-table-column label="API-KEY" min-width="150">
          <template #default="scope">
            <span @click="copyApiKey(scope.row.apiKey)" class="api-key-text">
              {{ maskApiKey(scope.row.apiKey) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="baseUrl"
          label="BaseURL"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="prompt"
          label="提示词"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="160"
        ></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <div class="action-buttons">
              <el-button
                size="small"
                type="primary"
                icon="Edit"
                @click="editModel(scope.row)"
                >修改</el-button
              >
              <el-button
                size="small"
                type="danger"
                icon="Delete"
                @click="deleteModel(scope.row.id)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <el-dialog
      :title="isEdit ? '修改模型' : '新增模型'"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="currentModel"
        label-width="120px"
        :rules="formRules"
        ref="formRef"
      >
        <el-form-item label="模型名称" prop="name">
          <el-input
            v-model="currentModel.name"
            placeholder="请输入模型名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="API-KEY" prop="apiKey">
          <el-input
            v-model="currentModel.apiKey"
            placeholder="请输入API-KEY"
            type="password"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="BaseURL" prop="baseUrl">
          <el-input
            v-model="currentModel.baseUrl"
            placeholder="请输入BaseURL"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="模型类型" prop="modelType">
          <el-select
            v-model="currentModel.modelType"
            placeholder="请选择模型类型"
            clearable
          >
            <el-option label="LLM" value="llm"></el-option>
            <el-option label="Embedding" value="embedding"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提示词">
          <el-input
            v-model="currentModel.prompt"
            type="textarea"
            :rows="4"
            placeholder="请输入提示词（可选）"
            resize="vertical"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveModel" :loading="saving"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue";
  import {
    ElTable,
    ElTableColumn,
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElMessage,
    ElPagination,
    ElSelect,
    ElOption,
  } from "element-plus";

  import service from "@/api/request";
  import {
    getModelsURL,
    updateModelURL,
    batchDeleteModelsURL,
    deleteModelURL,
    addModelURL,
  } from "@/api/model";

  interface Model {
    id: number;
    name: string;
    apiKey: string;
    baseUrl: string;
    modelType: string;
    prompt: string | null;
    createTime: string;
    updateTime: string;
  }

  const models = ref<Model[]>([]);
  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const currentModel = reactive<Model>({
    id: 0,
    name: "",
    apiKey: "",
    baseUrl: "",
    modelType: "",
    prompt: "",
    createTime: "",
    updateTime: "",
  });
  const selectedModels = ref<number[]>([]);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const saving = ref(false);
  const formRef = ref();

  const formRules = {
    name: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
    apiKey: [{ required: true, message: "请输入API-KEY", trigger: "blur" }],
    baseUrl: [{ required: true, message: "请输入BaseURL", trigger: "blur" }],
    modelType: [
      { required: true, message: "请选择模型类型", trigger: "change" },
    ],
  };

  onMounted(() => {
    fetchModels();
  });

  async function fetchModels() {
    try {
      const res = await service.get(getModelsURL(), {
        params: {
          page: currentPage.value,
          size: pageSize.value,
        },
      });
      models.value = res.data.map((item: any) => ({
        id: item.id,
        name: item.model_name,
        apiKey: item.api_key,
        baseUrl: item.base_url,
        modelType: item.model_type,
        prompt: item.prompt,
        createTime: item.create_time,
        updateTime: item.update_time,
      }));
      total.value = res.total;
    } catch (e) {
      ElMessage.error("获取模型列表失败");
    }
  }

  function addModel() {
    isEdit.value = false;
    Object.assign(currentModel, {
      id: 0,
      name: "",
      apiKey: "",
      baseUrl: "",
      modelType: "",
      prompt: "",
      createTime: "",
      updateTime: "",
    });
    dialogVisible.value = true;
  }

  function editModel(model: Model) {
    isEdit.value = true;
    Object.assign(currentModel, model);
    dialogVisible.value = true;
  }

  async function saveModel() {
    if (!formRef.value) return;
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid) return;

    saving.value = true;
    try {
      const data = {
        model_name: currentModel.name,
        api_key: currentModel.apiKey,
        base_url: currentModel.baseUrl,
        model_type: currentModel.modelType,
        prompt: currentModel.prompt,
      };
      if (isEdit.value) {
        data.id = currentModel.id;
        await service.put(updateModelURL(), data);
        ElMessage.success("修改成功");
      } else {
        await service.post(addModelURL(), data);
        ElMessage.success("新增成功");
      }
      dialogVisible.value = false;
      fetchModels();
    } catch (e) {
      ElMessage.error("保存失败");
    } finally {
      saving.value = false;
    }
  }

  async function deleteModel(id: number) {
    try {
      await service.delete(deleteModelURL(id.toString()));
      ElMessage.success("删除成功");
      fetchModels();
    } catch (e) {
      ElMessage.error("删除失败");
    }
  }

  async function batchDelete() {
    if (selectedModels.value.length === 0) {
      ElMessage.warning("请选择要删除的模型");
      return;
    }
    try {
      await service.delete(batchDeleteModelsURL(), {
        data: { ids: selectedModels.value },
      });
      ElMessage.success("批量删除成功");
      fetchModels();
      selectedModels.value = [];
    } catch (e) {
      ElMessage.error("批量删除失败");
    }
  }

  function handleSelectionChange(val: Model[]) {
    selectedModels.value = val.map((m) => m.id);
  }

  function handleSizeChange(val: number) {
    pageSize.value = val;
    fetchModels();
  }

  function handleCurrentChange(val: number) {
    currentPage.value = val;
    fetchModels();
  }

  function maskApiKey(apiKey: string): string {
    if (apiKey.length <= 8) return apiKey;
    return (
      apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length - 4)
    );
  }

  function copyApiKey(apiKey: string) {
    navigator.clipboard
      .writeText(apiKey)
      .then(() => {
        ElMessage.success("API-KEY 已复制到剪贴板");
      })
      .catch(() => {
        ElMessage.error("复制失败");
      });
  }
</script>

<style scoped>
  .provider-page {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
  }

  .main-card {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .card-header {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #303133;
  }

  .actions {
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
  }

  .el-table {
    border-radius: 8px;
    overflow: hidden;
  }

  .api-key-text {
    cursor: pointer;
    color: #409eff;
    transition: color 0.3s;
  }

  .api-key-text:hover {
    color: #66b1ff;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }

  .el-dialog {
    border-radius: 12px;
  }

  .dialog-footer {
    text-align: right;
  }
</style>
