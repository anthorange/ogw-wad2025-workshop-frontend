# WeAreDevelopers World Congress 2025
## Workshop's Frontend Application

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)

## Setting up Environment Variables

1. Create a `.env` file in the root of the project if it does not exist.
2. Add your environment variables in the following format:

```
VITE_API_GATEWAY=<URL to the Vonage API Gateway>
VITE_CLIENT_ID=<as provisioned by Vonage>
VITE_BACKEND_URL=<where you started your backend server at>
VITE_NV_SCOPE="dpv:FraudPreventionAndDetection#number-verification-verify-read"
```

- All environment variables used in the Vite app must be prefixed with `VITE_`.
- You can create different files for different environments, e.g., `.env.development`, `.env.production`.
- The Number Verification API requires the `dpv:FraudPreventionAndDetection#number-verification-verify-read` scope to be set in the `VITE_NV_SCOPE` variable, following the [CAMARA](https://github.com/camaraproject) standard scope.

## Running the App

1. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

2. Start the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

3. Open your browser and go to the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173)).

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details.

## Other resources

Check the workshop's full project, abstract and other repos at [Workshop: "Integrating Open Gateway in your application to shift to a better sign-up experience"](https://github.com/Telefonica/ogw-wad2025-workshop).
