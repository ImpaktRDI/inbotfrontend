import * as React from 'react'

const Influencer = ({id, name, occupation}) => {
    return (
      <div style={{ border: '5px solid black' }}>
        <h2>{name}</h2>
        <p>{occupation}</p>
      </div>
    )
  }

export default Influencer;