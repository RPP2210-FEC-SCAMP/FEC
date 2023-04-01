import React, { useState, useEffect } from 'react';

const QASearchBar = ({ onSearch, search }) => {

  return (
    <div className='QASearchBar'>
      <input
        type='text'
        placeholder='Have a question? Search for answers…'
        value={search}
        onChange={onSearch}
      ></input>
    </div>
  );
}

export default QASearchBar