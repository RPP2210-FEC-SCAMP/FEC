import React from 'react';

const AddQuestion = ({ product_id, onChangeQuestion, onChangeNickname, onChangeEmail, onSubmitQuestion, product_name }) => {

  return (
    <div className='QA-AddQuestion' onSubmit={(e) => onSubmitQuestion(e)}>
      <h1>Ask Your Question</h1>
      <h2>About the {product_name}</h2>
      <form className='QA-AddQuestion-Form' onSubmit={onSubmitQuestion}>
        <h3>Your Question(*)</h3>
        <textarea className='QA-Question-Text' maxLength='1000' onChange={onChangeQuestion}/>
        <h3>What is your nickname(*)</h3>
        <input
        className='QA-Question-Input'
        placeholder='Example: jackson11!'
        maxLength='60'
        onChange={onChangeNickname}
        ></input>
        {/* Might change span to div or p */}
        <span>For privacy reasons, do not use your full name or email address</span>
        <h3>Your email(*)</h3>
        <input
        className='QA-Question-Input'
        placeholder='Example: exampleemail@email.com'
        type='email'
        maxLength='60'
        onChange={onChangeEmail}
        ></input>
        {/* Might change span to div or p */}
        <span>For authentication reasons, you will not be emailed</span>
        <button type='submit'>Submit Your Question</button>
      </form>
    </div>
  );
}

export default AddQuestion