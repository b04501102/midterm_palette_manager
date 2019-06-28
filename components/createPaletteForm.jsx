import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
import { Form, Input, Select, Upload, Button, Row, Col, Popover, Icon, Modal } from 'antd'
import { SketchPicker } from 'react-color'
const { Item } = Form
const { Option } = Select

//var data = [1,12,13,4,25,21,22,3,14,5,11,2,23,24,15];
//var res = skmeans(data,3);
//console.log(res)

import Palette from '../models/paletteModel.js'
const skmeans = require("skmeans")
import { CREATE_PALETTE, PALLETES_QUERY } from '../graphql/index.js';
import { Mutation } from 'react-apollo'

const OPTIONS_AUTHOR = ['Rainforest']
const OPTIONS_TAGS = ['Material Design', 'Ant Design', 'Processing', 'Web', 'iOS']
const BASE64_MARKER = ';base64,';


const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

const convertDataURIToBinary = (dataURI) => {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
   
const Kmeans = (url) => {
  var img_uint8 = convertDataURIToBinary(url)
  let pivot1 = Math.ceil(img_uint8.length / 3);
  let pivot2 = Math.ceil(img_uint8.length / 3*2);
  let pivot3 = Math.ceil(img_uint8.length);
  let temp_a = img_uint8.slice(0, pivot1);
  let temp_b = img_uint8.slice(pivot1, pivot2);
  let temp_c = img_uint8.slice(pivot2, pivot3);
  var res1 = skmeans(temp_a, 4).centroids
  var res2 = skmeans(temp_b, 4).centroids
  var res3 = skmeans(temp_c, 4).centroids
  var color1 = rgbToHex(Math.ceil(res1[0]), Math.ceil(res2[0]), Math.ceil(res3[0]))
  var color2 = rgbToHex(Math.ceil(res1[1]), Math.ceil(res2[1]), Math.ceil(res3[1]))
  var color3 = rgbToHex(Math.ceil(res1[2]), Math.ceil(res2[2]), Math.ceil(res3[2]))
  var color4 = rgbToHex(Math.ceil(res1[3]), Math.ceil(res2[3]), Math.ceil(res3[3]))

  console.log(color1)
  console.log(color2)
  console.log(color3)
  console.log(color4)

  return [color1, color2, color3, color4]
}

const CreatePaletteForm = ({showpanel}) => {
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [palette, setPalette] = useState(new Palette())
  const [isColorPickerShowed, setIsColorPickerShowed] = useState(false)
  const [pickedColor, setPickedColor] = useState('#fff')

  // const dispatch = useDispatch()

  const changeTitle = e => {
    const { value } = e.target
    palette.title = value
    setPalette(palette)
  }
  const selectAuthor = author => {
    palette.author = [...palette.author, author]
    setPalette(palette)
  }

  const handleBeforeUpload = file => {
    const isJPG = file.type === 'image/jpg';
    const isJPEG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isPNG = file.type === 'image/png';
    if (!(isJPG || isJPEG || isGIF || isPNG)) {
      Modal.error({
        title: 'Only supported for images',
      })
      return 0;
    };
    return (isJPG || isJPEG || isGIF || isPNG);
  };

  const uploadImage = info => {
    if(info.file.status === 'uploading'){
      setIsImageUploading(true)
      return 
    }
    if(info.file.status === 'done'){
      getBase64(info.file.originFileObj, imgUrl => {
        setIsImageUploading(false)
        console.log(imgUrl)
        palette.image = imgUrl
        var color = Kmeans(imgUrl)
        palette.colors = [...palette.colors, color[0], color[1], color[2], color[3]]
        palette.colors.map((color, i) => (<Option defaultValue={ color } key={ i }>{ color }</Option>))
        setPalette(palette)
      })
    }
  }

  const toggleColorPicker = () => {
    setIsColorPickerShowed(!isColorPickerShowed)
  }
  const pickColor = (color, event) => {
    setPickedColor(color.hex)
  }
  const selectColors = color => {
    console.log(color)
    palette.colors = [...palette.colors, color]
    setPalette(palette)
  }
  const deselectColors = (name, item) => {
    palette.colors.splice(item.key, 1)
    setPalette(palette)
  }

  const selectTags = tag => {
    palette.tags = [...palette.tags, tag]
    setPalette(palette)
  }
  const deselectTags = (tag, item) => {
    palette.tags.splice(item.key, 1)
    setPalette(palette)
  }

  // const addPalette = () => {
  //   dispatch({ type: 'ADD_PALETTE', palette: palette })
  //   setPalette(new Palette())
  // }

  return (
    <Form>
      <Item label='Title'><Input 
        placeholder='Color Palette'
        defaultValue={ palette.title }
        onChange={ changeTitle }
      /></Item>
      <Item label='Author'>
        <Select
          mode='multiply'
          defaultValue={ palette.author }
          onSelect={ selectAuthor }
          InputKeyDown={ selectAuthor }
        >
          { (OPTIONS_AUTHOR.filter(o => !palette.author.includes(o))).map((author, i) => (
            <Option value={ author } key={ i }>{ author }</Option>
          )) }
        </Select>
      </Item>
      <Item label='Image'>
        <Upload
          name='avatar'
          listType='picture-card'
          className='avatar-uploader'
          action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
          showUploadList={ true }
          beforeUpload={ handleBeforeUpload }
          onChange={ uploadImage }
        >
          {
            <Button
              icon={ isImageUploading ? 'loading' : 'plus' }
            >
              Upload
            </Button>
          }
        </Upload>
      </Item>
      <Item label='Colors'>
        <Row type='flex'>
          <Col span={22}>
            <Select
              mode='tags'
              value={ palette.colors }
              onSelect={ selectColors }
              onDeselect={ deselectColors }
              InputKeyDown={ selectColors }
            >
              { palette.colors.map((color, i) => (<Option value={ color } key={ i }>{ color }</Option>)) }
            </Select>
          </Col>
          <Col order={1} style={{paddingLeft: 0}}>
            <Popover
              visible={ isColorPickerShowed }
              content={
                <>
                  <SketchPicker 
                    color={ pickedColor }
                    onChange={ pickColor }
                  />
                  <Row>
                    <Button onClick={ toggleColorPicker }>Cancel</Button>
                    <Button
                      onClick={event => {
                        palette.colors = [...palette.colors, pickedColor]
                        setPalette(palette)
                      }}
                    >Choose</Button>
                  </Row>
                </>
              }
            >
              <Button icon='bg-colors' onClick={ toggleColorPicker } />
            </Popover>
          </Col>
        </Row>
      </Item>
      <Item label='Tags'>
        <Select
          mode='tags'
          defaultValue={ palette.tags }
          onSelect={ selectTags }
          InputKeyDown={ selectTags }
        >
          { (OPTIONS_TAGS.filter(o => !palette.tags.includes(o))).map((tag, i) => (
            <Option defaultValue={ tag } key={ i }>{ tag }</Option>
          )) }
        </Select>
      </Item>
      <Item>
      <Mutation mutation={CREATE_PALETTE}>
        {(createPallete, { data }) => (
          <Button type="primary" htmlType="submit" onClick={e => {
            e.preventDefault();
            createPallete({ variables: { pallete: palette }, refetchQueries: [{ query: PALLETES_QUERY }]});
            showpanel();
            }
        }>Add</Button>
        )}
      </Mutation>
        {/* <Button type="primary" htmlType="submit" onClick={ addPalette }>ADD</Button> */}
      </Item>
    </Form>
  )
}

export default CreatePaletteForm