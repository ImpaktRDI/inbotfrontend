// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react'; 
import { useState, useEffect } from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import './Boxstyle.scss';

import PersonBox from './PersonBox'
import InfluencersBox from './InfluencersBox';

import SearchPanel from '../SearchPage/SearchPanel/index';
import SearchTypeSelector from '../SearchPage/SearchTypeSelector/index';

type Job = {
  title: string,
  company_name: string,
  company_url: string
}

type PersonDetails = {
  id: string,
  name: string,
  profile_url: string,
  headline: string,
  jobs: Job[],
  description: string,
  location: string
}

type PersonState = {
  person: PersonDetails
}

type InfluencerDetails = {
  id: string,
  influence_score: number,
  name: string,
  profile_url: string,
  headline: string,
  jobs: Job[]
}

type InfluencerState = {
  influencer: InfluencerDetails[]
}

const initialPerson: PersonDetails = {
  id: '',
  name: '',
  profile_url: '',
  headline: '',
  jobs: [],
  description: '',
  location: ''
}

function PersonPage({ match }): JSX.Element {
  const person_id = match.params.person_id
  const [person, setPerson] = useState({ person: initialPerson } as PersonState)
  const [personBox, setPersonBox] = useState(<div>Loading person data...</div>)
  const [influencedByBox, setInfluencedByBox] = useState(<div>Loading...</div>)
  const [influencingToBox, setInfluencingToBox] = useState(<div>Loading...</div>)

  //fetch current person from backend by person_id (given by address parameter 'match.params.person_id')
  useEffect(() => {
    fetch("http://localhost:5000/api/person/v0/person_details", 
    {
      method: "POST", 
      body: JSON.stringify({ id: person_id }),
      headers: { 'Content-Type': 'application/json' }})
      .then(response => {return response.json()})
      .then(person => { setPerson({ person }) })
  }, [person_id])

  //updates Page for current person
  useEffect(() => {
      setPersonBox(<PersonBox person={ person.person } />)
  }, [person])

  //updates Page for current person
  useEffect(() => {
    fetch("http://localhost:5000/api/person/v0/influencerlist", 
  {
    method: "POST", 
    body: JSON.stringify({ id: person_id }),
    headers: { 'Content-Type': 'application/json' }})
    .then(response => {return response.json()})
    .then(influencers_list => { 
      console.log(influencers_list);
      setInfluencingToBox(<InfluencersBox influencers={ influencers_list.influencing_to } target={ "Influences:"} />);
      setInfluencedByBox(<InfluencersBox influencers={ influencers_list.influenced_by } target={ "Influenced by:"} />)})
    
  }, [person_id])

  return (
    <div className="page_row">
      <SearchPanel>
        <a href="/"><h3>&#8592; &nbsp;Back to search</h3></a>
        <SearchTypeSelector />
      </SearchPanel>
      <div className="page_column">
        { personBox }
        <div className="page_row">
          { influencingToBox }
          { influencedByBox }
        </div>
      </div>
    </div>
  )
}

export default PersonPage;
