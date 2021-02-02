import * as React from 'react'

const Influencer = ({influence_score, id, name, profile_url, headline}) => {
    return (
      <div style={{ border: '5px solid black' }}>
        <h2>{name}</h2>
        <p>{influence_score}</p>
        <p>{profile_url}</p>
        <p>{headline}</p>
      </div>
    )
  }

export default Influencer;