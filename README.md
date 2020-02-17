# Kalos Frontend

The current home for all new app.kalos frontend modules and module development

## Getting Started

Clone this repo:

```
git clone https://github.com/rmilejcz/kalos-frontend.git
```

CD into it, login to NPM (you only need to do this once), and then run yarn install:

```
cd kalos-frontend && npm login
yarn install
```

You also need to install parcel globally (DO NOT INSTALL PARCEL AS A LOCAL DEPENDENCY):

```
yarn global add parcel
```

## Development

Development should occur on the master branch. All modules should be title case (each unique word begins with an upper case letter). To create a new module run `yarn make`:

```
yarn make --ModuleName
```

This will creates a new module and generates some boilerplate files. You can then run `yarn start --ModuleName` and visit `localhost:1234` in your browser. All changes will be reflected in the browser via hot module replacement.

## Development Concerns

This project currently relies on [material-ui](https://material-ui.com) for most of it's UI and `@kalos-core/kalos-rpc` for all network requests. Both libraries are structured in such a way to keep bundles as small as possible. All this means is that you need to import from these libraries by specifying specific files to ensure that only necessary code is included. Example:

```
import Button from '@material-ui/core/Button'
import CloudUploadOutline from '@material-ui/icons/CloudUploadOutline'
import { Transaction, TransactionClient } from '@kalos-core/kalos-rpc/Transaction'
```

instead of

```
import { Button } from '@material-ui/core/'
import { CloudUploadOutline } from '@material-ui/icons/CloudUploadOutline'
import { Transaction, TransactionClient } from '@kalos-core/kalos-rpc/
```

By allowing imports of specific files, we can avoid including large unused files and signficantly keep bundle size down.

## Making Network Requests

We use an RPC client to handle all backend requests. Each client exposes the same 5 methods:

- Get: Fetch a single entitiy

- BatchGet: Fetch a list of 25 entities

- List: Stream all entities

- Create: Create a new entitiy

- Delete: Delete an entity

Each client accepts a corresponding protobuf message type and maps directly to a database table. For example, the `UserClient` methods all accept one `User` protobuf message and returns the same type of message (except for `BatchGet` which returns a List (e.g. `UserList`)) and contains all of the same properties as a user does in our `MySQL` database (all property names are camel case). Protobuf messages are classes with `setX` and `getX` methods exposed, and are used as arguments to the appropriate client. Only non-zero values are read by default, so querying the API is as simple as passing a protobuf message with your desired constraints set to the appropriate client. All valid properties map directly to database properties, so reviewing database tables can be a good way to figure out what properties you have available to you. The client is also strongly typed, as are the protobufs, so your IDE should auto complete that information for you.

The API is currently still experimental and very much in development, so this information is subject to change. Any breaking changes can be refactored by me (@rmilejcz)

### Fetching a user by user ID
```javascript
async function getUserByID(ID: number): User.AsObject {
  const client = new UserClient();
  const req = new User();
  req.setId(ID);
  const res = await client.Get(req);
  return res;
}
```
### Fetching a list of users who are employees
Fetching lists requires you to specify the page (the API is constrained to return arrays with 25 entities at a time to simplify API usage and server code). Unlike the other methods, the `BatchGet` method returns a protobuf. Simply call the `toObject` method available to all protobufs to convert it to an object and then access the `resultsList` property. Under the hood this type will always be called `XList` where `X` is the kind of entity the client works with (in this case `UserList`). 
```javascript
async function getEmployeeList(page = 0): User.AsObject[] {
  const client = new UserClient();
  const req = new User();
  req.setIsEmployee(1);
  req.setIsActive(1);
  req.setPage(page);
  const res: UserList = await client.BatchGet(req);
  
  const resAsObject: UserList.AsObject = res.toObject();
  // UserList.AsObject {
  //   resultsList: User.AsObject[];
  //   totalCount: number;
  // }
  
  return res.toObject().resultsList
}
```
### Updating user information
Making update requests requires you to specify which fields are being updated via a field mask array (which is just an array of strings in our case). This is because the backend API is written in Go; the way Go handles empty values requires us to specify which values we would like to be changed. The casing of strings specified in the field mask list must currently be cased as Go struct properties (sometimes called "Pascal Case") as opposed to camel case (so "IsEmployee" not "isEmployee"). For example, changing an employee to a customer:

```javascript
async function convertEmployeeToCustomer(ID: number): void {
  const client = new UserClient();
  const req = new User();
  req.setIsEmployee(0);
  req.setId(ID);
  req.setFieldMaskList(['IsEmployee'])
  await client.Update(req);
}
```

## Releasing a Module

Releasing a module is currenlty handled by @robbiemilejczak
