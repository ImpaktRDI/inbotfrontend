import * as React from 'react'

const Job = ({title, company_name, company_url}) => {
    return (
      <div style={{ border: '5px solid black' }}>
        <h2>{ title }</h2>
        <p>{ company_name }</p>
        <p>{ company_url }</p>
      </div>
    )
  }

export default Job;