import { useStore } from 'vuex';
import notify from 'devextreme/ui/notify';
import { useI18n } from 'vue-i18n';

export class ManipulationGridState {
	private routePath: string;
	private value: any;
	private store: any = useStore();
	public storageKey: string = 'dashboards';
	public stateExist: boolean = false;
	public stateNotNull: boolean = false;
	public state: any = {};
	private t = useI18n().t;

	constructor(routePath: string) {
		this.routePath = routePath;
		this.getStorageKey(routePath);
		this.stateExists();
		this.isStateNotNull();
	}

	public toCamelCase(name: string) {
		return name.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
	}

	public getStorageKey(routePath: any): string {
		this.storageKey =
			this.toCamelCase(routePath.split('/')[1]) == 'transfer'
				? this.toCamelCase(routePath.split('/').join('-'))
				: this.toCamelCase(routePath.split('/')[1]) || 'Dashboards';
		return this.storageKey;
	}

	public async stateExists(): Promise<boolean> {
		this.stateExist = this.storageKey
			? await this.store.dispatch('GlobalSettingsModule/stateExist', this.storageKey).catch((e: any) => {
					console.log('error', e);
			  })
			: false;
		return this.stateExist;
	}

	public async isStateNotNull(): Promise<boolean> {
		this.stateNotNull = this.storageKey
			? await this.store.dispatch('GlobalSettingsModule/stateNotNull', this.storageKey).catch((e: any) => {
					console.log('error', e);
			  })
			: false;
		return this.stateNotNull;
	}

	public saveToSessionStorage(value: any): void {
		window.sessionStorage.setItem(this.storageKey, JSON.stringify(value));
	}
	public getFromSessionStorage(): any {
		return JSON.parse(window.sessionStorage.getItem(this.storageKey) || '{}');
	}

	public removeStateSessinStorage(): void {
		window.sessionStorage.removeItem(this.storageKey);
	}

	public async saveStateToAPI(state: any): Promise<void> {
		this.saveToSessionStorage(state);
		await this.stateExists();
		if (!this.stateExist) {
			await this.store
				.dispatch('GlobalSettingsModule/setState', { folder: this.storageKey, state: JSON.stringify(state) })
				.then(() => {
					this.stateExist = true;
				})
				.catch((e: any) => {
					console.log('error while users dispatching', e);
					notify(`${this.t('StateNotSaved')} - ${e.response.data}`, 'error', 6000);
				});
		} else {
			await this.store
				.dispatch('GlobalSettingsModule/setState', { folder: this.storageKey, state: JSON.stringify(state) })
				.then(() => {
					this.stateExist = true;
				})
				.catch((e: any) => {
					console.log('error while users dispatching', e);
					notify(`${this.t('StateNotUpdated')} - ${e.response.data}`, 'error', 6000);
				});
		}
	}

	public async getStateFromAPI(): Promise<any> {
		let state;
		this.storageKey = this.getStorageKey(this.routePath);
		if (this.storageKey !== '' && this.storageKey !== undefined && this.storageKey !== null) {
			await this.store
				.dispatch('GlobalSettingsModule/getState', this.storageKey)
				.then(async () => {
					state = this.store.getters['GlobalSettingsModule/datagridState'] || {};
					this.saveToSessionStorage(state);
					await this.isStateNotNull();
				})
				.catch((e: any) => {
					console.log('error while users dispatching', e);
					state = {};
				});
		}
		return state;
	}

	public async resetState(): Promise<void> {
		this.state = {};
		this.removeStateSessinStorage();
	}

	public async getInitialStateFromAPI(): Promise<void> {
		this.state = {};
		try {
			await this.saveStateToAPI(this.state);
			await this.resetState();
		} catch (error) {
			console.log(error);
		}
	}
}
