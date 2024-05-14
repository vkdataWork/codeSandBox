import { http, graphql, HttpResponse,passthrough } from 'msw';
import { env } from '@/envProvider';
import warehouse from '@/Data/warehouse.json';

export const handlers = [    
  http.get(getUrl('/warehouse/1'), ({request}) => {
    return HttpResponse.json(warehouse.list);
  }),

   http.get(getUrl('/warehouse/key/1/DWHstage-test_data_types'), ({request}) => {
    return HttpResponse.json(warehouse.test_data_types.key);
  }),
   http.get(getUrl('/warehouse/names/1/test_data_types/DWHstage'), ({request}) => {
    return HttpResponse.json(warehouse.test_data_types.names);
  }),
   http.get(getUrl('/warehouse/1/test_data_types/DWHstage'), ({request}) => {
    return HttpResponse.json(warehouse.test_data_types.datatype);
  }),
     http.get(getUrl('/warehouse/tabledata?skip=0&take=25&requireTotalCount=true&_=1715687773526'), ({request}) => {
    return HttpResponse.json(warehouse.test_data_types.tabledata);
  }),

     http.get('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAH4SURBVFhH5ZehUsNAEIa3YYYHKA4EDsHAkyCoRHUQTBEUwQyPgQMElRgqW8GTwCBQIMCVB2Bojv+/bEMuuYa0vRTBZ5Lb3O3+ub3cbeTf09DrTBzHsrEqsoXbtcQio0+R55tI3rRdmcoCTmPZNiIdDGhh1KaaXYy8os8AfXqXkTyptZRfBZzEsh6JXMDxQaNRTbAxYtCxH4ucX0fyrmYvpQ67sezhcovAzcQyGxDygUv7KpL7xFIEL+ena+QQ6obzBiccSx/0paYC3hngm3Mgnq6oaTGMjJHCfd9MFAQw5zA+LPLmPpgOiNjNr4lCCrjgQgcn9Enf2kxxZkA/tUd09qZmUfTr2Ml+os4MIHinruCEvhlDmxZHACK39LY28jFSAWfYXvHUv8OFBDG4lWvrR8BXsrcvBT1HLNkUTA6WZZDGctbAssA6wFpMyAoY6bV2EJ1nhCUVwPNcb2snGysVYIsJnOfarA/EyBYuzhrA1Az0tjbyMRwBWBw9bpfaDI5uxT1tWhwB3KPRoa/N4NB3vlRzBBCWUVrJBIU+6VubKQUBel63kYhxYglA4qvtqw8LAggrFyTrKIgIVkPwNa0uRFqm86dFKbEzgTIKb3E3y9dh+3IMxpYFJ6UzkKXij8kL+gzRJ9yPiY/JrxkGNxGQPub+NfvviHwDBfOhsaypzfYAAAAASUVORK5CYII=', ({request}) => {
    return HttpResponse.json(warehouse.test_data_types.image);
  }),
]

function getUrl(append:any):any{
    return `${env('WAREHOUSE_API_URL')}${append}`;
}