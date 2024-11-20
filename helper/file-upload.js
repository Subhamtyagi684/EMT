const azureStorage = require('azure-storage');

const azureStorageConfig = {
    accountName: process.env.STORAGE_ACCOUNTNAME,
    accountKey:process.env.STORAGE_ACCOUNTKEY,
    blobURL: process.env.STORAGE_BLOBURL,
    containerName: process.env.STORAGE_CONTAINER
};

uploadFileToBlob = async (directoryPath, file, name) => {
 
    return new Promise((resolve, reject) => {
        const blobName = getBlobName(name);
        const matches = file.split(";");
        const type = matches[0].substr(5);
        const buffer = new Buffer(matches[1].substr(7), 'base64');
        const blobService = azureStorage.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey); 
        blobService.createBlockBlobFromText(azureStorageConfig.containerName, `${directoryPath}/${blobName}`, buffer, {contentType:type}, err => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve({ filename: blobName, 
                    originalname: name, 
                    path: `${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
                    url: `${azureStorageConfig.blobURL}/${azureStorageConfig.containerName}/${directoryPath}/${blobName}` });
            }
        });
 
    });
 
};

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${originalName}`;
};

const imageUpload = async(fileObj, next) => {
    try {
        let time = new Date().getTime();
        let name = `${fileObj.userID}_${time}.jpeg`;
        const image = await uploadFileToBlob('images', fileObj.file, name ); // images is a directory in the Azure container
        return image;
    } catch (error) {
        next(error);
    }
};

module.exports = {
    imageUpload
  };