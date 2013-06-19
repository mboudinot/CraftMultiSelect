/*!
 CraftMultiSelect.js
 0.0.1 
*/

;(function (){
  Elements.implement({
    'multiSelect': function (options){
      var self = this
      if (!options)options = {selectableOptgroup: true,filters: false}
      if (self[0].nodeName == 'SELECT')createMultiSelect(self[0], options)
      return self
    }
  })
  var mainSelect
  function createMultiSelect(select, options){
    mainSelect=$(select)
    var nativeSelect = mainSelect.css({display: 'none'})
      , container = Elements.create('div').addClass('containerStyle')
      , selectable = Elements.create('div').addClass('selectableDivStyle').appendTo(container)
      , selectableList = Elements.create('ul').addClass('ulStyle').appendTo(selectable)
      , selection = Elements.create('div').addClass('selectionDivStyle').appendTo(container)
      , selectionList = Elements.create('ul').addClass('ulStyle').appendTo(selection)
      , fragment = Elements.fragment()
      , cleanList = function (list, groupToCheck){
        if (list.children().select(function(e){return $(e).data('group-item')==groupToCheck}).isEmpty()) {
          list.children().each(function (item){
            if ($(item).data('groupName') == groupToCheck)$(item).remove()
          })
        }
      }
      , insertElement = function (destinationList, el){
        if (!destinationList.children().isEmpty()) {
          var firstchild = $(destinationList.children()[0]);
          if (parseInt(firstchild.data('index'),10) > parseInt($(el).data('index'),10)) {
            firstchild.insertBefore(el)
          } else {
            $(destinationList.children().fold(function (item, next){
              return (parseInt($(next).data('index'),10) > parseInt($(el).data('index'),10)) ? item : next
            })).insertAfter(el)
          }
        } else destinationList.append(el)
      }
      , liIndexCounter = 0
      , createLiItem = function (item, groupName){
        var currentLi = Elements.create('li', {id: item.value}).addClass('liStyle').data('index', liIndexCounter++)
        if (groupName) currentLi.data('group-item', groupName).addClass('liItemGroupStyle')
        Elements.create('span', {innerHTML: item.innerHTML}).appendTo(currentLi)
        return currentLi
      }
      , handleItem = function (item){
        if ('OPTION' == item.nodeName) {
          if (item.selected)selectionList.append(createLiItem(item))
          else selectableList.append(createLiItem(item))
        } else if ('OPTGROUP' == item.nodeName) {
          var groupName = item.label
            , groupLi = Elements.create('li').toggleClass('liGroupStyle liStyle').data('index',liIndexCounter++).data('groupName',groupName).appendTo(selectableList)
          groupLi.append(Elements.create('span', {innerHTML: item.label}))
          $(item).children().each(function (item){
            if (item.selected) {
              if (selectionList.children().select(function(e){return $(e).data('groupName')==groupName}).isEmpty()) {
                selectionList.append(groupLi.clone(true).data('groupName', groupName).data('index', groupLi.data('index')))
              }
              selectionList.append(createLiItem(item, groupName))
            } else selectableList.append(createLiItem(item, groupName))
          })
          cleanList(selectableList, groupName)
        }
      }
      , handleClickOnElement = function (originList, destinationList, isResultList){
        originList.listen('mouseover', 'li', function (e){
          var el =  $(this)
          if (el.data('groupName')) {
            if (options.selectableOptgroup) {
              el.addClass('liGroupStyleOver')
              originList.children().each(function (item){
                if (el.data('groupName') == $(item).data('group-item')) {
                  $(item).addClass('liItemGroupStyleOver')
                }
              })
            }
          } else el.addClass('liItemGroupStyleOver')
        })
        originList.listen('mouseout', 'li', function (e){
          var el =  $(this)
          if (options.selectableOptgroup && el.data('groupName')) {
            el.removeClass('liGroupStyleOver')
            originList.children().each(function (item){
              if (el.data('groupName') == $(item).data('group-item')) {
                $(item).removeClass('liItemGroupStyleOver')
              }
            })
          } else el.removeClass('liItemGroupStyleOver')
        })
        originList.listen('click', 'li', function (e){
          var el = $(this)
            , groupName
          if (groupName=el.data('groupName')) {
            if (options.selectableOptgroup) {
              if (destinationList.children().select(function(e){return $(e).data('groupName')==groupName}).isEmpty()) insertElement(destinationList, this)
              originList.children().each(function (item){
                if (groupName == $(item).data('group-item')) {
                  insertElement(destinationList, item)
                  if(!$(item).data('groupName'))$('#'+mainSelect[0].id+' option[value=' + item.id + ']')[0].selected = isResultList
                  $(item).removeClass('liItemGroupStyleOver')
                }
              })
              cleanList(originList, groupName)
            }
          }
          else {
            $('#'+mainSelect[0].id+' option[value=' + this.id + ']')[0].selected = isResultList
            if (groupName=el.data('group-item')) {
              var currentGroup = $(originList.children().select(function (item){
                return $(item).data('groupName') == groupName
              })[0])
              if (destinationList.children().select(function(e){return $(e).data('groupName')==groupName}).isEmpty()) {
                insertElement(destinationList, currentGroup.clone(true).data('groupName', groupName).data('index', currentGroup.data('index')))
              }
              insertElement(destinationList, this)
              cleanList(originList, groupName)
            } else insertElement(destinationList, el)
          }
          el.removeClass('liItemGroupStyleOver').removeClass('liGroupStyleOver')
        })
      }
      , addFilterInput = function(list){
        var filter = Elements.create('input',{'type':'text'}).addClass('filterStyle')
        filter.listen('keyup',function(){
          var currentInput = this.value
          list.children().each(function(item){
            if(item.innerHTML.match(currentInput))$(item).css({'display':'block'})
            else if(!$(item).data('groupName'))$(item).css({'display':'none'})
          })
        })
        list.insertBefore(filter)
      }
    nativeSelect.children().each(handleItem)
    if(options.filters){
      addFilterInput(selectableList)
      addFilterInput(selectionList)
    }
    handleClickOnElement(selectableList, selectionList, true)
    handleClickOnElement(selectionList, selectableList)
    fragment.appendChild(container[0])
    $(nativeSelect).insertAfter(fragment)
  }
})()