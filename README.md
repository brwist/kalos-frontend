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

### Tree shaking

This project currently relies on [material-ui](https://material-ui.com) for most of it's UI and `@kalos-core/kalos-rpc` for all network requests. Both libraries are structured in such a way to keep bundles as small as possible by supporting tree shaking. All this means is that you need to import from these libraries by specifying specific files to ensure that only necessary code is included. Example:

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

### Formatting

Style is not a major concern for us. We use `prettier` in our IDEs but don't much mind you styling code to your preference. All code will eventually be reformatted using `prettier` and while PRs that are already formatted are preferred, it is not critical if it harms your productivity or is disagreeable to you otherwise.

### Functional vs Class Components

While class components are preferred for larger components with many methods, whatever style works best for you is acceptable.

## Backend API

We use an RPC client to handle all backend requests. Each client exposes the same 5 methods:

- Get: Fetch a single entitiy

- BatchGet: Fetch a list of 25 entities

- List: Stream all entities

- Create: Create a new entitiy

- Delete: Delete an entity

Each client accepts a corresponding protobuf message type and maps directly to a database table. For example, the `UserClient` methods all accept one `User` protobuf message and returns the same type of message (except for `BatchGet` which returns a List (e.g. `UserList`)) and contains all of the same properties as a user does in our `MySQL` database (all property names are camel case). Protobuf messages are classes with `setX` and `getX` methods exposed, and are used as arguments to the appropriate client. Only non-zero values are read by default, so querying the API is as simple as passing a protobuf message with your desired constraints set to the appropriate client. Since all properties map directly to database properties, reviewing database tables can be a good way to figure out what properties you have available to you. The client is also strongly typed, as are the protobufs, so your IDE should auto complete that information for you.

The API is currently still experimental and very much in development, so this information is subject to change. Any breaking changes can be refactored by me (@rmilejcz)

### Authenticating

Every client shares a common `GetToken` method, which accepts a username and password and fetches a JWT from the server. All this logic is handled implicitly in the client so no token is returned or exposed, all that is required is to call `GetToken` with your provided username and password. Note that you should not commit code containing your username and password, and released code will have these lines removed.

```javascript
  async componentDidMount(){
    await this.UserClient.GetToken("my_username", "my_password")
  }
```

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

  return res.toObject().resultsList;
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
  req.setFieldMaskList(['IsEmployee']);
  await client.Update(req);
}
```

### The List method

The list method is generally only used for small, cacheable sets of information. The List method requires a callback to handle new incoming messages. For example, the `TransactionStatus` client is a great candidate for the `List` method:

```javascript
function handleMessage(txnStatus: TransactionStatus.AsObject): void {
  // do something with the status, usually setState
}

function getTransactionStatuses(): TransactionStatusList.AsObject {
  const client = new TransactionStatusClient();
  client.List(new TransactionStatus(), handleMessage);
}
```

`List` can be dangerous, since it is not constrained server side and will list **every entity** requested. It is therefore recommended that you set client side constraints on your protobuf messages to prevent crashing the app or worse the server. For example, using the `ActivityLogClient.List` method without setting any constraints on the protobuf `ActivityLog` will initiate stream of 2.1 million individual protobuf messages, putting extreme strain on the server and database. `List` can also lead to many uneeded rerenders, which is why is should be used in conjunction with some caching solution, never on `PureComponent`, and with some `shouldComponentUpdate` logic.

### Database relationships

It is common to encounter two database entities with some relationship, for example in our database each `user` can have one or more `properties`. Our current system does not (in most cases) automatically handle these relationships and so it must be handled client side. For example, getting an array of all `properties` belonging to a single `user` must be done explicitly:

```javascript
async function getUserProperties(userID: number): PropertyList.AsObject {
  const client = new PropertyClient();
  const req = new Property();
  req.setUserId(userID);
  const res = await client.BatchGet(req);
  return res.toObject().resultsList;
}
```

Or, more commonly, a list of `ServicesRendered` (note: `ServicesRendered` is a bit of a misnomer, it represents any employee interaction with an `Event`):

```javascript
async function getServicesRenderedByUserID(
  userID: number
): ServicesRenderedList.AsObject {
  const client = new ServicesRenderedClient();
  const req = new ServicesRendered();
  req.setTechnicianUserId(userID);
  const req = await client.BatchGet(req);
  return res.toObject().resultsList;
}
```

### Components Library

Folder `/ComponentsLibrary` contains reusable UI components.

Run `yarn start --ComponentsLibrary` to view example use cases.
