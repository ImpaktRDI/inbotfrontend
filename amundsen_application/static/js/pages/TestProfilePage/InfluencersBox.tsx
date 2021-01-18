import * as React from 'react'
import Influencer from './Influencer';

const InfluencersBox = ({ influencers }) => {
    return (
      <div style={{ border: '5px solid black' }}>
        {influencers.map((user, i) => {
          return (
            <Influencer
            key={i}
            id={user.id}
            name={user.name}
            occupation={user.occupation}
            />
          );
          })
        }
      </div>
    );
  }

export default InfluencersBox;