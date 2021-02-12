import * as React from 'react'
import Influencer from './Influencer';

const InfluencersBox = ({ influencers, target }) => {
    if (influencers.length == 0)
      return (
      <div className="container_column">
          <h3 className="influence_header">{ target }</h3>
          <p className="not-available">None available yet</p>
      </div>
      )
    else
      return (
        <div className="container_column">
          <h3 className="influence_header">{ target }</h3>
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