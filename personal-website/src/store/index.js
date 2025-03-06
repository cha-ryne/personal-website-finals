import { createStore } from 'vuex';
import axios from 'axios';

// Check if it's likely an iPad Safari browser
const isIPadSafari = /iPad/.test(navigator.userAgent) || 
                   (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document);

// API base URL from environment variables or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://charyn.pythonanywhere.com/api';

// Create API client with correct URL based on device
const apiUrl = isIPadSafari ? 
  `https://corsproxy.io/?${encodeURIComponent(API_BASE_URL)}` : 
  API_BASE_URL;

export default createStore({
  state: {
    projectRatings: {},
    userId: localStorage.getItem('ratingUserId') || 
      ('user_' + Math.random().toString(36).substring(2, 9)),
    selectedProject: null,
    selectedRating: 0,
    ratingComment: '',
    showRatingModal: false,
    showCommentsModal: false,
    isLoading: false,
    errorMessage: ''
  },
  
  mutations: {
    SET_PROJECT_RATINGS(state, ratings) {
      state.projectRatings = ratings;
    },
    SET_SELECTED_PROJECT(state, projectId) {
      state.selectedProject = projectId;
    },
    SET_SELECTED_RATING(state, stars) {
      state.selectedRating = stars;
    },
    SET_RATING_COMMENT(state, comment) {
      state.ratingComment = comment;
    },
    SHOW_RATING_MODAL(state, show) {
      state.showRatingModal = show;
    },
    SHOW_COMMENTS_MODAL(state, show) {
      state.showCommentsModal = show;
    },
    SET_LOADING(state, loading) {
      state.isLoading = loading;
    },
    SET_ERROR(state, error) {
      state.errorMessage = error;
    }
  },
  
  actions: {
    initUserId({ state }) {
      localStorage.setItem('ratingUserId', state.userId);
    },
    
    async fetchRatings({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', '');
      
      try {
        const response = await axios.get(`${apiUrl}/ratings`);
        const data = response.data;
        
        // Group ratings by project ID
        const ratings = {};
        data.forEach(rating => {
          const projectId = parseInt(rating.project_id);
          if (!ratings[projectId]) {
            ratings[projectId] = [];
          }
          ratings[projectId].push(rating);
        });
        
        commit('SET_PROJECT_RATINGS', ratings);
      } catch (error) {
        console.error('Error fetching ratings:', error);
        commit('SET_ERROR', 'Unable to load ratings. Please try again later.');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async submitRating({ state, commit, dispatch }) {
      if (!state.selectedRating) {
        return { success: false, message: 'Please select a rating by clicking on the stars' };
      }
      
      commit('SET_LOADING', true);
      
      try {
        const ratingData = {
          project_id: state.selectedProject,
          user_id: state.userId,
          stars: state.selectedRating,
          comment: state.ratingComment
        };
        
        await axios.post(`${apiUrl}/ratings`, ratingData);
        
        // Refresh ratings
        await dispatch('fetchRatings');
        
        // Reset and close modal
        commit('SET_SELECTED_PROJECT', null);
        commit('SET_SELECTED_RATING', 0);
        commit('SET_RATING_COMMENT', '');
        commit('SHOW_RATING_MODAL', false);
        
        return { success: true };
      } catch (error) {
        console.error('Error submitting rating:', error);
        commit('SET_ERROR', 'Failed to submit rating. Please try again later.');
        return { 
          success: false, 
          message: error.response?.data?.message || 'Network error. Please try again.' 
        };
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    openRatingModal({ commit }, { projectId, stars = 0 }) {
      commit('SET_SELECTED_PROJECT', parseInt(projectId));
      commit('SET_SELECTED_RATING', parseInt(stars));
      commit('SHOW_RATING_MODAL', true);
    },
    
    closeRatingModal({ commit }) {
      commit('SHOW_RATING_MODAL', false);
      commit('SET_SELECTED_PROJECT', null);
      commit('SET_SELECTED_RATING', 0);
      commit('SET_RATING_COMMENT', '');
    },
    
    showAllComments({ commit }, projectId) {
      commit('SET_SELECTED_PROJECT', parseInt(projectId));
      commit('SHOW_COMMENTS_MODAL', true);
    },
    
    closeCommentsModal({ commit }) {
      commit('SHOW_COMMENTS_MODAL', false);
      commit('SET_SELECTED_PROJECT', null);
    }
  },
  
  getters: {
    getAverageRating: (state) => (projectId) => {
      projectId = parseInt(projectId);
      if (!state.projectRatings[projectId] || state.projectRatings[projectId].length === 0) {
        return 0;
      }
      
      const totalStars = state.projectRatings[projectId].reduce((sum, rating) => sum + rating.stars, 0);
      return Math.round(totalStars / state.projectRatings[projectId].length);
    },
    
    commentsWithText: (state) => (projectId) => {
      projectId = parseInt(projectId);
      if (!state.projectRatings[projectId]) return [];
      
      return state.projectRatings[projectId].filter(
        rating => rating.comment && rating.comment.trim() !== ''
      );
    },
    
    getTopComments: (state, getters) => (projectId) => {
      const comments = getters.commentsWithText(projectId);
      return comments.slice(0, 3);
    },
    
    getAllComments: (state) => () => {
      if (!state.selectedProject || !state.projectRatings[state.selectedProject]) {
        return [];
      }
      return state.projectRatings[state.selectedProject].filter(
        rating => rating.comment && rating.comment.trim() !== ''
      );
    }
  }
});