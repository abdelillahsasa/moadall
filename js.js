let totalResult = 0;

function validateInput(event) {
  const input = event.target;
  const value = parseFloat(input.value);

  // إذا كان الحقل فارغًا، يتم التحقق من الحقول الأخرى
  if (input.value === "") {
    resetResultIfBothEmpty(input); // إعادة النتيجة إذا كانت جميع الحقول فارغة
    updateAverage(); // تحديث المعدل النهائي
    return;
  }

  // التحقق من صحة الرقم المدخل
  if (isNaN(value) || value < 0 || value > 20) {
    input.value = '';
    alert('Please enter a number between 0 and 20.');
  } else {
    calculateResult(input);
  }
}

function calculateResult(input) {
  const row = input.closest('tr');
  const tdInput = parseFloat(row.querySelector('td:nth-child(3) input')?.value) || 0; // أخذ قيمة TD
  const examInput = parseFloat(row.querySelector('td:nth-child(4) input').value) || 0; // أخذ قيمة الامتحان
  const coefficient = parseFloat(row.querySelector('td:nth-child(2)').textContent);

  let total = 0;

  // إذا كانت المادة "الإعلام الآلي" أو "مدخل لادارة الاعمال"، يتم حساب المجموع بناءً على الامتحان فقط
  if (row.querySelector('td:nth-child(1)').textContent.includes("الإعلام الآلي") || row.querySelector('td:nth-child(1)').textContent.includes("مدخل لادارة الاعمال")) {
    total = examInput; // لا يتم عرض خانة TD
  } else {
    // حساب المجموع المعدل في باقي المواد
    const weightedTd = tdInput * 0.4; // ضرب TD في 0.4
    const weightedExam = examInput * 0.6; // ضرب الامتحان في 0.6
    total = weightedTd + weightedExam; // حساب المجموع
  }

  // عرض المجموع في العمود الجديد
  row.querySelector('td:nth-child(5)').textContent = total.toFixed(2);

  // حساب النتيجة بضرب المجموع في المعامل
  const result = total * coefficient;
  row.querySelector('td:nth-child(6)').textContent = result.toFixed(2); // عرض النتيجة في العمود الأخير

  // تحديث اللون بناءً على الحاصل بين TD والامتحان
  updateColor(row);

  // تحديث المعدل النهائي
  updateAverage();
}

function resetResultIfBothEmpty(input) {
  const row = input.closest('tr');
  const tdInput = row.querySelector('td:nth-child(3) input')?.value || ""; // قيمة TD
  const examInput = row.querySelector('td:nth-child(4) input')?.value || ""; // قيمة الامتحان

  if (tdInput === "" && examInput === "") {
    // إذا كانت القيمتان فارغتين، يتم تعيين النتيجة إلى فارغة
    row.querySelector('td:nth-child(5)').textContent = ''; // مسح المجموع
    row.querySelector('td:nth-child(6)').textContent = ''; // مسح النتيجة
  } else {
    // إذا كانت إحدى القيم موجودة، يتم حساب النتيجة
    calculateResult(input);
  }
}

function updateColor(row) {
  const totalCell = row.querySelector('td:nth-child(5)'); // عمود المجموع
  const resultCell = row.querySelector('td:nth-child(6)'); // عمود النتيجة
  const totalValue = parseFloat(totalCell.textContent) || 0;

  // تغيير لون عمود المجموع وعمود النتيجة بناءً على الحاصل
  if (totalValue >= 10) {
    totalCell.style.color = 'green'; // إذا كان الحاصل 10 أو أكثر، يصبح اللون أخضر
    resultCell.style.color = 'green';
  } else if (totalValue <= 9.99) {
    totalCell.style.color = 'red'; // إذا كان الحاصل أقل من 10، يصبح اللون أحمر
    resultCell.style.color = 'red';
  } else {
    totalCell.style.color = ''; // إعادة اللون الافتراضي (بدون لون)
    resultCell.style.color = '';
  }
}

function updateAverage() {
  let sumOfResults = 0;
  const rows = document.querySelectorAll('tr');
  rows.forEach(row => {
    const totalCell = row.querySelector('td:nth-child(6)'); // الحصول على خانة النتيجة
    if (totalCell && totalCell.textContent) {
      sumOfResults += parseFloat(totalCell.textContent);
    }
  });

  // حساب المعدل النهائي
  const average = sumOfResults / 17; // قسمنا المجموع على 17
  const averageCell = document.getElementById('average-cell');
  averageCell.textContent = `المعدل النهائي: ${average.toFixed(2)}`;

  // تحديث لون المعدل النهائي بناءً على قيمته
  if (average >= 10) {
    averageCell.style.color = 'green'; // الأخضر إذا كان المعدل 10 أو أكثر
  } else {
    averageCell.style.color = 'red'; // الأحمر إذا كان المعدل أقل من 10
  }
}

window.onload = function () {
  // حذف خانة TD للمادتين الإعلام الآلي و مدخل لادارة الاعمال
  const rows = document.querySelectorAll('tr');
  rows.forEach(row => {
    const subject = row.querySelector('td:nth-child(1)').textContent;
    if (subject.includes('الإعلام الآلي') || subject.includes('مدخل لادارة الاعمال')) {
      row.querySelector('td:nth-child(3)').innerHTML = ''; // إزالة خانة TD
    }
  });
};

