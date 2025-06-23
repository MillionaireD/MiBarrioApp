document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    form.addEventListener("submit", function (e) {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        alert("Por favor, completa todos los campos del formulario.");
        e.preventDefault(); // Evita el envío
      }
    });
  });


  document.addEventListener("DOMContentLoaded", function () {
    if (!sessionStorage.getItem("saludoMostrado")) {
      const overlay = document.getElementById("welcomeOverlay");

      // Mostrar overlay 2.5 segundos
      setTimeout(() => {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        overlay.style.transition = "opacity 0.8s ease-out";

        // Ocultar completamente después de transición
        setTimeout(() => {
          overlay.style.display = "none";
        }, 800);
      }, 2500);

      sessionStorage.setItem("saludoMostrado", true);
    } else {
      // Ocultar si ya se mostró en esta sesión
      const overlay = document.getElementById("welcomeOverlay");
      if (overlay) overlay.style.display = "none";
    }
  });

  let currentIndex = 0;
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;

  function moveSlide(direction) {
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // Auto cambio opcional
  setInterval(() => {
    moveSlide(1);
  }, 5000);


