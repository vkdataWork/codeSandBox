<template>
    <div class="dx-theme-background-color" style="height: 98dvh">
        <dx-drawer class="content-grid" position="before" style="height: 98dvh">

            <div class="scroll-wrapper" style="height: 98dvh">
                <dx-scroll-view ref="scrollViewRef" class="scrollview">
                    <slot />
                </dx-scroll-view>
            </div>
        </dx-drawer>
    </div>
</template>


<script setup lang="ts">
import DxDrawer from "devextreme-vue/drawer";
import DxScrollView from "devextreme-vue/scroll-view";
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    section: {
        type: String,
        default: "",
    },
    isLarge: {
        type: Boolean,
        default: false,
    },
    isXSmall: {
        type: Boolean,
        default: false,
    },
});

const route = useRoute();
const scrollViewRef = ref(null);

watch(
    () => route.path,
    () => {
        (scrollViewRef.value as any)?.instance.scrollTo(0);
    }
);
</script>

<style scoped>
.side-nav-outer-toolbar {
    flex-direction: column;
    display: flex;
    height: 100%;
    width: 100%;
}

.layout-header {
    z-index: 1501;
}
</style>
