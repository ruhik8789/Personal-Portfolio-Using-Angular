// Script to add sample data to Firebase
// Run this with: node add-sample-data.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyA8X-C9YJW7x1KLUbbneKBj7eO3TIRdgho",
  authDomain: "portfolio-34709.firebaseapp.com",
  databaseURL: "https://portfolio-34709-default-rtdb.firebaseio.com",
  projectId: "portfolio-34709",
  storageBucket: "portfolio-34709.firebasestorage.app",
  messagingSenderId: "825589342614",
  appId: "1:825589342614:web:0500147476b68a6d5c3db7",
  measurementId: "G-PE546EW7R2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProjects = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform built with Angular, featuring user authentication, product catalog, shopping cart, and payment integration.",
    technologies: ["Angular", "TypeScript", "Firebase", "Stripe"],
    githubUrl: "https://github.com/username/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.com",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    technologies: ["React", "Redux", "Socket.io", "MongoDB"],
    githubUrl: "https://github.com/username/task-manager",
    liveUrl: "https://taskmanager-demo.com",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Weather Dashboard",
    description: "A responsive weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics using multiple APIs.",
    technologies: ["JavaScript", "API", "Chart.js", "CSS3"],
    githubUrl: "https://github.com/username/weather-dashboard",
    liveUrl: "https://weather-demo.com",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Personal Blog",
    description: "A modern blog platform with CMS functionality, markdown support, and SEO optimization built with Angular and Node.js.",
    technologies: ["Angular", "Node.js", "MongoDB", "Markdown"],
    githubUrl: "https://github.com/username/personal-blog",
    liveUrl: "https://blog-demo.com",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Real-time Chat App",
    description: "A real-time messaging application with group chat, file sharing, and emoji reactions using WebSocket technology.",
    technologies: ["React", "Socket.io", "Express", "JWT"],
    githubUrl: "https://github.com/username/chat-app",
    liveUrl: "https://chat-demo.com",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Memory Game",
    description: "An interactive memory card game with multiple difficulty levels, score tracking, and smooth animations using vanilla JavaScript.",
    technologies: ["JavaScript", "CSS3", "HTML5", "Canvas"],
    githubUrl: "https://github.com/username/memory-game",
    liveUrl: "https://memory-demo.com",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

async function addSampleData() {
  try {
    console.log('Adding sample projects to Firebase...');
    
    for (const project of sampleProjects) {
      const docRef = await addDoc(collection(db, 'projects'), project);
      console.log(`Added project: ${project.title} with ID: ${docRef.id}`);
    }
    
    console.log('✅ All sample data added successfully!');
    console.log('You can now run your Angular app and see the projects loaded from Firebase.');
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

addSampleData();
