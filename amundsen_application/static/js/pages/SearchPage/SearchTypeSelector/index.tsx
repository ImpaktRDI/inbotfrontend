import * as React from 'react';

import people from '../../../../images/icons/people.svg';
import companies from '../../../../images/icons/companies.svg';
import jobtitles from '../../../../images/icons/jobtitles.svg';
import industries from '../../../../images/icons/industries.svg';

import './styles.scss';

const SearchTypeSelector = () => {
      return (
        <div className="container_searchtype">
            <a href="/"><img src={people} alt=""></img><h3>People</h3></a>
            <a href="/"><img src={jobtitles} alt=""></img><h3>Job Titles</h3></a>
            <a href="/"><img src={industries} alt=""></img><h3>Industries</h3></a>
            <a href="/"><img src={companies} alt=""></img><h3>Companies</h3></a>
        </div>
      );
  }

export default SearchTypeSelector;