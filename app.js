class Student {
  constructor(
    surname, name, patronymic, birthDate,
    educationStartDate, faculty
  )
  {
    this.surname = surname;
    this.name = name;
    this.patronymic = patronymic;
    this.birthDate = birthDate;
    this.educationStartDate = educationStartDate;
    this.faculty = faculty;

    this.age = Student.getStudentAge(this.birthDate);
    this.course = Student.getStudentCourse(this.educationStartDate);
  }

  static birthDateFormat(birthDate) {
    return birthDate.toString().split('-').reverse().join('.');
  }

  static getStudentAge(birthDate) {
    const date = new Date();
    birthDate = new Date(birthDate);
    const ageNumber = Math.floor((Math.abs(date - birthDate) / (1000 * 60 * 60 * 24)) / 365);

    const years = ['год', 'года', 'лет'];
    const cases = [2, 0, 1, 1, 1, 2];
    const ageEnding = years[
      (ageNumber % 100 > 4 && ageNumber % 100 < 20) ?
      2 : cases[(ageNumber % 10 < 5 ) ?
      ageNumber % 10 : 5 ]
    ];

    return `${ageNumber} ${ageEnding}`;
  }

  static getStudentCourse(startYear) {
    const now = new Date().toISOString().slice(0, 10).split('-'),
          nowYear = Number(now[0]),
          nowMonth = Number(now[1]);

    startYear = Number(startYear);
    let course = nowYear - startYear;

    if(nowMonth >= 9) course += 1;
    if(course > 4) return 'Закончил';

    return course;
  }
}

class Storage {
  static getStudents() {
    let students;

    if (localStorage.getItem('students') === null) {
      students = [];
    } else {
      students = JSON.parse(localStorage.getItem('students'));
    }

    return students;
  }

  static printStudents() {
    const widget = new WidgetUI();
    const students = Storage.getStudents();

    // Отобразить каждого студента в таблице
    students.forEach(student => {
      student.editting = false;
      widget.renderStudent(student);
    });

    localStorage.setItem('students', JSON.stringify(students));
  }

  // Добавляем студента в LocalStorage
  static pushStudent(student) {
    // Получаем студентов из LocalStorage
    const students = Storage.getStudents();
    students.push(student);
    // Перезаписываем в LocalStorage
    localStorage.setItem('students', JSON.stringify(students));
  }
}

class WidgetUI {
  renderStudent(student) {
    const table = document.getElementById('student-table'),
          entry = document.createElement('tr'),
          age = student.age,
          course = student.course;

    student.birthDate = Student.birthDateFormat(student.birthDate);

    entry.innerHTML = `
      <td class="student-name">
        ${student.surname} ${student.name} ${student.patronymic}
      </td>
      <td class="">${student.faculty}</td>
      <td>${student.birthDate} (${age})</td>
      <td>${student.educationStartDate}-${Number(student.educationStartDate) + 4} (${course} курс)</td>
    `;

    table.appendChild(entry);
  }

  renderAlert(alert, alertType) {
    // Очищаем все тайм-ауты
    let timeoutID = window.setTimeout(function () { }, 0);
    while (timeoutID--) window.clearTimeout(timeoutID);

    // Удаляем существующее предупреждение, если оно есть
    if (document.querySelector('.alert') !== null) {
      document.querySelector('.alert').remove();
    }

    // Получаем конец #widget
    const end = document.querySelector('#end');

    // Создаём новое предупреждение с параметрами
    const div = document.createElement('div');
    div.className = `alert ${alertType}`;
    div.appendChild(document.createTextNode(alert));

    // Добавляем значок оповещения в нижней части виджета
    end.parentNode.insertBefore(div, end.nextSibling);

    // Удаляем предупреждение через 5 секунд
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 5000);
  }

  clearInputFields() {
    document.getElementById('name').value = '';
    document.getElementById('surname').value = '';
    document.getElementById('patronymic').value = '';
    document.getElementById('birth-date').value = '';
    document.getElementById('year-start-education').value = '';
    document.getElementById('faculty').value = 'default';
  }
}

class Form {
  static checkEmptyInputs(student) {
    const widget = new WidgetUI();

    // Проверка на заполнение
    formInputBoxes.forEach(inputBox => {
      const input = inputBox.querySelector('.input-box__input');
      const error = inputBox.querySelector('.error-validate');

      if(input.value.trim() === '') {
        input.classList.add('error-field');
        error.style.display = 'block';
      };
    });

    if(student.faculty === 'default')
      {
        formSelect.classList.add('error-field');
        errorSelect.style.display = 'block';
        return widget.renderAlert('Пожалуйста, заполните все поля!', 'error');
      } else {
        formSelect.classList.remove('error-field');
        errorSelect.style.display = 'none';
      }
    return true;
  }

  static checkValidateInputs() {
    const allValid = [];

    formInputBoxes.forEach(inputBox => {
      const input = inputBox.querySelector('.input-box__input');
      const isValid = Number(input.dataset.isValid);
      typeof isValid;
      allValid.push(isValid);
    });

    const isAllValid = allValid.reduce((acc, current) => {
        return acc && current;
      });
      
    if ( Boolean(isAllValid) ) return true;
  }

  static validateInputDate(date) {
    console.log(date, typeof date);

    // if date < 1900 && date > new Date()
    // renderAlert()

    // console.log(date);
    // const inputBirthDate = document.getElementById('birth-date');
    // console.log(inputBirthDate.valueAsDate);
    return true;
  }

  static inputDateRange(minValue = '1900-01-01', maxValue) {
    const inputBirthDate = document.getElementById('birth-date');

    if (maxValue === undefined) {
      const year = new Date().getFullYear(),
            month = new Date().getMonth(),
            day = new Date().getDate();

      maxValue = `${year}-${month < 10 ? '0' : ''}${month + 1}-${day < 10 ? '0' : ''}${day}`;
    }

    inputBirthDate.setAttribute('min', minValue);
    inputBirthDate.setAttribute('max', maxValue);
  }

  static inputCourseNumberRange(minValue = '2000', maxValue) {
    const inputCourseNumber = document.getElementById('year-start-education');

    if (maxValue === undefined) {
      maxValue = new Date().getFullYear();
    }

    inputCourseNumber.setAttribute('min', minValue);
    inputCourseNumber.setAttribute('max', maxValue);
  }
}

//Начало программы
document.addEventListener('DOMContentLoaded', Storage.printStudents);

Form.inputDateRange();
Form.inputCourseNumberRange();

const modalBtn = document.querySelector('.modal-btn'),
      modalOverlay = document.querySelector('.modal-overlay'),
      modalWindow = document.querySelector('.modal'),
      form = document.getElementById('student-form'),
      formInputBoxes = document.querySelectorAll('.input-box'),
      formSelectBox = document.querySelector('.select-box'),
      formSelect = formSelectBox.querySelector('.input-box__select');
      errorSelect = formSelectBox.querySelector('.error-validate');

modalBtn.addEventListener('click', (event) => {
  const path = event.currentTarget.getAttribute('data-path');
  const target = document.querySelector(`[data-target="${path}"]`);

	target.classList.add('modal--visible');
	modalOverlay.classList.add('modal-overlay--visible');
});

modalOverlay.addEventListener('click', (event) => {
	if (event.target === modalOverlay) {
		modalOverlay.classList.remove('modal-overlay--visible');
	}
});

formInputBoxes.forEach(inputBox => {
  const input = inputBox.querySelector('.input-box__input');
  const errorText = inputBox.querySelector('.error-validate');
  input.dataset.isValid = 0;

  if (!input.dataset.reg) return;

  let inputValue;
  const inputReg = input.dataset.reg;
  const reg = new RegExp(inputReg);

  input.addEventListener('input', () => {
    inputValue = input.value;

    if (reg.test(inputValue)) {
      input.dataset.isValid = 1;
      input.classList.add('success-field');
      errorText.style.display = 'none';
    } else {
      input.dataset.isValid = 0;
      input.classList.add('error-field');
      errorText.style.display ='block';
    }
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const widget = new WidgetUI();

  const surname = document.getElementById('surname'),
        name = document.getElementById('name'),
        patronymic = document.getElementById('patronymic'),
        birthDate = document.getElementById('birth-date'),
        educationStartDate = document.getElementById('year-start-education'),
        faculty = document.getElementById('faculty');

  const student = new Student(
    surname.value.trim(),
    name.value.trim(),
    patronymic.value.trim(),
    birthDate.value,
    educationStartDate.value.trim(),
    faculty.value
  );

  // Валидация input
  if (
    Form.checkEmptyInputs(student) &&
    Form.checkValidateInputs() &&
    Form.validateInputDate(birthDate.value)
  )
  {
    Storage.pushStudent(student);
    widget.renderStudent(student);
    widget.clearInputFields();
    widget.renderAlert('Студент Добавлен', 'success');

    setTimeout(() => {
      modalWindow.classList.remove('modal--visible');
      modalOverlay.classList.remove('modal-overlay--visible');
    }, 2000);
  }
});
