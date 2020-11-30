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
