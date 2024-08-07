import globals from 'globals';
import pluginJs from '@eslint/js';


export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'indent': ['warn', 2],
      'eqeqeq': ['warn', 'smart'],
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single']
    }
  }
];