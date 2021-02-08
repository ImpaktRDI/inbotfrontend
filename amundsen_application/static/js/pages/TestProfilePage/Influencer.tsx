import * as React from 'react'
import ProgressBar from './ProgressBar'

import linkedIn from './linkedin.svg'

const Influencer = ({influence_score, id, name, profile_url, headline}) => {
  const profile_link = "/profile/" + id;
  const influence_score_normalized = (influence_score/10) * 100;
  return (
    <div className="box_influencer">
      <a href={ profile_link }><h3>{name}</h3></a>
      <p>{headline}</p>
      <div className="progressbarbox">
        <a href={ profile_url }><img src={ linkedIn } alt="linkedin"></img></a>
        <ProgressBar percent={influence_score} />
        <strong>{influence_score_normalized.toFixed(1)} %</strong>        
      </div>
    </div>
  )
  }

export default Influencer;