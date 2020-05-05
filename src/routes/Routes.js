import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Settings from "../pages/Settings/Settings";

const Routes = props => {
  const { user, setReloadApp } = props;
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/artistas" component={ejemplo} />
      <Route path="/settings">
        <Settings user={user} setReloadApp={setReloadApp} />
      </Route>
    </Switch>
  );
};
const ejemplo = () => {
  return <h1>Artistas</h1>;
};

export default Routes;
