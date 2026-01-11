<template>
  <div class="map-container">
    <NavBar />

    <div id="map"></div>

    <transition name="slide-up">
      <div v-if="selectedLocation" class="info-card">
        <button class="close-btn" @click="closePanel">×</button>
        <div class="card-content">
          <div class="card-image">
            <img :src="selectedLocation?.images?.[0]" alt="地点图片" />
            <div class="tag" :class="getTypeClass(selectedLocation.type)">
              {{ getTypeName(selectedLocation.type) }}
            </div>
          </div>
          <div class="card-text">
            <h2>{{ selectedLocation.name }}</h2>
            <p class="description">{{ selectedLocation.desc }}</p>
            <div class="action-area">
              <button class="enter-btn">进入全景展示 →</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router' // 引入路由钩子，用于接收参数
import NavBar from '@/components/NavBar.vue' // 引入导航组件
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import locationsData from '@/data/locations.json'

const route = useRoute() // 获取当前路由信息
const map = ref(null)
const selectedLocation = ref(null)

// --- 地图边界设置 (北理工中关村校区) ---
const corner1 = L.latLng(39.956, 116.309) // 西南角
const corner2 = L.latLng(39.967, 116.324) // 东北角
const bounds = L.latLngBounds(corner1, corner2)

// --- 辅助函数 ---
const getTypeName = (type) => {
  const map = { lab: '重点实验室', story: '思政故事', activity: '实践活动' }
  return map[type] || '其他'
}

const getTypeClass = (type) => {
  const map = { lab: 'bg-red', story: 'bg-blue', activity: 'bg-green' }
  return map[type] || ''
}

const createCustomIcon = (iconEmoji, type) => {
  let colorClass = ''
  if (type === 'lab') colorClass = 'icon-red'
  else if (type === 'story') colorClass = 'icon-blue'
  else colorClass = 'icon-green'

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="marker-pin ${colorClass}">${iconEmoji}</div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -25],
  })
}

const closePanel = () => {
  selectedLocation.value = null
}

onMounted(() => {
  // 1. 初始化地图
  map.value = L.map('map', {
    minZoom: 17,
    maxZoom: 22,
    zoomControl: false,
    attributionControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
  }).setView([39.959, 116.3165], 17)

  // 2. 加载瓦片
  L.tileLayer('/tiles/{z}/{x}/{y}.png', {
    minZoom: 17,
    maxNativeZoom: 19,
    maxZoom: 22,
    tms: false,
    bounds: bounds,
  }).addTo(map.value)

  // 3. 渲染所有标记
  locationsData.forEach((loc) => {
    const marker = L.marker([loc.lat, loc.lng], {
      icon: createCustomIcon(loc.icon, loc.type),
    }).addTo(map.value)

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e)
      selectedLocation.value = loc
      // 点击 marker 时，平滑移动地图中心
      map.value.flyTo([loc.lat + 0.0005, loc.lng], 18, { duration: 0.8 })
    })
  })

  // 4. 点击空白处关闭卡片
  map.value.on('click', () => {
    selectedLocation.value = null
  })

  // --- [核心功能] 处理从列表页跳转过来的请求 ---
  // 检查 URL 是否包含 ?focus=xxx 参数
  const focusId = route.query.focus
  if (focusId) {
    // 查找对应的数据
    // 注意：URL参数通常是字符串，所以用 == 而不是 ===，或者转 Number
    const targetLoc = locationsData.find((l) => l.id == focusId)

    if (targetLoc) {
      // 稍微延迟执行，等待地图完全初始化
      setTimeout(() => {
        // 1. 选中该地点（触发底部卡片弹出）
        selectedLocation.value = targetLoc
        // 2. 地图飞向该地点
        map.value.flyTo([targetLoc.lat + 0.0005, targetLoc.lng], 18, { duration: 1.5 })
      }, 300)
    }
  }
})

onUnmounted(() => {
  if (map.value) map.value.remove()
})
</script>

<style>
/* --- 全局布局 --- */
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', sans-serif;
}

#map {
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #e5e5e5;
  /* 因为顶部有固定导航栏，地图稍微向下一点，或者保持全屏被遮挡也没关系 */
}

/* --- Leaflet Marker 自定义样式 --- */
.marker-pin {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 4px solid #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}
.marker-pin:hover {
  transform: scale(1.2);
}

/* 颜色变体 */
.icon-red {
  border-color: #d32f2f;
  color: #d32f2f;
}
.marker-pin:hover.icon-red {
  background: #d32f2f;
  color: white;
}

.icon-blue {
  border-color: #1976d2;
  color: #1976d2;
}
.marker-pin:hover.icon-blue {
  background: #1976d2;
  color: white;
}

.icon-green {
  border-color: #388e3c;
  color: #388e3c;
}
.marker-pin:hover.icon-green {
  background: #388e3c;
  color: white;
}

/* --- 底部详情卡片样式 --- */
.info-card {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 200; /* 必须高于地图 */
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  z-index: 2;
}

.card-content {
  display: flex;
  height: 220px;
}

.card-image {
  width: 40%;
  position: relative;
  overflow: hidden;
  background: #eee;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.info-card:hover .card-image img {
  transform: scale(1.05);
}

.tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
.bg-red {
  background: #d32f2f;
}
.bg-blue {
  background: #1976d2;
}
.bg-green {
  background: #388e3c;
}

.card-text {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-text h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}
.description {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.action-area {
  margin-top: 15px;
}
.enter-btn {
  background: #8c1515;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}
.enter-btn:hover {
  background: #600000;
}

/* --- Vue 动画效果 --- */
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translate(-50%, 0);
  opacity: 1;
}
</style>
