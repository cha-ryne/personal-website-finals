
  // Projects rating system
  document.addEventListener('DOMContentLoaded', function() {
    // Load ratings from localStorage or initialize empty
    let ratings = JSON.parse(localStorage.getItem('projectRatings')) || {};
    
    // Generate a user ID for this session
    const userId = localStorage.getItem('ratingUserId') || 
      ('user_' + Math.random().toString(36).substring(2, 9));
    localStorage.setItem('ratingUserId', userId);
    
    // Initialize ratings object
    [1, 2, 3].forEach(projectId => {
      if (!ratings[projectId]) {
        ratings[projectId] = [];
      }
      updateStarsDisplay(projectId);
      updateCommentsDisplay(projectId);
    });
    
    // Variables for modal
    const modal = document.getElementById('rating-modal');
    const closeBtn = document.querySelector('.close-modal');
    const submitBtn = document.getElementById('submit-rating');
    const modalStars = document.querySelectorAll('#modal-stars i');
    let currentProjectId = null;
    let selectedRating = 0;
    
    // Add click event to star ratings
    document.querySelectorAll('.project-rating .stars i').forEach(star => {
      star.addEventListener('click', function() {
        const projectId = this.closest('.project-rating').dataset.project;
        currentProjectId = projectId;
        selectedRating = parseInt(this.dataset.value);
        
        // Open modal
        modal.style.display = 'flex';
        
        // Reset modal stars
        modalStars.forEach(s => s.className = 'far fa-star');
        
        // Fill stars up to selected value
        modalStars.forEach(s => {
          if (parseInt(s.dataset.value) <= selectedRating) {
            s.className = 'fas fa-star';
          }
        });
      });
    });
    
    // Modal stars click event
    modalStars.forEach(star => {
      star.addEventListener('click', function() {
        selectedRating = parseInt(this.dataset.value);
        
        // Update stars in modal
        modalStars.forEach(s => {
          if (parseInt(s.dataset.value) <= selectedRating) {
            s.className = 'fas fa-star';
          } else {
            s.className = 'far fa-star';
          }
        });
      });
    });
    
    // Close modal when clicking the × button
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Submit rating
    submitBtn.addEventListener('click', function() {
      if (selectedRating === 0) {
        alert('Please select a rating');
        return;
      }
      
      const comment = document.getElementById('rating-comment').value;
      
      // Check if user has already rated this project
      const existingRatingIndex = ratings[currentProjectId].findIndex(r => r.userId === userId);
      
      if (existingRatingIndex !== -1) {
        // Update existing rating
        ratings[currentProjectId][existingRatingIndex] = {
          userId,
          stars: selectedRating,
          comment,
          date: new Date().toISOString()
        };
      } else {
        // Add new rating
        ratings[currentProjectId].push({
          userId,
          stars: selectedRating,
          comment,
          date: new Date().toISOString()
        });
      }
      
      // Save to localStorage
      localStorage.setItem('projectRatings', JSON.stringify(ratings));
      
      // Update stars display
      updateStarsDisplay(currentProjectId);

      // Update comments display
    updateCommentsDisplay(currentProjectId);
      
      // Close modal and reset
      modal.style.display = 'none';
      document.getElementById('rating-comment').value = '';
      selectedRating = 0;
    });
    
    // Function to update star display based on ratings
    function updateStarsDisplay(projectId) {
      const projectRatings = ratings[projectId] || [];
      const ratingContainer = document.querySelector(`.project-rating[data-project="${projectId}"]`);
      
      if (ratingContainer) {
        // Calculate average rating
        let totalStars = 0;
        projectRatings.forEach(r => totalStars += r.stars);
        const averageRating = projectRatings.length > 0 ? totalStars / projectRatings.length : 0;
        
        // Update stars
        const stars = ratingContainer.querySelectorAll('.stars i');
        stars.forEach((star, index) => {
          if (index < Math.round(averageRating)) {
            star.className = 'fas fa-star';
          } else {
            star.className = 'far fa-star';
          }
        });
        
        // Update rating count
        const ratingCount = ratingContainer.querySelector('.rating-count');
        ratingCount.textContent = `(${projectRatings.length} ${projectRatings.length === 1 ? 'rating' : 'ratings'})`;
      }
    }
    // Add this new function to display comments
  function updateCommentsDisplay(projectId) {
    const projectRatings = ratings[projectId] || [];
    const ratingContainer = document.querySelector(`.project-rating[data-project="${projectId}"]`);
    
    if (ratingContainer) {
      // Find the comments container for this project
      const projectCard = ratingContainer.closest('.project-card');
      const commentsContainer = projectCard.querySelector('.project-comments');
      
      // Clear existing comments
      commentsContainer.innerHTML = '';
      
      // Get comments with text content
      const commentsWithText = projectRatings.filter(rating => rating.comment && rating.comment.trim() !== '');
      
      if (commentsWithText.length === 0) {
        // No comments yet
        commentsContainer.innerHTML = '<p class="no-comments">No feedback yet. Be the first to comment!</p>';
        return;
      }
      
      // Sort comments by date (newest first)
      commentsWithText.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Display comments (limit to 3 most recent)
      const recentComments = commentsWithText.slice(0, 3);
      recentComments.forEach(rating => {
        const commentDate = new Date(rating.date);
        const formattedDate = commentDate.toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        });
        
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        commentEl.innerHTML = `
          <div class="comment-stars">
            ${Array(5).fill().map((_, i) => 
              `<i class="${i < rating.stars ? 'fas' : 'far'} fa-star"></i>`
            ).join('')}
          </div>
          <p class="comment-text">${escapeHTML(rating.comment)}</p>
          <p class="comment-date">${formattedDate}</p>
        `;
        commentsContainer.appendChild(commentEl);
      });
      
      // Add "View more" link if there are additional comments
      if (commentsWithText.length > 3) {
        const viewMoreLink = document.createElement('button');
        viewMoreLink.className = 'view-more-comments';
        viewMoreLink.textContent = `View ${commentsWithText.length - 3} more comments`;
        viewMoreLink.addEventListener('click', function() {
          showAllComments(projectId, commentsWithText);
        });
        commentsContainer.appendChild(viewMoreLink);
      }
    }
  }
  
  // Helper function to escape HTML and prevent XSS
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }
  
  // Function to show all comments in a modal
  function showAllComments(projectId, comments) {
    // Create a modal for all comments
    const allCommentsModal = document.createElement('div');
    allCommentsModal.className = 'modal';
    allCommentsModal.style.display = 'flex';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content comments-modal';
    
    // Add modal header
    modalContent.innerHTML = `
      <span class="close-modal">&times;</span>
      <h3>All Feedback for Project ${projectId}</h3>
    `;
    
    // Add all comments
    const commentsContainer = document.createElement('div');
    commentsContainer.className = 'all-comments';
    
    comments.forEach(rating => {
      const commentDate = new Date(rating.date);
      const formattedDate = commentDate.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
      
      const commentEl = document.createElement('div');
      commentEl.className = 'comment';
      commentEl.innerHTML = `
        <div class="comment-stars">
          ${Array(5).fill().map((_, i) => 
            `<i class="${i < rating.stars ? 'fas' : 'far'} fa-star"></i>`
          ).join('')}
        </div>
        <p class="comment-text">${escapeHTML(rating.comment)}</p>
        <p class="comment-date">${formattedDate}</p>
      `;
      commentsContainer.appendChild(commentEl);
    });
    
    modalContent.appendChild(commentsContainer);
    allCommentsModal.appendChild(modalContent);
    document.body.appendChild(allCommentsModal);
    
    // Close functionality
    const closeBtn = allCommentsModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
      document.body.removeChild(allCommentsModal);
    });
    
    window.addEventListener('click', function(event) {
      if (event.target === allCommentsModal) {
        document.body.removeChild(allCommentsModal);
      }
    });
  }
});
