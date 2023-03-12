import {Component} from 'react';

import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import MarvelServices from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';



class CharList extends Component {
    
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210, 
        charEnded: false,
        pageEnded: false,
    }

    marvelService = new MarvelServices();

    componentDidMount() {
         this.onRequest()
         window.addEventListener("scroll", this.onPageEnded);
         window.addEventListener("scroll", this.onRequestByScroll);
    }



    componentWillUnmount() {
         window.removeEventListener("scroll", this.onPageEnded);
         window.removeEventListener("scroll", this.onRequestByScroll);
    }

    onPageEnded = () => {
        if (
            window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight -1
        ) {
            this.setState({
                pageEnded: true
            })
        }
    }

    onRequestByScroll = () => {
        const {pageEnded, charEnded, newItemLoading} = this.state;
        
        if (pageEnded && !newItemLoading && !charEnded) {
            this.onRequest(this.state.offset)
        }
        
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }


    onCharListLoaded = (newCharList) => {

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: newCharList.length < 9, 
            pageEnded: false
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    onFosusOnItem = (i) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[i].classList.add('char__item_selected');
        this.itemRefs[i].focus();
    }

    renderItems(arr) {  
        
        const items = arr.map((item, i) => {
            
            const {id, name, thumbnail} = item

            const stylesThumbnail = thumbnail.includes('image_not_available.jpg') ? {'objectFit': 'contain'} : {}

            return (
                <li className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={id}
                    onClick={() => {
                        this.props.onCharSelected(id)
                        this.onFosusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if(e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(id)
                            this.onFosusOnItem(i)
                        }
                    }}
                    >
                    <img src={thumbnail} style={stylesThumbnail} alt={name}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )

    }

   render() {
    const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

     return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            {/* <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                <div className="inner">load more</div>
            </button> */}
        </div>
    )
   }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;