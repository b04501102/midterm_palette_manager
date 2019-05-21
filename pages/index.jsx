import React, { useState, useEffect } from 'react'
import withLayout from '../layout'
import io from 'socket.io-client'
import PaletteCard from '../components/paletteCard'
import CreatePaletteForm from '../components/createPaletteForm'
import { Row, Col, Button, Modal } from 'antd'

import { connect, useSelector, useDispatch } from 'react-redux'

const Home = () => {
  const [msg, setMsg] = useState('Hello, World')
  const [isCreatePaletteFormModalVissible, setIsCreatePaletteFormModalVissible] = useState(false)
  
  var socket = null
  const palettes = useSelector(state => state.palettes)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'LOAD_PALETTES'})

    // socket = io('http://localhost:3000')
    // socket.on('init', data => {
    //   setMsg(data.message)
    // })
  })

  const showCreatePaletteFormModal = () => {
    setIsCreatePaletteFormModalVissible(true)
  }
  const hideCreatePaletteFormModal = () => {
    setIsCreatePaletteFormModalVissible(false)
  }

  return (
    <>
      <Button style={{
        position: 'fixed',
        right: '2.5%',
        bottom: '2.5%'
      }}
      shape='circle' icon='plus' size='large' onClick={ showCreatePaletteFormModal }></Button>
      <Modal
        maskClosable={ false }
        visible={ isCreatePaletteFormModalVissible }
        footer={ null }
        onCancel={ hideCreatePaletteFormModal }
      >
        <CreatePaletteForm />
      </Modal>
      <Row gutter={24}>
        { palettes.map((palette, id) => {
          return (
            <Col sm={24} md={12} lg={8} xxl={6} key={ id } style={{
              marginBottom: '10px'
            }}>
              <PaletteCard palette={ palette }/>
            </Col>
          )
        }) }
      </Row>
    </>
  )
}

export default withLayout(connect(null)(Home))