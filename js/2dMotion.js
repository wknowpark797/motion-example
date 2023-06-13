const frame = document.querySelector('section');
const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');

btnPrev.addEventListener('click', () => {
	frame.prepend(frame.lastElementChild);
});

btnNext.addEventListener('click', () => {
	frame.append(frame.firstElementChild);
});
