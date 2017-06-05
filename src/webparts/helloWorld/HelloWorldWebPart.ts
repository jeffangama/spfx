// XuLhcUJ2/+gFOBljCc0m2vLqi55/JohvPJ3oZkLgkKBtV+cZjRpkBWv9VpOrT5BoLXWSPxP8mBKcbjTwGUcwyw==
// gulp package-solution --ship
// http://spfsamplesjeff.azureedge.net/
import { Version, DisplayMode, Environment, EnvironmentType, Log } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorld.module.scss';
import * as strings from 'helloWorldStrings';
import { IHelloWorldWebPartProps } from './IHelloWorldWebPartProps';
import MockHttpClient from './MockHttpClient';

export interface IUsersProfiles {
  value: IUserProfile[];
}

export interface IUserProfile {
  FirstName: string;
}

import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions
} from '@microsoft/sp-http';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import HelloWorldReact from './components/HelloWorldReact';
import { IHelloWorldReactProps } from './IHelloWorldWebPartProps';
import { BreadcrumbBasicExample } from "./components/BreadCrumb";
import MainApp from "./components/MainApp";

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  public render(): void {

    this.context.statusRenderer.displayLoadingIndicator(this.domElement, "message");

    this.domElement.innerHTML = `
      <div id="react1" />
        <div id="react2" />
      `;

    setTimeout(() => {
      this.context.statusRenderer.clearLoadingIndicator(this.domElement);

      this._testRest();
      this._testReact();

      this._logTest();
    }
      , 2000);
  }

  private _testRest(): void {
    var boolTitle = "default";

    this.domElement.innerHTML = `
      <div class="${styles.helloWorld}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">${escape(this.properties.description)}</p>
              <p class="ms-font-l ms-fontColor-white">Loading from ${escape(this.context.pageContext.web.title)}</p>
              <p class="ms-font-l ms-fontColor-white">Loading from ${boolTitle}</p>
              <a href="https://aka.ms/spfx" class="${styles.button}">
                <span class="${styles.label}">Learn more</span>
              </a>
            </div>
          </div>
        </div>  
        <div id="spListContainer" />
        <div id="react1" />
        <div id="react2" />
      </div>`;

    this._renderListAsync();
  }

  private _testReact(): void {
    const element: React.ReactElement<any> = React.createElement(
      MainApp
    );

    ReactDom.render(element, document.getElementById('react1')); //this.domElement

    // const element2: React.ReactElement<any> = React.createElement(
    //   BreadcrumbBasicExample,
    //   {
    //   }
    // );
    
    //ReactDom.render(element, document.getElementById('react1'));

  }

  private _logTest(): void {
    Log.info('HelloWorld', 'message', this.context.serviceScope);
    Log.warn('HelloWorld', 'WARNING message', this.context.serviceScope);
    Log.error('HelloWorld', new Error('Error message'), this.context.serviceScope);
    Log.verbose('HelloWorld', 'VERBOSE message', this.context.serviceScope);
  }


  private _getMockListData(): Promise<IUsersProfiles> {
    return MockHttpClient.get()
      .then((data: IUserProfile[]) => {
        var listData: IUsersProfiles = { value: data };
        return listData;
      }) as Promise<IUsersProfiles>;
  }

  private _getUserProfiles(): Promise<any> {
    let url = this.context.pageContext.web.absoluteUrl + `/_vti_bin/ListData.svc/UserInformationList?$filter=substringof('Person',ContentType) eq true`;

    return this.context.spHttpClient.get(url,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=verbose'
        }
      }).then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _renderListAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        this._renderUserProfiles(response.value);
      });
    }
    else if (Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint) {

      this._getUserProfiles()
        .then((response) => {
          this._renderUserProfiles(response.d.results);
        });
    }
  }

  private _renderUserProfiles(items: IUserProfile[]) { //items: IUserProfile[]) {
    let html: string = '';
    items.forEach((item: IUserProfile) => {
      if (item.FirstName != null) {
        html += `
        <ul class="${styles.list}">
            <li class="${styles.listItem}">
                <span class="ms-font-l">${item.FirstName}</span>
            </li>
        </ul>`;
      }
    });
    //test comment

    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
  }


  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description'
                }),
                PropertyPaneTextField('test', {
                  label: 'Multi-line Text Field',
                  multiline: true
                }),
                PropertyPaneCheckbox('test1', {
                  text: 'Checkbox'
                }),
                PropertyPaneDropdown('test2', {
                  label: 'Dropdown',
                  options: [
                    { key: '1', text: 'One' },
                    { key: '2', text: 'Two' },
                    { key: '3', text: 'Three' },
                    { key: '4', text: 'Four' }
                  ]
                }),
                PropertyPaneToggle('test3', {
                  label: 'Toggle',
                  onText: 'On',
                  offText: 'Off'
                })
              ]
            }
          ]
        }
      ]
    };
  }

}
