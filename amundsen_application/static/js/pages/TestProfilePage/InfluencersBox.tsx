import * as React from 'react'
import Influencer from './Influencer';

const InfluencersBox = ({ influencers }) => {
    return (
      <div style={{ border: '5px solid black' }}>
        {influencers.map((user, i) => {
          return (
            <Influencer
            key={i}
            id={influencers[i].id}
            name={influencers[i].name}
            occupation={influencers[i].occupation}
            />
          );
          })
        }
      </div>
    );
  }

export default InfluencersBox;