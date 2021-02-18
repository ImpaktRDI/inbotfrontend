import * as React from 'react';

import linkedIn from '../../../images/icons/linkedin.svg'

const Person = ({ id, name, title, linkedin_url }) => {
    const person_link = "/person/" + id;
    return (
    <div>
        <a href={ person_link }><h3>{ name }</h3></a>
        <a href={ linkedin_url }><img src={ linkedIn } alt="linkedin"></img></a>
        <p>{title}</p>
    </div>)
}

export default Person;