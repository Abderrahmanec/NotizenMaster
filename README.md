# NotizenMaster

**NotizenMaster** ist eine Webanwendung, die es Benutzern ermöglicht, Notizen zu erstellen, zu bearbeiten und zu löschen. Die Anwendung bietet ein sicheres Login-System und ermöglicht das Hinzufügen von Bildern und Tags zu Notizen. Die Anwendung ist in zwei Hauptteile unterteilt: **Frontend** (mit ReactJS und Material UI) und **Backend** (mit Spring Boot).

## Projektstruktur

Das Projekt besteht aus zwei Hauptordnern:

1. **frontend/**: Enthält die Logik für das Frontend der Anwendung.
   - Entwickelt mit **ReactJS** und **Material UI**.
   - Verwaltet die Benutzeroberfläche für das Erstellen, Bearbeiten, Löschen von Notizen und Benutzeranmeldung.
   - Axios wird verwendet, um Anfragen an das Backend zu stellen.

2. **backend/**: Enthält die Logik für das Backend der Anwendung.
   - Entwickelt mit **Spring Boot** und **Java 17**.
   - Bietet RESTful APIs für die Verwaltung von Notizen und Benutzerdaten.
   - Authentifizierung erfolgt mit **Spring Security** und **JWT**.

## Funktionen

- **Notizen erstellen, bearbeiten und löschen**: Benutzer können Notizen hinzufügen, bestehende Notizen bearbeiten und löschen.
- **Login-System**: Sicheres Benutzer-Login mit JWT-Token und Passwort-Management.
- **Bilder und Tags für Notizen**: Benutzer können Bilder und Tags zu ihren Notizen hinzufügen.
- **Responsive Design**: Die Anwendung ist für Desktop- und mobile Geräte optimiert.
- **JWT-Authentifizierung**: Sicherer Zugriff auf die API mit JSON Web Token.

## Installation

### Voraussetzungen

Stelle sicher, dass du die folgenden Tools auf deinem Computer installiert hast:

- **Java 17** oder höher (für das Spring Boot Backend).
- **Node.js** und **npm** (für das React-Frontend).

### Backend installieren

1. Navigiere in den `backend/`-Ordner:
    ```bash
    cd backend
    ```

2. Installiere die erforderlichen Abhängigkeiten und starte das Backend:

    ```bash
    mvn install
    mvn spring-boot:run
    ```

    Der Server läuft nun auf `http://localhost:8080`.

### Frontend installieren

1. Navigiere in den `frontend/`-Ordner:
    ```bash
    cd frontend
    ```

2. Installiere die erforderlichen Abhängigkeiten:

    ```bash
    npm install
    ```

3. Starte die Anwendung:

    ```bash
    npm start
    ```

    Das Frontend wird dann auf `http://localhost:3000` laufen.

## Nutzung

- Um Notizen hinzuzufügen, zu bearbeiten oder zu löschen, melde dich mit deinem Benutzerkonto an.
- Du kannst Tags zu Notizen hinzufügen und Bilder hochladen, um deine Notizen besser zu organisieren.


## Autor

- **Mohamed Cheikh** -
