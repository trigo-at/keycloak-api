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

# Features

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

## Realms

### createRealm

```javascript
const {statusCode, data} = await api.createRealm({ realm: 'sparta', tokenProvider })
```

## Users

### getUsers

Get list of users. Optional query object as key value.

```javascript

const query = {
	username: 'leonidas',
};

const {statusCode, data} = await api.getUsers({ realm: 'sparta', query, tokenProvider });
```

`statusCode` contains the HTTP status code.
`data` array of Keycloak Users.

### createUser

Creates a new user.

```javascript

const user = {
	username: 'leonidas',
};

const {statusCode, data} = await api.createUser({ realm: 'sparta', user, tokenProvider });
```

`statusCode` contains the HTTP status code.
`data` the keycloak user object.

## Groups

### createGroup

Creates a new user group.


```javascript

const group = {
	name: 'Spartiates',
};

const parentGroupId = 300; // Optional

const {statusCode, data} = await api.createGroup({ realm: 'sparta', group, parentGroupId, tokenProvider });
```

`statusCode` contains the HTTP status code.
`data` the keycloak group object.
