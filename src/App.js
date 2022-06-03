import PlaylistList from './components/PlaylistList';
import Test from './components/Test';

export default function App() {

    const refresh = () => {
        fetch('/auth/refresh');
    }

    return (
        <div className='app'>
            <Test />
            <h1>Shuffle My Spotify</h1>
            <a href='http://localhost:5000/auth/login'>Login!</a>
            <br />
            <button onClick={refresh}>Refresh!</button>
            <PlaylistList />
        </div>
    );
}