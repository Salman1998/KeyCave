import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: false,

  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private afAuth: AngularFireAuth) {}

  async sendResetLink(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    const email = form.value.email;
    console.log(email)
    try {
      await this.afAuth.sendPasswordResetEmail(email).then(resp => console.log(resp)).catch(error => console.log(error))
      this.successMessage = 'Password reset email sent. Check your inbox.';
      this.errorMessage = '';
      form.resetForm(); // Reset the form after successful submission
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
      this.successMessage = '';
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      default:
        return 'An error occurred. Please try again later.';
    }
  }
}
