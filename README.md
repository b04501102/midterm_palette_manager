# Color Palette Manager
> (Group06) A Cross-Platform Web App to manage your palettes

![Palette Manager](https://i.imgur.com/yDFRvCe.png)

* DEPLOYMENT: https://midterm-palette-manager.herokuapp.com/
* Video: https://www.youtube.com/watch?v=BPU8DH8l8qU  
* PPT: https://reurl.cc/RVDde
* GITHUB REPO: https://github.com/b04501102/midterm_palette_manager
  
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

## Other Used Framework / Source code 
* [React Color](http://casesandberg.github.io/react-color/)
* [Skmeans.js](https://github.com/solzimer/skmeans)
* [Math.js](https://mathjs.org)

## Contributions
* create a web app to manage(ex. save, sort...) palettes
* use graphql to manage data flow
* use Ant Design to build UI
* use Docker to construct migratable database

## Implemented Features
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

## Contribution of Each Member
* 鄭羽霖(B04501102): Front-end interface, primary operation, CRUD function
* 李利元(B04501073): Front-end interface, GraphQL, deployment
* 謝伊妍(D06943001): Palette prediction model, slides & demo video

## Experiences Sharing 

(謝伊妍)  
非常感謝學弟們的carry讓我在final prj死線和研究大爆炸的時候，只需要實作用tensorflow+scikit-learn訓練的模型和後來串接到前端的部分，不過也是第一次實作爬蟲+把模型接到前端，原本預計是要用Tensorflow.js，但在本地端用tf+爬蟲的資料訓練出來的模型實在太爛了，後來就直接用簡單的Kmeans model來分群。但跟實際上爬到的色票資料相比還沒有到非常準確，光用Kmeans預測色票會有顏色相近和不夠精確的問題，可能還是要想一下怎麼分隔不同的顏色會比較好。因為時間關係，在image / base64的img url轉換上的處理也還沒有太深入的了解，之後希望能有機會再做更詳細的探討。
