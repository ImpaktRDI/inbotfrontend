import * as React from 'react'

const Job = ({title, company_name, company_url}) => {
    return (
      <div className="box_influencer">
        <h2>Company name: { company_name }</h2>
        <p>Job title: { title }</p>
        <button className="button1_j"><a href={ company_url }>LinkedIn company page</a></button>
      </div>
    )
  }

export default Job;