import {useState, useEffect, useRef, useCallback} from 'react';

import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import useMarvelServices from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

let count = 1;

const CharList = (props) => {


    const [charList, setCharList] = useState([]); //used
    const [newItemLoading, setNewItemLoading] = useState(false); //used
    const [offset, setOffset] = useState(210); //used
    const [charEnded, setCharEnded] = useState(false); //used

    // const newItemLoadingRef = useRef();
    // newItemLoadingRef.current = newItemLoading;

    const {loading, error, getAllCharacters} = useMarvelServices();

    
    useEffect(() => {
        onRequest(offset, true);
    }, [])
    
    
    // useEffect(() => {

    //     window.addEventListener('scroll', onScroll);

    //     return () => window.removeEventListener('scroll', onScroll);
    // }, []);

    // useEffect(() => {
    //     if (newItemLoading && !charEnded) {
    //         onRequest(offset);
    //     }

    // }, [newItemLoading])




    // const onScroll = useCallback(() => {        
    //     console.log('scroll');
    //     if (
    //         window.pageYOffset + document.documentElement.clientHeight >=
    //         document.documentElement.scrollHeight -1
    //     ) { 
            
    //         if (!newItemLoadingRef.current) {
    //             setNewItemLoading(true);
    //         }
    //     }
    // }, [])
    
    
    


    const onRequest = (offset, initial) => {
        console.log(`request ${count++}`)
        
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }




    const onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(false)
        setOffset(offset => offset + 9);
        setCharEnded(ended);

    }


    const itemRefs = useRef([]);

    const onFosusOnItem = (i) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его использовать в стилях вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего количества элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях

        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[i].classList.add('char__item_selected');
        itemRefs.current[i].focus();
    }

    function renderItems(arr) {  
        
        const items = arr.map((item, i) => {
            
            const {id, name, thumbnail} = item

            const stylesThumbnail = thumbnail.includes('image_not_available.jpg') ? {'objectFit': 'contain'} : {}

            return (
                <li className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={id}
                    onClick={() => {
                        props.onCharSelected(id)
                        onFosusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if(e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id)
                            onFosusOnItem(i)
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

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none': 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
   
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;