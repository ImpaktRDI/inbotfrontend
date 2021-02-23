import * as React from 'react'
import ProgressBar from './ProgressBar'

import linkedIn from '../../../images/icons/linkedin.svg'

const INFLUENCE_SCORE_NORMALIZATION_VALUE = 10; /* Adjust this value to modify influence score. ***NOT ACTUALLY NORMALIZED*** */

const Influencer = ({influence_score, id, name, profile_url, headline}) => {
  const person_link = "/person/" + id;
  const influence_score_normalized = Math.min(100, (influence_score/INFLUENCE_SCORE_NORMALIZATION_VALUE) * 100);
  return (
    <div className="box_influencer">
      <a href={ person_link }><h3>{name}</h3></a>
      <p>{headline}</p>
      <div className="progressbarbox">
        <a href={ profile_url }><img src={ linkedIn } alt="linkedin"></img></a>
        <ProgressBar percent={influence_score_normalized} />
        <strong>{influence_score_normalized.toFixed(0)}</strong>        
      </div>
    </div>
  )
  }

export default Influencer;