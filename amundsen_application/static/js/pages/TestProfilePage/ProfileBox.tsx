import * as React from 'react'

import linkedIn_big from '../../../images/icons/linkedin_big.svg'

const ProfileBox = ({ person }) => {
    if (person.jobs.length == 0) {
      return (
        <div className="container_profile">
          <div className="profile_header_row">
            <h1>{ person.name }</h1>
            <a href={ person.profile_url }><img src={linkedIn_big} alt="linkedin"></img></a>
          </div>
          <p className="profile_headline">{ person.headline }</p>
        </div>
        )}
    else {
      return (
        <div className="container_profile">
          <div className="profile_header_row">
            <h1>{ person.name }</h1>
            <a href={ person.profile_url }><img src={linkedIn_big} alt="linkedin"></img></a>
          </div>
          <p className="profile_headline">{ person.jobs[0].title } - { person.jobs[0].company_name }</p>
        </div>
  )}}

export default ProfileBox;
