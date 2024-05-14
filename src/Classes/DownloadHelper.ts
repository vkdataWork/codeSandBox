import {AxiosResponse} from "axios";

export default function downloadLink(link: string): void {
    window.location.assign(link);
};

export function downloadFromAxios(response: AxiosResponse): void {
    try{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1].split(';')[0]);
        document.body.appendChild(link);
        link.click();
    } catch (e) {
        console.error(e);
    }
}