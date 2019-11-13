/**
 * WFS interface, Jeff Yang 2016.10
 */
'use strict';

import Event from './events';
import FlowController from './controller/flow-controller';
import BufferController from './controller/buffer-controller';
import EventEmitter from 'events';
import WebsocketLoader from './loader/websocket-loader';


class Wfs {

  static get version() {
    // replaced with browserify-versionify transform
    return '__VERSION__' + 'v.0.0.0.1';
  }

  static isSupported() {
    return (window.MediaSource &&
      typeof window.MediaSource.isTypeSupported === 'function' &&
      window.MediaSource.isTypeSupported('video/mp4;'));
  }

  static get Events() {
    return Event;
  }

  static get DefaultConfig() {
    if (!Wfs.defaultConfig) {
      Wfs.defaultConfig = {
        autoStartLoad: true,
        startPosition: -1,
        debug: false,
        fLoader: undefined,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 1000,
        fragLoadingMaxRetryTimeout: 64000,
        fragLoadingLoopThreshold: 3,
        forceKeyFrameOnDiscontinuity: true,
        appendErrorMaxRetry: 3
      };
    }
    return Wfs.defaultConfig;
  }

  static set DefaultConfig(defaultConfig) {
    Wfs.defaultConfig = defaultConfig;
  }

  constructor(ws_server, config = {}) {
    this.ws_server = ws_server;
    var defaultConfig = Wfs.DefaultConfig;
    for (var prop in defaultConfig) {
      if (prop in config) {
        continue;
      }
      config[prop] = defaultConfig[prop];
    }
    this.config = config;
    // observer setup
    var observer = this.observer = new EventEmitter();
    observer.trigger = function trigger(event, ...data) {
      observer.emit(event, event, ...data);
    };

    observer.off = function off(event, ...data) {
      observer.removeListener(event, ...data);
    };
    this.on = observer.on.bind(observer);
    this.off = observer.off.bind(observer);
    this.trigger = observer.trigger.bind(observer);

    this.flowController = new FlowController(this);
    this.bufferController = new BufferController(this);
    this.websocketLoader = new WebsocketLoader(this);
    this.mediaType = undefined;
  }

  destroy() {
    this.flowController.destroy();
    this.bufferController.destroy();
    this.websocketLoader.destroy();
  }

  attachMedia(media, channelName = 'tv', mediaType = 'H264Raw', websocketName = 'play2') {
    this.mediaType = mediaType;
    this.media = media;
    this.trigger(Event.MEDIA_ATTACHING, {
      media: media,
      channelName: channelName,
      mediaType: mediaType,
      websocketName: websocketName
    });
  }

  attachWebsocket(websocket, channelName) {
    this.trigger(Event.WEBSOCKET_ATTACHING, {
      websocket: websocket,
      mediaType: this.mediaType,
      channelName: channelName
    });
  }

}

export default Wfs;