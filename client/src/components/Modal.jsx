import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Modal = ({ handleClose, show, reviewModal, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main" id={reviewModal}>
        <button className='closeButton' type="button" onClick={handleClose}>✖</button>
        {children}
      </section>
    </div>
  );
};

export default Modal;