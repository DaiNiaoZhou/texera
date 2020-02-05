import { Component, OnInit } from '@angular/core';
import { UserAccountService } from '../../../service/user-account/user-account.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalUserAccountLoginComponent } from './user-account-login/user-account-login/user-account-login.component';

/**
 * UserAccountIconComponent is triggered when user wants to log into the system
 *
 * @author Adam
 */
@Component({
  selector: 'texera-user-account-icon',
  templateUrl: './user-account-icon.component.html',
  styleUrls: ['./user-account-icon.component.scss']
})
export class UserAccountIconComponent implements OnInit {
  public userName: string = this.getDefaultUserName();

  constructor(
    private modalService: NgbModal,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit() {
    this.detectUserChange();
  }

  public logOutButton(): void {
    this.userAccountService.logOut();
  }

  public loginButton(): void {
    this.openLoginComponent(0);
  }

  public registerButton(): void {
    this.openLoginComponent(1);
  }

  public isLogin(): boolean {
    return this.userAccountService.isLogin();
  }

  private openLoginComponent(mode: number): void {
    const modalRef: NgbModalRef = this.modalService.open(NgbdModalUserAccountLoginComponent);
  }

  private detectUserChange(): void {
    this.userAccountService.getUserChangeEvent()
      .subscribe(
        () => {
          if (this.userAccountService.isLogin()) {
            this.userName = this.userAccountService.getCurrentUser().userName;
          } else {
            this.userName = this.getDefaultUserName();
          }
        }
      );

  }

  private getDefaultUserName(): string {
    return 'User';
  }

}
