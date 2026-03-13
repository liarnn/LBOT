<template>
  <div class="common-layout">
    <el-container class="layout-container-demo" style="height: calc(100vh - 32px)">
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu router :default-active="route.path" :default-openeds="['/config']">
          <el-menu-item index="/welcome"><img class="layoutic" src="src\assets\icon\icon_欢迎模式.png">欢迎</el-menu-item>
          <el-menu-item index="/robot"><img class="layoutic" src="src\assets\icon\机器人.png">机器人</el-menu-item>
          <el-menu-item index="/provider"><img class="layoutic" src="src\assets\icon\搜索商家.png">模型提供商</el-menu-item>
          <el-menu-item index="/telecom"><img class="layoutic" src="src\assets\icon\电话.png">测试联通</el-menu-item>

          <el-sub-menu index="/config">
            <template #title>
              <img class="layoutic" src="src\assets\icon\配置文件.png">配置文件
            </template>

            <el-menu-item index="/config/basic"><img class="layoutic" src="src\assets\icon\普通配置.png" alt="">普通配置</el-menu-item>
            <el-menu-item index="/config/advanced"><img class="layoutic" src="src\assets\icon\高级配置.png">高级配置</el-menu-item>
            <el-menu-item index="/config/reserved"><img class="layoutic" src=""></img>预留</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/plugin">
              <template #title><img class="layoutic" src="src\assets\icon\插件.png">插件</template>
              <el-menu-item index="/plugin/skills"><img class="layoutic" src="src\assets\icon\职业技能鉴定.png">skills</el-menu-item>
            </el-sub-menu>

          <el-menu-item index="/reserved"><img class="layoutic" src="src\assets\icon\文档.png">预留</el-menu-item>
          <el-menu-item index="/settings"><el-icon><Setting /></el-icon>设置</el-menu-item>
          <el-menu-item index="/docs"><img class="layoutic" src="src\assets\icon\文档.png">文档</el-menu-item>
        </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        
        <el-header style="text-align: right; font-size: 12px" >
          <div class="header-content">
            <div class="header-left">
              <img class="header-logo" src="src\assets\AI 机器人.png" alt="logo">
            </div>
            <div class="header-right">
              <el-button class="user-btn" type="info" plain @click="handleUserProfile">
                <img class="layoutic" src="src\assets\icon\个人.png" alt="用户">
                个人中心
              </el-button>
            </div>
          </div>
          
        </el-header>
        <el-main style="background-image: url('src/assets/icon/机器人聊天.png');
    background-repeat: no-repeat;
    background-size: auto 90%;
    background-position: center;">
           <RouterView />
        </el-main>

        <el-footer
          style="text-align: center; font-size: 14px; padding-top: 10px"
        >
          made in cduL.
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { RouterView, useRoute } from "vue-router";
  import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";

  const route = useRoute();
</script>

<style scoped>
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 150%;
    padding: 0 24px;
    background: linear-gradient(135deg, #f4aaaa, #eadbde);
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .header-logo {
    margin: 70px;
    height: 70px;
    object-fit: contain;
  }

  .user-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .user-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .layoutic {
    width: 30px;
    height: 30px;
    margin-right: 8px;
  }
  .common-layout {
    background: linear-gradient(135deg, #fefefe, #fff5f7);
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }

  .layout-container-demo {
    background: #ffffff;
    height: 100%;
    border-radius: 14px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .layout-container-demo .el-aside {
    background: #ffffff;
    border-right: 1px solid rgba(0, 0, 0, 0.08);
  }

  .layout-container-demo .el-menu {
    border-right: none;
    background-color: transparent;
  }

  .layout-container-demo .el-menu-item,
  .layout-container-demo .el-sub-menu__title {
    color: rgba(0, 0, 0, 0.75);
    font-weight: 500;
  }

  .layout-container-demo .el-menu-item.is-active,
  .layout-container-demo .el-menu-item:hover,
  .layout-container-demo .el-sub-menu__title:hover {
    color: #e60012;
    background-color: rgba(230, 0, 18, 0.08);
  }

  .layout-container-demo .el-header {
    background: transparent;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 14px 20px;
  }

  .layout-container-demo .toolbar span {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.65);
  }

  .layout-container-demo .el-main {
    padding: 24px;
    background: linear-gradient(135deg, #fefefe, #fff5f7);
  }

  .layout-container-demo .el-footer {
    background: transparent;
    padding: 16px 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
  }

  .layout-container-demo .el-footer span {
    font-weight: 600;
  }
</style>
