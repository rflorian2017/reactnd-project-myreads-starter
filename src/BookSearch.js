import React, { Component } from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI.js'

class BookSearch extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired,
        onChangeShelf: PropTypes.func.isRequired
    }

    state = {
        query: '',
        searchedBooks: []
    }

    updateQuery = (query) => {
        this.setState(() => ({
            query: query
        }))
        if (query.trim().length) {
            BooksAPI.search(query).then((result) => {
                if (result.length) {

                    const showingBooks = this.props.books
                    // const currentlyReading = showingBooks.filter(book => book.shelf === 'currentlyReading')
                    // const wantToRead = showingBooks.filter(book => book.shelf === 'wantToRead')
                    // const read = showingBooks.filter(book => book.shelf === 'read')

                    const resultBooks = result.map(
                        resultBook => {
                            const book = showingBooks.find(showingBook => showingBook.id === resultBook.id)
                            book ? resultBook.shelf = book.shelf : resultBook.shelf = 'none'

                            return resultBook;
                        })
                    this.setState(() =>
                        (
                            { searchedBooks: resultBooks }
                        )
                    )
                }
                else {
                    this.setState(() =>
                        (
                            { searchedBooks: [] }
                        )
                    )
                }
            }).catch((error) => {
                query = '';
                console.log(error)
            });
        }
    }

    render() {
        const { query, searchedBooks } = this.state
        const { onChangeShelf } = this.props

        const allBooks = query === ''
            ? []
            : searchedBooks;

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/'>
                        <button className="close-search">Close</button>
                    </Link>
                    <div className="search-books-input-wrapper">
                        {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                        <input type="text" placeholder="Search by title or author" value={query}
                            onChange={(event) => this.updateQuery(event.target.value)} />

                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {allBooks.map((book) => (
                            <li key={book.id}>
                                <div className="book">
                                    <div className="book-top">
                                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : ""})` }}></div>
                                        <div className="book-shelf-changer">
                                            <select value={book.shelf} onChange={(event) => onChangeShelf(event, book)}>
                                                <option value="move" disable="true">Move to...</option>
                                                <option value="currentlyReading">Currently Reading</option>
                                                <option value="wantToRead">Want to Read</option>
                                                <option value="read">Read</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="book-title">{book.title}</div>
                                    <div className="book-authors">{book.authors}</div>
                                </div>
                            </li>

                        ))
                        }
                    </ol>

                </div>
            </div>
        )
    }

}

export default BookSearch