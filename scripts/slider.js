document.addEventListener("DOMContentLoaded", () => {
  const slidesContainer = document.getElementById('slides');
  const totalSlides = slidesContainer.children.length;
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  let currentIndex = 0;
  let autoSlideInterval;
  
  // Variables Táctiles
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;

  // --- Funciones Core ---
  function setPositionByIndex() {
    currentTranslate = currentIndex * -slidesContainer.offsetWidth;
    prevTranslate = currentTranslate;
    slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
  }

  function showSlide(index) {
    if (index >= totalSlides) currentIndex = 0;
    else if (index < 0) currentIndex = totalSlides - 1;
    else currentIndex = index;
    setPositionByIndex();
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
    resetAutoSlide();
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
    resetAutoSlide();
  }

  // --- Lógica de Arrastre (Drag Logic) ---
  function touchStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    slidesContainer.classList.add('dragging'); // Quita transición CSS
    prevTranslate = currentTranslate;
    stopAutoSlide();
    animationID = requestAnimationFrame(animation);
  }

  function touchMove(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPos;
    currentTranslate = prevTranslate + diff;
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    slidesContainer.classList.remove('dragging'); // Pone transición CSS

    const movedBy = currentTranslate - prevTranslate;
    const threshold = slidesContainer.offsetWidth / 4; // Umbral de sensibilidad

    if (movedBy < -threshold) currentIndex += 1;
    if (movedBy > threshold) currentIndex -= 1;

    showSlide(currentIndex);
    startAutoSlide();
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    if (isDragging) {
        slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
        requestAnimationFrame(animation);
    }
  }

  // --- Event Listeners ---
  // Touch
  slidesContainer.addEventListener('touchstart', touchStart, { passive: true });
  slidesContainer.addEventListener('touchmove', touchMove, { passive: true });
  slidesContainer.addEventListener('touchend', touchEnd);

  // Mouse (para probar arrastre en desktop)
  slidesContainer.addEventListener('mousedown', touchStart);
  slidesContainer.addEventListener('mousemove', touchMove);
  slidesContainer.addEventListener('mouseup', touchEnd);
  slidesContainer.addEventListener('mouseleave', () => { if (isDragging) touchEnd() });

  // Botones (solo funcionarán si son visibles)
  if(nextBtn) nextBtn.addEventListener('click', nextSlide);
  if(prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Resize y AutoPlay
  window.addEventListener('resize', setPositionByIndex);
  
  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
  function stopAutoSlide() { clearInterval(autoSlideInterval); }
  function resetAutoSlide() { stopAutoSlide(); startAutoSlide(); }

  // Init
  setPositionByIndex();
  startAutoSlide();
});