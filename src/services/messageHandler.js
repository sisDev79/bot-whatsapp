import whatsappService from './whatsappService.js';
class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    const fromNumber = message.from.slice(0, 2) + message.from.slice(3);
    
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if (this.isGretting(incomingMessage)) {
        await this.sendWelcomeMessage(fromNumber, message.id, senderInfo);
        await this.sendWelcomeMenu(fromNumber);
      }else{
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(fromNumber, response, message.id);
      }

      await whatsappService.markAsRead(message.id);
    } else if(message?.type === 'interactive'){
      const option = message?.interactive?.button_reply?.title.toLowerCase().trim();
      await this.handleMenuOption(fromNumber, option);
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
    const firstName = name.split(' ')[0];
    const welcomeMessage = `Hola, ${firstName} Bienvenido al chat, ¿En qué puedo apoyarte?`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }

  async sendWelcomeMenu(to) {
    const menuMessage = "Elige una Opción"
    const buttons = [
      {
        type: 'reply', reply:{ id: 'option_1', title: 'Agendar' }
      },
      {
        type: 'reply', reply:{ id: 'option_2', title: 'Consultar' }
      },
      {
        type: 'reply', reply:{ id: 'option_3', title: 'Ubicacion' }
      }
    ];

    await whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
  }
  async handleMenuOption(to, option) {
    let response;
    switch (option.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
      case 'agendar':
        response = "Te hemos enviado un mensaje con los detalles de tu cita.";
        break;
      case 'consultar':
        response = "Te hemos enviado un mensaje con tus consultas.";
        break;
      case 'ubicacion':
        response = "Te hemos enviado un mensaje con la ubicación de tu negocio.";
        break;
      default:
        response = "Opción no válida, intenta nuevamente.";
        break;
    }
    await whatsappService.sendMessage(to, response);
  }
}
export default new MessageHandler();