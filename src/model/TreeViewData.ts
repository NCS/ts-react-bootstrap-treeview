export default class TreeViewData {
	public static switchSort(
		itemOne: TreeViewData,
		itemTwo: TreeViewData,
		partialHierarchy: TreeViewData[],
		completeHierarchy: TreeViewData[],
	) {
		for (let index = 0; index < partialHierarchy.length; index++) {
			const itemOneIndex = partialHierarchy[index].children.findIndex((item) => item.asString() === itemOne.asString());
			const itemTwoIndex = partialHierarchy[index].children.findIndex((item) => item.asString() === itemTwo.asString());

			if (itemOneIndex !== -1 && itemTwoIndex !== -1) {
				partialHierarchy[index].children[itemOneIndex].sort = partialHierarchy[index].children[itemTwoIndex].sort;
				partialHierarchy[index].children[itemTwoIndex].sort = partialHierarchy[index].children[itemTwoIndex].sort-1;

				partialHierarchy[index].children.sort((a, b) => a.sort < b.sort ? -1 : (a.sort === b.sort ? 0 : 1));

				for (let sortFrom = 0; sortFrom < partialHierarchy[index].children.length; sortFrom++) {
					partialHierarchy[index].children[sortFrom].sort = sortFrom + 1;
				}

				break;
			} else if (itemOneIndex !== -1 && itemTwoIndex === -1 && itemTwo.isParentOf(itemOne.asString())) {
				partialHierarchy[index].children[itemOneIndex].sort = 0;

				partialHierarchy[index].children.sort((a, b) => a.sort < b.sort ? -1 : (a.sort === b.sort ? 0 : 1));

				for (let sortFrom = 0; sortFrom < partialHierarchy[index].children.length; sortFrom++) {
					partialHierarchy[index].children[sortFrom].sort = sortFrom + 1;
				}

				break;
			} else {
				TreeViewData.switchSort(itemOne, itemTwo, partialHierarchy[index].children, completeHierarchy);
			}
		}
	}

	public name: string = "";
	public hierarchyNumber: string = "";
	public children: TreeViewData[] = [];
	public isChecked: boolean = false;
	public sort: number = 1;

	public asString(): string {
		return this.name + " (" + this.hierarchyNumber + ")";
	}

	private isParentOf(identifier: string): boolean {
		for (let index = 0; index < this.children.length; index++) {
			if (this.children[index].asString() === identifier) {
				return true;
			}
		}

		return false;
	}

	public hasChildWithValue(attributeName: string, attributeValue: any): boolean {
		let hasChildWithValue = false;

		for (let childIndex = 0; childIndex < this.children.length; childIndex++) {
			if ((this.children[childIndex] as any)[attributeName] === attributeValue) {
				return true;
			} else {
				hasChildWithValue = this.children[childIndex].hasChildWithValue(attributeName, attributeValue);
			}

			if (hasChildWithValue) {
				return true;
			}
		}

		return hasChildWithValue;
	}

	public hasChildWithIncludedValue(attributeName: string, attributeValue: string): boolean {
		let hasChildWithValue = false;

		for (let childIndex = 0; childIndex < this.children.length; childIndex++) {
			if ((this.children[childIndex] as any)[attributeName].toLowerCase().includes(attributeValue)) {
				return true;
			} else {
				hasChildWithValue = this.children[childIndex].hasChildWithIncludedValue(attributeName, attributeValue);
			}

			if (hasChildWithValue) {
				return true;
			}
		}

		return false;
	}

	public setChecked(value: boolean, wholeTree: boolean) {
		this.isChecked = value;

		if (wholeTree) {
			for (let index = 0; index < this.children.length; index++) {
				this.children[index].setChecked(value, wholeTree);
			}
		}
	}

	public uncheckParent(partialHierarchy: TreeViewData[], completeHierarchy: TreeViewData[]) {
		for (let index = 0; index < partialHierarchy.length; index++) {
			const parentIndex = partialHierarchy[index].children.findIndex((item) => item.asString() === this.asString());

			if (parentIndex !== -1) {
				partialHierarchy[index].setChecked(false, false);
				partialHierarchy[index].uncheckParent(completeHierarchy, completeHierarchy);

				break;
			} else {
				this.uncheckParent(partialHierarchy[index].children, completeHierarchy);
			}
		}
	}

	public checkParents() {
		if (this.children.length > 0) {
			for (let index = 0; index < this.children.length; index++) {
				this.children[index].checkParents();
			}

			this.isChecked = this.children.findIndex(element => element.isChecked === false) === -1;
		}
	}

	public getCheckedChildren(): TreeViewData[] {
		let childrenNumbers: TreeViewData[] = [];

		if (/*this.children.length === 0 && */this.isChecked) {
			childrenNumbers.push(this);
		}
		
		/*else */if (this.children.length > 0) {
			for (let index = 0; index < this.children.length; index++) {
				childrenNumbers = childrenNumbers.concat(this.children[index].getCheckedChildren());
			}
		}

		return childrenNumbers;
	}
}
