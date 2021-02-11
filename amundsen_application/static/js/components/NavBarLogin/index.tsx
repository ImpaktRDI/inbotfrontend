// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Link } from 'react-router-dom';

import './styles.scss';

import InbotNoIcon from '../../../images/inbot-transparent-white.svg';

const PROFILE_LINK_TEXT = 'My Profile';

function NavBarLogin(): JSX.Element {
    return (
      <nav className="container-fluid">
        <div className="row">
          <div className="nav-bar-login">
            <div id="nav-bar-left" className="nav-bar-login-left">
              <Link to="/">
                <img
                    id="logo-icon"
                    className="logo-icon"
                    src={InbotNoIcon}
                    height={20}
                    alt=""
                  />
              </Link>            
            </div>
          </div>
        </div>
      </nav>
    );
  
}

export default NavBarLogin;
