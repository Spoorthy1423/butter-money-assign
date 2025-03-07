const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.use(authMiddleware.protect);

router.post('/upload', upload.single('document'), documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocument);
router.get('/:id/data', documentController.getDocumentData);
router.delete('/:id', documentController.deleteDocument);
router.post('/:id/process', documentController.processDocument);

module.exports = router;