import * as React from 'react'

const Influencer = ({influence_score, id, name, profile_url, headline}) => {
    return (
      <div className="box_influencer">
        <a href={ profile_url }>
          <h2>{name}</h2>
          <p>Influence Score: {influence_score}</p>
          <p>Headline: {headline}</p>
        </a>
      </div>
    )
  }

export default Influencer;