import { CustomItemExportInfo, CustomItemViewer, DashboardControl } from 'devexpress-dashboard/common';
import { ICustomItemMetaData } from 'devexpress-dashboard/model/items/custom-item/meta';
import dxTreeList, { Properties } from 'devextreme/ui/tree_list';
import DataSource from 'devextreme/data/data_source';
import * as Model from 'devexpress-dashboard/model';
import DxTreeList from 'devextreme-vue/tree-list';
import dxDashboardControl from 'devexpress-dashboard/integration';
import CustomStore from 'devextreme/data/custom_store';
import domtoimage from 'dom-to-image-more';
// docu: https://github.com/DevExpress-Examples/asp-net-core-dashboard-custom-item-gallery
const TREE_LIST_EXTENSION_NAME = 'CustomTreeList';
const svgIcon =
	`<?xml version="1.0" encoding="utf-8"?>
	<svg version="1.1" id="` +
	TREE_LIST_EXTENSION_NAME +
	`" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
		<polygon class="dx-dashboard-contrast-icon" points="12,13 12,11 8,11 8,8 6,8 6,21 12,21 12,19 8,19 8,13 "/>
		<path class="dx-dashboard-accent-icon" d="M10,7H4C3.5,7,3,6.6,3,6V2c0-0.5,0.5-1,1-1h6c0.6,0,1,0.5,1,1v4C11,6.6,10.6,7,10,7z
			M21,14v-4c0-0.6-0.5-1-1-1h-6c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1h6C20.5,15,21,14.6,21,14z M21,22v-4c0-0.5-0.5-1-1-1h-6
			c-0.6,0-1,0.5-1,1v4c0,0.5,0.4,1,1,1h6C20.5,23,21,22.5,21,22z"/>
	</svg>`;
const treeListMetadata: ICustomItemMetaData = {
	bindings: [
		{
			propertyName: 'idBinding',
			dataItemType: 'Dimension',
			array: false,
			displayName: 'ID',
			emptyPlaceholder: 'Add Dimension',
			selectedPlaceholder: 'Configure Dimension',
			enableInteractivity: false,
		},
		{
			propertyName: 'parentIdBinding',
			dataItemType: 'Dimension',
			array: false,
			displayName: 'Parent ID',
			emptyPlaceholder: 'Add Dimension',
			selectedPlaceholder: 'Configure Dimension',
		},
		{
			propertyName: 'dimensionsBinding',
			dataItemType: 'Dimension',
			array: true,
			displayName: 'Dimensions',
			emptyPlaceholder: 'Add Dimension',
			selectedPlaceholder: 'Configure Dimension',
		},
	],
	optionsPanelSections: [
		{
			title: 'Custom Options',
			items: [],
		},
	],
	interactivity: {
		filter: true,
		drillDown: true,
	},
	icon: TREE_LIST_EXTENSION_NAME,
	title: 'Tree List',
};
export class TreeListItemExtension {
	name = TREE_LIST_EXTENSION_NAME;
	metaData = treeListMetadata;
	dashboardControl: dxDashboardControl;
	constructor(dashboardControl: DashboardControl) {
		this.dashboardControl = dashboardControl;
		this.dashboardControl.registerIcon(svgIcon);
		this.name = TREE_LIST_EXTENSION_NAME;
		this.metaData = treeListMetadata;
	}
	public createViewerItem = (model: any, element: DxTreeList, content: any) => {
		return new TreeListViewer(model, element, content, this.dashboardControl);
	};
}
class TreeListViewer extends CustomItemViewer {
	private dxTreeListWidget?: dxTreeList;
	private dashboardControl: dxDashboardControl;
	private data: any;
	private exportingImage: any;
	constructor(model: any, container: any, options: any, dashboardControl: dxDashboardControl) {
		super(model, container, options);
		this.dashboardControl = dashboardControl;
		this.exportingImage = new Image();
		this.data = new DataSource({
			store: new CustomStore({
				load: async (loadOptions: any) => {
					let data = Array.from(this.getDataSource());
					return data;
				},
				update: async (key: any, values: any) => {},
			}),
		});
	}

	destory() {
		this.dxTreeListWidget?.dispose();
	}

	allowExportSingleItem() {
		return true;
	}

	getColumns() {
		let columns: any[] = [];
		let valueBindings = this.getBindingValue('dimensionsBinding');
		for (var i = 0; i < valueBindings.length; i++) {
			columns.push({
				dataField: valueBindings[i].displayName(),
				caption: valueBindings[i].displayName(),
			});
		}
		return columns;
	}
	getDataSource() {
		let items: any[] = [];
		let bindings = this.getBindingValue('dimensionsBinding');
		this.iterateData(function (dataRow) {
			var dataItem = {
				ID: dataRow.getDisplayText('idBinding')[0],
				ParentID:
					dataRow.getDisplayText('parentIdBinding')[0] !== '-1' && dataRow.getDisplayText('parentIdBinding')[0] !== ' '
						? dataRow.getDisplayText('parentIdBinding')[0]
						: null,
			};
			var clientData = dataRow.getValue('dimensionsBinding');
			for (var i = 0; i < bindings.length; i++) {
				dataItem[bindings[i].displayName()] = clientData[i];
			}
			items.push(dataItem);
		});
		return items;
	}

	getExportInfo() {
		return { image: this.exportingImage };
	}

	async _getImageData(): Promise<any> {
		try {
			const container = document.querySelector('.dx-dashboard-item') as HTMLElement;
			let imageFromDom = await domtoimage
				.toPng(container, { bgcolor: '#FFFFFF' })
				.then((dataUrl: any) => {
					return dataUrl;
				})
				.catch((e: any) => console.log(e));
			this.exportingImage = imageFromDom.replace('data:image/png;base64,', '');
		} catch (error) {
			throw new Error('Error generating image data URL');
		}
	}

	override async renderContent(element: any, changeExisting: boolean) {
		//const isDesignerMode = this.dashboardControl.isDesignMode();
		//const hiddenMeasure = document.querySelectorAll('.dx-dashboard-section')[5] as HTMLElement;
		//const hiddenDimension = document.querySelectorAll('.dx-dashboard-section')[4] as HTMLElement;
		this.canDrillDown = () => true;
		this.canMasterFilter = () => true;
		this.drillDown = (row: any) => {
			return true;
		};
		/*if (isDesignerMode) {
			hiddenMeasure != null ? (hiddenMeasure.style.display = 'none') : '';
			hiddenDimension != null ? (hiddenDimension.style.display = 'none') : '';
		}*/
		let treeListOptions: Properties = {
			dataSource: this.data,
			rootValue: '0',
			keyExpr: 'ID',
			parentIdExpr: 'ParentID',
			columns: this.getColumns(),
			showRowLines: true,
			showBorders: true,
			showColumnLines: true,
			showColumnHeaders: true,
			columnAutoWidth: true,
			allowColumnResizing: true,
			autoNavigateToFocusedRow: true,
			renderAsync: true,
			repaintChangesOnly: true,
			twoWayBindingEnabled: true,
			loadPanel: {
				enabled: false,
				text: 'Loading...',
			},
			scrolling: {
				columnRenderingMode: 'virtual',
				mode: 'virtual',
				useNative: 'auto',
				scrollByContent: true,
				scrollByThumb: true,
				showScrollbar: 'always',
			},
			onContentReady: async (e: any) => {
				this.updateTreeListSelection();
			},
			onSelectionChanged: (e: any) => {
				this.setSelection(e.selectedRowKeys);
			},
			onRowClick: (e: any) => {
				this.setSelection([e.key]);
			},
			onRowPrepared: (e: any) => {
				if (this.isSelected(e.data)) {
					e.rowElement.style.backgroundColor = 'lightblue';
				}
			},
			onRowCollapsed: async (e: any) => {
				this.setMasterFilterRecursive(e.node);
			},
			onRowExpanded: async (e: any) => {
				this.setMasterFilterRecursive(e.node);
			},
			wordWrapEnabled: true,
			height: '99%',
			width: '99%',
		};

		treeListOptions.columns?.forEach((element: any) => {
			element.cellTemplate = (container: any, options: any) => {
				if (options.value != undefined && options.value.length > 200) {
					const img = new Image();

					img.onload = function () {
						container.innerHTML = `<img src="${img.src}" style="width: 20px; height: 20px;"/>`;
					};

					img.onerror = function () {
						container.innerHTML = `<div style="width: 20px; height: 20px;"></div>`;
					};

					img.src = `data:image/png;base64,${options.value}`;
				} else if (options.value != undefined && options.value.length <= 200) {
					container.innerHTML = options.value;
				}
			};
		});
		if (!changeExisting) {
			while (element.firstChild) element.removeChild(element.firstChild);
			let div = document.createElement('treeList');
			element.appendChild(div);
			this.dxTreeListWidget = new dxTreeList(div, treeListOptions);
		} else {
			this.dxTreeListWidget?.option(treeListOptions);
			this.dxTreeListWidget?.repaint();
		}
	}
	override clearSelection(): void {
		super.clearSelection();
		this.updateTreeListSelection();
	}
	override setSelection(values: Array<Array<any>>): void {
		super.setSelection(values);
		this.updateTreeListSelection();
	}
	updateTreeListSelection() {
		if (this.dxTreeListWidget) {
			this.dxTreeListWidget.clearSelection();
			let nodes: any = this.dxTreeListWidget.option('items');
			if (nodes)
				nodes.forEach((item: any) => {
					if (this.isSelected(item._customData)) this.dxTreeListWidget?.selectRows([item.ID], true);
				});
		}
		this._getImageData();
	}
	setMasterFilterRecursive(node: any) {
		if (!node) return;
		this.setMasterFilter(node.itemData._customData);
		node.children.forEach((x: any) => this.setMasterFilterRecursive(x));
	}
}
