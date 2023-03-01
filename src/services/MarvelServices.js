class MarvelServices {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=9abbd9bb4f3b48c02876ec7592182c43';

  getResourse = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  }


  getAllCharacters = () => {
    return this.getResourse(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`)
  }
  getCharacter = (id) => {
    return this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`)
  }
}

export default MarvelServices;