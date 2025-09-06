// Import necessary modules
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    // Extract necessary information from the request body
    const { sectionId, title, description } = req.body;
    const video = req.files?.video;

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      console.error('Missing required fields:', { sectionId, title, description, hasVideo: !!video });
      return res.status(400).json({ 
        success: false, 
        message: "All Fields are Required",
        error: {
          sectionId: !sectionId,
          title: !title,
          description: !description,
          video: !video
        }
      });
    }

    try {
      // Upload the video file to Cloudinary
      console.log("Uploading video to Cloudinary:", {
        fileName: video.name,
        fileSize: video.size,
        fileType: video.mimetype,
        tempPath: video.tempFilePath
      });
      
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME || 'skillup'
      );
      
      if (!uploadDetails || !uploadDetails.secure_url) {
        throw new Error('Failed to upload video to Cloudinary');
      }
      
      console.log("Cloudinary upload successful:", {
        url: uploadDetails.secure_url,
        duration: uploadDetails.duration,
        format: uploadDetails.format
      });

      // Create a new sub-section with the necessary information
      const SubSectionDetails = await SubSection.create({
        title: title,
        timeDuration: uploadDetails.duration ? `${uploadDetails.duration}` : '0:00',
        description: description,
        videoUrl: uploadDetails.secure_url,
      });
      console.log('Created sub-section:', SubSectionDetails);

      // Update the corresponding section with the newly created sub-section
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        { $push: { subSection: SubSectionDetails._id } },
        { new: true }
      ).populate("subSection");
      
      if (!updatedSection) {
        console.error('Section not found:', sectionId);
        return res.status(404).json({ 
          success: false, 
          message: "Section not found" 
        });
      }

      console.log('Updated section with new sub-section:', updatedSection);
      return res.status(200).json({ 
        success: true, 
        data: updatedSection 
      });
    } catch (error) {
      console.error("Error in sub-section creation process:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Error creating sub-section",
        error: error.toString()
      });
    }
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error in createSubSection controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      console.log("Updating video in Cloudinary:", {
        fileName: video.name,
        fileSize: video.size,
        fileType: video.mimetype
      });
      
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      console.log("Video update result:", uploadDetails)
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    if (!subSectionId || !sectionId) {
      return res.status(400).json({ success: false, message: "Missing subsection or section ID" });
    }

    // Remove subsection from DB
    await SubSection.findByIdAndDelete(subSectionId);

    // Remove reference from parent section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    console.error("Error deleting subsection:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
