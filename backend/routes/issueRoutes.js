import express from 'express';
import {
  reportIssue,
  getVendorIssues,
  getAdminIssues,
  updateIssueStatus
} from '../controllers/issueController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.route('/')
  .post(protect, upload.single('image'), reportIssue);

router.route('/vendor')
  .get(protect, authorize('vendor'), getVendorIssues);

router.route('/admin')
  .get(protect, authorize('admin'), getAdminIssues);

router.route('/:id')
  .put(protect, authorize('vendor', 'admin'), updateIssueStatus);

export default router;
