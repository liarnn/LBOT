<template>
  <div class="docs-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="showUploadModal">
        <el-icon><Upload /></el-icon>上传文档
      </el-button>
      <el-button
        :disabled="selection.length === 0"
        @click="handleBatchDelete"
        class="batch-delete-btn"
      >
        <el-icon><Delete /></el-icon>批量删除
      </el-button>
    </div>

    <!-- 文档列表表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="index" label="序号" width="80" align="center">
        <template #default="{ $index }">
          {{ ($page.current - 1) * $page.size + $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文档标题" min-width="200">
        <template #default="{ row }">
          <el-link type="primary" @click="previewDocument(row)">
            {{ row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">{{
            getStatusText(row.status)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="uploadTime"
        label="上传时间"
        width="180"
        align="center"
      >
        <template #default="{ row }">
          {{ formatDate(row.uploadTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="最后更新时间"
        width="180"
        align="center"
        sortable
      >
        <template #default="{ row }">
          {{ formatDate(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="loadDocument(row.id)">加载</el-button>
          <el-button size="small" @click="previewDocument(row)">预览</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 上传文档表单模态框 -->
    <el-dialog v-model="uploadFormVisible" title="上传文档" width="500px">
      <el-form
        :model="uploadForm"
        :rules="uploadRules"
        ref="uploadFormRef"
        label-width="100px"
      >
        <el-form-item label="文档标题" prop="title">
          <el-input v-model="uploadForm.title" placeholder="请输入文档标题" />
        </el-form-item>
        <el-form-item label="文档文件" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            :accept="'.pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx'"
            :limit="1"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传PDF, Word, Excel, PPT, TXT格式的文档，且不超过50MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="submitting"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 预览文档模态框 -->
    <el-dialog
      v-model="previewVisible"
      :title="previewDocTitle"
      width="80%"
      top="5vh"
    >
      <div v-if="previewContent">
        <el-input
          v-model="previewContent"
          type="textarea"
          :rows="15"
          placeholder="文档内容"
          readonly
        />
        <div style="margin-top: 10px; text-align: right">
          <el-button @click="previewVisible = false">关闭</el-button>
          <el-button type="primary" @click="saveDocumentChanges"
            >保存修改</el-button
          >
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无预览内容" />
      </div>
    </el-dialog>

    <!-- 上传文档表单模态框 -->
    <el-dialog v-model="uploadFormVisible" title="上传文档" width="500px">
      <el-form
        :model="uploadForm"
        :rules="uploadRules"
        ref="uploadFormRef"
        label-width="100px"
      >
        <el-form-item label="文档标题" prop="title">
          <el-input v-model="uploadForm.title" placeholder="请输入文档标题" />
        </el-form-item>
        <el-form-item label="文档文件" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            :accept="'.pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx'"
            :limit="1"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传PDF, Word, Excel, PPT, TXT格式的文档，且不超过50MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="submitting"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 预览文档模态框 -->
    <el-dialog
      v-model="previewVisible"
      :title="previewDocTitle"
      width="80%"
      top="5vh"
    >
      <div v-if="previewContent">
        <el-input
          v-model="previewContent"
          type="textarea"
          :rows="15"
          placeholder="文档内容"
          readonly
        />
        <div style="margin-top: 10px; text-align: right">
          <el-button @click="previewVisible = false">关闭</el-button>
          <el-button type="primary" @click="saveDocumentChanges"
            >保存修改</el-button
          >
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无预览内容" />
      </div>
    </el-dialog>

    <!-- 上传文档表单模态框 -->
    <el-dialog v-model="uploadFormVisible" title="上传文档" width="500px">
      <el-form
        :model="uploadForm"
        :rules="uploadRules"
        ref="uploadFormRef"
        label-width="100px"
      >
        <el-form-item label="文档标题" prop="title">
          <el-input v-model="uploadForm.title" placeholder="请输入文档标题" />
        </el-form-item>
        <el-form-item label="文档文件" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            :accept="'.pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx'"
            :limit="1"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传PDF, Word, Excel, PPT, TXT格式的文档，且不超过50MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="submitting"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 预览文档模态框 -->
    <el-dialog
      v-model="previewVisible"
      :title="previewDocTitle"
      width="80%"
      top="5vh"
    >
      <div v-if="previewContent">
        <el-input
          v-model="previewContent"
          type="textarea"
          :rows="15"
          placeholder="文档内容"
          readonly
        />
        <div style="margin-top: 10px; text-align: right">
          <el-button @click="previewVisible = false">关闭</el-button>
          <el-button type="primary" @click="saveDocumentChanges"
            >保存修改</el-button
          >
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无预览内容" />
      </div>
    </el-dialog>

    <!-- 上传文档表单模态框 -->
    <el-dialog v-model="uploadFormVisible" title="上传文档" width="500px">
      <el-form
        :model="uploadForm"
        :rules="uploadRules"
        ref="uploadFormRef"
        label-width="100px"
      >
        <el-form-item label="文档标题" prop="title">
          <el-input v-model="uploadForm.title" placeholder="请输入文档标题" />
        </el-form-item>
        <el-form-item label="文档文件" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            :accept="'.pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx'"
            :limit="1"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传PDF, Word, Excel, PPT, TXT格式的文档，且不超过50MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="submitting"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 预览文档模态框 -->
    <el-dialog
      v-model="previewVisible"
      :title="previewDocTitle"
      width="80%"
      top="5vh"
    >
      <div v-if="previewContent">
        <el-input
          v-model="previewContent"
          type="textarea"
          :rows="15"
          placeholder="文档内容"
          readonly
        />
        <div style="margin-top: 10px; text-align: right">
          <el-button @click="previewVisible = false">关闭</el-button>
          <el-button type="primary" @click="saveDocumentChanges"
            >保存修改</el-button
          >
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无预览内容" />
      </div>
    </el-dialog>

    <!-- 上传文档表单模态框 -->
    <el-dialog v-model="uploadFormVisible" title="上传文档" width="500px">
      <el-form
        :model="uploadForm"
        :rules="uploadRules"
        ref="uploadFormRef"
        label-width="100px"
      >
        <el-form-item label="文档标题" prop="title">
          <el-input v-model="uploadForm.title" placeholder="请输入文档标题" />
        </el-form-item>
        <el-form-item label="文档文件" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            :accept="'.pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx'"
            :limit="1"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传PDF, Word, Excel, PPT, TXT格式的文档，且不超过50MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="submitting"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 预览文档模态框 -->
    <el-dialog
      v-model="previewVisible"
      :title="previewDocTitle"
      width="80%"
      top="5vh"
    >
      <div v-if="previewContent">
        <el-input
          v-model="previewContent"
          type="textarea"
          :rows="15"
          placeholder="文档内容"
          readonly
        />
        <div style="margin-top: 10px; text-align: right">
          <el-button @click="previewVisible = false">关闭</el-button>
          <el-button type="primary" @click="saveDocumentChanges"
            >保存修改</el-button
          >
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无预览内容" />
      </div>
    </el-dialog>

    <!-- 上传进度条 -->
    <el-dialog
      v-model="progressVisible"
      title="上传进度"
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-progress
        :percentage="uploadPercentage"
        :status="uploading ? null : 'success'"
      />
      <p style="text-align: center; margin-top: 10px">
        {{ uploading ? "正在上传..." : "上传完成" }}
      </p>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue";
  import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
  import { Upload, Delete } from "@element-plus/icons-vue";
  import axios from "axios";

  // 定义文档类型
  interface Document {
    id: number;
    title: string;
    status: "loaded" | "unloaded"; // 状态：已加载/未加载
    uploadTime: string;
    updateTime: string;
  }

  // 响应式数据
  const loading = ref(false);
  const uploading = ref(false);
  const submitting = ref(false);
  const progressVisible = ref(false);
  const uploadPercentage = ref(0);
  const selection = ref<Document[]>([]);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const tableData = ref<Document[]>([]);

  // 上传表单相关
  const uploadFormVisible = ref(false);
  const uploadForm = ref({
    title: "",
    file: null as File | null,
  });
  const uploadFormRef = ref();
  const uploadRef = ref();
  const fileList = ref<any[]>([]);

  // 预览相关
  const previewVisible = ref(false);
  const previewDocTitle = ref("");
  const previewContent = ref("");
  const currentPreviewId = ref<number | null>(null);

  // 上传规则
  const uploadRules = {
    title: [
      { required: true, message: "请输入文档标题", trigger: "blur" },
      { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" },
    ],
    file: [
      { required: true, message: "请选择要上传的文件", trigger: "change" },
    ],
  };

  // API配置
  const apiUrl = "/api/documents";
  const uploadUrl = `${apiUrl}/upload`;
  const uploadHeaders = {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("zh-CN") +
      " " +
      date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  // 获取文档列表
  const fetchDocuments = async () => {
    loading.value = true;
    try {
      const response = await axios.get(apiUrl, {
        params: {
          page: currentPage.value,
          size: pageSize.value,
        },
      });

      // 假设API返回格式为 { data: [], total: number }
      tableData.value = response.data.data || [];
      total.value = response.data.total || 0;
    } catch (error) {
      console.error("获取文档列表失败:", error);
      ElMessage.error("获取文档列表失败");
      tableData.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  };

  // 处理表格多选
  const handleSelectionChange = (val: Document[]) => {
    selection.value = val;
  };

  // 处理分页大小变化
  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    fetchDocuments();
  };

  // 处理当前页变化
  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    fetchDocuments();
  };

  // 显示上传表单
  const showUploadModal = () => {
    uploadFormVisible.value = true;
    uploadForm.value = { title: "", file: null };
    fileList.value = [];
  };

  // 处理文件选择
  const handleFileChange = (file: any) => {
    uploadForm.value.file = file.raw;
  };

  // 提交上传
  const submitUpload = async () => {
    if (!uploadForm.value.file) {
      ElMessage.error("请选择要上传的文件");
      return;
    }

    // 首先上传文档标题到后端
    try {
      submitting.value = true;

      // 上传文档标题
      const docResponse = await axios.post(apiUrl, {
        title: uploadForm.value.title,
      });

      const docId = docResponse.data.id;

      // 上传文档文件
      const formData = new FormData();
      formData.append("file", uploadForm.value.file);

      // 显示上传进度
      uploadPercentage.value = 0;
      progressVisible.value = true;
      uploading.value = true;

      await axios.post(`${apiUrl}/${docId}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...uploadHeaders,
        },
        onUploadProgress: (event) => {
          uploadPercentage.value = Math.round(
            (event.loaded * 100) / event.total!,
          );
        },
      });

      ElNotification({
        title: "成功",
        message: "文档上传成功",
        type: "success",
      });

      // 关闭模态框并重置
      uploadFormVisible.value = false;
      fileList.value = [];

      // 重新获取文档列表
      fetchDocuments();
    } catch (error) {
      console.error("上传失败:", error);
      ElMessage.error("文档上传失败");
    } finally {
      submitting.value = false;
      uploading.value = false;
      progressVisible.value = false;
    }
  };

  // 加载文档（向量化处理）
  const loadDocument = async (id: number) => {
    try {
      await ElMessageBox.confirm(
        "确认加载该文档？系统将对该文档进行向量化处理，以便后续检索和分析。",
        "加载文档",
        {
          confirmButtonText: "确认加载",
          cancelButtonText: "取消",
          type: "info",
        },
      );

      // 发送加载请求到后端
      await axios.post(`${apiUrl}/${id}/load`);

      ElMessage.success("文档加载请求已发送，正在后台处理...");

      // 重新获取文档列表以更新状态
      fetchDocuments();
    } catch (error) {
      if (error !== "cancel") {
        console.error("加载文档失败:", error);
        ElMessage.error("加载文档失败");
      }
    }
  };

  // 预览文档
  const previewDocument = async (row: Document) => {
    try {
      // 获取文档内容
      const response = await axios.get(`${apiUrl}/${row.id}/content`);

      previewContent.value = response.data.content || "";
      previewDocTitle.value = `预览 - ${row.title}`;
      currentPreviewId.value = row.id;
      previewVisible.value = true;
    } catch (error) {
      console.error("获取文档内容失败:", error);
      ElMessage.error("获取文档内容失败");
    }
  };

  // 保存文档修改
  const saveDocumentChanges = async () => {
    if (!currentPreviewId.value) return;

    try {
      await axios.put(`${apiUrl}/${currentPreviewId.value}/content`, {
        content: previewContent.value,
      });

      ElMessage.success("文档修改已保存");
      previewVisible.value = false;
    } catch (error) {
      console.error("保存文档修改失败:", error);
      ElMessage.error("保存文档修改失败");
    }
  };

  // 获取状态标签类型
  const getStatusTagType = (status: "loaded" | "unloaded") => {
    return status === "loaded" ? "success" : "info";
  };

  // 获取状态文本
  const getStatusText = (status: "loaded" | "unloaded") => {
    return status === "loaded" ? "已加载" : "未加载";
  };

  // 删除文档
  const handleDelete = async (id: number) => {
    try {
      await ElMessageBox.confirm(
        "确认删除该文档？此操作不可恢复！",
        "删除文档",
        {
          confirmButtonText: "确认删除",
          cancelButtonText: "取消",
          type: "warning",
        },
      );

      await axios.delete(`${apiUrl}/${id}`);
      ElMessage.success("删除成功");
      // 重新获取文档列表
      fetchDocuments();
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除失败:", error);
        ElMessage.error("删除失败");
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    try {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selection.value.length} 个文档？此操作不可恢复！`,
        "批量删除",
        {
          confirmButtonText: "确认删除",
          cancelButtonText: "取消",
          type: "warning",
        },
      );

      // 提取选中文档的ID
      const ids = selection.value.map((item) => item.id);

      // 发送批量删除请求
      await axios.delete(apiUrl, {
        data: { ids },
      });

      ElMessage.success("批量删除成功");
      // 清空选择并重新获取文档列表
      selection.value = [];
      fetchDocuments();
    } catch (error) {
      if (error !== "cancel") {
        console.error("批量删除失败:", error);
        ElMessage.error("批量删除失败");
      }
    }
  };

  // 初始化数据
  onMounted(() => {
    fetchDocuments();
  });
</script>

<style scoped>
  .docs-container {
    padding: 20px;
  }

  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .batch-delete-btn {
    margin-left: auto;
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .preview-content {
    max-height: 500px;
    overflow-y: auto;
  }

  @media screen and (max-width: 768px) {
    .toolbar {
      flex-direction: column;
    }

    .batch-delete-btn {
      margin-left: 0;
    }

    .el-table {
      min-width: 800px;
    }
  }
</style>
