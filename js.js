// J/* Reset basic styles */
function calculateResult(input) {
  const row = input.closest('tr');
  const tdInput = parseFloat(row.querySelector('td:nth-child(3) input')?.value) || 0;
  const examInput = parseFloat(row.querySelector('td:nth-child(4) input').value) || 0;
  const coefficient = parseFloat(row.querySelector('td:nth-child(2)').textContent);

  let result = 0;
  let total = 0;

  if (row.querySelector('td:nth-child(1)').textContent.includes("الإعلام الآلي") || row.querySelector('td:nth-child(1)').textContent.includes("مدخل لادارة الاعمال")) {
    total = examInput;
  } else {
    const weightedTd = tdInput * 0.4;
    const weightedExam = examInput * 0.6;
    total = weightedTd + weightedExam;
  }

  row.querySelector('td:nth-child(5)').textContent = total.toFixed(2);

  result = total * coefficient;
  row.querySelector('td:nth-child(6)').textContent = result.toFixed(2);

  // تغيير اللون بناءً على النتيجة
  const resultCell = row.querySelector('td:nth-child(6)');
  if (result < 10) {
    resultCell.classList.add('result-low');
    resultCell.classList.remove('result-high');
  } else {
    resultCell.classList.add('result-high');
    resultCell.classList.remove('result-low');
  }

  updateAverage();
}

function updateAverage() {
  let sumOfResults = 0;
  const rows = document.querySelectorAll('tr');
  rows.forEach(row => {
    const totalCell = row.querySelector('td:nth-child(6)');
    if (totalCell && totalCell.textContent) {
      sumOfResults += parseFloat(totalCell.textContent);
    }
  });

  const average = sumOfResults / 17;
  const averageCell = document.getElementById('average-cell');
  averageCell.textContent = `المعدل النهائي: ${average.toFixed(2)}`;

  // تغيير لون المعدل النهائي
  if (average < 10) {
    averageCell.classList.add('final-average-low');
    averageCell.classList.remove('final-average-high');
  } else {
    averageCell.classList.add('final-average-high');
    averageCell.classList.remove('final-average-low');
  }
}
