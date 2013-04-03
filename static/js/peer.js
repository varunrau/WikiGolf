/*! peerjs.min.js build:0.2.0, production. Copyright(c) 2013 Michelle Bu <michelle@michellebu.com> */(function(e){function n(){this._pieces=[],this._parts=[]}function r(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}function i(e){this.utf8=e,this.bufferBuilder=new n}function s(){this._events={}}function a(e,t){if(!(this instanceof a))return new a(e);this._dc=e,u.debug=t,this._outgoing={},this._incoming={},this._received={},this._window=1e3,this._mtu=500,this._interval=10,this._count=0,this._queue=[],this._setupDC()}function h(e,t){e&&e.constructor==Object&&(t=e,e=undefined);if(!(this instanceof h))return new h(e,t);s.call(this);if(!u.isBrowserCompatible()){this._abort("browser-incompatible","The current browser does not support WebRTC DataChannels");return}t.host==="/"&&(t.host=window.location.hostname),t=u.extend({debug:!1,host:"0.peerjs.com",port:9e3,key:"peerjs",config:{iceServers:[{url:"stun:stun.l.google.com:19302"}]}},t),this._options=t,u.debug=t.debug;var n=this;if(e&&!/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.exec(e)){u.setZeroTimeout(function(){n._abort("invalid-id",'ID "'+e+'" is invalid')});return}if(t.key&&!/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.exec(t.key)){u.setZeroTimeout(function(){n._abort("invalid-key",'API KEY "'+t.key+'" is invalid')});return}this.destroyed=!1,this.disconnected=!1,this.connections={},this.managers={},this._queued=[],e?(this.id=e,this._init()):this._getId()}function p(e,t,n){if(!(this instanceof p))return new p(e,t,n);s.call(this),n=u.extend({reliable:!1,serialization:"binary"},n),this.open=!1,this.label=n.label,this.metadata=n.metadata,this.serialization=u.browserisms!=="Firefox"?n.serialization:"binary",this._isReliable=u.browserisms!=="Firefox"?n.reliable:!1,this.peer=e,this._dc=t,!this._dc||this._configureDataChannel()}function d(e,t,n,r){if(!(this instanceof d))return new d(e,t,n,r);s.call(this),r=u.extend({config:{iceServers:[{url:"stun:stun.l.google.com:19302"}]}},r),this._options=r,this.open=!0,this.id=e,this.peer=t,this.pc=null,this.labels={},this._default=0,this.connections={},this._queued=[],this._socket=n,!this.id||this.initialize()}function v(e,t,n,r){if(!(this instanceof v))return new v(e,t,n,r);s.call(this),this._id=r;var i=u.randomToken();this.disconnected=!1,this._httpUrl="http://"+e+":"+t+"/"+n+"/"+r+"/"+i,this._wsUrl="ws://"+e+":"+t+"/peerjs?key="+n+"&id="+r+"&token="+i}var t={};t.useBlobBuilder=function(){try{return new Blob([]),!1}catch(e){return!0}}(),t.useArrayBufferView=!t.useBlobBuilder&&function(){try{return(new Blob([new Uint8Array([])])).size===0}catch(e){return!0}}(),e.binaryFeatures=t,e.BlobBuilder=window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder||window.BlobBuilder,n.prototype.append=function(e){typeof e=="number"?this._pieces.push(e):(this._flush(),this._parts.push(e))},n.prototype._flush=function(){if(this._pieces.length>0){var e=new Uint8Array(this._pieces);t.useArrayBufferView||(e=e.buffer),this._parts.push(e),this._pieces=[]}},n.prototype.getBuffer=function(){this._flush();if(t.useBlobBuilder){var e=new BlobBuilder;for(var n=0,r=this._parts.length;n<r;n++)e.append(this._parts[n]);return e.getBlob()}return new Blob(this._parts)},e.BinaryPack={unpack:function(e){var t=new r(e);return t.unpack()},pack:function(e,t){var n=new i(t),r=n.pack(e);return r}},r.prototype.unpack=function(){var e=this.unpack_uint8();if(e<128){var t=e;return t}if((e^224)<32){var n=(e^224)-32;return n}var r;if((r=e^160)<=15)return this.unpack_raw(r);if((r=e^176)<=15)return this.unpack_string(r);if((r=e^144)<=15)return this.unpack_array(r);if((r=e^128)<=15)return this.unpack_map(r);switch(e){case 192:return null;case 193:return undefined;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return undefined;case 213:return undefined;case 214:return undefined;case 215:return undefined;case 216:return r=this.unpack_uint16(),this.unpack_string(r);case 217:return r=this.unpack_uint32(),this.unpack_string(r);case 218:return r=this.unpack_uint16(),this.unpack_raw(r);case 219:return r=this.unpack_uint32(),this.unpack_raw(r);case 220:return r=this.unpack_uint16(),this.unpack_array(r);case 221:return r=this.unpack_uint32(),this.unpack_array(r);case 222:return r=this.unpack_uint16(),this.unpack_map(r);case 223:return r=this.unpack_uint32(),this.unpack_map(r)}},r.prototype.unpack_uint8=function(){var e=this.dataView[this.index]&255;return this.index++,e},r.prototype.unpack_uint16=function(){var e=this.read(2),t=(e[0]&255)*256+(e[1]&255);return this.index+=2,t},r.prototype.unpack_uint32=function(){var e=this.read(4),t=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,t},r.prototype.unpack_uint64=function(){var e=this.read(8),t=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,t},r.prototype.unpack_int8=function(){var e=this.unpack_uint8();return e<128?e:e-256},r.prototype.unpack_int16=function(){var e=this.unpack_uint16();return e<32768?e:e-65536},r.prototype.unpack_int32=function(){var e=this.unpack_uint32();return e<Math.pow(2,31)?e:e-Math.pow(2,32)},r.prototype.unpack_int64=function(){var e=this.unpack_uint64();return e<Math.pow(2,63)?e:e-Math.pow(2,64)},r.prototype.unpack_raw=function(e){if(this.length<this.index+e)throw new Error("BinaryPackFailure: index is out of range "+this.index+" "+e+" "+this.length);var t=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,t},r.prototype.unpack_string=function(e){var t=this.read(e),n=0,r="",i,s;while(n<e)i=t[n],i<128?(r+=String.fromCharCode(i),n++):(i^192)<32?(s=(i^192)<<6|t[n+1]&63,r+=String.fromCharCode(s),n+=2):(s=(i&15)<<12|(t[n+1]&63)<<6|t[n+2]&63,r+=String.fromCharCode(s),n+=3);return this.index+=e,r},r.prototype.unpack_array=function(e){var t=new Array(e);for(var n=0;n<e;n++)t[n]=this.unpack();return t},r.prototype.unpack_map=function(e){var t={};for(var n=0;n<e;n++){var r=this.unpack(),i=this.unpack();t[r]=i}return t},r.prototype.unpack_float=function(){var e=this.unpack_uint32(),t=e>>31,n=(e>>23&255)-127,r=e&8388607|8388608;return(t==0?1:-1)*r*Math.pow(2,n-23)},r.prototype.unpack_double=function(){var e=this.unpack_uint32(),t=this.unpack_uint32(),n=e>>31,r=(e>>20&2047)-1023,i=e&1048575|1048576,s=i*Math.pow(2,r-20)+t*Math.pow(2,r-52);return(n==0?1:-1)*s},r.prototype.read=function(e){var t=this.index;if(t+e<=this.length)return this.dataView.subarray(t,t+e);throw new Error("BinaryPackFailure: read index out of range")},i.prototype.pack=function(e){var n=typeof e;if(n=="string")this.pack_string(e);else if(n=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(n=="boolean")e===!0?this.bufferBuilder.append(195):e===!1&&this.bufferBuilder.append(194);else if(n=="undefined")this.bufferBuilder.append(192);else{if(n!="object")throw new Error('Type "'+n+'" not yet supported');if(e===null)this.bufferBuilder.append(192);else{var r=e.constructor;if(r==Array)this.pack_array(e);else if(r==Blob||r==File)this.pack_bin(e);else if(r==ArrayBuffer)t.useArrayBufferView?this.pack_bin(new Uint8Array(e)):this.pack_bin(e);else if("BYTES_PER_ELEMENT"in e)t.useArrayBufferView?this.pack_bin(e):this.pack_bin(e.buffer);else if(r==Object)this.pack_object(e);else if(r==Date)this.pack_string(e.toString());else{if(typeof e.toBinaryPack!="function")throw new Error('Type "'+r.toString()+'" not yet supported');this.bufferBuilder.append(e.toBinaryPack())}}}return this.bufferBuilder.getBuffer()},i.prototype.pack_bin=function(e){var t=e.length||e.byteLength||e.size;if(t<=15)this.pack_uint8(160+t);else if(t<=65535)this.bufferBuilder.append(218),this.pack_uint16(t);else{if(!(t<=4294967295))throw new Error("Invalid length");this.bufferBuilder.append(219),this.pack_uint32(t)}this.bufferBuilder.append(e)},i.prototype.pack_string=function(e){var t;if(this.utf8){var n=new Blob([e]);t=n.size}else t=e.length;if(t<=15)this.pack_uint8(176+t);else if(t<=65535)this.bufferBuilder.append(216),this.pack_uint16(t);else{if(!(t<=4294967295))throw new Error("Invalid length");this.bufferBuilder.append(217),this.pack_uint32(t)}this.bufferBuilder.append(e)},i.prototype.pack_array=function(e){var t=e.length;if(t<=15)this.pack_uint8(144+t);else if(t<=65535)this.bufferBuilder.append(220),this.pack_uint16(t);else{if(!(t<=4294967295))throw new Error("Invalid length");this.bufferBuilder.append(221),this.pack_uint32(t)}for(var n=0;n<t;n++)this.pack(e[n])},i.prototype.pack_integer=function(e){if(-32<=e&&e<=127)this.bufferBuilder.append(e&255);else if(0<=e&&e<=255)this.bufferBuilder.append(204),this.pack_uint8(e);else if(-128<=e&&e<=127)this.bufferBuilder.append(208),this.pack_int8(e);else if(0<=e&&e<=65535)this.bufferBuilder.append(205),this.pack_uint16(e);else if(-32768<=e&&e<=32767)this.bufferBuilder.append(209),this.pack_int16(e);else if(0<=e&&e<=4294967295)this.bufferBuilder.append(206),this.pack_uint32(e);else if(-2147483648<=e&&e<=2147483647)this.bufferBuilder.append(210),this.pack_int32(e);else if(-0x8000000000000000<=e&&e<=0x8000000000000000)this.bufferBuilder.append(211),this.pack_int64(e);else{if(!(0<=e&&e<=0x10000000000000000))throw new Error("Invalid integer");this.bufferBuilder.append(207),this.pack_uint64(e)}},i.prototype.pack_double=function(e){var t=0;e<0&&(t=1,e=-e);var n=Math.floor(Math.log(e)/Math.LN2),r=e/Math.pow(2,n)-1,i=Math.floor(r*Math.pow(2,52)),s=Math.pow(2,32),o=t<<31|n+1023<<20|i/s&1048575,u=i%s;this.bufferBuilder.append(203),this.pack_int32(o),this.pack_int32(u)},i.prototype.pack_object=function(e){var t=Object.keys(e),n=t.length;if(n<=15)this.pack_uint8(128+n);else if(n<=65535)this.bufferBuilder.append(222),this.pack_uint16(n);else{if(!(n<=4294967295))throw new Error("Invalid length");this.bufferBuilder.append(223),this.pack_uint32(n)}for(var r in e)e.hasOwnProperty(r)&&(this.pack(r),this.pack(e[r]))},i.prototype.pack_uint8=function(e){this.bufferBuilder.append(e)},i.prototype.pack_uint16=function(e){this.bufferBuilder.append(e>>8),this.bufferBuilder.append(e&255)},i.prototype.pack_uint32=function(e){var t=e&4294967295;this.bufferBuilder.append((t&4278190080)>>>24),this.bufferBuilder.append((t&16711680)>>>16),this.bufferBuilder.append((t&65280)>>>8),this.bufferBuilder.append(t&255)},i.prototype.pack_uint64=function(e){var t=e/Math.pow(2,32),n=e%Math.pow(2,32);this.bufferBuilder.append((t&4278190080)>>>24),this.bufferBuilder.append((t&16711680)>>>16),this.bufferBuilder.append((t&65280)>>>8),this.bufferBuilder.append(t&255),this.bufferBuilder.append((n&4278190080)>>>24),this.bufferBuilder.append((n&16711680)>>>16),this.bufferBuilder.append((n&65280)>>>8),this.bufferBuilder.append(n&255)},i.prototype.pack_int8=function(e){this.bufferBuilder.append(e&255)},i.prototype.pack_int16=function(e){this.bufferBuilder.append((e&65280)>>8),this.bufferBuilder.append(e&255)},i.prototype.pack_int32=function(e){this.bufferBuilder.append(e>>>24&255),this.bufferBuilder.append((e&16711680)>>>16),this.bufferBuilder.append((e&65280)>>>8),this.bufferBuilder.append(e&255)},i.prototype.pack_int64=function(e){var t=Math.floor(e/Math.pow(2,32)),n=e%Math.pow(2,32);this.bufferBuilder.append((t&4278190080)>>>24),this.bufferBuilder.append((t&16711680)>>>16),this.bufferBuilder.append((t&65280)>>>8),this.bufferBuilder.append(t&255),this.bufferBuilder.append((n&4278190080)>>>24),this.bufferBuilder.append((n&16711680)>>>16),this.bufferBuilder.append((n&65280)>>>8),this.bufferBuilder.append(n&255)};var o=Array.isArray;s.prototype.addListener=function(e,t,n,r){if("function"!=typeof t)throw new Error("addListener only takes instances of Function");return this.emit("newListener",e,typeof t.listener=="function"?t.listener:t),this._events[e]?o(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,this},s.prototype.on=s.prototype.addListener,s.prototype.once=function(e,t,n){function i(){r.removeListener(e,i),t.apply(this,arguments)}if("function"!=typeof t)throw new Error(".once only takes instances of Function");var r=this;return i.listener=t,r.on(e,i),this},s.prototype.removeListener=function(e,t,n){if("function"!=typeof t)throw new Error("removeListener only takes instances of Function");if(!this._events[e])return this;var r=this._events[e];if(o(r)){var i=-1;for(var s=0,u=r.length;s<u;s++)if(r[s]===t||r[s].listener&&r[s].listener===t){i=s;break}if(i<0)return this;r.splice(i,1),r.length==0&&delete this._events[e]}else(r===t||r.listener&&r.listener===t)&&delete this._events[e];return this},s.prototype.off=s.prototype.removeListener,s.prototype.removeAllListeners=function(e){return arguments.length===0?(this._events={},this):(e&&this._events&&this._events[e]&&(this._events[e]=null),this)},s.prototype.listeners=function(e){return this._events[e]||(this._events[e]=[]),o(this._events[e])||(this._events[e]=[this._events[e]]),this._events[e]},s.prototype.emit=function(e){var e=arguments[0],t=this._events[e];if(!t)return!1;if(typeof t=="function"){switch(arguments.length){case 1:t.call(this);break;case 2:t.call(this,arguments[1]);break;case 3:t.call(this,arguments[1],arguments[2]);break;default:var n=arguments.length,r=new Array(n-1);for(var i=1;i<n;i++)r[i-1]=arguments[i];t.apply(this,r)}return!0}if(o(t)){var n=arguments.length,r=new Array(n-1);for(var i=1;i<n;i++)r[i-1]=arguments[i];var s=t.slice();for(var i=0,n=s.length;i<n;i++)s[i].apply(this,r);return!0}return!1};var u={chromeCompatible:!0,firefoxCompatible:!0,chromeVersion:26,firefoxVersion:22,debug:!1,browserisms:"",inherits:function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})},extend:function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},pack:BinaryPack.pack,unpack:BinaryPack.unpack,randomPort:function(){return Math.round(Math.random()*60535)+5e3},log:function(){if(u.debug){var e=!1,t=Array.prototype.slice.call(arguments);t.unshift("PeerJS: ");for(var n=0,r=t.length;n<r;n++)t[n]instanceof Error&&(t[n]="("+t[n].name+") "+t[n].message,e=!0);e?console.error.apply(console,t):console.log.apply(console,t)}},setZeroTimeout:function(e){function r(r){t.push(r),e.postMessage(n,"*")}function i(r){r.source==e&&r.data==n&&(r.stopPropagation&&r.stopPropagation(),t.length&&t.shift()())}var t=[],n="zero-timeout-message";return e.addEventListener?e.addEventListener("message",i,!0):e.attachEvent&&e.attachEvent("onmessage",i),r}(this),blobToArrayBuffer:function(e,t){var n=new FileReader;n.onload=function(e){t(e.target.result)},n.readAsArrayBuffer(e)},blobToBinaryString:function(e,t){var n=new FileReader;n.onload=function(e){t(e.target.result)},n.readAsBinaryString(e)},binaryStringToArrayBuffer:function(e){var t=new Uint8Array(e.length);for(var n=0;n<e.length;n++)t[n]=e.charCodeAt(n)&255;return t.buffer},randomToken:function(){return Math.random().toString(36).substr(2)},isBrowserCompatible:function(){var e,t;if(this.chromeCompatible&&(e=navigator.userAgent.split("Chrome/"))&&e.length>1){var n=e[1].split(".")[0];return parseInt(n)>=this.chromeVersion}if(this.firefoxCompatible&&(t=navigator.userAgent.split("Firefox/"))&&t.length>1){var n=t[1].split(".")[0];return parseInt(n)>=this.firefoxVersion}return!1}};a.prototype.send=function(e){var t=u.pack(e);if(t.size<this._mtu){this._handleSend(["no",t]);return}this._outgoing[this._count]={ack:0,chunks:this._chunk(t)},u.debug&&(this._outgoing[this._count].timer=new Date),this._sendWindowedChunks(this._count),this._count+=1},a.prototype.onmessage=function(e){},a.prototype._setupInterval=function(){var e=this;this._timeout=setInterval(function(){var t=e._queue.shift();if(t._multiple)for(var n=0,r=t.length;n<r;n+=1)e._intervalSend(t[n]);else e._intervalSend(t)},this._interval)},a.prototype._intervalSend=function(e){var t=this;u.log("Sending...",e),e=u.pack(e),u.blobToBinaryString(e,function(e){t._dc.send(e)}),t._queue.length===0&&(clearTimeout(t._timeout),t._timeout=null,t._processAcks())},a.prototype._processAcks=function(){for(var e in this._outgoing)this._outgoing.hasOwnProperty(e)&&this._sendWindowedChunks(e)},a.prototype._handleSend=function(e){var t=!0;for(var n=0,r=this._queue.length;n<r;n+=1){var i=this._queue[n];i===e?t=!1:i._multiple&&i.indexOf(e)!==-1&&(t=!1)}t&&(this._queue.push(e),this._timeout||this._setupInterval())},a.prototype._setupDC=function(){var e=this;this._dc.onmessage=function(t){var n=t.data,r=n.constructor;if(r===String){var i=u.binaryStringToArrayBuffer(n);n=u.unpack(i),e._handleMessage(n)}}},a.prototype._handleMessage=function(e){u.log("handleMessage: ",e);var t=e[1],n=this._incoming[t],r=this._outgoing[t],i;switch(e[0]){case"no":var s=t;!s||this.onmessage(u.unpack(s));break;case"end":i=n,!i||i.ack[2]!==e[2]?!i||this._ack(t,i.ack):(this._complete(t),this._received[t]=!0);break;case"ack":i=r;if(!!i){var o=e[2];i.ack=Math.max(o,i.ack),i.ack>=i.chunks.length?(u.log("Time: ",new Date-i.timer),delete this._outgoing[t]):this._processAcks()}break;case"chunk":i=n;if(!i){if(this._received[t]!==undefined)break;i={ack:["ack",t,0],chunks:[]},this._incoming[t]=i}var a=e[2],f=e[3];i.chunks[a]=new Uint8Array(f),a===i.ack[2]&&this._calculateNextAck(t),this._ack(t);break;default:this._handleSend(e)}},a.prototype._chunk=function(e){var t=[],n=e.size,r=0;while(r<n){var i=Math.min(n,r+this._mtu),s=e.slice(r,i),o={payload:s};t.push(o),r=i}return t},a.prototype._ack=function(e,t){var n=this._incoming[e].ack;this._handleSend(n)},a.prototype._calculateNextAck=function(e){var t=this._incoming[e],n=t.chunks;for(var r=0,i=n.length;r<i;r+=1)if(n[r]===undefined){t.ack[2]=r;return}t.ack[2]=n.length},a.prototype._sendWindowedChunks=function(e){u.log("sendWindowedChunks for: ",e);var t=this._outgoing[e],n=t.chunks,r=[],i=Math.min(t.ack+this._window,n.length);for(var s=t.ack;s<i;s+=1)if(!n[s].sent||s===t.ack)s===t.ack&&n[s].sent?(this._window=Math.max(1,Math.round(this._window/10)),i=Math.min(t.ack+this._window,n.length)):s===t.ack&&(this._window=Math.min(1e3,Math.round(this._window*10)),i=Math.min(t.ack+this._window,n.length)),n[s].sent=!0,r.push(["chunk",e,s,n[s].payload]);t.ack+this._window>=n.length-1&&r.push(["end",e,n.length]),r._multiple=!0,this._handleSend(r)},a.prototype._complete=function(e){u.log("Complete",e);var t=this,n=this._incoming[e].chunks,r=new Blob(n);u.blobToArrayBuffer(r,function(e){u.log("Calling onmessage with complete message"),t.onmessage(u.unpack(e))}),delete this._incoming[e]},a.higherBandwidthSDP=function(e){var t=e.split("b=AS:30"),n="b=AS:102400";return t[0]+n+t[1]},e.Reliable=a;var f=null,l=null,c=null;navigator.mozGetUserMedia?(u.browserisms="Firefox",RTCSessionDescription=window.mozRTCSessionDescription,f=window.mozRTCPeerConnection,l=navigator.mozGetUserMedia.bind(navigator)):navigator.webkitGetUserMedia&&(u.browserisms="Webkit",f=window.webkitRTCPeerConnection,l=navigator.webkitGetUserMedia.bind(navigator)),e.RTCSessionDescription=RTCSessionDescription,e.RTCPeerConnection=f,e.getUserMedia=l,u.inherits(h,s),h.prototype._getId=function(e){var t=this;try{var n=new XMLHttpRequest,r="http://"+this._options.host+":"+this._options.port+"/"+this._options.key+"/id",i="?ts="+(new Date).getTime()+""+Math.random();r+=i,n.open("get",r,!0),n.onreadystatechange=function(){n.readyState===4&&(t.id=n.responseText,t._init())},n.send(null)}catch(s){this._abort("server-error","Could not get an ID from the server")}},h.prototype._init=function(){var e=this;this._socket=new v(this._options.host,this._options.port,this._options.key,this.id),this._socket.on("message",function(t){e._handleServerJSONMessage(t)}),this._socket.on("error",function(t){u.log(t),e._abort("socket-error",t)}),this._socket.on("close",function(){var t="Underlying socket has closed";u.log("error",t),e._abort("socket-closed",t)}),this._socket.start()},h.prototype._handleServerJSONMessage=function(e){var t=e.src,n=this.managers[t],r=e.payload;!!r&&!!r.browserisms&&r.browserisms!==u.browserisms&&this._warn("incompatible-peer","Peer "+self.peer+" is on an incompatible browser. Please clean up this peer.");switch(e.type){case"OPEN":this._processQueue(),this.emit("open",this.id);break;case"ERROR":u.log(r.msg),this._abort("server-error",r.msg);break;case"ID-TAKEN":this._abort("unavailable-id","ID `"+this.id+"` is taken");break;case"OFFER":var i={sdp:r.sdp,labels:r.labels,config:this._options.config},n=this.managers[t];n||(n=new d(this.id,t,this._socket,i),this._attachManagerListeners(n),this.managers[t]=n,this.connections[t]={}),n.update(i.labels),n.handleSDP(r.sdp,e.type);break;case"EXPIRE":n&&(n.close(),n.emit("error",new Error("Could not connect to peer "+n.peer)));break;case"ANSWER":n&&n.handleSDP(r.sdp,e.type);break;case"CANDIDATE":n&&n.handleCandidate(r);break;case"LEAVE":n&&n.handleLeave();break;case"INVALID-KEY":this._abort("invalid-key",'API KEY "'+this._key+'" is invalid');break;case"PORT":if(u.browserisms==="Firefox"&&n){n.handlePort(r);break};default:u.log("Unrecognized message type:",e.type)}},h.prototype._processQueue=function(){while(this._queued.length>0){var e=this._queued.pop();e.initialize(this.id,this._socket)}},h.prototype._attachManagerListeners=function(e){var t=this;e.on("connection",function(e){t.connections[e.peer][e.label]=e,t.emit("connection",e)}),e.on("close",function(){!t.managers[e.peer]||delete t.managers[e.peer]}),e.on("error",function(e){t.emit("error",e)})},h.prototype._abort=function(e,t){var n=new Error(t);n.type=e,this.destroy(),this.emit("error",n)},h.prototype._warn=function(e,t){var n=new Error(t);n.type=e,this.emit("error",n)},h.prototype._cleanup=function(){var e=this;if(!!this.managers){var t=Object.keys(this.managers);for(var n=0,r=t.length;n<r;n++)this.managers[t[n]].close();u.setZeroTimeout(function(){e.disconnect()})}this.emit("close")},h.prototype.connect=function(e,t){if(this.disconnected){this._warn("server-disconnected","This Peer has been disconnected from the server and can no longer make connections.");return}t=u.extend({config:this._options.config},t),t.originator=!0;var n=this.managers[e];n||(n=new d(this.id,e,this._socket,t),this._attachManagerListeners(n),this.managers[e]=n,this.connections[e]={});var r=n.connect(t);return!r||(this.connections[e][r[0]]=r[1]),this.id||this._queued.push(n),r[1]},h.prototype.destroy=function(){this.destroyed||(this._cleanup(),this.destroyed=!0)},h.prototype.disconnect=function(){this.disconnected||(this._socket.close(),this.disconnected=!0)},e.Peer=h,u.inherits(p,s),p.prototype._configureDataChannel=function(){u.log("Configuring DataChannel with peer "+this.peer);var e=this;u.browserisms!=="Webkit"&&(this._dc.binaryType="arraybuffer"),this._dc.onopen=function(){u.log("Data channel connection success"),e.open=!0,e.emit("open")},this._isReliable&&(this._reliable=new a(this._dc,u.debug)),this._reliable?this._reliable.onmessage=function(t){e.emit("data",t)}:this._dc.onmessage=function(t){e._handleDataMessage(t)},this._dc.onclose=function(t){u.log("DataChannel closed."),e.close()}},p.prototype._cleanup=function(){!!this._dc&&this._dc.readyState!=="closed"&&(this._dc.close(),this._dc=null),this.open=!1,this.emit("close")},p.prototype._handleDataMessage=function(e){var t=this,n=e.data,r=n.constructor;if(this.serialization==="binary"||this.serialization==="binary-utf8"){if(r===Blob){u.blobToArrayBuffer(n,function(e){n=u.unpack(e),t.emit("data",n)});return}if(r===ArrayBuffer)n=u.unpack(n);else if(r===String){var i=u.binaryStringToArrayBuffer(n);n=u.unpack(i)}}else this.serialization==="json"&&(n=JSON.parse(n));this.emit("data",n)},p.prototype.addDC=function(e){this._dc=e,this._configureDataChannel()},p.prototype.close=function(){if(!this.open)return;this._cleanup()},p.prototype.send=function(e){this.open||this.emit("error",new Error("Connection no longer open."));if(this._reliable){this._reliable.send(e);return}var t=this;if(this.serialization==="none")this._dc.send(e);else if(this.serialization==="json")this._dc.send(JSON.stringify(e));else{var n=this.serialization==="binary-utf8",r=u.pack(e,n);u.browserisms==="Webkit"?u.blobToBinaryString(r,function(e){t._dc.send(e)}):this._dc.send(r)}},u.inherits(d,s),d.prototype.initialize=function(e,t){!e||(this.id=e),!t||(this._socket=t),u.browserisms==="Firefox"&&this._firefoxPortSetup(),this._startPeerConnection(),u.browserisms!=="Firefox"&&this._processQueue(),this._setupIce(),this._setupDataChannel(),u.browserisms!=="Firefox"?this._setupNegotiationHandler():this._options.originator&&(this._firefoxHandlerSetup(),this._firefoxAdditional()),this.initialize=function(){}},d.prototype._firefoxAdditional=function(){u.log("Additional media stream for Firefox.");var e=this;l({audio:!0,fake:!0},function(t){e.pc.addStream(t),e._options.originator?e._makeOffer():e._makeAnswer()},function(e){u.log("Could not getUserMedia")})},d.prototype._firefoxPortSetup=function(){d.usedPorts||(d.usedPorts=[]),this._localPort=u.randomPort();while(d.usedPorts.indexOf(this._localPort)!=-1)this._localPort=u.randomPort();this._remotePort=u.randomPort();while(this._remotePort===this._localPort||d.usedPorts.indexOf(this._remotePort)!=-1)this._remotePort=u.randomPort();d.usedPorts.push(this._remotePort),d.usedPorts.push(this._localPort)},d.prototype._firefoxHandlerSetup=function(){u.log("Setup Firefox `onconnection`.");var e=this;this.pc.onconnection=function(){u.log("FIREFOX: onconnection triggered"),e._processQueue()}},d.prototype._startPeerConnection=function(){u.log("Creating RTCPeerConnection"),this.pc=new f(this._options.config,{optional:[{RtpDataChannels:!0}]})},d.prototype._processQueue=function(){var e=this._queued.pop();!e||e.addDC(this.pc.createDataChannel(e.label,{reliable:!1}))},d.prototype._setupIce=function(){u.log("Listening for ICE candidates.");var e=this;this.pc.onicecandidate=function(t){t.candidate&&(u.log("Received ICE candidates."),e._socket.send({type:"CANDIDATE",payload:{candidate:t.candidate},dst:e.peer}))}},d.prototype._setupNegotiationHandler=function(){var e=this;u.log("Listening for `negotiationneeded`"),this.pc.onnegotiationneeded=function(){u.log("`negotiationneeded` triggered"),e._makeOffer()}},d.prototype._setupDataChannel=function(){var e=this;u.log("Listening for data channel"),this.pc.ondatachannel=function(t){u.log("Received data channel");var n=u.browserisms==="Firefox"?t:t.channel,r=n.label,i=e.labels[r]||{label:r},s=new p(e.peer,n,i);delete e.labels[r],e._attachConnectionListeners(s),e.connections[r]=s,e.emit("connection",s)}},d.prototype._makeOffer=function(){var e=this;this.pc.createOffer(function(t){u.log("Created offer."),e.pc.setLocalDescription(t,function(){u.log("Set localDescription to offer"),e._socket.send({type:"OFFER",payload:{browserisms:u.browserisms,sdp:t,config:e._options.config,labels:e.labels},dst:e.peer}),e.labels={}},function(t){e.emit("error",t),u.log("Failed to setLocalDescription, ",t)})})},d.prototype._makeAnswer=function(){var e=this;this.pc.createAnswer(function(t){u.log("Created answer."),e.pc.setLocalDescription(t,function(){u.log("Set localDescription to answer."),e._socket.send({type:"ANSWER",payload:{browserisms:u.browserisms,sdp:t},dst:e.peer})},function(t){e.emit("error",t),u.log("Failed to setLocalDescription, ",t)})},function(t){e.emit("error",t),u.log("Failed to create answer, ",t)})},d.prototype._cleanup=function(){u.log("Cleanup ConnectionManager for "+this.peer),!!this.pc&&this.pc.readyState!=="closed"&&(this.pc.close(),this.pc=null);var e=this;this._socket.send({type:"LEAVE",dst:e.peer}),this.open=!1,this.emit("close")},d.prototype._attachConnectionListeners=function(e){var t=this;e.on("close",function(){!t.connections[e.label]||delete t.connections[e.label],Object.keys(t.connections).length||t._cleanup()}),e.on("open",function(){t._lock=!1,t._processQueue()})},d.prototype.handlePort=function(e){u.log("Received ports, calling connectDataConnection."),d.usedPorts||(d.usedPorts=[]),d.usedPorts.push(e.local),d.usedPorts.push(e.remote),this.pc.connectDataConnection(e.local,e.remote)},d.prototype.handleSDP=function(e,t){u.browserisms!=="Firefox"&&(e=new RTCSessionDescription(e));var n=this;this.pc.setRemoteDescription(e,function(){u.log("Set remoteDescription: "+t),t==="OFFER"?u.browserisms==="Firefox"?n._firefoxAdditional():n._makeAnswer():u.browserisms==="Firefox"&&(u.log("Peer ANSWER received, connectDataConnection called."),n.pc.connectDataConnection(n._localPort,n._remotePort),n._socket.send({type:"PORT",payload:{remote:n._localPort,local:n._remotePort},dst:n.peer}))},function(e){n.emit("error",e),u.log("Failed to setRemoteDescription, ",e)})},d.prototype.handleCandidate=function(e){var t=new RTCIceCandidate(e.candidate);this.pc.addIceCandidate(t),u.log("Added ICE candidate.")},d.prototype.handleLeave=function(){u.log("Peer "+this.peer+" disconnected."),this.close()},d.prototype.close=function(){if(!this.open){this.emit("error",new Error("Connections to "+this.peer+"are already closed."));return}var e=Object.keys(this.connections);for(var t=0,n=e.length;t<n;t+=1){var r=e[t],i=this.connections[r];i.close()}this.connections=null,this._cleanup()},d.prototype.connect=function(e){if(!this.open)return;e=u.extend({label:"peerjs"},e);while(!!this.connections[e.label])e.label="peerjs"+this._default,this._default+=1;this.labels[e.label]=e;var t;!!this.pc&&!this._lock&&(u.browserisms!=="Firefox"||Object.keys(this.connections).length!==0)&&(t=this.pc.createDataChannel(e.label,{reliable:!1}));var n=new p(this.peer,t,e);return this._attachConnectionListeners(n),this.connections[e.label]=n,t||this._queued.push(n),this._lock=!0,[e.label,n]},d.prototype.update=function(e){var t=Object.keys(e);for(var n=0,r=t.length;n<r;n+=1){var i=t[n];this.labels[i]=e[i]}},u.inherits(v,s),v.prototype.start=function(){this._startXhrStream(),this._startWebSocket()},v.prototype._startWebSocket=function(){var e=this;if(!!this._socket)return;this._socket=new WebSocket(this._wsUrl),this._socket.onmessage=function(t){var n;try{n=JSON.parse(t.data)}catch(r){u.log("Invalid server message",t.data);return}e.emit("message",n)},this._socket.onopen=function(){!e._timeout||(clearTimeout(e._timeout),setTimeout(function(){e._http.abort(),e._http=null},5e3)),u.log("Socket open")}},v.prototype._startXhrStream=function(e){try{var t=this;this._http=new XMLHttpRequest,this._http._index=1,this._http._streamIndex=e||0,this._http.open("post",this._httpUrl+"/id?i="+this._http._streamIndex,!0),this._http.onreadystatechange=function(){this.readyState==2&&!!this.old&&(this.old.abort(),delete this.old),this.readyState>2&&this.status==200&&!!this.responseText&&t._handleStream(this)},this._http.send(null),this._setHTTPTimeout()}catch(n){u.log("XMLHttpRequest not available; defaulting to WebSockets")}},v.prototype._handleStream=function(e){var t=e.responseText.split("\n");if(!!e._buffer)while(e._buffer.length>0){var n=e._buffer.shift(),r=t[n];try{r=JSON.parse(r)}catch(i){e._buffer.shift(n);break}this.emit("message",r)}var s=t[e._index];if(!!s){e._index+=1;if(e._index===t.length)e._buffer||(e._buffer=[]),e._buffer.push(e._index-1);else{try{s=JSON.parse(s)}catch(i){u.log("Invalid server message",s);return}this.emit("message",s)}}},v.prototype._setHTTPTimeout=function(){var e=this;this._timeout=setTimeout(function(){var t=e._http;e._wsOpen()?t.abort():(e._startXhrStream(t._streamIndex+1),e._http.old=t)},25e3)},v.prototype._wsOpen=function(){return!!this._socket&&this._socket.readyState==1},v.prototype.send=function(e){if(this.disconnected)return;if(!e.type){this.emit("error","Invalid message");return}var t=JSON.stringify(e);if(this._wsOpen())this._socket.send(t);else{var n=new XMLHttpRequest,r=this._httpUrl+"/"+e.type.toLowerCase();n.open("post",r,!0),n.setRequestHeader("Content-Type","application/json"),n.send(t)}},v.prototype.close=function(){!this.disconnected&&this._wsOpen()&&(this._socket.close(),this.disconnected=!0)}})(this)
