import React, { useState, useEffect } from 'react';
import { format, parseISO } from "date-fns";
import ShadedStar from './ShadedStar.jsx';
import Modal from './Modal.jsx';
import getFirstN from '../lib/getFirstN.js';

const ReviewTile = ({ review, addHelpful, helpfulness, reportFunc }) => {
  const [hov, setHov] = useState(false);
  const [rhov, setRHov] = useState(false);
  const [helped, setHelped] = useState(false);
  const [helpful, setHelpful] = useState(helpfulness);
  const [modalStatus, setModalStatus] = useState(-1);
  const [bodyText, setBodyText] = useState(getFirstN(review.body, 250));
  const sumText = getFirstN(review.summary, 40);
  var sumRemain;
  if (review.summary.length > 40) {
    sumRemain = review.summary.substring(sumText.length-1);
  } else {
    sumRemain = '';
  }

  const openPhoto = (count) => {
    setModalStatus(count);
  }

  const closePhoto = () => {
    setModalStatus(-1);
  }

  const changeHelp = () => {
    if (!helped) {
      addHelpful(review.review_id);
      setHelped(true);
      setHelpful(helpful + 1);
    }
  }

  const reportReview = () => {
    reportFunc(review.review_id);
  }

  return (
    <div className='reviewTile'>
      <div className='tileTop'>
        <div className='reviewStarRating'>
          <div>
            {'★'.repeat(Math.floor(review.rating))}
          </div>
          <ShadedStar shade={review.rating % 1}/>
          <div>
            {'☆'.repeat(5-Math.floor(review.rating))}
          </div>
        </div>
        <div className='reviewNameDate'>
          {review.reviewer_name ? '☑' + review.reviewer_name + ', ' : 'Cognito, '}
          {format(parseISO(review.date), 'MMMM dd, yyyy')}
        </div>
      </div>
      <h4 className='reviewSummary'>
        {sumText}
        {sumRemain.length ? '...' : ''}
        <div className='flexcolumn sumRemain'>
          {sumRemain.length ? '...' + sumRemain : ''}
        </div>
      </h4>
      <div className='reviewRecommended'>
        {review.recommend ? '✓ I recomment this product' : ''}
      </div>
      <div className='reviewBody'>
        {bodyText}
        {bodyText.length < review.body.length ? '...' : ''}
        {bodyText.length < review.body.length ? (
          <div className='flexcolumn' className='increaseReviewBody' onClick={() => {setBodyText(review.body)}}>
            Show more
          </div>) : ''}

      </div>
      <div className='reviewPhotos'>
        {review.photos.map((photoUrl, counter) => {
          return (
            <div key={Math.random()}>
              <img
                className='reviewThumbnail'
                src={photoUrl.url}
                alt='Review Photo'
                onClick={() => {openPhoto(counter)}}
              />
              <Modal show={modalStatus === counter} handleClose={closePhoto} reviewModal={'reviewModal'}>
                <img
                  key={Math.random()}
                  className='reviewPhotoModal'
                  src={photoUrl.url}
                  alt='Review Photo'
                />
              </Modal>
            </div>
          )
        })}
      </div>
      <div className='reviewHelpfulness'>
        <div style={{marginRight: '3px'}}>
          Helpful?
        </div>
        <div
          style={hov ? {cursor: 'pointer'} : { textDecoration: 'underline' }}
          className='yesBtn'
          onMouseEnter={() => {if (!helped) {setHov(true)}}}
          onMouseLeave={() => {setHov(false)}}
          onClick={changeHelp}>
          Yes
        </div>
        <div>
          {`(${helpful})`}
        </div>
        <div style={{marginLeft: '3px'}}>
          |
        </div>
        <div
          style={rhov ? {cursor: 'pointer'} : { textDecoration: 'underline' }}
          className='reportBtn'
          onMouseEnter={() => {setRHov(true)}}
          onMouseLeave={() => {setRHov(false)}}
          onClick={reportReview}>
          Report
        </div>
      </div>
      {review.response ?
        <div className='reviewResponse'>
          <div style={{marginBottom: '10px', paddingTop: '5px', paddingLeft: '5px', fontWeight: 'bold'}}>
            Response:
          </div>
          <div style={{paddingBottom: '10px', paddingLeft: '5px'}}>
            {'Here is the response'}
          </div>
        </div> : <></>}

      <div className='line'>
      </div>
    </div>
  )
}

export default ReviewTile;