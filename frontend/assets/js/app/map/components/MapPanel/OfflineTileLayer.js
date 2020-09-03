import { GridLayer, withLeaflet } from 'react-leaflet';
/*
 *  Offline layer implementation
 */

class OfflineTileLayer extends GridLayer { 
    createLeafletElement(props) {
        return props.tileLayer;
    }
}

export default withLeaflet(OfflineTileLayer);