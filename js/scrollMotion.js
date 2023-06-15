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

const icon = document.querySelector('.svg-box path');
const iconLength = 2730;

const box = document.querySelector('.box');

const baseline = -window.innerHeight / 3;
const speed = 500;
let preventEvent = true; // 모션 실행 중 여부
let autoScroll = true; // auto scroll 실행 스위치
let eventBlocker = null; // 스크롤 이벤트 강제 제어

/* 
	[ Throttling ]
	window.addEventListener('scroll', () => {
		
		console.log('scrolled');
		1초 동안 총 60번의 이벤트가 발생
			-> 화면의 주사율에 따라 시스템 이벤트가 발생

		1. 스크롤 이벤트가 발생할 때마다 eventBlocker 전역변수 생성
			-> setTimeout이 리턴하는 1씩 증가되는 숫자값이 담긴다.
		
		2. setTimeout이 실행될 때마다 eventBlocker가 true가 되므로 setTimeout 시간 동안은 중복 함수 호출이 막아지고 setTimeout이 끝나면 eventBlocker가 null(false)로 바뀌기 때문에 다시 이벤트 호출을 가능하게 해준다.

		3. setTimeout의 delay 값을 200으로 지정하면 1000/200으로 1초에 60번 호출하는 구문을 5번으로 줄일 수 있다.

	})
*/

// throttling 테스트
/* window.addEventListener('scroll', () => {
	if (eventBlocker) return;

	// setTimeout: 실행될 때마다 카운트 된 숫자를 반환해준다.
	eventBlocker = setTimeout(() => {
		console.log('엄청 무거운 작업');
		eventBlocker = null;
	}, 200);
}); */

window.addEventListener('scroll', () => {
	// SVG 제어 - throttling 밖에 로직 추가 (path 모션을 부드럽게 실행하기 위함)
	section3CustomScroll();
	section4CustomScroll();

	if (eventBlocker) return; // 처음 실행시 무시된다.
	eventBlocker = setTimeout(() => {
		activation();
		eventBlocker = null;
	}, speed);
});

window.addEventListener('resize', () => {
	if (eventBlocker) return;

	eventBlocker = setTimeout(() => {
		modifyPos();
		eventBlocker = null;
	}, speed);
});

autoScroll &&
	window.addEventListener(
		'mousewheel',
		moveAuto, // 내부적으로 이벤트 객체가 전달된다.
		{ passive: false } // 스크립트의 스크롤 기본이벤트를 막을 수 있다. (e.preventDefault() 실행 가능)
	);

btns.forEach((btn, idx) => {
	btn.addEventListener('click', () => preventEvent && moveScroll(idx));
});

function activation() {
	const scroll = window.scrollY;

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
	window.scrollTo({ top: sections[activeIdx].offsetTop, behavior: 'smooth' });
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

// 세번째 섹션 커스텀 함수
function section3CustomScroll() {
	const scroll = window.scrollY;

	// 해당 섹션 영역에 도달했을 때 다시 0으로 보정된 스크롤값
	// 전체 스크롤값에서 현재 스크롤 위치값을 뺀 보정값 * 5를 해서 선이 그려지는 수치폭을 5배 증가
	let scroll2 = (scroll - sections[2].offsetTop - baseline) * 10;

	// 해당 섹션에 스크롤이 도달하면
	if (scroll > sections[2].offsetTop + baseline) {
		// scroll2값이 만약 전체 선의 길이를 넘어가는 순간 값을 0으로 강제 고정
		// -> 반대방향으로 빠지게 되기 때문
		if (scroll2 >= iconLength) {
			scroll2 = iconLength;
		}

		// 세번째 섹션에 도달하는 순간의 scroll 값이 0이 되어야 하므로 해당 세로 위치값을 빼준다.
		// 아이콘의 strokeDashoffset값을 보정된 scroll2값으로 계속 빼준다. (선이 그어지기 시작)
		// 위의 조건식에서 만들어진 scroll2 값이 아래의 코드에서 활용되어야 하므로 순서 변경 금지
		icon.style.strokeDashoffset = iconLength - scroll2;
	} else {
		// 해당 섹션에서 스크롤이 벗어나게 되면 다시 strokeDashoffset값을 원래값으로 고정해서 초기화
		icon.style.strokeDashoffset = iconLength;
	}
}

// 네번째 섹션 커스텀 함수
// 현재 크기에서 네번째 섹션에 도달하는 순간 .box가 점점 확대 되도록 처리
// .box가 점점 투명해지면서 사라지도록 처리
function section4CustomScroll() {
	const scroll = window.scrollY;
	let scroll2 = (scroll - sections[3].offsetTop - baseline) / 500;

	if (scroll > sections[3].offsetTop + baseline) {
		box.style.transform = `scale(${1 + scroll2}) rotate(${0 + scroll2 * 100}deg)`;
		box.style.opacity = 1 - scroll2;
	} else {
		box.style.transform = `scale(1) rotate(0deg)`;
		box.style.opacity = 1;
	}
}
