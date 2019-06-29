import React from 'react'
// import { useDispatch } from 'react-redux'
import { Card, Icon, Avatar, Button, Row, Typography, Tag } from 'antd'

import {Mutation} from 'react-apollo'
import { DELETE_PALLETE, PALLETES_QUERY } from '../graphql/index.js';
const { Meta, Grid } = Card
const { Text } = Typography

const gridStyle = (bgc) => ({
  width: '20%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: bgc
})

const PaletteCard = ({ palette, select_func }) => {

  const updatePalette = () => {
    select_func(palette)
  }

  const removePalette = () => {
    // dispatch({ type: 'DELETE_PALETTE', id: palette._id })
  }

  return (
    <Card
      cover={
        <img src={ palette.image } />
      }
    >
      <Row style={{
        position: 'absolute',
        right: '10px',
        top: '10px'
      }}>
        <Button 
          icon='edit'
          onClick={ updatePalette }
        />
        <Mutation mutation={DELETE_PALLETE}>
        {(deletePallete, { data }) => (
          <Button
            icon='delete'
            onClick={e => {
              e.preventDefault();
              try{
                deletePallete({ variables: { input: palette._id }, refetchQueries: [{ query: PALLETES_QUERY }]})
              }
              catch(e){
                console.log(e)
              }
          }}
          /> 
        )}
        </Mutation>
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