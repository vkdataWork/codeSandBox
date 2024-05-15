import { http, graphql, HttpResponse,passthrough } from 'msw';
import { env } from '@/envProvider';
import warehouse from '@/Data/warehouse.json';

export const handlers = [    
  http.get(getUrl('/warehouse/1'), ({request,params}) => {
    return HttpResponse.json(warehouse.list);
  }),

   http.get(getUrl('/warehouse/key/1/DWHstage-test_data_types'), ({request,query,params}) => {
    return HttpResponse.json(warehouse.test_data_types.key);
  }),
   http.get(getUrl('/warehouse/names/1/test_data_types/DWHstage'), ({request,params}) => {
    return HttpResponse.json(warehouse.test_data_types.names);
  }),
   http.get(getUrl('/warehouse/1/test_data_types/DWHstage'), ({request,params}) => {
    return HttpResponse.json(warehouse.test_data_types.datatype);
  }),
     http.get(getUrl('/warehouse/tabledata'), ({request,params}) => {
    return HttpResponse.json(warehouse.test_data_types.tabledata);
  }),
]
function getUrl(append:any):any{
    return `${env('WAREHOUSE_API_URL')}${append}`;
}