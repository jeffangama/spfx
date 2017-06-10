This is a dev version with different example of using SPFX / React / Rest API for Office 365 (SharePoint)
https://jeffangama.wordpress.com

### REST
Use Post Man for rest calls, Use Post man interceptor

Add header :
application/json;odata=nometadata
or
application/json;odata=verbose

Check the rest result how it looks to define the model

### Model

To get list items from a list, the rest endpoint returns an array value[] composed of the medatada.
So respectively we create two object ISPLists value: ISPList[], ISPList represents the medata

export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Title: string;
}

### QUERY

private _getHappenings(): Promise<ISPLists> {
    let url = this.context.pageContext.web.absoluteUrl + `/_api/lists/getbytitle('Pages')/items`;

    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
     
        return response.json();
      });
  }

### RENDERING

...
html
...

 this._getHappenings()
      .then((response) => {
        this._renderHappenings(response.value);
      });



 private _renderHappenings(items: ISPList[]) { //items: IUserProfile[]) {
    let html: string = '';
    items.forEach((item: ISPList) => {

      Log.info('HelloWorld', item.Title, this.context.serviceScope);
      if (item.Title != null) {
        html += `
      <ul class="${styles.list}">
          <li class="${styles.listItem}">
              <span class="ms-font-l">${item.Title}</span>
          </li>
      </ul>`;
      }
    });
    //test comment

    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
  }


  ### LEARNING

  Error : The promise is any, the header shall be metadata

  private _getHappenings(): Promise<any>{
    let url = this.context.pageContext.web.absoluteUrl + `/_api/lists/getbytitle('Pages')/items`;

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