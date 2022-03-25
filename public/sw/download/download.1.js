let mainEvt;

((name, definition) => {
    typeof module !== 'undefined'
        ? (module.exports = definition())
        : typeof define === 'function' && typeof define.amd === 'object'
            ? define(definition)
            : (this[name] = definition());
})('streamSaver', () => {
    'use strict';

    const global = typeof window === 'object' ? window : this;
    if (!global.HTMLElement)
        console.warn('streamsaver is meant to run on browsers main thread');

    let mitmTransporter = null;
    let supportsTransferable = false;
    const test = (fn) => {
        try {
            fn();
        } catch (e) { }
    };
    const ponyfill = global.WebStreamsPolyfill || {};
    const isSecureContext = global.isSecureContext;
    // TODO: Must come up with a real detection test (#69)
    let useBlobFallback =
        /constructor/i.test(global.HTMLElement) ||
        !!global.safari ||
        !!global.WebKitPoint;
    const downloadStrategy =
        isSecureContext || 'MozAppearance' in document.documentElement.style
            ? 'iframe'
            : 'navigate';

    const streamSaver = {
        createWriteStream,
        WritableStream: global.WritableStream || ponyfill.WritableStream,
        supported: true,
        version: { full: '2.0.5', major: 2, minor: 0, dot: 5 },
        mitm:
            'https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=2.0.0',
    };

    /**
     * create a hidden iframe and append it to the DOM (body)
     *
     * @param  {string} src page to load
     * @return {HTMLIFrameElement} page to load
     */
    function makeIframe(src) {
        if (!src) throw new Error('meh');
        const iframe = document.createElement('iframe');
        iframe.hidden = true;
        iframe.src = src;
        iframe.loaded = false;
        iframe.name = 'iframe';
        iframe.isIframe = true;
        iframe.postMessage = (...args) =>
            iframe.contentWindow.postMessage(...args);
        iframe.addEventListener(
            'load',
            () => {
                iframe.loaded = true;
            },
            { once: true }
        );
        document.body.appendChild(iframe);
        return iframe;
    }

    /**
     * create a popup that simulates the basic things
     * of what a iframe can do
     *
     * @param  {string} src page to load
     * @return {object}     iframe like object
     */
    function makePopup(src) {
        const options = 'width=200,height=100';
        const delegate = document.createDocumentFragment();
        const popup = {
            frame: global.open(src, 'popup', options),
            loaded: false,
            isIframe: false,
            isPopup: true,
            remove() {
                popup.frame.close();
            },
            addEventListener(...args) {
                delegate.addEventListener(...args);
            },
            dispatchEvent(...args) {
                delegate.dispatchEvent(...args);
            },
            removeEventListener(...args) {
                delegate.removeEventListener(...args);
            },
            postMessage(...args) {
                popup.frame.postMessage(...args);
            },
        };

        const onReady = (evt) => {
            if (evt.source === popup.frame) {
                popup.loaded = true;
                global.removeEventListener('message', onReady);
                popup.dispatchEvent(new Event('load'));
            }
        };

        global.addEventListener('message', onReady);

        return popup;
    }

    try {
        // We can't look for service worker since it may still work on http
        new Response(new ReadableStream());
        if (isSecureContext && !('serviceWorker' in navigator)) {
            useBlobFallback = true;
        }
    } catch (err) {
        useBlobFallback = true;
    }

    test(() => {
        // Transferable stream was first enabled in chrome v73 behind a flag
        const { readable } = new TransformStream();
        const mc = new MessageChannel();
        mc.port1.postMessage(readable, [readable]);
        mc.port1.close();
        mc.port2.close();
        supportsTransferable = true;
        // Freeze TransformStream object (can only work with native)
        Object.defineProperty(streamSaver, 'TransformStream', {
            configurable: false,
            writable: false,
            value: TransformStream,
        });
    });

    function loadTransporter() {
        if (!mitmTransporter) {
            mitmTransporter = isSecureContext
                ? makeIframe(streamSaver.mitm)
                : makePopup(streamSaver.mitm);
        }
    }

    /**
     * @param  {string} filename filename that should be used
     * @param  {object} options  [description]
     * @param  {number} size     deprecated
     * @return {WritableStream<Uint8Array>}
     */
    function createWriteStream(filename, options, size) {
        let opts = {
            size: null,
            pathname: null,
            writableStrategy: undefined,
            readableStrategy: undefined,
        };

        let bytesWritten = 0; // by StreamSaver.js (not the service worker)
        let downloadUrl = null;
        let channel = null;
        let ts = null;

        // normalize arguments
        if (Number.isFinite(options)) {
            [size, options] = [options, size];
            console.warn(
                '[StreamSaver] Deprecated pass an object as 2nd argument when creating a write stream'
            );
            opts.size = size;
            opts.writableStrategy = options;
        } else if (options && options.highWaterMark) {
            console.warn(
                '[StreamSaver] Deprecated pass an object as 2nd argument when creating a write stream'
            );
            opts.size = size;
            opts.writableStrategy = options;
        } else {
            opts = options || {};
        }
        if (!useBlobFallback) {
            loadTransporter();

            channel = new MessageChannel();

            // Make filename RFC5987 compatible
            filename = encodeURIComponent(filename.replace(/\//g, ':'))
                .replace(/['()]/g, escape)
                .replace(/\*/g, '%2A');

            const response = {
                transferringReadable: supportsTransferable,
                pathname:
                    opts.pathname ||
                    Math.random().toString().slice(-6) + '/' + filename,
                headers: {
                    'Content-Type': 'application/octet-stream; charset=utf-8',
                    'Content-Disposition':
                        "attachment; filename*=UTF-8''" + filename,
                },
            };

            if (opts.size) {
                response.headers['Content-Length'] = opts.size;
            }

            const args = [response, '*', [channel.port2]];

            if (supportsTransferable) {
                const transformer =
                    downloadStrategy === 'iframe'
                        ? undefined
                        : {
                            // This transformer & flush method is only used by insecure context.
                            transform(chunk, controller) {
                                if (!(chunk instanceof Uint8Array)) {
                                    throw new TypeError(
                                        'Can only write Uint8Arrays'
                                    );
                                }
                                bytesWritten += chunk.length;
                                controller.enqueue(chunk);

                                if (downloadUrl) {
                                    location.href = downloadUrl;
                                    downloadUrl = null;
                                }
                            },
                            flush() {
                                if (downloadUrl) {
                                    location.href = downloadUrl;
                                }
                            },
                        };
                ts = new streamSaver.TransformStream(
                    transformer,
                    opts.writableStrategy,
                    opts.readableStrategy
                );
                const readableStream = ts.readable;

                channel.port1.postMessage({ readableStream }, [readableStream]);
            }

            channel.port1.onmessage = (evt) => {
                // Service worker sent us a link that we should open.
                if (evt.data.download) {
                    // Special treatment for popup...
                    if (downloadStrategy === 'navigate') {
                        mitmTransporter.remove();
                        mitmTransporter = null;
                        if (bytesWritten) {
                            location.href = evt.data.download;
                        } else {
                            downloadUrl = evt.data.download;
                        }
                    } else {
                        if (mitmTransporter.isPopup) {
                            mitmTransporter.remove();
                            mitmTransporter = null;
                            // Special case for firefox, they can keep sw alive with fetch
                            if (downloadStrategy === 'iframe') {
                                makeIframe(streamSaver.mitm);
                            }
                        }

                        // We never remove this iframes b/c it can interrupt saving
                        makeIframe(evt.data.download);
                    }
                }
            };

            if (mitmTransporter.loaded) {
                mitmTransporter.postMessage(...args);
            } else {
                mitmTransporter.addEventListener(
                    'load',
                    () => {
                        mitmTransporter.postMessage(...args);
                    },
                    { once: true }
                );
            }
        }

        let chunks = [];

        return (
            (!useBlobFallback && ts && ts.writable) ||
            new streamSaver.WritableStream(
                {
                    write(chunk) {
                        if (!(chunk instanceof Uint8Array)) {
                            throw new TypeError('Can only write Uint8Arrays');
                        }
                        if (useBlobFallback) {
                            // Safari... The new IE6
                            // https://github.com/jimmywarting/StreamSaver.js/issues/69
                            //
                            // even though it has everything it fails to download anything
                            // that comes from the service worker..!
                            chunks.push(chunk);
                            return;
                        }

                        // is called when a new chunk of data is ready to be written
                        // to the underlying sink. It can return a promise to signal
                        // success or failure of the write operation. The stream
                        // implementation guarantees that this method will be called
                        // only after previous writes have succeeded, and never after
                        // close or abort is called.

                        // TODO: Kind of important that service worker respond back when
                        // it has been written. Otherwise we can't handle backpressure
                        // EDIT: Transferable streams solves this...
                        channel.port1.postMessage(chunk);
                        bytesWritten += chunk.length;

                        if (downloadUrl) {
                            location.href = downloadUrl;
                            downloadUrl = null;
                        }
                    },
                    close() {
                        if (useBlobFallback) {
                            const blob = new Blob(chunks, {
                                type: 'application/octet-stream; charset=utf-8',
                            });
                            mainEvt.ports[0].postMessage({
                                type: 'done',
                                data: blob,
                            });
                        } else {
                            channel.port1.postMessage('end');
                        }
                    },
                    abort() {
                        chunks = [];
                        channel.port1.postMessage('abort');
                        channel.port1.onmessage = null;
                        channel.port1.close();
                        channel.port2.close();
                        channel = null;
                    },
                },
                opts.writableStrategy
            )
        );
    }

    return streamSaver;
});

class Crc32 {
    constructor() {
        this.crc = -1;
    }

    append(data) {
        var crc = this.crc | 0;
        var table = this.table;
        for (var offset = 0, len = data.length | 0; offset < len; offset++) {
            crc = (crc >>> 8) ^ table[(crc ^ data[offset]) & 0xff];
        }
        this.crc = crc;
    }

    get() {
        return ~this.crc;
    }
}
Crc32.prototype.table = (() => {
    var i;
    var j;
    var t;
    var table = [];
    for (i = 0; i < 256; i++) {
        t = i;
        for (j = 0; j < 8; j++) {
            t = t & 1 ? (t >>> 1) ^ 0xedb88320 : t >>> 1;
        }
        table[i] = t;
    }
    return table;
})();

const getDataHelper = (byteLength) => {
    var uint8 = new Uint8Array(byteLength);
    return {
        array: uint8,
        view: new DataView(uint8.buffer),
    };
};

const pump = (zipObj) =>
    zipObj.reader.read().then((chunk) => {
        if (chunk.done) return zipObj.writeFooter();
        const outputData = chunk.value;
        zipObj.crc.append(outputData);
        zipObj.uncompressedLength += outputData.length;
        zipObj.compressedLength += outputData.length;
        zipObj.ctrl.enqueue(outputData);
    });

/**
 * [createWriter description]
 * @param  {Object} underlyingSource [description]
 * @return {Boolean}                  [description]
 */
function createWriter(underlyingSource) {
    const files = Object.create(null);
    const filenames = [];
    const encoder = new TextEncoder();
    let offset = 0;
    let activeZipIndex = 0;
    let ctrl;
    let activeZipObject, closed;

    function next() {
        activeZipIndex++;
        activeZipObject = files[filenames[activeZipIndex]];
        if (activeZipObject) processNextChunk();
        else if (closed) closeZip();
    }

    var zipWriter = {
        enqueue(fileLike) {
            if (closed)
                throw new TypeError(
                    'Cannot enqueue a chunk into a readable stream that is closed or has been requested to be closed'
                );

            let name = fileLike.name.trim();
            const date = new Date(
                typeof fileLike.lastModified === 'undefined'
                    ? Date.now()
                    : fileLike.lastModified
            );

            if (fileLike.directory && !name.endsWith('/')) name += '/';
            if (files[name]) throw new Error('File already exists.');

            const nameBuf = encoder.encode(name);
            filenames.push(name);

            const zipObject = (files[name] = {
                level: 0,
                ctrl,
                directory: !!fileLike.directory,
                nameBuf,
                comment: encoder.encode(fileLike.comment || ''),
                compressedLength: 0,
                uncompressedLength: 0,
                writeHeader() {
                    var header = getDataHelper(26);
                    var data = getDataHelper(30 + nameBuf.length);

                    zipObject.offset = offset;
                    zipObject.header = header;
                    if (zipObject.level !== 0 && !zipObject.directory) {
                        header.view.setUint16(4, 0x0800);
                    }
                    header.view.setUint32(0, 0x14000808);
                    header.view.setUint16(
                        6,
                        (((date.getHours() << 6) | date.getMinutes()) << 5) |
                        (date.getSeconds() / 2),
                        true
                    );
                    header.view.setUint16(
                        8,
                        ((((date.getFullYear() - 1980) << 4) |
                            (date.getMonth() + 1)) <<
                            5) |
                        date.getDate(),
                        true
                    );
                    header.view.setUint16(22, nameBuf.length, true);
                    data.view.setUint32(0, 0x504b0304);
                    data.array.set(header.array, 4);
                    data.array.set(nameBuf, 30);
                    offset += data.array.length;
                    ctrl.enqueue(data.array);
                },
                writeFooter() {
                    var footer = getDataHelper(16);
                    footer.view.setUint32(0, 0x504b0708);

                    if (zipObject.crc) {
                        zipObject.header.view.setUint32(
                            10,
                            zipObject.crc.get(),
                            true
                        );
                        zipObject.header.view.setUint32(
                            14,
                            zipObject.compressedLength,
                            true
                        );
                        zipObject.header.view.setUint32(
                            18,
                            zipObject.uncompressedLength,
                            true
                        );
                        footer.view.setUint32(4, zipObject.crc.get(), true);
                        footer.view.setUint32(
                            8,
                            zipObject.compressedLength,
                            true
                        );
                        footer.view.setUint32(
                            12,
                            zipObject.uncompressedLength,
                            true
                        );
                    }

                    ctrl.enqueue(footer.array);
                    offset += zipObject.compressedLength + 16;
                    next();
                },
                fileLike,
            });

            if (!activeZipObject) {
                activeZipObject = zipObject;
                processNextChunk();
            }
        },
        close() {
            if (closed)
                throw new TypeError(
                    'Cannot close a readable stream that has already been requested to be closed'
                );
            if (!activeZipObject) closeZip();
            closed = true;
        },
    };

    function closeZip() {
        var length = 0;
        var index = 0;
        var indexFilename, file;
        for (
            indexFilename = 0;
            indexFilename < filenames.length;
            indexFilename++
        ) {
            file = files[filenames[indexFilename]];
            length += 46 + file.nameBuf.length + file.comment.length;
        }
        const data = getDataHelper(length + 22);
        for (
            indexFilename = 0;
            indexFilename < filenames.length;
            indexFilename++
        ) {
            file = files[filenames[indexFilename]];
            data.view.setUint32(index, 0x504b0102);
            data.view.setUint16(index + 4, 0x1400);
            data.array.set(file.header.array, index + 6);
            data.view.setUint16(index + 32, file.comment.length, true);
            if (file.directory) {
                data.view.setUint8(index + 38, 0x10);
            }
            data.view.setUint32(index + 42, file.offset, true);
            data.array.set(file.nameBuf, index + 46);
            data.array.set(file.comment, index + 46 + file.nameBuf.length);
            index += 46 + file.nameBuf.length + file.comment.length;
        }
        data.view.setUint32(index, 0x504b0506);
        data.view.setUint16(index + 8, filenames.length, true);
        data.view.setUint16(index + 10, filenames.length, true);
        data.view.setUint32(index + 12, length, true);
        data.view.setUint32(index + 16, offset, true);
        ctrl.enqueue(data.array);
        ctrl.close();
    }

    function processNextChunk() {
        if (!activeZipObject) return;
        if (activeZipObject.directory)
            return activeZipObject.writeFooter(activeZipObject.writeHeader());
        if (activeZipObject.reader) return pump(activeZipObject);
        if (activeZipObject.fileLike.stream) {
            activeZipObject.crc = new Crc32();
            activeZipObject.reader = activeZipObject.fileLike
                .stream()
                .getReader();
            activeZipObject.writeHeader();
        } else next();
    }
    return new ReadableStream({
        start: (c) => {
            ctrl = c;
            underlyingSource.start &&
                Promise.resolve(underlyingSource.start(zipWriter));
        },
        pull() {
            return (
                processNextChunk() ||
                (underlyingSource.pull &&
                    Promise.resolve(underlyingSource.pull(zipWriter)))
            );
        },
    });
}

const ZIP = createWriter;

self.importScripts('sw/download/data.1.js');

function normalize(metadata) {
    let result = {};
    Object.keys(metadata).forEach((key) => {
        if (metadata[key] && key !== 'authors' && key !== 'preloadedHashed') {
            const data = metadata[key];
            if (key === 'preloadedDependencies') {
                data.forEach((item) => {
                    item.majorVersion = +item.majorVersion;
                    item.minorVersion = +item.minorVersion;
                });
            }
            result = {
                ...result,
                [key]: data,
            };
        }
    });
    return result;
}

function getArray(input, key) {
    if (key in input) {
        return input[key];
    }
    return [];
}

function isAllowWhiteList(mime) {
    for (item of H5P_CONTENT_WHITELIST) {
        if (mime.includes(item)) {
            return true;
        }
    }
    return false;
}

function extractContent(input, id) {
    if (Array.isArray(input)) {
        return input
            .map((item) => {
                return extractContent(item, id);
            })
            .reduce((a, b) => a.concat(b), []);
    }
    if (input && typeof input === 'object') {
        const keys = Object.keys(input);
        if (keys.length === 0) {
            return [];
        }
        if (keys.includes('mime') && keys.includes('path')) {
            if (isAllowWhiteList(input.mime)) {
                return [`content/${id}/${input.path}`];
            }
            return [];
        }
        return keys
            .map((item) => {
                return extractContent(input[item], id);
            })
            .reduce((a, b) => a.concat(b), []);
    }
    return [];
}

function handleDownload(evt) {
    mainEvt = evt;
    const data = evt.data.data;
    let fileStream = streamSaver.createWriteStream('archive.zip');
    const readableZipStream = new ZIP({
        start: (ctrl) => {
            ctrl.enqueue(
                new File([JSON.stringify(data.params)], 'content/content.json')
            );
            ctrl.enqueue(
                new File([JSON.stringify(normalize(data.metadata))], 'h5p.json')
            );
        },
        pull: async (ctrl) => {
            const set = new Set();
            let progress = 0;
            let downloaded = 0;
            let total = 0;
            const download = async (file) => {
                try {
                    const url = `https://cdn.ooolab.edu.vn/public/${evt.data.env}/v1/h5p/${file}`;
                    const res = await fetch(url);
                    const stream = () => res.body;
                    const name = file.startsWith('libraries/')
                        ? file.replace('libraries/', '')
                        : file.replace(`content/${evt.data.id}/`, 'content/');

                    ctrl.enqueue({
                        name,
                        stream,
                    });
                    downloaded++;
                    newProgress = Math.floor((downloaded * 100) / total);
                    if (newProgress != progress) {
                        progress = newProgress;
                        mainEvt.ports[0].postMessage({
                            type: 'progress',
                            progress: newProgress,
                        });
                    }
                } catch (e) {
                    set.add(file);
                }
            };
            const all = Array.from(
                new Set([
                    ...[
                        ...getArray(data.metadata, 'preloadedDependencies'),
                        ...getArray(data.metadata, 'editorDependencies'),
                        ...getArray(data.metadata, 'dynamicDependencies'),
                    ]
                        .map((item) => {
                            const key = `${item.machineName}-${item.majorVersion}.${item.minorVersion}`;
                            if (key in dependencies) {
                                return dependencies[key];
                            }
                            return [];
                        })
                        .reduce((a, b) => a.concat(b), [])
                        .map((item) => `libraries/${item}`),
                    ...extractContent(data.params, evt.data.id),
                ])
            );
            total = all.length;
            await Promise.all(all.map((item) => download(item)));
            let retry = 3;
            while (set.size > 0 && retry > 0) {
                retry--;
                const data = Array.from(set);
                set.clear();
                await Promise.all(data.map((item) => download(item)));
            }
            ctrl.close();
        },
    });
    const writer = fileStream.getWriter();
    const reader = readableZipStream.getReader();
    const pump = async () => {
        const res = await reader.read();
        res.done ? writer.close() : writer.write(res.value).then(pump);
    };
    pump();
}
