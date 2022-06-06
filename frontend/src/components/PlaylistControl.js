import './PlaylistControl.css';

export default function PlaylistControl(props) {
    const methods = props.methods;

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
        //make request to organize based on methods
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
                <p className='playlistControl-organize-title'>Organize</p>
                <div>
                    {methods.length !== 0 ? <ul className='playlistControl-organize-list'>
                        {methods.map((element, index) => 
                            <li key={index}>
                                <button className="txt-btn" onClick={() => toggle_element(index)}>{element.name}</button>
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