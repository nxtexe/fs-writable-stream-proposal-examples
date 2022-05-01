Hey 👋🏾,
so recently I see the new writable stream interface that the API exposes and immediately thought about streaming responses to files kind of like how it's done in Node e.g.
```
const http = require('http');
const fs = require('fs');
const path = require('path');

const file = fs.createWriteStream('download.jpg');
http.get('http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg', function (response) {
    response.pipe(file);

    file.on("finish", () => file.close());
});
```

In the web to get a similar effect you'd have to do:
```
const newHandle = await window.showSaveFilePicker({suggestedName: "video.mp4"});
const writableStream = await newHandle.createWritable();

fetch('./video.mp4')
.then(async (response) => {
    const reader = response.body.getReader();
    let isDone = false;
    let position = 0;
    
    progressContainer.style.display = 'unset';
    return new Promise((resolve) => {
        async function download(deadline) {
            while(!isDone && deadline.timeRemaining() > 0) {
                const {done, value} = await reader.read();
                isDone = done;
                

                if (isDone) {
                    return resolve(true);
                }
                writableStream.write({type: "write", position, data: value});
                position += value.length;
            }

            requestIdleCallback(download);
        }

        requestIdleCallback(download);
    });

}).then(() => {
    writableStream.close();
});
```

Here we use `requestIdleCallback` to make sure we yield to the browser and not block the main thread. You can probably see where I'm going with this, since this could be simplified by doing something like:
```
// ...
const newHandle = await window.showSaveFilePicker({suggestedName: "video.mp4"});
const writableStream = await newHandle.createWritable();

fetch('./video.mp4')
.then(async (response) => {
    return await response.body.pipeTo(writableStream);
}).then(() => {
    writableStream.close();
});
```

OR something a bit easier or more relevant to the scope of this API:

```
const newHandle = await window.showSaveFilePicker({suggestedName: "video.mp4"});
const writableStream = await newHandle.createWritable();

fetch('./video.mp4')
.then(async (response) => {
    return writableStream.write(response.body);
}).then(() => {
    writableStream.close();
});
```