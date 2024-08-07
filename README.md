# KIMO assignment

## Description

web application designed to manage and display online courses. Built with a modern tech stack, this application allows users to view course listings, get detailed information about specific courses and chapters, and rate the chapters based on their experience.

## Features

- **Course Listing:** View all available courses with options to sort by title, date, or rating, and filter by domain.
- **Course Overview:** Access detailed information about each course, including descriptions and chapters.
- **Chapter Details:** Read chapter content and submit ratings for each chapter (positive or negative).
- **Responsive Design:** Built with Tailwind CSS for a responsive user interface.
- **Containerization:** Fully containerized using Docker, allowing for easy deployment and scalability.

## Tech Stack

- **Frontend:**
  - React.js
  - Vite
  - Tailwind CSS
- **Backend:**
  - FastAPI
  - MongoDB (Cloud)
- **Containerization:**
  - Docker
  - Docker Compose

## Installation

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Python](https://www.python.org/downloads/) (version 3.7 or higher)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

### Clone the Repository

```bash
git clone https://github.com/pratikdhame/kimo.git
cd kimo
docker-compose build
docker-compose up


