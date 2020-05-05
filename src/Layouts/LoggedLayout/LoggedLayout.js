import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import "./LoggedLayout.scss";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "../../routes/Routes";
import MenuLeft from "../../components/MenuLeft/MenuLeft";
import TopBar from "../../components/TopBar/TopBar";

class LoggedLayout extends Component {
  constructor(props) {
    super(props);
    const { user, setReloadApp } = props;
    this.state = {
      user,
      setReloadApp
    };
  }
  render() {
    const { user } = this.state;
    return (
      <Router>
        <Grid className="logged-layout">
          <Grid.Row>
            <Grid.Column width={3}>
              <MenuLeft user={user} />
            </Grid.Column>
            <Grid.Column className="thirteen wide column content">
              <TopBar user={this.state.user} />
              <Routes user={user} setReloadApp={this.state.setReloadApp} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <h2>Player</h2>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Router>
    );
  }
}

export default LoggedLayout;
