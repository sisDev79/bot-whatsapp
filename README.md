# Bot-whatsapp

### Autor
[Misael Gómez Cuautle](https://www.linkedin.com/in/misael-g%C3%B3mez-cuautle-5976491b9/)

### Links de inicio
[Meta for Developers](https://developers.meta.com/)
[WhrasApp Información](https://business.whatsapp.com/products/platform-pricing)
[Configuración de webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks)
[Server.js](https://glitch.com/edit/?fbclid=IwZXh0bgNhZW0CMTEAAR2BxvBgpe7K25b7zB4aB_Zk_tGAwzL7EatjBUAvZEy-dMyvr9W4cCVoP9M_aem_2sy_9WBLBVrke5oA-U4fNA#!/whatsapp-cloud-api-echo-bot)
[Express](https://expressjs.com/)
[Axios](https://github.com/axios/axios)
[dotenv](https://www.npmjs.com/package/dotenv)
[nodemon](https://github.com/remy/nodemon)

# WhatsApp Webhook Bot

Este proyecto es una implementación de un webhook que interactúa con la **API de WhatsApp Cloud** para recibir y responder mensajes automáticamente. Escrito en **Node.js** utilizando **Express** y **Axios**, este bot puede enviar respuestas automáticas, marcar mensajes como leídos y manejar números de teléfono en formato correcto.

## Características

- Recibe mensajes de texto a través de un webhook.
- Limpia y ajusta números de teléfono mal formateados (por ejemplo, elimina el prefijo `521`).
- Envía respuestas automáticas a los mensajes recibidos.
- Marca los mensajes como leídos para evitar notificaciones pendientes.
- Compatible con la API de WhatsApp Cloud de Meta.

## Requisitos Previos

1. Una cuenta activa en **Meta for Developers** con acceso a la API de WhatsApp Cloud. [Meta for Developers](https://developers.meta.com/)
2. Un servidor con **Node.js** y **npm** instalado.
3. Una herramienta como **ngrok** o un dominio con soporte HTTPS para exponer tu webhook públicamente.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/whatsapp-webhook-bot.git
   cd whatsapp-webhook-bot
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

   ```env
   WEBHOOK_VERIFY_TOKEN=tu_token_de_verificación
   API_TOKEN=tu_token_de_acceso_a_la_api
   BUSINESS_PHONE=tu_numero_de_negocios
   API_VERSION=v21.0
   PORT=3000
   ```

   - Reemplaza los valores con los datos de tu configuración en el portal de **Meta for Developers**.

## Uso

1. Inicia el servidor localmente:

   ```bash
   npm run start
   ```

   O utiliza **nodemon** durante el desarrollo:

   ```bash
   npm run dev
   ```

2. Exponer tu webhook públicamente (por ejemplo, con ngrok):

   ```bash
   ngrok http 3000
   ```

   Copia la URL generada (por ejemplo, `https://abc123.ngrok.io`) y configúrala en tu aplicación de WhatsApp Cloud como la URL del webhook.

3. Verifica el webhook:
   - Envía una solicitud GET con tu token de verificación.
   - Si el webhook está configurado correctamente, debería devolver un **200 OK**.

4. Envía mensajes desde un cliente de WhatsApp y observa cómo el servidor responde automáticamente.

## Estructura del Proyecto

```plaintext
.
├── .env                # Variables de entorno
├── package.json        # Dependencias y scripts de npm
├── server.js           # Lógica principal del servidor
├── README.md           # Documentación del proyecto
└── node_modules/       # Dependencias instaladas
```

## Personalización

- Puedes personalizar las respuestas en la sección donde se construye el objeto `data` en `server.js`:

   ```javascript
   text: { body: "Echo: " + message.text.body },
   ```

   Cambia el contenido por el mensaje deseado.

- Agrega nuevas funcionalidades según tus necesidades (ejemplo: respuestas basadas en palabras clave).

## Problemas Comunes

1. **El webhook no se verifica:**
   - Asegúrate de que la URL configurada en Meta incluye el token correcto y es accesible públicamente.
   
2. **Número mal formateado:**
   - Verifica que la función `cleanPhoneNumber` esté funcionando correctamente y esté siendo aplicada al campo `to`.

3. **Errores de la API de WhatsApp:**
   - Revisa los mensajes de error en los logs del servidor (`console.error`) para identificar problemas específicos.

## Contribuciones

¡Contribuciones son bienvenidas! Si tienes ideas para mejorar este proyecto, siéntete libre de crear un **pull request** o abrir un **issue**.

## Más dellalles
[Notion]([https://github.com/remy/nodemon](https://fate-snowman-aed.notion.site/Bot-WhatsApp-17236f6b19d1806fa938cc9db1efd251))
