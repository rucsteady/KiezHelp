# KiezHelp

During difficult times like these the most vulnerable people — the elderly, people
with disabilities, or perhaps single parents — in our communities need help with
everyday tasks such as grocery shopping or getting medicine from the pharmacy,
or maybe they just wish to chat with someone on the phone to ease the
loneliness. 
The purpose of `KiezHelp` is to enable and encourage people to help each other.
It lets people register as a person offering help or as someone who is seeking
help. The user registers and enters their postal code or part of the city they live in
and whether they're a helper or someone looking for help, and sees who in their
area is a "match" for them. Users can set up a time and date for activities in the
chat. 


## How to Clone and Run the App Properly
If you have [node](http://nodejs.org/) you can install with [npm](http://npmjs.org) as node-modules folder is not uploaded to manage the size of the project.
```
npm install
```
After creating node-modules, you can run the web app by using package script:
```
npm start
```
Or Simply run:
```
node main.js
```

## Current Update
```
Switch to branch Sprint01 to check the latest progress (21.April)
```
KiezHelp currently has 4 static pages:
`Home` : A simple landing page letting user switching between volunteer and help requester (helpee)
`Volunteer`&`Requester` : Displaying a form for user to input the content of the help they offer/need and submit(doesn't work yet)
`Locate`: Displaying a map(using Google API) default showing the proximity of Berlin Alexanderplatz, but once user click `Get My Location` or type in a valid address, it'll show the proximity of that location. There are some default markers letting users see how close the other help is, if clicked on, the infoWindow of the marker will show basic info and have a `see detail` option that can reroute to the detail page.
After routing, each page can be accessed by clicking on the corresponding link in the menu bar, or simply adding `/volunteer`.


## Work Flow for Developers
If it's the first time:
```
git clone <repo url>
```
If not, it's always best to first pull new commits from the repo (Whenever switching to an existing branch, it's always good to pull first):
```
git pull
```
Then switch to the branch you want to work on, usually better to create a new branch for the story:
```
git branch <branch name>
```
Then switch to the newly created branch:
```
git checkout <branch name>
```
If the terminal shows you have uncommited changes so you can't switch branch, you can usually store/stash it first:
```
git stash save <name of the stashed content>
```
You can still get it back later by:
1. check what number the stashed content is:
```
git stash list
```
2. Then apply it back
```
git stash apply stash@{numberhere}
```
If you want to delete a branch locally (!do with caution!)
```
git branch -d <branch name>
```
Or remotely:
```
git push origin --delete  <branch name>
```
