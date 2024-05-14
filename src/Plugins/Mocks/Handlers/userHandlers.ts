import { http, graphql, HttpResponse,passthrough } from 'msw'
import { env } from '@/envProvider';

export const handlers = [
    
  http.get(`${env('WAREHOUSE_API_URL')}/user`, ({request}) => {
    console.log("request",request);
    return HttpResponse.json({
      firstName: 'John',
      lastName: 'Programmer',
    })
  }),
]