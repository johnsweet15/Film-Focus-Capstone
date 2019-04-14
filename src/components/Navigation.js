import React from 'react';
import { Navbar, Nav, Form, Button, FormControl } from 'react-bootstrap'
import { Link, Route } from 'react-router-dom'
import Movies from './Movies'
import About from './About'



class Navigation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
  }
  
  handleSubmit = (event) => {
    // dont refresh
    event.preventDefault();

    this.props.history.push('/search=' + this.state.search)
    this.props.setSearch(this.state.search)
  }

  render() {
    return (
      <Navbar fixed="top" className='navbar'>
        <Navbar.Brand href="/home"><div className='navbarLink' style={{color: '#4286f4'}}>Film Focus</div></Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/home"><div className='navbarLink'><Route path='/home'/>Home</div></Nav.Link>
          <Nav.Link href="/about"><div className='navbarLink'><Route path='/about'/>About</div></Nav.Link>
        </Nav>
        <Form inline onSubmit={(event) => this.handleSubmit(event)} style={{display: 'flex', flexDirection: 'row', paddingLeft: 20}}>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={(search) => this.setState({search: search.target.value})} style={{flex: '0.7'}} />
          <Button id='searchButton' variant="outline-info" onClick={(event) => this.handleSubmit(event)} style={{flex: '0.3'}} >Search</Button>
        </Form>
      </Navbar>
    )
  }
}

export default Navigation;