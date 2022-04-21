import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { OBJECT_VIEW_ENDPOINT } from '../Imp';
/*
 * Displays list of objects from database
 */
const RightPanel = (props) =>
{
    const { objectList, currentObjectId, loadObject } = props;

    return (
        <div className="rightPanel col-md-3 col-sm-3">
            <button className="objectListHeader btn btn-primary btn-block">Objects</button>
            <div className="objectList">{
                /* Generate a button with object elements for every object in the list */
                objectList.map(object =>
                (
                    <button
                        key={object.id}
                        /* Change color if object is selected */
                        className={
                            `objectListItem btn btn-block
                            ${(currentObjectId === object.id) ? 'btn-primary' : 'btn-secondary'}`
                        }
                        onClick={() =>
                        {
                            if (currentObjectId !== object.id)
                                loadObject(object.id);
                        }}
                    >
                        <div className="objectImage">
                            <img
                                src={`${OBJECT_VIEW_ENDPOINT}${object.id}.jpg`}
                                alt="selected object"
                            />
                        </div>
                        <div className="objectName">{
                            /* Generate object name */
                            object.name
                        }</div>

                    </button>
                ))
            }</div>
        </div>
    );
};

RightPanel.defaultProps = {
    currentObjectId: null,
};

RightPanel.propTypes = {
    /* List of objects from database */
    objectList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    /* Database ID of current object, null if object has not been saved yet */
    currentObjectId: PropTypes.number,
    /* Makes current object the selected saved object */
    loadObject: PropTypes.func.isRequired,
};

export default RightPanel;
