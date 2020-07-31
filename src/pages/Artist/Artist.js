import React, { useEffect, useState } from 'react';
import firebase from '../../utils/Firebase';
import "./Artist.scss";
import { withRouter } from 'react-router-dom';
import "firebase/firestore";
import BannerArtist from '../../components/Artists/BannerArtist/BannerArtist';


const db = firebase.firestore(firebase);

const Artist = (props) => {
    const { match } = props;
    const [artist, setArtist] = useState(null);

    useEffect(() => {
        db.collection("artist")
            .doc(match?.params?.id)
            .get()
            .then(response => {
                setArtist(response.data())
            })
            .catch(() => {

            })
    }, [match])
    return (
        <div
            className="artist"
        >

            {artist && <BannerArtist
                artist={artist}
            />}
            <h2>Mas info ...</h2>
        </div>
    )
}

export default withRouter(Artist)
