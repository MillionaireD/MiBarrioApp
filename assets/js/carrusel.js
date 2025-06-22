const carousel = document.getElementById("carrusel-images");
const totalImages = carousel.children.length;
let index = 0;

function showSlide() {
  carousel.style.transition = "transform 0.5s ease-in-out";
  const offset = -index * 100;
  carousel.style.transform = `translateX(${offset}%)`;
}

// Función para avanzar
function nextSlide() {
  index++;
  showSlide();

  if (index === totalImages - 1) {
    // cuando llegue a la imagen duplicada
    setTimeout(() => {
      carousel.style.transition = "none"; // desactiva transición
      index = 0;
      carousel.style.transform = `translateX(0%)`; // vuelve al inicio
    }, 500); // espera a que termine la animación
  }
}

// Función para retroceder
function prevSlide() {
  if (index === 0) {
    index = totalImages - 2;
    carousel.style.transition = "none";
    carousel.style.transform = `translateX(${-index * 100}%)`;
    setTimeout(() => {
      carousel.style.transition = "transform 0.5s ease-in-out";
      index--;
      showSlide();
    }, 20);
  } else {
    index--;
    showSlide();
  }
}

// Rotación automática cada 5 segundos
setInterval(nextSlide, 5000);
