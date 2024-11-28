import whatsappService from './whatsappService.js';

class MessageHandler {
    async handleIncomingMessage(message, senderInfo) {

        if (message?.type === 'text') {
            const incomingMessage = message.text.body.toLowerCase().trim();

            if (this.isGreeting(incomingMessage)){
                await this.sendWelcomeMessage(message.from, message.id, senderInfo);
            } else {
                const response = `Echo: ${message.text.body}`;
                await whatsappService.sendMessage(message.from, response, message.id);
            }
            await whatsappService.markAsRead(message.id);
        }
    }

    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'buenas tardes', 'hola', 'que onda bro :v'];
        return greetings.includes(message);
    }

    getSenderName(senderInfo) {
        return senderInfo.profile?.name || senderInfo?.id?.split('@')[0] || senderInfo.wa_id || "Bro";
    }

    async sendWelcomeMessage(to, messageId, senderInfo) {
        const name = this.getSenderName(senderInfo);
        const welcomeMessage = `Hola ${name}! Bienvenido a WhatsApp Bot. Soy ${this.constructor.name}. ¿Necesitas ayuda?`; //template literals  Alt 96
        await whatsappService.sendMessage(to, welcomeMessage, messageId);
    }
}
export default new MessageHandler();