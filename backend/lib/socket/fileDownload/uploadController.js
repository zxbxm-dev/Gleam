// const { Message } = require('../../models/messenger/message');
const db = require('../../models');
const { Message } = db;

exports.sendMessage = async (req, res) => {
  console.log('Message:', Message);

  try {
    const { content, userId, roomId, receiverId } = req.body;
    let filePath = null;

    if (req.file) {
      filePath = req.file.path;
    }

    const message = await Message.create({
      content,
      userId,
      roomId,
      filePath,
      receiverId
    });

    // FileValue 설정
    const FileValue = filePath ? 1 : 0;

    // 응답에 FileValue 추가
    res.status(200).json({ message, FileValue });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: '파일 업로드를 실패 하였습니다.', details: error.message });
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