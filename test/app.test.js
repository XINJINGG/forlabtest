const request = require('supertest');
const express = require('express');
const app = require('../index'); // Your Express app export

describe('GET /', function() {
  it('responds with 200 and renders index', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .expect(/<form/)  // Check form is present in the response
      .end(done);
  });
});

describe('POST /search', function() {
  it('rejects XSS input', function(done) {
    request(app)
      .post('/search')
      .send({ q: '<script>alert(1)</script>' })
      .expect(200)
      .expect(/Invalid input detected/) // error message rendered
      .end(done);
  });

  it('accepts safe input', function(done) {
    request(app)
      .post('/search')
      .type('form') 
      .send({ q: 'hello' })
      .expect(200)
      .expect(/hello/) // sanitized term rendered
      .end(done);
  });
});
