import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv'
dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const chatStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chat_attachments', // Chat ki files is folder mein jayengi
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx','mp4', 'webm', 'mov'], // PDF aur Docs bhi allow kar diye
    resource_type: 'auto' // Ye zaroori hai taaki non-image files (PDF) bhi upload ho sakein
  },
});

export const upload = multer({ storage });
export const uploadChatAttachment = multer({ storage: chatStorage });