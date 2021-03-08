var x1lib = x1lib || (function () {
  var args = {};
  return {
    init: function(Args) {
      // companyId, formType, formId, formTitle, elementId
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
      var formType = args[1];
      var formId = args[2];
      var queryString = '';
      if (formId) {
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
        section = ('page/' + localStorage.getItem('section'));
      }
      if (localStorage.getItem('question')) {
        queryString += '&question=' + localStorage.getItem('question');
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
      var baseUrl = 'app.xilo.io';
      var iframeUrl = formType === 'selection' ? ('https://' + baseUrl + '/client-app') : ('https://' + baseUrl + '/client-app/' + formType + '/');
      if (args[4]) {
        var div = document.getElementById(args[4]);
        if (isMobile() || isIE()) {
            iframeUrl += (((formType !== 'selection' && formType !== 'simple') ? 'mobile' : '') + ('?companyId=' + companyId + queryString));
            div.innerHTML += ('<iframe id="ifram" seamless src="' + iframeUrl + '" frameborder="0" style="position: relative; top: 0;left:0;bottom:0;right:0;width: 100%; height: 100%!important;z-index: 2000;"></iframe>');
        } else {
            iframeUrl += (((formType !== 'selection' && formType !== 'simple') ? section : '') + ('?companyId=' + companyId + queryString));
            div.innerHTML += ('<iframe id="ifram" seamless src="' + iframeUrl + '" frameborder="0" style="position: relative; top: 0;left:0;bottom:0;right:0;width: 100%; height: 100%!important;z-index: 2000;"></iframe>');
        }          
      } else {
        if (isMobile() || isIE()) {
            iframeUrl += (((formType !== 'selection' && formType !== 'simple') ? 'mobile' : '') + ('?companyId=' + companyId + queryString));
            document.body.innerHTML += ('<div id="iframContainer" style="position: absolute; top:0;left:0;right:0;bottom:0;height:3000px;width:100%;overflow: hidden;background-color: white;z-index: 1000;">' +
                            '<iframe id="ifram" seamless src="' + iframeUrl + '" frameborder="0" style="position: relative; top: 0;left:0;bottom:0;right:0;width: 100%; height: 100%!important;z-index: 2000;"></iframe>' +
                            '</div>');
        } else {
            iframeUrl += (((formType !== 'selection' && formType !== 'simple') ? section : '') + ('?companyId=' + companyId + queryString));
            document.body.innerHTML += ('<div id="iframContainer" style="position: absolute; top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow: hidden;background-color: white;z-index: 1000;">' +
                              '<iframe id="ifram" seamless src="' + iframeUrl + '" frameborder="0" style="position: relative; top: 0;left:0;bottom:0;right:0;width: 100%; height: 100%!important;z-index: 2000;"></iframe>' +
                              '</div>');
        }
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

      function isMobile() {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; }(navigator.userAgent || navigator.vendor || window.opera));
        return check;
      }
      function isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0 || window.document.documentMode) {
            return true;
        } else {
          return false;
        }
    
      }
    }
  };
}());