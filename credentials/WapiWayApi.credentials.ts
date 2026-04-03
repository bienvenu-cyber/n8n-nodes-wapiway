import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class WapiWayApi implements ICredentialType {
  name = 'wapiWayApi';
  displayName = 'WapiWay API';
  documentationUrl = 'https://www.wapiway.tech/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      placeholder: 'sk_live_xxxxxxxxxxxx',
      description: 'Your WapiWay API key from the Developer Console',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.wapiway.tech/api',
      url: '/public/sessions',
      method: 'GET',
    },
  };
}
