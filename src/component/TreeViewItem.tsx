import React, { CSSProperties, FunctionComponent } from 'react';
import ITreeViewItemProps from './ITreeViewItemProps';
import TreeViewCheckBox from './TreeViewCheckBox';
import TreeViewDragIndicator from './TreeViewDragIndicator';
import TreeViewExpander from './TreeViewExpander';

let TreeViewItem: FunctionComponent<ITreeViewItemProps> = (props) => {
    let columnOffset: CSSProperties = {
        paddingLeft: ((props.offset > 0 ? props.offset * 3.5 : 0.5) + "em")
    };

    return (
        <tr
            className={ "tv-item " + props.className }
            onDragEnter={ (event: any) => event.target.parentNode.classList.add("drag-over") }
            onDragLeave={ (event: any) => event.target.parentNode.classList.remove("drag-over") }
            onDragOver={ () => props.onDragOver() }
            onDragEnd={ () => props.onDragEnd() }
        >
            <td style={ columnOffset }>
                { 
                    props.hasExpander &&
                    <TreeViewExpander
                        onExpanderClick={ () => props.onExpanderClick(props.hierarchyName + props.hierarchyNumber, !props.isExpanded) }
                        isExpanded={ props.isExpanded } />
                }
                {
                    props.dragAndDrop &&
                    <TreeViewDragIndicator onDragStart={ props.onDragStart } />
                }
                {
                    props.hasCheckbox &&
                    <TreeViewCheckBox isChecked={ props.isChecked } onCheckBoxClick={ props.onCheckBoxClick } />
                }
                { props.hierarchyName }
            </td>
            { props.hasSecondColumn && <td>{ props.hierarchyNumber }</td> }
        </tr>
    )
}

export default TreeViewItem;