
const calendarGrid = document.getElementById('calendarGrid');
const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const monthDays = 31; // 5월은 31일까지 있음
let startingDayIndex = 3; // 5월 1일은 수요일부터 시작함

function createCalendar() {
    // 요일 표시
    for (let i = 0; i < 7; i++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = daysOfWeek[i];
        calendarGrid.appendChild(dayCell);
    }

    // 달력 날짜 표시
    let currentDate = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDayIndex) {
                const emptyCell = document.createElement('div');
                calendarGrid.appendChild(emptyCell);
            } else if (currentDate <= monthDays) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.textContent = currentDate;

                // 입력 폼 생성
                for (let k = 0; k < 3; k++) {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'text');
                    input.setAttribute('readonly', 'readonly'); // Make input initially read-only
                    if (k === 0 || k === 1) {
                        input.setAttribute('placeholder', '주간');
                    } else {
                        input.setAttribute('placeholder', '야간');
                    }
                    cell.appendChild(input);
                }

                // Add event listener to make inputs editable on click
                cell.addEventListener('click', function() {
                    const inputs = cell.querySelectorAll('input');
                    inputs.forEach(input => {
                        input.removeAttribute('readonly');
                    });
                });

                calendarGrid.appendChild(cell);
                currentDate++;
            }
        }
    }
}
createCalendar();

// Function to adjust font size dynamically based on viewport width and content length
function adjustInputFontSize(input) {
    const contentLength = input.value.length;
    const viewportWidth = window.innerWidth;
    const maxFontSize = 20; // 최대 글꼴 크기
    const minFontSize = 10; // 최소 글꼴 크기
    const baseFontSize = 10; // 기본 글꼴 크기

    // 뷰포트 너비에 따라 글꼴 크기 조정
    const fontSize = Math.max(minFontSize, Math.min(maxFontSize, baseFontSize * (viewportWidth / 600))); // 600px 너비 기준으로 계산
    input.style.fontSize = fontSize + 'px';

    // 입력된 내용의 길이에 따라 글꼴 크기 조정
    if (contentLength > 5) {
        const adjustedFontSize = Math.max(minFontSize, Math.min(maxFontSize, fontSize - Math.min(contentLength - 5, 5)));
        input.style.fontSize = adjustedFontSize + 'px';
    }
}

// Add event listeners to input elements
document.addEventListener('DOMContentLoaded', function() {
    const inputElements = document.querySelectorAll('.cell input[type="text"]');
    inputElements.forEach(input => {
        input.addEventListener('click', function() {
            toggleInputBorder(this);
            adjustInputFontSize(this);
        });
        input.addEventListener('blur', function() {
            toggleInputBorder(this);
        });
        input.addEventListener('input', function() {
            adjustInputFontSize(this);
        });
    });

    // Adjust font size on window resize
    window.addEventListener('resize', function() {
        inputElements.forEach(input => {
            adjustInputFontSize(input);
        });
    });
});

// 페이지 로드 시 및 창 크기 변경 시 함수 호출
window.addEventListener('DOMContentLoaded', adjustInputFontSize);
window.addEventListener('resize', adjustInputFontSize);
