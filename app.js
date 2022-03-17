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
    const now = new Date().toISOString().slice(0, 10).split('-');
    const nowYear = Number(now[0]);
    const nowMonth = Number(now[1]);

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

    if (localStorage.getItem('students') === null) students = [];
    else {
      students = JSON.parse(localStorage.getItem('students'));
    }

    return students;
  }

  static printStudents() {
    const widget = new WidgetUI();
    const students = Storage.getStudents();

    // Отобразить каждого студента в таблице
    students.forEach((student, index) => {
      student.editting = false;
      widget.renderStudent(student, index + 1);
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
  renderStudent(student, id) {
    const table = document.getElementById('student-table');
    const entry = document.createElement('tr');
    const age = Student.getStudentAge(student.birthDate);
    const course = Student.getStudentCourse(student.educationStartDate);

    student.birthDate = Student.birthDateFormat(student.birthDate);

    entry.innerHTML = `
      <td>${id === undefined ? 1 : id}</td>
      <td class="student-name">
      ${student.surname} ${student.name} ${student.patronymic}
      </td>
      <td>${student.faculty}</td>
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
  static validateInput(student) {
    const widget = new WidgetUI();
    const errorsValidate = document.querySelectorAll('.error-validate');
    const formInputs = form.querySelectorAll("[type='text']");

    // Проверка на заполнение
    if(
      student.name.trim() === '' ||
      student.surname.trim() === '' ||
      student.patronymic.trim() === '' ||
      student.birthDate.trim() === '' ||
      student.educationStartDate.trim() === '' ||
      student.faculty === 'default'
      )
      {
        formInputs.forEach(input => input.classList.add('error-field'));
        errorsValidate.forEach(error => error.style.display = 'block');
        return widget.renderAlert('Пожалуйста, заполните все поля!', 'error');
      }
    return true;
  }

  static validateInputDate(date) {
    // if date < 1900 && date > new Date()
    // renderAlert()

    // console.log(date);
    // const inputBirthDate = document.getElementById('birth-date');
    // console.log(inputBirthDate.valueAsDate);
    return true
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

  static inputCourseNumberRange(minValue = '2020', maxValue) {
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

const modalBtn = document.querySelector('.modal-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const modalWindow = document.querySelectorAll('.modal');
const form = document.getElementById('student-form');

modalBtn.addEventListener('click', (event) => {
  let path = event.currentTarget.getAttribute('data-path');

	document.querySelector(`[data-target="${path}"]`).classList.add('modal--visible');
	modalOverlay.classList.add('modal-overlay--visible');
});

modalOverlay.addEventListener('click', (event) => {
	if (event.target === modalOverlay) {
		modalOverlay.classList.remove('modal-overlay--visible');
	}
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
    surname.value, name.value, patronymic.value,
    birthDate.value, educationStartDate.value,
    faculty.value
  );

  // Валидация input
  if (Form.validateInput(student) && Form.validateInputDate(birthDate.value)) {
    Storage.pushStudent(student);

    widget.renderStudent(student);
    widget.clearInputFields();
    widget.renderAlert('Студент Добавлен', 'success');
  }
});
