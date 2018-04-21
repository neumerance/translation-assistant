import React from 'react';
import * as _ from 'lodash';

export default class CmsPaginator extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const self = this;
    const props = self.props;
    let prevPageBtn = null;
    let nextPageBtn = null;
    let infoBar = null;

    const pagination = props.pagination;

    const currentPage = _.get(pagination, 'current_page', 1);
    const nextPage = _.get(pagination, 'next_page', 0);
    const prevPage = _.get(pagination, 'prev_page', 0);
    const totalPage = _.get(pagination, 'total_pages', 1);


    if (pagination.total_pages > 1) {
      infoBar = <li><a href="javascript:void(0)">{currentPage} of {totalPage}</a></li>
    }

    if (totalPage > 1 && prevPage) {
      prevPageBtn = <li>
        <a href="javascript:void(0)"
           onClick={ () => {props.getJobs(prevPage)}}
           aria-label="Previous">
          <span aria-hidden="true">&laquo;</span> Previous
        </a>
      </li>
    }

    if (totalPage > 1 && nextPage) {
      nextPageBtn = <li>
        <a href="javascript:void(0)"
           onClick={ () => {props.getJobs(nextPage)}}
           aria-label="Next">
          Next <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    }

    return (
      <ul className={`pagination ${infoBar ? 'show' : 'hide'}`}>
        {prevPageBtn}
        {infoBar}
        {nextPageBtn}
      </ul>
    )
  }

}