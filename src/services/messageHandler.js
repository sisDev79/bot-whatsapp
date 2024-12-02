import whatsappService from './whatsappService.js';
class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();
      const fromNumber = message.from.slice(0, 2) + message.from.slice(3);

      if (this.isGretting(incomingMessage)) {
        await this.sendWelcomeMessage(fromNumber, message.id, senderInfo);
      }else{
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(fromNumber, response, message.id);
      }

      await whatsappService.markAsRead(message.id);
    }
  }

  isGretting(message) {
    const greetings = ['hola', 'hello', 'saludos', 'hi', "buenos días", "buenas tardes"];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    console.log(senderInfo);
    return senderInfo.profile?.name || senderInfo.wa_id || "";
  }

  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo);
    const welcomeMessage = `Hola, ${name} Bienvenido al chat, ¿En qué puedo apoyarte?`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }
}
export default new MessageHandler();