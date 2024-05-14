import { setupServer } from 'msw/node'
import { handlers } from './Handlers/graphQLhandlers'

 export const server = setupServer(...handlers)
 beforeAll(() => {
  // Start the interception.
  server.listen({
    onUnhandledRequest(request) {
    console.log('Unhandled %s %s', request.method, request.url)
  },
  
  })
})
 
afterEach(() => {
  // Remove any handlers you may have added
  // in individual tests (runtime handlers).
  server.resetHandlers()
})
 
afterAll(() => {
  // Disable request interception and clean up.
  server.close()
})