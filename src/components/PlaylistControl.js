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
        <div className='playlist-control-root submenu'>
            <div>
                <button className='btn playlist-control-shuffleButton' onClick={shuffle_button}>SHUFFLE</button>
            </div>
            <div className='playlist-control-organize'>
                <div className='playlist-control-organize-title'>
                    <button className='txt-btn'>
                        <span>Organize</span>
                        {/*<FontAwesomeIcon icon={faCaretDown} />*/}
                    </button>
                </div>
                <div>
                    <ul className='playlist-control-organize-list'>
                        {criteria.length !== 0 ? criteria.map((element, index) => 
                            <li key={index}>
                                <button className="txt-btn" onClick={() => toggle_element(index)}>{element}</button>
                            </li>
                        ) : "Loading..."}
                    </ul>
                    <button onClick={() => apply_button()}>Apply</button>
                    <button>Clear</button>
                </div>
            </div>
        </div>
    );
}