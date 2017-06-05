import * as React from 'react';
// import styles from './HelloWorldReact.module.scss';
// import { IHelloWorldReactProps } from './IHelloWorldReactProps';
import { escape } from '@microsoft/sp-lodash-subset';

import HelloWorldReact from './helloWorldReact';
import { BreadcrumbBasicExample } from "./BreadCrumb";
import { IHelloWorldReactProps } from '../IHelloWorldWebPartProps';
import { ModalBasicExample } from "./ModalBasicExample";

export default class MainApp extends React.Component<IHelloWorldReactProps, void> {
    public render(): React.ReactElement<IHelloWorldReactProps> {
        return (
            <div>
                <HelloWorldReact description="" />
                <BreadcrumbBasicExample />
                {/*<ModalBasicExample />*/}
            </div>
        );
    }
}
