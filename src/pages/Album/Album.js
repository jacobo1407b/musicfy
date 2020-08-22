import React, { useEffect, useState } from "react";
import "./album.scss";
import { withRouter } from "react-router-dom";
import ListSong from "../../components/ListSong/ListSong";
import firebase from "../../utils/Firebase";
import { Loader } from "semantic-ui-react";
import { map } from "lodash";
import "firebase/firestore";
import "firebase/storage";

const db = firebase.firestore(firebase);
const Album = (props) => {
  const { match, playerSong } = props;

  const [album, setAlbum] = useState(null);
  const [albumImage, setAlbumImage] = useState(null);
  const [artist, setArtist] = useState(null);
  const [songs, setsongs] = useState([]);

  useEffect(() => {
    db.collection("albums")
      .doc(match.params.id)
      .get()
      .then((response) => {
        const data = response.data();
        data.id = response.id;
        setAlbum(data);
      });
  }, [match]);

  useEffect(() => {
    if (album) {
      firebase
        .storage()
        .ref(`album/${album?.banner}`)
        .getDownloadURL()
        .then((url) => {
          setAlbumImage(url);
        });
    }
  }, [album]);

  useEffect(() => {
    if (album) {
      db.collection("artist")
        .doc(album?.artist)
        .get()
        .then((response) => {
          setArtist(response.data());
        });
    }
  }, [album]);

  useEffect(() => {
    if (album) {
      db.collection("songs")
        .where("album", "==", album?.id)
        .get()
        .then((response) => {
          const arraySong = [];
          map(response.docs, (algo) => {
            const data = algo?.data();
            data.id = algo.id;
            arraySong.push(data);
          });
          setsongs(arraySong);
        });
    }
  }, [album]);
  if (!album || !artist) {
    return <Loader active>Cargando</Loader>;
  }
  return (
    <div className="album">
      <div className="album__header">
        <div
          className="image"
          style={{ backgroundImage: `url('${albumImage}')` }}
        />
        <div className="info">
          <h1>{album.name}</h1>
          <p>
            De <span>{artist.name}</span>
          </p>
        </div>
      </div>
      <div className="album__songs">
        <ListSong
          songs={songs}
          albumImage={albumImage}
          playerSong={playerSong}
        />
      </div>
    </div>
  );
};

export default withRouter(Album);
