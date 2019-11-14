html5 player for raw h.264 streams. 
================
 
 A javascript library which implements websocket client for watching and focusing on raw h.264 live streams in your browser that works directly on top of a standard HTML5 element and MediaSource Extensions. 
 
 It works by transmuxing H264 NAL unit into ISO BMFF (MP4) fragments.

 I removed the original websockets proxy server. I wrote another proxy to fetch and send h264 NAL units from rtsp streams. My server sends one or more complete NAL unit(s) at a time. So I simplified the original h264-nal-slicesreader.js as the unit always starts at the begining of a ws messages and h264-demuxer.js already does the proper search work. My server code is not based on the original one and is not included. The server side is much easier than this js code 😓.

 Other changes:
 
 1. Adjusted display framerate to 25Hz according to my rtsp sources.

 2. Added ws address when init a Wfs().

 3. Removed all file handle things. ONLY H264 allowed.
 
 4. Changed to babel 7.
    
 
##  Original see

[wfs.js](https://github.com/ChihChengYang/wfs.js "wfs.js")

[modified wfs.js](https://github.com/MarkRepo/wfs.js "modified wfs.js")

	
	


 
