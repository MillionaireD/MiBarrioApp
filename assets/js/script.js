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
  const overlay = document.getElementById("welcomeOverlay");

  if (!sessionStorage.getItem("saludoMostrado")) {
    if (overlay) {
      overlay.style.transition = "opacity 0.8s ease-out";
      setTimeout(() => {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        setTimeout(() => {
          overlay.style.display = "none";
        }, 800);
      }, 2500);
    }
    sessionStorage.setItem("saludoMostrado", true);
  } else {
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


