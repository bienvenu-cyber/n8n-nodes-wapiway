import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

export class WapiWayTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WapiWay Trigger',
		name: 'wapiWayTrigger',
		icon: 'file:wapiway.svg',
		group: ['trigger'],
		version: 1,
		description: 'Receive WhatsApp events from WapiWay',
		defaults: {
			name: 'WapiWay Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'wapiWayApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Message Received',
						value: 'message.inbound.received',
						description: 'Triggered when a new inbound message is received',
					},
					{
						name: 'Message Sent',
						value: 'message.outbound.sent',
						description: 'Triggered when an outbound message is sent successfully',
					},
					{
						name: 'Message Delivered',
						value: 'message.delivered',
						description: 'Triggered when a message is delivered to recipient',
					},
					{
						name: 'Message Read',
						value: 'message.read',
						description: 'Triggered when a message is read by recipient',
					},
					{
						name: 'Message Failed',
						value: 'message.outbound.failed',
						description: 'Triggered when an outbound message fails to send',
					},
					{
						name: 'Session Connected',
						value: 'session.connected',
						description: 'Triggered when a WhatsApp session connects',
					},
					{
						name: 'Session Disconnected',
						value: 'session.disconnected',
						description: 'Triggered when a WhatsApp session disconnects',
					},
					{
						name: 'Session Failed',
						value: 'session.failed',
						description: 'Triggered when a session connection fails',
					},
					{
						name: 'Conversation Created',
						value: 'conversation.created',
						description: 'Triggered when a new conversation is initiated',
					},
					{
						name: 'Contact Created',
						value: 'contact.created',
						description: 'Triggered when a new contact is created',
					},
				],
				default: ['message.inbound.received'],
				required: true,
				description: 'The events to listen to',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const credentials = await this.getCredentials('wapiWayApi');

				const options = {
					method: 'POST' as const,
					headers: {
						'Authorization': `Bearer ${credentials.apiKey}`,
						'Content-Type': 'application/json',
					},
					body: {
						name: 'n8n Webhook',
						target_url: webhookUrl,
						subscribed_events: events,
					},
					uri: 'https://api.wapiway.tech/api/public/webhooks',
					json: true,
				};

				const response = await this.helpers.request(options);
				
				// Store webhook ID for deletion
				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = response.id;
				
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const credentials = await this.getCredentials('wapiWayApi');

				// Get webhook ID first
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;

				if (!webhookId) {
					return true;
				}

				const options = {
					method: 'DELETE' as const,
					headers: {
						'Authorization': `Bearer ${credentials.apiKey}`,
					},
					uri: `https://api.wapiway.tech/api/public/webhooks/${webhookId}`,
					json: true,
				};

				try {
					await this.helpers.request(options);
				} catch (error) {
					return false;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const events = this.getNodeParameter('events') as string[];
		
		// Check if the event type matches what we're listening for
		const eventType = bodyData.event as string;
		if (events.length > 0 && !events.includes(eventType)) {
			// Event not in our list, ignore it
			return {
				workflowData: [],
			};
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray(bodyData),
			],
		};
	}
}
