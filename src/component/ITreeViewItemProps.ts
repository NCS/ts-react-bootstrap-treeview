export default interface ITreeViewItemProps {
    offset: number;
    isExpanded: boolean;
    hierarchyName: string;
    hierarchyNumber: string;
    hasExpander: boolean;
    onExpanderClick: Function;
    hasCheckbox?: boolean;
    isChecked: boolean;
    onCheckBoxClick: Function;
    dragAndDrop?: boolean;
    onDragStart: Function;
    onDragEnd: Function;
    onDragOver: Function;
    className?: string;
    hasSecondColumn?: boolean;
}