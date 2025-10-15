// Shared navbar component
function createNavbar() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = currentUser.email === 'lawijustice@gmail.com';

  return `
    <nav style="background: rgba(255,255,255,0.95); padding: 1rem 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 1000;">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <a href="index.html" style="font-size: 1.5rem; font-weight: bold; color: #00cec9; text-decoration: none;">Survey Africa</a>
      </div>
      <div style="display: flex; gap: 2rem; align-items: center;">
        <a href="index.html" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Home</a>
        <a href="features.html" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Features</a>
        <a href="pricing.html" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Pricing</a>
        <a href="about.html" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">About</a>
        <a href="contact.html" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Contact</a>
        ${isLoggedIn ? `
          <a href="dashboard.html" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Dashboard</a>
          ${isAdmin ? '<a href="admin-dashboard.html" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Admin</a>' : ''}
          <button onclick="logout()" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Logout</button>
        ` : `
          <a href="login.html" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Login</a>
          <a href="signup.html" style="background: #00cec9; color: white; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none; font-weight: 500;">Sign Up</a>
        `}
      </div>
    </nav>
  `;
}

function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = 'index.html';
}

// Auto-insert navbar if element exists
document.addEventListener('DOMContentLoaded', function() {
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = createNavbar();
  }
});