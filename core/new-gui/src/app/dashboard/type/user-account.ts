/**
 * This interface stores the information about the user account.
 * These information is used to identify users and to save their data
 */
export interface UserAccount extends Readonly<{
  userName: string;
  userID: number;
}> {}

/**
 * This interface is used for communication between frontend and background
 */
export interface UserAccountResponse extends Readonly<{
  code: 0 | 1; // 0 represents success and 1 represents error
  userAccount: UserAccount;
  message: string;
}> {}
