import React, { useState, useEffect } from 'react';

const QASearchBar = ({ onSearch, search }) => {

  return (
    <>
      <input
        className='QASearchBar'
        type='text'
        placeholder='Have a question? Search for answers…'
        value={search}
        onChange={onSearch}
      ></input>
    </>
  );
}

export default QASearchBar