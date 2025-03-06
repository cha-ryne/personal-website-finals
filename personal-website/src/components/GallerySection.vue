<template>
  <section class="gallery" id="gallery">
    <h2><i class="fas fa-images"></i> Gallery</h2>
    <div class="gallery-container">
      <div class="my-isolated-gallery-container">
        <!-- Image grid with unique class names -->
        <div class="my-gallery-grid">
          <div 
            v-for="(image, index) in images" 
            :key="index"
            class="my-gallery-item"
            @click="openGallery(index)"
          >
            <img :src="image" :alt="'Gallery image ' + (index + 1)" />
          </div>
        </div>
        
        <!-- Custom gallery overlay with unique class -->
        <div v-if="showGallery" class="my-gallery-overlay">
          <img :src="images[currentIndex]" class="my-gallery-large-img" />
          <div class="my-gallery-close" @click="closeGallery">×</div>
          <div class="my-gallery-prev" @click="prevImage">❮</div>
          <div class="my-gallery-next" @click="nextImage">❯</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const images = ref([
  new URL('@/assets/images/gong.jpg', import.meta.url).href,
  new URL('@/assets/images/Sakamoto.jpg', import.meta.url).href,
  new URL('@/assets/images/bp.jpg', import.meta.url).href,
  new URL('@/assets/images/Manga.jpg', import.meta.url).href,
  new URL('@/assets/images/pirates.jpg', import.meta.url).href,
  'https://preview.redd.it/new-wallpaper-for-my-pc-they-have-no-right-being-this-cool-v0-3l2k9lpytrcc1.jpeg?auto=webp&s=84fbc9925af40466495e023248afa37305b232fd',
  new URL('@/assets/images/Chman.jpg', import.meta.url).href,
  new URL('@/assets/images/fish.jpg', import.meta.url).href
]);

const currentIndex = ref(0);
const showGallery = ref(false);

function openGallery(index) {
  currentIndex.value = index;
  showGallery.value = true;
  document.body.style.overflow = 'hidden'; // Prevent scrolling when gallery is open
}

function closeGallery() {
  showGallery.value = false;
  document.body.style.overflow = ''; // Re-enable scrolling
}

function prevImage() {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
}

function handleKeydown(event) {
  if (!showGallery.value) return;
  
  if (event.key === 'ArrowLeft') {
    prevImage();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'Escape') {
    closeGallery();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.gallery {
  padding: 4rem 2rem;
  background-color: #121212;
  text-align: center;
}

.gallery h2 {
  color: white;
  margin-bottom: 3rem;
  font-size: 2rem;
}

.gallery h2 i {
  color: #ff69b4;
  margin-right: 0.5rem;
}

.my-isolated-gallery-container {
  max-width: 1200px;
  margin: 0 auto;
}

.my-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.my-gallery-item {
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  transition: transform 0.3s;
}

.my-gallery-item:hover {
  transform: scale(1.03);
}

.my-gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.my-gallery-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.my-gallery-large-img {
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
}

.my-gallery-close,
.my-gallery-prev,
.my-gallery-next {
  position: absolute;
  cursor: pointer;
  color: white;
  font-size: 2rem;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  transition: all 0.3s;
}

.my-gallery-close {
  top: 20px;
  right: 30px;
}

.my-gallery-prev {
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
}

.my-gallery-next {
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
}

.my-gallery-close:hover,
.my-gallery-prev:hover,
.my-gallery-next:hover {
  color: #ff69b4;
  transform: translateY(-50%) scale(1.2);
}

.my-gallery-close:hover {
  transform: scale(1.2);
}
</style>