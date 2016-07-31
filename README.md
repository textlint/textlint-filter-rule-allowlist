# textlint-rule-filter-whitelist

textlint filter rule that filter any word by white list.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-filter-whitelist

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "filters": {
        "whitelist": {
            "allow": [
                "ignored-word",
                "/\\d+/"
            ]
        }
    }
}
```

## Options:

- `allow`: `string[]`
    - white list words or RegExp strings
    
### RegExp String

textlint-rule-filter-whitelist allow to use RegExp like string.
The string is stated with `/` and ended with `/`.

```js
"/\\d+/"; // => /\d+/
```

## Changelog

See [Releases page](https://github.com/azu/textlint-rule-filter-whitelist/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/textlint-rule-filter-whitelist/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
