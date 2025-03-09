import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//upload profile imge

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
   
    if (req.path.includes("/signup") || req.path.includes("/updateUserProfile")) {
      return {
        folder: "profile_pictures",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      };
    }

    //upload attachments
    const resourceType = file.mimetype.startsWith("video") ? "video" : "raw";

    return {
      folder: "uploads",
      resource_type: resourceType,
      eager:
        resourceType === "video"
          ? [{ width: 720, height: 480, crop: "limit" }]
          : undefined,
      eager_async: resourceType === "video" ? true : undefined,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});
export default upload;