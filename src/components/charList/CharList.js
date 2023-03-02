import {Component} from 'react';
import Spinner from '../spinner/Spinner';
import MarvelServices from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';



class CharList extends Component {
    
    state = {
        charList: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelServices();

    componentDidMount() {
         this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }


    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false,
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        })
    }

    renderItems(arr) {    
        const items = arr.map((item) => {
            
            const {id, name, thumbnail} = item

            const stylesThumbnail = thumbnail.includes('image_not_available.jpg') ? {'objectFit': 'contain'} : {}

            return (
                <li className="char__item"
                    key={id}>
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
    const {charList, loading, error} = this.state;
    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

     return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
   }
}

export default CharList;