<template>
  <div class="page-container">
    <NavBar />

    <div class="content-body">
      <h2 class="page-title">重点实验室展示</h2>
      <p class="page-intro">这里汇聚了北京理工大学最前沿的科研力量与创新成果。</p>

      <div class="grid-container">
        <div v-for="item in labList" :key="item.id" class="grid-card">
          <div class="card-img-wrapper">
            <img :src="item.images[0]" :alt="item.name" />
            <div class="card-tag">实验室</div>
          </div>
          <div class="card-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.desc }}</p>
            <div class="card-actions">
              <button @click="goToMap(item.id)" class="locate-btn">📍 在地图上查看</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import locationsData from '@/data/locations.json'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选出所有实验室数据
const labList = computed(() => {
  return locationsData.filter((item) => item.type === 'lab')
})

const goToMap = (id) => {
  // 跳转到首页，并带上查询参数 ?focus=1
  router.push({ path: '/', query: { focus: id } })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 60px; /* 给固定导航栏留位置 */
}

.content-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  color: #8c1515;
  margin-bottom: 10px;
  font-size: 32px;
}
.page-intro {
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.grid-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}
.grid-card:hover {
  transform: translateY(-5px);
}

.card-img-wrapper {
  height: 200px;
  position: relative;
}
.card-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #8c1515;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.card-info {
  padding: 20px;
}
.card-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}
.card-info p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  height: 44px; /* 限制高度 */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.locate-btn {
  width: 100%;
  padding: 10px;
  background: white;
  border: 1px solid #8c1515;
  color: #8c1515;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}
.locate-btn:hover {
  background: #8c1515;
  color: white;
}
</style>
