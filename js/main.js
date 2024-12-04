let currentSlide = 0;
let autoSlideInterval; 

function showSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;

  // Normalize index (handle wrap-around)
  currentSlide = (index + totalSlides) % totalSlides;

  // Hide all slides and show only the active one
  slides.forEach((slide, idx) => {
    slide.classList.remove('active');
    if (idx === currentSlide) {
      slide.classList.add('active');
    }
  });

  // Update slide container transform for smooth sliding
  const slidesContainer = document.querySelector('.carousel-slides');
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  showSlide(currentSlide + 1);
  startAutoSlide();
}

function prevSlide() {
  showSlide(currentSlide - 1);
  startAutoSlide();
}

function startAutoSlide(intervalTime = 10000) {
	// Clear any existing interval
	if (autoSlideInterval) clearInterval(autoSlideInterval);

	// Set up a new interval to auto-advance slides
	autoSlideInterval = setInterval(() => {
		nextSlide(); // Automatically advance to the next slide
	}, intervalTime);
}

function stopAutoSlide() {
	clearInterval(autoSlideInterval); // Stop the auto-slide
}

// Initialize the first slide
document.addEventListener('DOMContentLoaded', () => {
  showSlide(currentSlide);
  startAutoSlide();
});

const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', stopAutoSlide);
carousel.addEventListener('mouseleave', () => startAutoSlide());


document.addEventListener("DOMContentLoaded", () => {
	const backToTop = document.getElementById("back-to-top");
	const progressCircle = document.querySelector(".progress-ring-circle");
	const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
	
	// Show/Hide Button and Update Progress
	window.addEventListener("scroll", () => {
	  const scrollY = window.scrollY;
  
	  // Update visibility
	  if (scrollY > 100) {
		backToTop.style.visibility = "visible";
		backToTop.style.opacity = "1";
	  } else {
		backToTop.style.visibility = "hidden";
		backToTop.style.opacity = "0";
	  }
  
	  // Update progress circle
	  const progress = (scrollY / totalScrollHeight) * 126; // Match stroke-dasharray
	  progressCircle.style.strokeDashoffset = 126 - progress;
	});
  
	// Scroll Back to Top on Button Click
	backToTop.addEventListener("click", () => {
	  window.scrollTo({ top: 0, behavior: "smooth" });
	});
  });
  