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

## Debugging

Debugging can be done with the excellent extension [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome). Simply quit all running instances of Chrome and press F5, and the project should load in your current Chrome profile with debugging enabled via the extension.

Make sure that all instances of Chrome are actually closed and stopped first, otherwise it may fail to attach.

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
async function getUserByID(ID: number): User {
  const client = new UserClient();
  const req = new User();
  req.setId(ID);
  const res = await client.Get(req);
  return res;
}
```

The code above creates a new user client, which can handle the request for us. It then creates a new user called `req`, standing for "request". The new user has the ID set on it using the `req.setId(ID);` line. Lastly, with the ID specified, the client we made is used to do a `Get` request. The get request returns a response - 'res' - which is the rest of that user's information as gotten from the database.

### Fetching a list of users who are employees

Fetching lists requires you to specify the page (the API is constrained to return arrays with 25 entities at a time to simplify API usage and server code). Unlike the other methods, the `BatchGet` method returns a protobuf. Simply call the `toObject` method available to all protobufs to convert it to an object and then access the `resultsList` property. Under the hood this type will always be called `XList` where `X` is the kind of entity the client works with (in this case `UserList`).

```javascript
async function getEmployeeList(page = 0): User[] {
  const client = new UserClient();
  const req = new User();
  req.setIsEmployee(1);
  req.setIsActive(1);
  req.setPage(page);
  const res: UserList = await client.BatchGet(req);

  return res.getResultsList();
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

### Complex Searching

Most API clients support various methods to allow for more complex queries to be generated.

#### Date Ranges

```javascript
async function getEventsWithinRange(startDate: string, endDate: string) {
  const req = new Event();
  req.setDateRangeList(['>=', startDate, '<=', endDate]);
  req.setDateTargetList(['time_started', 'time_finished']);

  // generates the following SQL in the backend:
  // SELECT * FROM event where time_started >= :startDate and time_finished <= :endDate
}
```

Raw SQL functions can also be passed instead of date values:

```javascript
async function getEventsWithinRange(startDate: string, endDate: string) {
  const req = new Event();
  req.setDateRangeList(['>=', 'NOW()', '<=', endDate]);
  req.setDateTargetList(['time_started', 'time_finished']);

  // generates the following SQL in the backend:
  // SELECT * FROM event where time_started >= NOW() and time_finished <= :endDate
}
```

#### Multi value "in" searches

Some clients support this, others do not. Any property labeled as a `List` that is type `string` supports a comma separated list of values. For example:

```javascript
async function fetchUserList() {
  const req = new User();
  req.setUserIdList('1,2,3,4,5,6');

  // generates the following SQL in the backend
  // SELECT * FROM userz where user_id IN (1,2,3,4,5,6)
}
```

#### Searching via joins

```javascript
async function getEventsWithinRange(startDate: string, endDate: string) {
  const req = new Event();
  const propReq = new Property();

  propReq.setBusinessName('%b%');
  // generates the following SQL in the backend:
  // SELECT * FROM event left join event on properties.id = event.property_id
  // WHERE properties.business_name like "%b%"
}
```

Note that this data is not returned from the query, it is only used for narrowing your result set.

### Database relationships

It is common to encounter two database entities with some relationship, for example in our database each `user` can have one or more `properties`. Our current system does not (in most cases) automatically handle these relationships and so it must be handled client side. For example, getting an array of all `properties` belonging to a single `user` must be done explicitly:

```javascript
async function getUserProperties(userID: number): PropertyList {
  const client = new PropertyClient();
  const req = new Property();
  req.setUserId(userID);
  const res = await client.BatchGet(req);
  return res;
}
```

Or, more commonly, a list of `ServicesRendered` (note: `ServicesRendered` is a bit of a misnomer, it represents any employee interaction with an `Event`):

```javascript
async function getServicesRenderedByUserID(
  userID: number,
): ServicesRenderedList {
  const client = new ServicesRenderedClient();
  const req = new ServicesRendered();
  req.setTechnicianUserId(userID);
  const req = await client.BatchGet(req);
  return res;
}
```

### Components Library

Folder `/ComponentsLibrary` contains reusable UI components.

Run `yarn start --ComponentsLibrary` to view example use cases.

## Best Practices

### When you make a call to the backend, please wrap it inside of a Try-Catch block like so:

```javascript
try {
  let req = new ActivityLog();
  req.setActivityName('Example activity log');
  await ActivityLogClientService.Create(req);
} catch (err) {
  console.error(
    `An error occurred while attempting to create a new activity log: ${err}`,
  );
}
```

This allows us to diagnose any errors more effectively and allows us to track errors much easier.

## Recommended extensions (VSCode)

These aren't required, but they tend to make development easier:

- CodeStream
  - CodeStream is like an all-in-one issue tracking and communication tool
  - We can invite you to our existing CodeStream team via email
- ESLint
  - It will display warnings for missing dependencies for useEffect, useMemo, etc.
  - Offers a variety of other linting benefits over the standard linter
- Better Comments by Aaron Bond
  - This will highlight TODOs, allow for better comment clarity and generally improve comments overall
