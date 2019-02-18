import React from 'react';
import { Navbar, Nav, Form, Button, FormControl } from 'react-bootstrap'
import Movies from './Movies';

class Navigation extends React.Component {

  state = {
    search: ''
  }

  render() {
    let search = this.state.search;
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
        <Form inline>
          {/* <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={(search) => this.setState({search: search.target.value})} /> */}
          <Button variant="outline-info">Search</Button>
        </Form>
      </Navbar>
    )
  }
}

export default Navigation;