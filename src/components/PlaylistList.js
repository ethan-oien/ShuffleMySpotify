import './PlaylistList.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PlaylistControl from "./PlaylistControl";

export default function PlaylistList() {
    const [playlists, setPlaylists] = useState(
        [
            {
                "name": "Playlist 1",
                "images": [
                    {
                        "url": ""
                    }
                ],
                "id": "1"
            },
            {
                "name": "Playlist 2",
                "images": [
                    {
                        "url": ""
                    }
                ],
                "id": "2"
            }
        ]
    );

    return (
        <div>
            <ul className='playlist-list-list'>
                {playlists.length !== 0 ? playlists.map((playlist, index) =>
                    <li className='playlist-list-list-item' key={playlist.id}>
                        <div className='playlist-list-list-item-description'>
                            <img src={playlist.images[0].url} style={{ maxHeight: "2em" }} alt={playlist.name} /> {/*need to account for NO playlist image*/}
                            <button className="txt-btn" onClick={() => {console.log("hello")}}>
                                <span>{playlist.name}</span>
                                <FontAwesomeIcon icon={faCaretDown} />
                            </button>
                        </div>
                        <PlaylistControl id={playlist.id} />
                    </li>
                ) : "Loading..."}
            </ul>
        </div>
    );
}