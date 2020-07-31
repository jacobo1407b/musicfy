import React, { Fragment, useState, useEffect } from 'react'
import BannerHome from '../../components/BannerHome';
import BasicSliderItems from '../../components/Slider/BasicSliderItems';
import firebase from '../../utils/Firebase';
import { map } from 'lodash';
import "firebase/firestore";
import './Home.scss';

const db = firebase.firestore(firebase);

const Home = () => {

  const [artist, setArtist] = useState([])
  useEffect(() => {
    db.collection("artist")
      .get()
      .then(response => {
        const arrayArtist = []
        map(response?.docs, poste => {
          const data = poste.data()
          data.id = poste.id;
          arrayArtist.push(data);
        });
        setArtist(arrayArtist)
      })
  }, [])
  return (
    <Fragment>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title='Ultimos artistas'
          data={artist}
          folderImage='artist'
          urlName="artist"
        />
        <h2>Mas....</h2>
      </div>
    </Fragment>
  )
}

export default Home
