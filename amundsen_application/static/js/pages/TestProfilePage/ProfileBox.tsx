import * as React from 'react'

const ProfileBox = ({ person }) => {
    if (person.jobs.length == 0) {
      return (
        <div className="container_j">
          <h1>{ person.name }</h1>
          <p>{ person.headline }</p>
        </div>
        )}
    else {
      return (
        <div className="container_j">
          <h1>{ person.name }</h1>
          <p>{ person.jobs[0].title } - { person.jobs[0].company_name }</p>
        </div>
  )}}

export default ProfileBox;
