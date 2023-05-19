# Firebase for Blueprint (Document in progress)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1929703e04374dfc92d5056c1790e6aa)](https://app.codacy.com/gh/blueprinthub/blueprint-firebase/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

Short description of your project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before setting up the project, you need to have the following tools installed:

- **Node.js** runtime environment (version 8 or higher)
- **Firebase CLI** tools

### Installing

1. Clone this repository to your local machine.
```
git clone https://github.com/blueprinthub/firebase-blueprint.git
```

2. Navigate to the project directory.
```
cd firebase-blueprint
```

3. Install the required packages.
```
npm install
```

### Configuration

1. Create a new Firebase project on the [Firebase Console](https://console.firebase.google.com/).

2. Set up Firebase Authentication, Firestore, and Functions in the console.

3. Log in to Firebase from the CLI and select your Firebase project to associate this project with your Firebase app.
```
firebase login
```

4. Associate this project with your Firebase app.
```
firebase use --add
```

5. Follow the prompt to select your Firebase project.

6. Copy the configuration values for your Firebase project's web app.

7. Create a new file named `.env.local` in the root directory and paste the following values:
```
FIREBASE_API_KEY=<YOUR_API_KEY>
FIREBASE_AUTH_DOMAIN=<YOUR_PROJECT_ID>.firebaseapp.com
FIREBASE_DATABASE_URL=https://<YOUR_PROJECT_ID>.firebaseio.com
FIREBASE_PROJECT_ID=<YOUR_PROJECT_ID>
FIREBASE_STORAGE_BUCKET=<YOUR_PROJECT_ID>.appspot.com
FIREBASE_MESSAGING_SENDER_ID=<YOUR_SENDER_ID>
FIREBASE_APP_ID=<YOUR_APP_ID>
```

### Deployment

#### Hosting
1. Run the following command to deploy your app to Firebase Hosting:
```
firebase deploy --only hosting
```

2. Visit the URL provided by Firebase Hosting.

#### Functions
1. Deploy your functions using the following command:
```
firebase deploy --only functions
```

#### Firestore
1. Import your data using the following command:
```
firebase firestore:import --json src/data.json
```

### Testing

1. Run the following command to test your functions:
```
npm test
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct.

## Built With

- Firebase
- Node.js

## Authors

- Javier Alejandro Valdes - [GitHub](https://github.com/jvaldesgonzalez)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
