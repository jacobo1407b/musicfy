import React, { useState, useEffect } from "react";
import firebase from "../../utils/Firebase";
import { Grid } from "semantic-ui-react";
import { map } from "lodash";
import { Link } from "react-router-dom";
import "./artists.scss";
import "firebase/firestore";
const db = firebase.firestore(firebase);

const Artists = () => {
  const [artistas, setArtistas] = useState([]);

  useEffect(() => {
    db.collection("artist")
      .get()
      .then((response) => {
        const arrayArtists = [];
        map(response?.docs, (artist) => {
          var data = artist.data();
          data.id = artist.id;
          arrayArtists.push(data);
        });
        setArtistas(arrayArtists);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="artists">
      <Grid>
        {map(artistas, (art) => (
          <Grid.Column key={art.id} mobile={8} tablet={4} computer={3}>
            <RenderArtist artist={art} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
};

function RenderArtist(props) {
  const { artist } = props;
  const [banner, setBanner] = useState(null);
  useEffect(() => {
    firebase
      .storage()
      .ref(`artist/${artist.banner}`)
      .getDownloadURL()
      .then((url) => {
        setBanner(url);
      });
  }, [artist]);
  return (
    <div>
      <Link to={`/artist/${artist.id}`}>
        <div className="artists__item">
          <div
            className="avatar"
            style={{ backgroundImage: `url('${banner}')` }}
          />
          <h3>{artist.name}</h3>
        </div>
      </Link>
    </div>
  );
}
export default Artists;
