// Mobile responsiveness functions for Survey Africa

// Toggle sidebar on mobile
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebar) {
    sidebar.classList.toggle('mobile-visible');
  }
  
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

// Close sidebar on mobile
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebar) {
    sidebar.classList.remove('mobile-visible');
  }
  
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Handle window resize
function handleResize() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (window.innerWidth > 768) {
    if (sidebar) {
      sidebar.classList.remove('mobile-visible');
    }
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
}

// Touch events for mobile navigation
function initMobileEvents() {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  
  document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  });
  
  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  });
  
  document.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const diffX = currentX - startX;
    const sidebar = document.getElementById('sidebar');
    
    // Swipe right to open sidebar (from left edge)
    if (diffX > 50 && startX < 50) {
      if (sidebar && !sidebar.classList.contains('mobile-visible')) {
        toggleSidebar();
      }
    }
    
    // Swipe left to close sidebar
    if (diffX < -50 && sidebar && sidebar.classList.contains('mobile-visible')) {
      closeSidebar();
    }
  });
}

// Initialize mobile functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add resize listener
  window.addEventListener('resize', handleResize);
  
  // Initialize touch events
  initMobileEvents();
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (sidebar && sidebar.classList.contains('mobile-visible')) {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeSidebar();
      }
    }
  });
});

// Export functions for global use
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;