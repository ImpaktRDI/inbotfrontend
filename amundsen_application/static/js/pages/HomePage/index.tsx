// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

import { resetSearchState } from 'ducks/search/reducer';
import { UpdateSearchStateReset } from 'ducks/search/types';

import Breadcrumb from 'components/common/Breadcrumb';
import SearchBar from 'components/common/SearchBar';
import TagsListContainer from 'components/common/Tags';
import Announcements from 'components/common/Announcements';

import { announcementsEnabled } from 'config/config-utils';

import { SEARCH_BREADCRUMB_TEXT, HOMEPAGE_TITLE } from './constants';

import frontpage_rafiki from "../../../images/frontpage-rafiki.svg"

export interface DispatchFromProps {
  searchReset: () => UpdateSearchStateReset;
}

export type HomePageProps = DispatchFromProps & RouteComponentProps<any>;

export class HomePage extends React.Component<HomePageProps> {
  componentDidMount() {
    this.props.searchReset();
  }

  render() {
    /* TODO, just display either popular or curated tags,
    do we want the title to change based on which
    implementation is being used? probably not */
    return (
      <main className="container home-page">
        <div className="row">
          <div
            className={`col-xs-12 ${
              announcementsEnabled() ? 'col-md-8' : 'col-md-offset-1 col-md-10'
            }`}
          >
            <h1 className="sr-only">{HOMEPAGE_TITLE}</h1>
            <SearchBar />
            <div className="filter-breadcrumb pull-right">
              <Breadcrumb
                direction="right"
                path="/search"
                text={SEARCH_BREADCRUMB_TEXT}
              />
            </div>
          </div>
          <h1 className="frontpage-header">Welcome to <span className="inbot-brain">Inbot Brain</span>,<br></br> an intelligent graph for data-centric organizations.</h1>
          <img 
            className="frontpage-img" 
            src={frontpage_rafiki} 
            alt="mental-healts-brain">
          </img>
          {announcementsEnabled() && (
            <div className="col-xs-12 col-md-offset-1 col-md-3">
              <Announcements />
            </div>
          )}
        </div>
      </main>
    );
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      searchReset: () => resetSearchState(),
    },
    dispatch
  );
};

export default connect<DispatchFromProps>(null, mapDispatchToProps)(HomePage);
