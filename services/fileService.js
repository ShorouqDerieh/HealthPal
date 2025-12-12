const model = require('../repositories/fileRepository')
exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/upload/${req.file.filename}`;
    const mime = req.file.mimetype;
    const userId = req.user.id || null;

    const fileRecord = await model.saveFile(userId, fileUrl, mime);

    return res.status(201).json({
      message: 'File uploaded successfully',
      file_id: fileRecord.id,
      file_url: fileUrl
    });
  }
  catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
}
