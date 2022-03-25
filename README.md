# 1. Introduction
- Libray ReactJS v17.0.2. Boilderplate by TypeScript Create React App
- Customization by craco
- UI Framework: TAILWIND & CSS: using autoprefixer 
- Unit test by: Jest & Enzyme

# 2. Preparation before setup source:
- Install NodeJS. Suggestion version v14.6.0
- Install Yarn. Suggest version 1.22.10
- Install Chrome extendsion: React Context DevTool (optional)
- Install Chrome extendsion: React Developer Tools (optional)
# 2. How to run:
- Step 1: Clone source SSH: git@gitlab.com:oneononeenglish/ooolab-cms.git 
- Step 2: Install
### `yarn install`
- Step 3: Run on localhost:3000
### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

- Step 4: Snapshopt & Unit test
### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- Step 5: PRODUCTION Building
### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn format`

Make code cleanner and easier to discover

### `yarn lint`

Detect warning error by eslint

# 3. Rule of Code

# Pull request to merged code:
# Code commit convention:
- feat      :   A new feature
- fix/hotfix:   A bug fix
- docs      :   Documentation only changes
- style     :   Changes that do not affect the meaning of code
                (white-space, formatting, missing semi-colons, etc)
- refactor  :   A code change that neither fixes a bug or adds a feature
- perf      :   A code change that improves performance
- test      :   Adding missing tests      
- chores    :   Changes to the build process or auxiliary tools and libraries such as documentation generation

# Code commit phase
- INIT      : Start ticket
- WIP       : Word In Progressing
- FN        : Ticket was finished but it does not be reviewed
- RV        : Ticket is being reviewed
- DONE      : Passed review code
- REMOVE    : branch/ticket was removed on repository

# Get start code step by step:
1. Create a branch name: git checkout -b <set_branch>
2. Format name of branch: <code_commit_convention_name>/<ticket_id>/<ticket_title>

Format a commit: "<phase_name>-<code_commit_convention_name>:<ticket_id>/<ticket_title>/<action_description>"

---


