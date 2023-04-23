import {useHttp} from '../hooks/http.hooks';

const useMarvelServices = () => {
  const {request, error, loading, clearError} = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=9abbd9bb4f3b48c02876ec7592182c43';
  const _baseOffset = 210;


  const getAllCharacters = async (offset = _baseOffset) => {
    const res =  await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)
    console.log(res.data);
    return res.data.results.map(_transformCharacter)
  }

  const getAllComics = async (offset = 0) => {
    const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`)
    console.log('comics ', res.data)
    return res.data.results.map(_transformComics)
  }
  
  const getComics = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
    return _transformCharacter(res.data.results[0]);
  }

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || "There is no description",
      pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
      thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
      price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
      language: comics.textObjects[0]?.language || "en-us",
    }
  }


  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    }
  }

  return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComics};
}

export default useMarvelServices;