import * as React from 'react';

import linkedIn from '../../../images/icons/linkedin.svg'

const Person = ({ id, name, title, linkedin_url }) => {
    const person_link = "/person/" + id;
    return (
    <div className="box_influencer box_people">
        <div className="people_header">
            <a href={ person_link }><h3>{ name }</h3></a>
            <div className="icon-box">
                <a href={ linkedin_url }><img src={ linkedIn } alt="linkedin"></img></a>
            </div>
        </div>
        <p>{title}</p>
    </div>)
}

export default Person;