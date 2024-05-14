export type NavigationItemType = {
    text: string;
    path: string;
    hidden?:boolean;
    icon?:string;
   items?: {
        text: string;
        url?: string;
        icon?:string;
        path?:string;
        route: {
            name:RouteType
        }

    }[];
}
type RouteType = string | {name: string, params?: Object};