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

We use an RPC client to handle all backend requests. A list of available clients can be found here (ADD LINK). Each client exposes the same 5 methods:

- Get: Fetch a single entitiy

- BatchGet: Fetch a list of 25 entities

- List: Stream all entities

- Create: Create a new entitiy

- Delete: Delete an entity

Each client accepts a corresponding protobuf message type. For example, the `UserClient` methods all accept one `User` protobuf message and returns the same type of message (except for `BatchGet` which returns a List (e.g. `UserList`)).

## Releasing a Module

Releasing a module is currenlty handled by @robbiemilejczak
