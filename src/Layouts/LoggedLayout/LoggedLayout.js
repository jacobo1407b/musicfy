import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import "./LoggedLayout.scss";
import { HashRouter as Router } from "react-router-dom";
import Routes from "../../routes/Routes";
import MenuLeft from "../../components/MenuLeft/MenuLeft";
import TopBar from "../../components/TopBar/TopBar";
import Player from "../../components/Player";
import firebase from "../../utils/Firebase";
import "firebase/storage";
/*class LoggedLayout extends Component {
  constructor(props) {
    super(props);
    const { user, setReloadApp } = props;
    this.state = {
      user,
      setReloadApp,
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
              <Player />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Router>
    );
  }
}*/

const LoggedLayout = (props) => {
  const [songData, setSongData] = useState(null);
  const playerSong = (albumImage, songName, songUrl) => {
    firebase
      .storage()
      .ref(`song/${songUrl}`)
      .getDownloadURL()
      .then((url) => {
        setSongData({
          image: albumImage,
          name: songName,
          url: url,
        });
      });
  };
  const { user, setReloadApp } = props;
  return (
    <Router>
      <Grid className="logged-layout">
        <Grid.Row>
          <Grid.Column width={3}>
            <MenuLeft user={user} />
          </Grid.Column>
          <Grid.Column className="thirteen wide column content">
            <TopBar user={user} />
            <Routes
              user={user}
              setReloadApp={setReloadApp}
              playerSong={playerSong}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Player songData={songData} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
};

export default LoggedLayout;
