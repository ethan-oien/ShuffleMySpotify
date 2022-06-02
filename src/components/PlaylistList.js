import './PlaylistList.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PlaylistControl from "./PlaylistControl";
import { get_current_users_playlists, get_current_user_id } from '../model/api';
import noimage from '../assets/noimage.png'

export default function PlaylistList() {
    const [altText, setAltText] = useState('Loading...');
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        get_current_users_playlists()
        .then(async (data) => {
            const user_id = await get_current_user_id()
            .catch((err) => {
                setAltText('An error has occurred.');
            });

            const playlists = [];
            
            data.forEach((element,index) => {
                if(element.owner.id === user_id) {
                    if(element.images.length === 0) {
                        element.images.push({url: noimage});
                    }

                    playlists.push(element);
                }
            });

            setPlaylists(playlists);
        })
        .catch((err) => {
            setAltText('An error has occurred.');
        })
    }, [])

    return (
        <div>
            {playlists.length !== 0 ? <ul className='playlist-list-list'>
                {playlists.map((playlist, index) =>
                    <li className='playlist-list-list-item' key={playlist.id}>
                        <div className='playlist-list-list-item-description'>
                            <img src={playlist.images[0].url} style={{ maxHeight: "2em" }} alt='' />
                            <button className="txt-btn" onClick={() => {console.log("hello")}}>
                                <span>{playlist.name}</span>
                                <FontAwesomeIcon icon={faCaretDown} />
                            </button>
                        </div>
                        <PlaylistControl id={playlist.id} />
                    </li>
                )}
            </ul> : <p>{altText}</p>}
        </div>
    );
}