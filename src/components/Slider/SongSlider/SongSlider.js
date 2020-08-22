import React, { useEffect, useState } from "react";
import "./songSlider.scss";
import Slider from "react-slick";
import { map } from "lodash";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../../utils/Firebase";

import "firebase/firestore";
import "firebase/storage";

const db = firebase.firestore(firebase);
const SongSlider = (props) => {
  const { title, data, playerSong } = props;

  const settings = {
    dots: false,
    infinity: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    centerMode: true,
    className: "songs-slider__list",
  };

  /*if (size(data) < 5) {
    return null;
  }*/
  return (
    <div className="songs-slider">
      <h2>{title}</h2>
      <Slider {...settings}>
        {map(data, (item) => (
          <Cancion key={item.id} item={item} playerSong={playerSong} />
        ))}
      </Slider>
    </div>
  );
};

function Cancion(props) {
  const { item, playerSong } = props;
  const [banner, setBanner] = useState(null);
  const [album, setAlbum] = useState(null);
  useEffect(() => {
    db.collection("albums")
      .doc(item.album)
      .get()
      .then((response) => {
        const alb = response.data();
        alb.id = response.id;
        setAlbum(alb);
        getImage(alb);
      });
  }, [item]);

  const getImage = (albu) => {
    firebase
      .storage()
      .ref(`album/${albu.banner}`)
      .getDownloadURL()
      .then((url) => {
        setBanner(url);
      });
  };
  const onPlay = () => {
    playerSong(banner, item.name, item.fileName);
  };
  return (
    <div className="songs-slider__list-song">
      <div
        className="avatar"
        style={{ backgroundImage: `url('${banner}')` }}
        onClick={onPlay}
      >
        <Icon name="play circle outline" />
      </div>
      <Link to={`/album/${album?.id}`}>
        <h3>{item.name}</h3>
      </Link>
    </div>
  );
}
export default SongSlider;
