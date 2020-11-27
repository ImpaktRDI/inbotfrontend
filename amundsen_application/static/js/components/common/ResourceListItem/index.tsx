// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import {
  Resource,
  ResourceType,
  DashboardResource,
  TableResource,
  UserResource,
  PostCommentResource,
  PersonResource,
} from 'interfaces';

import { LoggingParams } from './types';
import DashboardListItem from './DashboardListItem';
import TableListItem from './TableListItem';
import UserListItem from './UserListItem';
import PersonListItem from './PersonListItem'
import PostCommentListItem from './PostCommentListItem';

import './styles.scss';

export interface ListItemProps {
  logging: LoggingParams;
  item: Resource;
}

export default class ResourceListItem extends React.Component<ListItemProps> {
  render() {
    switch (this.props.item.type) {
      case ResourceType.dashboard:
        return (
          <DashboardListItem
            dashboard={this.props.item as DashboardResource}
            logging={this.props.logging}
          />
        );
      case ResourceType.table:
        return (
          <TableListItem
            table={this.props.item as TableResource}
            logging={this.props.logging}
          />
        );
      case ResourceType.user:
        return (
          <UserListItem
            user={this.props.item as UserResource}
            logging={this.props.logging}
          />
        );
      case ResourceType.post_comment:
        return (
          <PostCommentListItem
            post_comment={this.props.item as PostCommentResource}
            logging={this.props.logging}
          />
        );
      case ResourceType.person:
        return (
          <PersonListItem
            person={this.props.item as PersonResource}
            logging={this.props.logging}
          />
        );
      default:
        return null;
    }
  }
}
