<template>
  <div class="welcome-container">
    <div class="hero-section">
      <div class="logo">
        <div class="robot-wrapper">
    <div class="robot-head">
      <!-- 天线 -->
      <div class="antenna left"></div>
      <div class="antenna right"></div>
      <!-- 头顶装饰 -->
      <div class="head-decoration"></div>
      <!-- 眼睛 -->
      <div class="eye left"></div>
      <div class="eye right"></div>
      <!-- 嘴巴 -->
      <div class="mouth"></div>
    </div>
  </div>
        <h1 class="logo-text">Agent</h1>
        <h1 class="logo-text">GateWay</h1>
      </div>
      
      <p class="subtitle">欢迎使用 AgentGateway RAG仪表盘</p>
      <p class="description">基于llamaindex,提供一站式配置服务</p>
      <p class="description">为后端提供接口，为后端接入RAG而生</p>
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
  /* 容器：居中 + 基础定位 */
    .robot-wrapper {
      width: 200px;
      height: 200px;
      margin: 50px auto;
      position: relative;
    }

    /* 机器人头部轮廓 */
    .robot-head {
      width: 180px;
      height: 160px;
      border: 12px solid #3a445d;
      border-radius: 50% 50% 35% 35%;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background: #fff;
      /* 轻微点头动画 */
      animation: headNod 4s ease-in-out infinite;
    }

    /* 天线（左右各一个） */
    .antenna {
      width: 12px;
      height: 45px;
      background: #3a445d;
      border-radius: 6px;
      position: absolute;
      top: -35px;
    }
    .antenna.left {
      left: 30px;
      transform: rotate(-20deg);
      transform-origin: bottom center;
      animation: antennaShake 3s ease-in-out infinite;
    }
    .antenna.right {
      right: 30px;
      transform: rotate(20deg);
      transform-origin: bottom center;
      animation: antennaShake 3s ease-in-out infinite 0.2s;
    }
    /* 天线顶部圆点 */
    .antenna::after {
      content: "";
      width: 24px;
      height: 24px;
      background: #3a445d;
      border-radius: 50%;
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
    }

    /* 头顶装饰（参考图的V形） */
    .head-decoration {
      width: 80px;
      height: 30px;
      background: #3a445d;
      border-radius: 15px;
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      clip-path: polygon(0% 50%, 50% 0%, 100% 50%);
    }

    /* 眼睛 */
    .eye {
      width: 24px;
      height: 32px;
      background: #3a445d;
      border-radius: 50%;
      position: absolute;
      top: 50px;
    }
    .eye.left {
      left: 45px;
    }
    .eye.right {
      right: 45px;
    }

    /* 嘴巴 */
    .mouth {
      width: 60px;
      height: 24px;
      background: #3a445d;
      border-radius: 12px;
      position: absolute;
      bottom: 35px;
      left: 50%;
      transform: translateX(-50%);
      /* 轻微呼吸动画 */
      animation: mouthBreathe 3s ease-in-out infinite;
    }

    /* 动画定义 */
    /* 1. 头部轻微点头 */
    @keyframes headNod {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-5px); }
    }

    /* 2. 天线轻微晃动 */
    @keyframes antennaShake {
      0%, 100% { transform: rotate(-20deg); }
      50% { transform: rotate(-15deg); }
    }
    .antenna.right {
      animation-name: antennaShakeRight;
    }
    @keyframes antennaShakeRight {
      0%, 100% { transform: rotate(20deg); }
      50% { transform: rotate(15deg); }
    }

    /* 3. 嘴巴呼吸微动 */
    @keyframes mouthBreathe {
      0%, 100% { transform: translateX(-50%) scaleY(1); }
      50% { transform: translateX(-50%) scaleY(0.8); }
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
    align-items: center;
  }

  .logo-text {
    font-size: 120px;
    font-weight: bold;
    background: linear-gradient(45deg, #4facfe, #00f2fe, #9d4edd, #5b86e5); /* 动态渐变动画 */
    background-size: 200% 200%; /* 扩大渐变范围 */
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
      text-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    to {
      text-shadow: 0 8px 16px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(255, 255, 255, 0.5);
    }
  }
</style>
