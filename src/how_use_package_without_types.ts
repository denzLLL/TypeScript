import {toJson} from 'really-relaxed-json'
const rjson = '[ one two three {foo:bar} ]'
const json = toJson(rjson)
// json value is ["one", "two", "three", {"foo": "bar"}]

