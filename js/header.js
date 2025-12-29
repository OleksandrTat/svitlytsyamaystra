document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav a');
    const path = location.pathname;
  
    links.forEach(link => {
      if (link.getAttribute('href') === path) {
        link.classList.add('active');
      }
    });
  });
  