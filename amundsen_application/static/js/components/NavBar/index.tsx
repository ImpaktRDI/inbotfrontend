// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import * as Avatar from 'react-avatar';
import { RouteComponentProps } from 'react-router';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { LinkConfig } from 'config/config-types';
import { GlobalState } from 'ducks/rootReducer';
import { logClick } from 'ducks/utilMethods';
import { Dropdown, MenuItem } from 'react-bootstrap';

import { LoggedInUser } from 'interfaces';

import {
  feedbackEnabled,
  indexUsersEnabled,
  getNavLinks,
} from 'config/config-utils';

import Feedback from 'components/Feedback';
import SearchBar from 'components/common/SearchBar';

import './styles.scss';

import exit_icon from '../../../images/icons/exit-icon.svg';

import InbotNoIcon from '../../../images/inbot-transparent-white.svg';

const PROFILE_LINK_TEXT = 'My Profile';
const LOGOUT_LINK_TEXT = 'Sign out';

// Props
interface StateFromProps {
  loggedInUser: LoggedInUser;
}

export type NavBarProps = StateFromProps & RouteComponentProps<{}>;

export class NavBar extends React.Component<NavBarProps> {
  generateNavLinks(navLinks: LinkConfig[]) {
    return navLinks.map((link, index) => {
      if (link.use_router) {
        return (
          <NavLink
            className="title-3 border-bottom-white"
            key={index}
            to={link.href}
            target={link.target}
            onClick={logClick}
          >
            {link.label}
          </NavLink>
        );
      }
      return (
        <a
          className="title-3 border-bottom-white"
          key={index}
          href={link.href}
          target={link.target}
          onClick={logClick}
        >
          {link.label}
        </a>
      );
    });
  }

  renderSearchBar = () => {
    if (this.props.location.pathname !== '/') {
      return (
        <div className="nav-search-bar">
          <SearchBar size="small" />
        </div>
      );
    }
    return null;
  };

  render() {
    const { loggedInUser } = this.props;
    const signoutLink = `/`;
    const userLink = `/user/${loggedInUser.user_id}?source=navbar`;
    let avatar = <Avatar name="TestUser" color="#030030" textSizeRatio={2} size={50} round />;

    if (loggedInUser.display_name) {
      avatar = <Avatar name={loggedInUser.display_name} size={32} round />;
    }

    /* Reminder what how it was done */
    /* {feedbackEnabled() && <Feedback />}
    {loggedInUser && indexUsersEnabled() && ( */


    return (
      <nav className="container-fluid">
        <div className="row">
          <div className="nav-bar">
            <div id="nav-bar-left" className="nav-bar-left">
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

            {this.renderSearchBar()}

            <div id="nav-bar-right" className="ml-auto nav-bar-right">

              {this.generateNavLinks(getNavLinks())}

              <Dropdown id="user-dropdown" pullRight>
                <Dropdown.Toggle
                  noCaret
                  className="nav-bar-avatar avatar-dropdown"
                >
                  {avatar}
                </Dropdown.Toggle>
                <Dropdown.Menu className="profile-menu">

                  <MenuItem
                    componentClass={Link}
                    id="sign-out"
                    to={signoutLink}
                    href={signoutLink}
                  >
                    <img src={exit_icon} alt=""></img>
                    {LOGOUT_LINK_TEXT}
                  </MenuItem>

                  <MenuItem
                    componentClass={Link}
                    id="nav-bar-avatar-link"
                    to={userLink}
                    href={userLink}
                  >
                    {PROFILE_LINK_TEXT}
                  </MenuItem>

                </Dropdown.Menu>
              </Dropdown>
            
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    loggedInUser: state.user.loggedInUser,
  };
};

export default connect<StateFromProps>(mapStateToProps)(withRouter(NavBar));
