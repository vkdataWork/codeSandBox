import {baseAxios as Axios} from '@/Plugins/Axios';
import BaseEntity from '@/Types/Base/BaseEntity';
import IEntity from '@/Types/Base/IEntity';
import { BaseStateType } from '@/Types/BaseStateType';

export const RESET = 'resetState';
export default class BaseModule<TKey, TList extends IEntity<TKey>, T extends BaseEntity<TKey>> {
	private async fetchAll(context: any): Promise<T[]> {
		try {
			const data = (await Axios.get(context.getters['apiPath'])).data;
			const result = data.map((d: any) => new context.getters['listClass'](d));
			context.commit('setAll', result);
			return result;
		} catch (e) {
			console.log(e);
			return [];
		}
	}

  private async fetchAllByEnvironment(
    context: any ): Promise<T[]> {
			const data =(await Axios.get(`${context.getters['apiPath']}/env/1`)).data;
			const result = data.map((d: any) => new context.getters['listClass'](d));
			context.commit('setAll', result);
			return result;
	}

	private async fetchAllNoProjects(context: any): Promise<T[]> {
		
		const data = (await Axios.get(`${context.getters['apiPath']}/env/${context.rootGetters['AccountModule/environment']()}`)).data;
		const result = data.map((d: any) => new context.getters['listClass'](d));
		context.commit('setAll', result);
		return result;
	}

	private async fetchById(context: any, id: TKey): Promise<T> {
		const data = (await Axios.get(`${context.getters['apiPath']}/${id}`)).data;
		const result = new context.getters['class'](data);
		context.commit('setItem', result);
		return result;
	}

	private async update(context: any, item: T): Promise<T> {
		
		const data = (await Axios.put(context.getters['apiPath'], item.toSaveObject())).data;
		const result = new context.getters['class'](data);
		context.commit('setItem', result);
		return result;
	}

	private async delete(context: any, id: TKey): Promise<void> {
		
		await Axios.delete(`${context.getters['apiPath']}/${id}`);
		context.commit('deleteItem', id);
	}

	private async create(context: any, item: T): Promise<T> {
		
		const data = (await Axios.post(context.getters['apiPath'], item.toSaveObject())).data;

		const result = new context.getters['class'](data);
		context.commit('setItem', result);
		return result;
	}

	public static defaultState<TKey, TList extends IEntity<TKey>, T extends BaseEntity<TKey>>(): BaseStateType<TList, T> {
		return {
			items: [],
			item: null,
		} as BaseStateType<TList, T>;
	}

	public get state() {
		return BaseModule.defaultState();
	}

	public get actions() {
		return {
			fetchAll: this.fetchAll,
			fetchItem: this.fetchById,
			fetchAllByEnvironment: this.fetchAllByEnvironment,
			fetchAllNoProjects: this.fetchAllNoProjects,
			create: this.create,
			update: this.update,
			delete: this.delete,
		};
	}

	public get mutations() {
		return {
			setItem(state: BaseStateType<TList, T>, item: T): void {
				state.item = item;
			},

			addItem(state: BaseStateType<TList, T>, item: TList): void {
				let index = state.items.findIndex((x: TList) => x.id === item.id);
				if (index > -1) state.items.splice(index, 1);
				state.items.push(item);
			},

			deleteItem(state: BaseStateType<TList, T>, id: TKey): void {
				state.items.splice(
					state.items.findIndex((x: TList) => x.id === id),
					1,
				);
			},

			setAll(state: BaseStateType<TList, T>, items: TList[]): void {
				state.items.splice(0, state.items.length);
				console.log("dashboards",items)
				//   state.items = items;
				state.items.push(...items);
			},

			[RESET](state: BaseStateType<TList, T>): void {
				Object.assign(state, {
					...state,
					...BaseModule.defaultState(),
				});
			},
		};
	}

	public get getters() {
		return {
			items: (state: BaseStateType<TList, T>) => (): TList[] => state.items,
			item: (state: BaseStateType<TList, T>) => (): T | null => state.item,
			itemById:
				(state: BaseStateType<TList, T>) =>
				(id: TKey): TList | undefined =>
					state.items.find((x: TList) => x.id === id),
		};
	}
}
