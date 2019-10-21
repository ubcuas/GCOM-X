import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            url: 'interop-server',
            port_num: '80',
            username: 'testuser',
            password: 'testpass',
        };
    }

    handleLogin(e)
    {
        e.preventDefault();
        const { url, port_num, username, password } = this.state;

        this.props.login({
            url,
            port_num,
            username,
            password,
        });
    }

    updateField(field, e)
    {
        this.setState({
            [field]: e.target.value,
        });
    }

    render()
    {
        return (
            <div className="login">
                <div className="Login">
                    <form onSubmit={e => this.handleLogin(e)}>
                        Server URL
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.url}
                            onChange={e => this.updateField('url', e)}
                        />
                        Port
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.port_num}
                            onChange={e => this.updateField('port_num', e)}
                        />
                        Username
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.username}
                            onChange={e => this.updateField('username', e)}
                        />
                        Password
                        <input
                            type="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={e => this.updateField('password', e)}
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
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
};

export default Login;
