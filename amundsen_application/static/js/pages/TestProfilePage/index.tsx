// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import InfluencersBox from './InfluencersBox';
import { dummydata } from './dummydata'


class TestProfilePage extends React.Component {
  render() {
  return (
      <div>
        <div>
          <h1>Profile Page - Testi Testaaja</h1>
          <p>Occupation: Testaaja</p>
        </div>
        <div>
          <InfluencersBox influencers={dummydata}/>
        </div>  
      </div>
  )}
}

export default TestProfilePage;
