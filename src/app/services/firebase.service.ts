import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: any;
  updatedAt: any;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: any;
  private db: any;
  private storage: any;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  // Project CRUD operations
  getProjects(): Observable<Project[]> {
    return new Observable(observer => {
      const projectsRef = collection(this.db, 'projects');
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      
      onSnapshot(q, (snapshot) => {
        const projects: Project[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Project;
          projects.push({ id: doc.id, ...data });
        });
        observer.next(projects);
      }, (error) => {
        observer.error(error);
      });
    });
  }

  getProject(id: string): Observable<Project | undefined> {
    return new Observable(observer => {
      const projectRef = doc(this.db, 'projects', id);
      onSnapshot(projectRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Project;
          observer.next({ id: snapshot.id, ...data });
        } else {
          observer.next(undefined);
        }
      }, (error) => {
        observer.error(error);
      });
    });
  }

  async addProject(project: Project): Promise<any> {
    const timestamp = Timestamp.now();
    project.createdAt = timestamp;
    project.updatedAt = timestamp;
    
    const projectsRef = collection(this.db, 'projects');
    return await addDoc(projectsRef, project);
  }

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    project.updatedAt = Timestamp.now();
    const projectRef = doc(this.db, 'projects', id);
    return await updateDoc(projectRef, project);
  }

  async deleteProject(id: string): Promise<void> {
    const projectRef = doc(this.db, 'projects', id);
    return await deleteDoc(projectRef);
  }

  // Contact message operations
  async addMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<any> {
    const timestamp = Timestamp.now();
    const newMessage: ContactMessage = {
      ...message,
      createdAt: timestamp,
      read: false
    };
    
    const messagesRef = collection(this.db, 'messages');
    return await addDoc(messagesRef, newMessage);
  }

  getMessages(): Observable<ContactMessage[]> {
    return new Observable(observer => {
      const messagesRef = collection(this.db, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      
      onSnapshot(q, (snapshot) => {
        const messages: ContactMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as ContactMessage;
          messages.push({ id: doc.id, ...data });
        });
        observer.next(messages);
      }, (error) => {
        observer.error(error);
      });
    });
  }

  async markMessageAsRead(id: string): Promise<void> {
    const messageRef = doc(this.db, 'messages', id);
    return await updateDoc(messageRef, { read: true });
  }

  async deleteMessage(id: string): Promise<void> {
    const messageRef = doc(this.db, 'messages', id);
    return await deleteDoc(messageRef);
  }

  // File upload operations
  async uploadFile(file: File, path: string): Promise<string> {
    const filePath = `${path}/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);
    
    try {
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    const fileRef = ref(this.storage, path);
    return await deleteObject(fileRef);
  }
}