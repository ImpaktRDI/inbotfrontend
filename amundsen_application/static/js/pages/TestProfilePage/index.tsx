// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react'; 
import { useState, useEffect } from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import InfluencersBox from './InfluencersBox';
import { dummydata } from './dummydata'

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

type ProfileState = {
  person: PersonDetails
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

function TestProfilePage({ match }): JSX.Element {
  const person_id = match.params.person_id
  const [profile, setProfile] = useState({ person: initialPerson } as ProfileState)


  useEffect(() => {
    fetch("http://localhost:5000/api/profile/v0/person_details", 
    {
      method: "POST", 
      body: JSON.stringify({ id: person_id }),
      headers: { 'Content-Type': 'application/json' }})
      .then(response => {return response.json()})
      .then(person => { setProfile({ person }) })
  }, [])

    return    (
      <div>
        <div>
          <h1>Profile: { profile.person.name }</h1>
        </div>
        <div>
          <InfluencersBox influencers={dummydata}/>
        </div>  
      </div>
    )
}


export default TestProfilePage;
