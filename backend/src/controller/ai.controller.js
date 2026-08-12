import axios from 'axios';

export const generateDocument = async (req, res) => {
  try {
    const payload = req.body;
    const apiKey = process.env.LAWBLOCK_SECRET_API_KEY;
    const lawblockApiBase = process.env.LAWBLOCK_API_BASE_URL || "http://localhost:3001";
    
    const response = await axios({
      method: 'post',
      url: `${lawblockApiBase}/api/v1/ai/generate-document`,
      data: payload,
      responseType: 'stream',
      headers: {
        'Content-Type': 'application/json',
        "x-api-key": apiKey,
      }
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'application/json');
    
    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying AI generation request:', error.message);
    if (error.response) {
      res.status(error.response.status).json({ message: 'Error from generation API' });
    } else {
      res.status(500).json({ message: 'Internal server error proxying request' });
    }
  }
};
