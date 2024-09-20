<body>
    <header>
        <h1>Patient Appointment Booking App</h1>
        <p>The Patient Appointment System is a modern, efficient full-stack web application designed to streamline the
            process of managing patient appointments in healthcare facilities. Built with cutting-edge technologies for
            both frontend and backend, this system offers a user-friendly interface for both patients and healthcare
            providers, enhancing the overall appointment scheduling experience.</p>
    </header>
    <section id="table-of-contents">
        <h2>Table of Contents</h2>
        <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#technologies">Technologies</a></li>
            <li><a href="#development-tools">Development Tools</a></li>
            <li><a href="#outcome">Outcome</a></li>
            <li><a href="#test-coverage">Test Coverage</a></li>
            <li><a href="#contributing">Contributing</a></li>
            <li><a href="#license">License</a></li>
        </ul>
    </section>
    <section id="features">
        <h2>Features</h2>
        <p>Key features covered in this repository:</p>
        <ul>
            <li><strong>User Authentication:</strong>User Authentication: Secure login and registration system for
                patients and healthcare providers.</li>
            <li><strong>Appointment Scheduling:</strong> Easy-to-use interface for booking, rescheduling, and canceling
                appointments.</li>
            <li><strong>Real-time Updates:</strong> Instant notifications for appointment confirmations and reminders.
            </li>
            <li><strong>Interactive Map:</strong> Integration with Leaflet for location-based services.</li>
            <li><strong>Responsive Design:</strong> Seamless experience across desktop and mobile devices.</li>
        </ul>
    </section>
    <section id="technologies">
        <h2>Technologies</h2>
        <h3>Frontend</h3>
        <ul>
            <li><strong>React:</strong> A JavaScript library for building user interfaces.</li>
            <li><strong>TypeScript:</strong> Adds static typing to JavaScript for improved developer experience.</li>
            <li><strong>Redux Toolkit:</strong> State management for React applications.</li>
            <li><strong>React Router:</strong> Declarative routing for React applications.</li>
            <li><strong>Axios:</strong> Promise-based HTTP client for making API requests.</li>
            <li><strong>JWT Decode:</strong> Decoding JSON Web Tokens for authentication.</li>
            <li><strong>Leaflet:</strong> Open-source JavaScript library for mobile-friendly interactive maps.</li>
            <li><strong>React Toastify:</strong> Add notifications to your app with ease.</li>
            <li><strong>Redux Persist:</strong> Persist and rehydrate a Redux store.</li>
        </ul>
        <h3>Backend</h3>
        <ul>
            <li><strong>Node.js:</strong> JavaScript runtime built on Chrome's V8 JavaScript engine.</li>
            <li><strong>Express:</strong> Web application framework for Node.js.</li>
            <li><strong>MongoDB:</strong> NoSQL database for storing application data.</li>
            <li><strong>Mongoose:</strong> MongoDB object modeling for Node.js.</li>
            <li><strong>JSON Web Token:</strong> Securely transmitting information between parties as a JSON object.
            </li>
            <li><strong>Bcrypt:</strong> Library for hashing passwords.</li>
            <li><strong>AWS SDK:</strong> For integrating with Amazon Web Services (S3 for file storage).</li>
            <li><strong>Multer & Multer-S3:</strong> Middleware for handling multipart/form-data and uploading to S3.
            </li>
            <li><strong>Nodemailer:</strong> Send emails from Node.js.</li>
            <li><strong>Express Rate Limit:</strong> Basic rate-limiting middleware for Express.</li>
            <li><strong>Helmet:</strong> Helps secure Express apps by setting various HTTP headers.</li>
            <li><strong>CORS:</strong> Enable CORS with various options.</li>
            <li><strong>Morgan:</strong> HTTP request logger middleware.</li>
            <li><strong>Dotenv:</strong> Loads environment variables from a .env file.</li>
        </ul>
    </section>
    <section id="development-tools">
        <h2>Development Tools</h2>
        <ul>
            <li><strong>Vite:</strong> Next generation frontend tooling for faster development.</li>
            <li><strong>ESLint:</strong> Linting utility for JavaScript and TypeScript.</li>
            <li><strong>Jest:</strong> JavaScript Testing Framework.</li>
            <li><strong>React Testing Library:</strong> Testing utilities for React.</li>
            <li><strong>MSW (Mock Service Worker):</strong> API mocking library for browser and Node.js.</li>
        </ul>
    </section>
    <section id="getting-started">
        <h2>Getting Started</h2>
        <p>To get started with the repository, follow these steps:</p>
        <h3>Installation</h3>
        <ol>
            <li>Clone the repository to your local machine using the following command:</li>
            <code>git clone git clone https://github.com/your-username/patient-appointment-system.git</code>
            <li>Navigate to the project directory:</li>
            <code>cd patient-appointment-system</code>
            <li>Install dependencies for both frontend and backend:
            </li>
            <code>cd frontend && npm install</code><br>
            <code>cd ../backend && npm install</code>
            <li>Set up your environment variables:
                Create a .env file in the backend directory<br>
                Add necessary environment variables (database URL, AWS credentials, etc.)</li>
            <li>Start the development server:</li>
            <code># In the backend directory</code><br>
            <code>npm run dev</code><br>
            <code># In the frontend directory</code><br>
            <code>npm run dev</code><br>
            <h3>Testing</h3>
            <li>Run the test suite using npm:</li>
            <code>npm test</code>
        </ol>
    </section>
    <section id="outcome">
        <h1>Outcome</h1>
        <p>To experience the application you can use following email and password:</p><br>
        <p><strong>email:</strong> alice@test.com<br>
            <strong>password:</strong> Newpass123.
        </p>
        <p>Reach outcome site <a href="https://patientappointmentsystem.netlify.app/">here</a> </p>
        <img src="https://github.com/asyylz/PatientAppointment-App/blob/b1e1840e120af6e57ebcfe8e52364754f0c2b6e2/frontend/public/outcome.gif"
            alt="">
    </section>
    <section id="test-coverage">
        <h1>Test Coverage</h1>
        <img src="https://github.com/asyylz/PatientAppointment-App/blob/f2c602753c804d079f925a7609d2d2ed7ba98199/frontend/public/coverage-report.jpeg"
            alt="">
    </section>
    <footer>
        <h2>Contributing</h2>
        <p>Contributions to the project are welcome! If you find any issues or have suggestions for improvements, please
            feel free to open an issue or submit a pull request.</p>
        <h2>License</h2>
        <p>This project is licensed under the MIT License.</p>
    </footer>
</body>