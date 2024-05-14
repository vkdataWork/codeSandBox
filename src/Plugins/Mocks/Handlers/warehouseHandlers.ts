import { http, graphql, HttpResponse,passthrough } from 'msw';
import { env } from '@/envProvider';
import warehouse from '@/Data/warehouse.json';

export const handlers = [    
  http.get(getUrl('/warehouse/1'), ({request}) => {
    return HttpResponse.json(warehouse.list);
  }),
   http.get(getUrl('/warehouse/key/1/CSV_etl-csv_test_multiple'), ({request}) => {
    return HttpResponse.json(warehouse.csv_test_multiple.key);
  }),
   http.get(getUrl('/warehouse/names/1/csv_test_multiple/CSV_etl'), ({request}) => {
    return HttpResponse.json(warehouse.csv_test_multiple.names);
  }),
   http.get(getUrl('/warehouse/1/csv_test_multiple/CSV_etl'), ({request}) => {
    return HttpResponse.json(warehouse.csv_test_multiple.datatype);
  }),
     http.get(getUrl('/warehouse/tabledata?skip=0&take=25&requireTotalCount=true&_=1715583146920'), ({request}) => {
    return HttpResponse.json(warehouse.csv_test_multiple.tabledata);
  }),
]

function getUrl(append:any):any{
    return `${env('WAREHOUSE_API_URL')}${append}`;
}