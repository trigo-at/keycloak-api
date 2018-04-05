# Node.js Keycloak API Wrapper

## Usage

```javascript
const KeycloakApi = require('@trigo/keycloak-api');

const config = {
	authorizationEndpoint: 'https://<keycloak>/auth',
	clientId: '<clientId>',
	username: '<username>', // admin user
	password: '<password>',
	
};
const api = new KeycloakApi(config);
await api.waitForKeycloak(); // required 
```

## Features

Ever function requires a function param called `tokenProvider`. It should return a access token.

#### Example

```javascript
const tokenProvider = async () => {
    const res = await api.getToken({
        realm: 'master',
        grantType: 'password',
        clientId: 'admin-cli',
        username: '<username>',
        password: '<password>',
    });
    return res.data.access_token;
};
```

_We will refer to this example in the following function calls._

### createRealm

```javascript
api.createRealm({ realm: 'sparta', tokenProvider })
```
