// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  indexDashboardsEnabled,
  indexUsersEnabled,
  indexPostCommentsEnabled,
  indexPeopleEnabled } from 'config/config-utils';
import { GlobalState } from 'ducks/rootReducer';
import { updateSearchState } from 'ducks/search/reducer';
import {
  DashboardSearchResults,
  PostCommentSearchResults,
  PersonSearchResults,
  TableSearchResults,
  UpdateSearchStateRequest,
  UserSearchResults,
} from 'ducks/search/types';
import { ResourceType } from 'interfaces/Resources';
import {
  POST_COMMENT_RESOURCE_TITLE,
  PERSON_RESOURCE_TITLE,
} from '../constants';

const RESOURCE_SELECTOR_TITLE = 'Resource';

export interface StateFromProps {
  resource: ResourceType;
  post_comments: PostCommentSearchResults;
  people: PersonSearchResults;
}

export interface DispatchFromProps {
  setResource: (resource: ResourceType) => UpdateSearchStateRequest;
}

export type ResourceSelectorProps = StateFromProps & DispatchFromProps;

interface ResourceOptionConfig {
  type: ResourceType;
  label: string;
  count: number;
}

export class ResourceSelector extends React.Component<ResourceSelectorProps> {
  onChange = (event) => {
    this.props.setResource(event.target.value);
  };

  renderRadioOption = (option: ResourceOptionConfig, index: number) => {
    return (
      <div key={`resource-radio-item:${index}`} className="radio">
        <label className="radio-label">
          <input
            type="radio"
            name="resource"
            value={option.type}
            checked={this.props.resource === option.type}
            onChange={this.onChange}
          />
          <span className="subtitle-2">{option.label}</span>
          <span className="body-secondary-3 pull-right">{option.count}</span>
        </label>
      </div>
    );
  };

  render = () => {
    const resourceOptions: ResourceOptionConfig[] = [];

    if (indexPostCommentsEnabled()) {
      resourceOptions.push({
        type: ResourceType.post_comment,
        label: POST_COMMENT_RESOURCE_TITLE,
        count: this.props.post_comments.total_results,
      });
    }

    if (indexPeopleEnabled()) {
      resourceOptions.push({
        type: ResourceType.person,
        label: PERSON_RESOURCE_TITLE,
        count: this.props.people.total_results,
      });
    }

    return (
      <>
        <h2 className="title-2">{RESOURCE_SELECTOR_TITLE}</h2>
        {resourceOptions.map((option, index) =>
          this.renderRadioOption(option, index)
        )}
      </>
    );
  };
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    resource: state.search.resource,
    post_comments: state.search.post_comments,
    people: state.search.people,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      setResource: (resource: ResourceType) =>
        updateSearchState({ resource, updateUrl: true }),
    },
    dispatch
  );
};

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ResourceSelector);
