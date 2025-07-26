const Image = require("../models/image");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImageController = async (req, res) => {
  try {
    //check if the file is missing in req object

    if (!req.file) {
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
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//get the images
const fetchImagesController = async (req, res) => {
  try {
    //pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        message: "images fetched successfully",
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
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
};

//delete the image

const deleteImageController = async (req, res) => {
  try {
    const getCurretImageId = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurretImageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "image not found",
      });
    }

    //check if the image is uploaded by the current user
    if (image.uploadedBy.toString() !== userId) {
      return res.status(401).json({
        success: false,
        message: "you are not authorized to delete this image",
      });
    }
    //delete from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    //delete from database

    await Image.findByIdAndDelete(getCurretImageId);

    res.status(200).json({
      success: true,
      message: "image deleted successfully",
      image,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
};
