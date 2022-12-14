import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import KeyHandler, { KEYPRESS, KEYDOWN } from 'react-key-handler';
import './style.scss';
import { ObjectStatus, ConfirmObjectModalType } from '../Imp';

/*
 * Modal that opens with object info when object is about to be saved
 */
class ConfirmObjectModal extends React.Component
{
    getModalHeight()
    {
        switch (this.props.status.type)
        {
            case ConfirmObjectModalType.SAVE:
                return '95%';
            case ConfirmObjectModalType.COMBINE:
                return '50%';
            case ConfirmObjectModalType.DELETE:
                return '30%';
            default:
                throw TypeError('Invalid Status type');
        }
    }

    getSaveButtonText()
    {
        const { status, objectStatus } = this.props;
        if (status.type === ConfirmObjectModalType.DELETE)
            return 'Delete';
        if (objectStatus === ObjectStatus.LOADED)
            return 'Update';
        if (objectStatus === ObjectStatus.COMBINING)
            return 'Combine';

        return 'Save';
    }

    getModalContent()
    {
        const { status, currentObject } = this.props;
        switch (status.type)
        {
            case ConfirmObjectModalType.SAVE:
                return (
                    <div>
                        <h3>Object Data</h3>
                        <div><pre>{
                            JSON.stringify(currentObject, null, 4)
                        }</pre></div>
                    </div>
                );
            case ConfirmObjectModalType.DELETE:
                return (
                    <div>
                        <h3>Delete Object?</h3>
                    </div>
                );
            case ConfirmObjectModalType.COMBINE: {
                const { latitude, longitude, orientation, orientationAbs } = currentObject;
                const combineObjectData = {
                    latitude,
                    longitude,
                    orientation,
                    orientationAbs,
                };
                return (
                    <div>
                        <h3>Object Data</h3>
                        <div><pre>{
                            JSON.stringify(combineObjectData, null, 4)
                        }</pre></div>
                    </div>
                );
            }
            default:
                throw TypeError('Invalid Status type');
        }
    }

    /**
     * Handler for keypresses
     * @param {String} key key name to handle
     */
    handleKeyPress(key)
    {
        if (!this.props.status.isOpen)
            return;

        switch (key)
        {
            case 'enter':
                this.props.saveConfirmObjectModal();
                break;
            case 'esc':
                this.props.closeConfirmObjectModal();
                break;
            default:
                break;
        }
    }

    render()
    {
        const { status, closeConfirmObjectModal, saveConfirmObjectModal } = this.props;

        const style = {
            content: {
                width: '35%',
                height: this.getModalHeight(),
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '12px',
            },
        };

        return (
            <div className="wrapper">
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="Enter"
                    onKeyHandle={() => this.handleKeyPress('enter')}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="Escape"
                    onKeyHandle={() => this.handleKeyPress('esc')}
                />
                <Modal
                    isOpen={status.isOpen}
                    style={style}
                    ariaHideApp={false}
                >
                    { this.getModalContent() }
                    <button
                        className={`saveConfirmObjectModal btn float-right
                                    ${(status.type === ConfirmObjectModalType.SAVE ||
                                       status.type === ConfirmObjectModalType.COMBINE)
                                    ? 'btn-success' : 'btn-danger'}`}
                        onClick={() => saveConfirmObjectModal()}
                    >
                        { this.getSaveButtonText() }
                    </button>
                    <button
                        className="closeConfirmObjectModal btn btn-warning float-right"
                        onClick={() => closeConfirmObjectModal()}
                    >
                        Close
                    </button>
                </Modal>
            </div>
        );
    }
}

ConfirmObjectModal.propTypes = {
    /* Object currently being viewed/created */
    currentObject: PropTypes.shape({
        latitude: PropTypes.string.isRequired,
        longitude: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        shape: PropTypes.string.isRequired,
        background_color: PropTypes.string.isRequired,
        alphanumeric: PropTypes.string.isRequired,
        alphanumeric_color: PropTypes.string.isRequired,
        orientation: PropTypes.string.isRequired,
        image_source: PropTypes.string.isRequired,
        pixel_location: PropTypes.shape({
            x: PropTypes.string.isRequired,
            y: PropTypes.string.isRequired,
            w: PropTypes.string.isRequired,
            h: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    /* Flag that describes modal isOpen and Type */
    status: PropTypes.shape({
        isOpen: PropTypes.bool.isRequired,
        type: PropTypes.number.isRequired,
    }).isRequired,
    /* Functions to open and close modal */
    closeConfirmObjectModal: PropTypes.func.isRequired,
    saveConfirmObjectModal: PropTypes.func.isRequired,
    /* Status of object creation (default, creating, saved, cancelled, loaded) */
    objectStatus: PropTypes.number.isRequired,
};

export default ConfirmObjectModal;
