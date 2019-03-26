import React from 'react';
import { Navbar, Nav, Form, Button, FormControl } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
// import Movies from './Movies';

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
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/home">FilmFocus</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/features">Features</Nav.Link>
        </Nav>
        <Form inline onSubmit={(event) => this.handleSubmit(event)}>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={(search) => this.setState({search: search.target.value})} />
          <Button variant="outline-info" onClick={(event) => this.handleSubmit(event)}>Search</Button>
        </Form>
      </Navbar>
    )
  }
}

export default Navigation;