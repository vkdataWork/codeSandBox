import store from "@/Plugins/Store";

export function getSystemVariables(): object {
    const result = {};
    const environment = store.getters['AccountModule/environment']();

    if (environment) {
        result['environmentId'] = environment;

        switch (environment) {
            case 1:
                result['environment'] ='production';
                break;
            case 2:
                result['environment'] ='development';
                break;
            case 3:
                result['environment'] ='test';
                break;
        }
    }

    const projectIds = store.getters['AccountModule/projectIds']();
    if (projectIds && Array.isArray(projectIds) && projectIds.length > 0) {
        result['projectIds'] = projectIds;
        result['projects'] = projectIds.join(',');
    } else {
        result['projectIds'] = [];
        result['projects'] = null;
    }

    return result;
}