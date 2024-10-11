const { Message } = require('../../models/messenger/message');

exports.sendMessage = async (req, res) => {
  try {
    const { content, userId, roomId } = req.body;
    let filePath = null;

    if (req.file) {
      filePath = req.file.path;
    }

    const message = await Message.create({
      content,
      userId,
      roomId,
      filePath,
    });

    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '파일 업로드를 실패 하였습니다.' });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findOne({ where: { messageId } });

    if (!message || !message.filePath) {
      return res.status(404).json({ error: '메신저 업로드 파일을 찾을수 없습니다.' });
    }

    res.download(message.filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '파일 다운로드를 실패 하였습니다.' });
  }
};