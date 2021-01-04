let mix = require('laravel-mix');
mix.js('ressources/js/app.js', 'public/js/app.js').sass('ressources/scss/app.scss', 'public/css/app.css');
mix.babelConfig({
    "plugins" : ["@babel/plugin-proposal-class-properties"]
});