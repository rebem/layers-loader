[![npm](https://img.shields.io/npm/v/rebem-layers-loader.svg?style=flat-square)](https://www.npmjs.com/package/rebem-layers-loader)
[![travis](http://img.shields.io/travis/rebem/layers-loader.svg?style=flat-square)](https://travis-ci.org/rebem/layers-loader)
[![coverage](https://img.shields.io/codecov/c/github/rebem/layers-loader.svg?style=flat-square)](https://codecov.io/github/rebem/layers-loader)
[![deps](https://img.shields.io/gemnasium/rebem/layers-loader.svg?style=flat-square)](https://gemnasium.com/rebem/layers-loader)

[Webpack](https://webpack.github.io/) loader for composing sets (layers) of React components. It allows you to easily create themes and share entire component libraries. A couple of use-cases:

### products

![](https://dl.dropboxusercontent.com/s/xffgzqv4rvngbbz/products.png)

### platforms

![](https://dl.dropboxusercontent.com/s/lvnj9wtpool6mw1/platforms.png)

## Usage

### `#`

Components from layers are imported with a special `#`-character along with their styles. So instead of:
```js
import Button from '../../some-layer/button/';
import from '../../some-theme/button/styles.css';
import from '../../another-theme/button/styles.css';
```

you just write:

```js
import Button from '#button';
```

It imports **component** from the **last layer below** current, and **styles** from **all  layers**.

### With [reBEM](https://github.com/rebem/rebem)

Button is exported as `React.createFactory(Button)`, so we can use function calls instead of `React.createElement(Button)`:
```js
import { Component } from 'react';
import { BEM } from 'rebem';
import Button from '#button';

class SomeComponent extends Component {
  render() {
    return BEM({ block: 'some-block' },
      Button({ block: 'some-block', elem: 'button' }, 'Click me');
    )
  }
}
```

### With jsx

Button is exported as is (see [`exportFactory`](#exportfactory) option in webpack config):
```js
import React from 'react';
import { BEM } from 'rebem';
import Button from '#button';

class SomeComponent extends React.Component {
  render() {
    return (
      <BEM block="some-block">
        <Button block="some-block" elem="button">{'Click me'}</Button>;
      </BEM>
    );
  }
}
```

## Example

### `core-components`

Initiate the component
```js
/*
.
└──/core-components
   └── /button
       └── /index.js
*/
export default class extends React.Component {
  render() {//...}
}
```

### `theme-reset`

Reset browser specific styles

```js
/*
.
└──/theme-reset
   └── /button
       └── /styles.less
*/
```

### `custom-components`

At some point we can extend our component in a separate layer. For example, add an icon to a button:

```js
/*
.
└──/custom-components
   └── /button
      └── /index.js
*/
// import Button from 'core-components/button/index.js';
// import from 'theme-reset/button/styles.less';
import Button from '#button';

export default class extends React.Component {
  renderIcon() { /*...*/ }
  render() {
    return (
      <Button {...this.props}>
        {children}
        {this.renderIcon()}
      </Button>
    );
  }
}
```

### `product-theme`

Now we may need to apply some theme styles:

```js
/*
.
└──/product-theme
   └── /button
      └── /index.js
*/
// import Button from 'custom-components/button/index.js';
// import from 'theme-reset/button/styles.less';
// import from './styles.less';
import Button from '#button';

export default class extends React.Component {
    return (
      <Button {...this.props}>
        {children}
        <div className="button-mask" />
      </Button>
    );
}
```

```less
/*
.
└──/product-theme
   └── /button
      └── /styles.less
*/
.button {
  // ...

  &__mask {
    position: absolute;
    background: #f00;
    border: 2px solid #000;
  }
}
```

### `app`

And finally we can use this button in our app with the optional local styles

```js
/*
.
└──/app
   └── /somewhere.js
*/
// import Button from 'product-theme/button/index.js';
// import from 'theme-reset/button/styles.less';
// import from 'product-theme/button/styles.less';
// import from 'app/components/button/styles.less';
import Button from '#button';

class SomeAppComponent extends React.Component {
    // ...
    return (
      //...
        <Button
          icon="never-gonna-give-you-up.png"
          onClick={doStuff}>
          {'Click me'}
        </Button>
      //...
    );
}
```

## Creating a layer

You can use any technologies in your layers (css-preprocessors, babel, etc.). A good practice in this case is to prebuild it, so consumer of your layer wouldn't have to do it for you. Some examples of prebuilded layers:
* [core components](https://github.com/rebem/core-components) with Babel
* [theme-reset](https://github.com/rebem/theme-reset) with LESS

### folders structure

You can use any structure you want, the example below is just a guideline:

```js
/*
.
└──/custom-layer
   ├── /index.js`
   └── /components
       ├── /button
       │   ├── /index.js
       │   └── /styles.css
       ├── /checkbox
       ├── /input
       │   ├── /index.js
       │   └── /styles.css
       ├── /radio
       └── /...
*/
```

### layer config

Consumers of your layer need to know how to work with it, so a good practice is to create a layer config like this:
```js
// custom-layer/index.js
var path = require('path');

module.exports = {
    path: path.resolve(__dirname, 'components/'),
    files: {
        main: 'index.js',
        styles: 'styles.css'
    }
};
```

#### `path`

Path to the components folder (it can be named `components`, `lib`, `src`, `build`, whatever).

#### `files`

File names to use when importing components from this layer.

* `main` — component source: it can be optional if you are creating just css-theme
* `styles` — component styles: always optional. You can have entire layer (*theme*) made only with styles. But actually you can extend your components in themes too — for example if you want to add some presentation element in children (like we did in the [`Button`](#product-theme) example above)


## Webpack config

In your app you need to configure how layers should be composed, where you app components are, etc. Example:

```js
  // ...
  preLoaders: [
    {
      test: /\.js$/,
      loader: 'rebem-layers',
      query: {
        layers: [
          // shared layers
          require('core-components'),
          require('theme-reset'),
          require('../custom-layer'),

          // app components
          {
            path: path.resolve('src/components/'),
            files: {
              main: 'index.js',
              styles: 'styles.less'
            }
          }
        ],
        // app source
        include: [
          path.resolve('src/')
        ]
      }
    }
  ],
  // ...
```

### `layers`

Array of layer configs. If some layers already have config, you can just import it.

### `include`

Array of paths where you want to use components from the layers (with `#`-imports). For example, files outside your app component folder or in a unit-tests folder.

### `exportFactory`

default: `true`

By default when you use `#`-imports, all components are exporting wrapped with React factories (`React.createFactory(...)`), but you can disable it by setting this option to `false`.

However if you chose to leave it as `true`, for example if you use reBEM without jsx, you may encounter with a situation when you need class in unit-tests. In this case you can use `?class` option:

```js
import Button from '#button?class';

it('is a component', function() {
	expect(ReactTestUtils.isCompositeComponent(Button)).to.be.true;
});
```

### `inject`

default: `false`

If you want to mock dependencies of your components for unit-tests, set this option to `true`. It will allow you to do this:

```js
// `inject` option in import path makes component injectable
import AppComponentInjector from '#app?inject';

const App = AppInjector({
    '~/some-flux-store': (function() {
    	return class MockedStore {
        	// ...
        };
    })()
});

TestUtils.renderIntoDocument(App);
// ... tests
```

You can use `inject` along with `?class`-option as well:

```js
// injectable component imported as React class
import AppComponentInjector from '#app?class&inject';
```
