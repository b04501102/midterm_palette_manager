import React, { useState, useEffect } from 'react'
import withLayout from '../layout'
import io from 'socket.io-client'
import PaletteCard from '../components/paletteCard'
import CreatePaletteForm from '../components/createPaletteForm'
import PaletteEditor from '../components/paletteEditor'
import { Row, Col, Button, Modal, Drawer } from 'antd'

import { connect, useSelector, useDispatch } from 'react-redux'

const Home = () => {
  const [msg, setMsg] = useState('Hello, World')
  const [isCreatePaletteFormModalVissible, setIsCreatePaletteFormModalVissible] = useState(false)
  
  var socket = null
  const palettes = useSelector(state => state.palettes)
  const isEditorMode = useSelector(state => state.isEditorMode)
  const selectedPalette = useSelector(state => state.selectedPalette)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'LOAD_PALETTES'})
  })

  const showCreatePaletteFormModal = () => {
    setIsCreatePaletteFormModalVissible(true)
  }
  const hideCreatePaletteFormModal = () => {
    setIsCreatePaletteFormModalVissible(false)
  }

  const hidePaletteEditor = () => {
    dispatch({ type: 'TOGGLE_EDIT_MODE', isEditMode: false })
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
      <Drawer
        title={ selectedPalette.title }
        placement="right"
        closable={true}
        visible={ isEditorMode }
        onClose={ hidePaletteEditor }
      >
        <PaletteEditor selectedPalette={ selectedPalette } />
      </Drawer>
    </>
  )
}

export default withLayout(connect(null)(Home))