var x2lib = x2lib || (function () {
    var args = {};
    return {
      init: function(Args) {
        // companyId, formId, elementId, gtagId
        args = Args;
        var parts = location.search.substring(1).split('&');
        var params = {};
        var a = document.createElement('a');
        a.href = document.referrer;
        if (location.search) {
          for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            params[nv[0]] = nv[1] || true;
          }
        }
        if (typeof params === 'undefined') {
          params = {};
        }
        var companyId = args[0];
        var formId = args[1];
        var queryString = '';
        if (formId !== 'selection') {
          queryString += '&formId=' + formId;
        }
        var section = 'start';
        if (params['gtagId']) {
          queryString += '&gtagId=' + params['gtagId'];
        }
        if (localStorage.getItem('clientId')) {
          if (localStorage.getItem('clientId') === 'reset') {
          } else {
            queryString += '&clientId=' + localStorage.getItem('clientId');
          }
        }
        if (localStorage.getItem('section')) {
          section = localStorage.getItem('section');
        }
        if (localStorage.getItem('questionnum')) {
          queryString += '&questionnum=' + localStorage.getItem('questionnum');
        }
        if (document) {
          if (document.documentElement) {
            document.documentElement.style.maxHeight = '1000px';
            document.documentElement.style.overflowY = 'hidden!important';
          }
          if (document.body && document.body.style) {
            document.body.style.maxHeight = '1000px';
          }
        }
        var baseUrl = 'insurance.xilo.io/form';
        var iframeUrl = args[1] === 'selection' ? ('https://' + baseUrl + '/list-all-forms') : ('https://' + baseUrl);
        if (args[3]) {
          var div = document.getElementById(args[3]);
          iframeUrl += ('?companyId=' + companyId + queryString);
          div.innerHTML += ('<iframe id="ifram" seamless src="' + iframeUrl + '" frameborder="0" style="position: relative; top: 0;left:0;bottom:0;right:0;width: 100%; height: 100%!important;z-index: 2000;"></iframe>');
        } else {
            iframeUrl += ('?companyId=' + companyId + queryString);
            document.body.innerHTML += ('<div id="iframContainer" style="position: absolute; top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow: hidden;background-color: white;z-index: 1000;">' +
                '<iframe id="ifram" seamless src="' + iframeUrl + '" frameborder="0" style="position: relative; top: 0;left:0;bottom:0;right:0;width: 100%; height: 100%!important;z-index: 2000;"></iframe>' +
                '</div>');
        }
        
        window.addEventListener('message', firePostMessage);
  
        function addParameter(event) {
          if ((event.origin === ('https://' + baseUrl)) && event.data.includes('param')) {
            var param = event.data.split('.');
            var id = param[1];
            var value = param[2];
            localStorage.setItem(id, value);
          }
        }
        function firePostMessage(event) {
          if (event.data === 'scrollTo') {
            scrollTop(event);
          } else if (event.data === 'newLead') {
            fireConversion(event);
          } else if (typeof event.data == 'string' && event.data.includes('param.')) {
            addParameter(event);
          }
        }
        function gtag_report_conversion(awId, id, url) { var callback = function () { if (typeof (url) !== 'undefined') { window.location = url; } }; gtag('event', 'conversion', { send_to: (awId + '/' + id), event_callback: callback }); return false; }
        function fireConversion(event) { if (args[4] && args[4][0] && args[4][1]) { if ((event.origin === ('https://' + baseUrl)) && event.data === 'newLead') { gtag_report_conversion(args[4][0], args[4][0]); } } }
        function scrollTop(event) { if ((event.origin === ('https://' + baseUrl)) && event.data === 'scrollTo') { window.scrollTo(0,0) } };
      }
    };
  }());