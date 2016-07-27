<?php
    $URL = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Transparent Oil Namibia</title>
    <meta name="description" content="CHANGEME">

    <script>
        (function () {

            document.documentElement.className = document.documentElement.className.replace(/(^|\\b)no\-js(\\b|$)/gi, 'has-js');

            svgSupported = (function () {
                var div = document.createElement('div');
                    div.innerHTML = '<svg/>';
                return (typeof SVGRect != 'undefined' && div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
            }());

            if (svgSupported) {
                document.documentElement.className += ' has-svg';
            } else {
                document.documentElement.className += ' no-svg';
            }

            var isMobile = window.matchMedia && window.matchMedia('only screen and (max-width: 767px)').matches;

            if (isMobile) {
                document.documentElement.className += ' is-mobile';
            }

            var canvasSupported = (function () {
                var canvas = document.createElement('canvas');
                return !!(canvas.getContext && canvas.getContext('2d')) && canvas.toDataURL('image/png').indexOf('data:image/png') === 0;
            }());

            if (canvasSupported) {
                document.documentElement.className += ' has-canvas';
            } else {
                document.documentElement.className += ' no-canvas';
            }

        }());
    </script>

    <meta property="og:site_name" content="Transparent Oil Namibia" />
    <meta property="og:title" content="Transparent Oil Namibia" />
    <meta property="og:description" content="CHANGEME" />
    <meta property="og:url" content="<?php echo $URL ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="" />

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="dns-prefetch" href="//gstatic.com">
    <link rel="dns-prefetch" href="//code.jquery.com">
    <link rel="dns-prefetch" href="//www.googletagmanager.com">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">

    <link rel="stylesheet" href="https://npmcdn.com/leaflet@0.7.7/dist/leaflet.css" />
    <link rel="stylesheet" href="http://libs.cartocdn.com/cartodb.js/v3/3.15/themes/css/cartodb.css" />

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <!-- build:css /css/min.css -->
    <link rel="stylesheet" href="/css/global.css" />
    <!-- endbuild -->

</head>
<body>

    <header class="Header center-align">
        <div class="Header-inner">

            <div class="row">
                <div class="col s12">
                    <h1 class="Header-title">
                        <span class="Header-title--secondary">Transparent Oil</span>
                        <span class="Header-title--primary">Namibia</span>
                    </h1>
                </div>
                <div class="col s12 m6 offset-m3">
                    <p class="light Header-description">The Transparent Oil Namibia platform maps the details, trends and connections in the allocation of Petroleum Exploration Licences in Namibia.</p>
                </div>
            </div>

            <ul class="Header-navigation">
                <li><a href="about.php">About</a></li>
                <li><a href="help.php">Help</a></li>
            </ul>


            <ul class="tabs Header-tabs">
                <li class="tab col">
                    <a href="#tab-0" class="brand blue" data-view="licenses">
                        <span>Browse by licence</span>
                        <i class="material-icons">keyboard_arrow_right</i>
                    </a>
                </li>
                <li class="tab col">
                    <a href="#tab-1" class="brand green" data-view="companies">
                        <span>Browse by company</span>
                        <i class="material-icons">keyboard_arrow_right</i>
                    </a>
                </li>
            </ul>

        </div>
    </header>



    <div class="Content" id="data">

        <div id="tab-0" class="col s12">


            <div class="Search z-depth-1 hide-on-med-and-down brand blue">

                <div class="input-field Search-field">
                    <i class="material-icons small prefix Search-trigger">search</i>
                    <i class="material-icons small prefix Search-remove">close</i>
                    <input id="search-tab-1" type="text" class="Search-input" />
                    <label for="search-tab-1">Filter by licence</label>
                </div>

                <div class="Filters">
                    <ul class="Filters-list">
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter" data-filter="expiration">Soon to expire</span>
                        </li>
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter">Without ownership</span>
                        </li>
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter">Recently changed ownership</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div class="Data is-loading">

                <div class="Data-holder">

                    <div class="List List--main z-depth-1" data-level="0">
                        <div class="List-header brand blue">
                            <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                            <span>Licenses (<span class="List-count"></span>)</span>
                        </div>


                        <div class="Search Search--mobile hide-on-large-only brand blue">

                            <div class="Filters Filters--mobile">
                                <i class="material-icons small Filters-trigger js-dropdown-trigger" data-beloworigin="true" data-activates='filters1'>filter_list</i>
                                <ul class="Filters-list z-depth-1" id="filters1">
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="expiration">Soon to expire <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="ownership">Without ownership <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="changedOwnership">Recently changed ownership <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                </ul>
                            </div>

                            <div class="Filters-active"></div>

                            <div class="input-field Search-field">
                                <i class="material-icons small prefix Search-trigger">search</i>
                                <i class="material-icons small prefix Search-remove">close</i>
                                <input id="search-tab-1" type="text" class="Search-input" />
                                <label for="search-tab-1">Filter by licence</label>
                            </div>

                        </div>

                        <div class="List-holder is-filterable">
                            <ul class="collection">
                            </ul>
                        </div>

                    </div>

                    <div class="List List--extra z-depth-1 u-isHidden" data-level="1">
                        <div class="List-header brand green">
                            <div class="List-headerActive">
                                <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                                <span>Companies in ownership (<span class="List-count"></span>)</span>
                            </div>
                        </div>

                        <a class="List-infoLink orange js-showAdditionalInfo hide-on-large-only"><i class="material-icons right">arrow_right</i>Transaction history</a>


                        <div class="List-holder">
                            <p class="List-headerInactive">
                                Select a license on the left to see ownership information
                            </p>
                            <ul class="collection collapsible" data-collapsible="accordion">
                            </ul>
                        </div>
                    </div>

                    <div class="List List--info z-depth-1 hide-on-large-only" data-level="2">
                        <div class="List-header brand green">
                            <div class="List-headerActive">
                                <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                                <span>Transaction history for <span class="List-infoName"></span></span>
                            </div>
                        </div>

                        <div class="List-holder">
                            <div class="Sankey">
                                <div class="Sankey-mobile"></div>
                            </div>
                            <div class="Table row"></div>
                        </div>
                    </div>

                </div>

                <div class="Map Map--0 licenses"></div>

                <div class="Loader">
                    <div class="Loader-holder">
                        <div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div>
                    </div>
                </div>

            </div>

            <script type="x-tmpl-mustache" class="main-tpl">
                <li class="collection-item" data-id="{{ id }}" data-sankey="{{ sankey }}" data-table="{{ table }}">
                    <p class="List-title">{{ title }}</p>
                    {{#concessionNumbers}}
                        <span class="List-number brand blue">{{.}}</span>
                    {{/concessionNumbers}}
                    <span class="u-isHidden concessionNumbers">
                        {{#concessionNumbers}}
                            {{.}}
                        {{/concessionNumbers}}
                    </span>
                </li>
            </script>

            <script type="x-tmpl-mustache" class="extra-tpl">
                <li{{#active}} class="active"{{/active}}>
                    <div class="collapsible-header{{#active}} active{{/active}}">
                        <div class="List-title">{{ title }}</div>
                        <i class="material-icons">keyboard_arrow_down</i>
                    </div>
                    <div class="collapsible-body"{{#active}} style="display: block;"{{/active}}>
                        <ul>
                            <li>
                                {{#address}}<p><strong>Address:</strong> {{address}}</p>{{/address}}
                                {{#jurisdiction}}<p><strong>Jurisdiction:</strong> {{jurisdiction}}</p>{{/jurisdiction}}
                                {{#headquarters}}<p><strong>Headquarters:</strong> {{headquarters}}</p>{{/headquarters}}
                                {{#formed}}<p><strong>Formed on:</strong> {{formed}}</p>{{/formed}}
                                {{#website}}<p><strong>Website:</strong> <a href="{{website}}">{{website}}</a></p>{{/website}}
                            </li>
                        </ul>
                        <p class="List-companyInfo" data-id="{{ title }}"><i class="material-icons">info</i></p>
                    </div>
                </li>
            </script>

        </div>

        <div id="tab-1" class="col s12">

            <div class="Search z-depth-1 hide-on-med-and-down brand green">

                <div class="input-field Search-field">
                    <i class="material-icons small prefix Search-trigger">search</i>
                    <i class="material-icons small prefix Search-remove">close</i>
                    <input id="search-tab-2" type="text" class="Search-input" />
                    <label for="search-tab-2">Filter by Company name</label>
                </div>

                <div class="Filters">
                    <ul class="Filters-list">
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter" data-filter="expiration">Soon to expire</span>
                        </li>
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter">Without ownership</span>
                        </li>
                        <li class="Filters-item">
                            <span class="chip Filters-itemFilter">Recently changed ownership</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div class="Data is-loading">

                <div class="Data-holder">

                    <div class="List List--main z-depth-1" data-level="0">
                        <div class="List-header brand green">
                            <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                            <span>Companies (<span class="List-count"></span>)</span>
                        </div>


                        <div class="Search Search--mobile hide-on-large-only brand green">

                            <div class="Filters Filters--mobile">
                                <i class="material-icons small Filters-trigger js-dropdown-trigger" data-beloworigin="true" data-activates='filters2'>filter_list</i>
                                <ul class="Filters-list z-depth-1" id="filters2">
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="expiration">Soon to expire <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="ownership">Without ownership <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                    <li class="Filters-item">
                                        <span class="chip Filters-itemFilter" data-filter="changedOwnership">Recently changed ownership <i class="material-icons Filters-remove">close</i></span>
                                    </li>
                                </ul>
                            </div>

                            <div class="Filters-active"></div>

                            <div class="input-field Search-field">
                                <i class="material-icons small prefix Search-trigger">search</i>
                                <i class="material-icons small prefix Search-remove">close</i>
                                <input id="search-tab-1" type="text" class="Search-input" />
                                <label for="search-tab-1">Filter by Company name</label>
                            </div>

                        </div>

                        <div class="List-holder">
                            <ul class="collection">
                            </ul>
                        </div>

                    </div>

                    <div class="List List--extra z-depth-1 u-isHidden" data-level="1">
                        <div class="List-header brand blue">
                            <div class="List-headerActive">
                                <span class="hide-on-large-only List-back"><i class="material-icons">keyboard_arrow_left</i></span>
                                <span>Licenses in ownership (<span class="List-count"></span>)</span>
                            </div>
                        </div>

                        <div class="List-holder is-filterable">
                            <p class="List-headerInactive">
                                Select a company on the left to see licenses information
                            </p>
                            <ul class="collection collapsible" data-collapsible="accordion">
                            </ul>
                            <div class="Map Map--1 Map--inline companies hide-on-large-only"></div>
                            <div class="Table row"></div>
                            <div class="OwnedLicenses row"></div>
                            <div class="Hierarchy row"></div>
                        </div>
                    </div>

                </div>

                <div class="Map Map--1 companies"></div>


                <div class="Loader">
                    <div class="Loader-holder">
                        <div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div>
                    </div>
                </div>

            </div>


            <script type="x-tmpl-mustache" class="main-tpl">
                <li class="collection-item" data-id="{{ id }}" data-table="{{table}}" data-hierarchy="{{ hierarchy }}" data-ownedLicenses="{{ ownedLicenses }}">
                    <p class="List-title">{{ title }}</p>
                </li>
            </script>

            <script type="x-tmpl-mustache" class="extra-tpl">
                <li class="collection-item" data-id="{{ id }}">
                    <p class="List-title List-title--full">{{ title }}</p>
                    {{#concessionNumbers}}
                        <span class="List-number brand blue">{{.}}</span>
                    {{/concessionNumbers}}
                    <span class="u-isHidden concessionNumbers">
                        {{#concessionNumbers}}
                            {{.}}
                        {{/concessionNumbers}}
                    </span>
                </li>
            </script>


        </div>

        <div class="AdditionalInfo u-isHidden">

            <div class="AdditionalInfo-header brand blue u-cf">

                <h2 class="AdditionalInfo-title">Transaction history for Licence number <span></span></h2>

                <a class="waves-effect waves-light btn orange AdditionalInfo-download"><i class="material-icons right">file_download</i>Download data</a>

            </div>

            <div class="row AdditionalInfo-data">

                <div class="col s12">
                    <div class="Sankey Sankey-desktop"></div>
                </div>

                <div class="col s12">
                    <div class="Table"></div>
                </div>

                <div class="col s12">
                    <div class="OwnedLicenses row"></div>
                </div>

                <div class="col s12">
                    <div class="Hierarchy row"></div>
                </div>
            </div>

        </div>

    </div>

    <a class="Map-trigger btn-floating btn-large waves-effect waves-light red"><i class="material-icons">map</i></a>


    <footer>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </footer>

    <script type="x-tmpl-mustache" class="licenceTable-tpl">
        <div class="col s12">
            <table class="bordered striped highlight responsive-table">
                <thead>
                    <tr>
                        <th data-field="licenceNumber">Licence Number</th>
                        <th data-field="transferDate">Transfer Date</th>
                        <th data-field="transferType">Transfer Type</th>
                        <th data-field="licenceSeller">Licence Seller</th>
                        <th data-field="sellerStakePrior">Seller Stake Prior</th>
                        <th data-field="licenceBuyer">Licence Buyer</th>
                        <th data-field="buyerStakeAfter">Buyer Stake After</th>
                        <th data-field="operatorPrior">Operator Prior</th>
                        <th data-field="operatorAfter">Operator After</th>
                    </tr>
                </thead>

                <tbody>
                    {{#tableRows}}
                        <tr>
                            <td>{{licenceNumber}}</td>
                            <td>{{transferDate}}</td>
                            <td>{{transferType}}</td>
                            <td>{{licenceSeller}}</td>
                            <td>{{sellerStakePrior}}</td>
                            <td>{{licenceBuyer}}</td>
                            <td>{{buyerStakeAfter}}</td>
                            <td>{{operatorPrior}}</td>
                            <td>{{operatorAfter}}</td>
                        </tr>
                    {{/tableRows}}
                </tbody>
            </table>
        </div>
    </script>

    <script type="x-tmpl-mustache" class="companyTable-tpl">
        <div class="col s12">
            <p class="Table-title">Company information</p>
            <table class="bordered striped highlight responsive-table">
                <thead>
                    <tr>
                        <th data-field="name">Name</th>
                        <th data-field="jurisdiction">Jurisdiction</th>
                        <th data-field="registration">Registration</th>
                        <th data-field="headquarters">Headquarters</th>
                        <th data-field="dateOfFormation">Date Of Formation</th>
                        <th data-field="companyInfo">Company Info</th>
                    </tr>
                </thead>

                <tbody>
                    {{#tableRows}}
                        <tr>
                            <td>{{company_name}}</td>
                            <td>{{company_jurisdiction}}</td>
                            <td>{{company_registration}}</td>
                            <td>{{company_hq}}</td>
                            <td>{{company_formed}}</td>
                            <td>{{company_address}}</td>
                        </tr>
                    {{/tableRows}}
                </tbody>
            </table>
        </div>
    </script>

    <script type="x-tmpl-mustache" class="ownedLicenses-tpl">

        <div class="col s12"><p class="OwnedLicenses-title">Company owned licenses</p></div>
        {{#licence}}
            <div class="col s6 m4 l2">
                <div class="Block">
                    <p class="Block-title">{{name}} - {{percent}}</p>
                    {{#numbers}}<span>{{.}}</span>{{/numbers}}
                </div>
            </div>
        {{/licence}}

    </script>

    <script type="x-tmpl-mustache" class="hierarchy-tpl">
        <div class="col s12"><p class="Hierarchy-title">Company hierarchy</p></div>
        {{#hierarchy}}
            <div class="col s6 m4 l2">
                <div class="Block">
                    <p class="Block-title">{{person_name}}</p>
                    {{#person_nationality}}<p>Nationality: {{person_nationality}}</p>{{/person_nationality}}
                    {{#start_date}}<p>Start date: {{start_date}}</p>{{/start_date}}
                    {{#role_title}}<p>Role: {{role_title}}</p>{{/role_title}}
                    {{#percent_interest}}<p class="Block-title">{{percent_interest}}%</p>{{/percent_interest}}
                </div>
            </div>
        {{/hierarchy}}

    </script>

    <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.2.0/list.min.js"></script>


    <script src="http://libs.cartocdn.com/cartodb.js/v3/3.15/cartodb.js"></script>
    <script src="https://npmcdn.com/leaflet@0.7.7/dist/leaflet.js"></script>

    <!-- build:js /js/min.js -->
    <script src="/js/vendor/burza/utils.js"></script>
    <script src="/js/vendor/materialize.js"></script>
    <script src="/js/main.js"></script>
    <!-- endbuild -->



    <script>
        (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
        function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
        ga('create','UA-XXXXX-X','auto');ga('send','pageview');
    </script>
</body>
</html>
