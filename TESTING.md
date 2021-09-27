# Testing in Kalos Frontend

## How do I create tests for a module?

It's pretty simple!

Let's say you want to create a new module, for example `modules/NewModule`.

You have a few options:

- Create the new module using `yarn make --NewModule`, which adds a testing file for you
- Add the file manually in `test/modules/NewModule` and name it `index.test.tsx`

I highly recommend the first option, as it also generates a ton of boilerplate code for you to utilize. You only really need to run `yarn make` and then `yarn test-watch` to see your first tests in-action!

## How do I create tests for a component?

This is also really simple!

For `modules/ComponentsLibrary/NewComponent`, you have these options:

- Create the new component using `yarn make --NewComponent --Component`, which also adds a testing file for you
- Add the file manually in `test/modules/ComponentsLibrary/NewComponent` and name it `index.test.tsx`

I still highly recommend the first option, as again, it adds a ton of useful boilerplate and sticks to our style and best-practices. You can just run `yarn make` then `yarn test-watch` to see these tests in action, too!

## Style preferences

When adding tests, be sure to follow the folder structure of the repository as closely as possible.

For example, if the content you are testing is `/modules/ComponentsLibrary/MyModule/components/main.tsx`, then your test should be in `/test/modules/ComponentsLibrary/MyModule/components/main.test.tsx`. If you were testing the file `index.tsx`, then the test file would be `index.test.tsx`.

If you just wrote a test and cannot implement it yet but wish to push the commit with it, simply leave the callback off of the `it` call. For example, instead of this:

```javascript
it('functions correctly', () => {
  throw new Error('Not implemented');
});
```

You should simply do this to skip the test when Mocha is run:

```javascript
it('functions correctly');
```

This ensures that our output from Mocha isn't clogged up by "Not implemented" errors.

When adding tests for modules, make sure to wrap the module in an outer describe block with the name of the module, then a description of the exact React component being rendered. For example:

```javascript
describe('MyCoolComponent', () => {
  describe('<MyCoolComponent userID={456} />', () => {
    //... Rest of the tests here
  });
});
```

For components, do the same but wrap it all in a describe with the "ComponentsLibrary" description. These keep our test output clean and ensure easy readability at a glance.

## What are some best-practices for tests?

Tests should be:

- Fast
- Accurate
- Helpful

They should accurately indicate that a feature of your component or module is working and displaying as intended. However, they do not necessarily need to verify that dependencies of that module are working (IE, you can and should use stubbing in unit tests to provide data for your tests to ensure correct results). Tests should never be redundant and should only measure small features of the site.

Because of these qualities of tests, they are extremely useful in Behavior Driven Development (and Test Driven Development). These methods of creating new material for the site involve writing your tests first, seeing them fail, and then making them pass to ensure that the spec for the module is being followed. I would highly recommend reading up on it, it saves a ton of time.

## Why is yarn test so slow?

This is due to the loading of node_modules during the startup. Because it takes a while, I tend to use `yarn test-watch` and leave it running in the background.
