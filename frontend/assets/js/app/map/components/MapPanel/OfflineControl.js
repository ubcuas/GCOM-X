import { MapControl, withLeaflet } from 'react-leaflet';

const downloadIcon = '/static/images/save.png';

/*
 *  Offline Control implementation
 */
class OfflineControl extends MapControl {
    createLeafletElement(props) {
        return new L.control.savetiles(props.tileLayer, {
            position: 'bottomright',
            saveText: '<img src="'+downloadIcon+'"/>',
            rmText: '✖',
            zoomlevels: [13,18],
            maxZoom: 20,
            saveWhatYouSee: false,
            bounds: null,
            confirm: function(layer, successCallback) {
                if (window.confirm("Save " + layer._tilesforSave.length)) {
                    successCallback();
                }
            },
            confirmRemoval: function(layer, successCallback) {
                if (window.confirm("Remove all " + layer.storagesize + " tiles?")) {
                    successCallback();
                }
            },
        });
    }
}

export default withLeaflet(OfflineControl);