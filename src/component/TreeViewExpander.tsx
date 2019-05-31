import React, { FunctionComponent, CSSProperties } from "react";
import { ArrowRightIcon, ArrowDropDownIcon } from "../Icon";
import { Button } from "reactstrap";

let TreeViewExpander: FunctionComponent<{ isExpanded: boolean; onExpanderClick: Function; }> = (props) => {
    let buttonStyle: CSSProperties = {
        padding: 0
    }

    return (
        <Button style={ buttonStyle } color="link" onClick={ () => props.onExpanderClick() }>
            { props.isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon /> }
        </Button>
    );
}

export default TreeViewExpander;