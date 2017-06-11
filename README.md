This is a dev version with different example of using SPFX / React / Rest API for Office 365 (SharePoint)
https://jeffangama.wordpress.com

### How to use

Call the function to test different implementation, by commenting the function.

Example :
```typescript
      //this._testRest(); //Show every list in the site
      //this._testReact(); //Show some react component
      this._testHappening(); //Show every pages in pages library. Create a page library first
```
or 

Example :
```typescript
      //this._testRest();
      this._testReact();
      //this._testHappening();
```
### How to test REST api
Use Post Man for rest calls, Use Post man interceptor

Add header :
application/json;odata=nometadata
or
application/json;odata=verbose

Check the rest result how it looks to define the model

### _testHappening() - Get Pages from page library - Model explanation

To get list items from a list, the rest endpoint returns an array value[] composed of the medatada.
So respectively we create two object ISPLists value: ISPList[], ISPList represents the medata
```typescript
export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Title: string;
}
```
### _testHappening() - Get Pages from page library - Query Explanation
```typescript
private _getHappenings(): Promise<ISPLists> {
    let url = this.context.pageContext.web.absoluteUrl + `/_api/lists/getbytitle('Pages')/items`;

    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
     
        return response.json();
      });
  }
```
### _testHappening() - Get Pages from page library - RENDERING explanation

...
html
...
```typescript
 this._getHappenings()
      .then((response) => {
        this._renderHappenings(response.value);
      });
```

```typescript
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
```

  ### LEARNING

  Error : The promise is any, the header shall be metadata
```typescript
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
  ```