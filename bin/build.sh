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

npx csso src/assets/css/main.css --output dist/assets/css/main.css
npx csso src/assets/css/noscript.css --output dist/assets/css/noscript.css

npx uglifyjs src/assets/js/main.js --compress -o dist/assets/js/main.js
npx uglifyjs src/assets/js/util.js --compress -o dist/assets/js/util.js
npx uglifyjs src/assets/js/ui.js --compress -o dist/assets/js/ui.js
