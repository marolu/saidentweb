// Set active navigation based on current page
const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    const linkPage = link.getAttribute('data-page');
    if (linkPage === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});