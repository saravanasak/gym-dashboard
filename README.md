Gym Management System Development Guide
This README serves as a step-by-step guide for the development of the Gym Management System using Next.js, Supabase, and other related tools. It outlines all the features implemented so far, including detailed instructions, decisions, and progress made for the project.

Overview
The Gym Management System is built to manage gym operations, including users, membership plans, equipment, payments, and reports. We use Next.js for the front-end and Supabase for the back-end database and authentication. Below are the steps taken to develop this system so far, along with the features implemented.

Features Implemented So Far
1. User and Role Management
Implemented a login system with role-based access for customers, staff, and admins.
Added functionality for admins to manage users, including adding, editing, deleting users, and updating user roles.
Users are assigned a unique Member ID (e.g., MEM01) that increments automatically for each new user.
2. Plan Management
Created a page for managing gym subscription plans where admins can add, edit, delete plans.
Each plan is assigned a unique Plan ID (e.g., SUB01) that increments automatically.
3. Equipment Management
Added the ability for admins to manage gym equipment, including adding new equipment and updating their status (e.g., available, not available, good, bad, discarded).
4. Payment History
Implemented a payment history section for recording payments made by members.
Added the ability to search users by name when adding a new payment.
Payments are assigned a unique Transaction ID (e.g., PAID01) that increments automatically.
Modified the payment list to show the latest payments first.
5. UI Enhancements
Improved the UI for better readability and user interaction.
Added search functionality for selecting users by name, displaying the Member ID alongside.
6. Database Integration
Connected to Supabase for data handling and integrated MySQL for local development.
Ensured data operations such as adding users, payments, plans, and updating details are functional.
Steps Completed
1. Project Setup
Initialized a Next.js Project: Created the project using Next.js, TypeScript, and used VS Code for the development environment.
Installed Dependencies: Dependencies such as supabase-js for database interaction, bcryptjs for password hashing, etc., were installed.
Configured Supabase: Set up Supabase as our backend and added the .env.local file to securely store Supabase configuration details.
2. Database Setup in Supabase
Created the following tables in Supabase:
Users: To store user details including name, status, role, username, password, and member_id.
Plans: To manage membership plans offered by the gym.
Equipment: To store information related to gym equipment.
Payments: To track payment history of gym users.
3. User Management
Unique Member ID: Implemented unique member_id for each user with the format MEM01, incremented automatically for every new user.
Role-based Access Control: All signups are treated as customers by default, and only an admin can change user roles from the admin dashboard.
Signup Functionality: Users can create accounts using a signup page. Passwords are hashed before being stored in the database.
Role Assigned on Signup: Default role set as customer. Admins can change roles later.
4. Admin Dashboard
Manage Users: Admins can view all users, edit user roles (change from customer to staff or admin), and deactivate users.
Manage Plans: Added functionality for admins to create, edit, and delete membership plans. Each plan has attributes such as name, duration, price, and status (active/inactive).
Manage Equipment: Admin can add, update, or remove equipment from the inventory.
Reports: Admins can view key statistics such as total users, total active plans, and total equipment in the gym.
Manage Payments: Added a page to view and add payment records, including payment amounts, dates, users, and plans.
5. Staff Dashboard
Manage Payments: Staff can view all payments and update payment statuses.
Manage Equipment: Staff can update the status of equipment (e.g., under maintenance).
Customer Management: Staff can view customer information but cannot edit user roles or other sensitive details.
6. Customer Dashboard
Profile Details: Customers can view their personal details including name and status.
Membership Plan: View the subscribed membership plan details, including duration and expiry date.
Payment History: View their payment records and make new payments for renewals.
7. Features Implemented for Login and Signup
Signup Page: Implemented a signup page where all new users are treated as customers.
Removed the Role Selection: All users are assigned the customer role by default.
Login Page: Implemented a login page using usernames and passwords. Users are redirected to appropriate dashboards (admin, staff, or customer) based on their roles.
8. Preventing Duplicate Entries
Unique Username: Enforced unique constraints on usernames to prevent duplicate entries.
Duplicate Member ID Prevention: Added logic to increment member_id automatically to ensure uniqueness.
9. Current Progress and Next Steps
We have implemented the core functionalities of the Admin, Staff, and Customer dashboards, each with role-specific access.
Next Steps: Focus on individual dashboard features for each role:
Admin Dashboard: Add advanced features for managing users, plans, equipment, and reports.
Staff Dashboard: Improve functionalities for managing payments and equipment.
Customer Dashboard: Enhance the user experience by adding payment options and profile management features.
Technology Stack
Front-end: Next.js (React Framework)
Database: Supabase (PostgreSQL)
Backend: Supabase for database interactions and authentication
Others: bcryptjs for password hashing
How to Continue the Development
Follow the instructions outlined for each dashboard role to add new features or modify existing ones.
Use the Admin Dashboard to assign roles, manage users, and update plans or payments.
Test each new feature using the local development environment before deploying.
This README will be continuously updated as we add more features to the Gym Management System.

Getting Started
First, run the development server:

bash
Copy code
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying pages/index.tsx. The page auto-updates as you edit the file.

API routes can be accessed on http://localhost:3000/api/hello. This endpoint can be edited in pages/api/hello.ts.

The pages/api directory is mapped to /api/*. Files in this directory are treated as API routes instead of React pages.

This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.

Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.
Learn Next.js - an interactive Next.js tutorial.
You can check out the Next.js GitHub repository - your feedback and contributions are welcome!

Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.

