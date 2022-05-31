import Test from './components/Test';

function App() {

    const refresh = () => {
        fetch('/auth/refresh');
    }

    return (
        <div>
            <h1>App</h1>
            <a href='http://localhost:5000/auth/login'>Login!</a>
            <br />
            <button onClick={refresh}>Refresh!</button>
            <Test />
        </div>
    );
}

export default App;
