// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Link } from 'react-router-dom';

import { PersonResource } from 'interfaces';

import { LoggingParams } from '../types';

export interface PersonListItemProps {
  person: PersonResource;
  logging: LoggingParams;
}

class PersonListItem extends React.Component<PersonListItemProps, {}> {
  getLink = () => {
    const { person, logging } = this.props;

    return (
      `/person_detail/${person.name}` +
      `?index=${logging.index}&source=${logging.source}`
    );
  };
  render() {
    const { person } = this.props;

    return (
      <li className="list-group-item clickable">
        <Link
          className="resource-list-item person-list-item"
          to={this.getLink()}
        >
          <div className="resource-info">
            <div className="resource-info-text my-auto">
              <div className="resource-name title-2">
                <div className="truncated">
                  {`${person.name}`}
                </div>
              </div>
              <div className="body-secondary-3 truncated">
                {person.headline && person.headline}
              </div>
            </div>
          </div>
        </Link>
      </li>
    );
  }
}

export default PersonListItem;
