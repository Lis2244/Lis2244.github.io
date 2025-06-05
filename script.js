document.addEventListener('DOMContentLoaded', function() {
    const employees = [
        { name: "Николай", color: "#e74c3c" },
        { name: "Сергей Р", color: "#3498db" },
        { name: "Сергей М", color: "#2ecc71" },
        { name: "Света", color: "#9b59b6" },
        { name: "Елена", color: "#1abc9c" },
        { name: "Марина", color: "#e67e22" },
        { name: "Евгения", color: "#34495e" }
    ];

    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spin-btn');
    const result = document.getElementById('result');

    // Устанавливаем размер canvas в зависимости от контейнера
    function resizeCanvas() {
        const container = document.querySelector('.wheel-container');
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        canvas.width = size;
        canvas.height = size;
        drawWheel(currentRotation);
    }

    let centerX, centerY, radius;
    let currentRotation = 0;
    let isSpinning = false;

    function initCanvas() {
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        radius = Math.min(centerX, centerY) * 0.9;
    }

    function drawWheel(rotation = 0) {
    initCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const segmentAngle = (2 * Math.PI) / employees.length;
    const fontSize = Math.max(14, radius * 0.11); // Увеличили базовый размер

    employees.forEach((employee, index) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
            centerX, centerY, radius,
            index * segmentAngle + rotation,
            (index + 1) * segmentAngle + rotation
        );
        ctx.closePath();
        ctx.fillStyle = employee.color;
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(index * segmentAngle + segmentAngle / 2 + rotation);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = `bold ${fontSize}px Arial`; // Используем увеличенный размер
        ctx.textBaseline = 'middle'; // Добавили для лучшего выравнивания
        ctx.fillText(employee.name, radius * 0.8, 0); // Подкорректировали позицию
        ctx.restore();
    });
}

    function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    result.textContent = '';
    spinBtn.disabled = true;

    // Сбросим текущее вращение для более случайного результата
    currentRotation = 0;
    
    // Генерируем более случайные параметры:
    const minRotations = 5; // Минимальное количество полных оборотов
    const maxRotations = 15; // Максимальное количество полных оборотов
    const randomRotations = minRotations + Math.random() * (maxRotations - minRotations);
    
    // Добавляем случайный финальный угол (0-2π)
    const randomFinalAngle = Math.random() * Math.PI * 2;
    
    // Общий угол вращения (полные обороты + случайный финальный угол)
    const totalSpinAngle = randomRotations * Math.PI * 2 + randomFinalAngle;
    
    // Случайная длительность вращения (3-7 секунд)
    const duration = 3000 + Math.random() * 4000;
    
    // Случайное ускорение/замедление
    const accelerationType = Math.random() > 0.5 ? 'easeInOut' : 'easeOutBounce';

    const startTime = Date.now();
    let lastFrameTime = startTime;

    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const frameDelta = currentTime - lastFrameTime;
        lastFrameTime = currentTime;

        const progress = Math.min(elapsed / duration, 1);
        
        // Разные варианты кривых замедления для большего хаоса
        let easeProgress;
        if (accelerationType === 'easeInOut') {
            easeProgress = easeInOutQuad(progress);
        } else {
            easeProgress = easeOutBounce(progress);
        }
        
        // Добавляем небольшие случайные колебания
        const randomFluctuation = Math.sin(progress * Math.PI * 10) * (1 - progress) * 0.1;
        
        currentRotation = totalSpinAngle * (easeProgress + randomFluctuation);
        drawWheel(currentRotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            finishSpin();
        }
    }

    animate();
}



// Новые функции для различных кривых анимации
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeOutBounce(t) {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
}

    function finishSpin() {
    const normalizedAngle = (currentRotation % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const pointerAngle = 3 * Math.PI / 2;
    const angleUnderPointer = (pointerAngle - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
    const segmentAngle = (2 * Math.PI) / employees.length;
    const winnerIndex = Math.floor(angleUnderPointer / segmentAngle) % employees.length;

    const winner = employees[winnerIndex];
    result.textContent = `Задача достаётся: ${winner.name}!`;
    result.style.backgroundColor = winner.color;
    result.style.color = 'white';

    highlightWinner(winnerIndex);
    
    isSpinning = false;
    spinBtn.disabled = false;

    // Автоматический респин если выпал Николай
    if (winner.name === "Николай") {
        // Создаем элемент уведомления
        const notice = document.createElement('div');
        notice.className = 'respin-notice';
        notice.textContent = 'Иммунитет!';
        document.querySelector('.wheel-container').appendChild(notice);
        
        // Удаляем уведомление через 1 секунду
        setTimeout(() => notice.remove(), 1000);
        
        // Запускаем новое вращение через 1 секунду
        setTimeout(() => {
            if (!isSpinning) {
                spinWheel();
            }
        }, 1000);
    }
    }

    function highlightWinner(index) {
        initCanvas();
        const segmentAngle = (2 * Math.PI) / employees.length;
        const winner = employees[index];
        
        drawWheel(currentRotation);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
            centerX, centerY, radius,
            index * segmentAngle + currentRotation,
            (index + 1) * segmentAngle + currentRotation
        );
        ctx.closePath();
        
        const gradient = ctx.createRadialGradient(
            centerX, centerY, radius * 0.7,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, winner.color);
        gradient.addColorStop(1, 'rgba(255,255,255,0.7)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        const fontSize = Math.max(12, radius * 0.08);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(index * segmentAngle + segmentAngle / 2 + currentRotation);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillText(winner.name, radius * 0.85, fontSize * 0.4);
        ctx.restore();
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Инициализация
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    spinBtn.addEventListener('click', spinWheel);
});