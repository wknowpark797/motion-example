/*
  window(BOM).scrollY
    - 브라우저의 스크롤 거리값을 반환 (동적)

  DOM.offsetTop
    - 해당 DOM 요소의 세로 위치값 반환 (정적)

  window.scrollTo({left: 가로 스크롤 위치값, top: 세로 스크롤 위치값})
    - 해당 위치값으로 스크롤 이동
*/

const sections = document.querySelectorAll('section');
const btns = document.querySelectorAll('ul li');
const baseline = -window.innerHeight / 3;
const speed = 1000;

window.addEventListener('scroll', () => {
	const scroll = window.scrollY;

	sections.forEach((_, idx) => {
		if (scroll >= sections[idx].offsetTop + baseline) {
			for (const el of btns) el.classList.remove('on');
			btns[idx].classList.add('on');

			for (const el of sections) el.classList.remove('on');
			sections[idx].classList.add('on');
		}
	});
});

btns.forEach((btn, idx) => {
	btn.addEventListener('click', () => {
		// scrollTo: 시간 제어 불가능
		// window.scrollTo({ top: sections[idx].offsetTop, behavior: 'smooth' });

		new Anime(window, {
			prop: 'scroll',
			value: sections[idx].offsetTop,
			duration: speed,
		});
	});
});
