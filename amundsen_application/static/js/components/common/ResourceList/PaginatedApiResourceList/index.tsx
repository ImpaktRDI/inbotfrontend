// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import Pagination from 'react-js-pagination';
import ResourceListItem from 'components/common/ResourceListItem';
import { Resource } from 'interfaces';
import * as Constants from '../constants';

import '../styles.scss';

import FirstArrow from '../../../../../images/icons/first-arrow.svg';
import PrevArrow from '../../../../../images/icons/prev-arrow.svg';
import NextArrow from '../../../../../images/icons/next-arrow.svg';
import LastArrow from '../../../../../images/icons/last-arrow.svg';

export interface PaginatedApiResourceListProps {
  activePage: number;
  emptyText?: string;
  itemsPerPage: number;
  onPagination: (pageNumber: number) => void;
  slicedItems: Resource[];
  totalItemsCount: number;
  source: string;
}

class PaginatedApiResourceList extends React.Component<
  PaginatedApiResourceListProps,
  {}
> {
  public static defaultProps: Partial<PaginatedApiResourceListProps> = {
    emptyText: Constants.DEFAULT_EMPTY_TEXT,
  };

  onPagination = (rawPageNum: number) => {
    const activePage = rawPageNum - 1;

    this.props.onPagination(activePage);
  };
  
  render() {
    const {
      activePage,
      emptyText,
      totalItemsCount,
      itemsPerPage,
      slicedItems,
      source,
    } = this.props;
    const startIndex = itemsPerPage * activePage;

    return (
      <div className="paginated-resource-list">
        {totalItemsCount === 0 && emptyText && (
          <div className="empty-message body-placeholder">{emptyText}</div>
        )}
        {totalItemsCount > 0 && (
          <>
            <ul className="list-group">
              {slicedItems.map((item, idx) => {
                const logging = { source, index: startIndex + idx };
                return (
                  <ResourceListItem item={item} logging={logging} key={idx} />
                );
              })}
            
              </ul>
              <div className="pagination-box">
                {totalItemsCount > itemsPerPage && (
                  <Pagination
                    activePage={activePage + 1}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={totalItemsCount}
                    pageRangeDisplayed={Constants.PAGINATION_PAGE_RANGE}
                    onChange={this.onPagination}
                    firstPageText={<img src={FirstArrow} alt="first page"></img>}
                    prevPageText={<img src={PrevArrow} alt="previous page"></img>}
                    nextPageText={<img src={NextArrow} alt="next page"></img>}
                    lastPageText={<img src={LastArrow} alt="last page"></img>}
                  />
                )}
              </div>
            
          </>
        )}
      </div>
    );
  }
}

export default PaginatedApiResourceList;
