# Palette Manager
> A Cross-Platform Web App to manage your palettes

Demo: <http://rainforest.tools>

## Get Starting
1. Clone the repository
2. `npm i` to install packages
3. see **Install MongoDB** section
4. `npm start`

## Install MongoDB
There are two solutions:
### 1. add your MongoDB Link to my project
* Modified **server/index.js** file
```
# line 8
const mongoDB = process.env.NODE_DEV !== 'production' ? 'mongodb://localhost:27017/admin' : ''
```
### 2. Create MongoDB by Docker
* You can get the Docker Container [here](https://drive.google.com/file/d/1s2VkkvBL8s_kWjRYqlBNuGi13eILF_2B/view?usp=sharing)
* [Install Docker](https://www.docker.com/products/docker-desktop) or `brew cask install docker`
* Use `zcat mongodb.gz | docker import - mongodb` to unzip file downloaded from cloud and import container 
* Use `docker run -i -t mongodb /bin/bash` to run your container

## Structure
### Client-side: Next.js + Redux + Ant Design
#### Redux
* redux-actions: create redux actions and reducers
* redux-saga
#### Ant Design
### Server-side: Next.js + Express.js + Mongoose
### Database: MongoDB + Docker

## Contributes
* create a web app to manage(ex. save, sort...) palettes
* use redux's packages(ex. redux-actions, redux-saga) to manage data flow and communicate with web api
* use Ant Design to build UI
* use Docker to construct migratable database

## 心得
初學 React 兩個月，趁這個專案很快的摸索了 Next.js, Redux, Backend, 跟 MongoDB ；而關於專案內容則是一直很想做，但一直找不到藉口撥時間去弄的
色票管理的程式，雖然目前進度離理想的樣子還有很大的距離，但藉這機會順便把開發環境建立起來，之後應該會快上很多。

## TODO
- [x] UI Prototype
- [x] Add/Delete Palettes
- [x] Add Tags
- [x] Update Palettes
- [ ] Use [React Color](http://casesandberg.github.io/react-color/) to select colors
- [ ] Classify palettes by tags, author, ...
- [ ] Upload Images and choose palette from them 
- [ ] Export palettes in different format
- [ ] Generate palette automatically
