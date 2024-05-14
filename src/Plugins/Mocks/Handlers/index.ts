import {handlers as warehouseHandlers} from './warehouseHandlers';
import {handlers as dashboardHandlers} from './dashboardHandlers';

export const handlers = [...warehouseHandlers,...dashboardHandlers]