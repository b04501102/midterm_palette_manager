import React, { useState, useEffect } from 'react'
// import { useDispatch } from 'react-redux'
import { Form, Input, Select, Button } from 'antd'
const { Item } = Form
const { Option } = Select

import { Mutation } from 'react-apollo'
import { PALLETES_QUERY,UPDATE_PALETTE } from '../graphql'

import Palette from '../models/paletteModel.js'

const OPTIONS_AUTHOR = ['Rainforest']
const OPTIONS_TAGS = ['Material Design', 'Ant Design', 'Processing', 'Web', 'iOS']

const PaletteEditor = ({ selectedPalette, hidePalette }) => {
  const [palette, setPalette] = useState(selectedPalette)
  useEffect(
    () => {
      setPalette(selectedPalette)
    }
  )
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

  const updatePalette = () => {
    // dispatch({ type: 'UPDATE_PALETTE', palette: palette })
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
          onDeselect={ deselectColors }
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
      <Item>
        {/* <Button type="primary" htmlType="submit" onClick={ updatePalette }>UPDATE</Button> */}
        <Mutation mutation={UPDATE_PALETTE}>
          {(updatePallete, { data }) => (
            <Button
              type="primary" 
              htmlType="submit"
              onClick={e => {
                e.preventDefault();
                updatePallete({ variables: { 
                  palette: {
                    _id: palette._id,
                    title: palette.title,
                    author: palette.author,
                    comments: palette.comments,
                    image: palette.image,
                    colors: palette.colors,
                    tags: palette.tags,
                    create_at: palette.create_at,
                    last_modified_at: palette.last_modified_at
                  } 
                }, refetchQueries: [{ query: PALLETES_QUERY }]})
                hidePalette()
            }}
            >
              UPDATE
            </Button>
          )}
        </Mutation>
      </Item>
    </Form>
  )
}

export default PaletteEditor