import PlaylistList from './components/PlaylistList';

export default function App() {

    return (
        <div className='app'>
            <h1>Shuffle My Spotify</h1>
            <a href='http://localhost:5000/auth/login'>Login!</a>
            <PlaylistList />
        </div>
    );
}