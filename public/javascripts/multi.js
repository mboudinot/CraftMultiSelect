!function () {
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
            , container = Element.make('div', {id: 'container_' + nativeSelect.id}).addClass('containerStyle')
            , selectable = Element.make('div', {id: 'selectable_' + nativeSelect.id}).appendTo(container).addClass('selectableDivStyle')
            , selectableList = Element.make('ul', {id: 'content-list'}).appendTo(selectable).addClass('ulStyle')
            , selection = Element.make('div', {id: 'selection_' + nativeSelect.id}).appendTo(container).addClass('selectionDivStyle')
            , selectionList = Element.make('ul', {id: 'content-selected-list'}).appendTo(selection).addClass('ulStyle')
            , fragment = Element.createFragment()
            , insertElementByGroup = function (destinationList, groupName, el) {
                var indexPosition = destinationList.getChildren().pluck('data-group-item').lastIndexOf(groupName)
                if (indexPosition != -1) destinationList.insertBefore(el, destinationList.getChildren()[indexPosition+(Craft.Browser.isIE?0:1)])
                else destinationList.insert(el)
                el.removeClass('liItemGroupStyleOver')
            }
            , cleanOriginList = function (originList, groupName) {
                if (!originList.getChildren().pluck('data-group-item').contains(groupName)) {
                    originList.getChildren().each(function (item) {
                        if (item.get('data-group') == groupName)item.remove()
                    })
                }
            }
            , createLi = function (item, groupName, destination) {
                var currentLi = Element.make('li', {id: item.value}).appendTo(destination ? destination : selectableList).toggleClass('liStyle').set('item', item)
                if (groupName) currentLi.set('data-group-item', groupName).addClass('liItemGroupStyle')
                Element.make('span', {innerHTML: item.innerHTML}).appendTo(currentLi)
            }
            , handleItem = function (item) {
                if ('OPTION' == item.nodeName) {
                    if (item.selected)createLi(item, null, selectionList)
                    else createLi(item)
                } else if ('OPTGROUP' == item.nodeName) {
                    var groupName = item.get('label')
                        , groupLi = Element.make('li').appendTo(selectableList).toggleClass('liStyle liGroupStyle').set('data-group', groupName)
                    Element.make('span', {innerHTML: item.get('label')}).appendTo(groupLi)
                    item.getChildren().each(function (item) {
                        if (item.selected) {
                            if (!selectionList.getChildren().pluck('data-group').contains(groupName)) {
                                selectionList.insert(groupLi.cloneNode(true).set('data-group', groupName))
                            }
                            createLi(item, groupName, selectionList)
                        } else createLi(item, groupName)
                    })
                    cleanOriginList(selectableList, groupName)
                }
            }
            , handleClickOnElement = function (originList, destinationList, isResultList) {
                originList.listen('mouseover', 'li', function (e, el) {
                    if (el.get('data-group')) {
                        if (options.selectableOptgroup) {
                            el.toggleClass('liGroupStyleOver')
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
                            if (!destinationList.getChildren().pluck('data-group').contains(el.get('data-group'))) {
                                destinationList.insert(el)
                            }
                            originList.getChildren().each(function (item) {
                                if (el.get('data-group') == item.get('data-group-item')) {
                                    insertElementByGroup(destinationList, el.get('data-group'), item)
                                    if (isResultList) {
                                        item.get('item').selected = true
                                    } else {
                                        item.get('item').selected = false
                                    }
                                }
                            })
                            cleanOriginList(originList, el.get('data-group'))
                        }
                    } else {
                        if (isResultList) {
                            el.get('item').selected = true
                        } else {
                            el.get('item').selected = false
                        }
                        if (el.get('data-group-item')) {
                            var groupName = el.get('data-group-item')
                            var currentGroup = originList.getChildren().select(function (item) {
                                return item.get('data-group') == groupName
                            })[0]
                            if (!destinationList.getChildren().pluck('data-group').contains(groupName)) {
                                destinationList.insert(currentGroup.cloneNode(true).set('data-group', groupName))
                            }
                            insertElementByGroup(destinationList, groupName, el)
                            cleanOriginList(originList, groupName)
                        } else {
                            destinationList.insert(el)
                        }
                    }
                    el.removeClass('liItemGroupStyleOver')
                    el.removeClass('liGroupStyleOver')
                })
            }
        nativeSelect.getChildren().each(handleItem)
        handleClickOnElement(selectableList, selectionList, true)
        handleClickOnElement(selectionList, selectableList)
        fragment.appendChild(container)
        nativeSelect.getParent().insertBefore(fragment, nativeSelect.getParent().getChildren()[nativeSelect.getParent().getChildren().pluck('id').lastIndexOf(select.id) + (Craft.Browser.isIE?0:1)])
    }
}()