// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

const server = setupServer(...handlers);
console.log('from server.ts')
export { server };

server.events.on('request:start', ({ request,requestId }) => {
    console.log('MSW intercepted:', request.method, request.url,requestId)
  })

