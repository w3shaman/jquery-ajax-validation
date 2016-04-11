/**
 * jQuery Plugin for adding server validation feature to Ajax Form plugin
 * @requires jQuery 1.4 or later and jQuery Form Plugin (http://malsup.com/jquery/form/)
 *
 * Copyright (c) 2016 Lucky <bogeyman2007@gmail.com>
 * Licensed under the GPL license:
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {
  function ajaxvalidation(options, element) {
    var _options=options;
    var _form=element;
    var _timer;

    function relocateLoader(divId) {
      $("#" + divId).css({
        "display":"block",
        "position":"absolute",
        "top":$(document).scrollTop() + "px",
        "left":(($(window).width()- $("#" + divId).width())/2)+$(document).scrollLeft() + "px",
        "opacity":0.8
      });
    }

    function showLoader(divId, loadingMessage) {
      $("#" + divId).html(loadingMessage);

      relocateLoader(divId);

      $(window).scroll(function() {
        relocateLoader(divId);
      });
    }

    function hideLoader(divId) {
      $("#" + divId).hide();

      $(window).scroll(function() {
        $("#" + divId).hide();
      });
    }

    function showMessage(div, message) {
      $("#" + div).html(message);

      $("#" + div).fadeIn("fast", function () {
        hideMessage(div);
      });
    }

    function hideMessage(div) {
      clearTimeout(_timer);
      _timer=setTimeout('$("#' + div + '").fadeOut("fast")',_options.messageTimeout);
    }

    this.init = function() {
      if (_options.waitingDivId != null && _options.waitingDivId != "") {
        $("body").append('<div id="' + _options.waitingDivId + '"></div>');
        hideLoader(_options.waitingDivId);
      }

      _form.submit(function() {
        showLoader(_options.waitingDivId, _options.loadingMessage);
      });

      _form.ajaxForm({
        success: function(data) {
          hideLoader(_options.waitingDivId);

          try {
            var arr=null;
            if (typeof data == 'string')
              arr=$.parseJSON(data);
            else if (typeof data == 'object')
              arr=data;

            if (arr != null) {
              if (arr.clear_form==true) {
                _form.clear_form();
              }

              var upload = $("input:file");
              if (typeof upload.MultiFile === "function") {
                if (upload.length > 0) {
                  upload.MultiFile('reset');
                }
              }

              $(".error-field-char").remove();
              $("input, select, textarea").removeClass('error-field-background');
              if (arr.errorFields != null) {
                for (var i in arr.errorFields) {
                  errorMessage = _options.errorChar.replace("[field-message]", arr.errorFields[i]);

                  $("input[" + _options.selector + "='" + i + "'], select[" + _options.selector + "='" + i + "'], textarea[" + _options.selector + "='" + i + "']").after('<span class="error-field-char">' + errorMessage + '</span>');
                  $("input[" + _options.selector + "='" + i + "'], select[" + _options.selector + "='" + i + "'], textarea[" + _options.selector + "='" + i + "']").addClass('error-field-background');
                }
              }

              showMessage(_options.messageDivId, '<div class="' + arr.status + '">' + arr.message + '</div>');

              if (_options.onComplete != null) {
                _options.onComplete.call(this, arr);
              }
            }
          }
          catch(e) {
            showMessage(_options.messageDivId, '<div class="failed">Oops... An error has occured!!</div>');

            if (_options.onComplete != null) {
              _options.onComplete.call(arr);
            }
          }
        },
        error: function(xhr, status, ex) {
          var upload = $("input:file");
          if (typeof upload.MultiFile === "function") {
            if (upload.length > 0) {
              upload.MultiFile('reset');
            }
          }

          hideLoader(_options.waitingDivId);

          showMessage(_options.messageDivId, '<div class="failed">Oops... An error has occured!</div>');

          if(_options.onError != null) {
            _options.onError.call(xhr);
          }
        }
      });
    }
  }

  $.fn.ajaxvalidation = function (opts) {
    var options = {
      messageDivId : "message",
      messageTimeout : 5000,
      waitingDivId : "waiting",
      loadingMessage : "Loading...",
      errorChar: "*",
      onComplete: null,
      onError: null,
      selector: "name"
    };
    $.extend(options, opts);

    return this.each(function() {
      var obj = new ajaxvalidation(options, $(this));
      obj.init();
    });
  }
})(jQuery);
