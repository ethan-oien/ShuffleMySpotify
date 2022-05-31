import { useEffect, useState } from "react";
import { get_track_list } from "../model/api";

export default function Test() {
    const [auth, setAuth] = useState(true);
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        get_track_list()
        .then((data) => {
            setTracks(data);
        })
        .catch((err) => {
            setAuth(false);
        });
    }, []);

    return (
        <ul>
            {auth ? (tracks.length !== 0 ? tracks.map((track, index) => {
                return <li key={index}>{track.name}</li>
            }) : <p>Loading...</p>) : <p>Not authenticated.</p>}
        </ul>
    );
}