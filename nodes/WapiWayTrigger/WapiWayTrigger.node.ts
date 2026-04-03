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

				const body = {
					name: 'n8n Webhook',
					target_url: webhookUrl,
					subscribed_events: events,
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'wapiWayApi',
					{
						method: 'POST',
						url: 'https://api.wapiway.tech/api/public/webhooks',
						body,
						json: true,
					},
				);
				
				// Store webhook ID and secret for deletion and validation
				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = response.id;
				webhookData.webhookSecret = response.secret;
				
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Get webhook ID first
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;

				if (!webhookId) {
					return true;
				}

				try {
					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'wapiWayApi',
						{
							method: 'DELETE',
							url: `https://api.wapiway.tech/api/public/webhooks/${webhookId}`,
							json: true,
						},
					);
				} catch (error) {
					return false;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const bodyData = this.getBodyData();
		const events = this.getNodeParameter('events') as string[];
		
		// Verify webhook signature
		const webhookData = this.getWorkflowStaticData('node');
		const webhookSecret = webhookData.webhookSecret as string;
		
		if (webhookSecret) {
			const signature = req.headers['x-webhook-signature'] as string;
			const body = JSON.stringify(bodyData);
			
			// Verify HMAC-SHA256 signature
			const crypto = require('crypto');
			const expectedSignature = 'sha256=' + crypto
				.createHmac('sha256', webhookSecret)
				.update(body)
				.digest('hex');
			
			if (signature !== expectedSignature) {
				// Invalid signature - reject webhook
				return {
					workflowData: [],
				};
			}
		}
		
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
