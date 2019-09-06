import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            url: '10.10.130.10',
            port_num: '80',
            username: 'british',
            password: '9203074594',
            mission_id: '1',
        };
    }

    handleLogin(e)
    {
        e.preventDefault();
        const { url, port_num, username, password, mission_id } = this.state;

        this.props.login({
            url,
            port_num,
            username,
            password,
            mission_id,
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
                        Mission ID
                        <input
                            type="number"
                            className="form-control"
                            value={this.state.mission_id}
                            onChange={e => this.updateField('mission_id', e)}
                        />
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
