function blobToBase64(blob: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            resolve(e.target.result);
        };
        reader.onerror = () => {
            reject();
        };
        reader.readAsDataURL(blob);
    });
}
function base64ToBlob(code: string) {
    if (!code) return ''
    const codeStr = String(code);
    const parts = codeStr.split(";base64,");
    const contentType = parts[0].split(":")[1];
    let raw = '';
    if (parts[1])
        raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
        "type": contentType
    });
};

export { blobToBase64, base64ToBlob }
