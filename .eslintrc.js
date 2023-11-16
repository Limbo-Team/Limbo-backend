module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        node: true,
        browser: true,
        es6: true,
    },
    parserOptions: {
        requireConfigFile: false,
        babelOptions: {
            babelrc: false,
            configFile: false,
        },
    },
    root: true,
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                useTabs: false,
                tabWidth: 4,
                printWidth: 120,
                singleQuote: true,
                trailingComma: 'all',
                arrowParens: 'always',
            },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'max-len': ['error', { code: 160 }],
    },
};
