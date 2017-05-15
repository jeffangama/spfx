// XuLhcUJ2/+gFOBljCc0m2vLqi55/JohvPJ3oZkLgkKBtV+cZjRpkBWv9VpOrT5BoLXWSPxP8mBKcbjTwGUcwyw==
// gulp package-solution --ship
// http://spfsamplesjeff.azureedge.net/
import { Version } from '@microsoft/sp-core-library';
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

export interface ISPLists {
  value: ISPList[];
}

export interface IUsersProfiles {
  value: IUserProfile[];
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface IUserProfile {
  FirstName: string;
  b: string;
  d: any;
}

import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions
} from '@microsoft/sp-http';

import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  public render(): void {

    //do not work
    var boolTitle = "default";
    // alert("testwww");
    // if (this.context.pageContext.web.title.indexOf("Local") > 0) {
    //   boolTitle = "yes title is there";
    //   console.log("HAHAHAHAHHAHA"+ this.context.pageContext.web.title);
    // }else {
    //   // alert("no man, no Local in " + this.context.pageContext.web.title.toString());
    // }

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
      </div>`;

    this._renderListAsync();
  }

  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.get()
      .then((data: ISPList[]) => {
        var listData: ISPLists = { value: data };
        return listData;
      }) as Promise<ISPLists>;
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
        //this._renderList(response.value);
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
