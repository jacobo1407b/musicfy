import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Settings from "../pages/Settings/Settings";
import Artist from "../pages/Artist/Artist";
import Artists from "../pages/Artists/Artists";
import Albums from "../pages/Albums/Albums";
import Album from "../pages/Album/Album";
const Routes = (props) => {
  const { user, setReloadApp, playerSong } = props;
  return (
    <Switch>
      <Route path="/" exact>
        <Home playerSong={playerSong} />
      </Route>
      <Route path="/artistas">
        <Artists />
      </Route>
      <Route path="/artist/:id" exact>
        <Artist playerSong={playerSong} />
      </Route>
      <Route path="/albums" exact>
        <Albums />
      </Route>
      <Route path="/album/:id" exact>
        <Album playerSong={playerSong} />
      </Route>
      <Route path="/settings">
        <Settings user={user} setReloadApp={setReloadApp} />
      </Route>
    </Switch>
  );
};

export default Routes;
