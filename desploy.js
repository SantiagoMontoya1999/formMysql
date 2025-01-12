const carousel = document.getElementById('hero-carousel');
let index = 0;

function changeImage() {
    const totalImages = carousel.children.length; // Número total de imágenes
    index = (index + 1) % totalImages; // Incrementa el índice y vuelve a 0 al final
    const offset = -index * 100; // Calcula el desplazamiento basado en el índice
    carousel.style.transform = `translateX(${offset}%)`; // Aplica la transformación
}

// Cambia de imagen cada 3 segundos
setInterval(changeImage, 3000);

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      console.log(`Hovering over: ${card.dataset.feature}`);
    });
  });
