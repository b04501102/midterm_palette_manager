# Color Palette Manager
> (Group06) A Cross-Platform Web App to manage your palettes

![Palette Manager](https://i.imgur.com/yDFRvCe.png)

* Demo:  http://rainforest.tools  
* Video: https://www.youtube.com/watch?v=BPU8DH8l8qU  
* PPT:   https://reurl.cc/RVDde  
  
## Get Starting
1. Clone the repository
2. `npm i` to install packages
3. see **Install MongoDB** section
4. `node graphql_server/index.js`
5. `npm start`

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
### Client-side: Next.js + GraphQL.js + Ant Design
#### Apollo
* react-apollo: handle mutation and query
* react-boost: connect to the apollo server
#### Ant Design
### Server-side: Next.js + Express.js
### Apollo-server: GraphQL.js + Mongoose.js + Express.js
#### Apollo
* apollo-server-express: create an ApolloServer to handel the communication between  Client-side and MongoDB
### Database: MongoDB + Docker
### Color Palatte Prediction: Skmeans.js + Math.js

## Contributions
* create a web app to manage(ex. save, sort...) palettes
* use graphql to manage data flow
* use Ant Design to build UI
* use Docker to construct migratable database

## TODO
- [x] UI Prototype
- [x] Add/Delete Palettes
- [x] Add Tags
- [x] Update Palettes
- [x] Use [React Color](http://casesandberg.github.io/react-color/) to select colors
- [x] Upload Images and choose palette from them 
- [x] Export palettes in different format
- [x] Generate palette automatically

## Prediction Model
* Goals: User uploads an image and then the backend will generates palette automatically
* All implemented models are `./ML_model` (CNN is trained poorly) and `./components/createPaletteForm.jsx`
* In the beginning, we use `./ML_model/Crawler_Canva.py` to collet the data from  
https://www.canva.com/colors/color-palettes/page/  
and train these data based on CNN and other complex models, but acquire poor results.
* Kmeans and clustering achieve better performance on palette prediction task, and the result is shown in the following:
(based on Kmeans model of Scikit-learn)
![Predict Result](https://i.imgur.com/b66ZFm4.png)
* We finally use `Skmeans.js` + `Math.js` to implement the model
* Transformation of `base64 format to image color` has room for improvement

## 每個人的貢獻
* 鄭羽霖(B04501102): 前端介面、操作、前端 CRUD 功能
* 李利元(B04501073): 前端介面、GraphQL
* 謝伊妍(D06943001): 色票預測模型、投影片 / 影片製作

