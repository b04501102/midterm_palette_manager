import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Input, Select, Button } from 'antd'
const { Item } = Form
const { Option } = Select

import Palette from '../models/paletteModel.js'

const OPTIONS_AUTHOR = ['Rainforest']
const OPTIONS_TAGS = ['Material Design', 'Ant Design', 'Processing', 'Web', 'iOS']

const CreatePaletteForm = () => {
  const [palette, setPalette] = useState(new Palette())
  const dispatch = useDispatch()

  const changeTitle = e => {
    const { value } = e.target
    palette.title = value
    setPalette(palette)
  }
  const selectAuthor = author => {
    palette.author = [...palette.author, author]
    setPalette(palette)
  }
  const selectColors = color => {
    palette.colors = [...palette.colors, color]
    setPalette(palette)
  }
  const selectTags = tag => {
    palette.tags = [...palette.tags, tag]
    setPalette(palette)
  }

  const addPalette = () => {
    dispatch({ type: 'ADD_PALETTE', palette: palette })
  }

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
      <Item label='Colors'>
        <Select
          mode='tags'
          value={ palette.colors }
          onSelect={ selectColors }
          InputKeyDown={ selectColors }
        >
          { palette.colors.map((color, i) => (<Option value={ color } key={ i }>{ color }</Option>)) }
        </Select>
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
      <Item><Button type="primary" htmlType="submit" onClick={ addPalette }>ADD</Button></Item>
    </Form>
  )
}

export default CreatePaletteForm