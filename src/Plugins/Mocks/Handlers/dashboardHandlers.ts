import { http, graphql, HttpResponse,passthrough } from 'msw';
import dashboard from '@/Data/dashboard.json';
import { env } from '@/envProvider';

export const handlers = [
    
  http.get(getUrl('/dashboards/env/1'), ({request}) => {
    return HttpResponse.json(dashboard.list);
  }),
      http.get(getUrl('/dashboards/1'), ({request}) => {console.log("request",request);
    return HttpResponse.json(dashboard.test_datovych_zdroju.dashboards);
  }),
    http.get(getUrl('/api/dashboard/dashboards/1'), ({request}) => {
    return HttpResponse.json(dashboard.test_datovych_zdroju.dashboard);
  }),
    http.get(getUrl('/api/dashboard/data/DashboardItemGetAction?dashboardId=1&itemId=gridDashboardItem1&query=%7B%22LimitVisibleData%22%3Atrue%7D'), ({request}) => {
    return HttpResponse.json(dashboard.test_datovych_zdroju.gridItem1)
  }),
    http.get(getUrl('/api/dashboard/data/DashboardItemGetAction?dashboardId=1&itemId=gridDashboardItem2&query=%7B%22LimitVisibleData%22%3Atrue%7D'), ({request}) => {
    return HttpResponse.json(dashboard.test_datovy_zdroju.gridItem2)
  }),
    http.get(getUrl('api/dashboard/data/DashboardItemGetAction?dashboardId=1&itemId=gridDashboardItem3&query=%7B%22LimitVisibleData%22%3Atrue%7D'), ({request}) => {
    return HttpResponse.json(dashboard.test_datovy_zdroju.gridItem3)
  }),
    http.get(getUrl('/api/dashboard/data/DashboardItemGetAction?dashboardId=1&itemId=gridDashboardItem4&query=%7B%22LimitVisibleData%22%3Atrue%7D'), ({request}) => {
    return HttpResponse.json(dashboard.test_datovy_zdroju.gridItem4)
  }),
    http.post(getUrl('/api/dashboard/data/PerformExportAction'), ({request}) => {
    return getUrl(dashboard.test_datovych_zdroju.image);
  }),
      http.post(getUrl('/api/dashboard/data/PerformExportAction'), ({request}) => {
    return getUrl(dashboard.test_datovych_zdroju.image);
  }),
      http.post(getUrl('/api/dashboard/data/PerformExportAction'), ({request}) => {
    return getUrl(dashboard.test_datovych_zdroju.image);
  }),
]

function getUrl(append:any):any{
    return `${env('WAREHOUSE_API_URL')}${append}`;
}