import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const Login = (props) => {
    const [url, setUrl] = useState('interop-server');
    const [portNum, setPortNum] = useState('80');
    const [username, setUsername] = useState('testuser');
    const [password, setPassword] = useState('testpass');

    function handleLogin(e)
    {
        e.preventDefault();

        props.login({
            url,
            portNum,
            username,
            password,
        });
    }

    return (
        <div className="login">
            <div className="Login">
                <form onSubmit={handleLogin}>
                    Server URL
                    <input
                        type="text"
                        className="form-control"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                    Port
                    <input
                        type="text"
                        className="form-control"
                        value={portNum}
                        onChange={e => setPortNum(e.target.value)}
                    />
                    Username
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    Password
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary submit"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>

    );
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
};

export default Login;
