import { handlers as userHandlers } from './userHandlers';
import {handlers as warehouseHandlers} from './warehouseHandlers';
import {handlers as dashboardHandlers} from './dashboardHandlers';
import {handlers as graphQLhandlers} from './graphQLhandlers';

export const handlers = [...userHandlers,...warehouseHandlers,...dashboardHandlers]