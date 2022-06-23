import './PlaylistControl.css';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ, faArrowDownZA, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { organize_playlist } from '../model/api';

export default function PlaylistControl(props) {
    const methods = props.methods;

    const [shuffling, setShuffling] = useState(false);
    const [applying, setApplying] = useState(false);
    const [working, setWorking] = useState(false);
    const [order, setOrder] = useState([]);
    const [reversed, setReversed] = useState([]);

    const shuffle_button = () => {
        if(!working) {
            clear();
            setShuffling(true);
            setWorking(true);

            organize_playlist(props.id, undefined)
            .then(() => {
                setShuffling(false);
                setWorking(false);
            })
            .catch((err) => {
                console.error(err);
            });
        }
    }

    const toggle_method = (method) => {
        if(!working) {
            const new_order = [...order];
            const new_reversed = [...reversed];
    
            const index = new_order.indexOf(method);
            
            if(index === -1) {
                new_reversed[method] = false;
                new_order.push(method);
            } else {
                new_reversed[method] = undefined;
                new_order.splice(index, 1);
            }
    
            setOrder(new_order);
            setReversed(new_reversed);
        }
    }
        
    const toggle_reverse = (method) => {
        if(!working) {
            const new_reversed = [...reversed];
            
            new_reversed[method] = !new_reversed[method];

            setReversed(new_reversed);
        }
    }
    
    const apply_button = () => {
        if(!working) {
            const body = [];

            order.forEach((o) => {
                body.push({method: o, reversed: reversed[o]});
            })
    
            clear();
            setApplying(true);
            setWorking(true);

            organize_playlist(props.id, body)
            .then(() => {
                setApplying(false);
                setWorking(false);
            })
            .catch((err) => {
                console.error(err);
            });
        }
    }
    
    const clear = () => {
        setOrder([]);
        setReversed([]);
    }

    return (
        <div className='playlistControl-root submenu'>
            <div>
                <button className='btn playlistControl-shuffleButton' onClick={shuffle_button}>
                    {shuffling ? (
                        <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' alt='Working'/>
                    ) : 'SHUFFLE'}
                </button>
            </div>
            <div className='playlistControl-organize'>
                <p className='playlistControl-organize-title'>Organize</p>
                <div>
                    {methods.length !== 0 ? <ul className='playlistControl-organize-list'>
                        {methods.map((element, index) => 
                            <li className={`${reversed[index] !== undefined ? 'selected' : ''}
                            ${reversed[index] ? 'reversed' : ''}`} key={index}
                            style={{marginLeft: reversed[index] !== undefined ? order.indexOf(index)*7+'px' : 'inherit'}}>
                                <span className='playlistControl-organize-list-item-index'>{reversed[index] !== undefined ? order.indexOf(index)+1 : '0'}</span>
                                <button className='txt-btn'
                                onClick={() => toggle_method(index)}>{element.name}</button>
                                {reversed[index] !== undefined ? (
                                    <button className='txt-btn' onClick={() => {toggle_reverse(index)}}>
                                        <FontAwesomeIcon className='playlistControl-organize-list-item-button-reversedIcon'
                                        icon={reversed[index] ? faArrowDownZA : faArrowDownAZ} 
                                        title={reversed[index] ? 'Reverse Alphabetically' : 'Alphabetically'}/>
                                    </button>
                                ) : null}
                            </li>
                        )}
                    </ul>  : <p>Loading...</p>}
                    <button className='btn playlistControl-organize-apply' onClick={() => apply_button()}>{
                        applying ? (
                            <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' alt='Working'/>
                        ) : 'Apply'
                    }</button>
                    <button className='btn playlistControl-organize-clear' onClick={() => clear()}>Clear</button>
                </div>
            </div>
        </div>
    );
}