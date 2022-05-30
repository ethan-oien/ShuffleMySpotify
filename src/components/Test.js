import { useEffect, useState } from "react";

export default function Test() {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        fetch('/auth/login');
        // fetch('/api/tracks')
        // .then((tracks) => {
        //     setTracks(tracks);
        // })
        // .catch((err) => {
        //     console.error(err);
        // });
    }, []);

    return (
        <ul>
            {tracks.map((track, index) => {
                return <li key={index}>{track}</li>
            })}
        </ul>
    );
}