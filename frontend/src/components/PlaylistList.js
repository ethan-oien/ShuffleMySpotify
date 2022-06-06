import './PlaylistList.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { get_current_users_playlists, get_current_user_id, get_shuffle_methods } from '../model/api';
import CollapseWrapper from './CollapseWrapper';
import PlaylistControl from "./PlaylistControl";
import noimage from '../assets/noimage.png'

export default function PlaylistList() {
    const [opened, setOpened] = useState(null);
    const [altText, setAltText] = useState('Loading...');
    const [playlists, setPlaylists] = useState([]);
    const [methods, setMethods] = useState([]);

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
    }, []);

    useEffect(() => {
        get_shuffle_methods()
        .then((response) => {
            setMethods(response);
        })
        .catch((err) => {
            console.error(err);
        });
    }, []);

    const toggle_collapse = (playlist_id) => {
        opened === playlist_id ? setOpened(null) : setOpened(playlist_id);
    }

    return (
        <div className='playlistList-root'>
            {playlists.length !== 0 ? <ul className='playlistList-list'>
                {playlists.map((playlist, index) =>
                    <li key={playlist.id} className={`playlistList-list-item
                    ${playlist.description ? 'has-description' : ''}
                    ${opened === playlist.id ? 'opened' : ''}`} >
                        <div className='playlistList-list-item-header'>
                            <button className="playlistList-list-item-header-button txt-btn" onClick={() => {toggle_collapse(playlist.id)}}>
                                <FontAwesomeIcon icon={faCaretDown} className='playlistList-list-item-header-button-arrow' />
                            </button>
                            <img src={playlist.images[0].url} alt='' />
                            <div className='playlistList-list-item-header-information'>
                                <span className='playlistList-list-item-header-button-title'>{playlist.name}</span>
                                <div className='playlistList-list-item-header-button-description'>{/*playlist.description*/}</div>
                            </div>
                        </div>
                        <CollapseWrapper collapsed={opened !== playlist.id}>
                            <PlaylistControl id={playlist.id} methods={methods} />
                        </CollapseWrapper>
                    </li>
                )}
            </ul> : <p>{altText}</p>}
        </div>
    );
}