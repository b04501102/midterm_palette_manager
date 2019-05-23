import React from 'react'
import { useDispatch } from 'react-redux'
import { Card, Icon, Avatar, Button, Row, Typography, Tag } from 'antd'
const { Meta, Grid } = Card
const { Text } = Typography

const gridStyle = (bgc) => ({
  width: '20%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: bgc
})

const PaletteCard = ({ palette }) => {
  const dispatch = useDispatch()

  const updatePalette = () => {
    dispatch({ type: 'SELECT_PALETTE', palette: palette })
    dispatch({ type: 'TOGGLE_EDIT_MODE', isEditMode: true })
  }

  const removePalette = () => {
    dispatch({ type: 'DELETE_PALETTE', id: palette._id })
  }

  return (
    <Card>
      <Row style={{
        position: 'absolute',
        right: '10px',
        top: '10px'
      }}>
        <Button 
          icon='edit'
          onClick={ updatePalette }
        />
        <Button
          icon='delete'
          onClick={ removePalette }
        />
      </Row>
      <Meta
        avatar={<Avatar icon='user' />}
        title={ palette.title }
        description={ palette.author }
      />
      <Row style={{
        marginTop: '10px'
      }}>
        { palette.colors.map((c, i) => {
          return (<Grid style={ gridStyle(c) } key={ i }>
              <Text>{ c }</Text>
            </Grid>)
        }) }
      </Row>
      <Row style={{
        marginTop: '10px'
      }}>
        { palette.tags.map((t, i) => (
          <Tag key={ i }>{ t }</Tag>
        )) }
      </Row>
    </Card>
  )
}

export default PaletteCard