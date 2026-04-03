import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  NodeOperationError,
} from 'n8n-workflow';

export class WapiWay implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'WapiWay',
    name: 'wapiWay',
    icon: 'file:wapiway.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with WapiWay WhatsApp Business API',
    defaults: {
      name: 'WapiWay',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'wapiWayApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Message',
            value: 'message',
          },
          {
            name: 'Session',
            value: 'session',
          },
          {
            name: 'Contact',
            value: 'contact',
          },
          {
            name: 'Conversation',
            value: 'conversation',
          },
        ],
        default: 'message',
      },

      // Message Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['message'],
          },
        },
        options: [
          {
            name: 'Send Text',
            value: 'sendText',
            description: 'Send a text message',
            action: 'Send a text message',
          },
          {
            name: 'Send Media',
            value: 'sendMedia',
            description: 'Send a media message',
            action: 'Send a media message',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get message details',
            action: 'Get message details',
          },
        ],
        default: 'sendText',
      },

      // Send Text Message Fields
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendText', 'sendMedia'],
          },
        },
        default: '',
        placeholder: '33612345678',
        description: 'Recipient phone number in international format without +',
      },
      {
        displayName: 'Message Content',
        name: 'content',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendText'],
          },
        },
        default: '',
        typeOptions: {
          rows: 4,
        },
        description: 'The text message to send (max 4096 characters)',
      },
      {
        displayName: 'Session ID',
        name: 'sessionId',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendText', 'sendMedia'],
          },
        },
        default: '',
        description: 'Optional: Specific session ID to use. If omitted, uses first connected session.',
      },

      // Send Media Fields
      {
        displayName: 'Media Type',
        name: 'mediaType',
        type: 'options',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendMedia'],
          },
        },
        options: [
          {
            name: 'Image',
            value: 'image',
          },
          {
            name: 'Video',
            value: 'video',
          },
          {
            name: 'Document',
            value: 'document',
          },
          {
            name: 'Audio',
            value: 'audio',
          },
        ],
        default: 'image',
      },
      {
        displayName: 'Media URL',
        name: 'mediaUrl',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendMedia'],
          },
        },
        default: '',
        placeholder: 'https://example.com/image.jpg',
        description: 'Public URL of the media file',
      },
      {
        displayName: 'Caption',
        name: 'caption',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendMedia'],
          },
        },
        default: '',
        description: 'Optional caption for the media',
      },

      // Get Message Fields
      {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['get'],
          },
        },
        default: '',
        description: 'The ID of the message to retrieve',
      },

      // Session Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['session'],
          },
        },
        options: [
          {
            name: 'Get All',
            value: 'getAll',
            description: 'Get all sessions',
            action: 'Get all sessions',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a session',
            action: 'Get a session',
          },
        ],
        default: 'getAll',
      },
      {
        displayName: 'Session ID',
        name: 'sessionId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['session'],
            operation: ['get'],
          },
        },
        default: '',
        description: 'The ID of the session to retrieve',
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
          show: {
            resource: ['session'],
            operation: ['getAll'],
          },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
          show: {
            resource: ['session'],
            operation: ['getAll'],
            returnAll: [false],
          },
        },
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 20,
        description: 'Max number of results to return',
      },

      // Contact Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['contact'],
          },
        },
        options: [
          {
            name: 'Get All',
            value: 'getAll',
            description: 'Get all contacts',
            action: 'Get all contacts',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get a contact',
            action: 'Get a contact',
          },
        ],
        default: 'getAll',
      },
      {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['contact'],
            operation: ['get'],
          },
        },
        default: '',
        description: 'The ID of the contact to retrieve',
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
          show: {
            resource: ['contact'],
            operation: ['getAll'],
          },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
          show: {
            resource: ['contact'],
            operation: ['getAll'],
            returnAll: [false],
          },
        },
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 20,
        description: 'Max number of results to return',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'message') {
          if (operation === 'sendText') {
            const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
            const content = this.getNodeParameter('content', i) as string;
            const sessionId = this.getNodeParameter('sessionId', i, '') as string;

            const body: IDataObject = {
              phone_number: phoneNumber,
              content,
            };

            if (sessionId) {
              body.session_id = sessionId;
            }

            const response = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'wapiWayApi',
              {
                method: 'POST',
                url: 'https://api.wapiway.tech/api/public/messages/send-text',
                body,
                json: true,
              },
            );

            returnData.push(response as IDataObject);
          } else if (operation === 'sendMedia') {
            const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
            const mediaType = this.getNodeParameter('mediaType', i) as string;
            const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
            const caption = this.getNodeParameter('caption', i, '') as string;
            const sessionId = this.getNodeParameter('sessionId', i, '') as string;

            const body: IDataObject = {
              phone_number: phoneNumber,
              type: mediaType,
              media_url: mediaUrl,
            };

            if (caption) {
              body.caption = caption;
            }

            if (sessionId) {
              body.session_id = sessionId;
            }

            const response = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'wapiWayApi',
              {
                method: 'POST',
                url: 'https://api.wapiway.tech/api/public/messages/send-media',
                body,
                json: true,
              },
            );

            returnData.push(response as IDataObject);
          } else if (operation === 'get') {
            const messageId = this.getNodeParameter('messageId', i) as string;

            const response = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'wapiWayApi',
              {
                method: 'GET',
                url: `https://api.wapiway.tech/api/public/messages/${messageId}`,
                json: true,
              },
            );

            returnData.push(response as IDataObject);
          }
        } else if (resource === 'session') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const limit = this.getNodeParameter('limit', i, 20) as number;

            const qs: IDataObject = {
              limit: returnAll ? 100 : limit,
            };

            const response = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'wapiWayApi',
              {
                method: 'GET',
                url: 'https://api.wapiway.tech/api/public/sessions',
                qs,
                json: true,
              },
            );

            const sessions = (response as IDataObject).data as IDataObject[];
            returnData.push(...sessions);
          } else if (operation === 'get') {
            const sessionId = this.getNodeParameter('sessionId', i) as string;

            const response = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'wapiWayApi',
              {
                method: 'GET',
                url: `https://api.wapiway.tech/api/public/sessions/${sessionId}`,
                json: true,
              },
            );

            returnData.push(response as IDataObject);
          }
        } else if (resource === 'contact') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const limit = this.getNodeParameter('limit', i, 20) as number;

            const qs: IDataObject = {
              limit: returnAll ? 100 : limit,
            };

            const response = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'wapiWayApi',
              {
                method: 'GET',
                url: 'https://api.wapiway.tech/api/public/contacts',
                qs,
                json: true,
              },
            );

            const contacts = (response as IDataObject).data as IDataObject[];
            returnData.push(...contacts);
          } else if (operation === 'get') {
            const contactId = this.getNodeParameter('contactId', i) as string;

            const response = await this.helpers.httpRequestWithAuthentication.call(
              this,
              'wapiWayApi',
              {
                method: 'GET',
                url: `https://api.wapiway.tech/api/public/contacts/${contactId}`,
                json: true,
              },
            );

            returnData.push(response as IDataObject);
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          returnData.push({ error: errorMessage });
          continue;
        }
        throw error;
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
