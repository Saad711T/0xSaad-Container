document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll('.game-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -(y - centerY) / 15;
      const rotateY = (x - centerX) / 15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
});
