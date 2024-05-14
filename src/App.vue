<template>
	<div :class="cssClasses" class="mainComponent">
		<component :is="$route.meta.layout" :is-x-small="screenInfo.isXSmall" :is-large="screenInfo.isLarge"
			:is-small="screenInfo.isSmall" :is-medium="screenInfo.isMedium" >
			<router-view />
		</component>
	</div>
</template>

<script setup lang="ts">
import { screenInfo } from '@/Utils/MediaQuery';
import { onBeforeUnmount, onMounted, ref, watch, computed, onUnmounted } from 'vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useStore } from 'vuex';

let cssClasses = ref(['app'].concat(screenInfo.value.cssClasses));
const store = useStore();
</script>

<style lang="scss"></style>
