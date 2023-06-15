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

const baseline = -window.innerHeight / 2;
const speed = 500;
let preventEvent = true; // 모션 실행 중 여부
let autoScroll = true; // auto scroll 실행 여부
let eventBlocker = null; // 스크롤 이벤트 강제 제어 (throttling)

// Section 3
const icon = document.querySelector('.svg-box path');
const iconLength = 2730;

// Section 4
const box = document.querySelector('.box');

/* 
	[ Throttling ]
	window.addEventListener('scroll', () => {
		
		console.log('scrolled');

		- 1초 동안 총 60번의 이벤트가 발생
			-> 화면의 주사율에 따라 시스템 이벤트가 발생

		1. 스크롤 이벤트가 발생할 때마다 eventBlocker 전역변수 생성
			-> setTimeout이 리턴하는 1씩 증가되는 숫자값이 담긴다.
			-> setTimeout은 실행될 때마다 카운트 된 숫자를 반환해준다.
		
		2. setTimeout이 실행될 때마다 eventBlocker가 true가 된다. 
			-> setTimeout 시간 동안은 중복 함수 호출이 막아진다. 
			-> setTimeout이 끝나면 eventBlocker가 null(false)로 바뀐다. 
			-> 다시 이벤트 호출을 가능하게 해준다.

		3. setTimeout의 delay 값을 200으로 지정
			-> 1000/200으로 1초에 60번 호출하는 구문을 5번으로 줄일 수 있다.

	})
*/

/* 
	[ throttling 테스트 ]
	window.addEventListener('scroll', () => {
		if (eventBlocker) return; // 처음 실행시 무시

		eventBlocker = setTimeout(() => {
			console.log('엄청 무거운 작업');
			eventBlocker = null;
		}, 200);
	}); 
*/

window.addEventListener('scroll', () => {
	/*
		[ Custom Scroll 함수 호출 ]
		throttling 구문 밖에서 호출
			- path 모션을 부드럽게 실행하기 위함
	*/
	section3CustomScroll();
	section4CustomScroll();

	if (eventBlocker) return;
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
		{ passive: false } // 스크립트의 스크롤 기본이벤트를 막는다.
	);

btns.forEach((btn, idx) => {
	btn.addEventListener('click', () => preventEvent && moveScroll(idx));
});

// Section, Button 활성화 함수
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

// Anime 실행 함수
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

	// scrollTo(가로 위치값, 세로 위치값) - 해당 위치로 바로 이동
	window.scrollTo({ top: sections[activeIdx].offsetTop, behavior: 'smooth' });
}

function moveAuto(e) {
	e.preventDefault(); // 깨끗하게 스크롤 되도록 처리

	const active = list.querySelector('li.on');
	const activeIdx = Array.from(btns).indexOf(active);

	// mousewheel의 위, 아래 방향에 따른 분기
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

// Section 3 Custom 함수
function section3CustomScroll() {
	const scroll = window.scrollY;

	/*
		[ actionScroll ]
		section 영역에 도달 시 스크롤 값을 0으로 초기화
			-> 보정값 = 전체 스크롤값 - 현재 스크롤 위치값
			-> 0 = scroll - sections[2].offsetTop - baseline
			-> * 5를 하여 선이 그려지는 수치폭을 5배 증가
	*/
	let actionScroll = (scroll - sections[2].offsetTop - baseline) * 5;

	if (scroll > sections[2].offsetTop + baseline) {
		/*
			actionScroll 값이 전체 선의 길이를 넘어가는 순간 값을 0으로 강제 고정
				-> 반대방향으로 선이 빠지기 때문
		*/
		if (actionScroll >= iconLength) {
			actionScroll = iconLength;
		}

		/*
			아이콘의 strokeDashoffset값을 보정된 actionScroll값으로 계속 빼준다.
				-> 선이 그려지기 시작
			위의 조건식에서 만들어진 actionScroll 값이 활용되어야 하므로 순서 변경 금지
		*/
		icon.style.strokeDashoffset = iconLength - actionScroll;
	} else {
		/*
			section 영역에 도달하지 못한 상태는 strokeDashoffset 값을 2730으로 고정하여 초기화
				-> 선이 그려지지 않은 상태
		*/
		icon.style.strokeDashoffset = iconLength;
	}
}

// Section 4 Custom 함수
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
