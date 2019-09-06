import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropdown from 'react-dropdown';
import { loadMissions } from '../../actions/action-loadmissions';
import { loadRoutes } from '../../actions/action-loadroute';
import { updateCurMission } from '../../actions/action-updatecurmission';
import { updateNewAlt } from '../../actions/action-updatenewwp';
import { updateMapProps } from '../../actions/action-updatemapprops'
import axios from "axios";
import 'react-dropdown/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
/*
 * Panel to manage waypoints, obstacles, etc
 */
class BottomPanel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = null;
    }

    componentDidMount() {
        this.props.loadMissions();
    }

    // eslint-disable-next-line class-methods-use-this
    waypointTableRow(marker)
    {
        return (
            <tr key={marker.order}>
                <th scope="row">{marker.order}</th>
                <td>{marker.latitude.toFixed(5)}</td>
                <td>{marker.longitude.toFixed(5)}</td>
                <td>{marker.altitude}</td>
            </tr>
        );
    }

    displayWaypointTable()
    {
        return (
            <div className="displayWaypointTable col-sm-8">
                <table className="table table-condensed table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Latitude</th>
                            <th scope="col">Longitude</th>
                            <th scope="col">Altitude</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.markers.map(this.waypointTableRow)}
                    </tbody>
                </table>
            </div>
        );
    }

    displayControls()
    {
        const onRefresh = () =>
        {
            this.props.loadMissions();
        };

        const onChange = (e) =>
        {
            this._onSelect;
            const missionId = e.value;
            this.props.loadRoutes(missionId);
            this.props.updateCurMission(missionId);

            // recenter the new mission
            sleep(2000).then(() => {
                if (this.props.markers.length > 0)
                {
                    this.props.updateMapProps({ latitude: this.props.markers[0].latitude , longitude: this.props.markers[0].longitude, zoom: 16 });
                }
            });
        };

        const applyReroute = () =>
        {
            const REROUTES_ENDPOINT = "/avoidance/api/reroute/";
            axios.post(REROUTES_ENDPOINT + this.props.currentMission + "/", { waypoints: this.props.markers })
            .then(response => {
                alert('The waypoints were successfully rerouted');
            }).catch(() => {
                alert('There was an error rerouting');
            });
        }

        const onValChange = (e) =>
        {
            this.props.updateNewAlt(e.target.value);
        }

        const loadRoutes = () =>
        {
            this.props.loadRoutes(this.props.currentMission);
        }

        return (
            <div className="controls col-sm-4">
                <div className="sectionTitle">Interop missions</div>
                <div className="displayFlex">
                    <Dropdown
                        options={this.props.missions.missions}
                        value={{
                            value: this.props.currentMission || 'Select...',
                            label: this.props.currentMission || 'Select...',
                        }}
                        onChange={onChange}
                        placeholder="Select..."
                        className="mission-select"
                    />
                    <button type="button" className="btn btn-info btn-refresh" onClick={onRefresh}>
                        <FontAwesomeIcon icon="sync-alt" />
                    </button>
                    <button type="button" className="btn btn-primary btn-apply" onClick={applyReroute}>
                        Apply
                    </button>
                    <button type="button" className="btn btn-secondary btn-undo" onClick={loadRoutes}>
                        Undo
                    </button>
                </div>
                <div className="sectionTitle">New waypoint altitude (ft)</div>
                <input
                    type={'text'}
                    defaultValue={this.props.newAltitude}
                    onChange={onValChange}
                />
            </div>
        );
    }

    render()
    {
        return (
            <div className="bottomPanel">
                <div className="container-fluid">
                    <div className="row">
                        {this.displayControls()}
                        {this.displayWaypointTable()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state)
{
    return {
        markers: state.markers,
        missions: state.missions,
        currentMission: state.curMission,
        newAltitude: state.newAlt
    };
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        loadMissions,
        loadRoutes,
        updateCurMission,
        updateNewAlt,
        updateMapProps,
    }, dispatch);
}

function sleep(time)
{
    return new Promise((resolve) => setTimeout(resolve, time));
}

const waypointPropType = PropTypes.shape({
    id: PropTypes.any,
    latlng: PropTypes.array,
});

BottomPanel.propTypes = {
    markers: PropTypes.arrayOf(waypointPropType).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomPanel);
