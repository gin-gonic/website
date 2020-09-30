#amazing project
[![Build Status](https://travis-ci.org/gin-gonic/website.svg?branch=master)](https://travis-ci.org/gin-gonic/website)

# Gin website

Welcome! This repository houses all of the assets required to build the Gin website and documentation. We're very pleased that you want to contribute! The website are hosted at https://gin-gonic.com.

We use [Hugo](https://gohugo.io/) to format and generate our website, the [Docsy](https://github.com/google/docsy) theme for styling and site structure. Thanks!

## Contributing

- Fork the repository

You can click the Fork button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a fork.

> You need to use the below command to clone code for downloading all submodules.

```
git clone --recursive https://github.com/YOURUSERNAME/website.git
```

- Create one pull request

Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

- Merge the pull request

Once your pull request is created, a Gin reviewer will take responsibility for providing clear, actionable feedback, re-improve and merge.

## Running

See the [official Hugo documentation](https://gohugo.io/getting-started/installing/) for Hugo installation instructions.

To run the site locally when you have Hugo installed:

```sh
# Update docsy theme to the latest master branch
$ git submodule foreach git pull origin master
# If use `hugo` command, you need to use `npm install` command
$ npm install
$ hugo
# Or use `hugo server`, it not need `npm install` command
$ hugo server
```

This will start the local Hugo server on port 1313. Open up your browser to http://localhost:1313 to view the site. As you make changes to the source files, Hugo updates the site and forces a browser refresh.

## Thanks

Gin thrives on community participation, and we really appreciate your contributions to our site and our documentation!

