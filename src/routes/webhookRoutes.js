import express from 'express';
import webhookController from '../controllers/webhookController.js';

const router = express.Router();

router.post('/webkook', webhookController.handleIncoming);
router.get('/webhook', webhookController.verifyWebhook);

export default router;

