
const BASE = 'http://localhost:3000';

async function call(method, path, body) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) options.body = JSON.stringify(body);
  const res = await fetch(BASE + path, options);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch (e) { data = text; }
  console.log(`${method} ${path} -> ${res.status}`);
  console.log(data);
  console.log('');
  return { status: res.status, data };
}

async function main() {
  console.log('=== USERS: create, read, update, delete ===');
  const user = await call('POST', '/users', { name: 'Alice', email: 'alice@example.com' });
  await call('GET', '/users');
  if (user.status === 201) {
    await call('PUT', `/users/${user.data.id}`, { name: 'Alice Updated' });
    await call('DELETE', `/users/${user.data.id}`);
  }

  console.log('=== TASKS: create, read, update, delete ===');
  const task = await call('POST', '/tasks', { title: 'Buy milk' });
  await call('GET', '/tasks');
  if (task.status === 201) {
    await call('PUT', `/tasks/${task.data.id}`, { completed: true });
    await call('DELETE', `/tasks/${task.data.id}`);
  }

  console.log('=== ERROR CASES ===');
  await call('POST', '/tasks', {});        
  await call('DELETE', '/tasks/999');      
  await call('GET', '/tassks');           
}

main().catch(err => {
  console.error('Could not reach the API Gateway. Is "npm start" running?');
  console.error(err.message);
});