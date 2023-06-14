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
const speed = 200;
let preventEvent = true; // 모션 실행 중 여부
let autoScroll = true; // auto scroll 실행 스위치

window.addEventListener('scroll', activation);
window.addEventListener('resize', modifyPos);
autoScroll &&
	window.addEventListener(
		'mousewheel',
		moveAuto, // 내부적으로 이벤트 객체가 전달된다.
		{ passive: false } // 스크립트의 기본이벤트를 막을 수 있다. (e.preventDefault() 실행 가능)
	);

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

function moveAuto(e) {
	e.preventDefault(); // 깨끗하게 스크롤 되도록 처리

	const active = list.querySelector('li.on');
	const activeIdx = Array.from(btns).indexOf(active);

	if (e.deltaY > 0) {
		console.log('wheel down');

		if (activeIdx === btns.length - 1) return;
		moveScroll(activeIdx + 1);
	} else {
		console.log('wheel up');

		if (activeIdx === 0) return;
		moveScroll(activeIdx - 1);
	}
}
