import * as React from 'react'
import Influencer from './Influencer';

const InfluencersBox = ({ influencers, target }) => {
  console.log(influencers)
    if (influencers.length == 0)
      return (
      <div className="container_j">
        <div className="header_j">
          <h1>{ target } None</h1>
        </div>
      </div>
      )
    else
      return (
        <div className="container_j">
          <div className="header_j">
            <h1>{ target }</h1>
          </div>
          <div className="container_j">
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
        </div>
      );
  }

export default InfluencersBox;