import { useRouter } from 'vue-router';
//import { useI18n } from "vue-i18n";
import DialogFactory from '@/Classes/DialogueFactory';
import { RouteNames } from "@/Plugins/Router/RouteNames";
import { useStore } from 'vuex';

export async function openProjectsPage(router: any, bulk: boolean, name: string, id: string, data: never[]) {
  //  const { t } = useI18n();
 //   const router = useRouter();
    const store = useStore();

    console.log('router', router);
    console.log('store', store);

    let ids: string = '';

    if (bulk === true) {
        if (data === null || data.length === 0) {
            DialogFactory.CreateAlertDialogue('Musite vybrat nejakou transformaci!', 'Error').show();
            return;
        }
        else {
            ids = data.join(";");
        }
    }

    await router.push({
        name: RouteNames.BulkSetProjects,
        query: {
            env: store.getters['AccountModule/environment'](),
            prj: store.getters['AccountModule/projectIds']()
        },
        params: {
            name: name,
            ids: data,
            id: id
        },
    });

}