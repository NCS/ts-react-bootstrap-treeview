import React, { PureComponent } from 'react';
import { Table, Row, Col, ButtonGroup, Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import TreeViewItem from "./TreeViewItem";
import TreeViewNoDataItem from "./TreeViewNoDataItem";
import TreeViewData from '../model/TreeViewData';
import '../sass/TreeView.scss';
import { UnfoldLessIcon, UnfoldMoreIcon, CheckboxIcon, CheckboxEmptyIcon, SearchIcon } from "./Icon";

interface ITreeViewRowStatusArray {
    [rowIdentifier: string]: boolean;
}

interface ITreeViewProps {
    data: TreeViewData[];
    hideToolBar?: boolean;
    hasCheckbox?: boolean;
    onCheckBoxClick?: Function;
    dragAndDrop?: boolean;
    onSortOrderChange?: Function;
    className?: string;
    borderless?: boolean;
    dontCheckChildren?: boolean;
    searchFieldPlaceholder?: string;
    showOnlyCheckedTitle?: string;
    showOnlyUnCheckedTitle?: string;
    expandAllTitle?: string;
    shrinkAllTitle?: string;
    hasSecondColumn?: boolean;
    columnOneHeader: string;
    columnTwoHeader?: string;
}

interface ITreeViewState {
    rowStatus: ITreeViewRowStatusArray;
    draggedItem: TreeViewData | null;
    draggedOverItem: TreeViewData | null;
    onlyChecked: boolean;
    onlyNotChecked: boolean;
    searchText: string;
}

export default class TreeView extends PureComponent<ITreeViewProps, ITreeViewState> {
    constructor(props: any) {
        super(props);

        this.setInitialRowStatus = this.setInitialRowStatus.bind(this);
        this.onExpanderClick = this.onExpanderClick.bind(this);
        this.generateTreeViewItems = this.generateTreeViewItems.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.toggleOnlyChecked = this.toggleOnlyChecked.bind(this);
        this.toggleOnlyNotChecked = this.toggleOnlyNotChecked.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
        this.onExpandAllClick = this.onExpandAllClick.bind(this);
        this.onShrinkAllClick = this.onShrinkAllClick.bind(this);
        this.onCheckBoxClick = this.onCheckBoxClick.bind(this);

        this.state = {
            rowStatus: this.setInitialRowStatus(this.props.data),
            draggedItem: null,
            draggedOverItem: null,
            onlyChecked: false,
            onlyNotChecked: false,
            searchText: ""
        };
    }

    private onCheckBoxClick(data: TreeViewData, event: any) {
        data.setChecked(event.target.checked, this.props.dontCheckChildren ? false : true);

        if (!event.target.checked && !this.props.dontCheckChildren) {
            data.uncheckParent(this.props.data, this.props.data);
        }

        if (this.props.onCheckBoxClick !== undefined) {
            let hierarchies: TreeViewData[] = [];
            Object.assign(hierarchies, this.props.data);

            this.props.onCheckBoxClick(hierarchies);
        }
    }

    private toggleOnlyChecked() {
        this.setState({
            onlyChecked: !this.state.onlyChecked,
            onlyNotChecked: false
        });
    }

    private toggleOnlyNotChecked() {
        this.setState({
            onlyChecked: false,
            onlyNotChecked: !this.state.onlyNotChecked
        });
    }

    private onExpandAllClick() {
        Object.keys(this.state.rowStatus).forEach(key => {
            this.state.rowStatus[key] = true;
        });

        this.setState({
            rowStatus: { ...this.state.rowStatus }
        });
    }

    private onShrinkAllClick() {
        Object.keys(this.state.rowStatus).forEach(key => {
            this.state.rowStatus[key] = false;
        });

        this.setState({
            rowStatus: { ...this.state.rowStatus }
        });
    }

    private onSearchTextChange(event: any) {
        this.setState({
            searchText: event.target.value
        });
    }

    private onDragStart(event: any, item: TreeViewData) {
        event.dataTransfer.effectAllowed = "move";

        event.target.parentNode.style.opacity = '0.4';

        event.dataTransfer.setData("text/html", event.target.parentNode);
        event.dataTransfer.setDragImage(event.target.parentNode, 200, 0);

        this.setState({
            draggedItem: item
        });
    };

    private onDragEnd(event: any) {
        event.preventDefault();
        event.stopPropagation();

        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.clearData();

        event.target.parentNode.style.opacity = '1';

        Array.from(document.getElementsByClassName("drag-over")).forEach(element => {
            element.classList.remove("drag-over");
        });  

        if (this.props.onSortOrderChange !== undefined) {
            this.props.onSortOrderChange(this.state.draggedItem, this.state.draggedOverItem);
        }

        this.setState({
            draggedItem: null,
            draggedOverItem: null
        });
    };

    private onDragOver(event: any, item: TreeViewData) {
        event.preventDefault();
        event.stopPropagation();

        if (this.state.draggedItem !== null && this.state.draggedItem.asString() !== item.asString()) {
            this.setState({
                draggedOverItem: item
            });
        }
    };

    setInitialRowStatus(data: TreeViewData[], depth: number = 0, expanded: boolean = true): ITreeViewRowStatusArray {
        let initialRowState: ITreeViewRowStatusArray = {};

        // TODO: Expand only first two stages
        for (let index = 0; index < data.length; index++) {
            initialRowState[data[index].name + data[index].hierarchyNumber] = expanded;

            if (data[index].children.length > 0) {
                initialRowState = { ...initialRowState, ...this.setInitialRowStatus(data[index].children, depth+1, expanded) };
            }
        }

        return initialRowState;
    }

    onExpanderClick(parentRowIdentifier: string, newExpandValue: boolean) {
        let newRowStatus = this.state.rowStatus;
        newRowStatus[parentRowIdentifier] = newExpandValue;

        this.setState({
            rowStatus: { ...newRowStatus }
        });
    }

    generateTreeViewItems(data: TreeViewData[], hierarchyBranch: number = 0, recalled: boolean = false, parentName: string = "", show: boolean = true): JSX.Element[] {
        let items: JSX.Element[] = [];

        if (data.length === 0) {
            items.push(<TreeViewNoDataItem />);
        } else {
            data.sort((a, b) => a.sort < b.sort ? -1 : 1);

            for (let index = 0; index < data.length; index++) {
                if (!recalled) {
                    hierarchyBranch = 0;
                }

                let showRow = true;

                if (show) {
                    showRow =   ((this.state.onlyChecked && (data[index].isChecked || data[index].hasChildWithValue("isChecked", true))) || !this.state.onlyChecked) &&
                                ((this.state.onlyNotChecked && (!data[index].isChecked || data[index].hasChildWithValue("isChecked", false))) || !this.state.onlyNotChecked) &&
                                (
                                    this.state.searchText === undefined ||
                                    this.state.searchText === "" ||
                                    data[index].name.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                    data[index].hierarchyNumber.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                    data[index].hasChildWithIncludedValue("name", this.state.searchText.toLowerCase()) ||
                                    data[index].hasChildWithIncludedValue("hierarchyNumber", this.state.searchText.toLowerCase())
                                );
                }

                if (showRow && show) {
                    items[items.length] =
                        <TreeViewItem key={data[index].name + data[index].hierarchyNumber + parentName}
                            className={ data[index].children.length > 0 ? "branch" : "leaf" }
                            offset={hierarchyBranch}
                            hasExpander={ data[index].children.length > 0 }
                            isExpanded={ this.state.rowStatus[data[index].name + data[index].hierarchyNumber] }
                            hierarchyName={ data[index].name }
                            hierarchyNumber={ data[index].hierarchyNumber }
                            onExpanderClick={ this.onExpanderClick }
                            hasCheckbox={ this.props.hasCheckbox }
                            isChecked={ data[index].isChecked }
                            onCheckBoxClick={ () => this.onCheckBoxClick(data[index], event) }
                            dragAndDrop={ !recalled ? false : this.props.dragAndDrop }
                            onDragStart={ this.props.dragAndDrop ? () => this.onDragStart(event, data[index]) : () => {} }
                            onDragEnd={ this.props.dragAndDrop ? () => this.onDragEnd(event) : () => {} }
                            onDragOver={ this.props.dragAndDrop ? () => this.onDragOver(event, data[index]) : () => {} } />;
                }

                if (data[index].children.length > 0) {
                    items = items.concat(this.generateTreeViewItems(
                        data[index].children,
                        hierarchyBranch+1,
                        true,
                        data[index].name,
                        this.state.rowStatus[data[index].name + data[index].hierarchyNumber] && show
                    ));
                }
            };
        }

        return items;
    }

    render() {
        return (
            <div className={ this.props.className }>
                { !this.props.hideToolBar &&
                    <Row>
                        <Col sm="12" md="8">
                            <ButtonGroup>
                                {
                                    this.props.hasCheckbox &&
                                    <Button color="secondary" onClick={ this.toggleOnlyChecked } active={ this.state.onlyChecked } title={ this.props.showOnlyCheckedTitle }>
                                        <CheckboxIcon />
                                    </Button>
                                }
                                {
                                    this.props.hasCheckbox &&
                                    <Button color="secondary" onClick={ this.toggleOnlyNotChecked } active={ this.state.onlyNotChecked } title={ this.props.showOnlyUnCheckedTitle }>
                                        <CheckboxEmptyIcon />
                                    </Button>
                                }
                                <Button color="secondary" onClick={ this.onExpandAllClick } title={ this.props.expandAllTitle }><UnfoldMoreIcon /></Button>
                                <Button color="secondary" onClick={ this.onShrinkAllClick } title={ this.props.shrinkAllTitle }><UnfoldLessIcon /></Button>
                            </ButtonGroup>
                        </Col>
                        <Col sm="12" md="4">
                            <FormGroup>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><SearchIcon /></InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        type="search"
                                        placeholder={ this.props.searchFieldPlaceholder }
                                        onChange={ this.onSearchTextChange }
                                        value={ this.state.searchText } />
                                </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                }
                <Table hover size="sm" borderless={ this.props.borderless } className="treeView">
                    <thead>
                        <tr>
                            <th>{ this.props.columnOneHeader }</th>
                            { this.props.hasSecondColumn && <th>{ this.props.columnTwoHeader }</th> }
                        </tr>
                    </thead>
                    <tbody>
                    { this.generateTreeViewItems(this.props.data) }
                    </tbody>
                </Table>
            </div>
        )
    }
}
