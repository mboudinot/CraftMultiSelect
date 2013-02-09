CraftMultiSelect
================

Is a MultiSelect visual component based on [Craft api](http://craftjs.org).

## Usage

```
  Element.multiSelect()     
```

## Sample

```
<select id="my-select" multiple="multiple" name="options_1">
  <option value="test_1" selected="true">test1</option>
  <option value="test_2" selected="true">test2</option>
  <option value="test_3">test3</option>
  <option value="test_4">test4</option>
  <option value="test_5">test5</option>
  <option value="test_6">test6</option>
  <option value="test_7">test7</option>
  <option value="test_8" selected="true">test8</option>
  <option value="test_9">test9</option>
</select>
<script>
  $('my-select').multiSelect()
</script>      

```

## Build

Builds, lints, minifies.

```
grunt
```

## Demo

Build sample.

```
grunt sample  
```

Launch test page.

```
cd sample
npm install  
node app
```
