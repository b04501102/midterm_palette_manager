import React, { useState, useEffect } from 'react'
import { Layout, Row, Typography, Icon } from 'antd'
const { Header, Footer, Sider, Content } = Layout
const { Title } = Typography

const headerBgShowed = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '10px 0 15px rgba(34, 34, 34, 0.5)'
}
const headerBgHiden = {
  backgroundColor: 'transparent',
  boxShadow: 'none'
}

export default (Page) => {
  return () =>  {
    const [collapsed, setCollapsed] = useState(true)
    const [isHeaderBgShowed, setIsHeaderBgShowed] = useState(false)

    const onScroll = (event) => {
      setIsHeaderBgShowed(window.pageYOffset >= 30 ? true : false )
    }

    useEffect(() => {
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const toggle = () => {
      setCollapsed(!collapsed)
    }
    return(
      <Layout style={{
        minHeight: '100vh'
      }}>
        <Sider style={{ 
          zIndex: 2,
          height: '100vh',
          position: 'fixed',
          left: 0,
        }} collapsible collapsedWidth='0' collapsed={ collapsed } onCollapse={ toggle }>Sider</Sider>
        <Layout>
          <Header style={Object.assign({}, (isHeaderBgShowed ? headerBgShowed : headerBgHiden), { 
            position: 'fixed',
            zIndex: 1, 
            width: '100%',
            fontSize: '16px'
            })}
            >
            <div style={{ fontSize: '36px' }}>Palette Manager</div>
          </Header>
          <Content style={{ marginTop: '64px', padding: '0 48px' }}>
            <Page />
          </Content>
          <Footer style={{ textAlign: 'center' }}>Rainforest@2019</Footer>
        </Layout>
      </Layout>
    )
  }
}