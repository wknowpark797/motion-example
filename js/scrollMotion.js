/*
  window(BOM).scrollY
    - 브라우저의 스크롤 거리값을 반환 (동적)

  DOM.offsetTop
    - 해당 DOM 요소의 세로 위치값 반환 (정적)

  window.scrollTo({left: 가로 스크롤 위치값, top: 세로 스크롤 위치값})
    - 해당 위치값으로 스크롤 이동
*/

const sections = document.querySelectorAll('section');
const list = document.querySelector('ul');
const btns = list.querySelectorAll('li');
const speed = 1000;
let preventEvent = true; // 모션 실행 중 여부

window.addEventListener('scroll', activation);
window.addEventListener('resize', modifyPos);

btns.forEach((btn, idx) => {
	btn.addEventListener('click', () => preventEvent && moveScroll(idx));
});

function activation() {
	const scroll = window.scrollY;
	const baseline = -window.innerHeight / 3;

	sections.forEach((_, idx) => {
		if (scroll >= sections[idx].offsetTop + baseline) {
			for (const el of btns) el.classList.remove('on');
			btns[idx].classList.add('on');

			for (const el of sections) el.classList.remove('on');
			sections[idx].classList.add('on');
		}
	});
}

function moveScroll(idx) {
	// scrollTo: 시간 제어 불가능
	// window.scrollTo({ top: sections[idx].offsetTop, behavior: 'smooth' });

	preventEvent = false;

	new Anime(window, {
		prop: 'scroll',
		value: sections[idx].offsetTop,
		duration: speed,
		callback: () => (preventEvent = true),
	});
}

// 브라우저 resize 시 현재 스크롤 위치값 갱신 함수
function modifyPos() {
	const active = list.querySelector('li.on');
	const activeIdx = Array.from(btns).indexOf(active);

	// scroll(가로 위치값, 세로 위치값) - 해당 위치로 바로 이동
	window.scroll(0, sections[activeIdx].offsetTop);
}
