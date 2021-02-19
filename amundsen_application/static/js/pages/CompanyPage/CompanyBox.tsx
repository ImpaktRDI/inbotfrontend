import * as React from 'react';

import linkedIn_big from '../../../images/icons/linkedin_big.svg'

const CompanyBox = ({ company }) => {
    return (
        <div className="container_person">
            <div className="person_header_row">
                <h1>{company.name}</h1>
                <a href={ company.linkedin_url }><img src={linkedIn_big} alt="linkedin"></img></a>
            </div>
        </div>
        )
}

export default CompanyBox;