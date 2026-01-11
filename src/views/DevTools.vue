<template>
  <div class="dev-container">
    <header class="dev-header">
      <div class="brand">🛠️ BIT 地图开发工具箱</div>
      <div class="instructions">点击地图任意位置获取坐标</div>
    </header>

    <div class="content-wrapper">
      <div id="dev-map"></div>

      <div class="sidebar">
        <h3>📍 新增点位信息</h3>

        <div class="form-group">
          <label>名称 (Name):</label>
          <input v-model="form.name" type="text" placeholder="例如：新实验楼" />
        </div>

        <div class="form-group">
          <label>类型 (Type):</label>
          <select v-model="form.type">
            <option value="lab">重点实验室 (lab)</option>
            <option value="story">思政故事 (story)</option>
            <option value="activity">实践活动 (activity)</option>
          </select>
        </div>

        <div class="coords-display">
          <div class="coord-item">
            <span>Lat:</span> <strong>{{ form.lat || '-' }}</strong>
          </div>
          <div class="coord-item">
            <span>Lng:</span> <strong>{{ form.lng || '-' }}</strong>
          </div>
        </div>

        <div class="code-block">
          <label>JSON 代码片段 (点击复制):</label>
          <textarea readonly ref="jsonOutput" :value="generateJSON()"></textarea>
          <button class="copy-btn" @click="copyToClipboard">📋 复制到剪贴板</button>
        </div>

        <div class="existing-points">
          <h4>当前已有点位 ({{ locationsData.length }})</h4>
          <ul>
            <li v-for="loc in locationsData" :key="loc.id">
              {{ loc.name }}
              <span class="tiny">({{ loc.lat.toFixed(4) }}, {{ loc.lng.toFixed(4) }})</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import locationsData from '@/data/locations.json'

const map = ref(null)
const tempMarker = ref(null)
const jsonOutput = ref(null)

// 表单数据
const form = reactive({
  id: Date.now(), // 临时生成一个 ID
  name: '',
  lat: '',
  lng: '',
  type: 'lab',
  icon: '📍', // 默认图标
  desc: '请输入描述...',
  images: ['https://via.placeholder.com/600x400'],
})

// 根据类型自动切换 emoji
const updateIcon = () => {
  if (form.type === 'lab') form.icon = '🔬'
  else if (form.type === 'story') form.icon = '📖'
  else form.icon = '🚩'
}

// 生成 JSON 字符串
const generateJSON = () => {
  if (!form.lat) return '// 请在地图上点击...'

  updateIcon() // 确保图标对应类型

  const obj = {
    id: locationsData.length + 1, // 简单预估一个ID
    name: form.name || '未命名',
    lat: Number(form.lat),
    lng: Number(form.lng),
    type: form.type,
    icon: form.icon,
    desc: form.desc,
    images: form.images,
  }
  return JSON.stringify(obj, null, 2) + ',' // 加个逗号方便粘贴
}

const copyToClipboard = () => {
  if (!jsonOutput.value) return
  jsonOutput.value.select()
  document.execCommand('copy')
  alert('已复制！请去 locations.json 粘贴。')
}

// 边界配置 (与主地图保持一致)
const corner1 = L.latLng(39.956, 116.309)
const corner2 = L.latLng(39.967, 116.324)
const bounds = L.latLngBounds(corner1, corner2)

onMounted(() => {
  map.value = L.map('dev-map', {
    minZoom: 16, // 开发时允许缩放更自由一点
    maxZoom: 22,
    zoomControl: true, // 开发模式显示缩放控件
    attributionControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: 0.8, // 开发时稍微松一点，防止找不到边
  }).setView([39.959, 116.3165], 17)

  L.tileLayer('/tiles/{z}/{x}/{y}.png', {
    minZoom: 15,
    maxNativeZoom: 19,
    maxZoom: 22,
    tms: false,
    bounds: bounds,
  }).addTo(map.value)

  // 1. 渲染现有的点 (灰色)，作为参考
  locationsData.forEach((loc) => {
    L.circleMarker([loc.lat, loc.lng], {
      color: '#999',
      fillColor: '#ccc',
      fillOpacity: 0.5,
      radius: 6,
    })
      .bindPopup(`已存在: ${loc.name}`)
      .addTo(map.value)
  })

  // 2. 点击地图事件
  map.value.on('click', (e) => {
    const { lat, lng } = e.latlng

    // 更新数据
    form.lat = lat.toFixed(6) // 保留6位小数足够了
    form.lng = lng.toFixed(6)

    // 移动或创建标记
    if (tempMarker.value) {
      tempMarker.value.setLatLng([lat, lng])
    } else {
      tempMarker.value = L.marker([lat, lng], {
        // 使用一个醒目的红色标记
        icon: L.divIcon({
          className: 'dev-marker',
          html: '🎯',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(map.value)
    }
  })
})

onUnmounted(() => {
  if (map.value) map.value.remove()
})
</script>

<style scoped>
.dev-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: sans-serif;
}

.dev-header {
  height: 50px;
  background: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.brand {
  font-weight: bold;
  font-size: 18px;
}
.instructions {
  font-size: 14px;
  color: #aaa;
}

.content-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

#dev-map {
  flex: 1;
  background: #e5e5e5;
  cursor: crosshair; /* 十字准星光标，方便选点 */
}

.sidebar {
  width: 350px;
  background: #f4f4f4;
  border-left: 1px solid #ddd;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}

h3 {
  margin: 0 0 10px 0;
  color: #333;
  border-bottom: 2px solid #8c1515;
  padding-bottom: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-group label {
  font-size: 12px;
  font-weight: bold;
  color: #666;
}
.form-group input,
.form-group select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.coords-display {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  display: flex;
  gap: 10px;
}
.coord-item {
  flex: 1;
  font-size: 13px;
}

.code-block textarea {
  width: 100%;
  height: 150px;
  font-family: monospace;
  font-size: 12px;
  padding: 10px;
  border: 1px solid #333;
  background: #222;
  color: #0f0; /* 黑客风 */
  resize: vertical;
}

.copy-btn {
  width: 100%;
  padding: 10px;
  background: #8c1515;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 4px;
}
.copy-btn:hover {
  background: #600000;
}

.existing-points {
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
.existing-points ul {
  list-style: none;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
}
.existing-points li {
  font-size: 12px;
  padding: 4px 0;
  border-bottom: 1px dashed #eee;
}
.tiny {
  color: #999;
  margin-left: 5px;
}

/* 深度选择器用于 Leaflet 的自定义图标 */
:deep(.dev-marker) {
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: bounce 0.5s;
}

@keyframes bounce {
  0% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
