import React, { useState } from 'react'
import { Layout, Row, Typography, Icon } from 'antd'
const { Header, Footer, Sider, Content } = Layout
const { Title } = Typography

export default (Page) => {
  return () =>  {
    const [collapsed, setCollapsed] = useState(true)

    const toggle = () => {
      setCollapsed(!collapsed)
    }
    return(
      <Layout style={{
        minHeight: '100vh'
      }}>
        <Sider collapsible collapsedWidth='0' collapsed={ collapsed } onCollapse={ toggle }>Sider</Sider>
        <Layout>
          <Header style={{ 
            position: 'fixed',
            zIndex: 1, 
            width: '100%',
            background: 'none',
            fontSize: '16px'
            }}>
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