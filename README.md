# ColYrself
This project is a web-based real-time video meeting application developed as part of an engineering thesis. The goal of the application is to enable users to schedule and conduct online meetings with real-time audio and video communication directly in a web browser.

The system is based on a client-server architecture and utilizes modern web technologies, including WebRTC for peer-to-peer media streaming and SignalR for real-time signaling and synchronization between participants.

## Backend
The backend of the application is built using ASP.NET Core. It handles user authentication, meeting scheduling, and signaling for WebRTC connections. The backend also manages the storage of meeting data and user information in a database.

## Frontend 
The frontend is developed using TypeScript and React. It provides a user-friendly interface for scheduling meetings, joining ongoing sessions, and managing audio/video settings. The frontend communicates with the backend via RESTful APIs and SignalR for real-time updates. Styling is done using shadcn/ui components and Tailwind CSS.

## Requirements
- .NET 8
- Node.js 18 or higher
## Setup Instructions
Below are the steps to set up and run the ColYrself application locally.
### Backend
```bash
cd ColYrself
dotnet run --urls https://localhost:5142
```
### Frontend
```bash
cd ColYrself/Client
npm install
npm run dev
```
The app will be accessible at `http://localhost:5173`.