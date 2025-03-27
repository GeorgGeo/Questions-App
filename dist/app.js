

document.addEventListener('DOMContentLoaded', (e) => {
  const createCard = document.getElementById('correct');
  const mainCard = document.querySelector('.main-card');
  const createQuiz = document.querySelector('.create-quiz');
  const interactiveQuiz = document.querySelector('.interactive-quiz');
  const questionnaireForm = document.getElementById('questionnaireForm');
  const interactiveForm = document.getElementById('interactiveForm');
  const addQuestionButton = document.getElementById('addQuestion');

  const saveQuestionnaire = document.getElementById('saveQuestion');
  const mainCardRow = document.querySelector('.main-card .container .row');

  let questionCounter = 1;
  let startTime;

  createCard.addEventListener('click', (e) => {
    const mainCardStyles = window.getComputedStyle(mainCard);
    const createQuizStyles = window.getComputedStyle(createQuiz);
    
    console.log('mainCard display:', mainCardStyles.display);
    console.log('createQuiz display:', createQuizStyles.display);

    mainCard.style.display = 'none';
    createQuiz.classList.add('actives');
  });

  document.getElementById('start').addEventListener('click', () => {
    mainCard.style.display = 'none';
    interactiveQuiz.style.display = 'block';
    startTime = new Date();
    // Здесь можно загрузить вопросы из базы данных и добавить их в форму
    // Загрузка вопросов в интерактивную форму
    loadQuestionsForInteractive();
  });

  //===================
  async function loadQuestionsForInteractive() {
    const interactiveForm = document.getElementById('interactiveForm');
    interactiveForm.innerHTML = '';// Очищаем форму

    // Получаем все вопросы (в реальном приложении - из Firebase)
    const questions = Array.from(document.querySelectorAll('.question-template:not([style*="display: none"])'))
    .map((q, index) => ({
      number: index + 1,
      text: q.querySelector('input[type="text"]').value,
      type: q.querySelector('select').value
    }));

    // Создаем элементы формы для каждого вопроса
    questions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'col-12 mb-4';
    
    questionDiv.innerHTML = `
      <label class="visually-label p-3">${question.number}. ${question.text}</label>
      ${createInputField(question)}
    `;
    
      interactiveForm.insertBefore(questionDiv, interactiveForm.lastElementChild);
    });

  }

  function createInputField(question) {
    switch(question.type) {
      case 'text':
        return `<input type="text" class="form-control" name="q${question.number}" placeholder="Ваш ответ">`;
      case 'single':
        return `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="q${question.number}" id="q${question.number}_1" value="Вариант 1">
            <label class="form-check-label" for="q${question.number}_1">Вариант 1</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="q${question.number}" id="q${question.number}_2" value="Вариант 2">
            <label class="form-check-label" for="q${question.number}_2">Вариант 2</label>
          </div>
        `;
      case 'multiple':
        return `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="q${question.number}" id="q${question.number}_1" value="Вариант 1">
            <label class="form-check-label" for="q${question.number}_1">Вариант 1</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="q${question.number}" id="q${question.number}_2" value="Вариант 2">
            <label class="form-check-label" for="q${question.number}_2">Вариант 2</label>
          </div>
        `;
      default:
        return '';
    }
  }
  //=================
  addQuestionButton.addEventListener('click', (e) => {
    // questionCounter++;
    // const questionTemplate = document.querySelector('.question-template').cloneNode(true);//находит элемент с классом .question-template, клонирует его (со всем содержимым) и сохраняет в переменную questionTemplate. Но копия пока не видна на странице
    // questionTemplate.style.display = 'flex';
    // questionTemplate.querySelector('.input-group-text').textContent = questionCounter + '.';

    // questionTemplate.querySelector('.remove-question').addEventListener('click', (e) => {
    //   questionTemplate.remove();
    // });
    // console.log(addQuestionButton.parentElement);
    // console.log(questionnaireForm);

    // questionnaireForm.insertBefore(questionTemplate, addQuestionButton.parentElement);
    // Добавляем клонированный элемент в форму в конец
    // questionnaireForm.appendChild(questionTemplate);
    //==========
    const questions = document.querySelectorAll('.question-template:not([style*="display: none"])');
    const newNumber = questions.length + 1;

    const questionTemplate = document.querySelector('.question-template').cloneNode(true);
    questionTemplate.style.display = 'flex';
    questionTemplate.querySelector('.input-group-text').textContent = newNumber + '.';

    questionTemplate.querySelector('.remove-question').addEventListener('click', (e) => {
      questionTemplate.remove();
      renumberQuestions();
    });

    questionnaireForm.insertBefore(questionTemplate, addQuestionButton.parentElement);

    // Автоматическая нумерация при любых изменениях
    function renumberQuestions() {
      const questions = document.querySelectorAll('.question-template:not([style*="display: none"])');
      questions.forEach((question, index) => {
        question.querySelector('.input-group-text').textContent = (index + 1) + '.';
      });
    }
  });

  saveQuestionnaire.addEventListener('click', (e) => {
    e.preventDefault();

    // 1. Собираем данные анкеты
    const questions = Array.from(document.querySelectorAll('.question-template:not([style*="display: none"])')).map(q => ({
      text: q.querySelector('input[type="text"]').value,
      type: q.querySelector('select').value
    }));

    // 2. Создаем новую карточку
    const cardTemplate = document.querySelector('.card-template').cloneNode(true);

    // уникальные ID для новых карточек
    cardTemplate.id = `card-${Date.now()}`;

    // 3. Заполняем данные карточки
    cardTemplate.querySelector('.card-title').textContent = 'Новая анкета';
    cardTemplate.querySelector('.card-subtitle').textContent = `Содержит ${questions.length}`;
    cardTemplate.querySelector('.card-link').textContent = `Вопросы: ${questions.length}`;
    cardTemplate.querySelector('.card-text').textContent = `Вопросов: ${questions.length}`;

    // 4. Добавляем обработчики для новой карточки
    cardTemplate.querySelector('#correct').addEventListener('click', (e) => {
      document.querySelector('.main-card').style.display = 'none';
      createQuiz.classList.add('actives');
    });

    cardTemplate.querySelector('#start').addEventListener('click', (e) => {
      document.querySelector('.main-card').style.display = 'none';
      interactiveQuiz.style.display = 'block';
      startTime = new Date();
    });

    cardTemplate.querySelector('#del').addEventListener('click', (e) => {
      if (confirm('Удалить эту анкету?')) {
        this.closest('.card-template').remove();
      }
    });

    // 5. Добавляем карточку в основной раздел
    mainCardRow.appendChild(cardTemplate);

    // 6. Закрываем форму создания и показываем основной раздел
    createQuiz.classList.remove('actives');
    document.querySelector('.main-card').style.display = 'block';

    // console.log('Анкета сохранена!', questions);
  });

  questionnaireForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Здесь можно сохранить данные анкеты в базе данных
    // alert('Анкета сохранена!');
    const questions = Array.from(document.querySelectorAll('.question-template:not([style*="display: none"])')).map(q => ({
      text: q.querySelector('input[type="text"]').value,
      type: q.querySelector('select').value
    }));
    console.log('Сохраненные вопросы:', questions);
    // Отправка на сервер...
    });

  // interactiveForm.addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   const endTime = new Date();
  //   const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
  //   document.getElementById('timeTaken').textContent = `${timeTaken} сек.`;

  //   const answersSummary = document.getElementById('answersSummary');
  //   answersSummary.innerHTML = '';
  //   Array.from(interactiveForm.elements).forEach(element => {
  //     if (element.type !== 'submit') {
  //       const li = document.createElement('li');
  //       li.textContent = `${element.name}: ${element.value}`;
  //       answersSummary.appendChild(li);
  //     }
  //   });

  //   document.querySelector('.summary').style.display = 'block';
  //   // Здесь можно сохранить ответы в базе данных
  // });

  interactiveForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const endTime = new Date();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    // Собираем ответы
    const answers = {};
    Array.from(interactiveForm.elements).forEach(element => {
      if (element.name && (element.type === 'text' || element.checked)) {
        answers[element.name] = element.value || element.checked;
      }
    });

    // Сохраняем в Firebase
    try {
      // await db.collection('response').add({
      //   answers,
      //   timeTaken,
      //   createAt: firebase.forestore.FieldValue.serverTimestamp(),
      // });
      await firebase.addDoc(firebase.collection(firbase.db, 'responses'), {
        answers,
        timeTaken,
        createdAt: firebase.serverTimestamp()
      });

      // Показываем результаты
      showResults(answers, timeTaken);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Произошла ошибка при сохранении ответов');
    }

  });

  function showResults(answers, timeTaken) {
    const answersSummary = document.getElementById('answersSummary');
    answersSummary.innerHTML = '';
    
    for (const [question, answer] of Object.entries(answers)) {
      const li = document.createElement('li');
      li.textContent = `Вопрос ${question.replace('q', '')}: ${answer}`;
      answersSummary.appendChild(li);
    }
    
    document.getElementById('timeTaken').textContent = `${timeTaken} сек.`;
    document.querySelector('.summary').style.display = 'block';
  }
});