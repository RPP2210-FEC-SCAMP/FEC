import React, { useState, useEffect } from 'react'

const Answer = (props) => {
  const [answer, setAnswer] = useState({});
  const [helpful, setHelpful] = useState(false);

  useEffect(() => {
    setAnswer(props.answer);
  }, [props]);

  const onClickHelpful = (e) => {
    setHelpful(!helpful);
    props.isHelpful(e, answer.id)
  };

  return (
    <div className='Answer' key={answer.id}>
      <p>{answer.body}</p>
      <span className='Answer-NameDate'>By {answer.name}, {answer.date}</span>
      {!helpful ?
        <span className='Answer-helpful' onClick={onClickHelpful}> Helpful? {answer.helpfulness}</span> :
        <span className='Answer-helpful'> Helpful? {answer.helpfulness + 1}</span>
      }
      <span className='Answer-report'> Report/Reported </span>
  </div>
  );
}

export default Answer