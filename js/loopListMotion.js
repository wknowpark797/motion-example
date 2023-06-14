const frame = document.querySelector('.list');
const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');

btnPrev.addEventListener('click', () => {
	frame.prepend(frame.lastElementChild);

	btnPrev.classList.add('on');
	setTimeout(() => {
		btnPrev.classList.remove('on');
	}, 500);
});

btnNext.addEventListener('click', () => {
	frame.append(frame.firstElementChild);

	btnNext.classList.add('on');
	setTimeout(() => {
		btnNext.classList.remove('on');
	}, 500);
});
