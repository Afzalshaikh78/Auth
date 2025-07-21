const Image = require("../models/image");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");
const fs = require("fs");              

const uploadImageController = async (req, res) => {  
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

    //delete the file from the temp folder
    fs.unlinkSync(req.file.path);

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


//get the images
const fetchImagesController = async (req, res) => {
  try {
    const images = await Image.find({})
    if (images) {
      res.status(200).json({
        success: true,
        message: "images fetched successfully",
        data: images,
      });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
}


module.exports = {
  uploadImageController,
  fetchImagesController,
};