import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,ts}'],
    extends: [
      tseslint.configs.recommended,
      stylistic.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    name: 'app/custom-rules',
    files: ['**/*.{js,ts}'], // 可以指定文件，或者全局
    rules: {
      /* TypeScript */
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/typedef': [
        'error',
        {
          arrayDestructuring: false, // 数组解构强制类型注解
          arrowParameter: true, // 箭头函数参数不强制类型注解
          memberVariableDeclaration: true, // 类属性强制类型注解
          objectDestructuring: false, // 对象解构强制类型注解
          parameter: true, // 函数参数强制类型注解
          propertyDeclaration: true, // 类属性强制类型注解
          variableDeclaration: true, // 变量声明强制类型注解
          variableDeclarationIgnoreFunction: true, // 函数声明变量不强制类型注解
        },
      ],

      /* Stylistic */
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        },
      ],
      '@stylistic/brace-style': ['error', '1tbs'],
    },
  },
]);
