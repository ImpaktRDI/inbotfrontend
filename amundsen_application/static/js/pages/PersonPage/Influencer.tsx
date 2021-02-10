import * as React from 'react'

const Influencer = ({influence_score, id, name, profile_url, headline}) => {
    return (
      <div className="box_j">
        <h2>{name}</h2>
        <p>Influence Score: {influence_score}</p>
        <p>Headline: {headline}</p>
        <button className="button1_j"><a href={ profile_url }>LinkedIn profile</a></button>
      </div>
    )
  }

export default Influencer;