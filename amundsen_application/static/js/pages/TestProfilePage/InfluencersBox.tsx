import * as React from 'react'
import Influencer from './Influencer';

const InfluencersBox = ({ influencers }) => {
    return (
      <div style={{ border: '5px solid black' }}>
        {influencers.map((influencer, i) => {
          return (
            <Influencer
            key={i}
            influence_score={influencer.influence_score}
            id={influencer.id}
            name={influencer.name}
            profile_url={influencer.profile_url}
            headline={influencer.headline}
            />
          );
          })
        }
      </div>
    );
  }

export default InfluencersBox;