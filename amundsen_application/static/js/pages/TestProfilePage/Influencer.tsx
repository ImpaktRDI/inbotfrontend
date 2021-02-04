import * as React from 'react'
import ProgressBar from './ProgressBar'

const Influencer = ({influence_score, id, name, profile_url, headline}) => {
    return (
      <div className="box_influencer">
        <a href={ profile_url }>
          <h3>{name}</h3>
          <p>{headline}</p>
          <div className="progressbarbox">
            <strong>{influence_score.toFixed(1)} </strong>
            <ProgressBar percent={influence_score} />
          </div>
        </a>
      </div>
    )
  }

export default Influencer;