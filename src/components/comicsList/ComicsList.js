import {useState, useEffect} from 'react';
import useMarvelServices from '../../services/MarvelServices';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

     const {loading, error, getAllComics} = useMarvelServices();

    useEffect(() => {
        onRequest(offset, true)
    },[])

    const onRequest = (offset, initial) => {

        initial ? setNewItemLoading(false) : setNewItemLoading(true);

        getAllComics(offset)
            .then(onComicsListLoaded)

    }


    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList])
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended)
    }

    const renderItems = (arr) => {
        console.log(arr);
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}$</div>
                    </a>
                </li>
            )
        });

        return (
            <ul className="comics__grid">   
                {items}
            </ul>
        )
    }
    
    const items = renderItems(comicsList);

    const errorMesage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;



    return (
        <div className="comics__list">
            {errorMesage}
            {spinner}
            {items}

            <button className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none': 'block'}}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;