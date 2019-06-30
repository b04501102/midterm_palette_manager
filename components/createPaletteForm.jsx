import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
import { Form, Input, Select, Upload, Button, Row, Col, Popover, Icon, Modal, Card } from 'antd'

import { SketchPicker } from 'react-color'
const { Item } = Form
const { Option } = Select

const { Grid } = Card
const gridStyle = (bgc) => ({
  width: '20%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: bgc
})

import Palette from '../models/paletteModel.js'
const skmeans = require("skmeans")
import { CREATE_PALETTE, PALLETES_QUERY } from '../graphql/index.js';
import { Mutation } from 'react-apollo'
import { set } from 'mongoose';

const OPTIONS_AUTHOR = ['Rainforest', 'Jocelyn', 'Max']
const OPTIONS_TAGS = ['Material Design', 'Ant Design', 'Processing', 'Web', 'iOS']
const BASE64_MARKER = ';base64,';

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

const convertDataURIToBinary = (dataURI) => {
  // console.log(dataURI)
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
  var res1 = skmeans(temp_a, 10).centroids
  var res2 = skmeans(temp_b, 10).centroids
  var res3 = skmeans(temp_c, 10).centroids
  var color1 = rgbToHex(Math.ceil(res1[0]), Math.ceil(res2[0]), Math.ceil(res3[0]))
  var color2 = rgbToHex(Math.ceil(res1[1]), Math.ceil(res2[1]), Math.ceil(res3[1]))
  var color3 = rgbToHex(Math.ceil(res1[2]), Math.ceil(res2[2]), Math.ceil(res3[2]))
  var color4 = rgbToHex(Math.ceil(res1[3]), Math.ceil(res2[3]), Math.ceil(res3[3]))
  return [color1, color2, color3, color4]
}

const CreatePaletteForm = ({showpanel}) => {
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [palette, setPalette] = useState(new Palette())
  const [isColorPickerShowed, setIsColorPickerShowed] = useState(false)
  const [pickedColor, setPickedColor] = useState('#fff')
  const [colors, setColors] = useState([])
  const [tags, setTags] = useState([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState([])


  const changeTitle = e => {
    const { value } = e.target
    palette.title = value
    setPalette(palette)
    setTitle(value)
  }
  const selectAuthor = author => {
    // palette.author = [...palette.author, author]
    palette.author = author
    setPalette(palette)
    setAuthor(palette.author)
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
      // console.log(info)
      getBase64(info.file.originFileObj, imgUrl => {
        setIsImageUploading(false)
        // console.log(imgUrl)
        palette.image = imgUrl
        var color = Kmeans(imgUrl)
        palette.colors = [...palette.colors, color[0], color[1], color[2], color[3]]
        palette.colors.map((color, i) => (<Option defaultValue={ color } key={ i }>{ color }</Option>))
        setPalette(palette)
        setColors(palette.colors)
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
    palette.colors = [...palette.colors, color]
    setPalette(palette)
    setColors(palette.colors)
  }

  function handleColorsChange(e) {
    palette.colors = e
    setPalette(palette)
    setColors(e)
  }
  // const deselectColors = (name, item) => {
  //   palette.colors.splice(item.key, 1)
  //   setPalette(palette)
  //   setColors(palette.colors)
  // }

  const selectTags = tag => {
    palette.tags = [...palette.tags, tag]
    setPalette(palette)
    setTags(palette.tags)
  }
  function handleTagsChange(e) {
    palette.tags = e
    setPalette(palette)
    setTags(e)
  }
  // const deselectTags = (tag, item) => {
  //   const idx = palette.tags.indexOf(tag)
  //   if (idx !== -1){
  //     palette.tags.splice(idx, 1)
  //   }
    
  //   setPalette(palette)
  //   setTags(palette.tags)
  // }

  return (
    <Form>
      <Item label='Title'><Input 
        placeholder='Color Palette'
        value={ title }
        onChange={ changeTitle }
      /></Item>
      <Item label='Author'>
        <Select
          mode='multiply'
          value={ author }
          // onSelect={ selectAuthor }
          onChange={ selectAuthor }
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
          listType='picture'
          className='avatar-uploader'
          action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
          showUploadList={ true }
          beforeUpload={ handleBeforeUpload }
          onChange={ uploadImage }
          multiple={ false}
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
          <Row style={{ marginTop: '10px'}}>
            { colors.map((c, i) => {
              return (<Grid style={ gridStyle(c) } key={ i }></Grid>)
            }) }
          </Row>
            <Select
              mode='tags'
              value={ colors }
              onSelect={ selectColors }
              onChange={ handleColorsChange }
              InputKeyDown={ selectColors }
            >
              { colors.map((color, i) => (<Option value={ color } key={ i }>{ color }</Option>)) }
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
                        setColors(palette.colors)
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
          value={ tags }
          onSelect={ selectTags }
          InputKeyDown={ selectTags }
          onChange={ handleTagsChange }
        >
          { (OPTIONS_TAGS.filter(o => !tags.includes(o))).map((tag, i) => (
            <Option value={ tag } key={ i }>{ tag }</Option>
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
            setPalette(new Palette())
            setTitle("")
            setAuthor([])
            setTags([])
            setColors([])
            }
        }>Add</Button>
        )}
      </Mutation>
      </Item>
    </Form>
  )
}

export default CreatePaletteForm