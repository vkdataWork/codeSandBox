import axios, {AxiosError, AxiosResponse} from 'axios';
import store from "@/Plugins/Store";
import Axios from '@/Plugins/Axios';

const baseAxios = axios;

const apiAxios = axios.create({
  mode: 'no-cors' });
apiAxios.interceptors.request.use((request) => {
    console.log("request",request);
    return request;
});
apiAxios.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);
export default baseAxios;
export {
    apiAxios,baseAxios   
};
