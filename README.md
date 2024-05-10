### REACT-SUBLIME

# installation

### Create react app

```cmd
npx create-react-app test
```

### Navigate to react app
```cmd
cd test
```

### Install react sublime, sublime components and styles, also sass and tailwind

```cmd
npm i react-sublime sublime-components sublime-styles tailwindcss sass sass-loader
```

### Initialize react-sublime
```cmd
npx react-sublime init
```
it will ask you where you want to have your styles
you can enter src/styles for example, and your style config will be there
<br>
this will make a folder with the following schema

```plain
- components
    - component.scss
- fonts
    - font-name
        - font-type.otf
- colors.json
- fonts.json
- screens.json
- sizes.json
```

### Building

```cmd
npx react-sublime build
```
builds output
```cmd
npx react-sublime dev
```
watches and builds

### integrating tailwind css !important

init tailwind, then in config import colors.json and so on

```js
import colors from "./src/styles/colors.json";
import screens from "./src/styles/screens.json";
import sizes from "./src/styles/sizes.json";
import fonts from "./src/styles/fonts.json";

export default {
    //other config ...
  theme: {
    extend: {
      colors,
      screens,
      sizes,
      fontFamily: fonts,
    },
  },
    //other config ...

};

```

### importing stylesheet

after building the following stylesheet will be available, import it in your css or jsx.

```css
import "@sublime/sublime.scss"
```

# components

### react sublime comes with many useful startup components

see the "sublime-components" [repository](https://github.com/Damian-Mostert/sublime-components)

# styles

### react sublime comes with many useful startup components, these startup components have configurable styles


see the "sublime-styles" [repository](https://github.com/Damian-Mostert/sublime-styles)
