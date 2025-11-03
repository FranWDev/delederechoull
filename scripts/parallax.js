window.addEventListener('scroll', () => {
    const repoParallax = document.getElementById('repoParallax');
    const scrolled = window.pageYOffset;
    const repoSection = document.getElementById('repository');

    if (repoSection && repoParallax) {
        const rect = repoSection.getBoundingClientRect();
        const offset = window.pageYOffset + rect.top;
        const parallaxOffset = (scrolled - offset) * 0.5;

        repoParallax.style.transform = `translateY(${parallaxOffset}px)`;
    }
});
