import { useState, useEffect} from 'react';
import PropTypes from 'prop-types'; // ES6


import MarvelServices from '../../services/MarvelServices';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = ({charId}) => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelServices();

    useEffect(() => {
        updateChar()
    }, [charId]);


    const onCharLoaded = (char) => {
        setChar(char)
        setLoading(false);
    }

    const onCharLoading = () => {
        setLoading(true);
        setError(false);
    }


    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const updateChar = () => {

        if (!charId) {
            return;
        }

        onCharLoading();
        
        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError)
    }

    const skeleton = char || loading || error ? null : <Skeleton/>
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {  
    const {name, description, thumbnail, wiki, homepage, comics} = char;
    
    const stylesThumbnail = thumbnail.includes('image_not_available.jpg') ? {'objectFit': 'contain'} : {}

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} style={stylesThumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
               {comics.length > 0 ? null : 'There are no comics for this character'}
               {
                comics.map((item, i) => {
                    // eslint-disable-next-line
                    if (i > 10) return;
                    return (
                        <li key={i} className="char__comics-item">
                            {item.name}
                        </li>
                    )
                })
               }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;