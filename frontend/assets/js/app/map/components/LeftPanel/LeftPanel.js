import React from 'react';
import IntervalTimer from 'react-interval-timer';
import Switch from 'react-switch';
import { bindActionCreators } from 'redux';
import { getAircraftTelem } from '../../actions/action-getaircrafttelem';
import { connect } from 'react-redux';
import _ from 'lodash';
import './style.scss';
import WaypointEditor from '../WaypointEditor';
import DraggableContainer from '../DraggableContainer';

function tableRow(key, value)
{
    return (
        <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
        </tr>
    );
}

function valueToFeet(value){
    return value*3.2808
}

function valueWithUnits(value, key) {
    switch(key){
        case "altitude_msl":
            value+="m | "+valueToFeet(value)+"ft"
            break
        case "latitude":
        case "longitude":
        case "uas_heading":
            value+="°"
            break
    }
    return value
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
            arr.push(tableRow(key, valueWithUnits(value, key)));
        });
        return arr;
    }

    render() {
        return (
            <DraggableContainer
                top={"30%"}
                left={"0"}
                title="Left Panel"
                width={310}
            >
                <div id="left-panel">
                    {this.displayTelemetryTable()}
                </div>
            </DraggableContainer>
        )
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
