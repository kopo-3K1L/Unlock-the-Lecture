const button = document.getElementById("startButton")
const resultDisplay = document.getElementById("result-display")
//룰렛 기본 세탕 재료
const canvas = document.getElementById("rouletteCanvas")
const ctx = canvas.getContext("2d")
const rawItems = ['수엽하기','수업하기','수업하가','수엄하기','수염하기','수업허기']
const colors = ["#f8a5c2", "#f7d794", "#f3a683", "#786fa6", "#63cdda", "#546de5"]    
//룰렛 그리는 함수
function draw(){
    const items = rawItems.sort(() => Math.random()-0.5)
                .map((name, i) =>({
                    name,
                    weight : Math.floor(Math.random() * 9) + 2,
                    color : colors[i]
                    }))
    const totalWeight = items.reduce((sum,item)=> sum + item.weight, 0);
    const cw = canvas.width / 2
    const ch = canvas.height / 2;
    let startAngle = 0
    items.forEach((item)=>{
        const arc = (item.weight / totalWeight) * (2 * Math.PI);
        ctx.beginPath();
        ctx.fillStyle = item.color;
        ctx.moveTo(cw,ch);
        ctx.arc(cw,ch,cw,startAngle,startAngle + arc);
        ctx.fill()
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.save();
        ctx.translate(cw, ch);
        ctx.rotate(startAngle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Arial";
        ctx.fillText(item.name, cw - 50, 10);
        ctx.restore();
        item.startAngle = startAngle;
        item.endAngle = startAngle + arc;
        startAngle += arc;
    })
}
draw()

//룰렛 회전하는 함수
