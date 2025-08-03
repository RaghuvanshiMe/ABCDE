const http = require('http');

function testLogin() {
  const data = JSON.stringify({
    username: 'testuser2',
    password: 'password123'
  });

  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/users/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Login response:', responseData);
    });
  });

  req.on('error', (error) => {
    console.error('Login error:', error.message);
  });

  req.write(data);
  req.end();
}

testLogin();
