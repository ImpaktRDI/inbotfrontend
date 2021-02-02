import * as React from 'react'
import JobsBox from './JobsBox'

const ProfileBox = ({ person }) => {
  return (
    <div className="container_j">
        <div>
            <h1>{ person.name }</h1>
            <p>Headline: { person.headline }</p>
            <p>Location: { person.location }</p>
            <button className="button1_j"><a href={ person.profile_url }>LinkedIn profile</a></button>
        </div>
        <div className="header_j">
          <h2>Current job(s):</h2>
          <JobsBox joblist={ person.jobs } />
        </div>
    </div>
  )}

export default ProfileBox;
