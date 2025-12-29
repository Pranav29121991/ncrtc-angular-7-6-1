import { map } from 'rxjs/operators';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthenticateAction, AuthenticationErrorAction, ResetAuthenticationMessagesAction } from '../../../../core/auth/auth.actions';

import { getAuthenticationError, getAuthenticationInfo, } from '../../../../core/auth/selectors';
import { hasValue, isNotEmpty } from '../../../empty.util';
import { fadeOut } from '../../../animations/fade';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { renderAuthMethodFor } from '../log-in.methods-decorator';
import { AuthMethod } from '../../../../core/auth/models/auth.method';
import { AuthService } from '../../../../core/auth/auth.service';
import { HardRedirectService } from '../../../../core/services/hard-redirect.service';
import { CoreState } from '../../../../core/core-state.model';
import { getForgotPasswordRoute, getRegisterRoute } from '../../../../app-routing-paths';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';

/**
 * /users/sign-in
 * @class LogInPasswordComponent
 */
@Component({
  selector: 'ds-log-in-password',
  templateUrl: './log-in-password.component.html',
  styleUrls: ['./log-in-password.component.scss'],
  animations: [fadeOut]
})
@renderAuthMethodFor(AuthMethodType.Password)
export class LogInPasswordComponent implements OnInit, OnDestroy {

  /**
   * The authentication method data.
   * @type {AuthMethod}
   */
  public authMethod: AuthMethod;

  /**
   * The error if authentication fails.
   * @type {Observable<string>}
   */
  public error: Observable<string>;

  /**
   * Has authentication error.
   * @type {boolean}
   */
  public hasError = false;

  /**
   * The authentication info message.
   * @type {Observable<string>}
   */
  public message: Observable<string>;

  /**
   * Has authentication message.
   * @type {boolean}
   */
  public hasMessage = false;

  /**
   * The authentication form.
   * @type {FormGroup}
   */
  public form: UntypedFormGroup;
  timer = 0;
  isTimerRunning = false;
  private intervalId: any;

  /**
   * Whether the current user (or anonymous) is authorized to register an account
   */
  public canRegister$: Observable<boolean>;

  constructor(
    @Inject('authMethodProvider') public injectedAuthMethodModel: AuthMethod,
    @Inject('isStandalonePage') public isStandalonePage: boolean,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private hardRedirectService: HardRedirectService,
    private formBuilder: UntypedFormBuilder,
    protected store: Store<CoreState>,
    protected authorizationService: AuthorizationDataService,
  ) {
    this.authMethod = injectedAuthMethodModel;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   */
  startOTPTimer(): void {
    // Logic to send OTP goes here

    this.timer = 30; // seconds
    this.isTimerRunning = true;

    this.intervalId = setInterval(() => {
      this.timer--;
      this.cdRef.detectChanges(); // Trigger change detection to update the timer in the template
      if (this.timer <= 0) {
        this.isTimerRunning = false;
        this.cdRef.detectChanges();
        clearInterval(this.intervalId);
      }
    }, 1000);
  }
  public submitLoginCreds() {
      this.authService.submitLoginCreds(this.form.get('email').value, this.form.get('password').value).pipe(getFirstCompletedRemoteData()).subscribe(rd=>{
        console.log('Login credentials submitted', rd);
        if (rd.statusCode === 200) {
          this.startOTPTimer();
           this.store.dispatch(new ResetAuthenticationMessagesAction());
        } else {
          this.hasError = true;
          this.store.dispatch(new AuthenticationErrorAction(new Error('auth.errors.invalid-user')));
          // this.store.dispatch(new ResetAuthenticationMessagesAction());
        }
      });
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  public ngOnInit() {

    // set formGroup
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      otp: ['']  
    });
    
    // set error
    this.error = this.store.pipe(select(
      getAuthenticationError),
      map((error) => {
        this.hasError = (isNotEmpty(error));
        return error;
      })
    );

    // set error
    this.message = this.store.pipe(
      select(getAuthenticationInfo),
      map((message) => {
        this.hasMessage = (isNotEmpty(message));
        return message;
      })
    );

    this.canRegister$ = this.authorizationService.isAuthorized(FeatureID.EPersonRegistration);
  }

  getRegisterRoute() {
    return getRegisterRoute();
  }

  getForgotRoute() {
    return getForgotPasswordRoute();
  }

  /**
   * Reset error or message.
   */
  public resetErrorOrMessage() {
    if (this.hasError || this.hasMessage) {
      this.store.dispatch(new ResetAuthenticationMessagesAction());
      this.hasError = false;
      this.hasMessage = false;
    }
  }

  /**
   * Submit the authentication form.
   * @method submit
   */

  public validateotp() {
    this.authService.validateOTP(this.form.get('email').value,  this.form.get('password').value,this.form.get('otp').value).pipe(getFirstCompletedRemoteData()).subscribe(rd => { 
      console.log('OTP validation submitted', rd);
      if (rd.statusCode === 200) {
        this.store.dispatch(new ResetAuthenticationMessagesAction());
        this.submit();
      } else {
        this.hasError = true;
        this.store.dispatch(new AuthenticationErrorAction(new Error('auth.errors.invalid-otp')));
      }
    })
  }
  public submit() {
    this.resetErrorOrMessage();
    // get email and password values
    const email: string = this.form.get('email').value;
    const password: string = this.form.get('password').value;
  
    // trim values
    email.trim();
    password.trim();
   
    // check if email and password are not empty
    if (email === '' || password === '') {
      this.hasError = true;
      this.store.dispatch(new ResetAuthenticationMessagesAction());
      return;
    }
    if (!this.isStandalonePage) {
      this.authService.setRedirectUrl(this.hardRedirectService.getCurrentRoute());
    } else {
      this.authService.setRedirectUrlIfNotSet('/');
    }
    // dispatch AuthenticationAction
    this.store.dispatch(new AuthenticateAction(email, password));

    // clear form
    this.form.reset();
  }


  /**
   * To check if otp is valid or not
   * 
   */
  isOtpValid(): boolean {
    const otpValue = this.form.get('otp')?.value;
    return otpValue && otpValue.length >= 6;
  }

}
