import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

export function getUrl(path: any) {
  const router = useRouter();
  const store = useStore();
  const route = useRoute();
  let url;
  try {
    url = router.resolve({
      name: path,
      query: {
        env: store.getters['AccountModule/environment'](),
        prj: store.getters['AccountModule/projectIds'](),
      },
    }).fullPath;
  } catch {}
  const message = path + 'notExistsInRoutes';
  if (url) return url;
  else return message;
}
