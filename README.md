# gulp-workflow-boilerplate

An opinionated boilerplate with common frontend tasks to start a new project with Gulp.js.
This is a work in progress! Feel free to contribute.

## Install
### Requirements

Node (use brew or install it from [here](http://nodejs.org/download/))

```bash
brew install node
```

Gulp ([Getting started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started))

```bash
npm install -g gulpjs/gulp-cli#4.0
```

### Clone this repository

*OSX & Linux*

```bash
git clone --depth 1 https://github.com/matthiasott/gulp-workflow-boilerplate.git && cd gulp-workflow-boilerplate && rm -rf .git
```

*Windows*

```bash
git clone --depth 1 https://github.com/matthiasott/gulp-workflow-boilerplate.git && cd gulp-workflow-boilerplate && rd /s /q .git
```

### Start a new project
clone the repository, adjust package.json to your needs and install all dependendies with

```bash
npm install
```

### Start Browsersync

You can use Browsersync to start a server that automatically updates all browsers as you change HTML, CSS, images etc.

```bash
browser-sync start --server
```

Browsersync is also part of the default watch task:

```bash
gulp watch
```

## Features

* gulp-sass
* gulp-concat
* gulp-sourcemaps
* gulp-uglify
* gulp-autoprefixer
* gulp-clean-css
* gulp-rev
* gulp-sequence
* gulp-clean
* gulp-rename
* gulp-rev-replace

*More documentation will follow soon! ;)*

## Changelog

### 0.1.0
- First basic version. Still a lot of cleanup to do. Please use with caution!

## Roadmap
- Include a workflow for SVG

## License 

Code released under [the MIT license](https://github.com/matthiasott/a11y-accordion-tabs/LICENSE).

## Author

Matthias Ott   
<mail@matthiasott.com>  
<https://matthiasott.com>  
<https://twitter.com/m_ott>

Copyright (c) 2017 [Matthias Ott](https://matthiasott.com)

