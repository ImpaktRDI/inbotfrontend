// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react'; 

import './style.scss';

const MS_API_LINK = "http://localhost:5000/mslogin"

function LoginPage() {

    const msLogin = (e) => {
      e.preventDefault();
      window.location.href=MS_API_LINK;
    }

    return (
      <div className="container_j">
        <div className="button-container-div">
          <button onClick={ msLogin }>
            <img src="ms-symbollockup_signin_dark.png" alt="Sign in with Microsoft"></img>
          </button>
        </div>
      </div>
    );
}

export default LoginPage;
