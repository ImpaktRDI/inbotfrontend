import * as React from 'react';
import Person from './Person'


const PeopleBox = ({ people }) => {
    return (
        <div className="container_column">
            {people.map((person, i) => {
            return (
                <Person
                key={i}
                id={person.id}
                name={person.name}
                linkedin_url={person.profile_url}
                title={person.title}
                />
            );
            })
            }
        </div>
        );
}

export default PeopleBox;