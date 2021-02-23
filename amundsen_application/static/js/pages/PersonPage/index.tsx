// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0
import axios, { AxiosResponse } from 'axios';
import * as React from 'react'; 
import { useState, useEffect } from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import './Boxstyle.scss';

import PersonBox from './PersonBox'
import InfluencersBox from './InfluencersBox';

import SearchPanel from '../SearchPage/SearchPanel/';
import ResourceSelector from '../SearchPage/ResourceSelector/';

const PERSON_BASE = '/api/person/v0'

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
  person_details: PersonDetails
  influence: InfluenceState
}

type InfluenceState = {
  influences: InfluencerDetails[]
  influencers: InfluencerDetails[]
}

type InfluencerDetails = {
  id: string,
  influence_score: number,
  name: string,
  profile_url: string,
  headline: string,
  jobs: Job[]
}

const initialPersonDetails: PersonDetails = {
  id: '',
  name: '',
  profile_url: '',
  headline: '',
  jobs: [],
  description: '',
  location: ''
}

const initialInfluence: InfluenceState = {
  influences: [],
  influencers: []
}

function PersonPage({ match }): JSX.Element {
  const person_id = match.params.person_id
  const [personState, setPersonState] = useState({ person_details: initialPersonDetails, influence: initialInfluence } as PersonState)
  const [personBox, setPersonBox] = useState(<div>Loading person data...</div>)
  const [influencedByBox, setInfluencedByBox] = useState(<div>Loading...</div>)
  const [influencingToBox, setInfluencingToBox] = useState(<div>Loading...</div>)

  //fetch current person from backend by person_id (given by address parameter 'match.params.person_id')
  useEffect(() => {
    axios.post(
      `${PERSON_BASE}/person`,
      { id: person_id },
      { headers: { 'Content-Type': 'application/json' }})
    .then((response: AxiosResponse<PersonState>) => {
      const { data } = response;
      return data
    })
    .then((personState: PersonState) => {
      setPersonState(personState)
    })
  }, [person_id])

  //updates Page for current person
  useEffect(() => {
    setPersonBox(<PersonBox person={ personState.person_details } />)
    setInfluencingToBox(<InfluencersBox influencers={ personState.influence.influences } target={ "Influences:"} />);
    setInfluencedByBox(<InfluencersBox influencers={ personState.influence.influencers } target={ "Influenced by:"} />);
  }, [personState])

  return (
    <div className="person-page">
      <SearchPanel>
        <ResourceSelector />
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
