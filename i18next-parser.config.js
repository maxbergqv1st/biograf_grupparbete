export default {
  locales: ['en', 'sv'],
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  input: 'src/**/*.{tsx,ts,jsx,js}',
  defaultNamespace: 'common',
  namespaceSeparator: ':',
  keySeparator: '.',
  createOldCatalogs: false,
  keepRemoved: true,
};
