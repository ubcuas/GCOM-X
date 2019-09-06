import React from 'react';
import IntervalTimer from 'react-interval-timer';
import Switch from 'react-switch';
import { bindActionCreators } from 'redux';
import { getAircraftTelem } from '../../actions/action-getaircrafttelem';
import { connect } from 'react-redux';
import _ from 'lodash';
import './style.scss';

function tableRow(key, value)
{
    return (
        <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
        </tr>
    );
} 

/*
 * Panel to display telemetry
 */
class LeftPanel extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { checked: false };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        this.setState({ checked });
    }

    // eslint-disable-next-line class-methods-use-this
    displayTelemetryTable()
    {
        return (
            <div className="displayTelemetryTable">
                <div className="sectionTitle">Aircraft Telemetry</div>
                <table className="table table-condensed table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Data</th>
                            <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getAllRows()}
                    </tbody>
                </table>
                <IntervalTimer
                    timeout={1000}
                    callback={() => {
                            this.props.getAircraftTelem()
                        }
                    }
                    enabled={this.state.checked}
                    repeat={true}
                />
                <Switch onChange={this.handleChange} checked={this.state.checked} />
            </div>
        );
    }

    getAllRows() {
        const arr = [];
        _.forOwn(this.props.aircraft, function(value, key) {
            arr.push(tableRow(key, value));
        });
        return arr;
    }

    render()
    {
        return this.displayTelemetryTable();
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getAircraftTelem,
    }, dispatch);
}

function mapStateToProps(state)
{
    return {
        aircraft: state.aircraft,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPanel);
