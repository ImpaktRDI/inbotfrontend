// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Link } from 'react-router-dom';

import { PostCommentResource } from 'interfaces';

import { getSourceDisplayName } from 'config/config-utils';

import { LoggingParams } from '../types';

export interface PostCommentListItemProps {
  post_comment: PostCommentResource;
  logging: LoggingParams;
}

class PostCommentListItem extends React.Component<PostCommentListItemProps, {}> {
  getLink = () => {
    const { post_comment, logging } = this.props;

    return (
      `/post_comment_detail/${post_comment.post_url}/${post_comment.person_name}` +
      `?index=${logging.index}&source=${logging.source}`
    );
  };
  render() {
    const { post_comment } = this.props;

    return (
      <li className="list-group-item clickable">
        <Link
          className="resource-list-item post_comment-list-item"
          to={this.getLink()}
        >
          <div className="resource-info">
            <div className="resource-info-text my-auto">
              <div className="resource-name title-2">
                <div className="truncated">
                  {`${post_comment.person_name}.${post_comment.post_url}`}
                </div>
              </div>
              <div className="body-secondary-3 truncated">
                {post_comment.post_comment_count}
              </div>
            </div>
          </div>
          <div className="resource-type">
            {getSourceDisplayName(post_comment.person_name, post_comment.type)}
          </div>
        </Link>
      </li>
    );
  }
}

export default PostCommentListItem;
