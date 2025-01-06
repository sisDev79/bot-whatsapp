import { response } from 'express';
import whatsappService from './whatsappService.js';
class MessageHandler {

  constructor(){
    this.appointmentState = {};
  }
  async handleIncomingMessage(message, senderInfo) {
    const fromNumber = message.from.slice(0, 2) + message.from.slice(3);
    
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if (this.isGretting(incomingMessage)) {
        await this.sendWelcomeMessage(fromNumber, message.id, senderInfo);
        await this.sendWelcomeMenu(fromNumber);
      }else if(incomingMessage === 'media'){
        await this.sendMedia(fromNumber);
      }else {
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
        this.appointmentState[to] = {step: 'name'}
        response = "Por favor ingresa tu nombre";
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

  async sendMedia(to){
    // const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-audio.aac';
    // const caption = 'Bienvenida';
    // const type = 'audio';

    // const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-imagen.png';
    // const caption = '¡Esto es una Imagen!';
    // const type = 'image';

    const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-video.mp4';
    const caption = '¡esto es una video!';
    const type = 'video';

    // const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf';
    // const caption = '¡Esto es un PDF!';
    // const type = 'document';

    await whatsappService.sendMediaMessage(to, type, mediaUrl, caption);
  }

  async handaleAppointmentFlow(to, message){
    const state = this.appointmentState[to];
    let response;

    switch (state.step) {
      case 'name':
        state.name = message;
        state.step = 'petName';
        response = "Gracias, Ahora, ¿Cuál es el nombre de tu Mascota?"
        break;
      case 'petName':
        state.petName = message;
        state.step = 'petType';
        response = '¿Qué tipo de mascota es? (por ejemplo: perro, gato, huron, etc.)'
        break;
      case 'petType':
        state.petType = message;
        state.step = 'reason';
        response = '¿Cuál es el motivo de la Consulta?';
        break;
      case 'reason':
        state.reason = message;
        response = this.completeAppointment(to);
        break;
    };
    await whatsappService.sendMessage(to, response);
  }
}
export default new MessageHandler();