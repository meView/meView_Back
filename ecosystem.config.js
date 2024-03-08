module.exports = [
  {
    script: 'dist/main.js',
    name: 'meview-app',
    exec_mode: 'cluster',
    instances: 2,
  },
];
