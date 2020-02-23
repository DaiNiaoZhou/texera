import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { UserDictionary } from './user-dictionary.interface';
import { environment } from '../../../../environments/environment';
import { GenericWebResponse } from '../../type/generic-web-response';
import { UserAccountService } from '../user-account/user-account.service';

const dictionaryUrl = 'users/dictionaries';
const uploadDictionaryUrl = 'users/dictionaries/upload-file';
const uploadFilesURL = 'users/dictionaries/upload-files';

const getDictionaryUrl = 'users/dictionaries/get-dictionary';
const deleteDictionaryUrl = 'users/dictionaries/delete-dictionary';
const updateDictionaryUrl = 'users/dictionaries/update-dictionary';

/**
 * User Dictionary service should be able to get all the saved-dictionary
 *  data from the back end for a specific user. The user can also upload new
 *  dictionary, view dictionaries, and edit the keys in a specific dictionary
 *  by calling methods in service. StubUserDictionaryService is used for replacing
 *  real service to complete testing cases. It uploads the mock data to the dashboard.
 *
 * @author Chen He
 */

@Injectable()
export class UserDictionaryService {
  private dictionaryArray: UserDictionary[] = [];

  constructor(
    private http: HttpClient,
    private userAccountService: UserAccountService) { }

  public refreshDictionary(): void {
    if (!this.userAccountService.isLogin()) {return; }

    this.getDictionaryHttpRequest(
      this.userAccountService.getCurrentUserField('userID')
      ).subscribe(
      dictionaries => this.dictionaryArray = dictionaries
    );
  }

  public deleteDictionary(dictID: number) {
    this.deleteDictionaryHttpRequest(dictID).subscribe(
      () => this.refreshDictionary()
    );
  }

  public updateDictionary(userDictionary: UserDictionary): void {
    this.updateDictionaryHttpRequest(userDictionary)
      .subscribe(
        () => this.refreshDictionary()
      );
  }

  public getDictionaryArray(): UserDictionary[] {
    return this.dictionaryArray;
  }

  public getDictionaryArrayLength(): number {
    return this.dictionaryArray.length;
  }

  // /**
  //  * This method will list all the dictionaries existing in the
  //  *  backend.
  //  */
  // public listUserDictionaries(): Observable<UserDictionary[]> {
  //   return this.http.get<UserDictionary[]>(`${environment.apiUrl}/${dictionaryUrl}`);
  // }

  // /**
  //  * This method will get the user dictionary information using the
  //  *  dictionary ID.
  //  *
  //  * The information includes
  //  *  1. dictionary ID
  //  *  2. dictionary Name
  //  *  3. dictionary items
  //  *  4. dictionary description
  //  *
  //  * @param dictID
  //  */
  // public getUserDictionary(dictID: string): Observable<UserDictionary> {
  //   return this.http.get<UserDictionary>(`${environment.apiUrl}/${dictionaryUrl}/${dictID}`);
  // }

  // /**
  //  * This method handles the request for uploading a user dictionary
  //  *  type object to the backend.
  //  *
  //  * @param userDict new user dictionary
  //  */
  // public putUserDictionaryData(userDict: UserDictionary): Observable<GenericWebResponse> {
  //   return this.http.put<GenericWebResponse>(
  //     `${environment.apiUrl}/${dictionaryUrl}/${userDict.id}`,
  //     JSON.stringify(userDict),
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type':  'application/json',
  //       })
  //     }
  //   );
  // }

  // /**
  //  * This method will handle the request to upload multiple files to the backend.
  //  *
  //  * @param fileList
  //  */
  // public uploadFileList(fileList: File[]): Observable<GenericWebResponse> {
  //   const newFormData = new FormData();
  //   fileList.forEach(file => {
  //     newFormData.append('files', file, file.name);
  //   });

  //   return this.http.post<GenericWebResponse>(`${environment.apiUrl}/${uploadFilesURL}`, newFormData);
  // }

  // /**
  //  * This method will handle the request for uploading a File type
  //  *  dictionary object.
  //  *
  //  * @param file
  //  */
  // public uploadDictionary(file: File): Observable<GenericWebResponse> {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.http.post<GenericWebResponse>(`${environment.apiUrl}/${uploadDictionaryUrl}`, formData);
  // }

  // /**
  //  * This method will send a request to the backend
  //  *  to remove the dictionary information stored
  //  *  in the disk.
  //  *
  //  * @param dictID dictionary ID
  //  */
  // public deleteUserDictionaryData(dictID: string): Observable<GenericWebResponse> {
  //   return this.http.delete<GenericWebResponse>(`${environment.apiUrl}/${dictionaryUrl}/${dictID}`);
  // }

  private getDictionaryHttpRequest(userID: number): Observable<UserDictionary[]> {
    return this.http.get<UserDictionary[]>(`${environment.apiUrl}/${getDictionaryUrl}/${userID}`);
  }

  private deleteDictionaryHttpRequest(dictID: number): Observable<GenericWebResponse> {
    return this.http.delete<GenericWebResponse>(`${environment.apiUrl}/${deleteDictionaryUrl}/${dictID}`);
  }

  private updateDictionaryHttpRequest(userDictionary: UserDictionary): Observable<GenericWebResponse> {
    return this.http.post<GenericWebResponse>(`${environment.apiUrl}/${updateDictionaryUrl}`,
    JSON.stringify(userDictionary),
    {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    }
    );
  }

}
