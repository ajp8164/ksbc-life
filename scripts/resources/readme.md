# Project Image Resources

The /assets directory contains a `resources.sketch` file from which all images are exported.

## Requirements

Sketchapp and Homebrew are only available for macOS.

- [Sketchapp](https://www.sketchapp.com/) - application for editing images, includes tools for exporting images to the filesystem
- [Homebrew](http://brew.sh/) - to install `sketchtool`

## Install sketchtool

```sh
sh install.sh
```

## Export images from `resources.sketch`

```sh
sh generate.sh
```

## Commit the changes

Commit the modified `resources.sketch` as well as any modified exported images.
