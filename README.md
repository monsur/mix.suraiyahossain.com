# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The biggest development since this README was first written: AI. If you get stuck, ask Claude for help.

## First time

Update Node and npm

`nvm ls-remote`

`nvm install node`

`npm install -g npm@latest`

Remove old deps

`rm -rf node_modules`

`rm package-lock.json`

Update packages

`npm i -g npm-check-updates`

`ncu -u`

`npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm run deploy`

Pushes the site to the gh-pages branch.

## Adding a new year

 * Update node and deps (see above)
 * Create a new folder with the year under public/years
 * Add front.jpg and back.jpg album art into the new folder. Size: 1500 x 1500
 * Create a new data.json file into the new folder.
 * Use AI to extract track names from back.jpg into the correct json format.
 * Run `node create_track_names.js {YEAR}` to add an `src` field with the track filename to the json.
 * Rename each MP3 file to those file names
 * Edit MP3 ID3 tags
 * Create a zip of MP3s titled year.zip
 * Upload all that to S3.
 * Update src/Globals.ts to the latest year

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
