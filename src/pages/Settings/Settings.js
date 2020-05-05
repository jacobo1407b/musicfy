import React, { Component } from "react";
import "./Settings.scss";
import UploadAvatar from "../../components/Settings/UpdateAvatar";
import BasicModal from "../../components/Modal/BasicModal/BasicModal";
import UserName from "../../components/Settings/UserName";
import UserEmail from "../../components/Settings/UserEmail";
import UserPassword from "../../components/Settings/UserPassword";

class Settings extends Component {
  constructor(props) {
    super(props);
    const { user, setReloadApp } = props;
    this.state = {
      user,
      setReloadApp,
      showModa: false,
      titleModal: "",
      contentModal: null,
    };
  }

  setShowModal = (data) => {
    this.setState({
      showModa: data,
    });
  };

  setTitle = (data) => {
    this.setState({
      titleModal: data,
    });
  };
  setContent = (data) => {
    this.setState({
      contentModal: data,
    });
  };
  render() {
    return (
      <div className="settings">
        <h1>HOla settings</h1>
        <div className="avatar-name">
          <UploadAvatar
            user={this.state.user}
            setReloadApp={this.state.setReloadApp}
          />
          <UserName
            user={this.state.user}
            setShowModal={this.setShowModal}
            setTitleModal={this.setTitle}
            setContentModal={this.setContent}
            setReloadApp={this.state.setReloadApp}
          />
        </div>
        <UserEmail
          user={this.state.user}
          setShowModal={this.setShowModal}
          setTitleModal={this.setTitle}
          setContentModal={this.setContent}
        />
        <UserPassword
          setShowModal={this.setShowModal}
          setTitleModal={this.setTitle}
          setContentModal={this.setContent}
        />
        <BasicModal
          show={this.state.showModa}
          setShow={this.setShowModal}
          title={this.state.titleModal}
        >
          {this.state.contentModal}
        </BasicModal>
      </div>
    );
  }
}

export default Settings;
