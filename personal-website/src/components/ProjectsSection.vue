<template>
  <section class="projects" id="projects">
    <h2><i class="fas fa-star"></i> My Projects</h2>
    <p>Check out my latest work and share your feedback!</p>
    
    <div class="projects-grid">
      <!-- Project cards - using v-for with your projects array -->
      <div class="project-card" v-for="project in projects" :key="project.id">
        <div class="project-image" :style="`background-image: url(${project.image})`">
          <div class="project-overlay">
            <a :href="project.link" target="_blank" class="project-link">
              <i class="fas fa-external-link-alt"></i> View Project
            </a>
          </div>
        </div>
        <div class="project-info">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <div class="project-rating" :data-project="project.id">
            <div class="stars">
              <i v-for="n in 5" :key="`project${project.id}-star-${n}`" 
                 :class="[n <= getAverageRating(project.id) ? 'fas' : 'far', 'fa-star']"
                 @click="openRatingModal(project.id, n)"></i>
            </div>
            <span class="rating-count">
              ({{ projectRatings[project.id] ? projectRatings[project.id].length : 0 }} ratings)
            </span>
            <!-- Comments section -->
            <div class="project-comments-container">
              <!-- Comment content here -->
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Rating Modal -->
    <div v-if="showRatingModal" class="modal" :style="{display: showRatingModal ? 'flex' : 'none'}">
      <!-- Modal content here -->
    </div>
    
    <!-- All Comments Modal -->
    <div v-if="showCommentsModal" class="modal" :style="{display: showCommentsModal ? 'flex' : 'none'}">
      <!-- Comments modal content here -->
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();

// State variables
const projectRatings = ref({});
const selectedProject = ref(null);
const selectedRating = ref(0);
const ratingComment = ref('');
const showRatingModal = ref(false);
const showCommentsModal = ref(false);
const isLoading = ref(true);
const errorMessage = ref('');

// Define your projects
const projects = ref([
  {
    id: 1,
    title: "Personal Website",
    description: "A responsive personal website.",
    image: new URL('@/assets/images/proj1.png', import.meta.url).href,
    link: "/"
  },
  {
    id: 2,
    title: "Ramquest",
    description: "A mobile wireframe of Ramquest app.",
    image: new URL('@/assets/images/proj2.png', import.meta.url).href,
    link: "https://www.figma.com/proto/tQESkzv4TdzWyUJZHTJjIK/RAMQUEST-MOBILE-VERSION"
  },
  {
    id: 3,
    title: "Meneshu",
    description: "A responsive restaurant website.",
    image: new URL('@/assets/images/proj3.png', import.meta.url).href,
    link: "https://rheaanne.github.io/Meneshu/home/"
  }
]);

// Your methods would go here - fetchRatings, submitRating, etc.
// These would be similar to your existing methods but using Vue 3 composition API

// Lifecycle hook - fetch ratings when component mounts
onMounted(() => {
  fetchRatings();
});

// Function to fetch ratings
const fetchRatings = async () => {
  // Your existing fetch ratings code but adapted to Vue 3
};

// More methods here
</script>

<style scoped>
  .projects-container {
    background-color: var(--dark-gray);
    padding: 1.5rem;
    border-radius: 12px;
  }

  /* Projects Section */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card {
  background-color: var(--dark-gray);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.project-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.project-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-link {
  background-color: var(--primary-pink);
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 30px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.project-link i {
  font-size: 0.9rem;
}

.project-info {
  padding: 1.5rem;
}

.project-info h3 {
  margin-bottom: 0.8rem;
  color: var(--primary-pink);
}

.project-tech {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-tech span {
  background-color: rgba(255, 105, 180, 0.2);
  color: var(--light-pink);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Project Rating Section */
.project-rating {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.project-rating .stars {
  display: inline-flex;
  margin-right: 0.5rem;
}

/* Star Rating Container */
.stars {
  display: flex;
  gap: 0.3rem;
  cursor: pointer;
}

.stars i {
  cursor: pointer;
  transition: var(--transition);
  color: #ddd;
  transition: color 0.2s;
}

.stars.large {
  font-size: 2rem;
  justify-content: center;
  margin: 1rem 0;
}


.stars i:hover,
.stars i:hover ~ i {
  color: var(--primary-pink);
}

.stars i.fas {
  color: var(--primary-pink);
}

.rating-count {
  color: #888;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

/* Rating Modal */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  overflow: auto;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 500px;
  position: relative;
  animation: modalFadeIn 0.3s;
  border: 1px solid #333;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-50px); }
  to { opacity: 1; transform: translateY(0); }
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
}

.close-modal:hover {
  color: var(--primary-pink);
}

.stars.large {
  font-size: 2rem;
  justify-content: center;
  margin: 1rem 0;
}

#rating-comment {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #444;
  color: var(--white);
  padding: 0.8rem;
  border-radius: 8px;
  margin: 1rem 0;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.rating-btn {
  background-color: var(--primary-pink);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: block;
  margin-left: auto;
  float: right;
}

.rating-btn:hover {
  background-color: var(--dark-pink);
  transform: translateY(-3px);
}

textarea {
  width: 100%;
  min-height: 120px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.8rem;
  color: #fff;
  font-family: inherit;
  resize: vertical;
  margin: 1rem 0;
}

/* Project Comments Styling */
.project-comments-container {
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 0.8rem;
  width: 100%;
}

.comments-heading {
  font-size: 0.9rem;
  color: var(--light-pink);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.project-comments {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

/* Individual Comment Styling */
.comment {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border-left: 3px solid var(--primary-pink);
}

.comment-stars {
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
}

.comment-stars .fas {
  color: var(--primary-pink);
}

.comment-text {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  color: var(--white);
}

.comment-date {
  font-size: 0.8rem;
  color: #888;
  text-align: right;
}

.no-comments {
  color: #888;
  font-style: italic;
  font-size: 0.9rem;
}

.view-more-comments {
  background: none;
  border: none;
  color: var(--primary-pink);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  display: block;
  margin: 0.5rem 0;
}

.view-more-comments:hover {
  color: var(--light-pink);
}

/* Comment modal specific styling */
.comments-modal {
  max-width: 600px;
}

.all-comments {
  max-height: 400px;
  overflow-y: auto;
  margin: 1rem 0;
}

/* Scrollbar styling for comment area */
.project-comments::-webkit-scrollbar {
  width: 5px;
}

.project-comments::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.project-comments::-webkit-scrollbar-thumb {
  background: var(--primary-pink);
  border-radius: 10px;
}
</style>