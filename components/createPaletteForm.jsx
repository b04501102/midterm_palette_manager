import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
import { Form, Input, Select, Upload, Button, Row, Col, Popover } from 'antd'
import { SketchPicker } from 'react-color'
const { Item } = Form
const { Option } = Select

import Palette from '../models/paletteModel.js'
import { CREATE_PALETTE, PALLETES_QUERY } from '../graphql/index.js';
import { Mutation } from 'react-apollo'

const OPTIONS_AUTHOR = ['Rainforest']
const OPTIONS_TAGS = ['Material Design', 'Ant Design', 'Processing', 'Web', 'iOS']

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
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
        placeholder='Default Title'
        value={ palette.title }
        onChange={ changeTitle }
      /></Item>
      <Item label='Author'>
        <Select
          mode='multiply'
          value={ palette.author }
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
          showUploadList={ false }
          onChange={ uploadImage }
        >
          {
            palette.image ? 
            <img src={ palette.image } alt='avatar'/> :
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
          value={ palette.tags }
          onSelect={ selectTags }
          InputKeyDown={ selectTags }
        >
          { (OPTIONS_TAGS.filter(o => !palette.tags.includes(o))).map((tag, i) => (
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