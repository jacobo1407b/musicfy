import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import firebase from "./utils/Firebase";
import "firebase/auth";
import Auth from "./pages/Auth";
import LoggedLayout from "./Layouts/LoggedLayout/LoggedLayout";

function App() {
  const [user, setuser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadApp, setReloadApp] = useState(false);
  console.log(reloadApp);

  firebase.auth().onAuthStateChanged(currentUser => {
    if (!currentUser?.emailVerified) {
      firebase.auth().signOut();
      setuser(null);
    } else {
      setuser(currentUser);
    }
    setIsLoading(false);
  });
  if (isLoading) {
    return null;
  }
  return (
    <>
      {!user ? (
        <Auth />
      ) : (
          <LoggedLayout user={user} setReloadApp={setReloadApp} />
        )}
      <ToastContainer
        position="top-center"
        autoClose={6000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover={true}
        draggable
        puaseOnVisibilityChange
      />
    </>
  );
}

export default App;
