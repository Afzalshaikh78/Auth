const Image = require("../models/image");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");

const uploadImage = async (req, res) => { 
  try {
    //check if the file is missing in req object

    if(!req.file) {
      return res.status(400).json({
        success: false,
        message: "file is missing",
      });
    }

    //upload

    const { url, publicId } = await uploadToCloudinary(req.file.path);
    
    //save to database

    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    res.status(201).json({
      success: true,
      message: "image uploaded successfully",
      image: newlyUploadedImage,
    });
    
  }
  catch(e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
}

module.exports = {
  uploadImage,
};