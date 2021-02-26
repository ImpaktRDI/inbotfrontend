// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Link } from 'react-router-dom';

import personSvg from '../../../../../../../images/icons/people.svg';

export interface ResultItemProps {
  id: string;
  href: string;
  iconClass: string;
  onItemSelect: (event: MouseEvent) => void;
  subtitle: string;
  titleNode: React.ReactNode;
  type: string;
}

const ResultItem: React.FC<ResultItemProps> = ({
  href,
  iconClass,
  id,
  onItemSelect,
  subtitle,
  titleNode,
  type,
}: ResultItemProps) => {
  return (
    <li className="list-group-item">
      <Link
        id={id}
        className="result-item-link"
        onClick={onItemSelect}
        to={href}
      >
        {/* <span className={`result-icon ${iconClass}`} /> */}
        <img src={personSvg} width="30px" style={{marginRight: 20}}></img>

        <div className="result-info my-auto">
          <div className="truncated">
            {titleNode}
            <div className="body-secondary-3 truncated">{subtitle}</div>
          </div>
        </div>

        <div className="resource-type">{type}</div>
      </Link>
    </li>
  );
};

export default ResultItem;
