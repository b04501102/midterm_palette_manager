export default class PaletteModel {
  constructor() {
    this._title = ''
    this._author = []
    this._image = ''
    this._colors = []
    this._tags = []
    this._comments = []
  }

  set title(val) { this._title = val }
  set author(val) { this._author = val }
  set image(val) { this._image = val }
  set colors(val) { this._colors = val }
  set tags(val) { this._tags = val }
  set comments(val) { this._comments = val }

  get title() { return this._title }
  get author() { return this._author }
  get image() { return this._image }
  get colors() { return this._colors }
  get tags() { return this._tags }
  get comments() { return this._comments }
  
  toJSON() {
    return {
      title: this.title,
      author: this.author,
      image: this.image,
      colors: this.colors,
      tags: this.tags,
      comments: this.comments
    }
  }
}