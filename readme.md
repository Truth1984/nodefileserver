# nodefileserver

### start

```shell
npm start
```

### overwrite.js

overwrite current config settings, will be gitignored

## configs

#### root

array of root of serving path

#### port

default 8085

#### ignore

array of regex, to ignore file or directory or path patterns

#### filter

array of regex, to filter file or directory or path patterns

#### relativeDir : boolean

if true, can directly append to end of url and get target file,
else it will be absolute path

i.e.

```js
let result = ["a.txt", "b.txt"];
let url = "localhost:8085/";
let fileLocation = url + result[0];
```

#### sort : boolean

sort final path result to be more consistent
