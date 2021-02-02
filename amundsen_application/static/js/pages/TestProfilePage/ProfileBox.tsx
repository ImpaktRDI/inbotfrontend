import * as React from 'react'
import JobsBox from './JobsBox'

const ProfileBox = ({ person }) => {
  return (
    <div>
        <div>
            <h1>{ person.name }</h1>
        </div>
        <div>
          <JobsBox joblist={ person.jobs } />
        </div>
    </div>
  )}

export default ProfileBox;
