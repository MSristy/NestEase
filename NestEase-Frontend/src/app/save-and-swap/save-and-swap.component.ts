import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface SwapItem {
  id: number;
  title: string;
  category: string;
  transactionType: string;
  price: number;
  condition: string;
  description: string;
  location: string;
  imageUrl?: string;
  createdAt: Date;
}

@Component({
  selector: 'app-save-and-swap',
  templateUrl: './save-and-swap.component.html',
  styleUrls: ['./save-and-swap.component.css']
})
export class SaveAndSwapComponent implements OnInit {
  items: SwapItem[] = [];
  showAddForm = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  formData = {
    title: '',
    category: '',
    transactionType: '',
    price: 0,
    condition: '',
    description: '',
    location: '',
    imageUrl: ''
  };
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    console.log('Loading items from:', `${environment.apiUrl}/add-swap`);
    this.http.get<SwapItem[]>(`${environment.apiUrl}/add-swap`)
      .subscribe({
        next: (data) => {
          console.log('Items loaded successfully:', data);
          this.items = data;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading items:', error);
          this.errorMessage = `Failed to load items: ${error.message}`;
        }
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    this.errorMessage = '';
    console.log('Form submitted with data:', this.formData);
    
    if (!this.formData.title || !this.formData.category || !this.formData.transactionType || 
        !this.formData.price || !this.formData.condition || !this.formData.description || 
        !this.formData.location) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    try {
      let imageUrl = '';
      
      if (this.selectedFile) {
        console.log('Uploading image...');
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        
        try {
          const uploadResponse = await this.http.post<{imageUrl: string}>(`${environment.apiUrl}/upload`, formData).toPromise();
          if (uploadResponse) {
            imageUrl = uploadResponse.imageUrl;
            console.log('Image uploaded successfully:', imageUrl);
          }
        } catch (uploadError: any) {
          console.error('Error uploading image:', uploadError);
          this.errorMessage = `Failed to upload image: ${uploadError.message}`;
          return;
        }
      }

      const swapData = {
        ...this.formData,
        imageUrl: imageUrl || undefined
      };

      console.log('Submitting swap data to:', `${environment.apiUrl}/add-swap`);
      console.log('Swap data:', swapData);
      
      const response = await this.http.post<SwapItem>(`${environment.apiUrl}/add-swap`, swapData).toPromise();
      
      if (response) {
        console.log('Swap item created successfully:', response);
        this.items.push(response);
        this.showAddForm = false;
        this.resetForm();
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      this.errorMessage = `Failed to submit form: ${error.message}`;
    }
  }

  resetForm() {
    this.formData = {
      title: '',
      category: '',
      transactionType: '',
      price: 0,
      condition: '',
      description: '',
      location: '',
      imageUrl: ''
    };
    this.selectedFile = null;
    this.imagePreview = null;
    this.errorMessage = '';
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }
} 
