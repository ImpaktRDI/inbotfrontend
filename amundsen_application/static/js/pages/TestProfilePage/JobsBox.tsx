import * as React from 'react'
import Job from './Job'

const JobsBox = ({ joblist }) => {
  if (joblist.length === 0) { return <div><p>"Current job not available"</p></div> }
  else {
    return (
      <div className="container_j">
        {joblist.map((job, i) => {
          return (
            <Job
            key={i}
            title={job.title}
            company_name={job.company_name}
            company_url={job.company_url}
            />
          )}
        )}
      </div>
    )
}
}

export default JobsBox;