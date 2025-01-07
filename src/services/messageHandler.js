//import { response } from 'express';
import whatsappService from './whatsappService.js';
import pool from '../config/db.js'
import openAiService from './openAiServices.js';

class MessageHandler {

  constructor(){
    this.appointmentState = {};
    this.assistandState = {};
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
      }else if(this.appointmentState[fromNumber]){
        await this.handaleAppointmentFlow(fromNumber, incomingMessage)
      }else if(this.assistandState[fromNumber]){
        await this.handleAssistandFlow(fromNumber, incomingMessage)
      }else {
        //const response = `Echo: ${message.text.body}`;
        //await whatsappService.sendMessage(fromNumber, response, message.id);
        await this.handleMenuOption(fromNumber, incomingMessage)
      }

      await whatsappService.markAsRead(message.id);
    } else if(message?.type === 'interactive'){
      const option = message?.interactive?.button_reply?.title.toLowerCase().trim();
      await this.handleMenuOption(fromNumber, option);
      await whatsappService.markAsRead(message.id);
    }
  }

  isGretting(message) {
    const greetings = ['hola', 'hello', 'saludos', 'hi', "buenos días", "buenas tardes", "hola, quiero más información", "test" ];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    console.log(senderInfo);
    return senderInfo.profile?.name || senderInfo.wa_id || "";
  }

  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo);
    const firstName = name.split(' ')[0];
    const welcomeMessage = `Hola, ${firstName} Bienvenido al chat de CRS Seguridad Privada, ¿En qué puedo apoyarte?`;
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
        this.assistandState[to] = {step: 'question'}
        response = "Realiza tu consulta";
        break;
      case 'ubicacion':
        response = "Te hemos enviado un mensaje con la ubicación de tu negocio.";
        break;
      case 'emergencia':
        response = "te invitamos a llamar a nuestra línea de atención";
        await this.sendContact(to);
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

  async completeAppointment(to) {
    const appointment = this.appointmentState[to];
    delete this.appointmentState[to];

    const userData = [
        to,
        appointment.name,
        appointment.petName,
        appointment.petType,
        appointment.reason,
        new Date().toISOString()
    ];

    // Insertar en la base de datos
    try {
        const sql = `
            INSERT INTO appointments 
            (whatsapp_number, owner_name, pet_name, pet_type, reason, created_at) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await pool.query(sql, userData);

        console.log('Datos insertados correctamente en la base de datos');
    } catch (error) {
        console.error('Error al insertar los datos:', error);
        throw new Error("Error al guardar la cita en la base de datos.");
    }

    return `Gracias por agendar tu cita.
    Resumen de tu cita:
    Nombre: ${appointment.name}
    Nombre de la mascota: ${appointment.petName}
    Tipo de mascota: ${appointment.petType}
    Motivo: ${appointment.reason}
    
    Nos pondremos en contacto contigo pronto para confirmar la fecha y hora de tu cita.`;
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
        response = await this.completeAppointment(to);
        //response = 'Gracias por agendar tu cita.';
        break;
      default:
        response = "Ha ocurrido un error, intenta nuevamente.";
        break;
    };
    //await whatsappService.sendMessage(to, response);
    if (response) {
      await whatsappService.sendMessage(to, response);
  } else {
      console.error("El mensaje de respuesta está vacío.");
  }
  }

  async handleAssistandFlow(to, message){
    const state = this.assistandState[to];
    let response;

    const menuMessage = "¿La respuesta fue de tu ayuda?"
    const buttons = [
      {type:'reply', reply:{ id: 'option_4', title: "Si, gracias"}},
      {type:'reply', reply:{ id: 'option_5', title: "Hacer otra pregunta"}},
      {type:'reply', reply:{ id: 'option_6', title: "Emergencia"}}
    ];

    if(state.step === 'question'){
      response = await openAiService(message);
    }

    delete this.assistandState[to];
    await whatsappService.sendMessage(to, response);
    await whatsappService.sendInteractiveButtons(to, menuMessage, buttons)
  }

  async sendContact(to){
    const contact = {
      addresses: [
        {
          street: "123 Calle de las Mascotas",
          city: "Ciudad",
          state: "Estado",
          zip: "12345",
          country: "País",
          country_code: "PA",
          type: "WORK"
        }
      ],
      emails: [
        {
          email: "contacto@medpet.com",
          type: "WORK"
        }
      ],
      name: {
        formatted_name: "MedPet Contacto",
        first_name: "MedPet",
        last_name: "Contacto",
        middle_name: "",
        suffix: "",
        prefix: ""
      },
      org: {
        company: "MedPet",
        department: "Atención al Cliente",
        title: "Representante"
      },
      phones: [
        {
          phone: "+1234567890",
          wa_id: "1234567890",
          type: "WORK"
        }
      ],
      urls: [
        {
          url: "https://www.medpet.com",
          type: "WORK"
        }
      ]
    };

    await whatsappService.sendContactMessage(to, contact);
  }

}
export default new MessageHandler();