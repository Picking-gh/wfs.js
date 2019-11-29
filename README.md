html5 player for raw h.264 streams. 
================
 
 A javascript library which implements websocket client for watching and focusing on raw h.264 live streams in your browser that works directly on top of a standard HTML5 element and MediaSource Extensions. 
 
 It works by transmuxing H264 NAL unit into ISO BMFF (MP4) fragments.

 I removed the original websocket server. It serves only h264 files. An alternative server could be a combination of `websocketd` + `openRTSP` which serves rtsp streams. Originaly, `openRTSP` may devide a h264 NAL unit into several parts when sending via `stdout`. One needs to regroup these parts again in javascript, which is already coded in the orgiginal `wfs.js` (see `_read()` in `h264-nal-slicesreader.js`. In this fork I rename it to `preprocesser-2.js`). If one, like me, adds a wrapper to `openRTSP` that make it send one or more complete NAL unit(s) at a time, data can be sent to `h264-demuxer.js` directly, which means one can simplify the original `h264-nal-slicesreader.js` (in this fork I rename it to `preprocesser-1.js`). Switch is in `websocket-loader.js`.

 A working websocket server combination may be `path/to/websocketd --binary=true --port=PORT path/to/openRTSP -v rtsp://the.stream`.

 Note that `openRTSP` receives no `stdin` input. One can wrap it with some code to pass url from `websocketd` via `stdin` and transfer its `stdout` data to `websocketd`, or just modify its code. I tried `xargs` but it does not do. `xargs` does not transfer the `stdout`.

 Other changes:
 
 1. Adjusted display framerate to 25Hz according to my rtsp sources.

 2. Added ws address when init a Wfs().

 3. Removed all file handle things. ONLY H264 allowed.

 4. Removed json structure sent to websocket server. Only url sent.
 
 5. Changed to babel 7.

## build wfs.js

```sh
cd wfs.js
npm install
npm run build
```

## web side usage

See client directory. No http server in this fork. Just browse the html file after all IPs are properly set and your websocket server is started.

rtsp url is set in the html file. Yes, this is a normal player now.
 
##  See also

* Original [wfs.js](https://github.com/ChihChengYang/wfs.js)

* Modified [wfs.js](https://github.com/MarkRepo/wfs.js)

* [websocetd](https://github.com/joewalnes/websocketd) is a small command-line tool that will wrap an existing command-line interface program, and allow it to be accessed via a WebSocket.

* [openRTSP](http://www.live555.com/openRTSP/) is a command-line program that can be used to open, stream, receive, and (optionally) record media streams that are specified by a RTSP URL - i.e., an URL that begins with rtsp://.

