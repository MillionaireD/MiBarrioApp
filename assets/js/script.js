document.addEventListener("DOMContentLoaded", function () {
  // --- Botón de scroll hacia arriba
  const btn = document.getElementById("scrollTopBtn");

  if (btn) {
    window.addEventListener("scroll", function () {
      btn.style.display = window.scrollY > 300 ? "flex" : "none";
    });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- Validación de formulario de contacto
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        alert("Por favor, completa todos los campos del formulario.");
        e.preventDefault();
      }
    });
  }

  const overlay = document.getElementById("welcomeOverlay");

if (overlay && !sessionStorage.getItem("bienvenidaMostrada")) {
  overlay.style.transition = "opacity 0.8s ease-out";
  overlay.style.display = "flex"; // Asegura que sea visible

  setTimeout(() => {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 800); // Coincide con la transición
  }, 1800); // Muestra el overlay durante 1.8 segundos

  sessionStorage.setItem("bienvenidaMostrada", "true");
} else if (overlay) {
  overlay.style.display = "none";
}


  // --- Carrusel automático
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  let currentIndex = 0;

  if (track && slides.length > 0) {
    const totalSlides = slides.length;

    function moveSlide(direction) {
      currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Botones (si existen)
    const btnPrev = document.querySelector('.carousel-btn.prev');
    const btnNext = document.querySelector('.carousel-btn.next');

    if (btnPrev) btnPrev.addEventListener('click', () => moveSlide(-1));
    if (btnNext) btnNext.addEventListener('click', () => moveSlide(1));

    // Cambio automático
    setInterval(() => {
      moveSlide(1);
    }, 5000);
  }
});
