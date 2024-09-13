const carousel = document.getElementById('carousel');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let index = 0;
let slideInterval;

function showSlide(i) {
    index = (i + 5) % 5; 
    carousel.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    showSlide(index + 1);
}

function prevSlide() {
    showSlide(index - 1);
}


function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 3000);
}
function stopAutoSlide() {
    clearInterval(slideInterval);
}
startAutoSlide();


nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
});


  