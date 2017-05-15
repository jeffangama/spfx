import { IUserProfile } from './HelloWorldWebPart';

export default class MockHttpClient  {

    private static _items: IUserProfile[] = [{ FirstName: 'Mock List' },
                                        { FirstName: 'Mock List 2' },
                                        { FirstName: 'Mock List 3' }];
    
    public static get(): Promise<IUserProfile[]> {
    return new Promise<IUserProfile[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}