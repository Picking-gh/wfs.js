/*
 * H264 NAL Slicer
 */
import Event from '../events';
import EventHandler from '../event-handler';
import H264Demuxer from '../demux/h264-demuxer';

class SlicesReader extends EventHandler {

    constructor(wfs, config = null) {
        super(wfs, Event.H264_DATA_PARSING);

        this.config = this.wfs.config || config;
        this.h264Demuxer = new H264Demuxer(wfs);
        this.wfs = wfs;
    }

    destroy() {
        EventHandler.prototype.destroy.call(this);
    }

 
    onH264DataParsing(event) {
        this.wfs.trigger(Event.H264_DATA_PARSED, {
            data: event.data
        });
    }

}

export default SlicesReader;