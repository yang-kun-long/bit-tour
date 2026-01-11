<template>
  <header class="slac-header">
    <div class="logo-area">
      <h1>BIT <span>虚拟导览</span></h1>
    </div>
    <nav class="nav-links">
      <router-link to="/">总览地图</router-link>
      <router-link to="/labs">重点实验室</router-link>
      <router-link to="/stories">思政故事</router-link>
      <router-link to="/activities">实践活动</router-link>
    </nav>
  </header>
</template>

<style scoped>
.slac-header {
  position: fixed; /* 固定在顶部 */
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: #8c1515;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.logo-area h1 {
  font-size: 22px;
  margin: 0;
  font-weight: 700;
}
.logo-area span {
  font-weight: 300;
  opacity: 0.9;
  font-size: 18px;
  margin-left: 8px;
}

.nav-links {
  margin-left: auto;
  display: flex;
  gap: 24px;
}
.nav-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 15px;
  padding: 5px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}
.nav-links a:hover {
  color: white;
}

/* Vue Router 自动激活的类名 */
.router-link-active {
  color: white !important;
  font-weight: 700;
  border-bottom-color: white !important;
}
</style>
