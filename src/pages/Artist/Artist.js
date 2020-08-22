import React, { useEffect, useState } from "react";
import firebase from "../../utils/Firebase";
import "./Artist.scss";
import { withRouter } from "react-router-dom";
import "firebase/firestore";
import { map } from "lodash";
import BannerArtist from "../../components/Artists/BannerArtist/BannerArtist";
import BasicSliderItems from "../../components/Slider/BasicSliderItems/BasicSliderItems";
import SongsSliderItems from "../../components/Slider/SongSlider/SongSlider";
const db = firebase.firestore(firebase);

const Artist = (props) => {
  const { match, playerSong } = props;
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    db.collection("artist")
      .doc(match?.params?.id)
      .get()
      .then((response) => {
        const data = response.data();
        data.id = response.id;
        setArtist(data);
      })
      .catch(() => {});
  }, [match]);

  useEffect(() => {
    if (artist) {
      db.collection("albums")
        .where("artist", "==", artist.id)
        .get()
        .then((response) => {
          const arrayAlbum = [];
          map(response?.docs, (alb) => {
            const data = alb.data();
            data.id = alb.id;
            arrayAlbum.push(data);
          });

          setAlbums(arrayAlbum);
        });
    }
  }, [artist]);

  useEffect(() => {
    const arraySong = [];
    (async () => {
      await Promise.all(
        map(albums, async (alb) => {
          await db
            .collection("songs")
            .where("album", "==", alb.id)
            .get()
            .then((response) => {
              map(response?.docs, (res) => {
                const data = res.data();
                data.id = res.id;
                arraySong.push(data);
              });
            });
        })
      );
      setSongs(arraySong);
    })();
  }, [albums]);
  return (
    <div className="artist">
      {artist && <BannerArtist artist={artist} />}
      <div className="artist__content">
        <BasicSliderItems
          title={"Albums"}
          data={albums}
          folderImage="album"
          urlName="album"
        />
        <SongsSliderItems
          title={"Canciones"}
          data={songs}
          playerSong={playerSong}
        />
      </div>
    </div>
  );
};

export default withRouter(Artist);
