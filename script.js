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
                    if (k === 0 || k === 1) {
                        input.setAttribute('placeholder', '주간');
                    } else {
                        input.setAttribute('placeholder', '야간');
                    }
                    cell.appendChild(input);
                }

                calendarGrid.appendChild(cell);
                currentDate++;
            }
        }
    }
}
createCalendar();

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    let rows = [];
    for (let i = 0; i < calendarGrid.children.length; i++) {
        const cell = calendarGrid.children[i];
        if (cell.classList.contains('cell')) {
            let row = [];
            row.push(cell.textContent);
            const inputs = cell.querySelectorAll('input');
            inputs.forEach(input => {
                row.push(input.value);
            });
            rows.push(row.join(','));
        }
    }
    csvContent += rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "calendar_events.csv");
    document.body.appendChild(link);
    link.click();
}

function saveToFile() {
    const data = [];
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = {
            date: cell.textContent,
            contents: []
        };
        const inputs = cell.querySelectorAll('input');
        inputs.forEach(input => {
            row.contents.push(input.value);
        });
        data.push(row);
    });
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendar_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadFromFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const jsonData = event.target.result;
        const data = JSON.parse(jsonData);
        const cells = document.querySelectorAll('.cell');
        data.forEach((row, index) => {
            const inputs = cells[index].querySelectorAll('input');
            row.contents.forEach((content, idx) => {
                inputs[idx].value = content;
            });
        });
    };
    reader.readAsText(file);
}
function adjustInputFontSize() {
    // 뷰포트의 너비 가져오기
    const viewportWidth = window.innerWidth;

    // 입력 창의 글씨 크기 조절
    const inputFontSize = Math.max(5, Math.min(10, viewportWidth / 30)); // 최소 10px, 최대 20px로 제한
    const inputElements = document.querySelectorAll('.cell input[type="text"]');
    inputElements.forEach(input => {
        input.style.fontSize = inputFontSize + 'px';
    });
}

// 페이지 로드 시 및 창 크기 변경 시 함수 호출
window.addEventListener('DOMContentLoaded', adjustInputFontSize);
window.addEventListener('resize', adjustInputFontSize);


// 페이지 로드 시 로컬 스토리지에서 데이터 불러오기
window.onload = function() {
    loadDataFromLocalStorage(); // 로컬 스토리지에서 데이터 불러오기
    changePlaceholders(); // placeholder 변경 함수 호출
};
