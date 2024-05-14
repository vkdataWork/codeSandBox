
const customDirective = {
	created(el, binding, vnode, prevVnode) {
		console.log('Custom directive created');
		console.log('Element:', el);
		console.log('Binding:', binding);
		console.log('VNode:', vnode);
		console.log('Previous VNode:', prevVnode);
	},
	beforeMount(el, binding, vnode, prevVnode) {
		console.log('Custom directive beforeMount');
		console.log('Element:', el);
		console.log('Binding:', binding);
		console.log('VNode:', vnode);
		console.log('Previous VNode:', prevVnode);
	},
	mounted(el, binding, vnode, prevVnode) {
		console.log('Custom directive mounted');
		console.log('Element:', el);
		console.log('Binding:', binding);
		console.log('VNode:', vnode);
		console.log('Previous VNode:', prevVnode);
	},
	beforeUpdate(el, binding, vnode, prevVnode) {
		console.log('Custom directive beforeUpdate');
		console.log('Element:', el);
		console.log('Binding:', binding);
		console.log('VNode:', vnode);
		console.log('Previous VNode:', prevVnode);
	},
	updated(el, binding, vnode, prevVnode) {
		console.log('Custom directive updated');
		console.log('Element:', el);
		console.log('Binding:', binding);
		console.log('VNode:', vnode);
		console.log('Previous VNode:', prevVnode);
	},
	beforeUnmount(el, binding, vnode, prevVnode) {
		console.log('Custom directive beforeUnmount');
		console.log('Element:', el);
		console.log('Binding:', binding);
		console.log('VNode:', vnode);
		console.log('Previous VNode:', prevVnode);
	},
	unmounted(el, binding, vnode, prevVnode) {
		console.log('Custom directive unmounted');
		console.log('Element:', el);
		console.log('Binding:', binding);
		console.log('VNode:', vnode);
		console.log('Previous VNode:', prevVnode);
	},
};

export default customDirective;
