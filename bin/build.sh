#!/bin/bash

npx html-minifier-terser --input-dir src \
    --output-dir dist \
    --file-ext html \
    --collapse-whitespace \
    --remove-comments \
    --remove-redundant-attributes \
    --remove-script-type-attributes \
    --remove-tag-whitespace \
    --use-short-doctype

npx csso src/css/main.css --output dist/css/main.css
npx csso src/css/noscript.css --output dist/css/noscript.css

npx uglifyjs src/js/util.js --compress -o dist/js/util.js
npx uglifyjs src/js/ui.js --compress -o dist/js/ui.js
