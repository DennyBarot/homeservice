import fetch from 'node-fetch';

const testSignup = async () => {
  const response = await fetch('http://localhost:5000/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      city: 'Ahemdabad',
      role: 'user',
      category: '',
     
    }),
  });

  const data = await response.json();
  console.log('Response:', data);
};

testSignup();
