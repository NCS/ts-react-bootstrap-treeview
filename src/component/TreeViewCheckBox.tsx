import React, { FunctionComponent, CSSProperties } from "react";
import { Input } from "reactstrap";

let TreeViewCheckBox: FunctionComponent<{ isChecked: boolean; onCheckBoxClick: Function; }> = (props) => {
    let formStyle: CSSProperties = {
        verticalAlign: "middle"
    }

    let inputStyle: CSSProperties = {
        marginRight: -5,
        marginBottom: 4,
        height: "1.1em",
        width: "1.1em"
    }

    return (
        <div className="form-check form-check-inline" style={ formStyle }>
            <Input style={ inputStyle } type="checkbox" checked={ props.isChecked } onChange={ () => props.onCheckBoxClick() } />
        </div>
    );
}

export default TreeViewCheckBox;