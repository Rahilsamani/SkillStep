const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };

  if (height) options.height = height;
  if (quality) options.quality = quality;
  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

exports.uploadPdfToCloudinary = async (pdfBuffer, folder, fileName) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: "raw", // non images
    };

    if (fileName) {
      options.public_id = fileName;
    }

    // Cloudinary's upload_stream for buffer uploads
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      })
      .end(pdfBuffer);
  });
};
