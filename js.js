let totalResult = 0;

function validateInput(event) {
  const input = event.target;
  const value = parseFloat(input.value);

  // إذا كان الحقل فارغًا، لا تقم بأي عملية
  if (input.value === "") {
    // إعادة تعيين اللون عند حذف القيمة
    resetColor(input);
    resetResult(input);  // إضافة هذه الدالة لإعادة تعيين النتيجة إلى صفر
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

  let result = 0;
  let total = 0;

  // إذا كانت المادة "الإعلام الآلي" أو "مدخل لادارة الاعمال"، نعرض العلامة مباشرة في خانة النتيجة
  if (row.querySelector('td:nth-child(1)').textContent.includes("الإعلام الآلي") || row.querySelector('td:nth-child(1)').textContent.includes("مدخل لادارة الاعمال")) {
    total = examInput; // لا نعرض خانة TD ونحسب النتيجة بناءً على الامتحان فقط
  } else {
    // في باقي المواد نقوم بحساب المجموع المعدل
    const weightedTd = tdInput * 0.4; // ضرب TD في 0.4
    const weightedExam = examInput * 0.6; // ضرب الامتحان في 0.6
    total = weightedTd + weightedExam; // حساب المجموع
  }

  // عرض المجموع في العمود الجديد
  row.querySelector('td:nth-child(5)').textContent = total.toFixed(2); 

  // حساب النتيجة بضرب المجموع في المعامل
  result = total * coefficient;
  row.querySelector('td:nth-child(6)').textContent = result.toFixed(2); // عرض النتيجة في العمود الأخير

  // تحقق من ملء الحقول قبل تغيير اللون
  if (tdInput > 0 && examInput > 0) {
    // تحديث اللون بناءً على TD و Exam
    updateColor(row, tdInput, examInput);
  }

  // تحديث المعدل النهائي
  updateAverage();
}

function resetResult(input) {
  const row = input.closest('tr');
  row.querySelector('td:nth-child(5)').textContent = ''; // إعادة تعيين المجموع إلى فارغ
  row.querySelector('td:nth-child(6)').textContent = ''; // إعادة تعيين النتيجة إلى فارغ
}

function updateColor(row, tdInput, examInput) {
  const resultCell = row.querySelector('td:nth-child(6)');
  const totalCell = row.querySelector('td:nth-child(5)');
  const subjectName = row.querySelector('td:nth-child(1)').textContent;

  // التحقق إذا كانت المادة إعلام آلي أو مدخل لادارة الأعمال
  if (subjectName.includes("الإعلام الآلي") || subjectName.includes("مدخل لادارة الاعمال")) {
    // التحقق من الامتحان فقط في هذه المواد
    if (examInput >= 10) {
      resultCell.style.color = 'green';
      totalCell.style.color = 'green';
    } else if (examInput <= 9.99) {
      resultCell.style.color = 'red';
      totalCell.style.color = 'red';
    } else {
      resultCell.style.color = '';
      totalCell.style.color = '';
    }
  } else {
    // في باقي المواد نتحقق من TD و Exam
    if (tdInput >= 10 && examInput >= 10) {
      resultCell.style.color = 'green';
      totalCell.style.color = 'green';
    } else if (tdInput <= 9.99 || examInput <= 9.99) {
      resultCell.style.color = 'red';
      totalCell.style.color = 'red';
    } else {
      resultCell.style.color = '';
      totalCell.style.color = '';
    }
  }
}

function resetColor(input) {
  const row = input.closest('tr');
  const resultCell = row.querySelector('td:nth-child(6)');
  const totalCell = row.querySelector('td:nth-child(5)');

  // إعادة تعيين اللون إلى اللون الافتراضي (عادةً الأسود أو بدون لون)
  resultCell.style.color = '';
  totalCell.style.color = '';
}

function updateAverage() {
  let sumOfResults = 0;
  const rows = document.querySelectorAll('tr');
  rows.forEach(row => {
    const totalCell = row.querySelector('td:nth-child(6)'); // الحصول على خانة المجموع
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
  } else if (average <= 9.99) {
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
