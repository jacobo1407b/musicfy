import React, { Fragment, useState, useEffect } from "react";
import BannerHome from "../../components/BannerHome";
import BasicSliderItems from "../../components/Slider/BasicSliderItems";
import SongsSlider from "../../components/Slider/SongSlider/SongSlider";
import firebase from "../../utils/Firebase";
import { map } from "lodash";
import "firebase/firestore";
import "./Home.scss";

const db = firebase.firestore(firebase);

const Home = ({ playerSong }) => {
  const [artist, setArtist] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    db.collection("artist")
      .get()
      .then((response) => {
        const arrayArtist = [];
        map(response?.docs, (poste) => {
          const data = poste.data();
          data.id = poste.id;
          arrayArtist.push(data);
        });
        setArtist(arrayArtist);
      });
  }, []);

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

  useEffect(() => {
    db.collection("songs")
      .limit(10)
      .get()
      .then((response) => {
        const arraySongs = [];
        map(response?.docs, (songo) => {
          const data = songo.data();
          data.id = songo.id;
          arraySongs.push(data);
        });
        setSongs(arraySongs);
      });
  }, []);
  return (
    <Fragment>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title="Ultimos artistas"
          data={artist}
          folderImage="artist"
          urlName="artist"
        />
        <BasicSliderItems
          title="Ultimos albums"
          data={albums}
          folderImage="album"
          urlName="album"
        />
        <SongsSlider
          title="Ultimas canciones"
          data={songs}
          playerSong={playerSong}
        />
      </div>
    </Fragment>
  );
};

export default Home;
