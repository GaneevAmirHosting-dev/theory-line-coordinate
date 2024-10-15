function createIntervalInputs() {
  const intervalCount = parseInt(document.getElementById('intervalCount').value);
  const intervalInputsContainer = document.getElementById('intervalInputs');
  intervalInputsContainer.innerHTML = ''; // Очищаем предыдущие поля

  // Создаем поля ввода для каждого промежутка
  for (let i = 0; i < intervalCount; i++) {
    const div = document.createElement('div');
    div.classList.add('interval-input');
    div.innerHTML = `
      <label for="interval-${i}">Интервал ${i + 1}:</label>
      <input type="text" id="interval-${i}" placeholder="Начало-Конец">
    `;
    intervalInputsContainer.appendChild(div);
  }
}

function drawIntervals() {
  const canvas = document.getElementById('probabilityCanvas');
  const ctx = canvas.getContext('2d');

  // Очистка canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Отрисовка числовой прямой
  const leftOffset = canvas.width * 0.12; // Отступ слева
  const rightOffset = canvas.width * 0.12; // Отступ справа
  const lineWidth = canvas.width - leftOffset - rightOffset; // Ширина линии

  ctx.beginPath();
  ctx.moveTo(leftOffset, 50); // Начало линии
  ctx.lineTo(leftOffset + lineWidth, 50); // Конец линии
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // Получение данных из input-полей
  const intervalCount = parseInt(document.getElementById('intervalCount').value);
  const intervals = [];
  for (let i = 0; i < intervalCount; i++) {
    const intervalInput = document.getElementById(`interval-${i}`);
    const interval = intervalInput.value.split(/[- ]/g).map(Number);
    
    // Проверка на корректность интервала
    if (interval[0] < interval[1]) { 
      intervals.push(interval);
    } else {
      console.error(`Неверный интервал для ${i + 1}-го промежутка: ${intervalInput.value}`);
    }
  }

  // Находим минимальное и максимальное значение в интервалах
  let minVal = intervals[0][0];
  let maxVal = intervals[0][1];
  for (let i = 1; i < intervalCount; i++) {
    minVal = Math.min(minVal, intervals[i][0]);
    maxVal = Math.max(maxVal, intervals[i][1]);
  }

  // Отрисовка отрезков для промежутков
  const intervalWidth = lineWidth / (maxVal - minVal); // Ширина каждого промежутка
  const colors = ['rgba(0, 0, 255, 0.3)', 'rgba(255, 0, 0, 0.3)', 'rgba(0, 255, 0, 0.3)', 'rgba(255, 255, 0, 0.3)', 
                  'rgba(128, 0, 128, 0.3)', 'rgba(255, 165, 0, 0.3)', 'rgba(0, 255, 255, 0.3)', 'rgba(255, 0, 255, 0.3)']; 

  // Определяем порядок отрезков по длине и начальному значению
  const sortedIntervals = intervals.sort((a, b) => {
    if ((b[1] - b[0]) === (a[1] - a[0])) { // Если длины равны, сортируем по началу
      return a[0] - b[0];
    } else {
      return (b[1] - b[0]) - (a[1] - a[0]); // Сортируем по убыванию длины
    }
  });

  // Отрисовка отрезков с учетом длины (в обратном порядке)
  let currentHeight = 10 + (sortedIntervals.length - 1) * 10; // Начальная высота отрезка
  for (let i = sortedIntervals.length - 1; i >= 0; i--) {
    const interval = sortedIntervals[i];

    // Расчет координат с учетом отступов
    const xStart = leftOffset + (interval[0] - minVal) * intervalWidth; // Начало отрезка
    const xEnd = leftOffset + (interval[1] - minVal) * intervalWidth; // Конец отрезка
    const width = xEnd - xStart; // Ширина отрезка
    const color = colors[i % colors.length];
    const height = currentHeight; // Высота отрезка
    const offsetY = 50 - 5 - height; // Смещение вверх, чтобы все отрезки находились на одной прямой

    // Проверка корректности введенных данных
    if (!isNaN(interval[0]) && !isNaN(interval[1]) && interval[0] < interval[1]) {
      ctx.fillStyle = color;
      ctx.fillRect(xStart, offsetY, width, height); // Рисуем отрезок
    } else {
      console.error(`Неверный интервал для ${i + 1}-го промежутка: ${intervalInput.value}`);
    }

    currentHeight -= 10; // Уменьшаем высоту для следующего отрезка

    // Пишем цифры на оси
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(interval[0], xStart, 65); // Начало отрезка
    ctx.fillText(interval[1], xEnd, 65); // Конец отрезка
  }
}