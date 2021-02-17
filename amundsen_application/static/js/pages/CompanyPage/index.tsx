import * as React from 'react';
import { useState, useEffect } from 'react';

import CompanyBox from './CompanyBox'
import PeopleBox from './PeopleBox'

import SearchPanel from '../SearchPage/SearchPanel/index';
import SearchTypeSelector from '../SearchPage/SearchTypeSelector/index';

type Person = {
  id: string,
  name: string,
  title: string
}

type Company = {
  id: string,
  name: string,
  linkedin_url: string    
}

type CompanyDetails = {
  company: Company,
  people: Person[]
}

const initialCompany: CompanyDetails = {
  company: {id: '',
            name: '',
            linkedin_url: ''},
  people: []
}

function CompanyPage({ match }): JSX.Element {
  const company_id = match.params.company_id
  const [company, setCompany] = useState(initialCompany)
  const [companyBox, setCompanyBox] = useState(<div>Loading company data...</div>)
  const [peopleBox, setPeopleBox] = useState(<div>Loading...</div>)

  //fetch current company from backend by company_id (given by address parameter 'match.params.company_id')
  useEffect(() => {
    fetch("http://localhost:5000/api/company/v0/company_details", 
    {
      method: "POST", 
      body: JSON.stringify({ id: company_id }),
      headers: { 'Content-Type': 'application/json' }})
      .then(response => {return response.json()})
      .then(company_data => { setCompany(company_data as CompanyDetails) })
  }, [company_id])

    //updates Page for current company
  useEffect(() => {
      setCompanyBox(<CompanyBox company={ company.company } />)
      setPeopleBox(<PeopleBox people={ company.people} />)
  }, [company])



  return (
      <div className="page_row">
          <SearchPanel>
              <a href="/"><h3>&#8592; &nbsp;Back to search</h3></a>
              <SearchTypeSelector />
          </SearchPanel>
          <div className="page_column">
              { companyBox }
              <div className="page_row">
                  { peopleBox }
              </div>
          </div>
      </div>
  )
}

export default CompanyPage;