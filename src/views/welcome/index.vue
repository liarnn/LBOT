<template>
  <div class="welcome-container">
    <div class="hero-section">
      <div class="logo">
        <h1 class="logo-text">L</h1>
        <h1 class="logo-text">B</h1>
        <h1 class="logo-text">O</h1>
        <h1 class="logo-text">T</h1>
      </div>
      <p class="subtitle">欢迎使用 LBOT 机器人管理系统</p>
      <p class="description">高效、智能的机器人配置与管理平台</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue";
</script>

<style scoped>
  .welcome-container {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
  }

  

  .hero-section {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
  }

  .logo {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .logo-text {
    font-size: 120px;
    font-weight: bold;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    animation: glow 2s ease-in-out infinite alternate;
  }

  .subtitle {
    font-size: 36px;
    font-weight: 300;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .description {
    font-size: 18px;
    font-weight: 200;
    opacity: 0.9;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  @keyframes glow {
    from {
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    to {
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(255, 255, 255, 0.5);
    }
  }
</style>
