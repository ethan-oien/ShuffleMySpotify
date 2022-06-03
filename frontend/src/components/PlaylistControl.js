import './PlaylistControl.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function PlaylistControl(props) {
    const [criteria, setCriteria] = useState([]);

    useEffect(() => {
        //get criteria
        setCriteria([
            "artist",
            "album",
            "date added"
        ]);
    }, []);

    const order = new Set();

    const shuffle_button = () => {
        //make request to shuffle
    }
    
    const toggle_element = (element) => {
        if(order.has(element)) {
            order.delete(element);
        } else {
            order.add(element);
        }
    }
    
    const apply_button = () => {
        //make request to organize based on criteria
    }
    
    const clear = () => {
        order.clear();
    }

    return (
        <div className='playlistControl-root submenu'>
            <div>
                <button className='btn playlistControl-shuffleButton' onClick={shuffle_button}>SHUFFLE</button>
            </div>
            <div className='playlistControl-organize'>
                <div className='playlistControl-organize-title'>
                    <button className='txt-btn'>
                        <span>Organize</span>
                        {/*<FontAwesomeIcon icon={faCaretDown} />*/}
                    </button>
                </div>
                <div>
                    {criteria.length !== 0 ? <ul className='playlistControl-organize-list'>
                        {criteria.map((element, index) => 
                            <li key={index}>
                                <button className="txt-btn" onClick={() => toggle_element(index)}>{element}</button>
                            </li>
                        )}
                    </ul>  : <p>Loading...</p>}
                    <button onClick={() => apply_button()}>Apply</button>
                    <button onClick={() => clear()}>Clear</button>
                </div>
            </div>
        </div>
    );
}