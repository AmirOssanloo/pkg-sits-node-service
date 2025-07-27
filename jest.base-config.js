/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  maxWorkers: 2,
  moduleNameMapper: {
    // remove .js from the path
    '^(.{1,2}/.*)\\.js$': '$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}
