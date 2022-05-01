const button = document.getElementById("download");

if (button) {
    button.onclick = async () => {
        const newHandle = await window.showSaveFilePicker({suggestedName: "video.mp4"});
        const writableStream = await newHandle.createWritable();

        fetch('./video.mp4')
        .then(async (response) => {
            return await response.body.pipeTo(writableStream);
        }).then(() => {
            writableStream.close();
        });
    }   
}

