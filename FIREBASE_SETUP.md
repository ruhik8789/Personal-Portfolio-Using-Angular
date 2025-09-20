# Firebase Setup Guide for Angular Portfolio

## Overview
This guide will help you set up Firebase for your Angular portfolio project to store and fetch data.

## Prerequisites
- Node.js and npm installed
- Angular CLI installed
- Firebase account (free tier available)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "portfolio-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Configure Firebase for Web

1. In your Firebase project dashboard, click the web icon (`</>`)
2. Register your app with a nickname (e.g., "portfolio-web")
3. Copy the Firebase configuration object
4. Replace the placeholder values in `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your actual Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  }
};
```

## Step 3: Set up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database
5. Click "Done"

## Step 4: Set up Firebase Storage (Optional)

1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select a location for your storage
5. Click "Done"

## Step 5: Configure Security Rules

### Firestore Rules
Go to Firestore Database > Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to projects
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Allow write access to messages (contact form)
    match /messages/{document} {
      allow read: if request.auth != null; // Only authenticated users can read
      allow write: if true; // Anyone can send messages
    }
  }
}
```

### Storage Rules
Go to Storage > Rules and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 6: Test the Integration

1. Start your Angular development server:
   ```bash
   ng serve
   ```

2. Navigate to your contact page and try submitting a form
3. Check Firebase Console > Firestore Database to see if the message was stored
4. Navigate to your projects page to see if projects are loaded from Firebase

## Available Firebase Services

### FirebaseService Methods

#### Project Management
- `getProjects()`: Get all projects
- `getProject(id)`: Get a specific project
- `addProject(project)`: Add a new project
- `updateProject(id, project)`: Update an existing project
- `deleteProject(id)`: Delete a project

#### Contact Messages
- `addMessage(message)`: Add a new contact message
- `getMessages()`: Get all messages (admin use)
- `markMessageAsRead(id)`: Mark message as read
- `deleteMessage(id)`: Delete a message

#### File Storage
- `uploadFile(file, path)`: Upload a file to Firebase Storage
- `deleteFile(path)`: Delete a file from Firebase Storage

## Data Structure

### Project Document
```typescript
{
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Contact Message Document
```typescript
{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  read: boolean;
}
```

## Usage Examples

### Adding a Project
```typescript
const newProject: Project = {
  title: "My Awesome Project",
  description: "A description of my project",
  technologies: ["Angular", "Firebase", "TypeScript"],
  githubUrl: "https://github.com/username/repo",
  liveUrl: "https://myproject.com"
};

this.firebaseService.addProject(newProject);
```

### Uploading an Image
```typescript
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const file = fileInput.files[0];

if (file) {
  this.firebaseService.uploadFile(file, 'project-images')
    .then(url => {
      console.log('File uploaded:', url);
      // Use the URL in your project
    })
    .catch(error => {
      console.error('Upload failed:', error);
    });
}
```

## Security Considerations

1. **Environment Variables**: Never commit your Firebase config with real API keys to version control
2. **Security Rules**: Always set up proper Firestore and Storage rules
3. **Authentication**: Consider adding user authentication for admin features
4. **Data Validation**: Validate data on both client and server side

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your domain is added to Firebase authorized domains
2. **Permission Denied**: Check your Firestore security rules
3. **Module Not Found**: Ensure all Firebase packages are properly installed
4. **Configuration Errors**: Verify your Firebase config matches your project settings

### Debug Mode
Enable debug mode in your environment files:
```typescript
export const environment = {
  production: false,
  firebase: {
    // ... your config
  },
  debug: true // Add this for debugging
};
```

## Next Steps

1. Set up Firebase Authentication for admin features
2. Implement real-time updates using Firestore listeners
3. Add data validation and error handling
4. Set up Firebase Hosting for deployment
5. Configure Firebase Analytics for usage tracking

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [AngularFire Documentation](https://github.com/angular/angularfire)
- [Firebase Console](https://console.firebase.google.com/)
