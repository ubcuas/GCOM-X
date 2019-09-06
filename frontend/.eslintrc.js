const path = require('path');

module.exports = {
    "extends": "airbnb",
    "rules": {
        "jsx-a11y/": 0,
        "react/jsx-filename-extension": 0,
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "brace-style": ["error", "allman"],
        "curly": ["error", "multi-or-nest"],
        "camelcase": 0,
    },
    "env": {
        "es6": true,
        "browser": true,
        "jest": true,
        "jquery": true
    },
    "settings": {
        "import/resolver": {
            "webpack": {
                "config": path.join(__dirname, '/webpack.local.config.js'),
                "config-index": 1
            }
        }
    }
}
