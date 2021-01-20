// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react'; 
import { useState, useEffect } from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

import ProfileBox from './ProfileBox'
import InfluencersBox from './InfluencersBox';
import { dummydata } from './dummydata';

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

function TestProfilePage({ match }): JSX.Element {
  const person_id = match.params.person_id
  const [profile, setProfile] = useState({ person: initialPerson } as ProfileState)
  const [personBox, setPersonBox] = useState(<div>Loading profile...</div>)
  const [influencerBox, setInfluencerBox] = useState(<div>Loading...</div>)

  //fetch current profile from backend by person_id (given by address parameter 'match.params.person_id')
  useEffect(() => {
    fetch("http://localhost:5000/api/profile/v0/person_details", 
    {
      method: "POST", 
      body: JSON.stringify({ id: person_id }),
      headers: { 'Content-Type': 'application/json' }})
      .then(response => {return response.json()})
      .then(person => { setProfile({ person }) })
  }, [person_id])

  //updates Page for current profile
  useEffect(() => {
      setPersonBox(<ProfileBox person={ profile.person } />)
  }, [profile])

  //updates Page for current profile
  useEffect(() => {
    fetch("http://localhost:5000/api/profile/v0/influencerlist", 
  {
    method: "POST", 
    body: JSON.stringify({ id: person_id }),
    headers: { 'Content-Type': 'application/json' }})
    .then(response => {return response.json()})
    .then(influencers_list => { 
      console.log(influencers_list.influencers);
      setInfluencerBox(<InfluencersBox influencers={ influencers_list.influencers } />) })
    
  }, [person_id])

  return (
    <div>
      <div>{ personBox }</div>
      <div>{ influencerBox }</div>
    </div>
  )
}

export default TestProfilePage;
