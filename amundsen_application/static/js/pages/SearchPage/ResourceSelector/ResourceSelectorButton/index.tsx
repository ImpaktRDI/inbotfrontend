import * as React from 'react';
import { ResourceType } from 'interfaces/Resources';

import './styles.scss';

type ResourceSelectorButtonProps = {
    resource: ResourceOptionConfig;
    checked: boolean;
    onClick: (event: any) => void;
}

export interface ResourceOptionConfig {
    type: ResourceType;
    label: string;
    count: number;
    imgSrc: any;
}

export class ResourceSelectorButton extends React.Component<ResourceSelectorButtonProps> {
    render = () => {
        return (
            <div className="resource-selector-button" onClick={() => this.props.onClick(this.props.resource.type)}>
                <div className="resource-selector-button-item">
                    <div className="resource-selector-button-icon">
                        <img src={this.props.resource.imgSrc} alt=""></img>
                    </div>
                </div>
                <div className="resource-selector-button-item">
                    <h3>
                        <span style={{ color: this.props.checked ? "rgba(3, 0, 48, 0.8)" : "rgba(3, 0, 48, 0.4)" }}
                        >{this.props.resource.label}</span>
                    </h3>
                </div>
                <div className="resource-selector-button-item pull-right">
                    <span className="body-secondary-3 pull-right">{this.props.resource.count}</span>
                </div>
            </div>
        )
    }
}