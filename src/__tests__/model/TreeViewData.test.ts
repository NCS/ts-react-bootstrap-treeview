import TreeViewData from "../../model/TreeViewData";

describe('Can sort data', () => {
    it('Can change sort of two hierarchies down', () => {
        let hierarchyOne = new TreeViewData("Hierarchy One", "001", [], 1);
        let hierarchyTwo = new TreeViewData("Hierarchy Two", "002", [], 2);
        let hierarchyTree = new TreeViewData("Hierarchy Tree", "003", [], 3);

        let parentHierarchy = new TreeViewData("Parent", "000", [hierarchyOne, hierarchyTwo, hierarchyTree], 1);

        TreeViewData.switchSort(hierarchyOne, hierarchyTree, [parentHierarchy], [parentHierarchy]);

        expect(hierarchyOne.sort).toEqual(3);
        expect(hierarchyTwo.sort).toEqual(1);
        expect(hierarchyTree.sort).toEqual(2);
    });

    it('Can change sort of two hierarchies up', () => {
        let hierarchyOne = new TreeViewData("Hierarchy One", "001", [], 1);
        let hierarchyTwo = new TreeViewData("Hierarchy Two", "002", [], 2);
        let hierarchyTree = new TreeViewData("Hierarchy Tree", "003", [], 3);

        let parentHierarchy = new TreeViewData("Parent", "000", [hierarchyOne, hierarchyTwo, hierarchyTree], 1);

        TreeViewData.switchSort(hierarchyTree, hierarchyOne, [parentHierarchy], [parentHierarchy]);

        expect(hierarchyOne.sort).toEqual(1);
        expect(hierarchyTwo.sort).toEqual(3);
        expect(hierarchyTree.sort).toEqual(2);
    });

    it('Can change sort of two neighbor hierarchies', () => {
        let hierarchyOne = new TreeViewData("Hierarchy One", "001", [], 1);
        let hierarchyTwo = new TreeViewData("Hierarchy Two", "002", [], 2);
        let hierarchyTree = new TreeViewData("Hierarchy Tree", "003", [], 3);

        let parentHierarchy = new TreeViewData("Parent", "000", [hierarchyOne, hierarchyTwo, hierarchyTree], 1);

        TreeViewData.switchSort(hierarchyOne, hierarchyTwo, [parentHierarchy], [parentHierarchy]);

        expect(hierarchyOne.sort).toEqual(2);
        expect(hierarchyTwo.sort).toEqual(1);
        expect(hierarchyTree.sort).toEqual(3);
    });
});

describe('Can search partial in hierarchies', () => {
    it("Can find match in flat hierarchies", () => {
        let hierarchyOne = new TreeViewData("Hierarchy One", "001", [], 1);
        let hierarchyTwo = new TreeViewData("Hierarchy Two", "002", [], 2);
        let hierarchyTree = new TreeViewData("Hierarchy Tree", "003", [], 3);

        let parentHierarchy = new TreeViewData("Parent", "000", [hierarchyOne, hierarchyTwo, hierarchyTree], 1);

        expect(parentHierarchy.hasChildWithIncludedValue("name", "Tree".toLowerCase())).toBeTruthy();
    });

    it("Can find match in deep hierarchies", () => {
        let hierarchyOne = new TreeViewData("Hierarchy One", "001", [], 1);
        let hierarchyTwo = new TreeViewData("Hierarchy Two", "002", [], 2);
        let hierarchyTree = new TreeViewData("Hierarchy Tree", "003", [], 3);

        let parentHierarchy1 = new TreeViewData("Parent", "000", [hierarchyOne, hierarchyTwo, hierarchyTree], 1);
        let parentHierarchy2 = new TreeViewData("Parent", "000", [parentHierarchy1], 1);
        let parentHierarchy3 = new TreeViewData("Parent", "000", [parentHierarchy2], 1);

        expect(parentHierarchy3.hasChildWithIncludedValue("name", "Tree".toLowerCase())).toBeTruthy();
    });

    it("Prevent false positives", () => {
        let hierarchyOne = new TreeViewData("Hierarchy One", "001", [], 1);
        let hierarchyTwo = new TreeViewData("Hierarchy Two", "002", [], 2);
        let hierarchyTree = new TreeViewData("Hierarchy Tree", "003", [], 3);

        let parentHierarchy1 = new TreeViewData("Parent", "000", [hierarchyOne, hierarchyTwo, hierarchyTree], 1);
        let parentHierarchy2 = new TreeViewData("Parent", "000", [parentHierarchy1], 1);
        let parentHierarchy3 = new TreeViewData("Parent", "000", [parentHierarchy2], 1);

        expect(parentHierarchy1.hasChildWithIncludedValue("name", "Five".toLowerCase())).toBeFalsy();
        expect(parentHierarchy3.hasChildWithIncludedValue("name", "Five".toLowerCase())).toBeFalsy();
    });
});

describe('Can search complete in hierarchies', () => {
    it("Can find match in flat hierarchies", () => {
        let hierarchyOne = new TreeViewData("Hierarchy One", "001", [], 1);
        let hierarchyTwo = new TreeViewData("Hierarchy Two", "002", [], 2);
        let hierarchyTree = new TreeViewData("Hierarchy Tree", "003", [], 3);

        let parentHierarchy = new TreeViewData("Parent", "000", [hierarchyOne, hierarchyTwo, hierarchyTree], 1);

        expect(parentHierarchy.hasChildWithValue("hierarchyNumber", "003")).toBeTruthy();
    });

    it("Can find match in deep hierarchies", () => {
        let hierarchyOne = new TreeViewData("Hierarchy One", "001", [], 1);
        let hierarchyTwo = new TreeViewData("Hierarchy Two", "002", [], 2);
        let hierarchyTree = new TreeViewData("Hierarchy Tree", "003", [], 3);

        let parentHierarchy1 = new TreeViewData("Parent", "000", [hierarchyOne, hierarchyTwo, hierarchyTree], 1);
        let parentHierarchy2 = new TreeViewData("Parent", "000", [parentHierarchy1], 1);
        let parentHierarchy3 = new TreeViewData("Parent", "000", [parentHierarchy2], 1);

        expect(parentHierarchy3.hasChildWithValue("hierarchyNumber", "003")).toBeTruthy();
    });

    it("Prevent false positives", () => {
        let hierarchyOne = new TreeViewData("Hierarchy One", "001", [], 1);
        let hierarchyTwo = new TreeViewData("Hierarchy Two", "002", [], 2);
        let hierarchyTree = new TreeViewData("Hierarchy Tree", "003", [], 3);

        let parentHierarchy1 = new TreeViewData("Parent", "000", [hierarchyOne, hierarchyTwo, hierarchyTree], 1);
        let parentHierarchy2 = new TreeViewData("Parent", "000", [parentHierarchy1], 1);
        let parentHierarchy3 = new TreeViewData("Parent", "000", [parentHierarchy2], 1);

        expect(parentHierarchy1.hasChildWithValue("hierarchyNumber", "005")).toBeFalsy();
        expect(parentHierarchy3.hasChildWithValue("hierarchyNumber", "005")).toBeFalsy();
    });
});
