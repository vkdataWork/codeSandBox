import { useRoute } from 'vue-router';

export function isCreatePage() {
    const route = useRoute();
    return route?.path?.split('/').pop() === 'create';
}