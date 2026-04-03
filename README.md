# n8n-nodes-wapiway

[![npm version](https://badge.fury.io/js/n8n-nodes-wapiway.svg)](https://www.npmjs.com/package/n8n-nodes-wapiway)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an n8n community node for [WapiWay](https://www.wapiway.tech) - WhatsApp Business API automation platform.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## 🚀 Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-wapiway` in **Enter npm package name**
4. Agree to the risks and install

### Manual Installation

```bash
npm install n8n-nodes-wapiway
```

## 🔑 Credentials

You need a WapiWay API key to use this node:

1. Sign up at [WapiWay](https://www.wapiway.tech/register)
2. Go to [Developer Console](https://www.wapiway.tech/dev-console)
3. Create a new API key
4. Copy the key (starts with `sk_live_` or `sk_test_`)

In n8n:
1. Go to **Credentials > New**
2. Search for **WapiWay API**
3. Paste your API key
4. Save

## 📋 Operations

### Message

- **Send Text**: Send a text message via WhatsApp
- **Send Media**: Send media (image, video, document, audio)
- **Get**: Get message status and details

### Session

- **Get All**: List all WhatsApp sessions
- **Get**: Get details of a specific session

### Contact

- **Get All**: List all contacts
- **Get**: Get details of a specific contact

### Conversation

- **Get All**: List all conversations
- **Get**: Get details of a specific conversation

## 💡 Example Workflows

### Send Welcome Message

```
Trigger (Webhook) → WapiWay (Send Text)
```

When a new customer signs up, automatically send them a WhatsApp welcome message.

### Auto-Reply to Messages

```
WapiWay Trigger (New Message) → IF Node → WapiWay (Send Text)
```

Listen for incoming WhatsApp messages and automatically reply based on keywords.

### Notify Team on New Lead

```
Form Submit → WapiWay (Send Text) → Slack
```

When a lead form is submitted, send WhatsApp notification and post to Slack.

## 📚 Resources

- [WapiWay Documentation](https://www.wapiway.tech/docs)
- [WapiWay Integrations Guide](https://www.wapiway.tech/integrations)
- [Postman Collection](https://documenter.getpostman.com/view/40083121/2sBXionAXT)
- [OpenAPI Spec](https://www.wapiway.tech/openapi.json)
- [n8n Documentation](https://docs.n8n.io/)
- [Support](mailto:support@wapiway.tech)

## 🐛 Issues & Feature Requests

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/wapiway/n8n-nodes-wapiway/issues).

## 📝 Version History

### 1.0.3 (2026-04-03)

- Fixed icon display issue
- Improved error handling

### 1.0.0 (2026-04-03)

- Initial release
- Support for messages, sessions, contacts, and conversations
- Full CRUD operations
- Webhook support

## 📄 License

[MIT](LICENSE.md)

## 🤝 Support

For issues or questions:
- Email: support@wapiway.tech
- Documentation: https://www.wapiway.tech/docs
- n8n Community: https://community.n8n.io
