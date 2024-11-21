import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/users.js';
const app = express();

const PORT = 3000;

app.use(bodyParser.json());
app.use('/users', userRouter);

app.get('/', (req,res) => {
    console.log('Starting Homepage');
    res.json({name: 'John', LastName: 'Doe'});
})

app.listen(PORT, () => console.log(`App is listening on port ${PORT}...`));

