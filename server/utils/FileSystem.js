const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs').promises;

class FileSystem {
  constructor(options = {}) {
    this.uploadDir = options.uploadDir || 'uploads/';
    this.maxFileSize = options.maxFileSize || 5 * 1024 * 1024;
    this.allowedTypes = options.allowedTypes || [
      'image/jpeg',
      'image/png',
      'application/pdf',
    ];

    this.uploadMiddleware = fileUpload({
      limits: { fileSize: this.maxFileSize },
      abortOnLimit: true,
      createParentPath: true,
    });
  }

  init(app) {
    app.use(this.uploadMiddleware);
  }

  validateFileType(file) {
    return this.allowedTypes.includes(file.mimetype);
  }

  generateUniqueFileName(originalName) {
    const uniqueSuffix = Date.now();
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    return `${baseName}-${uniqueSuffix}-${ext}`;
  }

  async uploadSingle(file, customPath = '') {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      if (!this.validateFileType(file)) {
        throw new Error('Invalid file type');
      }

      const uploadPath = path.join(this.uploadDir, customPath);
      const uniqueFileName = this.generateUniqueFileName(file.name);
      const fullPath = path.join(uploadPath, uniqueFileName);

      await file.mv(fullPath);

      return {
        success: true,
        fileName: uniqueFileName,
        path: fullPath,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async uploadMultiple(files, customPath = '') {
    try {
      if (!files || (Array.isArray(files) && files.length === 0)) {
        throw new Error('No files provided');
      }

      const fileArray = Array.isArray(files) ? files : Object.values(files);
      const results = [];
      const uploadPath = path.join(this.uploadDir, customPath);

      for (const file of fileArray) {
        if (!this.validateFileType(file)) {
          results.push({
            success: false,
            fileName: file.name,
            message: 'Invalid file type',
          });
          continue;
        }

        const uniqueFileName = this.generateUniqueFileName(file.name);
        const fullPath = path.join(uploadPath, uniqueFileName);

        await file.mv(fullPath);

        results.push({
          success: true,
          fileName: uniqueFileName,
          path: fullPath,
          message: 'File uploaded successfully',
        });
      }

      return {
        success: true,
        files: results,
        message: 'Multiple files processed',
      };
    } catch (error) {
      throw new Error(`Multiple upload failed: ${error.message}`);
    }
  }
}

module.exports = FileSystem;