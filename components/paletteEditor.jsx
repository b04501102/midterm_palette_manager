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
  const [colors, setColors] = useState([""])
  const [tags, setTags] = useState([""])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState([""])

  useEffect(
    () => {
      setPalette(selectedPalette)
      setColors(selectedPalette.colors)
      setTags(selectedPalette.tags)
      setTitle(selectedPalette.title)
      setAuthor(selectedPalette.author)
    }
  )
  const changeTitle = e => {
    const { value } = e.target
    palette.title = value
    setPalette(palette)
    setTitle(value)
  }
  const selectAuthor = author => {
    palette.author = [...palette.author, author]
    setPalette(palette)
    setAuthor(author)
  }

  const selectColors = color => {
    palette.colors = [...palette.colors, color]
    setPalette(palette)
  }
  function handleColorsChange(e) {
    palette.colors = e
    setPalette(palette)
    setColors(e)
  }

  const selectTags = tag => {
    palette.tags = [...palette.tags, tag]
    setPalette(palette)
  }
  function handleTagsChange(e) {

    palette.tags = e
    setPalette(palette)
    setTags(e)
  }  
  return (
    <Form>
      <Item label='Title'><Input 
        placeholder='Default Title'
        value={ title }
        onChange={ changeTitle }
      /></Item>
      <Item label='Author'>
        <Select
          mode='multiply'
          value={ author }
          onSelect={ selectAuthor }
          InputKeyDown={ selectAuthor }
        >
          { (OPTIONS_AUTHOR.filter(o => !author.includes(o))).map((author, i) => (
            <Option value={ author } key={ i }>{ author }</Option>
          )) }
        </Select>
      </Item>
      <Item label='Colors'>
        <Select
          mode='tags'
          value={ colors }
          onSelect={ selectColors }
          InputKeyDown={ selectColors }
          onChange={handleColorsChange}
        >
          { colors.map((color, i) => (<Option value={ color } key={ i }>{ color }</Option>)) }
        </Select>
      </Item>
      <Item label='Tags'>
        <Select
          mode='tags'
          value={ tags }
          onSelect={ selectTags }
          InputKeyDown={ selectTags }
          onChange={handleTagsChange}
        >
          { (OPTIONS_TAGS.filter(o => !tags.includes(o))).map((tag, i) => (
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