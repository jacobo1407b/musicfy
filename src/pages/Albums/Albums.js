import React, { useState, useEffect } from "react";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "./albums.scss";
import "firebase/storage";
import { map } from "lodash";
import { Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";

const db = firebase.firestore(firebase);
const Albums = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((response) => {
        const arrayAlbum = [];
        map(response?.docs, (alb) => {
          var data = alb.data();
          data.id = alb.id;
          arrayAlbum.push(data);
        });

        setAlbums(arrayAlbum);
      });
  }, []);
  return (
    <div className="albums">
      <h1>Albums</h1>
      <Grid>
        {map(albums, (al) => (
          <Grid.Column key={al.id} mobile={8} tablet={4} computer={3}>
            <Album album={al} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
};

function Album(props) {
  const { album } = props;
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    firebase
      .storage()
      .ref(`album/${album.banner}`)
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      });
  }, [album]);
  return (
    <Link to={`/album/${album.id}`}>
      <div className="albums__items">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <h3>{album.name}</h3>
      </div>
    </Link>
  );
}
export default Albums;
