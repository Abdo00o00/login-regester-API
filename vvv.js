const signup = async () => {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'Moe',
        lastName: 'Smith',
        email: 'moe@example.com',
        age: 25,
        password: '12345'
      })
    });
  
    const data = await response.json();
    console.log(data);
  };
  
  signup();