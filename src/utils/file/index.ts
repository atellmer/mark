import fileSaver from 'file-saver';

function base64toBlob(base64Data: string, contentType = '', sliceSize = 512): Blob {
	const byteCharacters = atob(base64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: contentType });

	return blob;
}

function saveJsonToFile(json: string, filename: string) {
	const blob = base64toBlob(btoa(json), 'application/json');

	fileSaver.saveAs(blob, `${filename}.json`);
}

export { saveJsonToFile };
