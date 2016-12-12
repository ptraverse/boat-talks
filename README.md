Boat Talks - "Strava for Boating"
----------------------------------------------------------------- 

⛵ ⛵  https://boat-talks-c9-nodejs-ptraverse.c9users.io/

🛠 ☁️ :nine: https://ide.c9.io/ptraverse/boat-talks-c9-nodejs


<div style="text-align:center;"><h3>Currently under construction</h3></div>


## Build
```
git clone https://github.com/ptraverse/boat-talks.git && cd boat-talks
sudo yarn install
npm install -g bower nodemon
bower install
```

## MongoDB Install
Mac:
```
brew update
brew install mongodb
```
Linux*:
```
npm install -g mongodb
```
*Still need to test this.

## Development
First Terminal
```
sudo su
npm run webpack
```
Second Terminal
```
nodemon scripts/server.js
```
Third Terminal
```
mongod --config ./config/mongod.conf
```
