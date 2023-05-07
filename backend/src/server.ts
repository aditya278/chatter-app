import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT: Number = +(process.env.PORT || 5050);

app.listen(PORT, () => console.log(`⚡️[server]: Server is running at port ${PORT}`));