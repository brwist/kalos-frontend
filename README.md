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

Development should occur on only a single module, in a single modules branch. For example, work on `modules/Login` should occur on the `Login` branch. All modules should be title case (each unique word begins with an upper case letter)

To create a new module run `yarn create`:

```
yarn create MODULE_NAME
```

This will create a new branch, switch to that branch, generate some boilerplate files, and then publish that branch. You can then run `yarn start` and visit `localhost:1234/MODULE_NAME/index.html` in your browser. All changes will be reflected in the browser via hot module replacement.

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
