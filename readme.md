# Diva AC - Car Air Conditioning Services

A modern web application for Diva AC, providing premium car AC services and high-quality spare parts. Built with Laravel, React, Inertia.js, and styled with Tailwind CSS and Framer Motion.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your local machine:
- [PHP](https://www.php.net/) (v8.1 or higher)
- [Composer](https://getcomposer.org/) (PHP package manager)
- [Node.js & npm](https://nodejs.org/) (JavaScript runtime and package manager)
- [MySQL/SQLite](https://www.mysql.com/) or any supported database

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/diva-ac.git
cd diva-ac
```

**2. Install PHP dependencies**
```bash
composer install
```

**3. Install Node.js dependencies**
```bash
npm install
```

**4. Setup Environment File**
Copy the example environment file and create your own `.env` file:
```bash
cp .env.example .env
```
*(Note: If you are using Windows Command Prompt, use `copy .env.example .env` instead)*

**5. Generate Application Key**
```bash
php artisan key:generate
```

**6. Setup the Database**
Configure your database credentials in the newly created `.env` file (e.g., `DB_CONNECTION`, `DB_DATABASE`, etc.), then run the migrations:
```bash
php artisan migrate
```

---

## 💻 Running the Application

To run the application locally, you need to start **both** the backend (Laravel) and the frontend (Vite/React) development servers simultaneously.

**1. Start the Frontend Development Server**
In your first terminal window, run:
```bash
npm run dev
```

**2. Start the Backend Development Server**
Open a **second** terminal window and run:
```bash
php artisan serve
```

Your application should now be accessible at [http://localhost:8000](http://localhost:8000).

## 🛠️ Tech Stack

- **Backend:** Laravel
- **Frontend:** React, Inertia.js
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D Graphics:** React Three Fiber & Drei

---
*Created for Diva AC.*
