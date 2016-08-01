'use strict';

(function (U, $) {

    if (!Array.from) {
        Array.from = function (object) {
            return [].slice.call(object);
        };
    }

    /*
    ** Main IPPR object holding all the info about the dom and data
    */
    var IPPR = {
        dom: {
            header: $('.Header'),
            data: $('.Data'),
            lists: {
                main: '.List--main',
                extra: '.List--extra',
                info: '.List--info',
                count: '.List-count',
                header: '.List-header',
                holder: '.List-holder',
                title: '.List-title',
                list: '.collection',
                infoName: '.List-infoName',
                headerActive: '.List-headerActive',
                headerInActive: '.List-headerInactive',
                switch: '.List-switch'
            },
            content: $('.Content'),
            tabs: $('.Header-tabs a'),
            levels: $('div[data-level]'),
            dataHolder: $('.Data-holder'),
            filters: {
                main: '.Filters',
                mobile: '.Filters--mobile',
                item: '.Filters .chip',
                trigger: $('.Filters-trigger'),
                activeHolder: $('.Filters-active'),
                remove: $('Filters-remove'),
                search: $('.Search-field'),
                searchRemove: $('.Search-remove'),
                searchTrigger: $('.Search-trigger')
            },
            map: $('.Map'),
            mapTrigger: $('.Map-trigger'),
            mapInline: $('.Map--inline'),
            showInfo: '.js-showAdditionalInfo',
            sankey: {
                mobile: '.Sankey-mobile',
                desktop: '.Sankey-desktop'
            },
            additionalInfo: $('.AdditionalInfo'),
            additionalInfoTitle: $('.AdditionalInfo-title'),
            additionalInfoHeader: $('.AdditionalInfo-header'),
            footer: $('.Footer'),
            templates: {
                main: '.main-tpl',
                extra: '.extra-tpl',
                licenceTable: '.licenceTable-tpl',
                companyTable: '.companyTable-tpl',
                ownedLicenses: '.ownedLicenses-tpl',
                hierarchy: '.hierarchy-tpl'
            },
            additionalInfoStrings: {
                licence: 'Transaction history for Licence number <span></span>',
                company: 'Additional information'
            },
            ownedLicenses: '.OwnedLicenses',
            'hierarchy': '.Hierarchy'
        },
        states: {
            loading: 'is-loading',
            active: 'is-active',
            animate: 'has-animation',
            hidden: 'u-isHidden',
            visible: 'is-visible',
            selected: 'is-selected',
            mobile: false,
            desktop: false,
            view: 'licenses',
            map: false,
            filters: false
        },
        data: {
            apiURL: 'https://namibmap.carto.com/api/v2/sql/?q=',
            data: {},
            tabs: {
                0: {
                    name: 'licenses',
                    sql: "SELECT MAX(companies.company_id) as company_id, MAX(companies.company_hq) as company_hq, MAX(companies.company_formed) as company_formed, MAX(companies.company_jurisdiction) as company_jurisdiction, MAX(companies.website) as company_website, MAX(companies.company_name) as company_name, MAX(companies.company_address) as company_address, license_number, array_to_string(array_agg(concession_number), ',') as concessions FROM hydrocarbon_licences_latest_clean JOIN companies ON (hydrocarbon_licences_latest_clean.company_id = companies.company_id) GROUP BY license_number, companies.company_id ORDER BY license_number",
                    groupBy: 'license_number'
                },
                1: {
                    name: 'companies',
                    sql: "SELECT * FROM companies JOIN hydrocarbon_licences_latest_clean ON (companies.company_id = hydrocarbon_licences_latest_clean.company_id) ORDER BY company_name",
                    groupBy: 'company_id'
                }
            }
        },
        map: {
            map: [],
            layers: [],
            markers: [],
            styles: {
                default: {
                    weight: 1,
                    color: '#256A9A',
                    dashArray: '',
                    fillOpacity: 0.5
                },
                active: {
                    weight: 2,
                    color: '#256A9A',
                    dashArray: '',
                    fillOpacity: 1
                },
                filtered: {
                    weight: 3,
                    color: '#256A9A',
                    dashArray: '',
                    fillOpacity: 0.2
                }
            },
            highlightLayer: function highlightLayer(key, id) {

                $.each(IPPR.map.layers[key], function (k, value) {

                    if (!IPPR.states.filters) {
                        IPPR.map.layers[key][k].setStyle(IPPR.map.styles.default);
                        $(IPPR.map.markers[key][k]._icon).removeClass(IPPR.states.active);
                        $(IPPR.map.markers[key][k]._icon).removeClass(IPPR.states.selected);
                        IPPR.map.layers[key][k].isActive = false;
                        IPPR.map.markers[key][k].isActive = false;
                    }

                    if (value.ID === id || value.company_id === id) {
                        IPPR.map.layers[key][k].setStyle(IPPR.map.styles.active);
                        IPPR.map.layers[key][k].isActive = true;
                        IPPR.map.markers[key][k].isActive = true;
                        $(IPPR.map.markers[key][k]._icon).addClass(IPPR.states.selected);

                        if (IPPR.states.mobile) {
                            setTimeout(function () {
                                if (IPPR.map.markers[key][k]._latlng.lat && IPPR.map.markers[key][k]._latlng.lng) {
                                    IPPR.map.map[key].setView(new L.LatLng(IPPR.map.markers[key][k]._latlng.lat, IPPR.map.markers[key][k]._latlng.lng), 6);
                                }
                            }, 200);
                        }
                    }
                });
            },
            resetLayers: function resetLayers() {
                $.each(IPPR.map.layers, function (k, v) {
                    $.each(v, function (index) {
                        IPPR.map.layers[k][index].setStyle(IPPR.map.styles.default);
                        $(IPPR.map.markers[k][index]._icon).removeClass(IPPR.states.active);
                        $(IPPR.map.markers[k][index]._icon).removeClass(IPPR.states.selected);
                    });
                });
            },
            searchLayers: function searchLayers(type) {

                if (!IPPR.states.filters) {
                    IPPR.map.resetLayers();
                }

                var key = type === 'licenses' ? 0 : 2,
                    listItems = $(IPPR.dom.lists.main + ':visible').find('.collection-item'),
                    ids = [];

                $.each(listItems, function (index, val) {
                    ids.push($(val).data('id'));
                });

                $.each(IPPR.map.layers[key], function (k, v) {
                    if ($.inArray(v.ID, ids) < 0 && $.inArray(v.company_id, ids) < 0) {
                        IPPR.map.layers[key][k].setStyle(IPPR.map.styles.filtered);
                        $(IPPR.map.markers[key][k]._icon).removeClass(IPPR.states.active);
                        $(IPPR.map.markers[key][k]._icon).removeClass(IPPR.states.selected);
                        IPPR.map.layers[key][k].isActive = false;
                        IPPR.map.markers[key][k].isActive = false;
                    } else {
                        $(IPPR.map.markers[key][k]._icon).removeClass(IPPR.states.selected);
                        IPPR.map.layers[key][k].setStyle(IPPR.map.styles.default);
                        IPPR.map.layers[key][k].isActive = true;
                        IPPR.map.markers[key][k].isActive = true;
                    }
                });

                var size = $(IPPR.dom.lists.main + ':visible').find('.collection-item').size();
                $(IPPR.dom.lists.main).find(IPPR.dom.lists.count).html('(' + size + ')');
            }
        },
        filters: {
            list: [],
            options: {
                valueNames: ['List-title', 'concessionNumbers', 'expiration'],
                listClass: 'collection',
                searchClass: 'Search-input'
            },
            clear: function clear() {
                $.each(IPPR.filters.list, function (k) {
                    IPPR.filters.list[k].filter();
                });
                $(IPPR.dom.filters.item).removeClass(IPPR.states.active);
                IPPR.dom.filters.search.removeClass(IPPR.states.hidden);
                IPPR.dom.filters.activeHolder.empty();
            }
        },
        helpers: {
            groupBy: function groupBy(xs, key) {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            },
            unique: function unique(value, index, self) {
                return self.indexOf(value) === index;
            }
        }
    };

    /*
    ** Load the google chart sankey package
    */
    google.charts.load('current', { 'packages': ['sankey'] });

    /*
    ** Set / remove loading classes while the data loads
    */
    IPPR.loading = function () {
        IPPR.dom.data.toggleClass(IPPR.states.loading);
    };

    /*
    ** Get the data for each tab and store it in the main IPPR object.
    */
    IPPR.getData = function () {

        var markup = [],
            mustacheTpl = [],
            table,
            hierarchy,
            ownedLicenses,
            title,
            expiration = false;

        /*
        ** For each tab ...
        */
        $.each(IPPR.data.tabs, function (key, tab) {

            markup[key] = '';
            mustacheTpl[key] = $('#tab-' + key).find(IPPR.dom.templates.main).html();

            /*
            ** ... get the data from carto.com
            */
            $.getJSON(IPPR.data.apiURL + tab.sql, function (data) {
                /*
                ** ... sort data - broup by, store it the main IPPR object
                */
                IPPR.data.data[key] = IPPR.helpers.groupBy(data.rows, tab.groupBy);

                /*
                ** .. run through the data, parse the templates
                */
                $.each(IPPR.data.data[key], function (k, value) {

                    /*
                    ** ... set up conncession data
                    */
                    var concessions = '';
                    $.each(value, function (k, v) {
                        concessions += v.concessions;
                    });

                    /*
                    ** ... parse the template for future use
                    */
                    Mustache.parse(mustacheTpl[key]);

                    /*
                    ** ... assign data to templates
                    */
                    if (tab.name === 'companies') {
                        title = value[0].company_name;
                        ownedLicenses = '[{"name": "Name", "percent": "50%", "numbers": [123,234]},{"name": "Name", "percent": "50%", "numbers": [123,234]}]';
                    } else {
                        title = k;
                        table = '[{"licenceNumber": "Pel 003 - licence Number", "transferDate": "01/2012 - transferDate", "transferType": "Transfer type", "licenceSeller": "licenceSeller", "sellerStakePrior": "sellerStakePrior", "licenceBuyer": "licenceBuyer", "buyerStakeAfter": "buyerStakeAfter", "operatorPrior": "operatorPrior", "operatorAfter": "operatorAfter"}, {"licenceNumber": "Pel 003 - licence Number", "transferDate": "01/2012 - transferDate", "transferType": "Transfer type", "licenceSeller": "licenceSeller", "sellerStakePrior": "sellerStakePrior", "licenceBuyer": "licenceBuyer", "buyerStakeAfter": "buyerStakeAfter", "operatorPrior": "operatorPrior", "operatorAfter": "operatorAfter"} ]';
                    }

                    /*
                    ** ... render templates with the data
                    */
                    markup[key] += Mustache.render(mustacheTpl[key], {
                        title: title,
                        id: k,
                        sankey: '[[ "Goverment of Namibia 100%", "Eco oil and gas 20%", 10, "20%"],[ "Eco oil and gas 20%", "Eco oil and gas 10%", 5, "10%" ],[ "Eco oil and gas 20%", "New Buyer 10%", 5, "10%" ],[ "Goverment of Namibia 100%", "Goverment of Namibia 80%", 8, "80%"]]', // TODO
                        table: table, // TODO
                        ownedLicenses: ownedLicenses,
                        hierarchy: hierarchy,
                        expiration: expiration,
                        concessionNumbers: concessions ? concessions.split(',') : false
                    });
                });

                /*
                ** ... append the data to the main lists in each tab
                */
                $('#tab-' + key).find(IPPR.dom.lists.main).find(IPPR.dom.lists.list).html(markup[key]);
                $('#tab-' + key).find(IPPR.dom.lists.main).find(IPPR.dom.lists.count).html('(' + Object.keys(IPPR.data.data[key]).length + ')');

                /*
                ** ... we are done with the data, set loading to false and turn on the filtering
                */
                if (Object.keys(IPPR.data.tabs).length - 1 === parseInt(key)) {
                    IPPR.loading();
                    IPPR.filtering();
                }
            });
        });
    };

    /*
    ** Initialize the maps ...
    */
    IPPR.initMap = function () {

        /*
        ** ... get the geo json data
        */
        $.getJSON('/data/data2.json', function (data) {

            /*
            ** ... for each map in the dom initialize the maps and populate with layers and markers
            */
            $.each(IPPR.dom.map, function (key, val) {

                var that = $(val);

                IPPR.map.layers[key] = [];
                IPPR.map.markers[key] = [];

                /*
                ** ... init map
                */
                IPPR.map.map[key] = L.map($('.Map').eq(key)[0], {
                    scrollWheelZoom: false,
                    zoomControl: false
                }).setView([-23.534, 6.172], 6);

                /*
                ** ... change zoom controls to be in the bottom right corner
                */
                L.control.zoom({
                    position: 'bottomright'
                }).addTo(IPPR.map.map[key]);

                /*
                ** ... base layer with the map of the world
                */
                L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
                    maxZoom: 18
                }).addTo(IPPR.map.map[key]);

                /*
                ** ... function to be executed on each layer
                */
                function onEachLayer(feature, layer) {

                    /*
                    ** ... append the data to each layer
                    */
                    $.each(feature.properties, function (index, val) {
                        layer[index] = val;
                    });

                    /*
                    ** ... extra data
                    */
                    layer.ID = feature.properties.license_number;
                    layer.company_name = feature.properties.holder;

                    /*
                    ** ... push the layers for later use
                    */
                    IPPR.map.layers[key].push(layer);

                    /*
                    ** ... add labels to the polygons
                    */
                    var marker = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'Map-label',
                            html: '<span>' + layer.concession_number + '</span>'
                        })
                    }).addTo(IPPR.map.map[key]);

                    /*
                    ** ... push the labels for later use
                    */
                    IPPR.map.markers[key].push(marker);

                    /*
                    ** ... each layer AND marker/label has a click function
                    */
                    function onClick() {

                        /*
                        ** ... if the current view is filtered (has active search or filtering) restyle the layers
                        */
                        if (IPPR.states.filters) {
                            IPPR.map.searchLayers(IPPR.states.view);
                        }

                        /*
                        ** ... If this label or marker is not active remove all active filters and reset search
                        */
                        if (!this.isActive) {
                            // jshint ignore:line
                            IPPR.dom.filters.searchRemove.click();
                        }

                        /*
                        ** ... click the item in the main list, scroll list to the top
                        */
                        var elem, top;
                        if (that.is('.licenses')) {
                            elem = $(IPPR.dom.lists.main).find('li[data-id="' + feature.properties.license_number + '"]');
                            elem.click();
                            top = elem.position().top;
                            $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).scrollTop(top);
                        } else if (that.is('.companies')) {
                            elem = $(IPPR.dom.lists.main).find('li[data-id="' + feature.properties.company_id + '"]');
                            elem.click();
                            top = elem.position().top;
                            $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).scrollTop(top);
                        }
                    }

                    /*
                    ** ... assign the click events on layers and markers/labels
                    */
                    marker.on('click', onClick);
                    layer.on('click', onClick);
                }

                /*
                ** ... parse the geojson data and add it to the map
                */
                L.geoJson([data], {
                    style: IPPR.map.styles.default,
                    onEachFeature: onEachLayer
                }).addTo(IPPR.map.map[key]);
            });
        });
    };

    /*
    ** Switch from licence to company and vice versa with that licence or company selected
    */
    $(document).on('click', IPPR.dom.lists.switch, function () {
        var id = $(this).data('id'),
            view = $(this).data('to');

        IPPR.states.view = view;

        $('a[data-view="' + view + '"]').click();
        $('.collection-item[data-id="' + id + '"]').click();
        var top = $('.collection-item[data-id="' + id + '"]').position().top;
        $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).scrollTop(top);
    });

    /*
    ** Display additional data for each clicked licence and compay below the main elements (lists with map) ...
    */
    IPPR.displayAdditionalInfo = function (item, type) {

        var sankeyData, tableData, title, mustacheTpl, finalTable, hierarchyTpl, finalHierarchy;

        /*
        ** ... if this is licence
        */
        if (type === 'licence') {

            /*
            ** ... append the title, change the background color
            */
            $(IPPR.dom.additionalInfoTitle).html(IPPR.dom.additionalInfoStrings[type]);
            $(IPPR.dom.additionalInfoHeader).removeClass('green').addClass('blue');

            /*
            ** ... get the data from data attributes
            */
            sankeyData = item.data('sankey');
            tableData = item.data('table');
            title = item.find(IPPR.dom.lists.title).html();

            /*
            ** ... get and parse the template for the table
            */
            mustacheTpl = $(IPPR.dom.templates.licenceTable).html();
            Mustache.parse(mustacheTpl);

            finalTable = Mustache.render(mustacheTpl, {
                tableRows: Array.from(tableData)
            });

            /*
            ** ... hide the company addition info because we are on licences
            */
            IPPR.dom.additionalInfo.find(IPPR.dom.ownedLicenses).addClass(IPPR.states.hidden);
            IPPR.dom.additionalInfo.find(IPPR.dom.hierarchy).addClass(IPPR.states.hidden);

            /*
            ** ... append data to the DOM
            */
            if (IPPR.states.mobile) {
                $(IPPR.dom.lists.info).find(IPPR.dom.lists.infoName).html(title);

                /*
                ** ... draw sankey graph
                */
                IPPR.sankey(sankeyData, IPPR.dom.sankey.mobile);

                $(IPPR.dom.lists.info).find('.Table').html(finalTable);
                IPPR.dom.additionalInfo.addClass(IPPR.states.hidden);
            } else {
                IPPR.dom.additionalInfo.removeClass(IPPR.states.hidden);
                IPPR.dom.additionalInfo.find('.AdditionalInfo-title span').html(title);
                $(IPPR.dom.sankey.desktop).removeClass(IPPR.states.hidden);
                IPPR.sankey(sankeyData, IPPR.dom.sankey.desktop);
                IPPR.dom.additionalInfo.find('.Table').html(finalTable);
            }
        } else {

            $(IPPR.dom.additionalInfoTitle).html(IPPR.dom.additionalInfoStrings[type]);
            $(IPPR.dom.additionalInfoHeader).removeClass('blue').addClass('green');

            $(IPPR.dom.sankey.desktop).addClass(IPPR.states.hidden);
            IPPR.dom.additionalInfo.removeClass(IPPR.states.hidden);

            tableData = IPPR.data.data[1][item.data('id')][0];
            // ownedLicenses = item.data('ownedlicenses');

            mustacheTpl = $('.companyTable-tpl').html();
            // ownedLicensesTpl = $('.ownedLicenses-tpl').html();
            hierarchyTpl = $('.hierarchy-tpl').html();

            Mustache.parse(mustacheTpl);
            // Mustache.parse(ownedLicensesTpl);
            Mustache.parse(hierarchyTpl);

            finalTable = Mustache.render(mustacheTpl, {
                tableRows: tableData
            });

            // finalownedLicenses = Mustache.render(
            //     ownedLicensesTpl, {
            //         licence: Array.from(ownedLicenses),
            //     }
            // );


            $.getJSON('https://namibmap.carto.com/api/v2/sql/?q=SELECT * FROM companies_people WHERE company_id = ' + item.data('id'), function (data) {

                finalHierarchy = Mustache.render(hierarchyTpl, {
                    hierarchy: data.rows
                });

                if (IPPR.states.mobile) {
                    $(IPPR.dom.lists.extra).find('.Hierarchy').html(finalHierarchy);
                } else {
                    IPPR.dom.additionalInfo.find('.Hierarchy').html(finalHierarchy).removeClass(IPPR.states.hidden);
                }
            });

            if (IPPR.states.mobile) {
                $(IPPR.dom.lists.extra).find('.Table').html(finalTable);
                // $(IPPR.dom.lists.extra).find('.OwnedLicenses').html(finalownedLicenses);
                IPPR.dom.additionalInfo.addClass(IPPR.states.hidden);
            } else {
                IPPR.dom.additionalInfo.removeClass(IPPR.states.hidden);
                IPPR.dom.additionalInfo.find('.Table').html(finalTable).removeClass(IPPR.states.hidden);
                // IPPR.dom.additionalInfo.find('.OwnedLicenses').html(finalownedLicenses).removeClass(IPPR.states.hidden);

            }
        }
    };

    // Mobile behaviour of the app
    IPPR.mobile = function () {
        IPPR.states.desktop = false;

        IPPR.dom.tabs.off('click.mobile');

        IPPR.dom.tabs.on('click.mobile', function () {

            IPPR.states.filters = false;
            IPPR.dom.filters.searchTrigger.removeClass(IPPR.states.hidden);
            IPPR.dom.filters.searchRemove.removeClass(IPPR.states.visible);
            IPPR.dom.filters.searchRemove.click();
            IPPR.filters.clear();

            setTimeout(function () {
                IPPR.dom.footer.addClass(IPPR.states.hidden);
            }, 400);

            IPPR.map.resetLayers();
            IPPR.dom.content.addClass(IPPR.states.active);

            setTimeout(function () {
                IPPR.dom.content.addClass(IPPR.states.animate);
                $.each(IPPR.map.map, function (key, value) {
                    if (value) {
                        value.invalidateSize();
                    }
                });
            }, 100);

            IPPR.states.view = $(this).data('view');

            if (IPPR.states.view === 'licenses') {
                IPPR.dom.mapTrigger.addClass(IPPR.states.active);
            } else {
                IPPR.dom.map.removeClass(IPPR.states.visible);
                $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).removeClass(IPPR.states.hidden);
                IPPR.dom.mapTrigger.find('.material-icons').html('map');
            }
        });

        $.each(IPPR.dom.levels, function (key, value) {
            var level = $(this).data('level');

            $(value).find(IPPR.dom.lists.header).off('click');
            $(value).find(IPPR.dom.lists.header).on('click', function () {
                if (level === 0) {
                    IPPR.dom.footer.removeClass(IPPR.states.hidden);
                    IPPR.dom.content.removeClass(IPPR.states.animate);
                    setTimeout(function () {
                        IPPR.dom.content.removeClass(IPPR.states.active);
                    }, 100);
                    IPPR.dom.mapTrigger.removeClass(IPPR.states.active);
                } else if (level === 1) {
                    IPPR.dom.dataHolder.css({ transform: 'translate(0,0)' });
                    if (IPPR.states.view === 'licenses') {
                        IPPR.dom.mapTrigger.addClass(IPPR.states.active);
                    }
                    IPPR.dom.map.removeClass(IPPR.states.hidden);
                    $.each(IPPR.map.map, function (key, value) {
                        if (value) {
                            value.invalidateSize();
                        }
                    });
                    $(IPPR.dom.lists.extra).addClass(IPPR.states.hidden);
                    $(IPPR.dom.lists.info).addClass(IPPR.states.hidden);

                    if (IPPR.dom.mapTrigger.find('.material-icons').html() === 'map') {
                        $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).removeClass(IPPR.states.hidden);
                    }
                } else if (level === 2) {
                    IPPR.dom.dataHolder.css({ transform: 'translate(-33.3333%,0)' });
                }
            });
        });

        $(document).on('click', IPPR.dom.showInfo, function (e) {
            e.preventDefault();

            var item = $(this).closest(IPPR.dom.dataHolder).find('.collection-item.is-active');
            IPPR.displayAdditionalInfo(item, 'licence');

            $(IPPR.dom.lists.info).removeClass(IPPR.states.hidden);
            IPPR.dom.dataHolder.css({ transform: 'translate(-66.6666%,0)' });
            $(window).scrollTop(0);
        });

        IPPR.states.mobile = true;
    };

    // Desktop behaviour of the app
    IPPR.desktop = function () {

        IPPR.states.mobile = false;
        IPPR.dom.tabs.off('click.desktop');
        $(IPPR.dom.lists.extra).removeClass(IPPR.states.hidden);

        IPPR.dom.tabs.on('click.desktop', function () {

            IPPR.states.filters = false;
            IPPR.dom.filters.searchTrigger.removeClass(IPPR.states.hidden);
            IPPR.dom.filters.searchRemove.removeClass(IPPR.states.visible);
            IPPR.dom.filters.searchRemove.click();
            IPPR.filters.clear();

            IPPR.map.resetLayers();
            setTimeout(function () {
                $.each(IPPR.map.map, function (key, value) {
                    if (value) {
                        value.invalidateSize();
                    }
                });
            }, 100);
            IPPR.states.view = $(this).data('view');
            IPPR.dom.additionalInfo.addClass(IPPR.states.hidden);
        });

        $.each(IPPR.map.map, function (k, v) {
            v.dragging.enable();
        });

        IPPR.states.desktop = true;
    };

    IPPR.listDetails = function () {

        var markup = [],
            mustacheTpl = [];

        $.each(IPPR.data.tabs, function (key) {

            mustacheTpl[key] = $('#tab-' + key).find('.extra-tpl').html();

            $('#tab-' + key).on('click', '.collection-item', function () {

                if (IPPR.states.filters) {
                    IPPR.map.searchLayers(IPPR.states.view);
                }

                markup[key] = '';

                IPPR.dom.mapTrigger.removeClass(IPPR.states.active);

                $(this).parent().find('li').removeClass(IPPR.states.active);
                $(this).addClass(IPPR.states.active);

                if (IPPR.states.mobile) {
                    IPPR.dom.dataHolder.css({ transform: 'translate(-33.3333%,0)' });
                    if (IPPR.states.view === 'licenses') {
                        IPPR.dom.map.addClass(IPPR.states.hidden);
                    } else {
                        IPPR.dom.mapInline.removeClass(IPPR.states.hidden);
                    }
                    $(window).scrollTop(0);
                } else {
                    IPPR.dom.map.removeClass(IPPR.states.hidden);
                }

                var id = $(this).data('id'),
                    size = 0;

                if (IPPR.states.desktop) {
                    if (key === '1') {
                        IPPR.map.highlightLayer('2', id);
                    } else {
                        IPPR.map.highlightLayer(key, id);
                    }
                } else {
                    IPPR.map.highlightLayer(key, id);
                }

                if (!$(this).closest(IPPR.dom.lists.extra).size()) {

                    if (IPPR.states.desktop) {

                        if (IPPR.states.view === 'licenses') {
                            IPPR.displayAdditionalInfo($(this), 'licence');
                        } else {
                            IPPR.displayAdditionalInfo($(this), 'company');
                        }
                    } else {
                        $(this).closest(IPPR.dom.lists.holder).addClass(IPPR.states.hidden);
                        if (IPPR.states.view !== 'licenses') {
                            IPPR.displayAdditionalInfo($(this), 'company');
                        }
                    }

                    var companies = [];

                    $.each(IPPR.data.data[key][id], function (k, company) {

                        if (IPPR.states.view === 'companies') {
                            companies.push(company);
                        } else {

                            Mustache.parse(mustacheTpl[key]);

                            markup[key] += Mustache.render(mustacheTpl[key], {
                                active: key <= 2 ? true : false,
                                companyInfo: company
                            });
                        }

                        size++;
                    });

                    if (IPPR.states.view === 'companies') {
                        size = 0;
                        $.each(IPPR.helpers.groupBy(companies, 'license_number'), function (k, value) {

                            var concessions = [];

                            $.each(value, function (k, v) {
                                concessions.push(v.concession_number);
                            });

                            Mustache.parse(mustacheTpl[key]);

                            markup[key] += Mustache.render(mustacheTpl[key], {
                                title: k,
                                id: k,
                                concessionNumbers: concessions ? concessions : false
                            });

                            size++;
                        });

                        if (IPPR.states.mobile) {
                            $.each(IPPR.map.markers[key], function (index, val) {
                                val.off('click');
                            });

                            $.each(IPPR.map.layers[key], function (index, val) {
                                val.off('click');
                            });

                            $.each(IPPR.map.map, function (k, v) {
                                v.dragging.disable();
                            });
                        }
                    }

                    $('#tab-' + key).find(IPPR.dom.lists.extra).removeClass(IPPR.states.hidden);
                    $('#tab-' + key).find(IPPR.dom.lists.extra).find(IPPR.dom.lists.list).html(markup[key]);
                    $('#tab-' + key).find(IPPR.dom.lists.extra).find(IPPR.dom.lists.count).html('(' + size + ')');

                    $('#tab-' + key).find(IPPR.dom.lists.headerActive).removeClass(IPPR.states.hidden);
                    $('#tab-' + key).find(IPPR.dom.lists.headerInActive).addClass(IPPR.states.hidden);

                    IPPR.map.map[key].invalidateSize();

                    $('.collapsible').collapsible({
                        accordion: true
                    });
                }
            });
        });
    };

    IPPR.filtering = function () {

        $.each(IPPR.data.tabs, function (key) {
            IPPR.filters.list.push(new List('tab-' + key, IPPR.filters.options)); // jshint ignore:line

            $('#tab-' + key).find(IPPR.dom.filters.item).on('click', function () {

                IPPR.states.filters = true;

                if ($(this).is('.' + IPPR.states.active)) {
                    IPPR.filters.list[key].filter();
                    $(this).closest(IPPR.dom.filters.main).find('.chip').removeClass(IPPR.states.active);
                    if (IPPR.states.mobile) {
                        IPPR.filters.clear();
                        IPPR.map.resetLayers();
                    }
                } else {

                    var value = $(this).data('filter');

                    $(this).closest(IPPR.dom.filters.main).find('.chip').removeClass(IPPR.states.active);
                    $(this).addClass(IPPR.states.active);

                    if (IPPR.states.mobile) {
                        IPPR.dom.filters.search.addClass(IPPR.states.hidden);
                        var clone = $(this).clone();
                        IPPR.dom.filters.activeHolder.html(clone);
                    }

                    IPPR.filters.list[key].filter(function (item) {
                        if (item.values()[value]) {
                            return true;
                        }
                        return false;
                    });

                    IPPR.map.searchLayers(IPPR.states.view);
                }
            });
        });

        $.each(IPPR.filters.list, function (index, val) {
            val.on('updated', function () {
                IPPR.map.searchLayers(IPPR.states.view);
            });
        });

        $('.' + IPPR.filters.options.searchClass).on('keyup', function () {
            if ($(this).val()) {
                IPPR.states.filters = true;
                IPPR.dom.filters.searchTrigger.addClass(IPPR.states.hidden);
                IPPR.dom.filters.searchRemove.addClass(IPPR.states.visible);
            } else {
                IPPR.states.filters = false;
                IPPR.dom.filters.searchTrigger.removeClass(IPPR.states.hidden);
                IPPR.dom.filters.searchRemove.removeClass(IPPR.states.visible);
            }
        });

        IPPR.dom.filters.searchRemove.on('click', function () {
            IPPR.map.resetLayers();
            $('.' + IPPR.filters.options.searchClass).val('').trigger('keyup').blur();
            $.each(IPPR.filters.list, function (k) {
                IPPR.filters.list[k].search();
            });
            IPPR.states.filters = false;
            IPPR.dom.filters.searchTrigger.removeClass(IPPR.states.hidden);
            IPPR.dom.filters.searchRemove.removeClass(IPPR.states.visible);
            $(IPPR.dom.lists.main + ':visible').find('.collection-item').removeClass(IPPR.states.active);
        });

        if (IPPR.states.mobile) {
            IPPR.dom.filters.activeHolder.on('click', '.chip', function () {
                IPPR.filters.clear();
                IPPR.map.resetLayers();
            });
        }
    };

    IPPR.mapTrigger = function () {

        IPPR.dom.mapTrigger.on('click', function (e) {
            e.preventDefault();

            if (IPPR.states.mobile) {
                $(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).toggleClass(IPPR.states.hidden);
            }

            IPPR.dom.map.toggleClass(IPPR.states.visible);

            $.each(IPPR.map.map, function (key, value) {
                if (value) {
                    value.invalidateSize();
                    value.dragging.enable();
                }
            });

            if ($(IPPR.dom.lists.main).find(IPPR.dom.lists.holder).is('.' + IPPR.states.hidden) || IPPR.dom.dataHolder.is('.' + IPPR.states.hidden)) {
                IPPR.states.map = true;
                $(this).find('.material-icons').html('view_list');
            } else {
                $(this).find('.material-icons').html('map');
            }
        });
    };

    IPPR.initApp = function () {
        if (U.vw() < 993) {
            if (!IPPR.states.mobile) {
                IPPR.mobile();
            }
        } else {
            if (!IPPR.states.desktop) {
                IPPR.desktop();
            }
        }

        IPPR.listDetails();
    };

    IPPR.sankey = function (sankeyData, sankeyElem) {

        var _self = {
            draw: function draw() {

                var data = new google.visualization.DataTable();

                data.addColumn('string', 'From');
                data.addColumn('string', 'To');
                data.addColumn('number', '');
                data.addColumn({ type: 'string', role: 'tooltip' });
                data.addRows(sankeyData);

                var colors = ['#7E9669', '#256A9A'];

                // Sets chart options.
                var options = {
                    width: '100%',
                    height: 400,
                    sankey: {
                        node: {
                            colors: colors,
                            width: 5,
                            nodePadding: 150
                        },
                        link: {
                            colorMode: 'gradient',
                            colors: colors
                        }
                    }
                };

                // Instantiates and draws our chart, passing in some options.
                var chart = new google.visualization.Sankey(document.querySelector(sankeyElem));

                chart.draw(data, options);
            }
        };

        _self.draw();

        // google.charts.setOnLoadCallback(_self.draw);

        U.addEvent(window, 'resize', U.debounce(function () {
            _self.draw();
        }, 200));
    };

    if ($('body').is('.App')) {

        IPPR.getData();
        IPPR.initMap();
        IPPR.initApp();
        IPPR.mapTrigger();
        U.addEvent(window, 'resize', U.debounce(function () {
            IPPR.initApp();
        }, 200));

        if (window.location.hash) {
            $('.Header-tabs a[href="/' + window.location.hash + '"]').click();
        }
    }

    $('.js-dropdown-trigger').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'right' // Displays dropdown with edge aligned to the left of button
    });
})(window.burza.utils, jQuery);
//# sourceMappingURL=main.plain.js.map