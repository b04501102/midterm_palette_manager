import React, { useState, useEffect } from 'react'
import withLayout from '../layout'
import PaletteCard from '../components/paletteCard'
import CreatePaletteForm from '../components/createPaletteForm'
import PaletteEditor from '../components/paletteEditor'
import { Row, Col, Button, Modal, Drawer } from 'antd'

// import { connect, useSelector, useDispatch } from 'react-redux'
import fetch from 'node-fetch';
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link'
import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo';
import { PALLETES_QUERY,CREATE_PALETTE } from '../graphql'

const httpLink = createHttpLink({ uri: "http://localhost:5000/graphql" , fetch: fetch});

// const wsLink = process.browser ? new WebSocketLink({ // if you instantiate in the server, the error will be thrown
//   uri: `ws://localhost:5000/graphql`,
//   options: {
//     reconnect: true
//   }
// }) : null;

// const link = process.browser ? split( //only create the split in the browser
//   // split based on operation type
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query);
//     return kind === 'OperationDefinition' && operation === 'subscription';
//   },
//   wsLink,
//   httpLink,
// ) : httpLink;

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache().restore({})
  })

const Home = () => {
  const [isCreatePaletteFormModalVissible, setIsCreatePaletteFormModalVissible] = useState(false)
  
  // const palettes = useSelector(state => state.palettes)
  // const isEditorMode = useSelector(state => state.isEditorMode)
  // const selectedPalette = useSelector(state => state.selectedPalette)
  // const dispatch = useDispatch()

  let [selectedPalette, setselectedPalette] = useState({
    title:"",
    author:[]
  })

  const [isEditorMode, setisEditorMode] = useState(false)

  const showCreatePaletteFormModal = () => {
    setIsCreatePaletteFormModalVissible(true)
  }
  const hideCreatePaletteFormModal = () => {
    setIsCreatePaletteFormModalVissible(false)
  }

  const select_Palette = (selected) =>{
    setselectedPalette(selected)
    setisEditorMode(true)
  }

  const hidePalleteEditor = () =>{
    setisEditorMode(false)
  }

  return (
    <ApolloProvider client={client}>
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
        <CreatePaletteForm showpanel={hideCreatePaletteFormModal}/>
      </Modal>
      <Row gutter={24}>
        <Query query={PALLETES_QUERY}>
          {({ loading, error, data, refetch }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            return (
              <div>
                {data.getPalletes.map((palette, id) => (
                  <Col sm={24} md={12} lg={8} xxl={6} key={ id } style={{
                    marginBottom: '10px'
                  }}>
                    <PaletteCard palette={ palette } select_func={select_Palette}/>
                  </Col>
                ))}
              </div>
            );
          }}
        </Query>
        {/* { palettes.map((palette, id) => {
          return (
            <Col sm={24} md={12} lg={8} xxl={6} key={ id } style={{
              marginBottom: '10px'
            }}>
              <PaletteCard palette={ palette }/>
            </Col>
          )
        }) } */}
      </Row>
      <Drawer
        title={ selectedPalette.title }
        placement="right"
        closable={true}
        visible={ isEditorMode }
        onClose={ hidePalleteEditor }
      >
        <PaletteEditor selectedPalette={ selectedPalette } hidePalette={hidePalleteEditor}/>
      </Drawer>
    </ApolloProvider>
  )
}

export default withLayout(Home)