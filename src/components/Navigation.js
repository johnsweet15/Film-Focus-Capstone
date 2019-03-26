import React from 'react';
import { Navbar, Nav, Form, Button, FormControl } from 'react-bootstrap'

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
        <Navbar.Brand href="/home">Film Focus</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/features">About</Nav.Link>
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