// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react'; 
import { useState, useEffect } from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import './Boxstyle.scss';

import {Button, FormGroup, FormControl, FormLabel} from 'react-bootstrap'

function Login() {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    const performValidation = () => {
        return username.length > 0 && password.length > 0;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="username">
                    <FormLabel>Username</FormLabel>
                    <FormControl
                    autoFocus
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="password">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    />
                </FormGroup>
                <Button block disabled={!performValidation()} type="submit">
                    Login
                </Button>
            </form>
    </div>
    );
}

export default Login;
