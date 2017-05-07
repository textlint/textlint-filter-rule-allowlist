# textlint-filter-rule-whitelist

[![Greenkeeper badge](https://badges.greenkeeper.io/textlint/textlint-filter-rule-whitelist.svg)](https://greenkeeper.io/)

textlint [filter rule](https://github.com/textlint/textlint/blob/master/docs/filter-rule.md "Filter rule") that filter any word by white list.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-filter-rule-whitelist

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

textlint-filter-rule-whitelist allow to use RegExp like string.
The string is stated with `/` and ended with `/`.

```js
"/\\d+/"; // => /\d+/
```

**Limitation**:

Currently, `/regexp/` to be `/regexp/g`.
It means that this filter rule is not supported multiline RegExp `/regexp/m`.

Welcome to Pull Request!

## Changelog

See [Releases page](https://github.com/textlint/textlint-filter-rule-whitelist/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint/textlint-filter-rule-whitelist/issues).

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
