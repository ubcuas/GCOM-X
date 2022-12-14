import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

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
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    >
                    <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                required
                                className="form-control"
                                label="Server URL"
                                variant="outlined"                        
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                required
                                className="form-control"
                                label="Port"
                                variant="outlined"                        
                                value={portNum}
                                onChange={e => setPortNum(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                required
                                className="form-control"
                                label="Username"
                                variant="outlined"                        
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                required
                                type="password"
                                className="form-control"
                                label="Password"
                                variant="outlined"                        
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                className="btn btn-primary submit"
                                style={{ margin: "auto" }}
                            >
                                Log In
                            </Button>
                        </Grid>
                    </Grid>
            </Box>
        </div>

    );
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
};

export default Login;
