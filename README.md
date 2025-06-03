# Real-Time Quiz App

A dynamic real-time quiz application that enables interactive learning through live quizzes and instant feedback. Built with Spring Boot and React, this platform offers seamless quiz management and participation experience.

## Developer

**RISHABH KUMAR**
- 🎓 Full Stack Developer
- 💻 Tech Enthusiast
- 🌐 [LinkedIn](www.linkedin.com/in/rishabh-kumar-1124a8256)
- 📧 [Email](hs3189028@gmail.com)
- 🐱 [GitHub](https://github.com/R1shabhKumar)

## About The Project

I developed this project to create an engaging platform for real-time quiz interactions. The application combines modern web technologies to deliver a smooth user experience for both quiz administrators and participants.

### My Role
- Designed and implemented the full-stack architecture
- Developed the Spring Boot backend with WebSocket integration
- Created the responsive React frontend
- Implemented real-time features using STOMP WebSocket
- Set up the authentication system
- Managed database design and implementation

## Features I've Implemented

- 🔄 Real-time quiz participation system
- 📊 Live leaderboard updates
- 👑 Admin dashboard for quiz management
- 🔐 Secure user authentication
- ⚡ Interactive quiz interface
- 📱 Responsive design
- 📈 Automatic score tracking
- 🌐 WebSocket integration

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS
- WebSocket (STOMP)
- React Router
- Framer Motion
- Axios

### Backend
- Spring Boot
- WebSocket (STOMP)
- Spring Security
- Java 17+
- Maven

## Getting Started

### Prerequisites

- Node.js (v16+)
- Java Development Kit (JDK) 17+
- Maven
- MySQL/PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/real-time-quiz-app.git
```

2. Backend Setup
```bash
cd Backend/quizapp
mvn clean install
mvn spring-boot:run
```

3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Admin Endpoints
- `POST /api/admin/quiz/create` - Create quiz
- `POST /api/admin/quizzes` - Get admin's quizzes
- `POST /api/admin/quiz/update` - Update quiz
- `GET /api/admin/quiz/delete` - Delete quiz
- `GET /api/admin/leaderboard/{quizId}` - Get leaderboard

### WebSocket Topics
- `/topic/scores/{quizId}` - Real-time scores
- `/topic/leaderboard/{quizId}` - Live leaderboard

## Future Enhancements

I'm planning to add:
- Multiple quiz formats
- Advanced analytics dashboard
- Team quiz mode
- Custom themes
- Mobile application

## Contact

For any queries regarding the project:
[Email](hs3189028@gmail)
- [LinkedIn](www.linkedin.com/in/rishabh-kumar-1124a8256)


## License

This project is licensed under the MIT License - see the LICENSE file for details.
