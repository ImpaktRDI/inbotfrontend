// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { connect } from 'react-redux';

import {
  getSourceDisplayName,
  getSourceIconClass,
  indexDashboardsEnabled,
  indexPeopleEnabled,
  indexPostCommentsEnabled,
  indexUsersEnabled,
} from 'config/config-utils';
import { buildDashboardURL } from 'utils/navigationUtils';

import { GlobalState } from 'ducks/rootReducer';
import {
  DashboardSearchResults,
  PostCommentSearchResults,
  TableSearchResults,
  UserSearchResults,
  PersonSearchResults,
} from 'ducks/search/types';

import {
  Resource,
  ResourceType,
  DashboardResource,
  TableResource,
  UserResource,
  PostCommentResource,
  PersonResource,
} from 'interfaces';
import ResultItemList from './ResultItemList';
import SearchItemList from './SearchItemList';

import './styles.scss';

import * as CONSTANTS from './constants';

export interface StateFromProps {
  isLoading: boolean;
  dashboards: DashboardSearchResults;
  tables: TableSearchResults;
  users: UserSearchResults;
  post_comments: PostCommentSearchResults
  people: PersonSearchResults;
}

export interface OwnProps {
  className?: string;
  onItemSelect: (resourceType: ResourceType, updateUrl?: boolean) => void;
  searchTerm: string;
}

export type InlineSearchResultsProps = StateFromProps & OwnProps;

export interface SuggestedResult {
  href: string;
  iconClass: string;
  subtitle: string;
  titleNode: React.ReactNode;
  type: string;
}

export class InlineSearchResults extends React.Component<
  InlineSearchResultsProps,
  {}
> {
  getTitleForResource = (resourceType: ResourceType): string => {
    switch (resourceType) {
      case ResourceType.dashboard:
        return CONSTANTS.DASHBOARDS;
      case ResourceType.table:
        return CONSTANTS.DATASETS;
      case ResourceType.user:
        return CONSTANTS.PEOPLE;
      case ResourceType.post_comment:
        return CONSTANTS.POST_COMMENTS;
      case ResourceType.person:
        return CONSTANTS.PEOPLE;
      default:
        return '';
    }
  };

  getTotalResultsForResource = (resourceType: ResourceType): number => {
    switch (resourceType) {
      case ResourceType.dashboard:
        return this.props.dashboards.total_results;
      case ResourceType.table:
        return this.props.tables.total_results;
      case ResourceType.user:
        return this.props.users.total_results;
      case ResourceType.post_comment:
        return this.props.post_comments.total_results;
      case ResourceType.person:
        return this.props.people.total_results;
      default:
        return 0;
    }
  };

  getResultsForResource = (resourceType: ResourceType): Resource[] => {
    switch (resourceType) {
      case ResourceType.dashboard:
        return this.props.dashboards.results.slice(0, 2);
      case ResourceType.table:
        return this.props.tables.results.slice(0, 2);
      case ResourceType.user:
        return this.props.users.results.slice(0, 2);
      case ResourceType.post_comment:
        return this.props.post_comments.results.slice(0, 2);
      case ResourceType.person:
        return this.props.people.results.slice(0, 2);
      default:
        return [];
    }
  };

  getSuggestedResultsForResource = (
    resourceType: ResourceType
  ): SuggestedResult[] => {
    const results = this.getResultsForResource(resourceType);
    return results.map((result, index) => {
      return {
        href: this.getSuggestedResultHref(resourceType, result, index),
        iconClass: this.getSuggestedResultIconClass(resourceType, result),
        subtitle: this.getSuggestedResultSubTitle(resourceType, result),
        titleNode: this.getSuggestedResultTitle(resourceType, result),
        type: this.getSuggestedResultType(resourceType, result),
      };
    });
  };

  getSuggestedResultHref = (
    resourceType: ResourceType,
    result: Resource,
    index: number
  ): string => {
    const logParams = `source=inline_search&index=${index}`;

    switch (resourceType) {
      case ResourceType.dashboard:
        const dashboard = result as DashboardResource;

        return `${buildDashboardURL(dashboard.uri)}?${logParams}`;
      case ResourceType.table:
        const table = result as TableResource;

        return `/table_detail/${table.cluster}/${table.database}/${table.schema}/${table.name}?${logParams}`;
      case ResourceType.user:
        const user = result as UserResource;

        return `/user/${user.user_id}?${logParams}`;
      default:
        return '';
    }
  };

  getSuggestedResultIconClass = (
    resourceType: ResourceType,
    result: Resource
  ): string => {
    switch (resourceType) {
      case ResourceType.dashboard:
        const dashboard = result as DashboardResource;
        return getSourceIconClass(dashboard.product, resourceType);
      case ResourceType.table:
        const table = result as TableResource;
        return getSourceIconClass(table.database, resourceType);
      case ResourceType.post_comment:
        return CONSTANTS.USER_ICON_CLASS;
      case ResourceType.person:
        return CONSTANTS.USER_ICON_CLASS;
      case ResourceType.user:
        return CONSTANTS.USER_ICON_CLASS;
      default:
        return '';
    }
  };

  getSuggestedResultSubTitle = (
    resourceType: ResourceType,
    result: Resource
  ): string => {
    switch (resourceType) {
      case ResourceType.dashboard:
        const dashboard = result as DashboardResource;
        return dashboard.description;
      case ResourceType.table:
        const table = result as TableResource;
        return table.description;
      case ResourceType.user:
        const user = result as UserResource;
        return user.team_name;
      case ResourceType.post_comment:
        const post_comment = result as PostCommentResource;
        return post_comment.person_name;
      case ResourceType.person:
        const person = result as PersonResource;
        return person.headline;
      default:
        return '';
    }
  };

  getSuggestedResultTitle = (
    resourceType: ResourceType,
    result: Resource
  ): React.ReactNode => {
    switch (resourceType) {
      case ResourceType.dashboard:
        const dashboard = result as DashboardResource;
        return (
          <div className="dashboard-title">
            <div className="title-2 dashboard-name">{dashboard.name}</div>
            <div className="title-2 dashboard-group truncated">
              {dashboard.group_name}
            </div>
          </div>
        );
      case ResourceType.table:
        const table = result as TableResource;
        return (
          <div className="title-2 truncated">{`${table.schema}.${table.name}`}</div>
        );
      case ResourceType.user:
        const user = result as UserResource;
        return <div className="title-2 truncated">{user.display_name}</div>;
      case ResourceType.post_comment:
        const post_comment = result as PostCommentResource;
        return <div className="title-2 truncated">{post_comment.person_name}</div>;
      case ResourceType.person:
        const person = result as PersonResource;
        return <div className="title-2 truncated">{person.name}</div>;
      default:
        return <div className="title-2 truncated" />;
    }
  };

  getSuggestedResultType = (
    resourceType: ResourceType,
    result: Resource
  ): string => {
    console.log("getSuggestedResultType")
    console.log(resourceType)
    switch (resourceType) {
      case ResourceType.dashboard:
        const dashboard = result as DashboardResource;
        return getSourceDisplayName(dashboard.product, resourceType);
      case ResourceType.table:
        const table = result as TableResource;
        return getSourceDisplayName(table.database, resourceType);
      case ResourceType.user:
        return CONSTANTS.PEOPLE_USER_TYPE;
      case ResourceType.post_comment:
        const post_comment = result as PostCommentResource;
        return getSourceDisplayName(post_comment.person_name, resourceType);
      case ResourceType.person:
        return resourceType;
      default:
        return '';
    }
  };

  renderResultsByResource = (resourceType: ResourceType) => {
    const suggestedResults = this.getSuggestedResultsForResource(resourceType);
    if (suggestedResults.length === 0) {
      return null;
    }
    return (
      <div className="inline-results-section">
        <ResultItemList
          onItemSelect={this.props.onItemSelect}
          resourceType={resourceType}
          searchTerm={this.props.searchTerm}
          suggestedResults={suggestedResults}
          totalResults={this.getTotalResultsForResource(resourceType)}
          title={this.getTitleForResource(resourceType)}
        />
      </div>
    );
  };

  renderResults = () => {
    if (this.props.isLoading) {
      return null;
    }
    return (
      <>
        {indexPeopleEnabled() && this.renderResultsByResource(ResourceType.person)}
        {indexPostCommentsEnabled() && this.renderResultsByResource(ResourceType.post_comment)}
      </>
    );
  };

  render() {
    const { className = '', onItemSelect, searchTerm } = this.props;
    return (
      <div id="inline-results" className={`inline-results ${className}`}>
        <div className="inline-results-section search-item-section">
          <SearchItemList onItemSelect={onItemSelect} searchTerm={searchTerm} />
        </div>
        {this.renderResults()}
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  const { isLoading, dashboards, tables, users, post_comments, people } = state.search.inlineResults;
  return {
    isLoading,
    dashboards,
    tables,
    users,
    post_comments,
    people,
  };
};

export default connect<StateFromProps, OwnProps>(mapStateToProps)(
  InlineSearchResults
);
