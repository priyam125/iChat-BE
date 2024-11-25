import { Router } from 'express';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import ProfileController from '../controller/ProfileController.js';
import multer from 'multer';

const router = Router()

// Set up multer middleware to handle file uploads
// 'dest' specifies the destination directory for uploaded files
// In this case, files will be uploaded to 'uploads/profiles/' directory
const upload = multer({ 
  dest: 'uploads/profile/' 
});

router.post('/profile/update-profile', verifyToken, ProfileController.updateProfile);

//and here we have passed the upload middleware which gives us the image in request as file
router.post('/profile/add-profile-image', verifyToken, upload.single('profile-image') , ProfileController.addProfileImage);


// module.exports = router;
export default router