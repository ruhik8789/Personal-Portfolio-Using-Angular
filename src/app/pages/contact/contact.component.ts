import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  formData: ContactFormData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  submitMessage = '';

  constructor(private firebaseService: FirebaseService) {}

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.submitMessage = '';
    
    // Submit to Firebase
    this.firebaseService.addMessage(this.formData)
      .then(() => {
        this.submitMessage = 'Thank you for your message! I\'ll get back to you soon.';
        this.resetForm();
        this.isSubmitting = false;
      })
      .catch((error) => {
        console.error('Error submitting message:', error);
        this.submitMessage = 'Sorry, there was an error sending your message. Please try again.';
        this.isSubmitting = false;
      });
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}