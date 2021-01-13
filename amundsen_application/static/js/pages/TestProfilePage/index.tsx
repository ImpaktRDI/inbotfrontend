// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import InfluencersBox from './InfluencersBox';
import { dummydata } from './dummydata'


class TestProfilePage extends React.Component<{}, { [key: string]: string }> {
  constructor(props) {
    super(props)
    this.state = {
      profile_name: 'John Doe',
      company_name: '',
      title: '' 
    }
  }

  componentDidMount() {
    fetch("http://localhost:5000/api/profile/v0/person_details")
      .then(response => {
        return response.json();
      })
      .then(profile => {
        this.setState({ profile_name: profile.Name });
        this.setState({ company_name: profile.Job1.Company});
        this.setState({ title: profile.Job1.Title});
      });
  }


  render() {
  return (
      <div>
        <div>
          <h1>Profile: { this.state.profile_name }</h1>
          <p>{ this.state.title } at { this.state.company_name }</p>
        </div>
        <div>
          <InfluencersBox influencers={dummydata}/>
        </div>  
      </div>
  )}
}

export default TestProfilePage;
