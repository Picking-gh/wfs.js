/*
 * Hook for processing attached data on H264 NAL unit data.
 * Data passed to this module must be complete H264 NAL(s).
 */
import Event from '../events';
import EventHandler from '../event-handler';
import H264Demuxer from '../demux/h264-demuxer';

class PreProcesser extends EventHandler {

    constructor(wfs, config = null) {
        super(wfs, Event.H264_DATA_PARSING);

        this.config = this.wfs.config || config;
        this.h264Demuxer = new H264Demuxer(wfs);
        this.wfs = wfs;
    }

    destroy() {
        this.h264Demuxer.destroy();
        EventHandler.prototype.destroy.call(this);
    }


    onH264DataParsing(event) {
        // todo: add data preprocessing code here.

        this.wfs.trigger(Event.H264_DATA_PARSED, {
            data: event.data
        });
    }

}

export default PreProcesser;