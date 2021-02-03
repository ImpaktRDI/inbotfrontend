import * as React from 'react'

const ProfileBox = ({ person }) => {
  const jobInfo = () => {
    if (person.jobs.length == 0) {return person.headline}
    else return person.jobs[0][0] + " - " + person.jobs[0][0]
    };
  
  return (
    <div className="container_j">
      <h1>{ person.name }</h1>
      <p>{ jobInfo }</p>
    </div>
  )}

export default ProfileBox;
