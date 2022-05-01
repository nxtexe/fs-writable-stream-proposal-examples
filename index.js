const button = document.getElementById("download");
const progressContainer = document.getElementById('progress-container');
const progress = document.querySelector('progress');

if (button && progressContainer && progress) {
    button.onclick = async () => {
        const newHandle = await window.showSaveFilePicker({suggestedName: "video.mp4"});
        const writableStream = await newHandle.createWritable();

        fetch('./video.mp4')
        .then(async (response) => {
            const reader = response.body.getReader();
            let isDone = false;
            let position = 0;
            const contentLength = 2053732; // returned from server as header
            
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

                        requestAnimationFrame(() => {
                            progress.value = `${position / contentLength}`;
                        });
                    }
    
                    requestIdleCallback(download);
                }
    
                requestIdleCallback(download);
            });

        }).then(() => {
            writableStream.close();
        });
    }   
}

