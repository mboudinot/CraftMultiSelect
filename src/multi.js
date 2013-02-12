;(function () {
    Element.extend({
        'multiSelect': function (options) {
            var self = this
            if (!options)options = {selectableOptgroup: true}
            if (self.nodeName == 'SELECT')createMultiSelect(self, options)
            return self
        }
    })

    function createMultiSelect(select, options) {
        var nativeSelect = select.css({display: 'none'})
            , container = Element.make('div').addClass('containerStyle')
            , selectable = Element.make('div').addClass('selectableDivStyle').appendTo(container)
            , selectableList = Element.make('ul').addClass('ulStyle').appendTo(selectable)
            , selection = Element.make('div').addClass('selectionDivStyle').appendTo(container)
            , selectionList = Element.make('ul').addClass('ulStyle').appendTo(selection)
            , fragment = Element.createFragment()
            , cleanList = function (list, groupToCheck) {
                if (!list.getChildren().pluck('data-group-item').contains(groupToCheck)) {
                    list.getChildren().each(function (item) {if (item.get('data-group') == groupToCheck)item.remove()})
                }
            }
            , insertElement = function (destinationList, el) {
                if (!destinationList.getChildren().isEmpty()) {
                    if (destinationList.getChildren()[0].get('data-index') > el.get('data-index')) {
                        destinationList.getChildren()[0].insert({before: el})
                    } else {
                        destinationList.getChildren().fold(function (item, next) { return (next.get('data-index') > el.get('data-index')) ? item : next}).insert({after: el})
                    }
                } else destinationList.insert(el)
            }
            , liIndexCounter = 0
            , createLiItem = function (item, groupName) {
                var currentLi = Element.make('li', {id: item.value, 'data-index': liIndexCounter++, 'item': item}).addClass('liStyle')
                if (groupName) currentLi.set('data-group-item', groupName).addClass('liItemGroupStyle')
                Element.make('span', {innerHTML: item.innerHTML}).appendTo(currentLi)
                return currentLi
            }
            , handleItem = function (item) {
                if ('OPTION' == item.nodeName) {
                    if (item.selected)selectionList.insert(createLiItem(item))
                    else selectableList.insert(createLiItem(item))
                } else if ('OPTGROUP' == item.nodeName) {
                    var groupName = item.get('label')
                        , groupLi = Element.make('li', {'data-index': liIndexCounter++, 'data-group': groupName}).toggleClass('liGroupStyle liStyle').appendTo(selectableList)
                    Element.make('span', {innerHTML: item.get('label')}).appendTo(groupLi)
                    item.getChildren().each(function (item) {
                        if (item.selected) {
                            if (!selectionList.getChildren().pluck('data-group').contains(groupName)) {
                                selectionList.insert(groupLi.cloneNode(true).set('data-group', groupName).set('data-index', groupLi.get('data-index')))
                            }
                            selectionList.insert(createLiItem(item, groupName))
                        } else selectableList.insert(createLiItem(item, groupName))
                    })
                    cleanList(selectableList, groupName)
                }
            }
            , handleClickOnElement = function (originList, destinationList, isResultList) {
                originList.listen('mouseover', 'li', function (e, el) {
                    if (el.get('data-group')) {
                        if (options.selectableOptgroup) {
                            el.addClass('liGroupStyleOver')
                            originList.getChildren().each(function (item) {
                                if (el.get('data-group') == item.get('data-group-item')) {
                                    item.addClass('liItemGroupStyleOver')
                                }
                            })
                        }
                    } else el.addClass('liItemGroupStyleOver')
                })
                originList.listen('mouseout', 'li', function (e, el) {
                    if (options.selectableOptgroup && el.get('data-group')) {
                        el.removeClass('liGroupStyleOver')
                        originList.getChildren().each(function (item) {
                            if (el.get('data-group') == item.get('data-group-item')) {
                                item.removeClass('liItemGroupStyleOver')
                            }
                        })
                    } else el.removeClass('liItemGroupStyleOver')
                })
                originList.listen('click', 'li', function (e, el) {
                    if (el.get('data-group')) {
                        if (options.selectableOptgroup) {
                            if (!destinationList.getChildren().pluck('data-group').contains(el.get('data-group'))) insertElement(destinationList, el)
                            originList.getChildren().each(function (item) {
                                if (el.get('data-group') == item.get('data-group-item')) {
                                    insertElement(destinationList, item)
                                    item.get('item').selected = isResultList
                                    item.removeClass('liItemGroupStyleOver')
                                }
                            })
                            cleanList(originList, el.get('data-group'))
                        }
                    } else {
                        el.get('item').selected = isResultList
                        if (el.get('data-group-item')) {
                            var groupName = el.get('data-group-item')
                            var currentGroup = originList.getChildren().select(function (item) {
                                return item.get('data-group') == groupName
                            })[0]
                            if (!destinationList.getChildren().pluck('data-group').contains(groupName)) {
                                insertElement(destinationList, currentGroup.cloneNode(true).set('data-group', groupName).set('data-index', currentGroup.get('data-index')))
                            }
                            insertElement(destinationList, el)
                            cleanList(originList, groupName)
                        } else insertElement(destinationList, el)
                    }
                    el.removeClass('liItemGroupStyleOver').removeClass('liGroupStyleOver')
                })
            }
        nativeSelect.getChildren().each(handleItem)
        handleClickOnElement(selectableList, selectionList, true)
        handleClickOnElement(selectionList, selectableList)
        fragment.appendChild(container)
        nativeSelect.insert({after: fragment})
    }
})()