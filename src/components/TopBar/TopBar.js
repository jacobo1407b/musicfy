import React, { Component } from "react";
import { Icon, Image } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../utils/Firebase";
import "./TopBar.scss";
import "firebase/auth";
import UserImage from "../../assets/png/original.png";

class TopBar extends Component {
  constructor(props) {
    super(props);
    const { user } = props;
    this.state = {
      user
    };
  }
  logout = () => {
    firebase.auth().signOut();
  };
  goBack = () => {
    this.props.history.goBack();
  };
  render() {
    return (
      <div className="top-bar">
        <div className="top-bar__left">
          <Icon name="angle left" onClick={this.goBack} />
        </div>
        <div className="top-bar__right">
          <Link to="/settings">
            <Image
              src={
                this.state.user.photoURL ? this.state.user.photoURL : UserImage
              }
            />
            {this.state.user.displayName}
          </Link>
          <Icon name="power off" onClick={this.logout} />
        </div>
      </div>
    );
  }
}

export default withRouter(TopBar);
