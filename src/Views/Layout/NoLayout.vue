<template>
    <div class="dx-theme-background-color" style="height: 99dvh">
        <dx-drawer class="content-grid" position="before" style="height: 98dvh">

            <div class="scroll-wrapper" style="height: 98dvh"> <dx-select-box :items="items" displayExpr="theme"
                    valueExpr="theme" :onSelectionChanged="onSelectionChanged" :value="currentTheme()" />
                <dx-scroll-view ref="scrollViewRef" class="scrollview" :key="count">

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
import DxSelectBox from "devextreme-vue/cjs/select-box";
import { refreshTheme, currentTheme } from 'devextreme/viz/themes';
import themes from "devextreme/ui/themes";

const items = [
    { theme: "material.blue.light" },
    { theme: "material.blue.dark" },
    { theme: "material.teal.light" },
    { theme: "material.teal.dark" },
    { theme: "material.lime.light" },
    { theme: "material.lime.dark" },
    { theme: "material.purple.light" },
    { theme: "material.purple.dark" },
    { theme: "material.orange.light" },
    { theme: "material.orange.dark" },
    { theme: "material.blue.light.compact" },
    { theme: "material.blue.dark.compact" },
    { theme: "material.teal.light.compact" },
    { theme: "material.teal.dark.compact" },
    { theme: "material.orange.light.compact" },
    { theme: "material.orange.dark.compact" },
    { theme: "material.purple.light.compact" },
    { theme: "material.purple.dark.compact" },
    { theme: "material.lime.light.compact" },
    { theme: "material.lime.dark.compact" }
]

const route = useRoute();
const scrollViewRef = ref(null);
const count = ref(0);
watch(
    () => route.path,
    () => {
        (scrollViewRef.value as any)?.instance.scrollTo(0);
    }
);

const onSelectionChanged = (data: any) => {
    applyTheme(data.selectedItem.theme);
}

const applyTheme = (theme: any | undefined) => {
    themes.current(theme);
    refreshTheme();
    count.value++;
}
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
