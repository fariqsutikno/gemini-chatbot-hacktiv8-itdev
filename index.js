const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

// const upload = multer({ dest: 'uploads/' });

app.listen(port, () => {
    console.log(`Gemini Chatbot is running on http://localhost:${port}`);
});

app.post('/generate-text', async(req, res) => {
    const { prompt } = req.body;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        res.json({ output: response.text()});
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
});

app.post('/api/chat', async(req, res) => {
    const userMessage = req.body.message;

    if(!req.body || !userMessage) {
        return res.status(400).json({error: 'Message is required'});
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = result.response;
        const text = response.text();

        res.json({output: text});
    } catch (error) {
        console.error(error);
        res.status(500).json({reply: "Something went wrong. Please try again later."});
    }
})

// function imageToGenerativePart(imagePath) {
//     return {
//         inlineData: {
//             data: Buffer.from(fs.readFileSync(imagePath)).toString('base64'),
//             mimeType: 'image/jpeg',
//         },
//     };
// }

// app.post('/generate-from-image', upload.single('image'), async(req, res) => {
//     const filePath = req.file.path;
//     const prompt = req.body.prompt || 'Describe the image';
//     const image = imageToGenerativePart(filePath);

//     try {
//         const result = await model.generateContent([prompt, image]);
//         const response = await result.response;
//         res.json({ output: response.text() });
//     } catch (error) {
//         res.status(500).json({error: error.message});
//     } finally {
//         fs.unlinkSync(filePath);
//     }
// })

// app.post('/generate-from-document', upload.single('document'), async(req, res) => {
//     const filePath = req.file.path;
//     const buffer = fs.readFileSync(filePath);
//     const base64Data = buffer.toString('base64');
//     const mimeType = req.file.mimetype;

//     const prompt = req.body.prompt || 'Analyze the document';

//     try {
//         const documentPart = {
//             inlineData: { data: base64Data, mimeType }
//         };

//         const result = await model.generateContent([prompt, documentPart]);
//         const response = await result.response;
//         res.json({ output: response.text() });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     } finally {
//         fs.unlinkSync(filePath);
//     }
// }
// );

// app.post('/generate-from-audio', upload.single('audio'), async(req, res) => {
//     const filePath = req.file.path;
//     const buffer = fs.readFileSync(filePath);
//     const base64Data = buffer.toString('base64');
//     const mimeType = req.file.mimetype;

//     const prompt = req.body.prompt || 'Transcribe or analyze the audio';

//     try {
//         const audioPart = {
//             inlineData: { data: base64Data, mimeType }
//         }

//         const result = await model.generateContent([prompt, audioPart]);
//         const response = await result.response;
//         res.json({ output: response.text()});
//     } catch (error) {
//         res.status(500).json({ error: error.message});
//     } finally {
//         fs.unlinkSync(filePath);
//     }
// }
// );
