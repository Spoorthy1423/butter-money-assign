const fs = require('fs');
const path = require('path');
const Document = require('../models/document.model');
const pdfService = require('../services/pdf.service');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const { originalname, filename, path: filePath, size } = req.file;
    const fileExtension = originalname.split('.').pop().toLowerCase();
    
    if (!['pdf', 'docx'].includes(fileExtension)) {
      fs.unlinkSync(filePath);
      
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF and DOCX files are allowed.'
      });
    }
    
    const document = new Document({
      name: req.body.name || originalname,
      originalFilename: originalname,
      fileType: fileExtension,
      filePath,
      fileSize: size,
      uploadedBy: req.user.id
    });
    
    await document.save();
    
    if (fileExtension === 'pdf') {
      pdfService.processPDF(document._id)
        .catch(error => console.error('Background PDF processing error:', error));
    }
    
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        name: document.name,
        originalFilename: document.originalFilename,
        fileType: document.fileType,
        fileSize: document.fileSize,
        extractionStatus: document.extractionStatus,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user.id })
      .select('-filePath -extractedData')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving documents',
      error: error.message
    });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving document',
      error: error.message
    });
  }
};

exports.getDocumentData = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    }).select('extractedData extractionStatus');
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    if (document.extractionStatus === 'pending' || document.extractionStatus === 'processing') {
      return res.status(202).json({
        success: true,
        message: 'Document processing is still in progress',
        status: document.extractionStatus
      });
    }
    
    if (document.extractionStatus === 'failed') {
      return res.status(400).json({
        success: false,
        message: 'Document processing failed',
        error: document.extractedData?.error || 'Unknown error'
      });
    }
    
    res.status(200).json({
      success: true,
      data: document.extractedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving document data',
      error: error.message
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    
    await document.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

exports.processDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    if (document.fileType !== 'pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF documents can be processed'
      });
    }
    
    pdfService.processPDF(document._id)
      .catch(error => console.error('Background PDF processing error:', error));
    
    res.status(202).json({
      success: true,
      message: 'Document processing started',
      documentId: document._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing document',
      error: error.message
    });
  }
};