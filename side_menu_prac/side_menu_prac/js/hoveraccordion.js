/**
 * HoverAccordion - jQuery plugin for intuitively opening accordions and menus
 *
 * Copyright (c) 2008-2010 Bernd Matzner (http://matznermatzner.de/en/bernd)
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.9.2
 *
 * Requires jQuery 1.4.4 or higher
 */
(function($) {
    'use strict';

    $.fn.hoverAccordion = function(opts) {
        // Setup options
        var options = jQuery.extend({
            // Speed at which the subitems open up - valid options are: slow,
            // normal, fast, or integer for duration in milliseconds
            speed: 'fast',
            // true: Automatically activate items with links corresponding to
            // the current page, 2: Activate item #2 (numbering starts with 1!)
            activateItem: true,
            // true: Set the height of each accordion item to the size of the
            // largest one, false: Leave height as is
            keepHeight: false,
            // true: Handle accordion on click only rather than hovering, false:
            // React to hovering
            onClickOnly: false,
            // Class name of the initially active element
            classActive: 'active',
            // Class name for header items
            classHeader: 'header',
            // Class name for hover effect
            classHover: 'hover',
            // Class name for open header items
            classOpen: 'opened',
            // Class name for closed header items
            classClosed: 'closed'
        }, opts);

        // Current hover status
        var container = this;

        // Current URL
        var pageHref = window.location.href;

        // Interval for detecting intended element activation
        var i = 0;

        // Change display status of subitems when hovering
        var doHover = function(itemList, itemHeader, listHeight) {

            // Change only one display status at a time
            var oldList = $(container).find('.' + options.classOpen).closest(
                'li').find('ul:first');

            if (false === oldList.is(':animated')) {
                if (options.keepHeight === true) {
                    listHeight = maxHeight;
                }

                // Change display status if not already open
                if (itemHeader.hasClass(options.classOpen) === false) {
                    itemList.children().show();
                    itemList.animate({
                        height: listHeight
                    }, {
                        step: function(n, fx) {
                            itemList.height(listHeight - n);
                        },
                        duration: options.speed
                    });

                    oldList
                        .animate({
                            height: 0
                        }, {
                            step: function(n, fx) {
                                itemList.height(listHeight - n);
                            },
                            duration: options.speed
                        })
                        .children()
                        .hide();

                    // Switch classes for headers
                    itemHeader
                        .addClass(options.classOpen)
                        .removeClass(options.classClosed);

                    oldList
                        .closest('li')
                        .removeClass(options.classActive)
                        .find('a:first')
                        .addClass(options.classClosed)
                        .removeClass(options.classOpen);
                }
            }
        };

        var itemNo = 0;
        var maxHeight = 0;
        var itemList_active_index = options.activateItem-1;
        var that = this;
        /*if ($(right - main)) {
            //console.log("i am the class object");
            options.activate_subitem
            $(options.activate_subitem).addClass('show');
            $(options.activate_subitem).siblings().removeClass('show');
        }*/
        var $init_menu = $(".right-main").find('.content-' + options.activateItem);
        //console.log(itemList_active_index);
        //console.log($init_menu);
        var $init_submenu = $init_menu.find('.content-2-body-'+options.activate_subitem);
        /* init expand menu*/
        /*(function() {
            
        })();*/
        $(this).children('li').find('a:first').each(function(index, el) {
            /* 如果each到该元素-> a 若该元素索引等于activateItem*/
            if (itemList_active_index == index){
                //console.log("i run in");
                $init_menu.addClass('show');
                $init_menu.siblings().removeClass('show');
            }

            $(el).click(function(event) {
                /* Act on the event */
                if (itemList_active_index !== index) {
                    $(that).find('li').removeClass(options.subactive);
                    if ($(el).data("forcontent")) {
                        var content_num = $(this).data("forcontent").split("_")[0];
                        $("." + content_num).addClass('show');
                        /* 兄弟元素remove class*/
                        $("." + content_num).siblings().removeClass('show');
                        //console.log("you soga");
                        $(".right-main").find("." + $(el).data("forcontent")).addClass('show');
                        //console.log($(el).data("forcontent"));
                        //var other_forcontent = $(that).children('li').find('a:first').eq(itemList_active_index).data("forcontent");
                        //$("." + other_forcontent).removeClass('show');
                    }
                } else {

                }
                //console.log(index);
                //change the left-nav height value from the right
                options.changeNavHeight();
                itemList_active_index = index;
                //console.log(itemList_active_index);
                //如果有data-forcontent属性


                //console.log($(el).data("forcontent"));
            });
        });
        // Setup initial state and hover events
        $(this).children('li').each(function(index) {
            /* item表示$对象的每一个li*/
            var item = $(this),
                isActive = false,
                itemHeader = item.find('a:first').addClass(options.classHeader),
                itemHref,
                itemList,
                listHeight;

            itemNo++;
            /* li 下的ul*/
            itemList = item.find('ul:first');
            var itemList_li_classname_arr = [];
            /* */
            itemList.find("li").each(function(index, el) {
                //itemList_li_classname_arr=$(el).data("forcontent");
                itemList_li_classname_arr.push($(el).data("forcontent"));
            });

            //console.log("class name under the itemlist is:");
            //console.log(itemList_li_classname_arr);

            if (itemHeader.length > 0) {
                /* 如果有header*/
                // Hover effect for all links
                itemHeader.hover(function() {
                    /* 加类去类*/
                    itemHeader.addClass(options.classHover);
                }, function() {
                    itemHeader.removeClass(options.classHover);
                });
                /* 标题头的链接*/
                itemHref = itemHeader.attr('href');

                if (itemHref === '#') {
                    // Add a click event if the header does not contain a link
                    itemHeader.click(function() {
                        this.blur();
                        return false;
                        //$(this).parent().parent()
                    });
                } else if (options.activateItem === true &&
                    pageHref.indexOf(itemHref) > 0 &&
                    pageHref.length - pageHref.lastIndexOf(itemHref) === itemHref.length) {
                    isActive = true;
                    item.addClass(options.classActive);
                    itemList.parent().find('li').removeClass(options.subactive);
                    itemHeader.removeClass(options.classClosed).addClass(
                        options.classOpen);
                }
            }
            itemHeader.click(function() {
                //this.blur();
                //return false;
                //$(this).parent().parent().find('li').removeClass(options.subactive);
                if (!itemHeader.find(options.subactive) && !isActive) {
                    $(this).parent().parent().find('li').removeClass(options.subactive);
                }
                if (!isActive) {
                    //
                }

            });
            /**
             * itemList事件响应
             * @param  {[type]} event click
             * @return {[type]}       [description]
             */
            itemList.on('click', 'li', function(event) {
                //event.preventDefault();
                /* Act on the event */
                $(this).parent().find("li").removeClass('show');
                $(this).parent().parent().find('li').removeClass(options.subactive);
                $(this).addClass(options.subactive);
                //console.log(options.subactive);
                //console.log($(this).html());
                //如果有data-forcontent属性
                var content_num = $(this).data("forcontent").split("_")[0];
                $("." + content_num).addClass('show');
                $("." + content_num).siblings().removeClass('show');
                //console.log(content_num);
                if ($(this).data("forcontent")) {
                    //console.log($(this).data("forcontent"));
                    var itemList_for_content = $(this).data("forcontent");
                    $(".right-main").find("." + itemList_for_content).addClass('show');
                    var the_index_in_array = $.inArray(itemList_for_content, itemList_li_classname_arr);
                    //console.log(the_index_in_array);
                    $.each(itemList_li_classname_arr, function(index, el) {
                        if (index !== the_index_in_array) {
                            //console.log(el);
                            $("." + el).removeClass('show');
                        } else {
                            //console.log("i am the clicked list item");
                            $("." + el).addClass('show');
                        }
                    });
                }
                //change the left-nav height value from the right
                options.changeNavHeight();
            });
            // Initialize subitems
            if (itemList.length > 0) {
                listHeight = itemList.height();

                if (maxHeight < listHeight) {
                    maxHeight = listHeight;
                }

                if (options.onClickOnly === true) {
                    itemHeader.click(function() {
                        doHover(itemList, itemHeader, listHeight);
                    });
                } else {
                    // Bind hover events to all headers of sublists
                    itemHeader.hover(function() {
                        i = setInterval(function() {
                            doHover(itemList, itemHeader, listHeight);
                            clearInterval(i);
                        }, 400);
                    }, function() {
                        clearInterval(i);
                    });
                }

                // Set current link to current URL to 'active'
                if (options.activateItem === true) {
                    itemList.children('li').each(function() {
                        var m = $(this).find('a').attr('href');
                        if (m) {
                            if (pageHref.indexOf(m) > 0 &&
                                pageHref.length - pageHref.lastIndexOf(m) === m.length) {
                                isActive = true;
                                item.addClass(options.classActive);
                                itemList.parent().parent().find('li').removeClass(options.subactive);
                                itemHeader
                                    .removeClass(options.classClosed)
                                    .addClass(options.classOpen);
                            }
                        }
                    });
                } else if (parseInt(options.activateItem, 10) === itemNo) {
                    isActive = true;
                    item.addClass(options.classActive);
                    /*if (options.$expand_item) {
                        console.log("i am the class object");
                        options.$expand_item.addClass('show');
                        options.$expand_item.siblings().removeClass('show');
                    }*/
                    itemList.parent().parent().find('li').removeClass(options.subactive);
                    itemList.find('li').eq(options.activate_subitem-1).addClass(options.subactive);
                    var forcontent_classname=itemList.find('li').eq(options.activate_subitem-1).data("forcontent");
                    $("."+forcontent_classname).addClass('show').siblings().removeClass('show');
                    itemHeader
                        .removeClass(options.classClosed)
                        .addClass(options.classOpen);
                }
            }

            // Close all subitems except for those with active items
            if (!isActive) {
                itemHeader.removeClass(options.classOpen);
                if (itemList.length > 0) {
                    itemList.children().hide();
                    itemHeader.addClass(options.classClosed);
                }
            }
        });

        return this;
    };
})(jQuery);
