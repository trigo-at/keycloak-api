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
const {statusCode, data, header} = await api.createRealm({ realm: 'sparta', tokenProvider })
```

## Users

### getUsers

Get list of users. Optional query object as key value.

```javascript

const query = {
	username: 'leonidas',
};

const {statusCode, data, header} = await api.getUsers({ realm: 'sparta', query, tokenProvider });
```

`statusCode` contains the HTTP status code.
`data` array of Keycloak Users.
`header` [node-fetch](https://github.com/node-fetch/node-fetch/blob/master/src/headers.js#L200) style raw headers

### createUser

Creates a new user.

```javascript

const user = {
	username: 'leonidas',
};

const {statusCode, data, header} = await api.createUser({ realm: 'sparta', user, tokenProvider });
```

`statusCode` contains the HTTP status code.
`data` the keycloak user object.
`header` [node-fetch](https://github.com/node-fetch/node-fetch/blob/master/src/headers.js#L200) style raw headers

## Groups

### getGroups

Returns all keycloak Groups

```javascript

const {statusCode, data, header} = await api.getGroups({ realm: 'sparta', tokenProvider });
```

`statusCode` contains the HTTP status code.
`data` array of keycloak groups.
`header` [node-fetch](https://github.com/node-fetch/node-fetch/blob/master/src/headers.js#L200) style raw headers

### createGroup

Creates a new user group.

```javascript

const group = {
	name: 'Spartiates',
	attributes: {
		'size': ['300'],
	},
};

const parentGroupId = 300; // Optional

const {statusCode, data, header} = await api.createGroup({ realm: 'sparta', group, parentGroupId, tokenProvider });
```

`statusCode` contains the HTTP status code.
`data` the keycloak group object.
`header` [node-fetch](https://github.com/node-fetch/node-fetch/blob/master/src/headers.js#L200) style raw headers

### deleteGroup

Deletes a user group by groupId

```javascript

const {statusCode} = await api.deleteGroup({ realm: 'sparta', groupId: 300, tokenProvider });
```

`statusCode` contains the HTTP status code.
`header` [node-fetch](https://github.com/node-fetch/node-fetch/blob/master/src/headers.js#L200) style raw headers

### makeGroupChildOfGroup

If group exists it sets the parent otherwise it creates the group as a child

```javascript

const {statusCode} = await api.makeGroupChildOfGroup({ realm: 'sparta', parentGroupId: '42', group: { id: '43', name: 'child group' }, tokenProvider });
```

`statusCode` contains the HTTP status code.
`header` [node-fetch](https://github.com/node-fetch/node-fetch/blob/master/src/headers.js#L200) style raw headers
