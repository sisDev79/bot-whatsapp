import dontenv from 'dotenv';

dontenv.config();

export default {
    WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY,
    API_TOKEN: process.env.API_TOKEN,
    BUSINESS_PHONE: process.env.BUSINESS_PHONE,
    API_VERSION: process.env.API_TOKEN,
    PORT: process.env.PORT || 3000,
};