import PlaylistList from './components/PlaylistList';

export default function App() {
    return (
        <div className='app'>
            <h1>Shuffle My Spotify</h1>
            <a href={process.env.REACT_APP_LOGIN_URL}>Login!</a>
            <PlaylistList />
        </div>
    );
}