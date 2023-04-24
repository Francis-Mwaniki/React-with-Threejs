import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
const port = process.env.PORT || 3000;
import dalleRouter from './routes/dalle.routes.js';
const app = express();

dotenv.config();
app.use(cors());
app.use('/api/v1/dalle', dalleRouter);
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from DALL.E!' });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);