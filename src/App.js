import PlaylistList from './components/PlaylistList';

function App() {

    const refresh = () => {
        fetch('/auth/refresh');
    }

    return (
        <div className='app'>
            <h1>Shuffle My Spotify</h1>
            <a href='http://localhost:5000/auth/login'>Login!</a>
            <br />
            <button onClick={refresh}>Refresh!</button>
            <PlaylistList />
        </div>
    );
}

export default App;
