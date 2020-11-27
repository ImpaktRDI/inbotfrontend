// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { indexDashboardsEnabled, indexPeopleEnabled, indexPostCommentsEnabled, indexUsersEnabled } from 'config/config-utils';

import { ResourceType } from 'interfaces';

import SearchItem from './SearchItem';

import * as CONSTANTS from '../constants';

export interface SearchItemListProps {
  onItemSelect: (resourceType: ResourceType, updateUrl: boolean) => void;
  searchTerm: string;
}

class SearchItemList extends React.Component<SearchItemListProps, {}> {
  getListItemText = (resourceType: ResourceType): string => {
    switch (resourceType) {
      case ResourceType.dashboard:
        return CONSTANTS.DASHBOARD_ITEM_TEXT;
      case ResourceType.table:
        return CONSTANTS.DATASETS_ITEM_TEXT;
      case ResourceType.user:
        return CONSTANTS.USER_ITEM_TEXT;
      case ResourceType.post_comment:
        return CONSTANTS.POST_COMMENT_ITEM_TEXT;
      case ResourceType.person:
        return CONSTANTS.PERSON_ITEM_TEXT;
      default:
        return '';
    }
  };

  render = () => {
    const { onItemSelect, searchTerm } = this.props;
    return (
      <ul className="list-group">
        <SearchItem
          listItemText={this.getListItemText(ResourceType.table)}
          onItemSelect={onItemSelect}
          searchTerm={searchTerm}
          resourceType={ResourceType.table}
        />
        {indexDashboardsEnabled() && (
          <SearchItem
            listItemText={this.getListItemText(ResourceType.dashboard)}
            onItemSelect={onItemSelect}
            searchTerm={searchTerm}
            resourceType={ResourceType.dashboard}
          />
        )}
        {indexUsersEnabled() && (
          <SearchItem
            listItemText={this.getListItemText(ResourceType.user)}
            onItemSelect={onItemSelect}
            searchTerm={searchTerm}
            resourceType={ResourceType.user}
          />
        )}
        {indexPostCommentsEnabled() && (
          <SearchItem
            listItemText={this.getListItemText(ResourceType.post_comment)}
            onItemSelect={onItemSelect}
            searchTerm={searchTerm}
            resourceType={ResourceType.post_comment}
          />
        )}
        {indexPeopleEnabled() && (
          <SearchItem
            listItemText={this.getListItemText(ResourceType.person)}
            onItemSelect={onItemSelect}
            searchTerm={searchTerm}
            resourceType={ResourceType.person}
          />
        )}
      </ul>
    );
  };
}

export default SearchItemList;
