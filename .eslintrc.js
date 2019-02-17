module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true,
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": false,
            "generators": true,
            "modules": true,
            "objectLiteralDuplicateProperties": true
        }
    },
    "extends": "airbnb-base",
    "rules": {
        "no-underscore-dangle": 0,
        "import/extensions": 0,
        "import/no-unresolved": 0,
        "import/prefer-default-export": 1,
        "no-restricted-syntax": 0,
        "guard-for-in": 1,
        "no-bitwise": 0,
        "no-continue": 0,
        "prefer-destructuring": 0,
        "no-restricted-globals": 0,
        "no-mixed-operators": 0,
    },
};