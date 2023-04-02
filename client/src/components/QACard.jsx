import React, { useState, useMemo } from 'react';
import Answer from './Answer.jsx';
import axios from 'axios';

const QACard = ({ id, question, helpfulness, reported, answers, isHelpful, toggleShowAnswerModal }) => {
  const [moreAnswers, setMoreAnswers] = useState(false);
  const [helpful, setHelpful] = useState(false);


  const onClickHelpful = (e) => {
    setHelpful(!helpful);
    isHelpful(e, id);
  };

  const isHelpfulAnswer = async (e, id) => {
    await axios.put('/answer/helpful', {'answer_id': id});
    console.log('working');
  };

  const toggleMoreAnswers = (e) => {
    setMoreAnswers(!moreAnswers);
  };

  const answerComponent = Object.values(answers).map((answer) => {
    return (
        <Answer
          key={answer.id}
          isHelpful={isHelpfulAnswer}
          answer={answer}
        />
      )
  });

  return (
    <div className='QACard'>
      <div className='Question'>
        <div>Q: {question}</div>
        <div className='QA-Option'>
          <span className='Helpful'>Helpful?</span>
          {
            helpful === false ?
            <span onClick={onClickHelpful}>Yes ({helpfulness})  |</span> :
            <span>Yes ({helpfulness + 1})</span>
          }
          <span className='Question-add' onClick={(e) => toggleShowAnswerModal(e, question, id)}>   Add answer</span>
        </div>
      </div>

      <div className='QA-Answer'>
        A:
        {!moreAnswers ? answerComponent[0] : answerComponent}
        {!moreAnswers && answerComponent[1]}
        {!moreAnswers && answerComponent.length > 2
        && <div className='QA-more' onClick={toggleMoreAnswers}>See more answers</div>}
        {moreAnswers && <div className='QA-more' onClick={toggleMoreAnswers}>Collapse answers</div>}
      </div>
    </div>
  );
}

export default QACard
