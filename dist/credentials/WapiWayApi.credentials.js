"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WapiWayApi = void 0;
class WapiWayApi {
    constructor() {
        this.name = 'wapiWayApi';
        this.displayName = 'WapiWay API';
        this.documentationUrl = 'https://www.wapiway.tech/docs';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.wapiway.tech/api',
                url: '/public/sessions',
                method: 'GET',
            },
        };
    }
}
exports.WapiWayApi = WapiWayApi;
