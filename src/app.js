import express from 'express';
import config from './config/env.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
app.use(express.json());

app.use('/webhook', webhookRoutes);

app.get('/', (req, res) => {
    res.send(`<pre>Hello.
    Checkout README.md to start.</pre>`);
});

app.listen(config.PORT, () => {
    console.log(`Server is listening on port:  ${config.PORT}`);
});