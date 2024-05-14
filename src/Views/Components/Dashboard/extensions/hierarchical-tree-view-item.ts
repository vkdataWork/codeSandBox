import { ICustomItemExtension, CustomItemViewer, DashboardControl } from 'devexpress-dashboard/common';
import { ICustomItemMetaData } from 'devexpress-dashboard/model/items/custom-item/meta';
import DxTreeView from 'devextreme-vue/tree-view';
import dxTreeView, { Node, Properties } from 'devextreme/ui/tree_view';

const HIERARCIAL_TREE_VIEW_EXTENSION_NAME = 'TreeViewItem';

const svgIcon =
	`<?xml version="1.0" encoding="utf-8"?>
	<svg version="1.1" id="` +
	HIERARCIAL_TREE_VIEW_EXTENSION_NAME +
	`" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
		<polygon class="dx-dashboard-contrast-icon" points="12,13 12,11 8,11 8,8 6,8 6,21 12,21 12,19 8,19 8,13 "/>
		<path class="dx-dashboard-accent-icon" d="M10,7H4C3.5,7,3,6.6,3,6V2c0-0.5,0.5-1,1-1h6c0.6,0,1,0.5,1,1v4C11,6.6,10.6,7,10,7z
			M21,14v-4c0-0.6-0.5-1-1-1h-6c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1h6C20.5,15,21,14.6,21,14z M21,22v-4c0-0.5-0.5-1-1-1h-6
			c-0.6,0-1,0.5-1,1v4c0,0.5,0.4,1,1,1h6C20.5,23,21,22.5,21,22z"/>
	</svg>`;

const treeViewMeta: ICustomItemMetaData = {
	bindings: [
		{
			propertyName: 'idBinding',
			dataItemType: 'Dimension',
			array: false,
			displayName: 'ID',
			emptyPlaceholder: 'Add ID',
			selectedPlaceholder: 'Configure ID',
		},
		{
			propertyName: 'parentIdBinding',
			dataItemType: 'Dimension',
			array: false,
			displayName: 'Parent ID',
			emptyPlaceholder: 'Add Parent ID',
			selectedPlaceholder: 'Configure Parent ID',
		},
		{
			propertyName: 'dimensionsBinding',
			dataItemType: 'Dimension',
			array: false,
			displayName: 'Dimensions',
			emptyPlaceholder: 'Add Dimension',
			selectedPlaceholder: 'Configure Dimension',
			enableInteractivity: true,
		},
	],
	interactivity: {
		filter: true,
	},
	icon: HIERARCIAL_TREE_VIEW_EXTENSION_NAME,
	// Uncomment the line below to place this custom item in the "Filter" group:
	//groupName: 'filter',
	title: 'Hierarchical Tree View',
};

export class TreeViewItemExtension implements ICustomItemExtension {
	name = HIERARCIAL_TREE_VIEW_EXTENSION_NAME;
	metaData = <ICustomItemMetaData>treeViewMeta;
	dashboardControl: DashboardControl;

	constructor(dashboardControl: DashboardControl) {
		this.dashboardControl = dashboardControl;
		dashboardControl.registerIcon(svgIcon);
	}

	public createViewerItem = (model: any, element: DxTreeView, content: any) => {
		return new TreeViewItem(model, element, content, this.dashboardControl);
	};
}

export class TreeViewItem extends CustomItemViewer {
	private dxTreeViewWidget?: dxTreeView;
	private _requiredBindingsCount: number;
	private dashboardControl: DashboardControl;

	constructor(model: any, container: any, options: any, dashboardControl: DashboardControl) {
		super(model, container, options);

		this._requiredBindingsCount = 2;
		this.dashboardControl = dashboardControl;
	}

	/*</ICustomItemMetaData>allowExportSingleItem() {
		return true;
	}*/

	override renderContent(element: HTMLElement, changeExisting: boolean, afterRenderCallback?: any) {
		let dataSource: any[] = [];

		//Check Bindings
		let bindings = this.getBindingValue('dimensionsBinding')
			.concat(this.getBindingValue('idBinding'))
			.concat(this.getBindingValue('parentIdBinding'));
		if (bindings.length !== this._requiredBindingsCount) return;

		//Get Data Source
		this.iterateData(function (dataRow) {
			let row = <any>{
				ID: dataRow.getDisplayText('idBinding')[0],
				ParentID:
					dataRow.getDisplayText('parentIdBinding')[0] !== '-1' && dataRow.getDisplayText('parentIdBinding')[0] !== ' '
						? Number(dataRow.getDisplayText('parentIdBinding')[0])
						: null,
				DisplayField: dataRow.getDisplayText('dimensionsBinding')[0],
			};
			row._customData = dataRow;
			dataSource.push(row);
		});

		let treeViewOptions: Properties = {
			items: JSON.parse(JSON.stringify(dataSource)),
			dataStructure: 'plain',
			parentIdExpr: 'ParentID',
			keyExpr: 'ID',
			displayExpr: 'DisplayField',
			selectionMode: 'multiple',
			selectNodesRecursive: false,
			onItemClick: (e) => {
				if (this.getMasterFilterMode() === 'Multiple' && this.allowMultiselection) {
					this.setMasterFilterRecursive(<any>e.node);
				} else {
					this.setMasterFilter((<any>e.itemData)._customData);
				}
			},
			onContentReady: (e) => {
				this.updateTreeViewSelection();
			},
		};

		if (!changeExisting) {
			while (element.firstChild) element.removeChild(element.firstChild);
			let div = document.createElement('div');
			element.appendChild(div);
			this.dxTreeViewWidget = new dxTreeView(div, treeViewOptions);
		} else {
			this.dxTreeViewWidget?.option(treeViewOptions);
		}
	}

	override clearSelection(): void {
		super.clearSelection();
		this.updateTreeViewSelection();
	}

	override setSelection(values: Array<Array<any>>): void {
		super.setSelection(values);
		this.updateTreeViewSelection();
	}

	updateTreeViewSelection() {
		if (this.dxTreeViewWidget) {
			this.dxTreeViewWidget.unselectAll();
			let nodes: any = this.dxTreeViewWidget.option('items');

			nodes.forEach((item: any) => {
				if (this.isSelected(item._customData)) this.dxTreeViewWidget?.selectItem(item.ID);
			});
		}
	}

	setMasterFilterRecursive(node: Node) {
		this.setMasterFilter((<any>node.itemData)._customData);
		node.children?.forEach((x) => this.setMasterFilterRecursive(x));
	}
}
