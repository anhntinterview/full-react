// postcss.config.js
module.exports = {
    plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('postcss-nested'),
        require('postcss-custom-properties'),
        require('autoprefixer'),
        require('postcss-preset-env')({ stage: 1 }),
        require('cssnano')
    ]
}