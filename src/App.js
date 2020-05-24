import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookSearch from './BookSearch.js'
import ListBooks from './ListBooks.js'
import { Route } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll().
      then((books) => {
        this.setState(() => ({ books }))
      });
  }

  refreshShelves = () => {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    });
  }

  changeShelf = (event, book) => {
    const shelf = event.target.value
    book.shelf = shelf
    BooksAPI.update(book, shelf).then(() => {
      this.refreshShelves()
    });
  }

  book = (books) => {
    if (books.shelf === 'currentlyReading') {
      return books.filter(book => book.shelf === 'currentlyReading')

    } else if (books.shelf === 'wantToRead') {
      return books.filter(book => book.shelf === 'wantToRead')

    } else if (books.shelf === 'read') {
      return books.filter(book => book.shelf === 'read')

    } else {
      return books.shelf = 'none'
    }
  }

  render() {
    return (
      <div>
        <Route exact path='/' render={() => (
          <ListBooks
            books={this.state.books}
            onChangeShelf={this.changeShelf}
          />
        )} />
        <Route path='/search' render={() => (
          <BookSearch
            books={this.state.books}
            onChangeShelf={this.changeShelf}
          />
        )} />
      </div>
    )
  }
}

export default BooksApp
