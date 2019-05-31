import React, { FunctionComponent } from "react";
import { DragIndicator } from "./Icon";

let TreeViewDragIndicator: FunctionComponent<{ onDragStart: Function; }> = (props) => {
    return (
        <span draggable onDragStart={ () => props.onDragStart() }><DragIndicator /></span>
    );
}

export default TreeViewDragIndicator;