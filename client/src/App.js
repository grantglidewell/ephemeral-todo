import React, { Component } from 'react';
import axios from 'axios';
import './app.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    
    this.state = {
      session: props.session,
      input: '',
      uri: 'https://ehpem-todo-server-xqxkweaewf.now.sh/api',
      todos: [],
    };
  }
  componentDidMount() {
    // this makes the initial fetch when the component mounts
    this.getData()
  }
  getData() {
    axios.get(`${this.state.uri}/data/${this.state.session}/`).then((data, err) => {
      if (err)console.log(err);
      return data;
    }).then((data) => {
      // sets the state to the data value
      this.setState({
        todos: data.data,
      });
    });
  }
  deleteItem(id) {
    axios.get(`${this.state.uri}/delete/${id}`)
      .then(() => this.getData())
  }
  postItem(text) {
    // light sanatizing to remove error causing characters
    if(text.match(new RegExp(/[-/\\^%$*+?#.()|[\]{}]/g))){
      text = text.replace(new RegExp(/[-/\\^%$*+?#.()|[\]{}]/g), '');
    }
    axios.get(`${this.state.uri}/post/${text}/${this.state.session}`)
      .then(() => this.getData())
      .then(() => this.input.value = '')
  }
  handleSubmit() {
    this.setState({
      input: this.input.value
    }, () => this.postItem(this.state.input))
  }
  TodoList = () => (
    <ul>
      {this.state.todos.map(e => <li key={e._id}>
        <button onClick={() => this.deleteItem(e._id)}>
         <span role="img" aria-label="check">✔️</span>
        </button>{e.todo}</li>)}
    </ul>
  )
  InputTodo = () => (
    <div>
      <input 
        type="submit" 
        onClick={() => this.handleSubmit()} 
        value="ToDo"
      />
      <input 
        type="text" 
        ref={(input) => this.input = input}
        onKeyPress={(event) => event.key === 'Enter' ? this.handleSubmit(event) : null}
      />
    </div>
  )
  render() {
    return (
      <div className="flex">
        <div className="input">
          <this.InputTodo />
        </div>
      {this.state.todos.length > 0 ? <this.TodoList /> : <ul><li>Add Something</li></ul>}
    </div> 
    );
  }
}

export default App;