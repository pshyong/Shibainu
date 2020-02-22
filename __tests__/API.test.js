const request = require('supertest');
const app = require('../app');

// ? Please take a look at
// ? https://jestjs.io/docs/en/getting-started
// ? https://github.com/visionmedia/supertest


// ! Note: This is for testing purposes, to remove after merge and with correct api
describe('A testing endpoint', () => {
  it('Should get a page back', async () => {
    const res = await request(app)
    .get('/api/v1/pages/page')
    .send()
    expect(res.statusCode).toEqual(200)
  })
})