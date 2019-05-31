import React, { FunctionComponent } from 'react';
import de from '../../assets/lang/de';

const TreeViewNoDataItem: FunctionComponent<{}> = () => {
    return (
        <tr>
            <td colSpan={2} style={ { textAlign: "center" } }>
                {  de.noData }
            </td>
        </tr>
    )
}

export default TreeViewNoDataItem;
