import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import QACard from './QACard.jsx';
import AddQuestion from './AddQuestion.jsx';
import AddAnswer from './AddAnswer.jsx';
import QASearchBar from './QASearchBar.jsx';
import getImagePath from '../lib/fileReader.js';
import missing from '../lib/filterMissing.js';

const QA = ({ id, product_name }) => {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [photos, setPhotos] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [moreQuestions, setMoreQuestions] = useState(false);
  const [search, setSearch] = useState('');

  useEffect((() => {
    async function fetchQuestions() {
      try {
        let options = {
          'url': '/questions',
          'params': {product_id: 71697}, //place the id prop here,
          'method': 'get'
        }
        let result = await axios.request(options);
        setQuestions(result.data);
      } catch(err) {
        console.log(err);
      }
    };

    fetchQuestions();
  }), [id]);

  const onSubmitQuestion = async (e) => {
    e.preventDefault();
    let body = {
      'question': questionText,
      'nickname': nickname,
      'email': email,
      'product_id': id
    }

    if (questionText === '' || nickname === '' || email === '') {
      alert(`You must enter the following: ${missing(body)}`);
      return;
    }

    try {
      await axios.post('/questions/add', body);
      alert(`Thank you for submitting your question: ${body.question}`);
    } catch (err) {
      alert('Your question was not submitted due to some internal error. Please try again shortly');
    }
  };

  const onSubmitAnswer = async (e) => {
    e.preventDefault();
    let body = {
      'answer': answerText,
      'nickname': nickname,
      'email': email,
      'photos': photos,
      'question_id': question.question_id
    }

    if (answerText === '' || nickname === '' || email === '') {
      alert(`You must enter the following: ${missing(body)}`);
      return;
    }

    try {
      await axios.post('/answer/add', body);
      alert(`Thank you for submitting your answer: ${body.answer}`);
    } catch (err) {
      alert('Your answer was not submitted due to some internal error. Please try again shortly');
    }
  };

  const isHelpful = async (e, id) => {
    await axios.put('/question/helpful', {'question_id': id });
  };

  const onChangeQuestion = (e) => {
    setQuestionText(e.target.value);
  };

  const onChangeAnswer = (e) => {
    setAnswerText(e.target.value);
  };

  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onInputPhoto = async (e) => {
    let photo = await getImagePath(e.target.files[0]);

    if (thumbnail === '') {setThumbnail(photo)};
    setPhotos([...photos, photo]);
  };

  const toggleShowQuestionModal =  (e) => {
    setShowQuestionModal(!showQuestionModal);
  };

  const toggleShowAnswerModal = (e, question, id) => {
    setShowAnswerModal(!showAnswerModal);
    setQuestion({'question_id': id, 'question': question});
  };

  const toggleMoreQuestions = (e) => {
    setMoreQuestions(!moreQuestions);
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
  };

  let sortedAndFilteredQuestions = [...questions].filter((question) => {
   return question.question_body.toLowerCase().includes(search.toLowerCase());
  })
  .sort((a, b) => {
    return a['question_helpfulness'] - b['question_helpfulness'];
  }).map((question) =>
      <QACard
        key={question.question_id}
        id={question.question_id}
        question={question.question_body}
        helpfulness={question.question_helpfulness}
        isHelpful={isHelpful}
        reported={question.reported}
        answers={question.answers}
        toggleShowAnswerModal={toggleShowAnswerModal}
      />
  );

  return (
    <>
      <div className='QA'>
        <QASearchBar onSearch={onSearch} search={search}/>

        {!moreQuestions ? sortedAndFilteredQuestions[0] : sortedAndFilteredQuestions}
        {!moreQuestions && sortedAndFilteredQuestions[1]}
        {
        moreQuestions && sortedAndFilteredQuestions.length > 2
        && <button className='QA-More-Questions' onClick={toggleMoreQuestions}>Less Answered Questions</button>
        }
        {
        !moreQuestions && sortedAndFilteredQuestions.length > 2
        && <button className='QA-More-Questions' onClick={toggleMoreQuestions}>More Answered Questions</button>
        }
        <button onClick={toggleShowQuestionModal}>Ask a question</button>
        {/* Double check if Addquestion is a Modal/test for it */}
        {showQuestionModal && createPortal(
          <AddQuestion
            product_id={id}
            product_name={product_name}
            onChangeQuestion={onChangeQuestion}
            onChangeNickname={onChangeNickname}
            onChangeEmail={onChangeEmail}
            onSubmitQuestion={onSubmitQuestion}
            toggleShowQuestionModal={toggleShowQuestionModal}
          />
          ,document.body
        )}
        {/* Do I need product_id in Answer Modal */}
        {showAnswerModal && createPortal(
          <AddAnswer
            product_name={product_name}
            question_body={question.question}
            id={question.question_id}
            thumbnail={thumbnail}
            length={photos.length}
            onChangeAnswer={onChangeAnswer}
            onChangeNickname={onChangeNickname}
            onChangeEmail={onChangeEmail}
            onInputPhoto={onInputPhoto}
            onSubmitAnswer={onSubmitAnswer}
            toggleShowAnswerModal={toggleShowAnswerModal}
         />
         , document.body
        )}
      </div>
    </>
  );
}

export default QA