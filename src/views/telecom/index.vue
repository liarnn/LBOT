<template>
  <div class="chat-window">
    <!-- 聊天消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- 欢迎语（初始显示） -->
      <div class="message-item robot-message" v-if="messages.length === 0">
        <img class="avatar" src="src/assets/icon/机器人.png" alt="机器人" />
        <div class="message-content">
          <div class="message-bubble">
            你好！我是 LBOT 智能助手，有什么可以帮你的？
          </div>
          <div class="message-time">{{ formatTime(new Date()) }}</div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div
        class="message-item"
        :class="{
          'user-message': msg.role === 'user',
          'robot-message': msg.role === 'robot',
        }"
        v-for="(msg, index) in messages"
        :key="index"
      >
        <!-- 头像：用户在右，机器人在左 -->
        <img
          class="avatar"
          :src="
            msg.role === 'user'
              ? 'src/assets/icon/个人.png'
              : 'src/assets/icon/机器人.png'
          "
          :alt="msg.role === 'user' ? '用户' : '机器人'"
        />
        <div class="message-content">
          <div class="message-bubble">{{ msg.content }}</div>
          <div class="message-time">{{ formatTime(msg.time) }}</div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-area">
      <el-input
        v-model="inputContent"
        type="textarea"
        :rows="3"
        placeholder="请输入消息..."
        @keyup.enter="handleSendMessage"
        class="message-input"
        resize="none"
      ></el-input>
      <el-button
        type="primary"
        @click="handleSendMessage"
        class="send-btn"
        :disabled="!inputContent.trim()"
      >
        发送
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from "vue";
  import { ElMessage } from "element-plus";
  import axios from "axios";
  import { getChatURL } from "@/api/telecom";
  import service from "@/api/request";
  // 定义消息类型
  interface ChatMessage {
    role: "user" | "robot"; // 角色：用户/机器人
    content: string; // 消息内容
    time: Date; // 发送时间
  }

  // 消息列表
  const messages = ref<ChatMessage[]>([]);
  // 输入框内容
  const inputContent = ref("");
  // 消息容器Ref（用于滚动到底部）
  const messagesContainer = ref<HTMLDivElement | null>(null);

  // 发送消息
  const handleSendMessage = () => {
    // 空消息不发送
    if (!inputContent.value.trim()) {
      ElMessage.warning("请输入消息内容！");
      return;
    }

    // 1. 添加用户消息
    const userMsg: ChatMessage = {
      role: "user",
      content: inputContent.value.trim(),
      time: new Date(),
    };
    messages.value.push(userMsg);

    // 2. 清空输入框
    inputContent.value = "";

    // 3. 模拟机器人回复（实际项目中替换为接口请求）
    const jsonMsg: any = {
          content: userMsg.content,
        }
    setTimeout(() => {
    const  res = service.post(getChatURL(),jsonMsg)
      res.then((res) => { 
        const robotMsg: ChatMessage = {
          role: "robot",
          content: res.data,
          time: new Date(),
        };
        messages.value.push(robotMsg);
      });
      // axios
      //   .post("http://127.0.0.1:80/api/chat", {
      //     content: `${userMsg.content}`,
      //   })
      //   .then((res) => {
      //     const robotMsg: ChatMessage = {
      //       role: "robot",
      //       content: res.data.data,
      //       time: new Date(),
      //     };
      //     messages.value.push(robotMsg);
      //   })
      //   .catch((e) => {
      //     console.log("请求大模型失败：" + e);
      //     if (e.response) {
      //       alert("接口错误：" + e.response.data.detail);
      //     } else if (e.request) {
      //       alert("连接失败：请检查后端服务是否运行在 127.0.0.1:80");
      //     } else {
      //       alert("请求配置错误：" + e.message);
      //     }
      //   });
    }, 800);
  };

  // 格式化时间：YYYY-MM-DD HH:mm:ss
  const formatTime = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  // 监听消息列表变化，自动滚动到最新消息
  const scrollToLatestMessage = () => {
    if (!messagesContainer.value) return;

    requestAnimationFrame(() => {
      const container = messagesContainer.value as HTMLElement;
      const messagesEls =
        container.querySelectorAll<HTMLElement>(".message-item");
      const last = messagesEls[messagesEls.length - 1];
      if (last) {
        last.scrollIntoView({ behavior: "smooth", block: "end" });
      } else {
        container.scrollTop = container.scrollHeight;
      }
    });
  };

  watch(messages, async () => {
    await nextTick(); // 等待 DOM 更新完成
    scrollToLatestMessage();
  });
</script>

<style scoped>
  /* 聊天窗口整体容器 */
  .chat-window {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    min-height: 0;
  }

  /* 消息列表区域 */
  .chat-messages {
    flex: 1;
    min-height: 0;
    padding: 20px;
    overflow-y: auto;
    background-color: #f9f9f9;
    scroll-behavior: smooth;
  }

  /* 单个消息项 */
  .message-item {
    display: flex;
    margin-bottom: 16px;
    align-items: flex-start;
  }

  /* 用户消息：右对齐 */
  .user-message {
    flex-direction: row-reverse;
  }

  /* 头像样式 */
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 12px;
    flex-shrink: 0; /* 防止头像被压缩 */
  }

  /* 消息内容容器 */
  .message-content {
    max-width: 70%; /* 消息最大宽度，避免过长 */
  }

  /* 消息气泡 */
  .message-bubble {
    padding: 10px 16px;
    border-radius: 12px;
    line-height: 1.5;
    word-wrap: break-word; /* 自动换行 */
  }

  /* 机器人消息气泡：浅灰色 */
  .robot-message .message-bubble {
    background-color: #e5e5e5;
    color: #333;
    border-top-left-radius: 4px; /* 左侧尖角 */
  }

  /* 用户消息气泡：蓝色 */
  .user-message .message-bubble {
    background-color: #409eff;
    color: #fff;
    border-top-right-radius: 4px; /* 右侧尖角 */
  }

  /* 消息时间 */
  .message-time {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
    text-align: right; /* 用户消息时间右对齐 */
  }

  .robot-message .message-time {
    text-align: left; /* 机器人消息时间左对齐 */
  }

  /* 输入区域 */
  .chat-input-area {
    padding: 16px;
    border-top: 1px solid #e5e5e5;
    display: flex;
    gap: 12px;
    background-color: #fff;
  }

  /* 输入框 */
  .message-input {
    flex: 1;
  }

  /* 发送按钮 */
  .send-btn {
    flex-shrink: 0;
    height: 100%;
    align-self: flex-end;
  }
</style>
