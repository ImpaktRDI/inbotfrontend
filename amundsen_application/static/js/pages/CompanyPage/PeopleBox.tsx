import * as React from 'react';
import PersonCard from './PersonCard'


const PeopleBox = ({ people }) => {
    return (
        <div className="container_column">
            {people.map((person, i) => {
            return (
                <PersonCard
                key={i}
                id={person.id}
                name={person.name}
                linkedin_url={person.linkedin_url}
                title={person.title}
                />
            );
            })
            }
        </div>
        );
}

export default PeopleBox;