const button = document.getElementById("startButton");
const resultDisplay = document.getElementById("result-display");
const canvas = document.getElementById("rouletteCanvas");
const ctx = canvas.getContext("2d");

//룰렛 그리기 위한 재료
const rawItems = ['수엽하기', '수업하기', '수업하가', '수엄하기', '수업해기', '수업허기'];
const colors = ["#f8a5c2", "#f7d794", "#f3a683", "#786fa6", "#63cdda", "#546de5"];

let items = []; 
let currentRotation = 0;

// 1. 룰렛 그리기 함수
function draw() {
    items = rawItems.map((name, i) => ({
        name,
        weight: Math.floor(Math.random() * 8) + 3,
        color: colors[i % colors.length]
    })).sort(() => Math.random() - 0.5);

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const cw = canvas.width / 2;
    const ch = canvas.height / 2;
    let startAngle = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach((item) => {
        const arc = (item.weight / totalWeight) * (2 * Math.PI);
        
        ctx.beginPath();
        ctx.fillStyle = item.color;
        ctx.moveTo(cw, ch);
        ctx.arc(cw, ch, cw, startAngle, startAngle + arc);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(cw, ch);
        ctx.rotate(startAngle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 22px Arial";
        ctx.fillText(item.name, cw - 40, 10);
        ctx.restore();

        item.startAngle = startAngle;
        item.endAngle = startAngle + arc;
        startAngle += arc;
    });
}


// 2. 버튼 클릭 시 회전 이벤트
button.addEventListener("click", () => {
    if (button.disabled) return;
    draw();
    button.disabled = true;
    button.innerText = "두구두구두구...";
    resultDisplay.innerText = "교수님 오늘 수업 할 수 있을거라고 생각하세요?";

    // 최소 10바퀴 이상 돌도록 설정
    const additionalRotate = Math.floor(Math.random() * 360) + 3600; 
    currentRotation += additionalRotate;

    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // 애니메이션이 끝나는 5초 뒤 결과 계산
    setTimeout(() => {
        button.disabled = false;
        button.innerText = "한 번 더?";

        const finalRotation = (currentRotation % 360);
        const targetDegree = (360 - finalRotation + 270) % 360;
        const targetRadian = (targetDegree * Math.PI) / 180;

        const winItem = items.find(it => 
            targetRadian >= it.startAngle && targetRadian < it.endAngle
        );

        resultDisplay.style.color = "#2f3542";
        if (winItem.name.includes("수업하기")) {
            resultDisplay.innerText = `수업들을께요....`;
            button.innerText = "룰렛 돌리기"
        } else {
            resultDisplay.innerText = "🎉 축하합니다! 교수님 가방 싸세요! 저흰 먼저 집에 갑니다! 🎉";
            resultDisplay.style.color = "#ff4757";
        }
    }, 5000);
});
draw()